'use strict';
var webhook_controller = require('./controllers/webhookController');
require('dotenv').config();

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()),
    PAGE_ACCESS_TOKEN = process.env.PAGE_ID;

app.get('/webhook', webhook_controller.webhook);
app.post('/webhook', webhook_controller.webhookPost);
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(process.env.PORT || 443, () => {
    console.log('webhook is listening');
    console.log(PAGE_ACCESS_TOKEN);
});
