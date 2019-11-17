'use strict';

exports.getSource = function (topic) {
    if (topic) {

    } else {
        return ['http://feeds.bbc.co.uk/news/world/rss.xml', 'http://www.rfi.fr/general/rss'
        ];
    }
}