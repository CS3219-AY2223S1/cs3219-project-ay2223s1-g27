# CS3219-AY22-23-Project-Skeleton

This is a template repository for CS3219 project.

## User Service
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Install npm packages using `npm i`.
5. Run User Service using `npm run dev`.

## Frontend
1. Install npm packages using `npm i`.
2. Run Frontend using `npm start`.

## Local Development
Note that in order to test individual services via command line(without docker-compose), you will need to change url endpoints in frontend configs.js file. 

Otherwise, to test the entire PeerPrep application:
Create a .env file in the root of user-service directory, collab, matching and comm service all depend on this .env file.
    
    ENV=DEV
    DB_LOCAL_URI=mongodb://USERNAME:PASSWORD@mongodb
    JWT_ACCESS_SECRET=CS3219JAS
    JWT_REFRESH_SECRET=CS3219JRS
    CORS_ORIGIN=http://frontend
    SENDGRID_API_KEY=<API KEY> // get from zhenteng
    USER_SVC_SENDER_EMAIL=cs3219.project.ay2223s1.g27@gmail.com
    FRONTEND_URL=http://frontend

To create the cluster, run:

    cd path/to/root
    docker-compose up --build -d

The frontend and backend should be running at http://localhost and http://localhost:3001 respectively

To teardown the cluster, run:

    cd path/to/root
    docker-compose down

Note that .env files in each service's root directory can cause conflicts in container env vars. 

## Instructions to enable the user-service nodejs client to connect to google cloud pub/sub

Refer to this link: https://cloud.google.com/pubsub/docs/publish-receive-messages-client-library#pubsub-client-libraries-nodejs

    gcloud auth application-default login
    # Login with john doe
    gcloud auth application-default set-quota-project <PROJECT_ID>
    # No need to run "gcloud projects add-iam-policy-binding"
