'use strict';

const helper = require('../helper/Helper'),
    feedSource = require("../feedsource/feedsource"),
    writeFile = require('write-file'),
    jsdom = require("jsdom"),
    request = require('request'),
    Parser = require('rss-parser'),
    parser = new Parser({
        customFields: {
            item: [
                ['enclosure', 'image'],
                ['media:thumbnail', 'image'],
                ['img', 'image']
            ],
        }
    });

const PAGE_ACCESS_TOKEN = "EAADSJLU5ZBrsBAFHivTi4ZAXSamS78ECK8ZAC1XnlOZAvMNXTFP6bTT9Q99mcuAZAtb0x4FDQxoZCLIZCFVZBqn1cKpqjqv8wutw8x91g8xQSmaXBC1jdJ4WE3FNmY9SDigb7DRUOMervWfNCVi0aFmnbF7DTi367SKpRuhEt5WhqqFxTZArCllH0";

const { JSDOM } = jsdom;

exports.parse = function (offset) {
    let list_feed = feedSource.getSource();

    list_feed.forEach(feed => {

        (async () => {
            try{
                let res = await parser.parseURL(feed);
                let resp_to_write = [];
                res.items.forEach(item => {
                    let t = { title: item.title, link: item.link, content: item.content, category: item.categories, date: item.pubDate, source: helper.extractHostname(item.link) };
    
                    if (item.image) {
                        if (item.image.$.url) {
                            t.image = item.image.$.url;
                        } else if (item.image.$.src) {
                            t.image = item.image.$.src;
                        }
                    }
    
                    if (offset) {
                        if (helper.diff_hours(new Date(), new Date(t.date)) <= 6) {
                            resp_to_write.push(t);
                        }
                    } else {
                        resp_to_write.push(t);
                    }
                });
    
                if (resp_to_write.length > 0) {
                    writeFile('cache/' + helper.extractHostname(res.link) + ".json", resp_to_write, function (err) {
                        if (err) {
                        }
                    });
                }

            }
            catch(error){
                  console.log(error);  
            }
        })();
    });
};

exports.broadcastDerniereMinuteHeader = function () {
    let lang = '{{locale}}';

    let mesazy = {
        "messages": [{
            "dynamic_text": {
                "text": "Hi {{first_name}}! There are the latest news",
                "fallback_text": "Hi! There are the latest news"
            }
        }]
    };

    if (lang.includes('fr')) {
        mesazy = {
            "messages": [{
                "dynamic_text": {
                    "text": "Salut {{first_name}}! Voici les infos de la dernière minute",
                    "fallback_text": "Salut! Voici les infos de la dernière minute"
                }
            }]
        };
    } else if (lang.includes('mg')) {
        mesazy = {
            "messages": [{
                "dynamic_text": {
                    "text": "Salama {{first_name}}! Ireto ny vaovao farany",
                    "fallback_text": "Salama! Ireto ny vaovao farany"
                }
            }]
        };
    }
    return this.doCreateMessage(mesazy);
}

exports.broadcastDerniereMinute = function (data) {
    if (data) {
        data.forEach(chunk => {
            let mesazy = {
                "messages": [
                    helper.renderGenericTemplate(chunk)
                ]
            };
            return this.doCreateMessage(mesazy, true);
        });
    } else {
        helper.getAllActus().forEach(chunk => {
            let mesazy = {
                "messages": [
                    helper.renderGenericTemplate(chunk)
                ]
            };
            return this.doCreateMessage(mesazy, true);
        });
    }
};

exports.doCreateMessage = function (mesazy, withNotification) {
    let pp = this;

    return new Promise(function (resolve, reject) {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/message_creatives",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": mesazy
        }, (err, res, body) => {
            if (!err) {
                pp.doSend(body, withNotification).then(
                    sendBodyResponse => {
                        resolve({ "sendMessage": sendBodyResponse, "createMessage": body });
                    },
                    sendError => {
                        reject({ "sendError": sendError, "createMessage": body });
                    }
                );

            } else {
                reject(err);
            }
        });
    })
};

exports.doSend = function (body_message_creative, withNotification) {
    let req_body = {
        "message_creative_id": body_message_creative.message_creative_id,
        "notification_type": "SILENT_PUSH",
        "messaging_type": "MESSAGE_TAG",
        "tag": "NON_PROMOTIONAL_SUBSCRIPTION"
    };

    if (withNotification) {
        req_body = {
            "message_creative_id": body_message_creative.message_creative_id,
            "notification_type": "NO_PUSH",
            "messaging_type": "MESSAGE_TAG",
            "tag": "NON_PROMOTIONAL_SUBSCRIPTION"
        };
    }

    return new Promise(function (resolve, reject) {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/broadcast_messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": req_body
        }, (err, res, body) => {
            if (!err) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
};