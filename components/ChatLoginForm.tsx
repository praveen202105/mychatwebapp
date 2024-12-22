"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestLoginForm from "@/components/auth/GuestLoginForm";
import UserLoginForm from "@/components/auth/UserLoginForm";

export default function ChatLoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-purple-900"></div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Say Hello...
          </h1>
          <p className="text-gray-500 mb-6">
            Talk to new people anywhere, any time!
          </p>

          <Tabs defaultValue="guest" className="w-full">
            {/* Tab Triggers */}

            {!isRegistering && (
              <TabsList className="w-82 flex justify-around bg-gray-200 rounded-lg mb-6">
                <TabsTrigger className="w-40" value="guest">
                  Guest User
                </TabsTrigger>
                <TabsTrigger className="w-40" value="user">
                  User Login
                </TabsTrigger>
              </TabsList>
            )}

            {/* Guest User Tab */}
            <TabsContent value="guest">
              <GuestLoginForm />
            </TabsContent>

            {/* User Login/Registration Tab */}
            <TabsContent value="user">
              <UserLoginForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
