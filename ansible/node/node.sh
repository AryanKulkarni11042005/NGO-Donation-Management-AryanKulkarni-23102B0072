#!/usr/bin/env bash
# Manage the local lab target node that the Ansible playbook provisions.
#   ./node.sh up     create the node if it isn't running
#   ./node.sh down   destroy the node (all provisioned state is lost)
#   ./node.sh reset  down + up: a brand-new clean environment
#   ./node.sh ssh    open a shell on the node
set -euo pipefail

NAME=ngo-node-1
IMAGE=ngo-node:24.04
SSH_PORT=2222
HTTP_PORT=8095
KEY="$HOME/.ssh/ngo_node_ed25519"
HERE="$(cd "$(dirname "$0")" && pwd)"

up() {
    [ -f "$KEY" ] || ssh-keygen -q -t ed25519 -N "" -C "ngo-ansible" -f "$KEY"

    if docker ps --format '{{.Names}}' | grep -qx "$NAME"; then
        echo "$NAME already running"
        return
    fi

    docker build -q -t "$IMAGE" "$HERE" >/dev/null
    # systemd needs the host cgroup tree and a writable /run to act as PID 1.
    docker run -d --name "$NAME" --hostname "$NAME" \
        --privileged --cgroupns=host \
        -v /sys/fs/cgroup:/sys/fs/cgroup:rw \
        --tmpfs /run --tmpfs /run/lock \
        -p "$SSH_PORT:22" -p "$HTTP_PORT:80" \
        "$IMAGE" >/dev/null

    docker exec -i "$NAME" bash -c \
        'cat > /home/deploy/.ssh/authorized_keys && chown deploy:deploy /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys' \
        < "$KEY.pub"

    for _ in $(seq 1 30); do
        if ssh -q -i "$KEY" -p "$SSH_PORT" -o BatchMode=yes -o ConnectTimeout=2 \
               -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
               deploy@127.0.0.1 true 2>/dev/null; then
            echo "$NAME is up: ssh on 127.0.0.1:$SSH_PORT, http on 127.0.0.1:$HTTP_PORT"
            return
        fi
        sleep 1
    done
    echo "$NAME did not accept SSH in time" >&2
    exit 1
}

down() {
    docker rm -f "$NAME" >/dev/null 2>&1 || true
    echo "$NAME removed"
}

case "${1:-}" in
    up) up ;;
    down) down ;;
    reset) down; up ;;
    ssh) exec ssh -i "$KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null deploy@127.0.0.1 ;;
    *) echo "usage: $0 {up|down|reset|ssh}" >&2; exit 2 ;;
esac
