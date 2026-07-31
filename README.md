# NGO Donation Management Portal

A small, monolithic donation management portal built to demonstrate a complete DevOps pipeline: Git/GitHub feature branches and PRs, Jenkins CI, Selenium testing, Docker/Docker Compose, Ansible provisioning, Nginx reverse proxy, and deployment to Oracle Cloud.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL
- **Auth**: JWT
- **PDF**: PDFKit
- **Deployment**: Docker, Docker Compose, Nginx, Ansible

## Roles

- **Admin**: manages campaigns and donations
- **Volunteer**: views campaigns and donations
- Donors do not log in — they donate via the public donation page.

## Project Structure

```
backend/    Express + TypeScript API
frontend/   React + TypeScript + Vite UI
nginx/      Reverse proxy config
ansible/    Provisioning playbook (Oracle Cloud VM)
```

## Local Development

### Backend
```
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Database

PostgreSQL database `ngo-donation-portal` on port `5433`. Schema in `backend/src/db/schema.sql`.

## Roadmap

Features are developed on individual branches and merged via Pull Request:

1. `feature/project-scaffold`
2. `feature/database`
3. `feature/auth`
4. `feature/campaigns`
5. `feature/dashboard`
6. `feature/donation-flow`
7. `feature/certificate`
8. `feature/docker`
9. `release/v1.0`

CI/CD (Jenkins, Selenium), containerization (Docker), and provisioning (Ansible) are added in later phases per the project schedule.
