"use client";

import ProfileCard from "../components/ProfileCard";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/SideBar";
import { useState } from "react";
import VideoBox from "../components/VideoBox";
import RouteGuard from "@/components/auth/RouteGuard";

export default function Home() {
  const [isVideoShared, setIsVideoShared] = useState(true);
  // const [videopopup, setVideopopup] = useState(true);
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
            <VideoBox />
          </div>
        )}
        <div
          className={`pt-4 transition-all duration-300 w-[30%] pl-2" ml-2 mx-auto text-center"
          }`}
        >
          <ChatBox />
        </div>
      </div>
    </RouteGuard>
  );
}
