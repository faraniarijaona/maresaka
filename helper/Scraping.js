'use strict';

const helper = require('./Helper'),
    writeFile = require('write-file'),
    fs = require('fs');

exports.devizy = () => {
    helper.grabsite("https://www.banky-foibe.mg/admin/wp-json/bfm/cours_devises")
        .then(success => {

            let res = [];

            JSON.parse(success).data.data.content.forEach(element => {
                res.push({ "source": "https://www.banky-foibe.mg", "devises": element.devises, "mid": element.mid, "daty": JSON.parse(success).data.data.date });
            });

            writeFile('cache/devizy.json', res, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        },
            error => {
                console.log(error);
            }
        );
};

exports.renderListDevise = function () {
    let listDevise = JSON.parse(fs.readFileSync('cache/devizy.json'));

    let elements = [];
    listDevise.forEach(el => {
        let currObject = {
            "title": "1" + el.devises + " = " + el.mid + " Ar",
            "subtitle": el.daty,
            "default_action": {
                "type": "web_url",
                "url": el.source,
                "messenger_extensions": false,
                "webview_height_ratio": "tall"
            }
        };

        elements.push(currObject);
    });

    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "top_element_style": "compact",
                "elements": elements
            }
        }
    };
}