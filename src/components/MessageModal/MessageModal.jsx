import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import styles from "./MessageModal.module.css";

import sendIcon from "../../assets/icons/sendIcon.svg";
import chatIcon2 from "../../assets/icons/chatIcon2.svg";
import searchIcon from "../../assets/icons/searchIcon.svg";
import chatcheckIcon from "../../assets/icons/chatcheckIcon.svg";

import {
  getMessageRecipients,
  getRecentConversations,
  getOrCreateDirectConversation,
} from "../../api/messageApi";

function MessageModal({ onClose }) {
  const { t } = useTranslation();

  /* =========================
     화면 상태
  ========================= */

  const [isChatOpen, setIsChatOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);

  /* =========================
     Filter
  ========================= */

  const [selectedCompany, setSelectedCompany] = useState("ALL");

  const [selectedTeam, setSelectedTeam] = useState("ALL");

  const [selectedPosition, setSelectedPosition] = useState("ALL");

  const [openDropdown, setOpenDropdown] = useState(null);

  /* =========================
     조직도 구성원
  ========================= */

  const [organizationMembers, setOrganizationMembers] = useState([]);

  const [isMemberLoading, setIsMemberLoading] = useState(true);

  const [memberError, setMemberError] = useState("");

  /* =========================
     최근 대화
  ========================= */

  const [recentConversations, setRecentConversations] = useState([]);

  const [isRecentLoading, setIsRecentLoading] = useState(true);

  /* =========================
     1:1 대화방
  ========================= */

  const [conversationTarget, setConversationTarget] = useState(null);

  const [isConversationLoading, setIsConversationLoading] = useState(false);

  const [conversationError, setConversationError] = useState("");

  /* =========================
     채팅 메시지
     아직 Mock
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
     아직 번역 API 연결 전
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

    return text;
  };

  const aiTranslation = getMockTranslation(messageInput);

  /* =========================
     조직도 Response에서
     memberId 객체 추출
  ========================= */

  const extractMembers = (value) => {
    const result = [];

    const visit = (item) => {
      if (!item) {
        return;
      }

      if (Array.isArray(item)) {
        item.forEach(visit);

        return;
      }

      if (typeof item !== "object") {
        return;
      }

      if (item.memberId != null) {
        result.push({
          id: item.memberId,

          memberId: item.memberId,

          name: item.name || "",

          email: item.email || "",

          company: item.companyName || "",

          team: item.teamName || "",

          position: item.jobTitle || "",

          activityStatus: item.activityStatus || "OFF",
        });

        return;
      }

      Object.values(item).forEach(visit);
    };

    visit(value);

    return Array.from(
      new Map(result.map((member) => [member.memberId, member])).values(),
    );
  };

  /* =========================
     조직도 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchRecipients = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        if (!isCancelled) {
          setMemberError("워크스페이스 정보가 없습니다.");

          setIsMemberLoading(false);
        }

        return;
      }

      try {
        const result = await getMessageRecipients(workspaceId);

        if (isCancelled) {
          return;
        }

        console.log("메시지 상대 조회 성공:", result);

        const members = extractMembers(result?.data);

        setOrganizationMembers(members);

        setMemberError("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("메시지 상대 조회 실패:", error);

        if (error.status === 401) {
          setMemberError("로그인이 필요합니다.");
        } else {
          setMemberError(error.message || "구성원 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsMemberLoading(false);
        }
      }
    };

    fetchRecipients();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     최근 대화 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchRecent = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        if (!isCancelled) {
          setIsRecentLoading(false);
        }

        return;
      }

      try {
        const result = await getRecentConversations(workspaceId);

        if (isCancelled) {
          return;
        }

        console.log("최근 대화 조회 성공:", result);

        const conversations = Array.isArray(result?.data?.conversations)
          ? result.data.conversations
          : [];

        setRecentConversations(conversations);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("최근 대화 조회 실패:", error);

        setRecentConversations([]);
      } finally {
        if (!isCancelled) {
          setIsRecentLoading(false);
        }
      }
    };

    fetchRecent();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     최근 대화 User 변환
  ========================= */

  const recentChatUsers = useMemo(
    () =>
      recentConversations.map((conversation) => ({
        id: conversation.targetMemberId,

        memberId: conversation.targetMemberId,

        conversationId: conversation.conversationId,

        name: conversation.targetName || "",

        company: conversation.companyName || "",

        team: conversation.teamName || "",

        position: conversation.jobTitle || "",

        activityStatus: conversation.activityStatus || "OFF",

        lastMessageAt: conversation.lastMessageAt || null,
      })),
    [recentConversations],
  );

  const hasMessageHistory = recentChatUsers.length > 0;

  /* =========================
     Filter Option
  ========================= */

  const filterSource = hasMessageHistory
    ? recentChatUsers
    : organizationMembers;

  const companyOptions = useMemo(
    () => [
      ...new Set(filterSource.map((member) => member.company).filter(Boolean)),
    ],
    [filterSource],
  );

  const teamOptions = useMemo(
    () => [
      ...new Set(filterSource.map((member) => member.team).filter(Boolean)),
    ],
    [filterSource],
  );

  const positionOptions = useMemo(
    () => [
      ...new Set(filterSource.map((member) => member.position).filter(Boolean)),
    ],
    [filterSource],
  );

  /* =========================
     최근 대화 시간
  ========================= */

  const formatRecentTime = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    if (diffMinutes < 1) {
      return "방금 전";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return `${diffDays}일 전`;
  };

  /* =========================
     메시지 보내기
     아직 Mock
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

  const handleUserClick = (memberId) => {
    /*
        1:1 대화이므로
        한 명만 선택
      */

    setSelectedUsers((prev) => {
      if (prev.includes(memberId)) {
        return [];
      }

      return [memberId];
    });

    setConversationError("");
  };

  /* =========================
     선택 완료
     1:1 대화방 조회/생성
  ========================= */

  const handleComplete = async () => {
    if (selectedUsers.length === 0) {
      return;
    }

    const workspaceId = localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setConversationError("워크스페이스 정보가 없습니다.");

      return;
    }

    const targetMemberId = selectedUsers[0];

    try {
      setIsConversationLoading(true);

      setConversationError("");

      const result = await getOrCreateDirectConversation(
        workspaceId,
        targetMemberId,
      );

      console.log("1:1 대화방 조회/생성 성공:", result);

      const data = result?.data;

      if (!data?.conversationId) {
        throw new Error("대화방 정보를 불러오지 못했습니다.");
      }

      localStorage.setItem("conversationId", String(data.conversationId));

      if (data.targetMember) {
        setConversationTarget({
          id: data.targetMember.memberId,

          memberId: data.targetMember.memberId,

          name: data.targetMember.name || "",

          company: data.targetMember.companyName || "",

          team: data.targetMember.teamName || "",

          position: data.targetMember.jobTitle || "",

          activityStatus: data.targetMember.activityStatus || "OFF",
        });
      }

      console.log("conversationId:", data.conversationId);

      console.log(data.created ? "새 대화방 생성" : "기존 대화방 조회");

      setIsChatOpen(true);
    } catch (error) {
      console.error("1:1 대화방 조회/생성 실패:", error);

      if (error.status === 401) {
        setConversationError("로그인이 필요합니다.");
      } else {
        setConversationError(error.message || "대화방을 불러오지 못했습니다.");
      }
    } finally {
      setIsConversationLoading(false);
    }
  };

  /* =========================
     검색 / 필터
  ========================= */

  const filterUsers = (users) => {
    const keyword = searchText.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !keyword || user.name.toLowerCase().includes(keyword);

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
    conversationTarget ||
    organizationMembers.find((user) => user.memberId === selectedUsers[0]) ||
    recentChatUsers.find((user) => user.memberId === selectedUsers[0]) ||
    null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={`${styles.modal} ${isChatOpen ? styles.chatModal : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {isChatOpen && selectedUser ? (
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
                    {selectedUser.activityStatus === "ACTIVE"
                      ? "활동 중"
                      : "오프라인"}
                  </span>
                </div>

                <p>
                  {selectedUser.company || "-"}

                  {selectedUser.team && (
                    <>
                      {" · "}
                      {selectedUser.team}
                    </>
                  )}

                  {selectedUser.position && (
                    <>
                      {" · "}
                      {selectedUser.position}
                    </>
                  )}
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
                사용자 선택 Header
            ========================= */}

            <div className={styles.titleRow}>
              <h1>{t("message.title")}</h1>

              <img src={chatIcon2} alt="" className={styles.titleIcon} />
            </div>

            <p className={styles.description}>{t("message.selectRecipient")}</p>

            {/* =========================
                Search
            ========================= */}

            <div className={styles.searchBox}>
              <img src={searchIcon} alt="" className={styles.searchIcon} />

              <input
                type="text"
                value={searchText}
                placeholder={t("message.searchPlaceholder")}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* =========================
                Filter
            ========================= */}

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

            {/* =========================
                최근 대화 / 최근 활동
            ========================= */}

            <div className={styles.section}>
              <h2>
                {hasMessageHistory
                  ? t("message.recentChats")
                  : t("message.recentActivity")}
              </h2>

              {isMemberLoading || isRecentLoading ? (
                <p>구성원을 불러오는 중입니다.</p>
              ) : memberError ? (
                <p>{memberError}</p>
              ) : (
                <div className={styles.userList}>
                  {filterUsers(
                    hasMessageHistory ? recentChatUsers : organizationMembers,
                  ).map((user) => (
                    <UserItem
                      key={user.memberId}
                      user={user}
                      selected={selectedUsers.includes(user.memberId)}
                      onClick={() => handleUserClick(user.memberId)}
                      recentTime={
                        user.lastMessageAt
                          ? formatRecentTime(user.lastMessageAt)
                          : ""
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* =========================
                추천 구성원
            ========================= */}

            {hasMessageHistory && !isMemberLoading && !memberError && (
              <div className={styles.section}>
                <h2>{t("message.recommended")}</h2>

                <div className={styles.userList}>
                  {filterUsers(
                    organizationMembers.filter(
                      (member) =>
                        !recentChatUsers.some(
                          (recent) => recent.memberId === member.memberId,
                        ),
                    ),
                  ).map((user) => (
                    <UserItem
                      key={user.memberId}
                      user={user}
                      selected={selectedUsers.includes(user.memberId)}
                      onClick={() => handleUserClick(user.memberId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* =========================
                선택 인원
            ========================= */}

            {selectedUsers.length > 0 && (
              <div className={styles.selectedCount}>
                {t("message.selectedCount", {
                  count: selectedUsers.length,
                })}
              </div>
            )}

            {/* =========================
                대화방 Error
            ========================= */}

            {conversationError && (
              <p className={styles.errorMessage}>{conversationError}</p>
            )}

            {/* =========================
                선택 완료
            ========================= */}

            <button
              type="button"
              className={styles.completeButton}
              disabled={selectedUsers.length === 0 || isConversationLoading}
              onClick={handleComplete}
            >
              {isConversationLoading
                ? "대화방 불러오는 중..."
                : t("message.completeSelection")}

              {!isConversationLoading && <span>→</span>}
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

function UserItem({
  user,

  selected,

  onClick,

  recentTime = "",
}) {
  const isActive = user.activityStatus === "ACTIVE";

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

          {recentTime ? (
            <span>{recentTime}</span>
          ) : (
            <span>{isActive ? "활동 중" : "오프라인"}</span>
          )}
        </div>

        <p>
          {user.company || "-"}

          {user.team && (
            <>
              {" · "}
              {user.team}
            </>
          )}

          {user.position && (
            <>
              {" · "}
              {user.position}
            </>
          )}
        </p>

        {!recentTime && user.email && <p>{user.email}</p>}
      </div>
    </button>
  );
}

export default MessageModal;
