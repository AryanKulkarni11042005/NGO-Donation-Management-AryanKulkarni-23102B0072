# Server Configuration Specification — NGO Donation Management Portal

This is the complete list of what a target server needs to run the portal, and
where each item is enforced in the Ansible code (`ansible/`). The baseline is a
**minimal Ubuntu 24.04 host** with only SSH, `sudo` and `python3` — the state of
a freshly created cloud VM. In the lab, that baseline is the container image in
`ansible/node/Dockerfile`; on a real VM only `inventory.ini` changes.

## 1. Packages

| Package | Why | Enforced by |
|---|---|---|
| `openjdk-17-jre-headless` | Runtime for Tomcat and the Spring Boot WAR (compiled for Java 17) | `roles/common` |
| `postgresql` (16 on Ubuntu 24.04) | Application database | `roles/common`, configured in `roles/postgres` |
| `python3-psycopg2` | Lets Ansible's `community.postgresql` modules talk to PostgreSQL | `roles/common` |
| `nginx` | Public web server: serves the React build, reverse-proxies `/store/` to Tomcat | `roles/common`, configured in `roles/nginx` |
| `acl` | Lets Ansible `become` an unprivileged user (e.g. `postgres`) safely | `roles/common` |
| `curl`, `ca-certificates`, `tar` | Downloads (Tomcat tarball over HTTPS) and unpacking | `roles/common` |
| Apache Tomcat **11.0.24** (tarball, not apt) | Servlet container for `store.war`. Pinned version, SHA-512 verified, matches the Tomcat used by the Jenkins pipeline | `roles/tomcat` |

## 2. Users and groups

| Account | Type | Purpose |
|---|---|---|
| `deploy` | Login user with passwordless sudo, SSH key only (password auth disabled) | The account Ansible connects as. Part of the baseline image / cloud VM |
| `tomcat` (user + group) | System account, shell `/usr/sbin/nologin`, no home created | Runs the Tomcat service; owns releases and Tomcat's runtime dirs |
| `postgres` | Created by the `postgresql` package | Owns the database cluster |
| `www-data` | Created by the `nginx` package | Nginx worker processes |

## 3. Directories

| Path | Owner : group | Mode | Contents |
|---|---|---|---|
| `/opt/ngo` | root : root | 0755 | Application base dir; `RELEASE` file records the live release |
| `/opt/ngo/releases/<release-id>/` | tomcat : tomcat | 0755 | One directory per deployed release, holding its `store.war` (newest 3 kept) |
| `/opt/ngo/current` | symlink | — | Points at the live release directory — switching it is the deploy/rollback |
| `/opt/ngo/sql` | root : root | 0755 | `schema.sql` shipped to the node |
| `/etc/ngo` | root : tomcat | 0750 | Application configuration (secrets) |
| `/var/www/ngo-frontend` | root : root | 0755 | Built React frontend (`index.html`, `assets/`) |
| `/opt/tomcat/apache-tomcat-11.0.24` | tomcat : tomcat | — | Tomcat install |
| `/opt/tomcat/current` | symlink | — | Points at the installed Tomcat version (makes upgrades a symlink switch too) |

## 4. Files

| File | Mode | Contents |
|---|---|---|
| `/etc/ngo/ngo.env` | 0640 root:tomcat | `DB_URL`, `DB_PASSWORD`, `JWT_SECRET` read by the Spring app. Values come from the controller's environment, never from the repo |
| `/etc/systemd/system/tomcat.service` | 0644 | Runs Tomcat as `tomcat` via `catalina.sh run`, loads `ngo.env`, restarts on failure, starts after PostgreSQL |
| `/opt/tomcat/current/conf/server.xml` | (edited in place) | HTTP connector bound to `127.0.0.1:8080` |
| `/opt/tomcat/current/webapps/store.war` | symlink | → `/opt/ngo/current/store.war`, so Tomcat always serves the live release at context path `/store` |
| `/etc/nginx/sites-available/ngo.conf` (+ link in `sites-enabled`) | 0644 | Port 80 server: SPA fallback (`try_files … /index.html`), `location /store/` → `http://127.0.0.1:8080/store/` |
| `/etc/nginx/sites-enabled/default` | removed | Nginx's default welcome site is disabled |
| Tomcat `webapps/ROOT, docs, examples, manager, host-manager` | removed | Sample and admin apps are an unnecessary attack surface |
| `/opt/ngo/sql/schema.sql` | 0644 | Tables `users`, `campaigns`, `donations`, `certificates` |

## 5. Network ports

| Port | Listener | Bound to | Exposed? |
|---|---|---|---|
| 22 | sshd | 0.0.0.0 | Yes — administration / Ansible |
| 80 | nginx | 0.0.0.0 | Yes — the only application entry point |
| 8080 | Tomcat HTTP connector | 127.0.0.1 | No — reached only through nginx |
| 8005 | Tomcat shutdown port | 127.0.0.1 | No |
| 5432 | PostgreSQL | 127.0.0.1 / ::1 | No — the app connects locally |

Verified on the provisioned node with `ss -tlnp` (see `docs/evidence/ansible-03-healthcheck.log`).
In the lab the node's 22 and 80 are published on the host as **2222** and **8095**.

## 6. Services

| Service | Enabled at boot | Notes |
|---|---|---|
| `ssh` | yes (baseline) | Key-based login only |
| `postgresql` (`postgresql@16-main`) | yes | Database `ngo-donation-portal`; schema loaded once; admin user + 2 sample campaigns seeded only if `users` is empty |
| `tomcat` | yes | Custom unit; restarted only when its config, unit, Tomcat version or live release changes |
| `nginx` | yes | Config validated with `nginx -t` before every reload |

## 7. Secrets

Supplied at run time from the controller's environment (in Jenkins, from
Jenkins credentials). Nothing secret is committed.

| Variable | Used for | Jenkins credential ID |
|---|---|---|
| `NGO_DB_PASSWORD` | PostgreSQL password for the app | `db-password` |
| `NGO_JWT_SECRET` (≥ 32 chars) | Signing JWTs | `jwt-secret` |
| `NGO_ADMIN_PASSWORD` | Seeded admin account (stored only as a bcrypt hash) | `ngo-admin-password` |

## 8. Idempotency rules built into the playbook

- Packages: `apt` with `cache_valid_time` (no cache refresh every run).
- DB password: checked by trying to log in first; only set if login fails.
- Schema and seed: guarded by `to_regclass('public.campaigns')` and `count(*) FROM users`.
- Tomcat: download verified by checksum, unpack guarded by `creates:`.
- Services restart only through handlers or a real release switch.

Result: a second run with the same inputs reports **changed=0**
(`docs/evidence/ansible-02-idempotency-rerun.log`).
