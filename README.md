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
frontend/         React + TypeScript + Vite UI
selenium-tests/   Selenium E2E suite (Java/Maven)
nginx/            Reverse proxy config
ansible/          Provisioning playbook (Oracle Cloud VM)
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
