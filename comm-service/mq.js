
// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";
import { addMatch } from "./services/redis.js";

let pubsub, topic, subscription;

export function initMQ(
  projectId = 'cs3219g27', // Your Google Cloud Platform project ID
  topicNameOrId = 'match-found', // Name for the new topic to create
  subscriptionName = 'match-found-sub-comm' // Name for the new subscription to create
) {
  // Instantiates a client
  pubsub = new PubSub({ projectId });

  topic = pubsub.topic(topicNameOrId);

  subscription = topic.subscription(subscriptionName);

  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    const msg = JSON.parse(message.data.toString());
    console.log('Received message:', msg);
    const room_id = msg.room_id;
    const difficulty_level = msg.difficulty_level;
    const username1 = msg.username1;
    const username2 = msg.username2;
    const user_id1 = msg.user_id1;
    const user_id2 = msg.user_id2;
    addMatch(room_id, difficulty_level, username1, username2, user_id1, user_id2)
    message.ack();
  });
}
