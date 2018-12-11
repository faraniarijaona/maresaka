'use strict';
let webhook_controller = require('./controllers/webhookController');

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()),
    PAGE_ACCESS_TOKEN = "EAAgXXSZAMUjkBABd4XKZAsGAgzlrPYKKMDeMo1wl1HVyDMweSiErA4sVzRFmtVnHj7kfmUPfTYcumHDRVEaV3MXLeJcHnq6MwIiY32w0rCgMT6HK7CxVpjcOh3hLYN3jf152WiFHBE6cQhCjGsG9SZBydTWIKYEwc6fZCW2ZAIAZDZD";

app.get('/webhook', webhook_controller.webhook);
app.post('/webhook', webhook_controller.webhookPost);
//app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.listen(process.env.PORT || 443, () => {
    console.log('webhook is listening');
    console.log(PAGE_ACCESS_TOKEN);
});
