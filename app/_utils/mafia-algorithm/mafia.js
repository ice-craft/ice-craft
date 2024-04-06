//FIXME - 클래스로 변경
//FIXME - 종료 조건 확인 항상하기
//FIXME - 종료 조건이 맞지 않는 경우 반복하도록 하기
//FIXME - 유저들의 인덱스는 프로젝트에 적용할 때, user id로 변경해야 함
//FIXME - 리팩토링 반드시 할 것

//NOTE - 타이머로 시간 잼
const startTimer = (seconds) => {
  console.log("타이머 시작");
  if (seconds >= 60) {
    console.log(`${Math.floor(seconds / 60)}분 ${seconds % 60}초 재는 중`);
  } else {
    console.log(`${seconds % 60}초 재는 중`);
  }
  console.log("타이머 종료");
};

//NOTE - 게임 레디
const setReady = (players, index) => {
  players[index].isReady = true;
};

//NOTE - 인원 수 맞는지 확인
const checkParticipantsCountEnough = (count, participants) => {
  return participants.length === count;
};

//NOTE - 모든 플레이어들이 전부 레디했는지 확인
const checkAllParticipantsReady = (participants) => {
  let result = true;
  participants.forEach((participant) => {
    if (participant.isReady === false) {
      result = false;
    }
  });

  return result;
};

//NOTE - 게임이 시작가능한 지 확인
const canGameStart = (isEnoughCount, isAllReady) => {
  return isEnoughCount && isAllReady;
};

//NOTE - 참가자들 랜덤으로 섞기(피셔-예이츠 셔플 알고리즘)
const shuffleParticipants = (participants) => {
  for (let i = participants.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); //NOTE - math.random() 대체제 생각해보기
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }
};

//NOTE - 참감자들 중 한명 랜덤으로 뽑기
const getRandomParticipant = (participants) => {
  shuffleParticipants(participants); //FIXME - 클래스로 리팩토링할 때, this 붙여야 함
  return participants.pop();
};

//NOTE - 참가자를 마피아 플레이어로 설정
const setPlayerMafia = (players, participant) => {
  players[participant.index] = {
    ...mafia,
    index: participant.index,
    userNickname: participant.userNickname
  };
};

//NOTE - 참가자를 경찰 플레이어로 설정
const setPlayerPolice = (players, participant) => {
  players[participant.index] = {
    ...police,
    index: participant.index,
    userNickname: participant.userNickname
  };
};

//NOTE - 참가자를 의사 플레이어로 설정
const setPlayerDoctor = (players, participant) => {
  players[participant.index] = {
    ...doctor,
    index: participant.index,
    userNickname: participant.userNickname
  };
};

//NOTE - 참가자를 시민 플레이어로 설정
const setPlayerCitizen = (players, participant) => {
  players[participant.index] = {
    ...citizen,
    index: participant.index,
    userNickname: participant.userNickname
  };
};

//NOTE - 게임을 진행하면서 각 역할을 누가 맡았는지 객체에 저장
const setRoles = (players, roles) => {
  Object.keys(roles).forEach((key) => delete roles[key]);
  players.forEach((player, index) => {
    if (roles[player.role] === undefined) {
      roles[player.role] = [];
    }

    if (player.isLived) {
      roles[player.role].push(index);
    }
  });
};

//NOTE - 플레이어에게 다른 플레이어의 역할 공개
const openPlayerRole = (clientIndex, playerIndex, roleName) => {
  console.log(`${clientIndex} 클라이언트의 ${playerIndex}의 역할은 ${roleName}입니다.`);
};

//NOTE - 게임 시작
const gameStart = () => {
  console.log("게임 시작");
};

//NOTE - 게임 끝
const gameOver = () => {
  console.log("게임 종료");
};

//NOTE - 라운드 시작
const roundStart = () => {
  console.log("라운드 시작");
};

//NOTE - 라운드 종료
const roundOver = () => {
  console.log("라운드 종료");
};

