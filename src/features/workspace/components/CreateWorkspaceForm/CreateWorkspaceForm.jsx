import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateWorkspaceForm.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import {
  createWorkspace,
  createWorkspaceInvitation,
} from "../../../../api/workspaceApi";

import backbuttonIcon from "../../../../assets/icons/backbuttonIcon.svg";

function CreateWorkspaceForm() {
  const navigate = useNavigate();

  /* =========================================
     Form
  ========================================= */

  const [workspaceName, setWorkspaceName] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [companyCountryCode, setCompanyCountryCode] = useState("");

  const [collaboratingCompanyName, setCollaboratingCompanyName] = useState("");

  const [collaboratingCountryCode, setCollaboratingCountryCode] =
    useState("KR");

  const [inviteeEmails, setInviteeEmails] = useState("");

  /* =========================================
     초대 링크
  ========================================= */

  const [inviteCode, setInviteCode] = useState("");

  const [shouldCreateInviteLink, setShouldCreateInviteLink] = useState(false);

  /* =========================================
     상태
  ========================================= */

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================================
     문자열 → 배열
  ========================================= */

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /* =========================================
     이메일 형식 검사
  ========================================= */

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* =========================================
     협력 기업 배열 생성
  ========================================= */

  const buildCollaboratingCompanies = () => {
    const trimmedName = collaboratingCompanyName.trim();

    if (!trimmedName) {
      return [];
    }

    return [
      {
        name: trimmedName,
        countryCode: collaboratingCountryCode,
      },
    ];
  };

  /* =========================================
     초대 코드 생성 예약

     workspaceId는 워크스페이스 생성 후 생기므로
     여기서는 초대 링크 생성 여부만 저장
  ========================================= */

  const handleCreateInviteCode = () => {
    setErrorMessage("");

    setShouldCreateInviteLink(true);

    setInviteCode("워크스페이스 생성 후 초대 링크가 생성됩니다.");
  };

  /* =========================================
     워크스페이스 생성
  ========================================= */

  const handleCreateWorkspace = async () => {
    const trimmedWorkspaceName = workspaceName.trim();

    const trimmedCompanyName = companyName.trim();

    const emails = convertToArray(inviteeEmails);

    setErrorMessage("");

    /* =========================================
       Validation
    ========================================= */

    if (!trimmedWorkspaceName) {
      setErrorMessage("워크스페이스 이름을 입력해주세요.");

      return;
    }

    if (!trimmedCompanyName) {
      setErrorMessage("회사명을 입력해주세요.");

      return;
    }

    if (!companyCountryCode) {
      setErrorMessage("회사 국가를 선택해주세요.");

      return;
    }

    const invalidEmail = emails.find((email) => !isValidEmail(email));

    if (invalidEmail) {
      setErrorMessage(`${invalidEmail}은(는) 올바른 이메일 형식이 아닙니다.`);

      return;
    }

    try {
      setIsLoading(true);

      /* =========================================
         1. 워크스페이스 생성
      ========================================= */

      const result = await createWorkspace({
        name: trimmedWorkspaceName,

        companyName: trimmedCompanyName,

        companyCountryCode,

        collaboratingCompanies: buildCollaboratingCompanies(),

        inviteeEmails: emails,
      });

      console.log("워크스페이스 생성 성공:", result);

      const workspaceId = result?.data?.workspaceId;

      if (!workspaceId) {
        setErrorMessage("워크스페이스 ID를 받지 못했습니다.");

        return;
      }

      /* =========================================
         2. 회사 정보
      ========================================= */

      const hostCompany = result?.data?.company || null;

      const partnerCompanies = Array.isArray(
        result?.data?.collaboratingCompanies,
      )
        ? result.data.collaboratingCompanies
        : [];

      console.log("주관사:", hostCompany);

      console.log("협업 기업:", partnerCompanies);

      /* =========================================
         3. 워크스페이스 정보 저장
      ========================================= */

      localStorage.setItem("workspaceId", String(workspaceId));

      localStorage.setItem("workspaceName", trimmedWorkspaceName);

      localStorage.setItem("workspaceCompanyName", trimmedCompanyName);

      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify({
          workspaceId,

          name: trimmedWorkspaceName,

          companyName: trimmedCompanyName,

          status: result?.data?.status || "ACTIVE",

          organizationCode: result?.data?.organizationCode || "",

          company: hostCompany,

          collaboratingCompanies: partnerCompanies,
        }),
      );

      /* =========================================
         4. 프로젝트 생성에서 사용할 회사 정보 저장
      ========================================= */

      if (hostCompany) {
        localStorage.setItem("workspaceCompany", JSON.stringify(hostCompany));
      } else {
        localStorage.removeItem("workspaceCompany");
      }

      localStorage.setItem(
        "workspaceCollaboratingCompanies",
        JSON.stringify(partnerCompanies),
      );

      /* =========================================
         5. 초대 링크 생성
      ========================================= */

      if (shouldCreateInviteLink) {
        try {
          const invitationResult = await createWorkspaceInvitation({
            workspaceId,

            type: "LINK",

            role: "MEMBER",

            expiresInHours: 72,
          });

          console.log("워크스페이스 초대 링크 생성 성공:", invitationResult);

          const generatedInviteUrl = invitationResult?.data?.inviteUrl || "";

          if (generatedInviteUrl) {
            setInviteCode(generatedInviteUrl);

            localStorage.setItem("workspaceInviteUrl", generatedInviteUrl);
          }
        } catch (invitationError) {
          console.error("초대 링크 생성 실패:", invitationError);

          switch (invitationError.code) {
            case "400INVALID_INVITATION_INPUT":
              setErrorMessage("초대 방식 또는 입력값이 올바르지 않습니다.");
              break;

            case "403WORKSPACE_ADMIN_REQUIRED":
              setErrorMessage(
                "워크스페이스 초대를 생성할 관리 권한이 없습니다.",
              );
              break;

            case "409ALREADY_WORKSPACE_MEMBER":
              setErrorMessage("이미 워크스페이스 멤버인 사용자입니다.");
              break;

            default:
              setErrorMessage(
                invitationError.message ||
                  "워크스페이스는 생성되었지만 초대 링크 생성에 실패했습니다.",
              );
          }

          return;
        }
      }

      /* =========================================
         6. Sidebar 갱신
      ========================================= */

      window.dispatchEvent(new Event("workspaceCreated"));

      window.dispatchEvent(new Event("workspaceChanged"));

      /* =========================================
         7. 프로젝트 목록 화면으로 이동
      ========================================= */

      navigate(ROUTES.PROJECT_HOME);
    } catch (error) {
      console.error("워크스페이스 생성 실패:", error);

      switch (error.code) {
        case "400INVALID_WORKSPACE_INPUT":
          setErrorMessage(
            error.message || "워크스페이스 입력값이 올바르지 않습니다.",
          );

          break;

        case "409WORKSPACE_NAME_DUPLICATED":
          setErrorMessage("동일한 이름의 워크스페이스가 이미 존재합니다.");

          break;

        default:
          if (error.status === 401) {
            setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            setErrorMessage(
              error.message || "워크스페이스 생성에 실패했습니다.",
            );
          }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* =========================================
            BACK
        ========================================= */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <img src={backbuttonIcon} alt="" className={styles.backButtonIcon} />

          <span>뒤로</span>
        </button>

        {/* =========================================
            TITLE
        ========================================= */}

        <h1 className={styles.title}>새로운 워크스페이스</h1>

        {/* =========================================
            FORM
        ========================================= */}

        <div className={styles.formGrid}>
          {/* =========================
              LEFT
          ========================= */}

          <div className={styles.leftColumn}>
            {/* 워크스페이스 이름 */}

            <div className={styles.field}>
              <label htmlFor="workspaceName">워크스페이스 이름</label>

              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                maxLength={100}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            {/* 회사명 */}

            <div className={styles.field}>
              <label htmlFor="companyName">회사명</label>

              <input
                id="companyName"
                type="text"
                value={companyName}
                maxLength={100}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 주관사 국가 */}

            <div className={styles.field}>
              <label htmlFor="companyCountryCode">회사 국가</label>

              <select
                id="companyCountryCode"
                value={companyCountryCode}
                onChange={(e) => setCompanyCountryCode(e.target.value)}
              >
                <option value="">선택</option>

                <option value="KR">대한민국</option>

                <option value="US">미국</option>

                <option value="GB">영국</option>

                <option value="JP">일본</option>
              </select>
            </div>

            {/* 협력 기업 */}

            <div className={styles.field}>
              <label htmlFor="collaboratingCompanyName">협력 기업</label>

              <input
                id="collaboratingCompanyName"
                type="text"
                value={collaboratingCompanyName}
                maxLength={100}
                onChange={(e) => setCollaboratingCompanyName(e.target.value)}
              />
            </div>

            {/* 협력 기업 국가 */}

            {collaboratingCompanyName.trim() && (
              <div className={styles.field}>
                <label htmlFor="collaboratingCountryCode">협력 기업 국가</label>

                <select
                  id="collaboratingCountryCode"
                  value={collaboratingCountryCode}
                  onChange={(e) => setCollaboratingCountryCode(e.target.value)}
                >
                  <option value="KR">대한민국</option>

                  <option value="US">미국</option>

                  <option value="GB">영국</option>

                  <option value="JP">일본</option>
                </select>
              </div>
            )}
          </div>

          {/* =========================
              RIGHT
          ========================= */}

          <div className={styles.rightColumn}>
            <div className={styles.field}>
              <label htmlFor="inviteeEmails">초대할 팀원 이메일</label>

              <div className={styles.inviteEmailRow}>
                <input
                  id="inviteeEmails"
                  type="text"
                  value={inviteeEmails}
                  placeholder="email@example.com"
                  onChange={(e) => setInviteeEmails(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.addMemberButton}
                  aria-label="팀원 추가"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            INVITE LINK
        ========================================= */}

        <div className={styles.inviteArea}>
          <button
            type="button"
            className={styles.inviteButton}
            onClick={handleCreateInviteCode}
            disabled={isLoading}
          >
            초대 코드 생성
          </button>

          <input
            type="text"
            className={styles.inviteCodeInput}
            value={inviteCode}
            readOnly
          />
        </div>

        {/* =========================================
            ERROR
        ========================================= */}

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {/* =========================================
            CREATE
        ========================================= */}

        <div className={styles.buttonArea}>
          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreateWorkspace}
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "워크스페이스 생성"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default CreateWorkspaceForm;
