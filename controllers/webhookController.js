'use strict';
var eventController = require('./eventController');
const helper = require('../helper/Helper');

exports.webhook = function (request, response) {
    let VERIFY_TOKEN = "2081c182-fc9c-11e8-8eb2-f2801f1b9fd1";
    let mode = request.query['hub.mode'];
    let token = request.query['hub.verify_token'];
    let challenge = request.query['hub.challenge'];


    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            response.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            response.sendStatus(403);
        }
    }
};

exports.webhookPost = function (request, response) {
    var params = request.body;
    if (params.object && params.entry) {
        response.sendStatus(200);
        (params.entry).forEach(element => {
            let webhook_event = element.messaging[0];

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;

            if (webhook_event.message) {
                eventController.message(sender_psid, webhook_event.message);
            }

            if (webhook_event.postback) {
                eventController.postback(sender_psid, webhook_event.postback);
            }
        });
    }
    else {
        // Responds with '403 Forbidden' if verify tokens do not match
        response.sendStatus(403);
    }
}

exports.latestnews = function (request, response) {
    response.sendStatus(200);
    let data = helper.getAllActus();
    if (data.length > 0) {
        let lang = request.query.locale;
        let name = request.query['first name'];
        let messenger_id = request.query['messenger user id'];

        console.log(request.query);

        let mesazy = {
            "dynamic_text": {
                "text": "Hi " + name + "! There are the latest news",
                "fallback_text": "Hi! There are the latest news"
            }
        };

        if (lang.includes('fr')) {
            mesazy = {
                "dynamic_text": {
                    "text": "Salut " + name + "! Voici les infos de la dernière minute",
                    "fallback_text": "Salut! Voici les infos de la dernière minute"
                }
            };
        } else if (lang.includes('mg')) {
            mesazy = {
                "dynamic_text": {
                    "text": "Salama " + name + "! Ireto ny vaovao farany",
                    "fallback_text": "Salama! Ireto ny vaovao farany"
                }
            };
        }

        eventController.sendMessage(messenger_id, mesazy).then(success => {
            data.forEach(chunk => {
                let mesazy = helper.renderGenericTemplate(chunk);
                eventController.sendMessage(messenger_id, mesazy);
            });
        },
            error => {

            }
        );

    }


    
}

