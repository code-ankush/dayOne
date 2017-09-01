const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');

const app = express();
const userFriendlyData = _=> decodeURIComponent(_.replace("%2E","."));
const firebaseFriendlyData = _=> encodeURIComponent(_).replace(/\./g, '%2E');


// var allTemplates = {projects:{notify:``}}
// app.get('/projects', function (req, res) {
//   res.send('Hello World!')
// })
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


// exports.projects = functions.https.onRequest(app);



// notification project
exports.project_notify = functions.database.ref('/projects/notify/messageId/{messageId}').onWrite(event => {
  firebaseAdmin.database().ref("projects").child("notify/functions/project_notify").once("value",snap=>{
    eval(userFriendlyData(snap.val()));
  });
});