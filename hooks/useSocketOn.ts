import { socket } from "@/utils/socket/socket";
import React, { useEffect } from "react";

const useSocketOn = (sockets: any) => {
  useEffect(() => {
    sockets.forEach(({ eventName, handler }: any) => {
      console.log("OnEventName", eventName);
      socket.on(eventName, handler);
    });
  }, []);
};

export default useSocketOn;

// 소켓 객체가 변경될 가능성이 거의 없으면 빈 배열을 사용하여 마운트와 언마운트 시에만 클린업 함수를 실행한다.
// 소켓 객체가 변경될 가능성이 있는 경우, [socket] 배열을 사용