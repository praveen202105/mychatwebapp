interface UserInfo {
  userName: string;
  nickname: string;
}
interface Message {
  user: string;
  content: string; // Adjust fields based on your actual message structure
}

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/userStore";
// import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react"; // Smile is for the emoji icon

// import NicknameForm from "../components/login";
// import OnlineUsersList from "../components/OnlineUsersList";
// import ChatBox from "../components/ChatBox";
// import SignUpForm from "../components/SignUpForm";
// import SignInForm from "../components/SignInForm";
import axios from "axios";
import { Button } from "@/components/ui/button";
interface CustomSocket extends Socket {
  nickname?: string;
}

const ChatBox: React.FC = () => {
  const user = useUserStore((state) => state.user);

  console.log(user?.username);
  // const [nickname, setNickname] = useState("");
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const [nicknameSet, setNicknameSet] = useState<boolean>(false);

  // const [messages, setMessages] = useState<Message[]>([]);
  //  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  // const [partnerId, setPartnerId] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
  // const [stream, setStream] = useState(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [onlineUsersCount, setOnlineUsersCount] = useState(0); // State for total online users
  // const [onlineUsers, setOnlineUsers] = useState([]); // State for total online users
  const [onlineUsers, setOnlineUsers] = useState<Record<string, UserInfo>>({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [Friendrequest, setFriendRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );

  const [currentMessage, setCurrentMessage] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null); // Reference to ScrollArea

  const handleSendMessage = () => {
    console.log("messs", currentMessage);

    if (socketRef.current && currentMessage.trim() !== "") {
      socketRef.current.emit("sendMessage", {
        text: currentMessage,
        nickname,
      });
    }
    if (currentMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "You", text: currentMessage },
      ]);
      setCurrentMessage(""); // Clear the input field
    }
  };

  const socketRef = useRef<CustomSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null); // Explicit type for peerRef

  const localVideoRef = useRef(null);
  // const remoteVideoRef = useRef(null);
  // const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useUserStore((state) => state.remoteVideoRef);

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData): void => {
    setCurrentMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  // const [user,setUser]=useState("");
  const config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  useEffect(() => {
    if (user?.username) {
      setNickname(user?.username);
      setNicknameSet(true);
    }
  }, [user]);
  useEffect(() => {
    if (nicknameSet) {
      socketRef.current = io("http://localhost:4000");

      if (socketRef.current) {
        socketRef.current.on("connect", () => {
          setConnected(true);
          if (socketRef.current) {
            // Add a null check
            socketRef.current.nickname = nickname;
            socketRef.current.emit("joinRandomChat", { nickname });
          }
        });

        if (socketRef.current) {
          socketRef.current.emit("setUserName", {
            userName: user,
            nickname: nickname,
          });

          // socketRef.current.on(
          //   "joinRequestNotification",
          //   ({ requesterId, requesterNickname }) => {
          //     setPendingRequests((prev) => {
          //       const alreadyExists = prev.some(
          //         (request) => request.requesterId === requesterId
          //       );
          //       if (!alreadyExists) {
          //         return [...prev, { requesterId, requesterNickname }];
          //       }
          //       return prev;
          //     });
          //   }
          // );

          socketRef.current.on("message", (msg) => {
            if (msg.user !== nickname) {
              setMessages((prevMessages) => [...prevMessages, msg]);
            }
          });

          socketRef.current.on("partnerId", ({ partnerId }) => {
            if (socketRef.current) {
              // Set mySocket
              useUserStore.getState().setMySocket(socketRef.current);
              // useUserStore.getState().setSocketId(socketRef.current.id);

              console.log("my id", socketRef.current.id);
            }
            console.log("my partner id", partnerId);
            // setPartnerId(partnerId);
            useUserStore.getState().setPartnerSocket(partnerId);
          });

          socketRef.current.on("onlineUsers", (users) => {
            setOnlineUsers(users);
            setOnlineUsersCount(Object.keys(users).length);
          });
        }
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect(); // Disconnect the socket
          socketRef.current.off("connect");
          socketRef.current.off("joinRequestNotification");
          socketRef.current.off("message");
          socketRef.current.off("partnerId");
          socketRef.current.off("onlineUsers");
          // socketRef.current.off("webrtcOffer");
          // socketRef.current.off("webrtcAnswer");
          // socketRef.current.off("iceCandidate");
        }
      };
    }
  }, [nicknameSet]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    // Use a small delay to ensure DOM updates are complete
    setTimeout(scrollToBottom, 0);
  }, [messages]);

  return (
    <>
      <div className="h-[90%]  pl-4 pr-4 pt-0 overflow-y-auto">
        <div className="mr-0">
          {/* {videopopup ? (
            <>
              <Button
                onClick={() => {
                  handleShareVideoClick();
                  setVideopopup(false);
                }}
                className="bg-black text-white p-2 rounded-full"
              >
                DON'T WANT VEDIO CALL
              </Button>
            </>
          ) : (
            // <Button
            //   onClick={() => {
            //     handleShareVideoClick();
            //     setVideopopup(true);
            //   }}
            //   className="bg-black text-white p-2 rounded-full"
            // >
            //   WANNA TO DO VEDIO CALL
            // </Button>
          )} */}
        </div>
        <div
          ref={scrollRef}
          className="bg-black text-white p-4 rounded-lg shadow-lg mt-4 overflow-y-auto h-full"
        >
          {/* Chat Messages */}
          {messages.map((message, index) => {
            const isEmojiOnly = /^[\p{Emoji}\s]+$/u.test(message.text);

            return (
              <div
                key={index}
                className={`${
                  message.user === "System"
                    ? "flex justify-center items-center mb-4"
                    : `flex items-${
                        message.user === "You" ? "end justify-end" : "start"
                      } space-x-4 mb-4`
                }`}
              >
                {/* Show avatar for other users */}
                {message.user !== "System" && message.user !== "You" && (
                  <div className="flex flex-col flex-start">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User"
                      className="rounded-full"
                    />
                    {message.user}
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <p
                    className={`${
                      message.user === "System"
                        ? "bg-gray-600 text-center"
                        : message.user === "You"
                        ? "bg-purple-800"
                        : "bg-purple-700"
                    } px-4 py-2 rounded-lg inline-block mt-1 ${
                      message.user === "System" ? "mx-auto" : ""
                    } ${isEmojiOnly ? "text-5xl leading-none" : "text-base"}`}
                  >
                    {message.text}
                  </p>
                </div>

                {/* Show avatar for "You" */}
                {/* {message.user === "You" && (
                  <div className="flex flex-col flex-end">
                    <div>
                      <img
                        src="https://via.placeholder.com/40"
                        alt="You"
                        className="rounded-full"
                      />
                    </div>
                    <div className="pl-0 bg-pink-600 text-left">You</div>
                  </div> */}

                {message.user === "You" && (
                  <div className="flex flex-col flex-end">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User"
                      className="rounded-full"
                    />
                    {message.user}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-12 left-0  bg-white p-2 rounded-lg shadow-lg z-10"
          style={{ width: "370px", height: "470px", overflow: "auto" }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex items-center  w-3/4 mt-4 bg-black rounded-lg border border-purple-700 focus-within:border-2 focus-within:border-white">
        <button
          className="p-2 text-white hover:bg-white rounded-full flex items-center justify-center"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile color="#a51acb" size={28} />
        </button>

        <input
          type="text"
          placeholder="Enter message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="p-2 text-white hover:bg-white rounded-full flex items-center justify-center"
          onClick={handleSendMessage}
        >
          <Send color="#a51acb" size={28} />
        </button>
      </div>
    </>
  );
};

export default ChatBox;
