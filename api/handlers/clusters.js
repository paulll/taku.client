const colors = require("colors");
const child_process = require('child_process');

async function cacheImages(attachments) {
  return new Promise(resolve => {
    // var numchild = require('os').cpus().length;
    var done = 0;
    let cachedAttachments = [];
    // Do as many subprocesses as there are attachments
    // @TODO: Limit simultaneous subtask count to CPU thread count or smth
    for (var i = 0; i < attachments.length; i++) {
      console.log(`[SUBTASK]`.bgYellow.black + ` Started ` + `[${i + 1}/${attachments.length}]`.yellow + ` attachmentProcessor.js`);

      // Launch subtask      
      var attachmentProcessor = child_process.fork('./clusters/attachmentProcessor.js');

      // Send image to process to subtask      
      attachmentProcessor.send(attachments[i]);

      // Wait for results
      attachmentProcessor.on('message', cachedAttachment => {
        cachedAttachments.push(cachedAttachment.result);
        done++;
        if (done === attachments.length) {
          console.log(`[SUBTASK]`.bgYellow.black + ` [${i}/${attachments.length}]`.yellow + ` Subtasks finished successfully`);
          resolve(cachedAttachments);
        }
      });
    };
  });
};
//console.log(Classes);

module.exports = {
  cacheImages
}