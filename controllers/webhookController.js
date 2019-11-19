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
                console.log("wbh_message ==> "+webhook_event.message)
                eventController.message(sender_psid, webhook_event.message);
            }

            if (webhook_event.postback) {
                console.log("wbh_post ==> "+webhook_event.postback)
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

 /*   { locale: 'en_US',
  'first name': 'Fety',
  'messenger user id': '2027736353979437' }*/

   let s = request.

    response.sendStatus(200);
    let data = helper.getAllActus(request.query.source);

    let lang = request.query.locale;
    let name = request.query['first name'];
    let messenger_id = request.query['messenger user id'];

    if (data.length > 0) {

       data.forEach(chunk => {
            let temp = helper.renderGenericTemplate(chunk);
            eventController.sendMessage(messenger_id, temp).then(success =>{}, err => console.log(err));
        });

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

        eventController.sendMessage(messenger_id, mesazy);

    }
}

exports.bfm = function (request, response) {
    response.sendStatus(200);

    let messenger_id = request.query['messenger user id'];
    eventController.sendMessage(messenger_id, scraping.renderListDevise()).then(success =>{}, err => console.log(err));
}



