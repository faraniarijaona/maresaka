'use strict';

exports.getSource = function (topic) {
    if (topic) {

    } else {
        return ['http://feeds.bbci.co.uk/news/world/rss.xml', 'http://www.rfi.fr/general/rss', 'http://matv.mg/feed/', 'https://www.jeuneafrique.com/pays/madagascar/feed/',
            'http://feeds.feedburner.com/MadagascarTribune'
        ];
    }
}