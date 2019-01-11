'use strict';
var eventController = require('./eventController');
const helper = require('../helper/Helper');
const scraping = require('../helper/Scraping');

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
    let data = helper.getAllActus();

    let lang = request.query.locale;
    let name = request.query['first name'];
    let messenger_id = request.query['messenger user id'];

    if (data.length > 0) {
        console.log(request.query);

        let mesazy = {
            "messages": [
               /* {
                    "text": "Hi " + name + "! There are the latest news"
                }*/
            ]
        };

        if (lang.includes('fr')) {
            mesazy = {
                "messages":[
                    {
                        "text": "Salut " + name + "! Voici les infos de la dernière minute"
                    }
                ]
            };
        } else if (lang.includes('mg')) {
            mesazy = {
                "messages": [
                    {
                        "text": "Salama " + name + "! Ireto ny vaovao farany"
                    }
                ]
            };
        }

        data.forEach(chunk => {
            let temp = helper.renderGenericTemplate(chunk);
            mesazy.messages.push(temp);
        });

        console.log(JSON.stringify(mesazy));

    response.send(mesazy);


     /*   eventController.sendMessage(messenger_id, mesazy).then(success => {
            data.forEach(chunk => {
                let mesazy = helper.renderGenericTemplate(chunk);
                eventController.sendMessage(messenger_id, mesazy);
            });
        },
            error => {

            }
        );*/

    }
    else {
        let mesazy = {
            "messages": [
                {
                    "text": "Nothing special to say"
                }
            ]
        };

        if (lang.includes('fr')) {
            mesazy = {
                "messages": [
                    {
                        "text": "Rien de spécial!"
                    }
                ]
            };
        } else if (lang.includes('mg')) {
            mesazy = {
                "messages": [
                    {
                        "text": "Tsisy vaovao, tsisy maresaka"
                    }
                ]
            };
        }

        data.forEach(chunk => {
            let part = helper.renderGenericTemplate(chunk);
        
            mesazy.messages.push(part);
        });


        response.send(mesazy);
    }
}

exports.bfm = function (request, response) {
    response.sendStatus(200);
    let messenger_id = request.query['messenger user id'];
    eventController.sendMessage(messenger_id, scraping.renderListDevise());
}

