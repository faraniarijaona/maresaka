'use strict';
const recursive = require('recursive-readdir-synchronous'),
    fs = require('fs'),
    arrayChunk = require('array-chunk');;

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
    var formatTime = require('d3-time-format').timeFormat("%d %b %Y %H:%M");
    
    let elements = [];

    data.forEach(el => {
        let currObject = {
            "title": el.title,
            "subtitle": el.source,
            "buttons": [{
                "type": "web_url",
                "url": el.link +" - "+formatTime(new Date(el.date)),
                "title": "VOIR L'ARTICLE"
            }]
        };

        if (el.caption) {
            currObject.image_url = el.caption;
        }

        elements.push(currObject);
    });


    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
}