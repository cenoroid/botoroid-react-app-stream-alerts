import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";
import trumpet from "./audio/trumpet.mp3";
import stuck from "./audio/stuck.mp3";
import AWS from "aws-sdk";
const socket = io("https://botoroid-express-app.herokuapp.com");
//const socket = io("http://localhost:4000");
const Polly = new AWS.Polly(
  {
    accessKeyId: "AKIA2G3LWCM2UUXUDZH4",
    secretAccessKey: "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",
    region: "eu-west-3",
  },
  (data) => {
    console.log(data);
  }
);
class App extends Component {
  componentDidMount() {
    this.listenToServer();
  }
  alertsArray = [];
  listenToServer = () => {
    socket.on("event", (data) => {
      console.log(data);
      if (this.state.alert.length > 0) {
        this.alertsArray.push(data);
      } else {
        this.setState({ alert: [data] });
      }
    });
  };
  alertPlaying = false;
  speak = () => {
    if (this.state.alert.length !== 0) {
      console.log("ok");
      this.alertPlaying = true;
      Polly.synthesizeSpeech(
        {
          Text:
            this.state.alert[0].user +
            " has redeemed " +
            this.state.alert[0].event,
          TextType: "text",
          VoiceId: "Brian",
          OutputFormat: "mp3",
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else if (data) {
            let uInt8Array = new Uint8Array(data.AudioStream);
            let arrayBuffer = uInt8Array.buffer;
            let blob = new Blob([arrayBuffer]);
            let url = URL.createObjectURL(blob);
            console.log(url);
            let textToSpeech = new Audio(url);
            textToSpeech.volume = 0.4;
            textToSpeech.play();

            console.log(this.state);
          }
        }
      );
    }
  };
  alertPlay = () => {
    console.log("oks");
    let sound = new Audio(trumpet);
    sound.volume = 0.1;
    sound.play();
    setTimeout(() => {
      this.speak();
    }, 5000);
    setTimeout(() => {
      this.setState((prevState) => {
        let alerts = Array.from(prevState);
        alerts.shift();
        console.log(this.alertsArray);
        alerts = alerts.concat(this.alertsArray);
        this.alertsArray = [];
        console.log(alerts);
        return { alert: alerts };
      });
    }, 10000);
  };
  state = { alert: [], alertPlaying: false };
  render() {
    if (this.state.alert.length === 0) {
      return <div></div>;
    }
    console.log(this.state);
    return (
      <div>
        <h2
          style={{
            background: "grey",
            marginTop: 100,
            textAlign: "center",
            fontSize: 40,
          }}
        >
          {this.state.alert[0].user} has redeemed {this.state.alert[0].event}
        </h2>
        <audio>{this.alertPlay()}</audio>
      </div>
    );
  }
}

export default App;
