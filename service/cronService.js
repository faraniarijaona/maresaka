'use strict';

const helper = require('../helper/Helper'),
    feedSource = require("../feedsource/feedsource"),
    writeFile = require('write-file'),
    Parser = require('rss-parser'),
    parser = new Parser(),
    recursive = require('recursive-readdir-synchronous'),
    fs = require('fs');


exports.parse = function(){
    let list_feed = feedSource.getSource();

    list_feed.forEach(feed=>{
        (async () => {
            let res = await parser.parseURL(feed);
            let resp_to_write = [];
           res.items.forEach(item => {
               let t = {title: item.title, link:item.link, content:item.content, category : item.categories };
               resp_to_write.push(t);
            });

            writeFile('cache/'+helper.extractHostname(res.link)+".json", resp_to_write, function(err){
                if(err){
                    console.log(err);
                }
            } );
        })();
    });
};

exports.createLaUne = function(){
    let LaUne = [];
    let files = recursive('cache/');

    files.forEach(file=>{
        const data = JSON.parse(fs.readFileSync(file));
        data.forEach(d=>{
            LaUne.push(d);
        });
    });

    return LaUne;
};