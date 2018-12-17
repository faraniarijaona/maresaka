'use strict';

let feedSource = require("../feedsource/feedsource");

let Parser = require('rss-parser');
let parser = new Parser();


exports.parse = function(){
    let list_feed = feedSource.getSource();

    list_feed.forEach(feed=>{
        (async () => {
            let res = await parser.parseURL(feed);
            res.items.forEach(item => {
                console.log(item.title);
                console.log(item.link);
                console.log(item.content);
            });
        })();
    });
}