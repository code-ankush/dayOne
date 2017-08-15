const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.get('/projects', function (req, res) {
  res.send('Hello World!')
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.projects = functions.https.onRequest(app);
