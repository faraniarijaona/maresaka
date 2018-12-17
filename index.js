'use strict';
var webhook_controller = require('./controllers/webhookController');

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()),
    cron = require('node-cron'),
    cronServie = require('./service/cronService');
    
console.log(cronServie.createLaUne());
cron.schedule('*/1 * * * *', ()=>{
   cronServie.parse();
});

app.get('/webhook', webhook_controller.webhook);
app.post('/webhook', webhook_controller.webhookPost);
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(process.env.PORT || 443, () => {
    console.log('webhook is listening');
});
