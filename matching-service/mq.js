// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";

let pubsub, topic, subscription;

export function initMQ(
  projectId = 'cs3219g27', // Your Google Cloud Platform project ID
  topicNameOrId = 'match-found', // Name for the new topic to create
  subscriptionName = 'match-found-sub' // Name for the new subscription to create
) {
  // Instantiates a client
  pubsub = new PubSub({ projectId });

  topic = pubsub.topic(topicNameOrId);

  subscription = topic.subscription(subscriptionName);
}

export function publishMatch(msg) {
  topic.publish(Buffer.from(JSON.stringify(msg)));
}
