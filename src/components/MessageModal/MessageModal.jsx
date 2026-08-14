import { useState } from "react";

import styles from "./MessageModal.module.css";
import sendIcon from "../../assets/icons/sendIcon.svg";
import chatIcon2 from "../../assets/icons/chatIcon2.svg";
import searchIcon from "../../assets/icons/searchIcon.svg";
import chatcheckIcon from "../../assets/icons/chatcheckIcon.svg";

function MessageModal({ onClose }) {
  /* =========================
     화면 상태
     false → 사람 선택
     true  → 채팅
  ========================= */

  const [isChatOpen, setIsChatOpen] = useState(false);

  /* =========================
     최근 대화 존재 여부
  ========================= */

  const [hasMessageHistory] = useState(false);

  /* =========================
     검색
  ========================= */

  const [searchText, setSearchText] = useState("");

  /* =========================
     선택 사용자
  ========================= */

  const [selectedUsers, setSelectedUsers] = useState([]);

  /* =========================
     Filter
  ========================= */

  const [selectedCompany, setSelectedCompany] = useState("소속 기업");

  const [selectedTeam, setSelectedTeam] = useState("소속 팀");

  const [selectedPosition, setSelectedPosition] = useState("직책");

  const [openDropdown, setOpenDropdown] = useState(null);

  const companyOptions = ["기업 A", "기업 B"];

  const teamOptions = ["Product Team", "Engineering Team", "Marketing Team"];

  const positionOptions = ["직책 1", "직책 2", "직책 3", "직책 4"];

  /* =========================
     사용자 데이터
  ========================= */

  const recentUsers = [
    {
      id: 1,
      name: "외국인°",
      company: "기업 B",
      team: "Engineering Team",
      position: "직책 2",
      detailPosition: "Backend Engineer",
      time: "09:15",
      city: "London",
      activity: "최근 활동 5분 전",
    },

    {
      id: 2,
      name: "외국인°",
      company: "기업 A",
      team: "Product Team",
      position: "직책 1",
      detailPosition: "Product Manager",
      time: "09:15",
      city: "London",
      activity: "최근 활동 5분 전",
    },
  ];

  const recommendedUsers = [
    {
      id: 3,
      name: "외국인°",
      company: "기업 B",
      team: "Engineering Team",
      position: "직책 2",
      detailPosition: "Backend Engineer",
      time: "09:15",
      city: "London",
    },

    {
      id: 4,
      name: "외국인°",
      company: "기업 A",
      team: "Marketing Team",
      position: "직책 4",
      detailPosition: "Product Marketer",
      time: "09:15",
      city: "London",
    },

    {
      id: 5,
      name: "외국인°",
      company: "기업 B",
      team: "Product Team",
      position: "직책 1",
      detailPosition: "Product Manager",
      time: "09:15",
      city: "London",
    },

    {
      id: 6,
      name: "외국인°",
      company: "기업 A",
      team: "Engineering Team",
      position: "직책 3",
      detailPosition: "Frontend Engineer",
      time: "09:15",
      city: "London",
    },
  ];

  const allUsers = [...recentUsers, ...recommendedUsers];

  /* =========================
     채팅 메시지
  ========================= */

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "me",

      text: "내일까지 봐주시고, 문제 있으면 말씀해주세요!",

      translatedText:
        "Hi Emily, Could you please review this by 3PM tomorrow (BST)? If you find any issues, let me know!",

      time: "14:00 KST",
      otherTime: "06:00 BST",
    },

    {
      id: 2,
      sender: "other",

      text: "API 연동 검토를 완료했습니다. 오류 처리 흐름에서 한 가지 이슈를 발견해 Issue #42에 댓글을 남겼습니다. 제가 바로 수정 작업을 진행할까요, 아니면 개발팀의 확인 후 진행할까요?",

      originalText:
        "I finished reviewing the API integration. I found one issue in the error-handling flow and left a comment on Issue #42. Should I fix it right away, or wait for the development team's confirmation?",

      time: "14:00 KST",
      otherTime: "06:00 BST",
    },

    {
      id: 3,
      sender: "me",

      text: "확인했습니다! 해당 부분은 바로 수정해주셔도 됩니다. 수정이 완료되면 Issue #42에 결과만 남겨주세요. 감사합니다!",

      translatedText:
        "Confirmed! You can go ahead and fix that part. Once it's completed, please leave the result on Issue #42. Thank you!",

      time: "14:00 KST",
      otherTime: "06:00 BST",
    },
  ]);

  /* =========================
     번역 말풍선
     message id 저장
  ========================= */

  const [openedTranslationId, setOpenedTranslationId] = useState(null);

  /* =========================
     메시지 입력
  ========================= */

  const [messageInput, setMessageInput] = useState("");

  /*
    현재는 API 연결 전이라
    예시 번역문을 즉시 생성하는 mock 함수.

    나중에는 이 함수 내부에서
    번역 API를 호출하면 됨.
  */

  const getMockTranslation = (text) => {
    if (!text.trim()) {
      return "";
    }

    const predefined = {
      안녕하세요: "Hello!",
      "내일까지 확인 부탁드립니다.": "Please check it by tomorrow.",
      "문제 있으면 말씀해주세요.":
        "Please let me know if there are any issues.",
    };

    if (predefined[text.trim()]) {
      return predefined[text.trim()];
    }

    return `${text}`;
  };

  const aiTranslation = getMockTranslation(messageInput);

  /* =========================
     메시지 보내기
  ========================= */

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    const newMessage = {
      id: Date.now(),

      sender: "me",

      text: messageInput.trim(),

      translatedText: aiTranslation,

      time: "14:00 KST",

      otherTime: "06:00 BST",
    };

    setMessages((prev) => [...prev, newMessage]);

    setMessageInput("");
  };

  /* =========================
     Dropdown
  ========================= */

  const handleDropdownToggle = (type) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);

    setOpenDropdown(null);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);

    setOpenDropdown(null);
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);

    setOpenDropdown(null);
  };

  const handleAllFilter = () => {
    setSelectedCompany("소속 기업");

    setSelectedTeam("소속 팀");

    setSelectedPosition("직책");

    setOpenDropdown(null);
  };

  /* =========================
     사용자 선택
  ========================= */

  const handleUserClick = (id) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((userId) => userId !== id);
      }

      return [...prev, id];
    });
  };

  /* =========================
     선택 완료
  ========================= */

  const handleComplete = () => {
    if (selectedUsers.length === 0) {
      return;
    }

    setIsChatOpen(true);
  };

  /* =========================
     검색 / 필터
  ========================= */

  const filterUsers = (users) => {
    const keyword = searchText.trim().toLowerCase();

    return users.filter((user) => {
      const searchTarget = `
        ${user.name}
        ${user.company}
        ${user.team}
        ${user.position}
        ${user.detailPosition}
      `.toLowerCase();

      const matchesSearch = !keyword || searchTarget.includes(keyword);

      const matchesCompany =
        selectedCompany === "소속 기업" || user.company === selectedCompany;

      const matchesTeam =
        selectedTeam === "소속 팀" || user.team === selectedTeam;

      const matchesPosition =
        selectedPosition === "직책" || user.position === selectedPosition;

      return matchesSearch && matchesCompany && matchesTeam && matchesPosition;
    });
  };

  const isAllSelected =
    selectedCompany === "소속 기업" &&
    selectedTeam === "소속 팀" &&
    selectedPosition === "직책";

  const companyDropdownOptions = [
    ...companyOptions.filter((company) => company !== selectedCompany),

    ...(selectedCompany !== "소속 기업" ? ["소속 기업"] : []),
  ];

  const teamDropdownOptions = [
    ...teamOptions.filter((team) => team !== selectedTeam),

    ...(selectedTeam !== "소속 팀" ? ["소속 팀"] : []),
  ];

  const positionDropdownOptions = [
    ...positionOptions.filter((position) => position !== selectedPosition),

    ...(selectedPosition !== "직책" ? ["직책"] : []),
  ];

  /* =========================
     선택한 상대
  ========================= */

  const selectedUser =
    allUsers.find((user) => user.id === selectedUsers[0]) || recentUsers[0];

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={`${styles.modal} ${isChatOpen ? styles.chatModal : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =================================================
            채팅 화면
        ================================================= */}

        {isChatOpen ? (
          <>
            {/* Header */}

            <div className={styles.titleRow}>
              <h1>Message</h1>

              <img src={chatIcon2} alt="" className={styles.titleIcon} />
            </div>

            {/* 상대 정보 */}

            <div className={styles.chatUserCard}>
              <div className={styles.avatar} />

              <div className={styles.chatUserInfo}>
                <div>
                  <strong>{selectedUser.name}</strong>

                  <span>
                    {selectedUser.time} · {selectedUser.city}
                  </span>
                </div>

                <p>
                  {selectedUser.company}
                  {" · "}
                  {selectedUser.team.replace(" Team", "")}
                  {" · "}
                  {selectedUser.detailPosition}
                </p>
              </div>
            </div>

            {/* =========================
                Chat
            ========================= */}

            <div className={styles.chatArea}>
              {messages.map((message, index) => {
                const isMe = message.sender === "me";

                return (
                  <div
                    key={message.id}
                    className={`${styles.messageRow} ${
                      isMe ? styles.myMessageRow : styles.otherMessageRow
                    }`}
                  >
                    {/* 날짜 구분 */}

                    {index === 2 && (
                      <div className={styles.dateDivider}>
                        <span />

                        <p>08/10 오늘</p>

                        <span />
                      </div>
                    )}

                    <div className={styles.senderName}>
                      {isMe ? "홍길동 (나)" : selectedUser.name}
                    </div>

                    {/* 실제 메시지 */}
                    <div
                      className={`${styles.messageBubble} ${
                        isMe ? styles.myBubble : styles.otherBubble
                      }`}
                    >
                      {message.text}
                    </div>

                    {/* 시간 */}
                    <div className={styles.messageMeta}>
                      <span>{message.time}</span>
                      <span>{message.otherTime}</span>
                    </div>

                    {/* 번역문 / 원문 보기 */}
                    <div className={styles.translationWrapper}>
                      <button
                        type="button"
                        className={styles.translationButton}
                        onClick={() =>
                          setOpenedTranslationId((prev) =>
                            prev === message.id ? null : message.id,
                          )
                        }
                      >
                        {isMe ? "번역문 보기" : "원문 보기"}

                        <img src={chatcheckIcon} alt="" />
                      </button>

                      {/* 버튼 아래에 오버레이로 표시 */}
                      {openedTranslationId === message.id && (
                        <div
                          className={`${styles.translationBubble} ${
                            isMe
                              ? styles.myTranslationBubble
                              : styles.otherTranslationBubble
                          }`}
                        >
                          {isMe ? message.translatedText : message.originalText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================
                입력
            ========================= */}

            <div className={styles.messageComposer}>
              <label>메시지</label>

              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />

              <div className={styles.aiLabel}>→ AI 번역</div>

              <textarea
                value={aiTranslation}
                readOnly
                className={styles.translationInput}
              />
            </div>

            {/* 보내기 */}

            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSendMessage}
            >
              <span>보내기</span>
              <img src={sendIcon} alt="" />
            </button>
          </>
        ) : (
          <>
            {/* =================================================
                사용자 선택 화면
            ================================================= */}

            <div className={styles.titleRow}>
              <h1>Message</h1>

              <img src={chatIcon2} alt="" className={styles.titleIcon} />
            </div>

            <p className={styles.description}>누구에게 메시지를 보낼까요?</p>

            {/* Search */}

            <div className={styles.searchBox}>
              <img src={searchIcon} alt="" className={styles.searchIcon} />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Filter */}

            <div className={styles.filters}>
              <button
                type="button"
                className={`${styles.filterButton} ${
                  isAllSelected ? styles.activeFilter : ""
                }`}
                onClick={handleAllFilter}
              >
                전체
              </button>

              <FilterDropdown
                label={selectedCompany}
                open={openDropdown === "company"}
                onToggle={() => handleDropdownToggle("company")}
                options={companyDropdownOptions}
                onSelect={handleCompanySelect}
              />

              <FilterDropdown
                label={selectedTeam}
                open={openDropdown === "team"}
                onToggle={() => handleDropdownToggle("team")}
                options={teamDropdownOptions}
                onSelect={handleTeamSelect}
              />

              <FilterDropdown
                label={selectedPosition}
                open={openDropdown === "position"}
                onToggle={() => handleDropdownToggle("position")}
                options={positionDropdownOptions}
                onSelect={handlePositionSelect}
              />
            </div>

            {/* 최근 */}

            <div className={styles.section}>
              <h2>{hasMessageHistory ? "최근 대화" : "최근 활동"}</h2>

              <div className={styles.userList}>
                {filterUsers(recentUsers).map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    showActivity={!hasMessageHistory}
                    selected={selectedUsers.includes(user.id)}
                    onClick={() => handleUserClick(user.id)}
                  />
                ))}
              </div>
            </div>

            {/* 추천 */}

            <div className={styles.section}>
              <h2>추천</h2>

              <div className={styles.userList}>
                {filterUsers(recommendedUsers).map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    selected={selectedUsers.includes(user.id)}
                    onClick={() => handleUserClick(user.id)}
                  />
                ))}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className={styles.selectedCount}>
                {selectedUsers.length}명 선택
              </div>
            )}

            <button
              type="button"
              className={styles.completeButton}
              disabled={selectedUsers.length === 0}
              onClick={handleComplete}
            >
              선택 완료
              <span>→</span>
            </button>
          </>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   FilterDropdown
========================================================= */

function FilterDropdown({ label, open, onToggle, options, onSelect }) {
  return (
    <div className={styles.filterDropdown}>
      <button type="button" className={styles.filterButton} onClick={onToggle}>
        {label}
      </button>

      {open && (
        <div className={styles.filterMenu}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.filterOption}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   UserItem
========================================================= */

function UserItem({ user, showActivity = false, selected, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.userItem} ${selected ? styles.selectedUser : ""}`}
      onClick={onClick}
    >
      <div className={styles.avatar} />

      <div className={styles.userInfo}>
        <div className={styles.userNameRow}>
          <strong>{user.name}</strong>

          {showActivity && user.activity && <span>{user.activity}</span>}
        </div>

        <p>
          {user.company}
          {" · "}
          {user.team.replace(" Team", "")}
          {" · "}
          {user.detailPosition}
        </p>

        <p>
          현재 {user.time}
          {" · "}
          {user.city}
        </p>
      </div>
    </button>
  );
}

export default MessageModal;
