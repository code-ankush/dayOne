const snapshot = event.data;

  const title = snapshot.val().title;
  const body = snapshot.val().body;
  const token = snapshot.val().token;
  const payload = {
    notification: {
      title: title,
      body: body
    }
  };
  var options = {
		  priority: "high",
		  timeToLive: 3
		};

  return admin.messaging().sendToDevice(token, payload,options).then(_=>{
  	console.log(snapshot.val().title,"is successful")
  })