//NOTE - 밤 시작
const nightStart = () => {
  console.log("밤이 되었습니다.");
};

//NOTE - 밤 종료
const nightOver = () => {
  console.log("밤이 끝났습니다.");
};

//NOTE - 아침 시작
const morningStart = () => {
  console.log("아침이 되었습니다.");
};

//NOTE - 아침 종료
const dayOver = () => {
  console.log("아침이 끝났습니다.");
};

//NOTE - 유저 닉네임 설정
const setUserNickname = (players, index, nickname) => {
  players[index].nickname = nickname;
};
//NOTE - 플레이어를 선택하는 투표
const voteToPlayer = (players, senderIndex, receiverIndex) => {
  players[senderIndex].voteTo = receiverIndex;
  players[receiverIndex].votedCount++;
};

//NOTE - 찬성, 반대를 결정하는 투표
const voteYesOrNo = (votes, yesOrNo) => {
  votes.push(yesOrNo);
  return votes;
};

//NOTE - 투표 리셋
const resetVote = (players) => {
  players.forEach((player) => {
    player.votedCount = 0;
    player.voteTo = "";
  });
};

//NOTE - 플레이어들이 받은 표 확인
const getPlayersVoteResult = (players) => {
  const voteResult = {};
  players.forEach((player) => {
    voteResult[player.userNickname] = player.votedCount;
  });
  return voteResult;
};

//NOTE - 표를 가장 많이 받은 플레이어 확인
const getMostVotedPlayer = (players) => {
  let sortedResult = [...players];
  let isValid;

  sortedResult.sort((a, b) => b.votedCount - a.votedCount);
  isValid = sortedResult[0].votedCount !== sortedResult[1].votedCount;

  return { isValid, result: sortedResult[0] };
};

//NOTE - 찬성 반대 투표 결과
const getYesOrNoVoteResult = (votes) => {
  let yesCount = 0;
  let noCount = 0;
  let isValid;

  votes.forEach((vote) => {
    //NOTE - 찬반 투표 셈
    if (vote === true) {
      yesCount++;
    } else {
      noCount++;
    }
  });

  isValid = yesCount !== noCount; //NOTE - 찬성과 반대가 동률인지 확인
  return {
    isValid,
    result: yesCount > noCount,
    detail: { yesCount, noCount }
  }; //NOTE - 찬성과 반대가 다른 유효한 값인지, 찬성과 반대중 어떤게 더 많은지
};

const showVoteResult = (players, vote) => {
  players.forEach((player) => console.log(`사회자[to : ${player.userNickname}] : ${vote}`));
};

//NOTE - 플레이어 죽임
const killCitizen = (players, index, roles) => {
  players[index].isLived = false;
  setRoles(players, roles);

  return players[index];
};

//NOTE - 의사가 시민 살림
const savePlayer = (players, index, roles) => {
  players[index].isLived = true;
  setRoles(players, roles);

  return players[index];
};

//NOTE - 플레이어가 살았는지 확인
const checkPlayerLived = (players, index) => {
  return players[index].isLived === true;
};

//NOTE - 사회자가 특정 유저에게 진행 상황 말함
const speak = (players, index, line) => {
  console.log(`사회자[to : ${players[index].userNickname}] : ${line}`);
};

//NOTE - 사회자가 플레이어의 카메라를 켬
const turnOnCamera = (clientIndex, cameraIndex) => {
  console.log(`${clientIndex} 클라이언트의 ${cameraIndex} 카메라 켬`);
};

//NOTE - 사회자가 플레이어의 카메라를 끔
const turnOffCamera = (clientIndex, cameraIndex) => {
  console.log(`${clientIndex} 클라이언트의 ${cameraIndex} 카메라 끔`);
};

//NOTE - 사회자가 플레이어의 마이크를 켬
const turnOnMike = (clientIndex, mikeIndex) => {
  console.log(`${clientIndex} 클라이언트의 ${mikeIndex} 마이크 켬`);
};

