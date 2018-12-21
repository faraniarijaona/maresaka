const request = require('request');
const messageTemplate = require('../template/messageTemplate');
const PAGE_ACCESS_TOKEN = "EAAgXXSZAMUjkBABd4XKZAsGAgzlrPYKKMDeMo1wl1HVyDMweSiErA4sVzRFmtVnHj7kfmUPfTYcumHDRVEaV3MXLeJcHnq6MwIiY32w0rCgMT6HK7CxVpjcOh3hLYN3jf152WiFHBE6cQhCjGsG9SZBydTWIKYEwc6fZCW2ZAIAZDZD",
    helper = require('../helper/Helper');
exports.message = function(sender_psid, received_message) {
    let response;

    console.log(JSON.stringify(received_message));

    if (received_message.quick_reply) {
        switch (received_message.quick_reply.payload) {
            case "LATEST_NEWS":
                this.postback(sender_psid, received_message.quick_reply);
                break;
        }
    } else {
        if (received_message.text) {
            response = {
                "text": `You sent the message: "${received_message.text}". Now send me an image!`
            }
        } else if (received_message.attachments) {
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
                            "buttons": [{
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
        this.sendMessage(sender_psid, response);

    }
};

exports.postback = function (sender_psid, received_message) {

  switch (received_message.payload) {
    case "BEGIN":
      this.sendMessage(sender_psid, messageTemplate.greeting(helper.retrieveQuickmenus()));
      break;
    case "LATEST_NEWS":
      let data = helper.getAllActus();
      if (data.length > 0) {
        let lang = '{{locale}}';

        let mesazy = {
          "dynamic_text": {
            "text": "Hi {{first_name}}! There are the latest news",
            "fallback_text": "Hi! There are the latest news"
          }
        };

    switch (received_message.payload) {
        case "BEGIN":
            this.sendMessage(sender_psid, messageTemplate.greeting([
                { "title": "Latest News", "payload": "LATEST_NEWS" },
                { "title": "Pharmacie", "payload": "PHARMACIE" }
            ]));
            /* this.sendMessage(sender_psid, messageTemplate.quickmenu([
               { "title": "Latest News", "payload": "LATEST_NEWS" },
               { "title": "Pharmacie", "payload": "PHARMACIE" }
             ], "You can see"));*/
            break;
        case "LATEST_NEWS":
            let data = helper.getAllActus();
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

                this.sendMessage(sender_psid, mesazy).then(success => {
                        data.forEach(chunk => {
                            console.log(chunk);
                            let mesazy = helper.renderTemplate(chunk);
                            this.sendMessage(sender_psid, mesazy);
                        });
                    },
                    error => {

                    }
                );

            } else {
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
            break;
        case "ABOUT":
            let mesazy = {
                "text": "Maresaka Presse - (c)faraniarijaona Dec 2018"
            };
            this.sendMessage(sender_psid, mesazy);
            break;
    }
};

exports.sendMessage = function(sender_psid, response) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    console.log(response);
    return new Promise(function(success, error) {
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
    });
};