window.onload = () => {

if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
  document.getElementById('moApi').innerHTML = 'Generic Sensor API';
  
  var index = 0;
  var node = document.createElement("LI");                 // Create a <li> node
  var textnode = document.createTextNode('datos');         // Create a text node
  node.appendChild(textnode);                              // Append the text to <li>
  document.getElementById('data').appendChild(node);     // Append <li> to <ul> with id="myList"
  console.log('mensaje');
  let lastReadingTimestamp;
  let accelerometer = new LinearAccelerationSensor();
  accelerometer.addEventListener('reading', e => {
    if (lastReadingTimestamp) {
      intervalHandler(Math.round(accelerometer.timestamp - lastReadingTimestamp));
    }
    lastReadingTimestamp = accelerometer.timestamp
    accelerationHandler(accelerometer, 'moAccel');
  });
  accelerometer.start();
  
  if ('GravitySensor' in window) {
    let gravity = new GravitySensor();
    gravity.addEventListener('reading', e => accelerationHandler(gravity, 'moAccelGrav'));
    gravity.start();
  }
  
  let gyroscope = new Gyroscope();
  gyroscope.addEventListener('reading', e => rotationHandler({
    alpha: gyroscope.x,
    beta: gyroscope.y,
    gamma: gyroscope.z
  }));
  gyroscope.start();
  
} else if ('DeviceMotionEvent' in window) {
  document.getElementById('moApi').innerHTML = 'Device Motion API';
  
  var onDeviceMotion = function (eventData) {
    accelerationHandler(eventData.acceleration, 'moAccel');
    accelerationHandler(eventData.accelerationIncludingGravity, 'moAccelGrav');
    rotationHandler(eventData.rotationRate);
    intervalHandler(eventData.interval);
  }
  
  window.addEventListener('devicemotion', onDeviceMotion, false);
} else {
  document.getElementById('moApi').innerHTML = 'No Accelerometer & Gyroscope API available';
}

function accelerationHandler(acceleration, targetId) {
  var info, xyz = " acc X, Y, Z";

  info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
  info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
  info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
  document.getElementById(targetId).innerHTML = info;
  var node = document.createElement("LI");                 // Create a <li> node
  var textnode = document.createTextNode(info);         // Create a text node
  node.appendChild(textnode);                              // Append the text to <li>
  document.getElementById('data').appendChild(node);     // Append <li> to <ul> with id="myList"
}

function rotationHandler(rotation) {
  var info, xyz = "rot X, Y, Z";

  info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(3));
  info = info.replace("Y", rotation.beta && rotation.beta.toFixed(3));
  info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(3));
  document.getElementById('moRotation').innerHTML = info;

  var node = document.createElement("LI");                 // Create a <li> node
  var textnode = document.createTextNode(info);         // Create a text node
  node.appendChild(textnode);                              // Append the text to <li>
  document.getElementById('data').appendChild(node);     // Append <li> to <ul> with id="myList"  
}

function intervalHandler(interval) {
  document.getElementById("moInterval").innerHTML = interval;
}

};