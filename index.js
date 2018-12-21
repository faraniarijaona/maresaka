'use strict';
var webhook_controller = require('./controllers/webhookController');

const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()),
    cron = require('node-cron'),
    cronServie = require('./service/cronService');

cronServie.parse(6);
/**
 * schedule task for parsing content of feed, scaled each 1 minute
 */
cron.schedule('*/5 * * * *', () => {
    cronServie.parse(6);
});

cron.schedule('10 */6 * * *', () => {
    let data = helper.getAllActus();
    if (data.length > 0) {
        cronServie.broadcastDerniereMinuteHeader().then(
            success => {
                cronServie.broadcastDerniereMinute();
            },
            error => {

            }
        );
    }
});

cron.schedule('*/5 * * * *', () => {

});

app.get('/webhook', webhook_controller.webhook);
app.post('/webhook', webhook_controller.webhookPost);

app.listen(process.env.PORT || 443, () => {
    console.log('webhook is listening');
});