var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server endpoint
app.get('/', function (req, res) {
    res.send('JKDbot here! v.0.0.3');
});

// Facebook webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'jkdbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// Handler receiving messages
app.post('/webhook', function (req, res) {
    console.log(req);
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            switch(event.message.text) {
                case("cmd_subscribers"): 
                    sendMessage(event.sender.id, {text: getPageSubscribers("123456789")}); 
                    break;
                case("cmd_timezone"): 
                    sendMessage(event.sender.id, {text: getUserTimezone("1")}); 
                    break;
                default: 
                    sendMessage(event.sender.id, {text: "Message received: " + event.message.text});
                    break;
            }
        }
    }
    res.sendStatus(200);
});

// Sends a message to a Facebook user
var sendMessage = function(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Returns the subscribers of a page
var getPageSubscribers = function(pageId) {
    return "1, 2, 4";
};

// Returns the timezone of a user
var getPageSubscribers = function(userId) {
    return "-9";
};
