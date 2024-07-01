import MafiaPlayRooms from "@/components/mafia/MafiaPlayRooms";
import usePopStateHandler from "@/hooks/usePopStateHandler";
import { useGetToken } from "@/hooks/useToken";
import { useNickname, useRoomId, useUserId } from "@/store/connect-store";
import { useExitAction } from "@/store/exit-store";
import S from "@/style/livekit/livekit.module.css";
import { socket } from "@/utils/socket/socket";
import { LiveKitRoom, PreJoin } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";

const JoinMafiaRoom = () => {
  const roomId = useRoomId();
  const userId = useUserId();
  const nickname = useNickname();
  const [isJoinError, setIsJoinError] = useState(true);
  const [isJoin, setIsJoin] = useState(false);
  const { setIsExit, setIsBack } = useExitAction();
  const isBack = usePopStateHandler();

  // BeforeUnloadHandler();

  //NOTE - 뒤로가기 시 작동
  useEffect(() => {
    if (isBack) {
      socket.emit("exitRoom", roomId, userId);
      setIsExit(true);
      setIsBack(true);
    }
  }, [isBack]);

  const joinError = (error: Error | string) => {
    setIsJoinError(false);
    console.log("joinError", error);
  };

  const { data: token, isPending, isError, error } = useGetToken(roomId, userId, nickname);

  if (isPending) {
    console.log("로딩중");
  }

  if (isError) {
    joinError(error);
  }

  //NOTE - 디바이스 비활성화 및 토큰 발급 error시 실행
  if (!isJoinError) {
    return (
      <div>
        <p>
          게임 접속에 불편을 드려서 죄송합니다. 현재 원활한 게임이 진행되지 않고 있으니, 나갔다 다시 접속해 주시기
          바랍니다.
        </p>
        <button
          onClick={() => {
            socket.emit("exitRoom", roomId, userId);
            setIsExit(true);
          }}
        >
          나가기
        </button>
      </div>
    );
  }

  return (
    <main data-lk-theme="default">
      {isJoin ? (
        <LiveKitRoom
          token={token} // 필수 요소
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} // 필수 요소
          video={true}
          audio={true}
          onError={joinError}
          connect={true}
        >
          <MafiaPlayRooms />
        </LiveKitRoom>
      ) : (
        <section className={S.settingWrapper}>
          <h2>오디오 & 캠 설정 창 입니다.</h2>
          <div className={S.settingCam}>
            <PreJoin
              onError={joinError}
              joinLabel="입장하기"
              onSubmit={() => setIsJoin(true)} // 입장하기 버튼 이벤트 헨들러
              onValidate={() => isJoinError} // 입장하기 버튼 활성화
            ></PreJoin>
            <div className={S.settingUserButton}>
              <ul>
                <li>오디오 설정 </li>
                <li>캠 설정 </li>
              </ul>
            </div>
            <div className={S.cover}></div>
          </div>
        </section>
      )}
    </main>
  );
};

export default JoinMafiaRoom;
