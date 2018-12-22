'use strict';
const recursive = require('recursive-readdir-synchronous'),
    fs = require('fs'),
    arrayChunk = require('array-chunk');

exports.extractHostname = function(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

exports.diff_hours = function(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}

/**
 * read data stored
 */
exports.getAllActus = function() {
    let LaUne = [];
    let files = recursive('cache/');

    files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file));
        data.forEach(d => {
            LaUne.push(d);
        });
    });

    files.sort((a, b)=> this.diff_hours(new Date(a.date), new Date(b.date)));

    return arrayChunk(LaUne, 10);
};

/**
 * creer tepmlate for facebook message_crea tive
 * @param {array} data 
 */
exports.renderTemplate = function(data) {
 
    let elements = [];

    data.forEach(el => {
        let currObject = {
            "image_url":el.image,
            "title": el.title,
            "subtitle": el.source+" - "+el.date,
            "buttons": [{
                "type": "web_url",
                "url": el.link,
                "title": "VOIR L'ARTICLE"
            }]
        };

        elements.push(currObject);
    });

    let quickreplies = [];
    this.retrieveQuickmenus().forEach(element => {
        let t = {
            "type":"postback",
            "content_type": "text",
            "title": element.title,
            "payload": element.payload
        };
        if (element.image) {
            t.image_url = element.image;
        }
        quickreplies.push(t);
    });

    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }, 
        "quick_replies":quickreplies
    };
}

exports.retrieveQuickmenus = function(){
    return [
        { "title": "Latest News", "payload": "LATEST_NEWS" },
        { "title": "Pharmacie", "payload": "PHARMACIE" }
      ];
}