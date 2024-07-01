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

  // //NOTE - 유효성 검사
  useEffect(() => {
    const checkUserInfo = async () => {
      try {
        setLoading(true);
        const userInfo = await checkUserLogIn();
        if (userInfo) {
          setUserId(userInfo.id);
          setUserNickname(userInfo.user_metadata.nickname);
        } else {
          toast.info("로그인 후 입장 가능합니다.");
        }
        if (!isGoInClick.current) {
          isGoInClick.current = true;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkUserInfo();
  }, []);

  //NOTE - 방 리스트 입장하기
  const joinRoomHandler = (item: Tables<"room_table">) => {
    setRoomId(item.room_id);
    socket.emit("joinRoom", userId, item.room_id, nickname);
  };

  //NOTE - 메인페이지 visual에서 게임시작 버튼 클릭시(추후 마피아 & 노래맞추기 조건 추가)
  const gameStartHandler = () => {
    socket.emit("fastJoinRoom", userId, nickname);
  };

  //NOTE - 빠른 입장 (랜덤 방 입장)
  const fastJoinRoomHandler = () => {
    socket.emit("fastJoinRoom", userId, nickname);
  };

  return { joinRoomHandler, fastJoinRoomHandler, gameStartHandler, loading };
};

export default useJoinRoom;
