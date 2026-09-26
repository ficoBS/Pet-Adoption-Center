# Firebase rules

`firestore.rules` and `storage.rules` match the existing app. `firebase.json`
connects these files to the Firebase CLI. Adding these files does not publish them.

## Access

| Data | Read | Write |
| --- | --- | --- |
| Pets and pet images | Everyone | Workers and admins |
| User profiles | Owner, workers, admins | Owner can create a `user` profile and edit profile fields; only admins can switch other users between `user` and `worker` |
| Profile images | Owner, workers, admins | Owner, including during registration |
| Adoption requests | Owner, workers, admins | Owner can create a pending request; workers/admins can change its status with the corresponding pet update |

All other paths and client-side deletes are denied. Uploads must have an image
content type. Firebase download URLs stored by the app are shareable bearer URLs;
anyone with an existing download URL can view that image.

The existing worker dashboard shows role-change buttons as well as adoption
controls. Role-change buttons will be denied for workers; admins can use them.
The UI is unchanged. Other users' profile pages are accessible only to staff.

## First admin

Register your own account normally. In Firebase Console → Firestore Database →
Data → `users` → your Authentication UID, set `role` to the string `admin`.
Do this only for a trusted administrator. The client cannot create or promote an
admin, and the rules do not grant roles based on email addresses.

## Publish

Select the project identified by `REACT_APP_FIREBASE_PROJECT_ID` in `.env`.

Option 1: In Firebase Console, paste `firestore.rules` into Firestore Database →
Rules and publish. Paste `storage.rules` into Storage → Rules and publish.
If prompted, enable the connection that lets Storage rules read Firestore roles.

Option 2: With the Firebase CLI installed, run from the project directory:

```sh
firebase login
firebase deploy --only firestore:rules,storage --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with your `.env` project ID.

Review existing `users` roles before publishing: these rules trust the stored role.
Authentication, Firestore, and Storage must already be enabled. Storage role checks
use the default Firestore database and require the cross-service permission Firebase
prompts you to enable on first deployment.

These files do not deploy indexes. If a pet filter or sort reports a missing
composite index, create the specific index from the link in that Firebase error.

References: [Firestore query rules](https://firebase.google.com/docs/firestore/security/rules-query)
and [Storage rules using Firestore](https://firebase.google.com/docs/storage/security/rules-conditions#enhance_with_firestore).
