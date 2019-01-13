const request = require('request');
const messageTemplate = require('../template/messageTemplate');

const PAGE_ACCESS_TOKEN = "EAADSJLU5ZBrsBAOgWYV9Lt0duPYkCL88P6TcxQXX7fQfg7UhmhvQfv74aso0nmJdif6qAS2KZAZBoRY5l8aaQjUf2AOkV9VWZBBkimAkuKmsgMDlXiZC213dDjQIF1rwUWQx87cWyeECe013zqU9B8WDdErGIM6ZBhB2ZApldNbUAZDZD",
    helper = require('../helper/Helper'),
    scraping = require('../helper/Scraping');

exports.message = function (sender_psid, received_message) {
    let response;

    if (received_message.quick_reply) {
        switch (received_message.quick_reply.payload) {
            case "LATEST_NEWS":
                this.postback(sender_psid, received_message.quick_reply);
                break;
            case "DEVIZY":
                this.postback(sender_psid, received_message.quick_reply);
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
                        let mesazy = helper.renderGenericTemplate(chunk);
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
        case "DEVIZY":
            this.sendMessage(sender_psid, scraping.renderListDevise());
            break
        case "ABOUT":
            let mesazy = {
                "text": "Maresaka Presse - (c)faraniarijaona Dec 2018"
            };
            this.sendMessage(sender_psid, mesazy);
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
