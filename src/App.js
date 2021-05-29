import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import trumpet from "./audio/trumpet.mp3";
//import stuck from "./audio/stuck.mp3";
const socket = io("https://botoroid.xyz");
const socket2 = io("https://second.botoroid.xyz");
//const socket = io("http://localhost:4000");

const App = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertPlaying, setAlertPlaying] = useState(false);
  const [page, setPage] = useState(<div></div>);

  useEffect(() => {
    socket.on("event", (data) => {
      setAlerts((prev) => [...prev, data]);
    });
    socket2.on("event", (data) => {
      setAlerts((prev) => [...prev, data]);
    });
  }, []);
  useEffect(() => {
    if (alerts.length > 0 && !alertPlaying) {
      setAlertPlaying(true);
      setPage(
        <div>
          <h2
            style={{
              background: "orange",
              marginTop: 100,
              textAlign: "center",
              fontSize: 40,
            }}
          >
            {alerts[0].text}
          </h2>
          <audio>{alertPlay()}</audio>
        </div>
      );
      setTimeout(() => {
        setAlerts((prevState) => {
          let alerts = [...prevState];
          alerts.shift();
          return alerts;
        });
        setPage(<div></div>);
        setAlertPlaying(false);
      }, 10000);
    }
    // eslint-disable-next-line
  }, [alerts, alertPlaying]);

  function speak() {
    if (alerts.length !== 0) {
      var uInt8Array = new Uint8Array(alerts[0].tts);
      var arrayBuffer = uInt8Array.buffer;
      var blob = new Blob([arrayBuffer]);
      var url = URL.createObjectURL(blob);
      let textToSpeech = new Audio(url);
      textToSpeech.volume = 0.9;
      textToSpeech.play();
    }
  }
  function alertPlay() {
    let sound = new Audio(trumpet);
    sound.volume = 0.4;
    sound.play();
    setTimeout(() => {
      speak();
    }, 5000);
  }
  return page;
};

export default App;
