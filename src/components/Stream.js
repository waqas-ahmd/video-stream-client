import React, { useRef, useState } from "react";
import axios from "axios";
import { styles } from "../styles";
const API_ENDPOINT = "http://localhost:5001";

const Stream = ({ home }) => {
  var streamRef = useRef();
  const [id, setId] = useState("");
  const stream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    streamRef.current.srcObject = stream;
  };

  function createPeer() {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    return peer;
  }

  async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = { sdp: peer.localDescription };
    const { data } = await axios.post(`${API_ENDPOINT}/broadcast`, payload);
    setId(data.id);
    const desc = new RTCSessionDescription(data.payload.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
  }
  return (
    <div style={styles.screen}>
      <div style={styles.video}>
        <video autoPlay ref={streamRef} />
      </div>
      <div>Video ID: {id}</div>
      <button onClick={stream} style={styles.button}>
        START
      </button>
      <button onClick={home} style={styles.button}>
        Home
      </button>
    </div>
  );
};

export default Stream;
