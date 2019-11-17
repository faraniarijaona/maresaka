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

            if (res.length === 0) {
                let usd = JSON.parse(success).data.data.datagraph.dataUsd;
                  let   keys = Object.keys(usd);

                res.push({ "source": "https://www.banky-foibe.mg", "devises": "EUR", "mid":usd[keys[keys.length - 1]]+"", "daty": keys[keys.length - 1] });

                let dataEuro = JSON.parse(success).data.data.datagraph.dataEuro;
                keys = Object.keys(dataEuro);
                res.push({ "source": "https://www.banky-foibe.mg", "devises": "EUR", "mid": dataEuro[keys[keys.length - 1]]+"", "daty": keys[keys.length - 1] });
            }

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
        "image_url": "https://www.banky-foibe.mg/admin/wp-content/uploads/2018/06/logo-header-1.png",
        "subtitle": "www.banky-foibe.mg",
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
            "title": "1" + el.devises + " = " + el.mid.replace(' ', '') + " Ar",
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