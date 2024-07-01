import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useConnectActions, useNickname, useRoomId, useUserId } from "@/store/connect-store";
import { socket } from "@/utils/socket/socket";
import { checkUserLogIn } from "@/utils/supabase/authAPI";
import { Tables } from "@/types/supabase";
import useJoinRoomSocket from "./useJoinRoomSocket";

const useJoinRoom = () => {
  const isGoInClick = useRef(false);
  const { setRoomId, setUserNickname, setUserId } = useConnectActions();
  const userId = useUserId();
  const nickname = useNickname();
  const roomId = useRoomId();
  const [loading, setLoading] = useState(false);

  useJoinRoomSocket();

  //NOTE - 사용자 로그인 여부
  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        const userInfo = await checkUserLogIn();
        if (userInfo) {
          setUserId(userInfo.id);
          setUserNickname(userInfo.user_metadata.nickname);
        }
      } catch (error) {
        console.error("error:", error);
      }
    };
    checkUserInfo();
  }, []);

  //NOTE - 클릭시 로그인 안한 유저 처리
  const loginErrorHandler = async (emitCallback: () => void) => {
    try {
      setLoading(true);
      const isLogin = await checkUserLogIn();

      if (!isLogin) {
        toast.info("로그인 후 입장가능합니다.");
        return;
      }
      if (!isGoInClick.current) {
        isGoInClick.current = true;
        emitCallback();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      isGoInClick.current = false;
    }
  };

  //NOTE - 방 리스트 입장하기
  const joinRoomHandler = async (item: Tables<"room_table">) => {
    await loginErrorHandler(() => {
      setRoomId(item.room_id);
      socket.emit("joinRoom", userId, item.room_id, nickname);
    });
  };

  //NOTE - 메인페이지 visual에서 게임시작 버튼 클릭시(추후 마피아 & 노래맞추기 조건 추가)
  const gameStartHandler = () => {
    loginErrorHandler(() => {
      socket.emit("fastJoinRoom", userId, nickname);
    });
  };

  //NOTE - 빠른 입장 (랜덤 방 입장)
  const fastJoinRoomHandler = () => {
    loginErrorHandler(() => {
      socket.emit("fastJoinRoom", userId, nickname);
    });
  };

  return { joinRoomHandler, fastJoinRoomHandler, gameStartHandler, loading };
};

export default useJoinRoom;
