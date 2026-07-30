# Pet Adoption Center

A responsive React web application for browsing and managing pets available for adoption. The app uses Firebase for authentication, Firestore for data storage, and Firebase Storage for images. It is built with Create React App and modern React (hooks + functional components).

Live demo

- If a public demo is available, link it here (e.g. https://your-domain.example.com)

Key features

- Browse pets with images and details
- User authentication (Google sign-in)
- Add / edit pet listings (requires authentication)
- Image upload and storage via Firebase Storage
- Client-side routing with react-router-dom
- Responsive UI and image carousel using Swiper

Tech stack

- React
- Firebase (Authentication, Firestore, Storage)
- react-router-dom
- Swiper
- Create React App

Screenshots

Add screenshots to the repository (e.g. in /public/screenshots) and reference them here. Example:

![Home view](public/screenshots/home.png)

Getting started (development)

Prerequisites

- Node.js (v16+ recommended)
- npm (bundled with Node.js) or Yarn

Install dependencies

1. Clone the repository

   git clone <repo-url>
   cd pet-adoption-center

2. Install packages

   npm install

Run the app locally

   npm start

This runs the app in development mode. Open http://localhost:3000 to view it in the browser. The page will reload on changes.

Build for production

   npm run build

This creates an optimized production build in the build/ folder.

Run tests

   npm test

Project configuration (Firebase)

This project uses Firebase. A sample Firebase config is present in src/config/firebase.js. For development or deploying your own instance:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Google sign-in), Firestore, and Storage
3. Add a Web app to your Firebase project and copy the config
4. Replace the values in src/config/firebase.js with your project's configuration OR modify the code to read values from environment variables (recommended)

Important: Do not commit your own private API keys or service account credentials to public repositories. The Firebase web config in this project contains publicly visible keys that are acceptable for client-side Firebase apps, but avoid storing private keys/secrets in source control.

Folder structure

- public/ — static files and images
- src/ — application source code
  - src/config/firebase.js — Firebase initialization
  - src/components or src/comp — reusable components
  - src/pages — route pages
  - src/hooks — custom React hooks
  - src/images — local images used by the app
  - src/index.js — app entry point

Notes for contributors

- Follow the existing code style and folder layout
- Run the app locally and ensure changes don't break existing functionality
- When adding new environment configuration, document it in this README
- Open a pull request and describe your changes; include screenshots for UI work

Common tasks

- Linting / formatting: follow the project's conventions (prettier/eslint if present)
- Adding a new Firebase field: update Firestore rules and migration notes

Troubleshooting

- If the app fails to connect to Firebase, verify the config in src/config/firebase.js and that Authentication/Firestore/Storage are enabled for your Firebase project
- If images don't upload, check Storage rules and that the authenticated user has permission

License

Specify a license for the project (e.g., MIT). If not sure, add a LICENSE file at the repo root.

Contact

If you have questions, open an issue in the repository or contact the maintainer.

---

Thanks for checking out Pet Adoption Center — contributions are welcome!
