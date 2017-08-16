let fcmToken = localStorage.getItem('fcmToken'), haveToken=false;
let fireDataRef = firebase.database().ref('/projects/notify/fcmTokens');
let ableNotificationBtn = document.querySelector('#ableIt');
saveMessagingDeviceToken().then(_=>{
  console.log("sav");
  doWork()
});

firebase.messaging().onMessage(function(payload) {
  console.log(payload.notification);
  if (navigator.serviceWorker.controller) {
    return new Promise(function(resolve, reject) {
      let messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage(payload.notification, [messageChannel.port2]);
    }).then(_=>{
      console.log("yee");
    })
  }else return
});

firebase.messaging().onTokenRefresh(_=>{
  console.log("onTokenRefresh");
  saveMessagingDeviceToken();
});

function enableIt() {
	saveMessagingDeviceToken();
	if (!haveToken) {
	  firebase.messaging().requestPermission().then(function() {
	    // Notification permission granted.
	    this.saveMessagingDeviceToken();
	  }.bind(this)).catch(function(error) {
      localStorage.setItem('fcmToken',"");
	    console.log('Unable to get permission to notify.', error);
	  });
	}
}
function disableIt() {
  console.log("disable");
  haveToken=false;
  ableNotificationBtn.textContent = "enable Notification";
  ableNotificationBtn.onclick = _=> enableIt();
  fireDataRef.set({[fcmToken]:"na"}).then(_=>console.log("Notification Setting Saved"));
}

function saveMessagingDeviceToken() {
  return new Promise(r=>{
    firebase.messaging().getToken()
    .then(function(currentToken) {
      if (currentToken) {
        console.log("fcmToken",fcmToken,"currentToken",currentToken);
        haveToken = true;
        ableNotificationBtn.textContent = "disable Notification";
        ableNotificationBtn.onclick =_=> disableIt();
        if (fcmToken!==currentToken) {
          console.log("obj");
          localStorage.setItem('fcmToken',currentToken);
          fireDataRef.set({[currentToken]:"ya"}).then(_=>console.log("1Notification Setting Saved"));
          fcmToken = currentToken;
          return r();
        }else{
          fireDataRef.child(fcmToken).once('value',snap=>{
            console.log("opopop",snap.val());
            if (snap.val() === "na") {
              haveToken=false;
              ableNotificationBtn.textContent = "enable Notification";
              ableNotificationBtn.onclick = _=> enableIt();
            }
            fcmToken = currentToken;
            return r();
          })
        }
      } else {
        ableNotificationBtn.textContent = "enable Notification";
        ableNotificationBtn.onclick = _=> enableIt();
        localStorage.setItem('fcmToken',"");

        haveToken = false;
        // Need to request permissions to show notifications.
        this.requestNotificationsPermissions();
        return r();
      }
    }.bind(this))
    .catch(function(error){
      if (error.code ==="messaging/notifications-blocked") {
        localStorage.setItem('fcmToken',"");
        haveToken = false;
        console.log("Notification is Blocked Please Give Permission from Browser Setting",3000);
      }
      return r();
    })
  })
};
function doWork() {
  
navigator.serviceWorker.register('sw.js')
.then(function(reg) {
  if (reg.waiting) {
    console.log("reg.waiting");
    updateReady(reg.waiting)
    return;
  }
  if (reg.installing) {
    trackInstalling(reg.installing)
    return;
  }
  reg.addEventListener('updatefound', function() {
    trackInstalling(reg.installing)
    return;
  });
});

function trackInstalling(worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
    updateReady(worker)
    }
  });
};
function updateReady(worker) {
  if (haveToken) {
    console.log(haveToken);
    worker.postMessage("skipWaiting");
  }
}

navigator.serviceWorker.addEventListener('message', function(event) {
  console.log('Received a message from service worker: ', event.data);
});


var maxCount = 4,count = 0;
function sendMess() {
  while(count<maxCount){
    if (navigator.serviceWorker.controller) {
      return new Promise(function(resolve, reject) {
        let messageChannels = new MessageChannel();
        messageChannels.port1.onmessage = function(event) {
        };
        navigator.serviceWorker.controller.postMessage({title:"Mast Admi",body:" ".repeat(count++)+"-"}, [messageChannels.port2]);
      })
    }else return
  }
  clearInterval(messIntereval);
}
var messIntereval = setInterval(_=> {if (haveToken){sendMess(); console.log(haveToken)}}, 200);
}
