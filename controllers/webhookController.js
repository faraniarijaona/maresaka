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
    var params = request.body;

    if(params.object && params.entry){
        console.log("EVENT RECEIVED");
        console.log(JSON.stringify(params));
        (params.entry).forEach(element => {
            (element.messaging).forEach(el=>{
                response.send(el.message);
            });
        });
    }
    else {
        // Responds with '403 Forbidden' if verify tokens do not match
        response.sendStatus(403);      
      }
}


