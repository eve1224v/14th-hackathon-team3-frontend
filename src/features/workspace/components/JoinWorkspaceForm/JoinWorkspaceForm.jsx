import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./JoinWorkspaceForm.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import { joinWorkspace } from "../../../../api/workspaceInvitationApi";

function JoinWorkspaceForm() {
  const navigate = useNavigate();

  const location = useLocation();

  /* =========================================
     Modal에서 전달받은 초대 토큰
  ========================================= */

  const receivedInviteToken = location.state?.inviteToken || "";

  /* =========================================
     Form State
  ========================================= */

  const [inviteLink, setInviteLink] = useState(receivedInviteToken);

  const [name, setName] = useState(localStorage.getItem("userName") || "");

  const [companyName, setCompanyName] = useState(
    localStorage.getItem("userCompany") || "",
  );

  const [teamName, setTeamName] = useState("");

  const [jobTitle, setJobTitle] = useState("");

  /* =========================================
     상태
  ========================================= */

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [isLinkChecked, setIsLinkChecked] = useState(
    Boolean(receivedInviteToken),
  );

  /* =========================================
     초대 링크 → 초대 토큰 추출
  ========================================= */

  const extractInviteToken = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "";
    }

    try {
      /*
        전체 URL인 경우

        예)
        https://.../invite?token=ws_1234

        ↓

        ws_1234
      */

      if (
        trimmedValue.startsWith("http://") ||
        trimmedValue.startsWith("https://")
      ) {
        const url = new URL(trimmedValue);

        const token = url.searchParams.get("token");

        if (token) {
          return token;
        }

        return "";
      }
    } catch (error) {
      console.error("초대 링크 파싱 실패:", error);

      return "";
    }

    /*
      이미 토큰 형태인 경우

      예)
      ws_21967b227d714b91a3193f986f816a4c
    */

    return trimmedValue;
  };

  /* =========================================
     링크 확인
  ========================================= */

  const handleCheckLink = () => {
    setErrorMessage("");

    const inviteToken = extractInviteToken(inviteLink);

    if (!inviteToken) {
      setErrorMessage("올바른 초대 링크 또는 초대 코드를 입력해주세요.");

      setIsLinkChecked(false);

      return;
    }

    /*
      input에는 실제 토큰만 표시
    */

    setInviteLink(inviteToken);

    setIsLinkChecked(true);
  };

  /* =========================================
     워크스페이스 참여
  ========================================= */

  const handleJoinWorkspace = async () => {
    if (isLoading) {
      return;
    }

    setErrorMessage("");

    /* =========================================
       초대 Token
    ========================================= */

    const inviteToken = extractInviteToken(inviteLink);

    if (!inviteToken) {
      setErrorMessage("초대 링크를 입력해주세요.");

      return;
    }

    /* =========================================
       필수값 검사
    ========================================= */

    if (!name.trim()) {
      setErrorMessage("이름을 입력해주세요.");

      return;
    }

    if (!companyName.trim()) {
      setErrorMessage("소속 기업을 입력해주세요.");

      return;
    }

    if (!teamName.trim()) {
      setErrorMessage("팀을 입력해주세요.");

      return;
    }

    try {
      setIsLoading(true);

      /* =========================================
         API 호출
      ========================================= */

      const result = await joinWorkspace({
        inviteToken,

        name: name.trim(),

        companyName: companyName.trim(),

        teamName: teamName.trim(),

        jobTitle: jobTitle.trim(),
      });

      console.log("워크스페이스 참여 성공:", result);

      /* =========================================
         Response
      ========================================= */

      const workspaceId = result?.data?.workspaceId;

      const memberId = result?.data?.memberId;

      const role = result?.data?.role;

      /* =========================================
         workspace 정보 저장
      ========================================= */

      if (workspaceId) {
        localStorage.setItem("workspaceId", String(workspaceId));
      }

      if (memberId) {
        localStorage.setItem("workspaceMemberId", String(memberId));
      }

      if (role) {
        localStorage.setItem("workspaceRole", role);
      }

      /* =========================================
         사용자 프로필 저장
      ========================================= */

      localStorage.setItem("userName", name.trim());

      localStorage.setItem("userCompany", companyName.trim());

      localStorage.setItem("userTeam", teamName.trim());

      localStorage.setItem("userJobTitle", jobTitle.trim());

      /* =========================================
         Sidebar 업데이트
      ========================================= */

      window.dispatchEvent(new Event("userInfoUpdated"));

      window.dispatchEvent(new Event("workspaceCreated"));

      window.dispatchEvent(new Event("workspaceChanged"));

      /* =========================================
         HOME 이동
      ========================================= */

      navigate(ROUTES.HOME, {
        replace: true,
      });
    } catch (error) {
      console.error("워크스페이스 참여 실패:", error);

      /* =========================================
         초대 없음
      ========================================= */

      if (error.code === "404INVITATION_NOT_FOUND") {
        setErrorMessage(
          "초대 정보를 찾을 수 없습니다. 초대 링크를 다시 확인해주세요.",
        );

        return;
      }

      /* =========================================
         만료
      ========================================= */

      if (error.code === "410INVITATION_EXPIRED") {
        setErrorMessage(
          "초대 링크가 만료되었습니다. 관리자에게 새로운 초대 링크를 요청해주세요.",
        );

        return;
      }

      /* =========================================
         이미 참여
      ========================================= */

      if (error.code === "409ALREADY_WORKSPACE_MEMBER") {
        setErrorMessage("이미 참여 중인 워크스페이스입니다.");

        return;
      }

      /* =========================================
         로그인 문제
      ========================================= */

      if (error.status === 401) {
        setErrorMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");

        return;
      }

      setErrorMessage(error.message || "워크스페이스 참여에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>워크스페이스 참여</h1>

      <div className={styles.topArea}>
        {/* =========================
            초대 링크
        ========================= */}

        <div className={styles.inviteCard}>
          <h2>초대 링크로 참여</h2>

          <p>
            초대받은 링크를 아래에 붙여넣으세요. 링크는 초대한 관리자에게 받을
            수 있습니다.
          </p>

          <label htmlFor="inviteLink">
            초대 링크 붙여넣기 (예: https://relai.app/invite?token=...)
          </label>

          <input
            id="inviteLink"
            type="text"
            value={inviteLink}
            onChange={(e) => {
              setInviteLink(e.target.value);

              setIsLinkChecked(false);
            }}
          />

          <button
            type="button"
            className={styles.checkButton}
            onClick={handleCheckLink}
          >
            {isLinkChecked ? "확인 완료" : "링크 확인"}
          </button>
        </div>

        {/* =========================
            참여 전 확인사항
        ========================= */}

        <div className={styles.guideCard}>
          <h2>참여 전 확인하세요</h2>

          <ul>
            <li>
              기본 프로필 정보는 참여 후 설정에서 언제든 수정할 수 있습니다.
            </li>

            <li>
              초대 링크가 만료되었거나 오류가 발생했다면, 초대한 담당자에게
              문의하세요.
            </li>
          </ul>
        </div>
      </div>

      {/* =========================
          기본 프로필
      ========================= */}

      <div className={styles.profileCard}>
        <h2>기본 프로필 연결</h2>

        <p>워크스페이스에서 사용할 이름과 소속 정보를 입력해 주세요.</p>

        <div className={styles.field}>
          <label htmlFor="name">이름</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="company">소속 기업</label>

          <input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="team">팀</label>

          <input
            id="team"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="position">직책</label>

          <input
            id="position"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
      </div>

      {/* =========================
          Error
      ========================= */}

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {/* =========================
          워크스페이스 참여
      ========================= */}

      <button
        type="button"
        className={styles.joinButton}
        onClick={handleJoinWorkspace}
        disabled={isLoading}
      >
        {isLoading ? "참여 중..." : "워크스페이스 참여"}
      </button>
    </section>
  );
}

export default JoinWorkspaceForm;
