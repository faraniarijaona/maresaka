'use strict';

const helper = require('../helper/Helper'),
    feedSource = require("../feedsource/feedsource"),
    writeFile = require('write-file'),
    jsdom = require("jsdom"),
    request = require('request');

const PAGE_ACCESS_TOKEN = "EAAgXXSZAMUjkBABd4XKZAsGAgzlrPYKKMDeMo1wl1HVyDMweSiErA4sVzRFmtVnHj7kfmUPfTYcumHDRVEaV3MXLeJcHnq6MwIiY32w0rCgMT6HK7CxVpjcOh3hLYN3jf152WiFHBE6cQhCjGsG9SZBydTWIKYEwc6fZCW2ZAIAZDZD";

const { JSDOM } = jsdom;

exports.parse = function(offset) {
    let list_feed = feedSource.getSource();

    list_feed.forEach(fe => {
        var feed = require("feed-read");
        feed(fe, (err, articles) => {
            let resp_to_write = [];
            articles.forEach(article => {
                let t = { caption: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXJcY82QUn8QF_OtoaOxokyR1YpM38kvSsoFDxZM8ps_GaBlBe", title: article.title, link: article.link, content: article.content, date: article.published, source: helper.extractHostname(article.feed.link) };

                /* const dom = new JSDOM(article.content);
                 let images = dom.window.document.getElementsByTagName("img");

                 if (images.length > 0) {
                     let imageUrl = images[0].src;
                     if (!images[0].src.includes("http")) {
                         imageUrl = article.link + imageUrl;
                     }
                     t.caption = imageUrl;
                 }*/

                console.log(t);

                if (offset) {
                    if (helper.diff_hours(new Date(), new Date(t.date)) <= 6) {
                        resp_to_write.push(t);
                    }
                } else {
                    resp_to_write.push(t);
                }
            });

            if (articles.length > 0) {
                writeFile('cache/' + helper.extractHostname(articles[0].feed.link) + ".json", resp_to_write, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    });
};

exports.broadcastDerniereMinuteHeader = function() {
    let mesazy = {
        "messages": [{
            "dynamic_text": {
                "text": "Salut {{first_name}}! Voici les infos de la dernière minute",
                "fallback_text": "Bonjour!"
            }
        }]
    };

    this.doCreateMessage(mesazy);
}

exports.broadcastDerniereMinute = function() {
    helper.getAllActus().forEach(chunk => {
        let mesazy = {
            "messages": [
                helper.renderTemplate(chunk)
            ]
        };
        this.doCreateMessage(mesazy, true);
    });
};

exports.doCreateMessage = function(mesazy, withNotification) {
    request({
        "uri": "https://graph.facebook.com/v2.6/me/message_creatives",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": mesazy
    }, (err, res, body) => {
        if (!err) {
            console.log(res);
            this.doSend(body, withNotification);

        } else {
            console.error("misy errora creative messages ======> " + err);
        }
    });
};

exports.doSend = function(body_message_creative, withNotification) {
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

    request({
        "uri": "https://graph.facebook.com/v2.6/me/broadcast_messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": req_body
    }, (err, res, body) => {
        if (!err) {
            console.log(res);
        } else {
            console.error("Unable to send message  ======> " + err);
        }
    });
};