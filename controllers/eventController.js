exports.message = function(sender_psid, received_message){
    let response;

    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
    }  
    
    // Sends the response message
    this.sendMessage(sender_psid, response); 
};

exports.postback = function(sender_psid, received_message){

};

exports.sendMessage = function(sender_psid, response){

};