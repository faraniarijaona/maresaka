'use strict';
const recursive = require('recursive-readdir-synchronous'),
        fs = require('fs');

exports.extractHostname = function (url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

/**
 * read data stored
 */
exports.createLaUne = function () {
    let LaUne = [];
    let files = recursive('cache/');

    files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file));
        data.forEach(d => {
            LaUne.push(d);
        });
    });

    return this.renderTemplate(LaUne);
};

/**
 * creer tepmlate for facebook message_crea tive
 * @param {array} data 
 */
exports.renderTemplate = function (data) {
    let elements = [];

    data.forEach(el => {
        let currObject = {
            "title": el.title,
            "subtitle": el.source,
            "buttons": [
                {
                    "type": "web_url",
                    "url": el.link,
                    "title": "Lire"
                }
            ]
        };

        if (el.caption) {
            currObject.image_url = el.caption;
        }

        elements.push(currObject);
    });


    return {
        "attachment": {
            "type":"template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
}
