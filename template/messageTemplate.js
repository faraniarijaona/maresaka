'use strict';

exports.greeting = function () {
    let lang = '{{locale}}';

    let content = {
        "dynamic_text": {
            "text": "Welcome {{first_name}}!",
            "fallback_text": "Welcome Friend!"
        }
    };

    if (lang.includes('mg')) {
        content = {
            "dynamic_text": {
                "text": "Tongasoa {{first_name}}!",
                "fallback_text": "Tongasoa Namana!"
            }
        }
    }
    else if (lang.includes('fr')) {
        content = {
            "dynamic_text": {
                "text": "Bienvenue {{first_name}}!",
                "fallback_text": "Bienvenue Ami!"
            }
        }
    }

    return content;
};

exports.whoisme = function () {
    let lang = '{{locale}}';

    let content = {
        "text": "I am Rémi, my mission is to inform you the last breaking news"
    };

    if (lang.includes('mg')) {
        content = {
            "text": "Rémi no anarako, ny andraikitro dia mampahafantatra anao ireo vaovao farany "
        };
    }
    else if (lang.includes('fr')) {
        content = {
            "text": "Je suis Rémi, ma mission c'est de vous informer les dernières minutes des actus"
        };
    }

    return content;
}

