# CS3219-AY22-23-Project-Group-27

This is PeerPrep created by Group 27. This application has been deployed on https://peerprep.one, feel free to enter our application and start Coding!

## Understanding this repository

Each sub-directory __-service corresponds to a microservice.
Each sub-directory contains a sample environment file .env.sample, copy it to a new .env file to setup the microservice.

### Requirement 1
To manage dependencies between Matching service and other services which depend on match events, we utilize Google Cloud Pub/Sub. As such, the local development tools such as manually starting each service on the command line via "npm start" will require being logged in to google cloud via the gcloud cli. 

That however requires team27's Google account credentials hence local testing is not suggested. 

On the other hand, testing via docker-compose is not supported yet as it involves using a credentials.json file for logging into Google Cloud from within the local docker cluster. This was less of our priority hence it is not yet supported, we apologise. Nontheless there is a docker-compose.yml file in this project root directory which worked before Google Cloud Pub/Sub was integrated.

Therefore we suggest testing our application on the deployed instance at https://peerprep.one, thank you!

Feel free to contact us privately if you have any queries.

#### Logging in to to google cloud project and google cloud pub/sub.
First login via gcloud cli, in your browser

    # Log in to our team's google account
    gcloud auth login
    # Then paste the code generated in your web browser into gcloud cli.

Allow local environment to connect to google cloud pub/sub.
Refer to this link: https://cloud.google.com/pubsub/docs/publish-receive-messages-client-library#pubsub-client-libraries-nodejs

    # Log in to our team's google account
    gcloud auth application-default login
    # No need to run "gcloud projects add-iam-policy-binding" in tutorial link above
    # List existing projects
    gcloud projects list
    # set quota project
    gcloud auth application-default set-quota-project <PROJECT_ID>

    # TO view all gcloud pubsub subscriptions
    gcloud config set project <PROJECT_ID>
    gcloud pubsub subscriptions list

    # To create newe subscriptions
    https://cloud.google.com/pubsub/docs/create-subscription#pubsub_create_pull_subscription-gcloud

Now your local environment can communicate with Google Cloud Pub/Sub. However another caveat is that the deployed services on 

### Requirement 2

There has to be 1 redis instance each for matching, comm, collab and user service for them to work. Hence you may create them as such:

    cd local-redis-example
    docker-compose up -d

## Local testing

### Running individual services from command line
Note that in order to test individual services via command line(without docker-compose), you will need to change url endpoints in frontend/src/configs.js file. 

1. Uncomment lines 11-15 and 23-27
2. Comment away lines 17-21

#### Setting up each service

Inside each service's directory
1. Copy `.env.sample` to a new file named `.env`
2. Fill in values accordingly based on comments in `.env.sample`. Certain fields have to be left empty on the .env.sample file for security reasons, feel free to contact us if they are needed.
3. Install npm packages

    For Frontend run the following

        npm i —legacy-peer-deps

    For all other services run the following

        npm i

4. Run the Service
    
    Execute the following
    
        npm start


You may now run each service individually from the command line.