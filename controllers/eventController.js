const request = require('request');
const messageTemplate = require('../template/messageTemplate');

const PAGE_ACCESS_TOKEN = "EAADSJLU5ZBrsBAFHivTi4ZAXSamS78ECK8ZAC1XnlOZAvMNXTFP6bTT9Q99mcuAZAtb0x4FDQxoZCLIZCFVZBqn1cKpqjqv8wutw8x91g8xQSmaXBC1jdJ4WE3FNmY9SDigb7DRUOMervWfNCVi0aFmnbF7DTi367SKpRuhEt5WhqqFxTZArCllH0",
    helper = require('../helper/Helper'),
    scraping = require('../helper/Scraping');

exports.message = function (sender_psid, received_message) {
    let response;

    if (received_message.quick_reply) {
        switch (received_message.quick_reply.payload) {
            case "BEGIN":
            this.sendMessage(sender_psid, messageTemplate.greeting(helper.retrieveQuickmenus()));
            break;
        case "DEVIZY":
            this.sendMessage(sender_psid, scraping.renderListDevise());
            break
        case "ABOUT":
            let mesazy = {
                "text": "Maresaka Presse - (c)faraniarijaona Dec 2018"
            };
            this.sendMessage(sender_psid, mesazy);
            break;
        default:
            let data = helper.getAllActus(received_message.payload);
            data.forEach(chunk => {
                let mesazy = helper.renderGenericTemplate(chunk);
                this.sendMessage(sender_psid, mesazy);
            });
            break;
        }
    } else {
           this.sendMessage(sender_psid, {"dynamic_text": {
                        "text": "Hello {{first_name}}, what do you want to do?",
                        "fallback_text": "Hello, what do you want to do?"
                    }
                                         });
    }
};

exports.postback = function (sender_psid, received_message) {
    switch (received_message.payload) {
        case "BEGIN":
            this.sendMessage(sender_psid, messageTemplate.greeting(helper.retrieveQuickmenus()));
            break;
        case "DEVIZY":
            this.sendMessage(sender_psid, scraping.renderListDevise());
            break
        case "ABOUT":
            let mesazy = {
                "text": "Maresaka Presse - (c)faraniarijaona Dec 2018"
            };
            this.sendMessage(sender_psid, mesazy);
            break;
        default:
            let data = helper.getAllActus(received_message.payload);
            data.forEach(chunk => {
                let mesazy = helper.renderGenericTemplate(chunk);
                this.sendMessage(sender_psid, mesazy);
            });
            break;
    }
};

exports.sendMessage = function (sender_psid, response) {
    response.quick_replies = [];
    helper.retrieveQuickmenus().forEach(element => {
        let t = {
            "content_type": "text",
            "title": element.title,
            "payload": element.payload
        };
        if (element.image) {
            t.image_url = element.image;
        }
        response.quick_replies.push(t);
    });

    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    return new Promise(function (success, error) {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                success(body);
            } else {
                error(err);
            }
        });
    });
};
