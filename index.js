var ngrok = require('ngrok'),
    request = require('request');

const AUTH_TOKEN = '5X4uVcVCNe79sFyRiADhC_3xgzdDjww1PrCuuEa9DQF';
const PI_NAME = 'MACBOOK';
const PI_URL_STORE_ENDPOINT = 'https://pilinkstore.herokuapp.com/api/mypis';
const PORT_TO_FORWARD = 3000;

ngrok.connect({
    proto: 'http',
    port: PORT_TO_FORWARD,
    authtoken: AUTH_TOKEN
}, function(err, url) {


    var query = {
        where: {
            piname: PI_NAME
        }
    }
    var queryString = encodeURIComponent(JSON.stringify(query));
    var finalEndpoint = PI_URL_STORE_ENDPOINT + '?filter=' + queryString;
    var requestConfigToSearchExistingURL = {
        url: finalEndpoint,
        method: 'GET',
        json: true
    }

    request(requestConfigToSearchExistingURL, function(error, httpResponse, body) {
        if (error) {
            console.log(error);
            return;
        }

        console.log(body)
        if (body.length == 0) {
            // need to create it for the first time
            var reqConfig = {
                url: PI_URL_STORE_ENDPOINT,
                method: 'POST',
                json: {
                    port: PORT_TO_FORWARD,
                    url: url,
                    piname: PI_NAME
                }
            }
            request(reqConfig, function(err, httpResponse, body) {
                if (err) {
                    return console.error('URL Update Error', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
        } else {
            var reqConfig = {
                url: PI_URL_STORE_ENDPOINT + '/' + body[0].id,
                method: 'PUT',
                json: {
                    port: PORT_TO_FORWARD,
                    url: url,
                    piname: PI_NAME
                }
            }

            request(reqConfig, function(err, httpResponse, body) {
                if (err) {
                    return console.error('URL Update Error', err);
                }
                console.log('Upload successful!  Server responded with:', body);
            });
        }
    });
});
