## Instructions to enable the nodejs client to connect to google cloud pub/sub

Refer to this link: https://cloud.google.com/pubsub/docs/publish-receive-messages-client-library#pubsub-client-libraries-nodejs

    gcloud auth application-default login
    # Login with john doe
    gcloud auth application-default set-quota-project <PROJECT_ID>
    # No need to run "gcloud projects add-iam-policy-binding"
