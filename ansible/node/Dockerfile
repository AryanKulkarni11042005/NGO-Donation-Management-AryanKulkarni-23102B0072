# A stand-in for a freshly created cloud VM (e.g. an Oracle Cloud Ubuntu
# instance): systemd as PID 1, an SSH server, a sudo-capable deploy user and
# python3 for Ansible -- and nothing else. Everything the portal needs is
# installed later by the Ansible playbook, never baked in here.
FROM ubuntu:24.04

ENV container=docker \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        systemd systemd-sysv openssh-server sudo python3 ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Units that only make sense on real hardware or a console would fail noisily.
RUN systemctl mask \
        systemd-logind.service getty.target console-getty.service \
        systemd-udevd.service systemd-udev-trigger.service \
        systemd-remount-fs.service sys-kernel-debug.mount \
    && systemctl enable ssh.service

RUN useradd --create-home --shell /bin/bash deploy \
    && echo 'deploy ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/deploy \
    && chmod 0440 /etc/sudoers.d/deploy \
    && install -d -m 0700 -o deploy -g deploy /home/deploy/.ssh \
    && sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config

STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
