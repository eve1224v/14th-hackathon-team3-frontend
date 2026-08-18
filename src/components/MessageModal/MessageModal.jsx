import { useEffect, useMemo, useState } from "react";

import styles from "./MessageModal.module.css";

import sendIcon from "../../assets/icons/sendIcon.svg";
import chatIcon2 from "../../assets/icons/chatIcon2.svg";
import searchIcon from "../../assets/icons/searchIcon.svg";
import chatcheckIcon from "../../assets/icons/chatcheckIcon.svg";

import {
  getMessageRecipients,
  getRecentConversations,
  getOrCreateDirectConversation,
  getConversationMessages,
  previewTranslation,
  sendConversationMessage,
} from "../../api/messageApi";

function MessageModal({ onClose }) {
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
     메시지
  ========================= */

  const [messages, setMessages] = useState([]);

  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const [messagesError, setMessagesError] = useState("");

  const [openedTranslationId, setOpenedTranslationId] = useState(null);

  /* =========================
     메시지 입력
  ========================= */

  const [messageInput, setMessageInput] = useState("");

  /* =========================
     AI 번역 미리보기
  ========================= */

  const [translationPreview, setTranslationPreview] = useState("");

  const [translationNuance, setTranslationNuance] = useState("");

  const [isTranslationLoading, setIsTranslationLoading] = useState(false);

  const [translationError, setTranslationError] = useState("");

  /* =========================
     메시지 전송
  ========================= */

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  /* =========================
     조직도 Response 정리
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
     메시지 시간
  ========================= */

  const formatMessageTime = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  /* =========================
     메시지 날짜
  ========================= */

  const formatMessageDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  /* =========================
     대화 메시지 조회
  ========================= */

  const fetchConversationMessages = async (conversationId, page = 0) => {
    const workspaceId = localStorage.getItem("workspaceId");

    if (!workspaceId) {
      setMessagesError("워크스페이스 정보가 없습니다.");

      return;
    }

    if (!conversationId) {
      setMessagesError("대화방 정보가 없습니다.");

      return;
    }

    try {
      setIsMessagesLoading(true);

      setMessagesError("");

      const result = await getConversationMessages(
        workspaceId,
        conversationId,
        {
          page,
          size: 50,
        },
      );

      console.log("메시지 대화 내용 조회 성공:", result);

      const apiMessages = Array.isArray(result?.data?.messages)
        ? result.data.messages
        : [];

      const normalizedMessages = [...apiMessages].reverse().map((message) => ({
        id: message.messageId,

        messageId: message.messageId,

        senderMemberId: message.senderMemberId,

        senderName: message.senderName || "알 수 없는 사용자",

        text: message.originalContent || "",

        originalText: message.originalContent || "",

        translatedText: message.translatedContent || "",

        translationUsed: Boolean(message.translationUsed),

        createdAt: message.createdAt,
      }));

      setMessages(normalizedMessages);
    } catch (error) {
      console.error("메시지 조회 실패:", error);

      setMessages([]);

      if (
        error.code === "INVALID_INPUT_VALUE" ||
        error.code === "400INVALID_INPUT_VALUE"
      ) {
        setMessagesError("메시지 조회 정보가 올바르지 않습니다.");
      } else if (error.status === 401) {
        setMessagesError("로그인이 필요합니다.");
      } else {
        setMessagesError(error.message || "메시지를 불러오지 못했습니다.");
      }
    } finally {
      setIsMessagesLoading(false);
    }
  };

  /* =========================
     메시지 입력
  ========================= */

  const handleMessageInputChange = (e) => {
    const value = e.target.value;

    setMessageInput(value);

    if (!value.trim()) {
      setTranslationPreview("");

      setTranslationNuance("");

      setTranslationError("");

      setIsTranslationLoading(false);
    }
  };

  /* =========================
     AI 번역 Preview
  ========================= */

  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    const trimmedContent = messageInput.trim();

    if (!trimmedContent) {
      return undefined;
    }

    const workspaceId = localStorage.getItem("workspaceId");

    const conversationId = localStorage.getItem("conversationId");

    if (!workspaceId || !conversationId) {
      return undefined;
    }

    let isCancelled = false;

    const timer = setTimeout(() => {
      const fetchTranslationPreview = async () => {
        try {
          setIsTranslationLoading(true);

          setTranslationError("");

          const result = await previewTranslation(
            workspaceId,
            conversationId,
            trimmedContent,
          );

          if (isCancelled) {
            return;
          }

          console.log("AI 번역 미리보기 성공:", result);

          const data = result?.data;

          setTranslationPreview(data?.translatedContent || "");

          setTranslationNuance(data?.nuance || "");
        } catch (error) {
          if (isCancelled) {
            return;
          }

          console.error("AI 번역 미리보기 실패:", error);

          setTranslationPreview("");

          setTranslationNuance("");

          switch (error.code) {
            case "TRANSLATION_LANGUAGE_NOT_CONFIGURED":
              setTranslationError(
                "번역에 필요한 상대방 언어가 설정되어 있지 않습니다.",
              );

              break;

            case "TEMPORAL_CONTEXT_NOT_CONFIGURED":
              setTranslationError(
                "날짜·시간 변환에 필요한 업무 지역이 설정되어 있지 않습니다.",
              );

              break;

            case "AI_TRANSLATION_FAILED":
              setTranslationError("AI 번역 처리에 실패했습니다.");

              break;

            case "AI_TRANSLATION_TIMEOUT":
              setTranslationError("AI 번역 요청 시간이 초과되었습니다.");

              break;

            case "MEMBER_NOT_FOUND":
              setTranslationError(
                "현재 상대방에게 번역 미리보기를 사용할 수 없습니다.",
              );

              break;

            default:
              setTranslationError(
                error.message || "번역 미리보기에 실패했습니다.",
              );
          }
        } finally {
          if (!isCancelled) {
            setIsTranslationLoading(false);
          }
        }
      };

      fetchTranslationPreview();
    }, 600);

    return () => {
      isCancelled = true;

      clearTimeout(timer);
    };
  }, [messageInput, isChatOpen]);

  /* =========================
     메시지 전송
  ========================= */

  const handleSendMessage = async () => {
    const trimmedContent = messageInput.trim();

    if (!trimmedContent) {
      return;
    }

    if (trimmedContent.length > 4000) {
      alert("메시지는 최대 4000자까지 입력할 수 있습니다.");

      return;
    }

    const workspaceId = localStorage.getItem("workspaceId");

    const conversationId = localStorage.getItem("conversationId");

    if (!workspaceId) {
      alert("워크스페이스 정보가 없습니다.");

      return;
    }

    if (!conversationId) {
      alert("대화방 정보가 없습니다.");

      return;
    }

    /*
      현재 UI에는 번역 사용 여부 토글이 없으므로
      Preview 결과가 있으면 AI 번역 요청으로 전송
    */

    const translationRequested = Boolean(translationPreview);

    try {
      setIsSendingMessage(true);

      const result = await sendConversationMessage(
        workspaceId,
        conversationId,
        {
          originalContent: trimmedContent,

          translationUsed: translationRequested,
        },
      );

      console.log("메시지 전송 성공:", result);

      const data = result?.data;

      if (!data?.messageId) {
        throw new Error("전송된 메시지 정보를 확인할 수 없습니다.");
      }

      /*
        서버 Response 그대로 사용
      */

      const newMessage = {
        id: data.messageId,

        messageId: data.messageId,

        senderMemberId: data.senderMemberId,

        senderName: null,

        text: data.originalContent || "",

        originalText: data.originalContent || "",

        translatedText: data.translatedContent || "",

        translationUsed: Boolean(data.translationUsed),

        createdAt: data.createdAt,

        isTemporaryMine: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      setMessageInput("");

      setTranslationPreview("");

      setTranslationNuance("");

      setTranslationError("");

      /*
        메시지가 생겼으므로
        최근 대화 다시 조회
      */

      try {
        const recentResult = await getRecentConversations(workspaceId);

        const conversations = Array.isArray(recentResult?.data?.conversations)
          ? recentResult.data.conversations
          : [];

        setRecentConversations(conversations);
      } catch (recentError) {
        console.error("최근 대화 새로고침 실패:", recentError);
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);

      switch (error.code) {
        case "TRANSLATION_LANGUAGE_NOT_CONFIGURED":
          alert("번역에 필요한 사용자 언어가 설정되어 있지 않습니다.");

          break;

        case "TEMPORAL_CONTEXT_NOT_CONFIGURED":
          alert("날짜·시간 변환에 필요한 업무 지역이 설정되어 있지 않습니다.");

          break;

        case "AI_TRANSLATION_FAILED":
          alert("AI 번역 처리에 실패했습니다.");

          break;

        case "AI_TRANSLATION_TIMEOUT":
          alert("AI 번역 요청 시간이 초과되었습니다.");

          break;

        case "MEMBER_NOT_FOUND":
          alert("현재 상대방에게 새 메시지를 보낼 수 없습니다.");

          break;

        default:
          if (error.status === 401) {
            alert("로그인이 필요합니다.");
          } else {
            alert(error.message || "메시지 전송에 실패했습니다.");
          }
      }
    } finally {
      setIsSendingMessage(false);
    }
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
      } else {
        const target =
          organizationMembers.find(
            (member) => member.memberId === targetMemberId,
          ) ||
          recentChatUsers.find((member) => member.memberId === targetMemberId);

        if (target) {
          setConversationTarget(target);
        }
      }

      await fetchConversationMessages(data.conversationId);

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
        !keyword || (user.name || "").toLowerCase().includes(keyword);

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
      return "소속 기업";
    }

    return selectedCompany;
  };

  const getTeamLabel = () => {
    if (selectedTeam === "ALL") {
      return "소속 팀";
    }

    return selectedTeam;
  };

  const getPositionLabel = () => {
    if (selectedPosition === "ALL") {
      return "직책";
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
              <h1>Message</h1>

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
                채팅 내용
            ========================= */}

            <div className={styles.chatArea}>
              {isMessagesLoading ? (
                <p>메시지를 불러오는 중입니다.</p>
              ) : messagesError ? (
                <p className={styles.errorMessage}>{messagesError}</p>
              ) : messages.length === 0 ? (
                <p>아직 주고받은 메시지가 없습니다.</p>
              ) : (
                messages.map((message, index) => {
                  /*
                    상대방의 memberId와 다르면
                    내 메시지로 판단
                  */

                  const isMe =
                    message.isTemporaryMine ||
                    message.senderMemberId !== selectedUser.memberId;

                  const previousMessage =
                    index > 0 ? messages[index - 1] : null;

                  const currentDate = formatMessageDate(message.createdAt);

                  const previousDate = previousMessage
                    ? formatMessageDate(previousMessage.createdAt)
                    : null;

                  const showDateDivider =
                    !previousMessage || currentDate !== previousDate;

                  return (
                    <div
                      key={message.id}
                      className={`${styles.messageRow} ${
                        isMe ? styles.myMessageRow : styles.otherMessageRow
                      }`}
                    >
                      {showDateDivider && (
                        <div className={styles.dateDivider}>
                          <span />

                          <p>{currentDate}</p>

                          <span />
                        </div>
                      )}

                      <div className={styles.senderName}>
                        {isMe ? "나" : message.senderName || selectedUser.name}
                      </div>

                      <div
                        className={`${styles.messageBubble} ${
                          isMe ? styles.myBubble : styles.otherBubble
                        }`}
                      >
                        {message.text}
                      </div>

                      <div className={styles.messageMeta}>
                        <span>{formatMessageTime(message.createdAt)}</span>
                      </div>

                      {/* =========================
                          번역 결과
                      ========================= */}

                      {message.translationUsed && message.translatedText && (
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

                          {openedTranslationId === message.id && (
                            <div
                              className={`${styles.translationBubble} ${
                                isMe
                                  ? styles.myTranslationBubble
                                  : styles.otherTranslationBubble
                              }`}
                            >
                              {isMe
                                ? message.translatedText
                                : message.originalText}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* =========================
                메시지 작성
            ========================= */}

            <div className={styles.messageComposer}>
              <label>메시지</label>

              <textarea
                value={messageInput}
                maxLength={4000}
                onChange={handleMessageInputChange}
              />

              <div className={styles.aiLabel}>→ AI 번역</div>

              <textarea
                value={isTranslationLoading ? "번역 중..." : translationPreview}
                readOnly
                className={styles.translationInput}
              />

              {translationNuance && (
                <p className={styles.translationNuance}>{translationNuance}</p>
              )}

              {translationError && (
                <p className={styles.errorMessage}>{translationError}</p>
              )}
            </div>

            {/* =========================
                전송
            ========================= */}

            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={
                !messageInput.trim() || isTranslationLoading || isSendingMessage
              }
            >
              <span>{isSendingMessage ? "전송 중..." : "보내기"}</span>

              {!isSendingMessage && <img src={sendIcon} alt="" />}
            </button>
          </>
        ) : (
          <>
            {/* =========================
                사용자 선택
            ========================= */}

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
                placeholder="이름, 회사, 팀, 직책 검색"
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
                label={getCompanyLabel()}
                open={openDropdown === "company"}
                onToggle={() => handleDropdownToggle("company")}
                options={companyDropdownOptions}
                allLabel="소속 기업"
                onSelect={handleCompanySelect}
              />

              <FilterDropdown
                label={getTeamLabel()}
                open={openDropdown === "team"}
                onToggle={() => handleDropdownToggle("team")}
                options={teamDropdownOptions}
                allLabel="소속 팀"
                onSelect={handleTeamSelect}
              />

              <FilterDropdown
                label={getPositionLabel()}
                open={openDropdown === "position"}
                onToggle={() => handleDropdownToggle("position")}
                options={positionDropdownOptions}
                allLabel="직책"
                onSelect={handlePositionSelect}
              />
            </div>

            {/* =========================
                최근 대화
            ========================= */}

            <div className={styles.section}>
              <h2>{hasMessageHistory ? "최근 대화" : "최근 활동"}</h2>

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
                <h2>추천</h2>

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

            {/* 선택 수 */}

            {selectedUsers.length > 0 && (
              <div className={styles.selectedCount}>
                {selectedUsers.length}명 선택
              </div>
            )}

            {conversationError && (
              <p className={styles.errorMessage}>{conversationError}</p>
            )}

            {/* 선택 완료 */}

            <button
              type="button"
              className={styles.completeButton}
              disabled={selectedUsers.length === 0 || isConversationLoading}
              onClick={handleComplete}
            >
              {isConversationLoading ? "대화방 불러오는 중..." : "선택 완료"}

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

function UserItem({ user, selected, onClick, recentTime = "" }) {
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
