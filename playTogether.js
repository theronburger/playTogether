import { GlobalKeyboardListener } from "node-global-key-listener";
import * as ks from "node-key-sender";
import * as mqtt from "mqtt";

const v = new GlobalKeyboardListener();
const client = mqtt.connect("mqtt://test.mosquitto.org");

const me = "Theron";
const yous = ["Anna"];

//Open the pipe and start listerning to me
client.on("connect", function () {
  client.subscribe("playTogether/" + me, function (err) {
    if (err) {
      console.log("oh boo : " + err);
    }
  });
});
client.on("message", function (topic, message) {
  //basically only play / pause messages so...
  console.log("got play/pause message");
  ks.sendKey("space");
});

//Log the buttons and send them to the pipes
v.addListener(function (e, down) {
  if (e.state == "DOWN" && e.name == "SPACE") {
    console.log("got a space, sending to yous");
    yous.forEach((you) => {
      client.publish("playTogether/" + you, "play/pause");
    });
  }
});
