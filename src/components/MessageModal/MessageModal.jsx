import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./MessageModal.module.css";

import sendIcon from "../../assets/icons/sendIcon.svg";
import chatIcon2 from "../../assets/icons/chatIcon2.svg";
import searchIcon from "../../assets/icons/searchIcon.svg";
import chatcheckIcon from "../../assets/icons/chatcheckIcon.svg";

function MessageModal({ onClose }) {
  const { t } = useTranslation();

  /* =========================
     화면 상태
  ========================= */

  const [isChatOpen, setIsChatOpen] = useState(false);

  const [hasMessageHistory] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  /* =========================
     Filter

     실제 상태값은 번역하지 않음
  ========================= */

  const [selectedCompany, setSelectedCompany] = useState("ALL");

  const [selectedTeam, setSelectedTeam] = useState("ALL");

  const [selectedPosition, setSelectedPosition] = useState("ALL");

  const [openDropdown, setOpenDropdown] = useState(null);

  const companyOptions = ["기업 A", "기업 B"];

  const teamOptions = ["Product Team", "Engineering Team", "Marketing Team"];

  const positionOptions = ["직책 1", "직책 2", "직책 3", "직책 4"];

  /* =========================
     사용자 데이터

     실제 데이터라고 보고 번역하지 않음
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
      activityMinutes: 5,
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
      activityMinutes: 5,
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

     실제 메시지 데이터는 번역 대상 아님
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

  const [openedTranslationId, setOpenedTranslationId] = useState(null);

  const [messageInput, setMessageInput] = useState("");

  /* =========================
     Mock Translation
  ========================= */

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
    setSelectedCompany("ALL");
    setSelectedTeam("ALL");
    setSelectedPosition("ALL");

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
        selectedCompany === "ALL" || user.company === selectedCompany;

      const matchesTeam = selectedTeam === "ALL" || user.team === selectedTeam;

      const matchesPosition =
        selectedPosition === "ALL" || user.position === selectedPosition;

      return matchesSearch && matchesCompany && matchesTeam && matchesPosition;
    });
  };

  const isAllSelected =
    selectedCompany === "ALL" &&
    selectedTeam === "ALL" &&
    selectedPosition === "ALL";

  const getCompanyLabel = () => {
    if (selectedCompany === "ALL") {
      return t("message.company");
    }

    return selectedCompany;
  };

  const getTeamLabel = () => {
    if (selectedTeam === "ALL") {
      return t("message.team");
    }

    return selectedTeam;
  };

  const getPositionLabel = () => {
    if (selectedPosition === "ALL") {
      return t("message.position");
    }

    return selectedPosition;
  };

  const companyDropdownOptions =
    selectedCompany === "ALL"
      ? companyOptions
      : [
          ...companyOptions.filter((company) => company !== selectedCompany),

          "ALL",
        ];

  const teamDropdownOptions =
    selectedTeam === "ALL"
      ? teamOptions
      : [...teamOptions.filter((team) => team !== selectedTeam), "ALL"];

  const positionDropdownOptions =
    selectedPosition === "ALL"
      ? positionOptions
      : [
          ...positionOptions.filter(
            (position) => position !== selectedPosition,
          ),

          "ALL",
        ];

  /* =========================
     선택 상대
  ========================= */

  const selectedUser =
    allUsers.find((user) => user.id === selectedUsers[0]) || recentUsers[0];

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={`${styles.modal} ${isChatOpen ? styles.chatModal : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {isChatOpen ? (
          <>
            {/* =========================
                Header
            ========================= */}

            <div className={styles.titleRow}>
              <h1>{t("message.title")}</h1>

              <img src={chatIcon2} alt="" className={styles.titleIcon} />
            </div>

            {/* =========================
                상대 정보
            ========================= */}

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
                    {index === 2 && (
                      <div className={styles.dateDivider}>
                        <span />

                        <p>08/10 {t("message.today")}</p>

                        <span />
                      </div>
                    )}

                    <div className={styles.senderName}>
                      {isMe
                        ? t("message.me", {
                            name: "홍길동",
                          })
                        : selectedUser.name}
                    </div>

                    <div
                      className={`${styles.messageBubble} ${
                        isMe ? styles.myBubble : styles.otherBubble
                      }`}
                    >
                      {message.text}
                    </div>

                    <div className={styles.messageMeta}>
                      <span>{message.time}</span>

                      <span>{message.otherTime}</span>
                    </div>

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
                        {isMe
                          ? t("message.viewTranslation")
                          : t("message.viewOriginal")}

                        <img src={chatcheckIcon} alt="" />
                      </button>

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
              <label>{t("message.messageLabel")}</label>

              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />

              <div className={styles.aiLabel}>
                → {t("message.aiTranslation")}
              </div>

              <textarea
                value={aiTranslation}
                readOnly
                className={styles.translationInput}
              />
            </div>

            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSendMessage}
            >
              <span>{t("message.send")}</span>

              <img src={sendIcon} alt="" />
            </button>
          </>
        ) : (
          <>
            {/* =========================
                사용자 선택
            ========================= */}

            <div className={styles.titleRow}>
              <h1>{t("message.title")}</h1>

              <img src={chatIcon2} alt="" className={styles.titleIcon} />
            </div>

            <p className={styles.description}>{t("message.selectRecipient")}</p>

            {/* Search */}

            <div className={styles.searchBox}>
              <img src={searchIcon} alt="" className={styles.searchIcon} />

              <input
                type="text"
                value={searchText}
                placeholder={t("message.searchPlaceholder")}
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
                {t("message.all")}
              </button>

              <FilterDropdown
                label={getCompanyLabel()}
                open={openDropdown === "company"}
                onToggle={() => handleDropdownToggle("company")}
                options={companyDropdownOptions}
                allLabel={t("message.company")}
                onSelect={handleCompanySelect}
              />

              <FilterDropdown
                label={getTeamLabel()}
                open={openDropdown === "team"}
                onToggle={() => handleDropdownToggle("team")}
                options={teamDropdownOptions}
                allLabel={t("message.team")}
                onSelect={handleTeamSelect}
              />

              <FilterDropdown
                label={getPositionLabel()}
                open={openDropdown === "position"}
                onToggle={() => handleDropdownToggle("position")}
                options={positionDropdownOptions}
                allLabel={t("message.position")}
                onSelect={handlePositionSelect}
              />
            </div>

            {/* 최근 */}

            <div className={styles.section}>
              <h2>
                {hasMessageHistory
                  ? t("message.recentChats")
                  : t("message.recentActivity")}
              </h2>

              <div className={styles.userList}>
                {filterUsers(recentUsers).map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    showActivity={!hasMessageHistory}
                    selected={selectedUsers.includes(user.id)}
                    onClick={() => handleUserClick(user.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {/* 추천 */}

            <div className={styles.section}>
              <h2>{t("message.recommended")}</h2>

              <div className={styles.userList}>
                {filterUsers(recommendedUsers).map((user) => (
                  <UserItem
                    key={user.id}
                    user={user}
                    selected={selectedUsers.includes(user.id)}
                    onClick={() => handleUserClick(user.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className={styles.selectedCount}>
                {t("message.selectedCount", {
                  count: selectedUsers.length,
                })}
              </div>
            )}

            <button
              type="button"
              className={styles.completeButton}
              disabled={selectedUsers.length === 0}
              onClick={handleComplete}
            >
              {t("message.completeSelection")}

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

function FilterDropdown({
  label,
  open,
  onToggle,
  options,
  allLabel,
  onSelect,
}) {
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
              {option === "ALL" ? allLabel : option}
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

function UserItem({ user, showActivity = false, selected, onClick, t }) {
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

          {showActivity && user.activityMinutes !== undefined && (
            <span>
              {t("message.activeMinutesAgo", {
                count: user.activityMinutes,
              })}
            </span>
          )}
        </div>

        <p>
          {user.company}
          {" · "}
          {user.team.replace(" Team", "")}
          {" · "}
          {user.detailPosition}
        </p>

        <p>
          {t("message.currentTime")} {user.time}
          {" · "}
          {user.city}
        </p>
      </div>
    </button>
  );
}

export default MessageModal;
