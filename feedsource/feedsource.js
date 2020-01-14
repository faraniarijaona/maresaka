'use strict';

exports.getSource = function (topic) {
    if (topic) {

    } else {
        return ['http://feeds.bbci.co.uk/news/world/rss.xml', 'http://www.rfi.fr/general/rss', 'https://www.developpez.com/index/rss'
        ];
    }
}