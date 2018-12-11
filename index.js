'use strict';
var webhook_controller = require('./controllers/webhookController');

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());

app.get('/webhook', webhook_controller.webhook);
app.post('/webhook', webhook_controller.webhookPost);
app.get('/', function(res, res) =>{
        res.send('test');
});
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(443, () => console.log('webhook is listening'));