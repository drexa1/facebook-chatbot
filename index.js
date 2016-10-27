var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Current version
ver = 'v.0.0.5';

// Facebook pageId
pageId = '1167308473348175';

// Server endpoint
app.get('/', function (req, res) {
    res.send('JKDbot here! ' + ver);
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
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            switch(event.message.text) {
                case("cmd_version"): 
                    sendMessage(event.sender.id, {text: ver}); 
                    break;
                case("cmd_subscribers"): 
                    sendMessage(event.sender.id, {text: getUserIds()}); 
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
        url: 'https://graph.facebook.com/v2.8/me/messages',
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

// Collects the userId's from the likes page
var getUserIds = function() {
    var pageLikesDocument = getPageLikesDocument();
    console.log(likesPage);
    
    /*
    var userIds = ""; 
    Array.prototype.forEach.call(document.querySelectorAll('a[data-gt]'), function(a){ 
        var gt = JSON.parse(a.dataset.gt); 
        if(!gt.engagement || gt.engagement.eng_type !== "1") 
            return; 
        userIds += a.innerHTML + ': ' + gt.engagement.eng_tid + "\n"; 
    }); 
    console.log(userIds);
    */
}

// Retrieves the page with the likes of a page
var getPageLikesDocument = function() {
    request({
        url: 'https://www.facebook.com/browse/?type=page_fans&page_id='+pageId,
        method: 'GET'
    }, function(error, response, body) {
        if (error) {
            console.log('Error retrieving page likes: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Retrieves the timezone of a user
var getUserTimezone = function(userId) {
    return "-9";
};
