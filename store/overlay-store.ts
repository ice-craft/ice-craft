import { create } from "zustand";
import { OverlayState } from "../types";

const useOverlayStore = create<OverlayState>((set) => ({
  showOverlay: null,
  activeParticipantSid: null, //NOTE -  캠 이미지 띄우기
  activeParticipantIndex: null,
  isLocalOverlay: false, //NOTE - local click event handler
  isRemoteOverlay: false, //NOTE - remote click event handler

  setActiveParticipant: (sid: string | null, index: number | null) =>
    set({ activeParticipantSid: sid, activeParticipantIndex: index }),

  //NOTE - 캠 클릭 시 user의 정보를 update
  toggleOverlay: (participantSid, index) =>
    set((state) => {
      if (state.activeParticipantSid === participantSid) {
        return { ...state };
      } else {
        return {
          ...state,
          showOverlay: participantSid,
          activeParticipantSid: participantSid,
          activeParticipantIndex: index
        };
      }
    }),

  //NOTE - 활성화된 user의 정보를 초기화 시킨다.(캠에 보여지는 이미지 비활성화)
  clearActiveParticipant: () => set({ activeParticipantSid: null, activeParticipantIndex: null }),
  //NOTE - 캠 클릭 이벤트 핸들러 및 cursor 활성화 및 비활성화
  setIsOverlay: (newIsOverlay) => set({ isLocalOverlay: newIsOverlay, isRemoteOverlay: newIsOverlay }),
  setIsRemoteOverlay: (newIsOverlay) => set({ isRemoteOverlay: newIsOverlay })
}));

export default useOverlayStore;
