import { useCountDown } from "@/hooks/useCountDown";
import { useModalActions, useModalIsOpen, useModalTimer } from "@/store/show-modal-store";
import S from "@/style/modal/modal.module.css";
import { useEffect, useState } from "react";

const ModalProgress = () => {
  const isModal = useModalIsOpen();
  const timer = useModalTimer();
  const [count, setCount] = useState(timer * 10);

  const { setIsOpen } = useModalActions();

  //NOTE - 타이머 기능
  useCountDown(() => setCount((prevCount) => prevCount - 1), 100, isModal);

  // 모달창 종료
  useEffect(() => {
    if (count <= 1 && isModal) {
      setIsOpen(false);
    }
  }, [count]);

  return <progress className={S.progress} value={(timer * 10 - count) * (100 / (timer * 10))} max={85}></progress>;
};

export default ModalProgress;
