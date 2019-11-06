// ----------------------------------------------
function invokeParticleMicrocontroller(particleFunction, callback){

    var deviceId = '2d0030000d499999999999';  // This is the Particle Photon Device ID
    
    var options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/' + deviceId + '/' + particleFunction,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*.*'
        }
    };

    var postData = "access_token=999999999999999999999999999999999999999";   // This is the Particle Photon access token

    console.log("Post Data: " + postData);

    // Call Particle API
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        var body = "";

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);

            body += chunk;
        });

        res.on('end', function () {
            callback(body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}