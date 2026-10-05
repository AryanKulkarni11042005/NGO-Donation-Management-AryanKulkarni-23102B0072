# NGO Donation Management Portal

A small, monolithic donation management portal built to demonstrate a complete DevOps pipeline: Git/GitHub feature branches and PRs, Jenkins CI, Selenium testing, Docker/Docker Compose, Ansible provisioning, Nginx reverse proxy, and deployment to Oracle Cloud.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Spring Boot (Java 17), packaged as a WAR and deployed to Tomcat — see the [ngo-donation-portal-springboot](https://github.com/AryanKulkarni11042005/ngo-donation-portal-springboot) repo
- **Database**: PostgreSQL
- **Auth**: JWT
- **E2E Testing**: Selenium (Java/Maven), run from `selenium-tests/`
- **Deployment**: Docker, Docker Compose, Nginx, Ansible

## Roles

- **Admin**: manages campaigns and donations
- **Volunteer**: views campaigns and donations
- Donors do not log in — they donate via the public donation page.

## Project Structure

```
frontend/         React + TypeScript + Vite UI (+ Dockerfile)
selenium-tests/   Selenium E2E suite (Java/Maven)
nginx/            nginx.conf (bare-metal staging), nginx.docker.conf (container)
ansible/          Inventory, playbook, roles, rollback/healthcheck playbooks, lab node
docs/             Configuration spec, project context for the report, evidence logs
Jenkinsfile       CI/CD pipeline: build, test, Tomcat deploy, Selenium gate, Docker CD, Ansible
docker-compose.yml  db + backend + frontend stack (http://localhost:8091)
```

See [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) for the architecture,
the task-by-task record, troubleshooting, limitations and how to reproduce.

## Provisioning (Ansible)

```
./ansible/node/node.sh reset            # clean Ubuntu 24.04 lab node (ssh :2222, http :8095)
cd ansible
export NGO_DB_PASSWORD=... NGO_JWT_SECRET=<32+ chars> NGO_ADMIN_PASSWORD=...
ansible-playbook playbook.yml           # provision + deploy (rerun: changed=0)
ansible-playbook healthcheck.yml
ansible-playbook rollback.yml           # back to the previous release
```

The Spring Boot backend lives in a separate repo: [ngo-donation-portal-springboot](https://github.com/AryanKulkarni11042005/ngo-donation-portal-springboot).

## Local Development

### Backend
See the [ngo-donation-portal-springboot](https://github.com/AryanKulkarni11042005/ngo-donation-portal-springboot) repo.

### Frontend
```
cd frontend
npm install
npm run dev
```

## Database

PostgreSQL database `ngo-donation-portal` on port `5433`.

## Roadmap

Features are developed on individual branches and merged via Pull Request:

1. `feature/project-scaffold`
2. `feature/database`
3. `feature/auth`
4. `feature/campaigns`
5. `feature/dashboard`
6. `feature/donation-flow`
7. `feature/certificate`
8. `feature/jenkins-tomcat-pipeline`, `feature/selenium-test`
9. `feature/docker-ansible-cd`, `feature/jenkins-docker-cd`
10. `feature/ansible-provisioning`
