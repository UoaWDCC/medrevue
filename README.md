# Med Revue Hub

A modern web platform to support Med Revue – an annual theater show put together by medical students, with all proceeds going to charity.

## 🎭 Overview

Med Revue Hub is designed to:

- 📅 Promote upcoming show details and events
- 🎟️ Allow users to order tickets online
- 🖼️ Display galleries from past performances
- 💖 Highlight the supported charity
- 🎉 Showcase sponsors and supporters

## 🔧 Getting Started

- npm install
- npm run dev:frontend
- npm run dev:backend

## 🚀 Deployment

Upon pushing to main, this app is automatically deployed to Fly.io via Github Actions ([workflow file](.github\workflows\deploy.yml)).

Steps (details in [Dockerfile](./Dockerfile)):
- Frontend built
- Frontend build moved to backend
- Backend built
- Backend (with frontend) served on Fly.io

Note: the deployment uses Yarn due to an issue with npm's peer dependency resolution.

> You can find the latest deployment at [medrevue.fly.dev](https://medrevue.fly.dev/) or [medrevue.wdcc.co.nz](https://medrevue.wdcc.co.nz/).  
> You can trigger a manual deployment in the [actions tab](https://github.com/UoaWDCC/medrevue/actions/workflows/deploy.yml).
