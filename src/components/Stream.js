import React, { useRef, useState } from "react";
import axios from "axios";
import { styles } from "../styles";
const API_ENDPOINT = process.env.NODE_ENV === "production" ? "https://intense-tor-63737.herokuapp.com" : "http://localhost:5001";

const Stream = ({ home }) => {
  const [streamStarted, setStreamStarted] = useState(false)
  var streamRef = useRef();
  const [id, setId] = useState("");
  const stream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    setStreamStarted(true)
    streamRef.current.srcObject = stream;
  };

  function createPeer() {
    const peer = new RTCPeerConnection({iceServers: [{ urls: "stun:stun.stunprotocol.org" }]});
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
      {streamStarted && <>
        <div style={styles.video}>
          <video autoPlay ref={streamRef} />
        </div>
        <div>Video ID: {id}</div>
      </>}
      <button onClick={stream} style={styles.button}>
        START
      </button>
      <div onClick={home} style={styles.back}>
          Back
      </div>
    </div>
  );
};

export default Stream;
