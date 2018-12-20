const request = require('request');
const messageTemplate = require('../template/messageTemplate');
const PAGE_ACCESS_TOKEN = "EAAgXXSZAMUjkBABd4XKZAsGAgzlrPYKKMDeMo1wl1HVyDMweSiErA4sVzRFmtVnHj7kfmUPfTYcumHDRVEaV3MXLeJcHnq6MwIiY32w0rCgMT6HK7CxVpjcOh3hLYN3jf152WiFHBE6cQhCjGsG9SZBydTWIKYEwc6fZCW2ZAIAZDZD",
  helper = require('../helper/Helper');
exports.message = function (sender_psid, received_message) {
  let response;

  console.log(JSON.stringify(received_message));

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }
  else if (received_message.attachments) {
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

exports.postback = function (sender_psid, received_message) {
  switch (received_message.payload) {
    case "BEGIN":
      this.sendMessage(sender_psid, messageTemplate.greeting());
    case "LATEST_NEWS":
      let data = helper.getAllActus();

      console.log("data.length"+data.length);
      if (data.length > 0) {
        let lang = '{{locale}}';

        let mesazy = {
            "dynamic_text": {
              "text": "Hi {{first_name}}! There are the latest news",
              "fallback_text": "Hi! There are the latest news"
            }
        };

        if (lang.includes('fr')) {
          mesazy = {
              "dynamic_text": {
                "text": "Salut {{first_name}}! Voici les infos de la dernière minute",
                "fallback_text": "Salut! Voici les infos de la dernière minute"
              }
          };
        } else if (lang.includes('mg')) {
          mesazy = {
              "dynamic_text": {
                "text": "Salama {{first_name}}! Ireto ny vaovao farany",
                "fallback_text": "Salama! Ireto ny vaovao farany"
              }
          };
        }

        this.sendMessage(sender_psid, mesazy);

        data.forEach(chunk => {
          console.log(chunk);
          let mesazy = {
            "messages": [
              helper.renderTemplate(chunk)
            ]
          };
          this.sendMessage(sender_psid, mesazy);
        });

      }
      else {
        let lang = '{{locale}}';

        let mesazy = {
              "text": "Nothing special to say"
        };

        if (lang.includes('fr')) {
          mesazy = {
                "text": "Rien de spécial!"
          };
        } else if (lang.includes('mg')) {
          mesazy = {
                "text": "Tsisy vaovao, tsisy maresaka"
          };
        }

        this.sendMessage(sender_psid, mesazy);
      }

  }
};

exports.sendMessage = function (sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log(response);

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