//NOTE - 사회자가 플레이어의 마이크를 끔
const turnOffMike = (clientIndex, mikeIndex) => {
  console.log(`${clientIndex} 클라이언트의 ${mikeIndex} 마이크 끔`);
};

//NOTE - 경찰이 플레이어가 마피아 인지 알아냄
const checkPlayerMafia = (players, index) => {
  if (players[index].role === "마피아") {
    return true;
  } else {
    return false;
  }
};

//NOTE - 방나가기
const exit = (players, index, roles) => {
  players[index].isLived = false;
  setRoles(players, roles);
};

//NOTE - 어느 팀이 이겼는지
const whoWins = (roles) => {
  const mafiaCount = roles["마피아"].length;
  const citizenCount = roles["시민"].length;

  if (mafiaCount === 0) {
    return { isValid: true, result: "시민" };
  }
  if (mafiaCount > citizenCount || mafiaCount === citizenCount) {
    return { isValid: true, result: "마피아" };
  }

  return { isValid: false };
};

//NOTE - 현재 방의 각 역할 정원 인원 수 반환
const getRoomComposition = (userCount) => {
  switch (userCount) {
    case 5:
      return { mafiaCount: 1, citizenCount: 4, policeCount: 0, doctorCount: 0 };
    case 6:
      return { mafiaCount: 2, citizenCount: 3, policeCount: 1, doctorCount: 0 };
    case 7:
      return { mafiaCount: 2, citizenCount: 4, policeCount: 1, doctorCount: 0 };
    case 8:
      return { mafiaCount: 3, citizenCount: 3, policeCount: 1, doctorCount: 1 };
    case 9:
      return { mafiaCount: 3, citizenCount: 4, policeCount: 1, doctorCount: 1 };
    case 10:
      return { mafiaCount: 3, citizenCount: 4, policeCount: 1, doctorCount: 1 };
  }
};

//NOTE - 각 역할
const moderator = {
  setUserNickname,
  checkParticipantsCountEnough,
  checkAllParticipantsReady,
  canGameStart,
  getRoomComposition,
  openPlayerRole,
  gameStart,
  gameOver,
  startTimer,
  roundStart,
  roundOver,
  nightStart,
  nightOver,
  morningStart,
  dayOver,
  killCitizen,
  resetVote,
  getPlayersVoteResult,
  getMostVotedPlayer,
  getYesOrNoVoteResult,
  showVoteResult,
  checkPlayerLived,
  speak,
  shuffleParticipants,
  getRandomParticipant,
  setPlayerMafia,
  setPlayerDoctor,
  setPlayerPolice,
  setPlayerCitizen,
  setRoles,
  turnOnCamera,
  turnOffCamera,
  turnOnMike,
  turnOffMike,
  whoWins
};
const citizen = {
  userNickname: "",
  role: "시민",
  index: -1,
  isLived: true,
  voteTo: "",
  votedCount: 0,
  setReady,
  voteToPlayer,
  voteYesOrNo,
  exit
};
const mafia = {
  ...citizen,
  role: "마피아",
  killCitizen
};
const police = {
  ...citizen,
  role: "경찰",
  checkPlayerMafia
};
const doctor = {
  ...citizen,
  role: "의사",
  savePlayer
};

//NOTE - 현재 방 각 역할 인원 수
let roomComposition;

//NOTE - 방 참가자 (방에 들어와서 역할이 없는 상태)
const participant = { userNickname: "", isReady: false, index: -1 };

//NOTE - 참가자들 (역할 배정 전)
const participants = [];

//NOTE - 플레이어들 (역할이 정해짐)
const players = [];

//NOTE - 플레이어들 역할
const roles = {};

//NOTE - 플레이어들의 찬반 투표 결과
const votes = [];

//NOTE - 플레이어 방 정원
let userCount = -1;

