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

    let elements = [{
        "title": "Banky Foiben'i Madagasikara",
       // "image_url": "https://pure-ravine-80893.herokuapp.com/assets/image/bfm.jpg",
        "subtitle":"www.banky-foibe.mg",
        "default_action": {
            "type": "web_url",
            "url": "https://www.banky-foibe.mg",
            "messenger_extensions": false,
            "webview_height_ratio": "tall"
        }
    }
    ];
    listDevise.forEach(el => {
        let currObject = {
            "title": "1" + el.devises + " = " + el.mid.replace(' ','') + " Ar",
            "subtitle": el.daty
        };

        switch (el.devises) {
            case "USD":
                currObject.image_url = "https://pure-ravine-80893.herokuapp.com/assets/image/usd.jpg";
                break
            case "EUR":
                currObject.image_url = "https://pure-ravine-80893.herokuapp.com/assets/image/euro.jpg";
                break
        }

        elements.push(currObject);
    });

    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "top_element_style": "large",
                "elements": elements
            }
        }
    };
}