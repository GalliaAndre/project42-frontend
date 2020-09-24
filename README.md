# project42-frontend

---

## Getting started in the local machine

To getting started you have to do:

- install [NodeJs](https://nodejs.org/it/) (only the first time)
- run the command `npm install` in the project root to install the dependencies;
- run the command `npm run mock` to start the local mock server;
- open a new shell window and run the command `npm start` and open the browser page;
- if you need to customize the local environment, update the `public/config/environment.json` file.
  - i.e. DEV BE "apiUrl": "https://project42-api.sorintdev.it"
  - i.e. LOCAL BE "apiUrl": "http://localhost:8000"
  - i.e. LOCAL MOCK "apiUrl": "http://localhost:4407"

---

## Workflow

The CI is triggered on the following branches:

- `master` = it will be deployed on the `DEV` environment (see the `k8s/dev` folder for more details)
- `stable` = it will be deployed on the `UAT` environment (see the `k8s/uat` folder for more details)
- `release` = it will be deployed on the `PROD` environment (see the `k8s/prod` folder for more details)

To workflow to be respected is the following:

1. DEVELOPMENT

   - **DON'T PUSH** partial/unstable changes on the `master` branch;
   - create a new branch starting from `master` and name it `feature/<SHORT_DESCRIPTION>` (i.e. `feature/user_list`);
   - push the file changes on the new branch;
   - when the feature is completed, merge the feature branch into the `master` branch and push it;
   - after few minutes, the changes will be live in the DEV environment;
   - delete the feature branch.

2. UAT

   - when the app is ready for testing, execute the following steps;
   - update the `version` in the `package.json` file and push it to the `master` branch;
     - no longer update the version until the `stable` branch is merged into the `release` branch;
   - create the `stable` branch, if it doesn't exist;
   - merge the `master` branch into the `stable` branch and push it;
   - after few minutes, the changes will be live in the UAT environment.

3. PRODUCTION

   - when the app is ready for production, execute the following steps;
   - create the `release` branch, if it doesn't exist;
   - merge the `stable` branch in the `release` branch;
   - add a tag to the `release` branch with the updated version (i.e. `1.2.5`) and push it.
   - after few minutes, the changes will be live in the PROD environment.

---
