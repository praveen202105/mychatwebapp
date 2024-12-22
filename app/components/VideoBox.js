import React, { useState, useRef, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Stream } from "stream";

const VideoBox = () => {
  const mySocket = useUserStore((state) => state.mySocket);
  const partnerId = useUserStore((state) => state.partnerSocket);
  const peerRef = useRef(null);
  const stream = useUserStore((state) => state.stream);
  const setStream = useUserStore((state) => state.setStream);
  const localVideoRef = useUserStore((state) => state.localVideoRef);
  const remoteVideoRef = useUserStore((state) => state.remoteVideoRef);
  const setLocalVideoRef = useUserStore((state) => state.setLocalVideoRef);
  const setRemoteVideoRef = useUserStore((state) => state.setRemoteVideoRef);

  const config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  useEffect(() => {
    if (mySocket) {
      mySocket.on("webrtcOffer", async ({ offer, from }) => {
        const peer = createPeer(from, false);

        // Set remote description safely
        try {
          if (peer.signalingState === "stable") {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            mySocket.emit("webrtcAnswer", { answer, partnerId: from });
          }
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      });

      mySocket.on("webrtcAnswer", async ({ answer }) => {
        if (
          peerRef.current &&
          peerRef.current.signalingState === "have-local-offer"
        ) {
          try {
            await peerRef.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (error) {
            console.error("Error setting remote description:", error);
          }
        }
      });

      mySocket.on("iceCandidate", ({ candidate }) => {
        if (peerRef.current) {
          peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    }

    return () => {
      if (mySocket) {
        mySocket.off("webrtcOffer");
        mySocket.off("webrtcAnswer");
        mySocket.off("iceCandidate");
      }
    };
  }, [mySocket, partnerId]);

  const createPeer = (partnerId, isInitiator) => {
    const peer = new RTCPeerConnection(config);
    peerRef.current = peer;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        mySocket.emit("iceCandidate", {
          candidate: event.candidate,
          partnerId,
        });
      }
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (isInitiator && stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    return peer;
  };

  const shareVideo = async () => {
    if (partnerId) {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        setStream(localStream);
      } else {
        console.error("localVideoRef is not set");
      }

      const peer = createPeer(partnerId, true);
      localStream
        .getTracks()
        .forEach((track) => peer.addTrack(track, localStream));

      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        mySocket.emit("webrtcOffer", { offer, partnerId });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
  };

  const initializeStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      setStream(localStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    initializeStream();
  }, []);

  useEffect(() => {
    const initializeAndShareVideo = async () => {
      if (partnerId) {
        await initializeStream();
        await shareVideo();
      }
    };

    initializeAndShareVideo();
  }, [partnerId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-auto border rounded "
        ></video>
        <p className="text-center mt-2">Other User</p>
      </div>

      <div className="w-full h-full">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-full h-40 "
        ></video>
        <p className="text-center mt-2">You</p>
      </div>
    </div>
  );
};

export default VideoBox;
