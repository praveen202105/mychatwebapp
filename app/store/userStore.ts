import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface User {
  id?: number;
  username: string;
  fullName?: string;
  profilePic?: string;
  gender?: string;
  dob?: string;
}

interface UserState {
  user: User | null;
  mySocket: Socket | null;
  socketId: string | null;
  partnerSocket: any | null;
  stream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;

  setUser: (user: Partial<User>) => void;
  setMySocket: (socket: Socket) => void;
  setSocketId: (socketId: string) => void;
  setPartnerSocket: (socket: any) => void;
  setStream: (stream: MediaStream | null) => void;
  setLocalVideoRef: (ref: React.RefObject<HTMLVideoElement | null>) => void;
  setRemoteVideoRef: (ref: React.RefObject<HTMLVideoElement | null>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  mySocket: null,
  socketId: null,
  partnerSocket: null,
  stream: null,
  localVideoRef: { current: null }, // Type as HTMLVideoElement | null
  remoteVideoRef: { current: null }, // Type as HTMLVideoElement | null

  setUser: (user) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...user } as User : user as User,
    })),
  setMySocket: (socket) => set({ mySocket: socket }),
  setSocketId: (socketId) => set({ socketId }),
  setPartnerSocket: (socket) => set({ partnerSocket: socket }),
  setStream: (stream) => set({ stream }),
  setLocalVideoRef: (ref) => set({ localVideoRef: ref }),
  setRemoteVideoRef: (ref) => set({ remoteVideoRef: ref }),
  clearUser: () =>
    set({
      user: null,
      mySocket: null,
      partnerSocket: null,
      stream: null,
      localVideoRef: { current: null },
      remoteVideoRef: { current: null },
    }),
}));
