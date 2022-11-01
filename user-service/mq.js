
// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";
import { createMatchHistory } from "./model/repository.js";

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

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    const msg = JSON.parse(message.data.toString());
    console.log('Received message:', msg);
    createMatchHistory(msg.room_id, msg.user_id1, msg.user_id2, msg.username1, msg.username2, msg.difficulty_level);
    message.ack();
  });
}