//NOTE - 역할이 마피아인 플레이어 인덱스 목록
let mafiaIndexes;

//NOTE - 역할이 의사인 플레이어 인덱스
let doctorIndex;

//NOTE - 역할이 경찰인 플레이어 인덱스
let policeIndex;

//NOTE - 역할이 시민인 플레이어 인덱스 목록
let citizenIndexes;

//NOTE - 죽기로 결정된 플레이어
let killedPlayer;

//NOTE - 경찰이 조사한 플레이어가 마피아인지 여부
let isPlayerMafia;

//NOTE - 방을 나갈지 선택
let choiceToExit;

const gamePlay = () => {
  userCount = 8; //NOTE - 방 유저 정원 8명 결정

  roomComposition = moderator.getRoomComposition(userCount); //NOTE - 현재 방 인원 수에 대한 역할 인원 수 반환

  //NOTE - 유저들 게임 참가
  for (let i = 0; i < userCount; i++) {
    participants[i] = { ...participant, userNickname: "user" + i, index: i };
  }

  //NOTE - 플레이어 수를 참가자들 수만큼 설정
  for (let i = 0; i < userCount; i++) {
    players[i] = null;
  }

  //NOTE - 모든 참가자들이 레디함
  for (let i = 0; i < userCount; i++) {
    participants[i].isReady = true;
  }

  const isAllParticipantsReady = moderator.checkAllParticipantsReady(participants); //NOTE - 참가자들이 전부 레디했는지
  const isAllParticipantsEnoughCount = moderator.checkParticipantsCountEnough(userCount, participants); //NOTE - 참가자들이 방 정원을 채웠는지

  if (
    moderator.canGameStart(isAllParticipantsEnoughCount, isAllParticipantsReady) //NOTE - 게임이 시작 가능한 상태인지 확인
  ) {
    gameStart(); //NOTE - 게임 시작
  } else {
    console.log("게임 시작 불가"); //NOTE - 게임 시작 조건 못 갖춤
  }

  let randomParticipant;

  //NOTE - 마피아 인원 수만큼 참감자들에게 마피아 역할 배정
  for (let i = 0; i < roomComposition.mafiaCount; i++) {
    randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
    moderator.setPlayerMafia(players, randomParticipant); //NOTE - 참가자를 마피아 플레이어로 설정
  }

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerDoctor(players, randomParticipant); //NOTE - 참가자를 의사 플레이어로 설정

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerPolice(players, randomParticipant); //NOTE - 참가자를 경찰 플레이어로 설정

  //NOTE - 시민 인원 수만큼 참가자들에게 시민 역할 배정
  for (let i = 0; i < roomComposition.citizenCount; i++) {
    randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
    moderator.setPlayerCitizen(players, randomParticipant); //NOTE - 참가자를 시민 플레이어로 설정
  }

  moderator.setRoles(players, roles); //NOTE - 플레이어들의 역할들을 정리해서 저장

  moderator.roundStart();

  //NOTE - 모든 참가자들은 역할을 배정받고 플레이어로 변경 (매개 변수가 participant라서 이렇게 대처, 클래스면 게임 순서대로 구현 가능)
  moderator.nightStart(); //NOTE - 밤이 시작됨

  //NOTE - 모든 플레이어들 작업
  for (let clientIndex = 0; clientIndex < userCount; clientIndex++) {
    for (let cameraIndex = 0; cameraIndex < userCount; cameraIndex++) {
      moderator.turnOffCamera(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 카메라 끔
      moderator.turnOffMike(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 마이크 끔
    }
  }

  //NOTE - 모든 유저들 작업
  for (let userIndex = 0; userIndex < userCount; userIndex++) {
    moderator.speak(players, userIndex, "마피아를 뽑겠습니다.");
  }

  console.log("마피아 뽑음");
  mafiaIndexes = roles["마피아"];

  //NOTE - 마피아 유저들에게 자신이 마피아인 것을 알리고 마피아인 유저가 누구인지 공개
  mafiaIndexes.forEach((clientIndex) => {
    mafiaIndexes.forEach((playerIndex) => {
      moderator.openPlayerRole(clientIndex, playerIndex, "마피아");
    });
  });
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "마피아 들은 고개를 들어 서로를 확인해 주세요.");
  }

  mafiaIndexes = roles["마피아"]; //NOTE - 마피아 플레이어들

  //NOTE - 마피아 유저들 화면의 마피아 유저 화상 카메라와 마이크만 켬
  mafiaIndexes.forEach((clientIndex) => {
    mafiaIndexes.forEach((cameraIndex) => {
      moderator.turnOnCamera(clientIndex, cameraIndex);
      moderator.turnOnMike(clientIndex, cameraIndex);
    });
  });

  moderator.startTimer(90); //NOTE - 시간 재기

  //NOTE - 마피아 유저들 화면의 마피아 유저 화상 카메라와 마이크만 끔
  mafiaIndexes.forEach((clientIndex) => {
    mafiaIndexes.forEach((cameraIndex) => {
      moderator.turnOffCamera(clientIndex, cameraIndex);
      moderator.turnOffMike(clientIndex, cameraIndex);
    });
  });
  for (let userIndex = 0; userIndex < userCount; userIndex++) {
    moderator.speak(players, userIndex, "의사를 뽑겠습니다.");
  }
  console.log("의사 뽑음");

  doctorIndex = roles["의사"];

  moderator.openPlayerRole(doctorIndex, doctorIndex, "의사"); //NOTE - 의사 플레이어의 화면에서 자신이 의사임을 알림

  for (let userIndex = 0; userIndex < userCount; userIndex++) {
    moderator.speak(players, userIndex, "경찰을 뽑겠습니다.");
  }
  console.log("경찰 뽑음");

  policeIndex = roles["경찰"];

  moderator.openPlayerRole(policeIndex, policeIndex, "경찰"); //NOTE - 경찰 플레이어의 화면에서 자신이 경찰임을 알림

  console.log("나머지는 시민으로 뽑음");

  citizenIndexes = roles["시민"];

  //NOTE - 시민 플레이어의 화면에서 자신이 시민임을 알림
  citizenIndexes.forEach((citizenIndex) => moderator.openPlayerRole(citizenIndex, citizenIndex, "시민"));

  moderator.nightOver(); //NOTE - 밤 종료
  moderator.roundOver(); //NOTE - 라운드 종료

  moderator.roundStart(); //NOTE - 라운드 시작
  moderator.morningStart(); //NOTE - 아침 시작

  //NOTE - 모든 플레이어들 작업
  for (let clientIndex = 0; clientIndex < userCount; clientIndex++) {
    for (let cameraIndex = 0; cameraIndex < userCount; cameraIndex++) {
      moderator.turnOnCamera(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 카메라 켬
      moderator.turnOnMike(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 마이크 켬
    }
  }
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "모든 유저는 토론을 통해 마피아를 찾아내세요.");
  }
  moderator.startTimer(90); //NOTE - 시간 재기

  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "토론이 끝났습니다.");
  }
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "마피아일 것 같은 사람의 화면을 클릭해주세요.");
  }

  players[0].voteToPlayer(players, 0, 1); //NOTE - 0번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[1].voteToPlayer(players, 1, 2); //NOTE - 1번 인덱스 플레이어가 2번 인덱스 플레이어에게 투표
  players[2].voteToPlayer(players, 2, 1); //NOTE - 2번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[3].voteToPlayer(players, 3, 1); //NOTE - 3번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[4].voteToPlayer(players, 4, 1); //NOTE - 4번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표

  moderator.startTimer(90); //NOTE - 시간 재기

  const voteBoard = moderator.getPlayersVoteResult(players); //NOTE - 투표 결과 확인 (누가 얼마나 투표를 받았는지)
  const mostVoteResult = moderator.getMostVotedPlayer(players); //NOTE - 투표를 가장 많이 받은 사람 결과 (확정X, 동률일 가능성 존재)

  moderator.resetVote(players); //NOTE - 플레이어들이 한 투표 기록 리셋
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.showVoteResult(players, voteBoard);
  }

  if (mostVoteResult.isValid) {
    //NOTE - 투표 성공

    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex, `${mostVoteResult.result.userNickname}님이 마피아로 지복되었습니다.`);
    }

    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex, `${mostVoteResult.result.userNickname}님은 최후의 변론을 시작하세요.`);
    }

    moderator.startTimer(90); //NOTE - 시간 재기

    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex, "찬성/반대 투표를 해주세요.");
    }

    moderator.startTimer(90); //NOTE - 시간 재기

    players[0].voteYesOrNo(votes, false); //NOTE - 0번 인덱스 플레이어가 찬성에 투표
    players[1].voteYesOrNo(votes, true); //NOTE - 1번 인덱스 플레이어가 찬성에 투표
    players[2].voteYesOrNo(votes, true); //NOTE - 2번 인덱스 플레이어가 찬성에 투표
    players[3].voteYesOrNo(votes, false); //NOTE - 3번 인덱스 플레이어가 반대에 투표
    players[4].voteYesOrNo(votes, false); //NOTE - 4번 인덱스 플레이어가 반대에 투표

    const yesOrNoVoteResult = moderator.getYesOrNoVoteResult(votes); //NOTE - 찬반 투표 결과 (확정X, 동률 나올 수 있음)

    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.showVoteResult(players, yesOrNoVoteResult.result.detail);
    }

    //NOTE - 투표 결과가 유효하고(동률이 아님), 찬성이 반대보다 많은 경우
    if (yesOrNoVoteResult.isValid && yesOrNoVoteResult.result) {
      killedPlayer = moderator.killCitizen(mostVoteResult.result.index); //NOTE - 투표를 가장 많이 받은 플레이어 사망

      mafiaIndexes = roles["마피아"];
      const isPlayerMafia = mafiaIndexes.indexOf(killedPlayer.index) !== -1; //NOTE - 죽은 플레이어가 마피아인지 확인

      //NOTE - 죽은 플레이어가 마피아인지 시민인지 알림
      isPlayerMafia ? moderator.speak(`마피아가 죽었습니다.`) : moderator.speak(`시민이 죽었습니다.`);

      for (let clientIndex = 0; playerIndex < userCount; clientIndex++) {
        const role = isPlayerMafia ? "마피아" : "시민";

        moderator.openPlayerRole(clientIndex, killedPlayer.index, role);
      }
    } else {
      //NOTE - 투표 실패, 동률이 나옴
      console.log("동률 나옴");
    }
  }

  moderator.dayOver(); //NOTE - 아침 종료
  moderator.nightStart(); //NOTE - 밤이 시작됨

  //NOTE - 모든 플레이어들 작업
  for (let clientIndex = 0; clientIndex < userCount; clientIndex++) {
    for (let cameraIndex = 0; cameraIndex < userCount; cameraIndex++) {
      moderator.turnOffCamera(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 카메라 끔
      moderator.turnOffMike(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 마이크 끔
    }
  }
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "마피아는 누구를 죽일지 결정해주세요.");
  }

  //NOTE - 마피아 유저들 화면의 마피아 유저 화상 카메라와 마이크만 켬
  mafiaIndexes.forEach((clientIndex) => {
    mafiaIndexes.forEach((cameraIndex) => {
      moderator.turnOnCamera(clientIndex, cameraIndex);
      moderator.turnOnMike(clientIndex, cameraIndex);
    });
  });

  mafiaIndexes.forEach((mafiaIndex) => {
    moderator.speak(players, mafiaIndex, "제스처를 통해 상의하세요.");
    moderator.speak(players, mafiaIndex, "누구를 죽일지 선택하세요.");
  });

  moderator.startTimer(90); //NOTE - 시간 재기
  killedPlayer = players[mafiaIndexes[0]].killCitizen(players, 0, roles); //NOTE - 가장 먼저 선택한 마피아의 지시를 따름

  //NOTE - 마피아 유저들 화면의 마피아 유저 화상 카메라와 마이크만 끔
  mafiaIndexes.forEach((clientIndex) => {
    mafiaIndexes.forEach((cameraIndex) => {
      moderator.turnOffCamera(clientIndex, cameraIndex);
      moderator.turnOffMike(clientIndex, cameraIndex);
    });
  });
  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "의사는 누구를 살릴 지 결정하세요.");
  }

  //NOTE - 의사가 살아있을 경우
  if (roles["의사"].length > 0) {
    doctorIndex = roles["의사"][0]; //NOTE - 역할이 의사인 플레이어 인덱스 반환

    moderator.startTimer(90); //NOTE - 시간 재기

    console.log("의사 인덱스", doctorIndex);
    players[doctorIndex].savePlayer(players, killedPlayer.index, roles); //NOTE - 의사가 플레이어를 살림
  }

  for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
    moderator.speak(players, playerIndex, "경찰은 마피아 의심자를 결정해주세요.");
  }

  //NOTE - 경찰이 살아있을 경우
  if (roles["경찰"].length > 0) {
    policeIndex = roles["경찰"][0];

    isPlayerMafia = players[policeIndex].checkPlayerMafia(players, 0); //NOTE - 0번 인덱스 플레이어가 마피아인지 의심

    if (isPlayerMafia) {
      moderator.speak(players, policeIndex, "해당 플레이어는 마피아가 맞습니다.");
    } else {
      moderator.speak(players, policeIndex, "해당 플레이어는 마피아가 아닙니다.");
    }
  }

  moderator.nightOver(); //NOTE - 밤 종료
  moderator.roundOver(); //NOTE - 라운드 종료
  moderator.roundStart(); //NOTE - 라운드 시작
  moderator.morningStart(); //NOTE - 아침 시작

  //NOTE - 모든 플레이어들 작업
  for (let clientIndex = 0; clientIndex < userCount; clientIndex++) {
    for (let cameraIndex = 0; cameraIndex < userCount; cameraIndex++) {
      moderator.turnOnCamera(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 카메라 켬
      moderator.turnOnMike(clientIndex, cameraIndex); //NOTE - clientIndex 클라이언트 화면의 cameraIndex 마이크 켬
    }
  }

  //NOTE - 마피아가 죽일려고한 마피아가 살았는지 죽었는지 확인
  if (killedPlayer.isLived) {
    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex, "의사의 활약으로 아무도 죽지 않았습니다.");
    }
  } else {
    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex, `${killedPlayer.userNickname}님이 죽었습니다.`);
    }
  }

  moderator.speak(players, killedPlayer.index, "게임을 관전 하시겠습니까? 나가시겠습니까?");
  choiceToExit = true; //NOTE - 나간다고 가정

  //NOTE - 방을 나갈지 관전할지 선택
  if (choiceToExit) {
    exit(players, killedPlayer.index, roles); //NOTE - 플레이어는 방을 나감, 중간에 나가는 경우에도 사용할 수 있음
  }
  moderator.dayOver(); //NOTE - 아침 종료
  moderator.roundOver(); //NOTE - 라운드 종료

  if (moderator.whoWins.isValid) {
    //NOTE - 게임 종료 만족하는 지
    for (let playerIndex = 0; playerIndex < userCount; playerIndex++) {
      moderator.speak(players, playerIndex`${moderator.whoWins.result} 팀이 이겼습니다.`); //NOTE - 어느 팀이 이겼는지 알림
    }

    gameOver(); //NOTE - 게임 종료
  }
};
gamePlay();