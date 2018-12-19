'use strict';

exports.greeting = function () {
    let lang = '{{locale}}';

    if (lang.includes('mg')) {
        return {
            "dynamic_text": {
                "text": "Tongasoa {{first_name}}!",
                "fallback_text": "Tongasoa Namana!"
            }
        }
    }
    else if (lang.includes('fr')) {
        return {
            "dynamic_text": {
                "text": "Bienvenue {{first_name}}!",
                "fallback_text": "Bienvenue Ami!"
            }
        }
    }
    else {
        return {
            "dynamic_text": {
                "text": "Welcome {{first_name}}!",
                "fallback_text": "Welcome Friend!"
            }
        }
    }
};

exports.whoisme = function () {

}

