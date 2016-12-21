var azure = require('azure-storage');
var queueSvc = azure.createQueueService();

module.exports = {
    peekMood: function() {
        queueSvc.peekMessages('tunnetilaqueue', function(error, result, response){
          if(!error){
            console.log('Peeked queue: %j', result);
            // Message text is in messages[0].messageText
          }
        });    
    },

    readMood: function(callback) {
        queueSvc.getMessages('tunnetilaqueue', function(error, result, response){
            if(!error){
                // Message text is in messages[0].messageText
                var message = result[0];
                if (typeof message !== 'undefined' && message !== null) {
                    queueSvc.deleteMessage('tunnetilaqueue', message.messageId, message.popReceipt, function(error, response){
                    }); 
                }
            }
            callback(message);
        });
    },

    insertMood: function() {
        queueSvc.createMessage('tunnetilaqueue', "Hello world, i am happy!", function(error, result, response){
            if(!error){
                console.log("Message inserted!");
            // Message inserted
            }
        });
    }

}