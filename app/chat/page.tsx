"use client";

import ProfileCard from "../components/ProfileCard";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/SideBar";
import { useState } from "react";
import VideoBox from "../components/VideoBox";
import RouteGuard from "@/components/auth/RouteGuard";

export default function Home() {
  const [isVideoShared, setIsVideoShared] = useState(false);
  const [videopopup, setVideopopup] = useState(false);
  const handleShareVideoClick = () => {
    setIsVideoShared(!isVideoShared); // Toggle the state
  };

  return (
    <RouteGuard>
      <div className="h-screen w-full bg-gradient-to-b from-purple-900 to-black  text-white flex">
        {/* Sidebar */}
        <div className="w-[18%]">
          <Sidebar />
        </div>

        {isVideoShared && (
          <div className="w-[50%]">
            <VideoBox videopopup={videopopup} />
          </div>
        )}
        <div
          className={`pt-4 transition-all duration-300 ${
            isVideoShared ? "w-[30%] pl-2" : "w-[60%] ml-2 mx-auto text-center"
          }`}
        >
          <ChatBox
            handleShareVideoClick={handleShareVideoClick}
            setVideopopup={setVideopopup}
            videopopup={videopopup}
          />
        </div>

        {/* Top Navigation */}
        {/* <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={handleShareVideoClick}
          className="bg-black text-white p-2 rounded-full"
        >
          {isVideoShared ? "Stop Sharing Video" : "Share Video"}
        </button>{" "}
        <button className="bg-black p-2 rounded-full">🔔</button>
        <button className="bg-black p-2 rounded-full">👥</button>
      </div> */}
      </div>
    </RouteGuard>
  );
}
