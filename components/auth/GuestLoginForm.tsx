// "use client";

import { useUserStore } from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Toast } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function GuestLoginForm() {
  const [nickname, setNickname] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUser({ username: nickname });
    if (nickname) router.push("/chat");
    else {
      toast({
        title: "Nickname is required",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nickname</label>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 w-full p-3 border rounded-md focus:ring-purple-600"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-900 text-white p-3 rounded-md"
      >
        Join as Guest
      </button>
    </form>
  );
}
