import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateWorkspaceForm.module.css";
import plusmemberIcon from "../../../../assets/icons/plusmemberIcon.svg";
import { ROUTES } from "../../../../router/routes.constant";

import {
  createWorkspace,
  createWorkspaceInvitation,
  updateMyWorkspaceProfile,
} from "../../../../api/workspaceApi";

import backbuttonIcon from "../../../../assets/icons/backbuttonIcon.svg";

function CreateWorkspaceForm() {
  const navigate = useNavigate();

  /* =========================================
     Form
  ========================================= */

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [companyName, setCompanyName] =
    useState("");

  const [
    companyCountryCode,
    setCompanyCountryCode,
  ] = useState("");

  const [teamName, setTeamName] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [
    collaboratingCompanyName,
    setCollaboratingCompanyName,
  ] = useState("");

  const [collaboratingCountryCode] =
    useState("KR");

  /* =========================================
     초대할 팀원 이메일

     처음에는 입력칸 1개
     + 버튼 누르면 하나씩 추가
  ========================================= */

  const [inviteeEmails, setInviteeEmails] =
    useState([""]);

  /* =========================================
     생성된 Workspace
  ========================================= */

  const [
    createdWorkspaceId,
    setCreatedWorkspaceId,
  ] = useState(null);

  /* =========================================
     초대 링크
  ========================================= */

  const [inviteCode, setInviteCode] =
    useState("");

  /* =========================================
     상태
  ========================================= */

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================================
     이메일 입력
  ========================================= */

  const handleEmailChange = (
    index,
    value,
  ) => {
    setInviteeEmails((prev) =>
      prev.map((email, emailIndex) =>
        emailIndex === index
          ? value
          : email,
      ),
    );
  };

  /* =========================================
     이메일 입력칸 추가
  ========================================= */

  const handleAddMember = () => {
    setInviteeEmails((prev) => [
      ...prev,
      "",
    ]);
  };

  /* =========================================
     이메일 검사
  ========================================= */

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    );
  };

  /* =========================================
     협업 기업 배열
  ========================================= */

  const buildCollaboratingCompanies =
    () => {
      const trimmedName =
        collaboratingCompanyName.trim();

      if (!trimmedName) {
        return [];
      }

      return [
        {
          name: trimmedName,
          countryCode:
            collaboratingCountryCode,
        },
      ];
    };

  /* =========================================
     입력값 검증
  ========================================= */

  const validateForm = () => {
    const trimmedWorkspaceName =
      workspaceName.trim();

    const trimmedCompanyName =
      companyName.trim();

    const trimmedTeamName =
      teamName.trim();

    const trimmedJobTitle =
      jobTitle.trim();

    const emails = inviteeEmails
      .map((email) => email.trim())
      .filter(Boolean);

    setErrorMessage("");

    if (!trimmedWorkspaceName) {
      setErrorMessage(
        "워크스페이스 이름을 입력해주세요.",
      );

      return null;
    }

    if (!trimmedCompanyName) {
      setErrorMessage(
        "회사명을 입력해주세요.",
      );

      return null;
    }

    if (!companyCountryCode) {
      setErrorMessage(
        "회사 국가를 선택해주세요.",
      );

      return null;
    }

    if (!trimmedTeamName) {
      setErrorMessage(
        "팀을 입력해주세요.",
      );

      return null;
    }

    const invalidEmail = emails.find(
      (email) => !isValidEmail(email),
    );

    if (invalidEmail) {
      setErrorMessage(
        `${invalidEmail}은(는) 올바른 이메일 형식이 아닙니다.`,
      );

      return null;
    }

    return {
      trimmedWorkspaceName,
      trimmedCompanyName,
      trimmedTeamName,
      trimmedJobTitle,
      emails,
    };
  };

  /* =========================================
     워크스페이스 생성 공통 함수

     이미 생성되어 있다면
     다시 생성하지 않고 기존 ID 반환
  ========================================= */

  const createWorkspaceIfNeeded =
    async () => {
      /*
        이미 이 화면에서 워크스페이스가
        생성된 경우
      */

      if (createdWorkspaceId) {
        return createdWorkspaceId;
      }

      const validated = validateForm();

      if (!validated) {
        return null;
      }

      const {
        trimmedWorkspaceName,
        trimmedCompanyName,
        trimmedTeamName,
        trimmedJobTitle,
        emails,
      } = validated;

      /* =========================================
         1. 워크스페이스 생성
      ========================================= */

      const result = await createWorkspace({
        name: trimmedWorkspaceName,

        companyName:
          trimmedCompanyName,

        companyCountryCode,

        collaboratingCompanies:
          buildCollaboratingCompanies(),

        inviteeEmails: emails,
      });

      console.log(
        "워크스페이스 생성 성공:",
        result,
      );

      const workspaceId =
        result?.data?.workspaceId;

      if (!workspaceId) {
        throw new Error(
          "워크스페이스 ID를 받지 못했습니다.",
        );
      }

      /* =========================================
         2. Workspace ID 상태 저장
      ========================================= */

      setCreatedWorkspaceId(
        workspaceId,
      );

      /* =========================================
         3. localStorage 저장
      ========================================= */

      localStorage.setItem(
        "workspaceId",
        String(workspaceId),
      );

      localStorage.setItem(
        "workspaceName",
        trimmedWorkspaceName,
      );

      localStorage.setItem(
        "workspaceCompanyName",
        trimmedCompanyName,
      );

      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify({
          workspaceId,

          name: trimmedWorkspaceName,

          companyName:
            trimmedCompanyName,

          status:
            result?.data?.status ||
            "ACTIVE",

          organizationCode:
            result?.data
              ?.organizationCode || "",
        }),
      );

      /* =========================================
         4. WorkspaceMember 프로필 저장
      ========================================= */

      const profileName =
        localStorage.getItem(
          "userName",
        ) || "";

      if (!profileName.trim()) {
        throw new Error(
          "사용자 이름 정보가 없습니다.",
        );
      }

      const profileResult =
        await updateMyWorkspaceProfile({
          workspaceId,

          name: profileName.trim(),

          companyName:
            trimmedCompanyName,

          teamName:
            trimmedTeamName,

          jobTitle:
            trimmedJobTitle,
        });

      console.log(
        "워크스페이스 프로필 저장 성공:",
        profileResult,
      );

      localStorage.setItem(
        "userCompany",
        trimmedCompanyName,
      );

      localStorage.setItem(
        "userTeam",
        trimmedTeamName,
      );

      localStorage.setItem(
        "userJobTitle",
        trimmedJobTitle,
      );

      window.dispatchEvent(
        new Event("userInfoUpdated"),
      );

      /* =========================================
         5. Sidebar 갱신
      ========================================= */

      window.dispatchEvent(
        new Event("workspaceCreated"),
      );

      window.dispatchEvent(
        new Event("workspaceChanged"),
      );

      return workspaceId;
    };

  /* =========================================
     초대 링크 생성

     버튼을 누르면

     워크스페이스가 없을 경우
     → 먼저 워크스페이스 생성
     → 프로필 저장
     → 초대 링크 생성
     → 화면에 초대 링크 표시

     이미 생성된 경우
     → 초대 링크만 생성
  ========================================= */

  const handleCreateInviteCode =
    async () => {
      if (isLoading) {
        return;
      }

      try {
        setIsLoading(true);

        setErrorMessage("");

        /*
          워크스페이스가 아직 없다면
          먼저 생성
        */

        const workspaceId =
          await createWorkspaceIfNeeded();

        if (!workspaceId) {
          return;
        }

        /* =========================================
           초대 링크 생성 API
        ========================================= */

        const invitationResult =
          await createWorkspaceInvitation({
            workspaceId,

            type: "LINK",

            role: "MEMBER",

            expiresInHours: 72,
          });

        console.log(
          "워크스페이스 초대 링크 생성 성공:",
          invitationResult,
        );

        const generatedInviteUrl =
          invitationResult?.data
            ?.inviteUrl || "";

        /*
          API에 inviteUrl이 없고
          inviteCode 형태로 오는 경우까지 대응
        */

        const generatedInviteCode =
          invitationResult?.data
            ?.inviteCode || "";

        const generatedValue =
          generatedInviteUrl ||
          generatedInviteCode;

        if (!generatedValue) {
          setErrorMessage(
            "초대 링크를 받지 못했습니다.",
          );

          return;
        }

        /*
          input에 실제 초대 링크/코드 표시
        */

        setInviteCode(
          generatedValue,
        );

        /*
          localStorage 저장
        */

        if (generatedInviteUrl) {
          localStorage.setItem(
            "workspaceInviteUrl",
            generatedInviteUrl,
          );
        }

        if (generatedInviteCode) {
          localStorage.setItem(
            "workspaceInviteCode",
            generatedInviteCode,
          );
        }
      } catch (error) {
        console.error(
          "초대 링크 생성 실패:",
          error,
        );

        switch (error.code) {
          case "400INVALID_WORKSPACE_INPUT":
            setErrorMessage(
              error.message ||
                "워크스페이스 입력값이 올바르지 않습니다.",
            );
            break;

          case "409WORKSPACE_NAME_DUPLICATED":
            setErrorMessage(
              "동일한 이름의 워크스페이스가 이미 존재합니다.",
            );
            break;

          default:
            if (error.status === 401) {
              setErrorMessage(
                "로그인이 만료되었습니다. 다시 로그인해주세요.",
              );
            } else {
              setErrorMessage(
                error.message ||
                  "초대 링크 생성에 실패했습니다.",
              );
            }
        }
      } finally {
        setIsLoading(false);
      }
    };

  /* =========================================
     워크스페이스 생성 버튼
  ========================================= */

  const handleCreateWorkspace =
    async () => {
      if (isLoading) {
        return;
      }

      try {
        setIsLoading(true);

        setErrorMessage("");

        /*
          초대 링크 생성 버튼을 통해
          이미 Workspace가 생성됐다면
          다시 생성하지 않음
        */

        const workspaceId =
          await createWorkspaceIfNeeded();

        if (!workspaceId) {
          return;
        }

        /*
          Sidebar 갱신
        */

        window.dispatchEvent(
          new Event("workspaceCreated"),
        );

        window.dispatchEvent(
          new Event("workspaceChanged"),
        );

        /*
          프로젝트 홈 이동
        */

        navigate(
          ROUTES.PROJECT_HOME,
        );
      } catch (error) {
        console.error(
          "워크스페이스 생성 실패:",
          error,
        );

        switch (error.code) {
          case "400INVALID_WORKSPACE_INPUT":
            setErrorMessage(
              error.message ||
                "워크스페이스 입력값이 올바르지 않습니다.",
            );
            break;

          case "409WORKSPACE_NAME_DUPLICATED":
            setErrorMessage(
              "동일한 이름의 워크스페이스가 이미 존재합니다.",
            );
            break;

          default:
            if (error.status === 401) {
              setErrorMessage(
                "로그인이 만료되었습니다. 다시 로그인해주세요.",
              );
            } else {
              setErrorMessage(
                error.message ||
                  "워크스페이스 생성에 실패했습니다.",
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
        {/* =========================
            뒤로가기
        ========================= */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <img
            src={backbuttonIcon}
            alt=""
            className={
              styles.backButtonIcon
            }
          />

          <span>뒤로</span>
        </button>

        {/* =========================
            제목
        ========================= */}

        <h1 className={styles.title}>
          새로운 워크스페이스
        </h1>

        {/* =========================
            Form
        ========================= */}

        <div
          className={styles.formGrid}
        >
          {/* 왼쪽 */}

          <div
            className={
              styles.leftColumn
            }
          >
            {/* 워크스페이스 이름 */}

            <div
              className={styles.field}
            >
              <label
                htmlFor="workspaceName"
              >
                워크스페이스 이름
              </label>

              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                maxLength={100}
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setWorkspaceName(
                    e.target.value,
                  )
                }
              />
            </div>

            {/* 회사명 */}

            <div
              className={styles.field}
            >
              <label
                htmlFor="companyName"
              >
                회사명
              </label>

              <input
                id="companyName"
                type="text"
                value={companyName}
                maxLength={100}
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setCompanyName(
                    e.target.value,
                  )
                }
              />
            </div>

            {/* 회사 국가 */}

            <div
              className={styles.field}
            >
              <label
                htmlFor="companyCountryCode"
              >
                회사 국가
              </label>

              <select
                id="companyCountryCode"
                value={
                  companyCountryCode
                }
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setCompanyCountryCode(
                    e.target.value,
                  )
                }
              >
                <option value="">
                  선택
                </option>

                <option value="KR">
                  대한민국
                </option>

                <option value="US">
                  미국
                </option>

                <option value="GB">
                  영국
                </option>

                <option value="JP">
                  일본
                </option>
              </select>
            </div>

            {/* 팀 */}

            <div
              className={styles.field}
            >
              <label htmlFor="teamName">
                팀
              </label>

              <input
                id="teamName"
                type="text"
                value={teamName}
                maxLength={100}
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setTeamName(
                    e.target.value,
                  )
                }
              />
            </div>

            {/* 직책 */}

            <div
              className={styles.field}
            >
              <label htmlFor="jobTitle">
                직책
              </label>

              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                maxLength={100}
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setJobTitle(
                    e.target.value,
                  )
                }
              />
            </div>

            {/* 협력 기업 */}

            <div
              className={styles.field}
            >
              <label
                htmlFor="collaboratingCompanyName"
              >
                협력 기업
              </label>

              <input
                id="collaboratingCompanyName"
                type="text"
                value={
                  collaboratingCompanyName
                }
                maxLength={100}
                disabled={
                  Boolean(
                    createdWorkspaceId,
                  ) ||
                  isLoading
                }
                onChange={(e) =>
                  setCollaboratingCompanyName(
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          {/* =========================
              오른쪽
          ========================= */}

          <div
            className={
              styles.rightColumn
            }
          >
            <div
              className={styles.field}
            >
              <label>
                초대할 팀원 이메일
              </label>

              <div
                className={
                  styles.memberEmailList
                }
              >
                {inviteeEmails.map(
                  (email, index) => (
                    <div
                      key={index}
                      className={
                        styles.inviteEmailRow
                      }
                    >
                      <input
                        type="email"
                        value={email}
                        placeholder="email@example.com"
                        aria-label={`초대할 팀원 이메일 ${
                          index + 1
                        }`}
                        disabled={
                          Boolean(
                            createdWorkspaceId,
                          ) ||
                          isLoading
                        }
                        onChange={(e) =>
                          handleEmailChange(
                            index,
                            e.target.value,
                          )
                        }
                      />

                      {/* 첫 번째 입력칸 옆에만 + 버튼 */}

                      {index === 0 && (
                        <button
                          type="button"
                          className={
                            styles.addMemberButton
                          }
                          onClick={
                            handleAddMember
                          }
                          disabled={
                            Boolean(
                              createdWorkspaceId,
                            ) ||
                            isLoading
                          }
                          aria-label="팀원 이메일 입력칸 추가"
                        >
                          <img
                            src={
                              plusmemberIcon
                            }
                            alt=""
                            className={
                              styles.plusMemberIcon
                            }
                          />
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            초대 링크
        ========================= */}

        <div
          className={styles.inviteArea}
        >
          <button
            type="button"
            className={
              styles.inviteButton
            }
            onClick={
              handleCreateInviteCode
            }
            disabled={isLoading}
          >
            {isLoading
              ? "생성 중..."
              : inviteCode
                ? "초대 링크 재생성"
                : "초대 링크 생성"}
          </button>

          <input
            type="text"
            className={
              styles.inviteCodeInput
            }
            value={inviteCode}
            placeholder="초대 링크가 여기에 표시됩니다."
            readOnly
          />
        </div>

        {/* =========================
            오류
        ========================= */}

        {errorMessage && (
          <p
            className={
              styles.errorMessage
            }
          >
            {errorMessage}
          </p>
        )}

        {/* =========================
            생성
        ========================= */}

        <div
          className={
            styles.buttonArea
          }
        >
          <button
            type="button"
            className={
              styles.createButton
            }
            onClick={
              handleCreateWorkspace
            }
            disabled={isLoading}
          >
            {isLoading
              ? "생성 중..."
              : createdWorkspaceId
                ? "프로젝트로 이동"
                : "워크스페이스 생성"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default CreateWorkspaceForm;