# Med Revue Hub

A modern web platform to support Med Revue – an annual theater show put together by medical students, with all proceeds going to charity.

## 🎭 Overview

Med Revue Hub is designed to:

- 📅 Promote upcoming show details and events
- 🖼️ Display galleries from past performances
- 💖 Highlight the supported charity
- 🎉 Showcase sponsors and supporters

## 🔧 Get Started

### Prerequisites

Make sure these are installed on your machine:

- Node.js (LTS recommended, 20+)
- npm (comes with Node.js)

### Clone the repository

```bash
git clone https://github.com/UoaWDCC/medrevue.git
cd medrevue
```

### Install dependencies

Install all workspace dependencies from the project root:

```bash
npm install
```

### Run the project locally

Run frontend in a terminal from the project root:

```bash
npm run dev:frontend
```

This will launch the application at `http://localhost:5173/`.

> Don't worry about running the backend for now. The existing backend (MongoDB, Redis) will no longer be needed for the 2026 project, and will be replaced with a new one using Payload CMS.

### Recommended VS Code Extensions

For a smoother development experience in this project, please install:

- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) (`biomejs.biome`)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) (`bradlc.vscode-tailwindcss`)

## 🚀 Deployment

Upon pushing to main, this app is automatically deployed to Fly.io via Github Actions ([workflow file](.github\workflows\deploy.yml)).

Steps (details in [Dockerfile](./Dockerfile)):

- Frontend built
- Frontend build moved to backend
- Backend built
- Backend (with frontend) served on Fly.io

Deployment uses npm and the checked-in `package-lock.json`.

> You can find the latest deployment at [medrevue.fly.dev](https://medrevue.fly.dev/) or [medrevue.wdcc.co.nz](https://medrevue.wdcc.co.nz/).  
> You can trigger a manual deployment in the [actions tab](https://github.com/UoaWDCC/medrevue/actions/workflows/deploy.yml).

---

## 2026 Team

| Name              | Role            |
| ----------------- | --------------- |
| Abbey Martinez    | Project Manager |
| Dillon Mok        | Tech Lead       |
| Ray Ishihara      | Developer       |
| Nicole Lai        | Developer       |
| Maya Babu         | Developer       |
| Conor Sheridan    | Developer       |
| Brody Brownlee    | Developer       |
| Travis Augenstein | Developer       |
| Ema Camus         | Developer       |
| Labiqa Ansari     | Designer        |
