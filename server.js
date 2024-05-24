"use strict";

const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueFail,
} = require("./src/services/consumerQueue.service");
const queueName = "test-topic";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer started ${queueName}`);
//   })
//   .catch((error) => {
//     console.error(`Message Error: ${error.message}`);
//   });

consumerToQueueNormal(queueName)
  .then(() => {
    console.log(`Message consumerToQueueNormal started`);
  })
  .catch((error) => {
    console.error(`Message Error: ${error.message}`);
  });

consumerToQueueFail(queueName)
  .then(() => {
    console.log(`Message consumerToQueueFail started`);
  })
  .catch((error) => {
    console.error(`Message Error: ${error.message}`);
  });
