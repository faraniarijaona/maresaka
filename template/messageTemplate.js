'use strict';

exports.greeting = function () {
    return {
        "dynamic_text": {
            "text": "Bienvenue sur Maresaka {{first_name}}!",
            "fallback_text": "Bienvenue sur Maresaka!"
        }
    }
};

