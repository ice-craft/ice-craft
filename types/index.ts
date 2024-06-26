import { TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { User } from "@supabase/supabase-js";
import { StaticImageData } from "next/image";
import { Tables } from "./supabase";

export interface MafiaRoom {
  room: string;
  userInfo: User | undefined | null;
}

// 미디어 상태 객체의 구조를 정의
export interface MediaStatus {
  [userId: string]: { camera: boolean; mike: boolean };
}

// socket 이벤트 핸들러 인터페이스 정의
export interface SocketEventHandler {
  [eventName: string]: (...args: any[]) => void;
}

export interface Role {
  [job: string]: string[];
}

export interface VoteResult {
  user_id: string;
  user_nickname: string;
  voted_count: number;
}

export interface playerMedia {
  userId: string;
  camera: boolean;
  mike: boolean;
}

export interface OverlayState {
  activePlayerId: string | null;
  playersReady: RemoteReadyStates;
  isLocalOverlay: boolean;
  isRemoteOverlay: boolean;
  inSelect: string;
  imageState: StaticImageData | null;

  actions: {
    setReadyPlayers: (userId: string, isReady: boolean) => void;
    setActiveParticipant: (playerId: string | null) => void;
    setIsOverlay: (newIsOverlay: boolean) => void;
    setIsRemoteOverlay: (newIsOverlay: boolean) => void;
    setImageState: (newImage: StaticImageData | null) => void;
    setInSelect: (newSelect: string) => void;
    setOverlayReset: () => void;
  };
}

export interface ImageState {
  imageState: StaticImageData | null;
  setImageState: (newImage: StaticImageData | null) => void;
  setImageReset: () => void;
}

export interface GameState {
  diedPlayerId: string[];
  isGameState: boolean;
  actions: {
    setDiedPlayer: (playerId: string) => void;
    setIsGameState: (isGame: boolean) => void;
    setPlayerReset: () => void;
  };
}
export interface GamePlayerInfo {
  playerId: string;
  playerName: string | undefined;
  playerJoinAt: Date | undefined;
  number: number;
}

export interface ConnectState {
  join: boolean;
  nickname: string;
  userId: string;
  roomId: string;
  rooms: Tables<"room_table">[];
  actions: {
    setJoinStatus: (status: boolean) => void;
    setRoomId: (id: string) => void;
    setUserId: (id: string) => void;
    setUserNickname: (nickname: string) => void;
    setRooms: (status: Tables<"room_table">[]) => void;
  };
}

export interface RemoteReadyStates {
  [key: string]: boolean;
}

export interface ExitState {
  isExit: boolean;
  isBack: boolean;
  actions: {
    setIsExit: (newToggle: boolean) => void;
    setIsBack: (newToggle: boolean) => void;
  };
}

export interface ReadyState {
  isReady: boolean;
  setIsReady: (newReady: boolean) => void;
}

export interface CreateState {
  isCreate: boolean;
  setIsCreate: (newReady: boolean) => void;
}

export interface ShowModalState {
  isOpen: boolean;
  currentModal: string;
  title: string;
  timer: number;
  role: Role;
  voteResult: VoteResult[];
  yesOrNoResult: YesOrNoResults;
  actions: {
    setIsOpen: (newIsOpen: boolean) => void;
    setCurrentModal: (newCurrentModal: string) => void;
    setTimer: (newTimer: number) => void;
    setTitle: (newTitle: string) => void;
    setRole: (newRole: Role) => void;
    setVoteResult: (newVote: VoteResult[]) => void;
    setYesOrNoVoteResult: (newVote: YesOrNoResults) => void;
    setModalReset: () => void;
  };
}

export interface VoteData {
  userId: string;
  nickname: string;
}

export interface VoteResults {
  [nickname: string]: number;
}

export interface YesOrNoResults {
  detail: { noCount: number; yesCount: number };
  result: boolean;
}

export interface totalTimeState {
  timer: number;
  isTimer: boolean;
  actions: {
    setTimer: (newTimer: number) => void;
    setIsTimer: (newTimer: boolean) => void;
  };
}

export interface playersInfo {
  user_id: string;
  user_nickname: string;
  is_ready: boolean;
}

export interface Rooms {
  room_id: string;
  title: string | null;
  game_category: string | null;
  current_user_count: number;
  total_user_count: number;
  created_at: string | null;
}

export interface RoomListItemProps {
  item: Rooms;
  // joinRoomHandler: (item: Tables<"room_table">) => Promise<void>;
}

export interface UserInfo {
  userId: string;
  nickname: string;
  isReady: boolean;
}

export interface FormSearchProps {
  placeholder: string;
}
