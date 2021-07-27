import React, { useRef, useState } from "react";
import { styles } from "../styles";
import axios from "axios";

const API_ENDPOINT = process.env.NODE_ENV === "production" ? "https://intense-tor-63737.herokuapp.com" : "http://localhost:5001";

const View = ({ home }) => {
  const [id, setId] = useState("");
  var viewRef = useRef();
  const view = () => {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" });
  };

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  }

  async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = { sdp: peer.localDescription };
    const { data } = await axios.post(`${API_ENDPOINT}/consumer`, {
      payload,
      id,
    });
    console.log(data)
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    viewRef.current.srcObject = e.streams[0];
  }

  return (
    <div style={styles.screen}>
      <div style={styles.video}>
        <video autoPlay ref={viewRef} />
      </div>
      <input
        style={styles.input}
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter ID"
      />
      <button onClick={view} style={styles.button}>
        VIEW
      </button>
      <button onClick={home} style={styles.button}>
        Home
      </button>
    </div>
  );
};

export default View;
