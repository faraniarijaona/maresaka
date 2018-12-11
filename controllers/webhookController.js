exports.webhook = function(request, response){
    let VERIFY_TOKEN = "2081c182-fc9c-11e8-8eb2-f2801f1b9fd1";
    let mode = request.query['hub.mode'];
    let token = request.query['hub.verify_token'];
    let challenge = request.query['hub.challenge'];


    if (mode && token) {
  
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          
          // Responds with the challenge token from the request
          console.log('WEBHOOK_VERIFIED');
          response.status(200).send(challenge);
        
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          response.sendStatus(403);      
        }
    }
};

exports.webhookPost = function(request, response){
    let params = request.body;
    console.log(params);
    if(params.object == 'page'){
        console.log("EVENT RECEIVED");
       (params.entry).forEach(element => {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
        });

        response.send('finish');
    }
    else {
        // Responds with '403 Forbidden' if verify tokens do not match
        response.sendStatus(403);      
      }
}


