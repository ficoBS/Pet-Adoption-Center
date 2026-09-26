# Pet Adoption Center

A React application for browsing adoptable pets, submitting adoption requests, and managing a shelter's listings. Firebase provides authentication, database storage, and image uploads; there is no separate backend server to run.

## Features

- Browse available pets and view their photos, age, breed, vaccination status, health, and temperament.
- Filter by breed, vaccination status, or animal type, and sort by found date, name, or age.
- Register with email and password or sign in with Google.
- Complete a personal profile and view adoption requests and their status.
- Add pets and upload photos as a worker or administrator.
- Review adoption requests, approve pickup, mark an adoption complete, or reject a request.
- Assign or remove worker roles as an administrator.

## Technology

React 19, React Router 7, Create React App (`react-scripts` 5), Firebase SDK 12, and Swiper 11. Styling uses plain CSS. Firebase Authentication, Cloud Firestore, and Cloud Storage supply the hosted services.

## Run locally

Install Node.js 20 or newer and npm. An internet connection is required for the Firebase services.

```sh
git clone https://github.com/ficoBS/Pet-Adoption-Center.git
cd Pet-Adoption-Center
npm ci
npm start
```

Open the **Local** address printed in the terminal, normally [http://localhost:3000](http://localhost:3000). Keep the terminal running; press **Ctrl+C** to stop the server.

If port 3000 is occupied, accept the alternate port offered by the development server. On Linux or macOS, you can also choose one explicitly:

```sh
PORT=3001 npm start
```

The app reads its Firebase configuration directly from `src/config/firebase.js`. It currently points to `pet-adoption-center-ffcdf`; no `.env` file is required by the current code. To use your own Firebase project, follow the setup below before using account or data features.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Replace the configuration values in `src/config/firebase.js` with that web app's configuration.
3. Enable **Email/Password** and **Google** in Firebase Authentication.
4. Check Authentication's authorized domains and add your development or deployed hostname where needed.
5. Create the default Cloud Firestore database and enable Cloud Storage. Use the bucket name shown in your project's configuration.
6. Publish `firestore.rules` and `storage.rules` through the corresponding Rules tabs in Firebase Console.
7. If Firebase reports a missing composite index for a pet query, follow the link in the error to create that index. The repository does not contain an index configuration.

With the Firebase CLI installed and authenticated, you can publish the rules from the project directory instead:

```sh
firebase login
firebase deploy --only firestore:rules,storage --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with the same project ID used in the app configuration. This command deploys rules, not the website. Storage rules read staff roles from Firestore; enable the required cross-service permission if Firebase prompts you.

### Roles and first administrator

New accounts receive the `user` role. To create the first administrator, register an account, then open its `users/{uid}` document in Firebase Console and set `role` to `admin`.

| Role | Access under the supplied rules |
| --- | --- |
| Visitor | Browse pets and pet images |
| User | Manage their own profile and submit/view their own adoption requests |
| Worker | Read user profiles and requests, add/manage pets, and process adoptions |
| Admin | Worker access plus changing accounts between user and worker roles |

The current worker dashboard also displays role-change buttons; the rules deny those actions for workers. Access is enforced by Firebase rules, not simply by whether a page or button is visible.

Committing rule files does not activate them. See [FIREBASE_RULES.md](FIREBASE_RULES.md) for publishing details and access restrictions.

### Stored data

| Firestore collection | Purpose |
| --- | --- |
| `users` | Profiles and roles, keyed by Authentication UID |
| `pets` | Pet details, image URLs, and adoption availability |
| `adoptionRequests` | Requests keyed as `{userId}_{petId}` |

Request statuses are `waitingApproval`, `waitingPickup`, `adopted`, and `rejected`. Approval and completion mark the pet unavailable; the dashboard updates the request and pet together in a batch.

Storage uploads use `pets/{timestamp}-{filename}` and `users/{uid}/profile.jpg`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the committed lockfile |
| `npm start` | Start the development server |
| `npm run build` | Create a production bundle in `build/` |
| `npm test` | Start the configured test runner |

The existing `src/App.test.js` is still the starter test expecting a “learn react” link. It does not describe the current application and is not a complete application test suite.

For production hosting, serve the generated `build/` directory and configure unknown application paths to return `index.html`, so direct links such as `/pets/:id` work. The supplied `firebase.json` configures rules only; website hosting is not configured.

## Project structure

```text
public/                 HTML template and public assets
src/
  comp/                 Header, pet cards, and carousel
  config/firebase.js    Firebase initialization
  hooks/                Authentication context
  images/               Local image assets
  pages/                Home, authentication, pets, profiles, and dashboard
  App.js                Client-side routes
  index.js              React entry point
firebase.json           Firebase rules deployment configuration
firestore.rules         Firestore access rules
storage.rules           Storage access rules
FIREBASE_RULES.md       Rules setup and publishing instructions
```

## Troubleshooting

- **Compiled with warnings:** unused state in the add-pet page and a hook dependency warning in the pet list do not stop the development server. Open the Local URL printed in the terminal.
- **Missing or insufficient permissions:** confirm that the rules are published to the same project used by the app, that you are signed in, and that your account has the required role.
- **Missing index:** create the specific Firestore index linked in the query error and wait for it to finish building.
- **Google sign-in fails:** check that Google authentication is enabled and the current hostname is authorized.
- **Image upload denied:** the supplied rules require an image content type. Pet uploads require a worker/admin account; profile uploads must belong to the signed-in user.
