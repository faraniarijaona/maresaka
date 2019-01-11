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

    response.send({
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [
                  {
                    "subtitle": "https://www.banky-foibe.mg, 2019-01-11 06:07",
                    "buttons": [
                      {
                        "type": "web_url",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "subtitle": "https://www.banky-foibe.mg, 2019-01-11 06:07",
                    "buttons": [
                      {
                        "type": "web_url",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/13B99/production/_105139708_hi051558990.jpg",
                    "title": "Trump visits border amid US shutdown wall row",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 02:52",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-us-canada-46827555",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/172A3/production/_105138849_abe.jpg",
                    "title": "Brexit: Japan's PM says 'wish of whole world' to avoid no-deal",
                    "subtitle": "www.bbc.co.uk, 2019-01-10 23:41",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/uk-politics-46826345",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/181E9/production/_105139789_rapper.jpg",
                    "title": "Kevin Fret: Gay rapper shot dead in Puerto Rico aged 24",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 04:34",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-us-canada-46833286",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/0C9F/production/_103113230_048775815-1.jpg",
                    "title": "Jakiw Palij: Nazi guard deported by US dies in Germany",
                    "subtitle": "www.bbc.co.uk, 2019-01-10 23:47",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-europe-46828006",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/14054/production/_105140028_gettyimages-461754440.jpg",
                    "title": "Ex-soap star charged with assault",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 05:10",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-australia-46833427",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/B665/production/_105139664_p06xs4dp.jpg",
                    "title": "The refuge for children with microcephaly",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 03:01",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-africa-46795387",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/15B01/production/_105133888_p06xplly.jpg",
                    "title": "Manila's 'trolley boys'",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 02:24",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-asia-46828430",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  },
                  {
                    "image_url": "http://c.files.bbci.co.uk/14819/production/_105139938_p06xs6dm.jpg",
                    "title": "So why HAS the US government shut down?",
                    "subtitle": "www.bbc.co.uk, 2019-01-11 03:48",
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://www.bbc.co.uk/news/world-us-canada-46815798",
                        "title": "VOIR L'ARTICLE"
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      });


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

