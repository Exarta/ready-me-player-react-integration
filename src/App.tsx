import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const iframe = useRef<any>();

  const subscribe = (event: any) => {
    const json = parse(event);
    if (json?.source !== "readyplayerme") {
      return;
    }

    // Susbribe to all events sent from Ready Player Me once frame is ready
    if (json.eventName === "v1.frame.ready") {
      iframe.current.contentWindow.postMessage(
        JSON.stringify({
          target: "readyplayerme",
          type: "subscribe",
          eventName: "v1.**",
        }),
        "*"
      );
    }

    // Get avatar GLB URL
    if (json.eventName === "v1.avatar.exported") {
      console.log(`Avatar URL: ${json.data.url}`);
      setAvatarUrl(json.data.url);
    }

    // Get user id
    if (json.eventName === "v1.user.set") {
      console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
    }
  };

  window.addEventListener("message", subscribe);
  document.addEventListener("message", subscribe);

  const parse = (event: any) => {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  };
  return (
    <div>
      <iframe
        style={{
          width: "100%",
          height: "100vh",
        }}
        allow="camera *; microphone *"
        src="https://demo.readyplayer.me/avatar?frameApi&clearCache"
        title="Ready Player Me"
        ref={iframe}
      ></iframe>
    </div>
  );
}

export default App;
