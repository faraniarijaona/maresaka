'use strict';

const helper = require('./Helper'),
    writeFile = require('write-file');

exports.devizy = () => {
    helper.grabsite("https://www.banky-foibe.mg/admin/wp-json/bfm/cours_devises")
        .then(success => {
            writeFile('cache/devizy.json', JSON.parse(success).data.data.content, function(err) {
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