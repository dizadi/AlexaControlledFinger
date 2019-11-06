'use strict';
var http = require('https');

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {

return { outputSpeech: {

type: 'PlainText',

text: output, },

card: {
type: 'Simple',
title: `SessionSpeechlet - ${title}`, content: `SessionSpeechlet - ${output}`,

}, reprompt: {

outputSpeech: { type: 'PlainText', text: repromptText,

}, },

shouldEndSession, };

}

function buildResponse(sessionAttributes, speechletResponse) { return {

version: '1.0', sessionAttributes,
response: speechletResponse,

}; }

// --------------- Functions that control the skill\'s behavior ----------------------- function getWelcomeResponse(callback) {

const sessionAttributes = {};
const cardTitle = 'Welcome';
const speechOutput = 'Welcome to MACS LAB! Please say close finger!'; const repromptText = 'Please say close finger';
const shouldEndSession = false;

16

callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) { const cardTitle = 'Session Ended';
const speechOutput = 'Goodbye!';
const shouldEndSession = true;

callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));

}

function closeFinger(intent, session, callback) { const cardTitle = intent.name;
let repromptText = '';
let sessionAttributes = {};

const shouldEndSession = false; let speechOutput = 'Closing Finger';

invokeParticleMicrocontroller('closeFinger', function(resp){ callback(sessionAttributes,buildSpeechletResponse(cardTitle,

speechOutput, repromptText, shouldEndSession)); });

}

// ----------------------------------------------
function invokeParticleMicrocontroller(particleFunction, callback){

var deviceId = '2d0030000d499999999999'; // This is the Particle Photon Device ID

var options = {
hostname: 'api.particle.io',
port: 443,
path: '/v1/devices/' + deviceId + '/' + particleFunction, method: 'POST',
headers: {

'Content-Type': 'application/x-www-form-urlencoded',

'Accept': '*.*' }

};

17

"access_token=999999999999999999999999999999999999999"; Particle Photon access token

console.log("Post Data: " + postData);

// Call Particle API
var req = http.request(options, function(res) {

console.log('STATUS: ' + res.statusCode); console.log('HEADERS: ' + JSON.stringify(res.headers));

var body = "";

res.setEncoding('utf8'); res.on('data', function (chunk) {

console.log('BODY: ' + chunk);

body += chunk; });

res.on('end', function () { callback(body);

}); });

req.on('error', function(e) {
console.log('problem with request: ' + e.message);

});

// write data to request body req.write(postData); req.end();

}
// --------------- Events -----------------------
function onSessionStarted(sessionStartedRequest, session) {

// This is the

requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

function onLaunch(launchRequest, session, callback) {
console.log(`onLaunch requestId=${launchRequest.requestId},

sessionId=${session.sessionId}`);

var postData =

console.log(`onSessionStarted

18

getWelcomeResponse(callback); }

function onIntent(intentRequest, session, callback) {
console.log(`onIntent requestId=${intentRequest.requestId},

sessionId=${session.sessionId}`);

const intent = intentRequest.intent;
const intentName = intentRequest.intent.name;

if (intentName === 'MoveFingerIntent') { closeFinger(intent, session, callback);

} else if (intentName === 'AMAZON.HelpIntent') { getWelcomeResponse(callback);

} else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {

handleSessionEndRequest(callback); } else {

throw new Error('Invalid intent'); }

}

function onSessionEnded(sessionEndedRequest, session) { console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId},

sessionId=${session.sessionId}`); }

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest, // etc.) The JSON body of the request is provided in the event parameter. exports.handler = (event, context, callback) => {

try {

console.log(`event.session.application.applicationId=${event.session.application. applicationId}`);

if (event.session.new) {
onSessionStarted({ requestId: event.request.requestId }, event.session);

}

if (event.request.type === 'LaunchRequest') { onLaunch(event.request,

event.session,

19

(sessionAttributes, speechletResponse) => {
callback(null, buildResponse(sessionAttributes,

speechletResponse)); });

} else if (event.request.type === 'IntentRequest') { onIntent(event.request,

event.session,
(sessionAttributes, speechletResponse) => {

speechletResponse)); });

} else if (event.request.type === 'SessionEndedRequest') { onSessionEnded(event.request, event.session); callback();

}
} catch (err) {

callback(err); }

};

callback(null, buildResponse(sessionAttributes,

20