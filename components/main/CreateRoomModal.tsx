import MafiaGameChoiceActive from "@/assets/images/game_choice_mafia_active.svg";
import MafiaGameChoice from "@/assets/images/game_choice_mafia.svg";
import MafiaGameSong from "@/assets/images/game_choice_song.svg";
import MafiaGameSongActive from "@/assets/images/game_choice_song_active.png.svg";
import { useCreateStore } from "@/store/toggle-store";
import S from "@/style/modal/modal.module.css";
import { socket } from "@/utils/socket/socket";
import Image from "next/image";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useConnectActions, useNickname, useUserId } from "@/store/connect-store";
import { useRouter } from "next/navigation";

const MainCreateRoom = () => {
  const [roomTitle, setRoomTitle] = useState("");
  const [selectedGame, setSelectedGame] = useState("마피아");
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const isGoInClick = useRef(false);
  const { setIsCreate } = useCreateStore();
  const roomId = useRef("");
  const userId = useUserId();
  const nickname = useNickname();
  const router = useRouter();
  const { setRoomId } = useConnectActions();

  useEffect(() => {
    socket.on("createRoom", ({ room_id }) => {
      roomId.current = room_id;
      socket.emit("joinRoom", userId, room_id, nickname);
    });

    socket.on("createRoomError", (message) => {
      toast.error(message);
      isGoInClick.current = false;
    });

    socket.on("joinRoom", () => {
      if (roomId.current) {
        setRoomId(roomId.current);
        setIsCreate(false);
        if (selectedGame === "마피아") {
          router.push(`/room/${roomId.current}/`);
        }
        return null;
      }
    });

    socket.on("joinRoomError", (message) => {
      toast.error(message);
      isGoInClick.current = false;
    });

    return () => {
      socket.off("createRoom");
      socket.off("createRoomError");
      socket.off("joinRoom");
      socket.off("joinRoomError");
    };
  }, []);

  const gameSelectHandler = (game: string) => {
    setSelectedGame(game);
    setRoomTitle("");
  };

  const closeModalHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setIsCreate(false);
    }
  };

  //NOTE - 방 만들기 핸들러
  const createRoomSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //유효성 검사
      if (!roomTitle.trim()) {
        toast.error("방 제목을 입력해 주세요.");
        return;
      }

      if (selectedGame === "노래맞추기") {
        toast("노래 맞추기 게임은 준비중입니다.");
        return;
      }

      if (!isGoInClick.current) {
        isGoInClick.current = true;
        socket.emit("createRoom", roomTitle, selectedGame, numberOfPlayers);

        setSelectedGame("마피아");
        setRoomTitle("");
        setNumberOfPlayers(5);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const playerOptions = Array.from({ length: 6 }, (_, i) => i + 5);

  return (
    <div className={S.modalWrap} onClick={closeModalHandler}>
      <div className={S.mainModal}>
        <form onSubmit={createRoomSubmitHandler} className={S.gameForm}>
          <h2 className={S.gameChoice}>게임을 선택해 주세요</h2>
          <div>
            <h3 className={S.gameTitle}>게임 고르기</h3>
            <ul className={S.gameChoiceList}>
              <li onClick={() => gameSelectHandler("마피아")}>
                <Image src={selectedGame === "마피아" ? MafiaGameChoiceActive : MafiaGameChoice} alt="마피아 게임" />
              </li>
              <li onClick={() => gameSelectHandler("노래맞추기")}>
                <Image
                  src={selectedGame === "노래맞추기" ? MafiaGameSongActive : MafiaGameSong}
                  alt="노래 맞추기 게임"
                />
              </li>
            </ul>
          </div>
          <div className={S.gameNameText}>
            <h3 className={S.gameTitle}>방 제목</h3>
            <input
              type="text"
              id="RoomName"
              value={roomTitle}
              placeholder="방 제목을 입력해 주세요."
              onChange={(e) => setRoomTitle(e.target.value)}
              maxLength={16}
            />
          </div>
          {selectedGame === "마피아" ? (
            <div className={S.playerPeopleChoice}>
              <h3 className={S.gameTitle}>인원수</h3>
              <select value={numberOfPlayers || ""} onChange={(e) => setNumberOfPlayers(Number(e.target.value))}>
                {playerOptions.map((number) => (
                  <option key={number} value={number}>
                    {number}명
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className={S.gameChoiceButton}>
            <button className={S.closedButton} type="button" onClick={() => setIsCreate(false)}>
              닫기
            </button>
            <button disabled={isGoInClick.current} type="submit">
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainCreateRoom;
