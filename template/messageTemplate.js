'use strict';

exports.greeting = function () {
    let lang = '{{locale}}';

    let content = {
        "dynamic_text": {
            "text": "Welcome {{first_name}}! I am Rémi  Maresaka's steed, my mission is to inform you the last breaking news",
            "fallback_text": "Welcome! I am Rémi  Maresaka's steed, my mission is to inform you the last breaking news"
        }
    };

    if (lang.includes('mg')) {
        content = {
            "dynamic_text": {
                "text": "Tongasoa {{first_name}}! Rémi no anarako, irakiraka ato amin'ny \"Maresaka\", manana adidy mampahafantatra anao ireo vaovao farany mitranga aho",
                "fallback_text": "Tongasoa! Rémi no anarako, irakiraka ato amin'ny \"Maresaka\", manana adidy mampahafantatra anao ireo vaovao farany mitranga aho"
            }
        }
    }
    else if (lang.includes('fr')) {
        content = {
            "dynamic_text": {
                "text": "Bienvenue {{first_name}}! Je suis Rémi, coursier chez Maresaka, ma mission c'est de vous informer les dernières minutes des actus",
                "fallback_text": "Bienvenue! Je suis Rémi, coursier chez Maresaka, ma mission c'est de vous informer les dernières minutes des actus"
            }
        }
    }

    return content;
};

exports.quickmenu = function (datas, message) {
    let content = {
        "quick_replies": []
    };
    datas.forEach(element => {
        let t = {
            "content_type": "text",
            "title": element.title,
            "payload": element.payload
        };

        if(element.image){
            t.image_url =  element.image;
        }

        content.quick_replies.push(t);

    });

    if (message) {
        content.text = message;
    }

    return content;
}

