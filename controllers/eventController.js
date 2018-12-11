const request = require('request');
const PAGE_ACCESS_TOKEN = "EAAgXXSZAMUjkBABd4XKZAsGAgzlrPYKKMDeMo1wl1HVyDMweSiErA4sVzRFmtVnHj7kfmUPfTYcumHDRVEaV3MXLeJcHnq6MwIiY32w0rCgMT6HK7CxVpjcOh3hLYN3jf152WiFHBE6cQhCjGsG9SZBydTWIKYEwc6fZCW2ZAIAZDZD";

exports.message = function(sender_psid, received_message){
    let response;

    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
    }  
    else if(received_message.attachement){
            // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                "title": "Is this the right picture?",
                "subtitle": "Tap a button to answer.",
                "image_url": attachment_url,
                "buttons": [
                    {
                    "type": "postback",
                    "title": "Yes!",
                    "payload": "yes",
                    },
                    {
                    "type": "postback",
                    "title": "No!",
                    "payload": "no",
                    }
                ],
                }]
                }
            }
        }
    }
    
    // Sends the response message
    this.sendMessage(sender_psid, response); 
};

exports.postback = function(sender_psid, received_message){

};

exports.sendMessage = function(sender_psid, response){
    let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }
    
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
};