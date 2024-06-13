import { useCountDown } from "@/hooks/useCountDown";
import {
  useLastModalIsOpen,
  useModalActions,
  useModalIsOpen,
  useModalTimer,
  useYesOrNoResultElement
} from "@/store/show-modal-store";

import S from "@/style/modal/modal.module.css";
import { useEffect, useState } from "react";

const LastVoteResultModal = () => {
  const isModal = useModalIsOpen();
  const isLastOpen = useLastModalIsOpen();
  const { setIsOpen, setLastVoteIsOpen } = useModalActions();

  const yesOrNoResult = useYesOrNoResultElement();
  const timer = useModalTimer();
  const [count, setCount] = useState(timer * 10);

  //NOTE - 타이머 기능
  useCountDown(() => setCount((prevCount) => prevCount - 1), 100, isLastOpen);

  // 모달창 종료
  useEffect(() => {
    if (count <= 0 && isLastOpen) {
      setLastVoteIsOpen(false);
    }
  }, [count]);

  return (
    <>
      <div className={S.modalWrap}>
        <div className={S.modal}>
          <div>
            <h1>최종 투표 결과</h1>
            <div>
              찬성: <span>{yesOrNoResult.detail.yesCount}</span> 반대: {yesOrNoResult.detail.noCount}
            </div>
            <progress className={S.progress} value={(timer * 10 - count) * (100 / (timer * 10))} max={100}></progress>
          </div>
        </div>
      </div>
    </>
  );
};

export default LastVoteResultModal;