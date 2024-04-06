class Participant {
  constructor(userId, userNickname, index) {
    this.userId = userId;
    this.userNickname = userNickname;
    this.isReady = false;
    this.index = index;
  }
  //NOTE - 게임 준비하기
  ready(isReady) {
    this.isReady = isReady;
  }
}

class Citizen extends Participant {
  constructor(participant) {
    super(participant.userId, participant.userNickname, participant.index);
    this.role = "시민";
    this.isLived = true;
    this.voteTo = "";
    this.votedCount = 0;
  }
  //NOTE - 플레이어를 선택하는 투표
  voteToPlayer(citizen) {
    this.voteTo = receiverIndex;
    citizen.votedCount++;
  }

  //NOTE - 찬성, 반대를 결정하는 투표
  voteYesOrNo(votes, yesOrNo) {
    votes.push(yesOrNo);
    return votes;
  }
  //NOTE - 방나가기, setRoles 따로 처리하기
  exit(roles) {
    this.isLived = false;
  }
}