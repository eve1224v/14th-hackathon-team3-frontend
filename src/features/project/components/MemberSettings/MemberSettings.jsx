import { useEffect, useState } from "react";

import styles from "./MemberSettings.module.css";

import helpIcon from "../../../../assets/icons/helpIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import {
  getProjectMembers,
  manageProjectMembers,
} from "../../../../api/projectApi";

function MemberSettings() {
  const [email, setEmail] = useState("");

  const [members, setMembers] = useState([]);

  const [pendingInvitations, setPendingInvitations] = useState([]);

  const [openRoleMemberId, setOpenRoleMemberId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isInviting, setIsInviting] = useState(false);

  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     역할 목록

     API 명세
     PROJECT_ADMIN
     MEMBER
  ========================= */

  const roleOptions = [
    {
      value: "PROJECT_ADMIN",
      label: "프로젝트 관리자",
    },

    {
      value: "MEMBER",
      label: "멤버",
    },
  ];

  /* =========================
     Role 표시
  ========================= */

  const getRoleLabel = (role) => {
    switch (role) {
      case "PROJECT_ADMIN":
        return "프로젝트 관리자";

      case "MEMBER":
        return "멤버";

      default:
        return role || "-";
    }
  };

  /* =========================
     멤버 데이터 저장
  ========================= */

  const applyMemberData = (result) => {
    const memberData = result?.data?.members || [];

    const invitationData = result?.data?.pendingInvitations || [];

    const formattedMembers = memberData.map((member) => ({
      id: member.memberId,

      name: member.name,

      company: member.companyName,

      team: member.teamName,

      role: member.role,

      accessScope: member.accessScope,
    }));

    setMembers(formattedMembers);

    setPendingInvitations(invitationData);
  };

  /* =========================
     멤버 목록 새로고침
  ========================= */

  const refreshMembers = async (projectId) => {
    const result = await getProjectMembers(projectId);

    applyMemberData(result);

    return result;
  };

  /* =========================
     최초 멤버 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchMembers = async () => {
      const projectId = localStorage.getItem("projectId");

      if (!projectId) {
        if (!isCancelled) {
          setErrorMessage("프로젝트 정보가 없습니다.");

          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProjectMembers(projectId);

        if (isCancelled) {
          return;
        }

        console.log("프로젝트 멤버 조회 성공:", result);

        applyMemberData(result);

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 멤버 조회 실패:", error);

        if (error.code === "403PROJECT_ACCESS_DENIED") {
          setErrorMessage("프로젝트 접근 권한이 없습니다.");
        } else if (error.code === "404PROJECT_NOT_FOUND") {
          setErrorMessage("프로젝트를 찾을 수 없습니다.");
        } else if (error.status === 401) {
          setErrorMessage("로그인이 필요합니다.");
        } else {
          setErrorMessage(error.message || "멤버 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     멤버 초대
  ========================= */

  const handleInviteMember = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("초대할 이메일을 입력해주세요.");

      return;
    }

    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    try {
      setIsInviting(true);

      const result = await manageProjectMembers(projectId, [
        {
          type: "INVITE",

          email: trimmedEmail,
        },
      ]);

      console.log("멤버 초대 성공:", result);

      setEmail("");

      await refreshMembers(projectId);

      alert("멤버를 초대했습니다.");
    } catch (error) {
      console.error("멤버 초대 실패:", error);

      switch (error.code) {
        case "400INVALID_MEMBER_ACTION":
          alert("멤버 초대 정보가 올바르지 않습니다.");
          break;

        case "403PROJECT_ADMIN_REQUIRED":
          alert("프로젝트 관리 권한이 없습니다.");
          break;

        case "404MEMBER_OR_TEAM_NOT_FOUND":
          alert("멤버 또는 팀을 찾을 수 없습니다.");
          break;

        default:
          alert(error.message || "멤버 초대에 실패했습니다.");
      }
    } finally {
      setIsInviting(false);
    }
  };

  /* =========================
     Enter로 초대
  ========================= */

  const handleEmailKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInviteMember();
    }
  };

  /* =========================
     역할 Dropdown
  ========================= */

  const handleRoleDropdown = (memberId) => {
    setOpenRoleMemberId((prev) => (prev === memberId ? null : memberId));
  };

  /* =========================
     역할 변경
  ========================= */

  const handleRoleSelect = async (member, newRole) => {
    if (member.role === newRole) {
      setOpenRoleMemberId(null);

      return;
    }

    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    try {
      setUpdatingMemberId(member.id);

      await manageProjectMembers(projectId, [
        {
          type: "UPDATE",

          memberId: member.id,

          role: newRole,

          accessScope: member.accessScope,
        },
      ]);

      setMembers((prev) =>
        prev.map((item) =>
          item.id === member.id
            ? {
                ...item,

                role: newRole,
              }
            : item,
        ),
      );

      setOpenRoleMemberId(null);
    } catch (error) {
      console.error("멤버 역할 변경 실패:", error);

      switch (error.code) {
        case "400INVALID_MEMBER_ACTION":
          alert("멤버 변경 정보가 올바르지 않습니다.");
          break;

        case "403PROJECT_ADMIN_REQUIRED":
          alert("프로젝트 관리 권한이 없습니다.");
          break;

        case "404MEMBER_OR_TEAM_NOT_FOUND":
          alert("멤버 또는 팀을 찾을 수 없습니다.");
          break;

        case "409LAST_PROJECT_ADMIN_CANNOT_CHANGE":
          alert("마지막 프로젝트 관리자의 역할은 변경할 수 없습니다.");
          break;

        default:
          alert(error.message || "역할 변경에 실패했습니다.");
      }
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>멤버 초대·권한 관리</h1>

      {/* =========================
          새 멤버 초대
      ========================= */}

      <section className={styles.inviteCard}>
        <h2>새 멤버 초대</h2>

        <label htmlFor="memberEmail">이메일 주소</label>

        <div className={styles.emailRow}>
          <input
            id="memberEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEmailKeyDown}
            disabled={isInviting}
          />

          <button
            type="button"
            className={styles.inviteButton}
            onClick={handleInviteMember}
            disabled={isInviting}
          >
            {isInviting ? "..." : "초대"}
          </button>
        </div>

        {/* =========================
            초대 코드

            현재 받은 API 명세에는
            초대 코드 API가 없기 때문에
            기존 UI만 유지
        ========================= */}

        <div className={styles.inviteLinkRow}>
          <button type="button" className={styles.copyButton}>
            초대 코드 복사
          </button>

          <div className={styles.inviteLink}>
            https://relai.app/invite/global-landing-8F3K2
          </div>
        </div>
      </section>

      {/* =========================
          액세스 권한 멤버
      ========================= */}

      <section className={styles.memberCard}>
        <div className={styles.memberTitleRow}>
          <h2>액세스 권한이 있는 멤버</h2>

          <div className={styles.helpWrapper}>
            <button
              type="button"
              className={styles.helpButton}
              aria-label="역할 설정 도움말"
            >
              <img src={helpIcon} alt="" className={styles.helpIcon} />
            </button>

            <div className={styles.roleTooltip}>
              <div className={styles.tooltipTitle}>
                <img src={helpIcon} alt="" />

                <strong>역할 설정</strong>
              </div>

              <div className={styles.tooltipContent}>
                <div className={styles.tooltipItem}>
                  <strong>프로젝트 관리자</strong>

                  <p>프로젝트 설정과 멤버 관리 권한을 가집니다.</p>
                </div>

                <div className={styles.tooltipItem}>
                  <strong>멤버</strong>

                  <p>
                    프로젝트에 참여하여 허용된 범위의 업무를 수행할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Loading
        ========================= */}

        {isLoading && (
          <div className={styles.memberList}>
            <p>멤버 정보를 불러오는 중입니다.</p>
          </div>
        )}

        {/* =========================
            Error
        ========================= */}

        {!isLoading && errorMessage && (
          <div className={styles.memberList}>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* =========================
            멤버 목록
        ========================= */}

        {!isLoading && !errorMessage && (
          <div className={styles.memberList}>
            {members.length === 0 && pendingInvitations.length === 0 && (
              <p>등록된 멤버가 없습니다.</p>
            )}

            {members.map((member) => {
              const isRoleOpen = openRoleMemberId === member.id;

              const isUpdating = updatingMemberId === member.id;

              const availableRoles = roleOptions.filter(
                (role) => role.value !== member.role,
              );

              return (
                <div
                  key={member.id}
                  className={`${styles.memberRow} ${
                    isRoleOpen ? styles.activeMemberRow : ""
                  }`}
                >
                  {/* 프로필 */}

                  <div className={styles.avatar} />

                  {/* 멤버 정보 */}

                  <div className={styles.memberInfo}>
                    <div className={styles.nameRow}>
                      <strong>{member.name}</strong>

                      {member.role === "PROJECT_ADMIN" && (
                        <span className={styles.ownerBadge}>관리자</span>
                      )}
                    </div>

                    <p>
                      {member.company || "-"}
                      {" · "}
                      {member.team || "-"}
                    </p>
                  </div>

                  {/* =========================
                          역할 Dropdown
                      ========================= */}

                  <div className={styles.roleDropdown}>
                    <button
                      type="button"
                      className={styles.roleButton}
                      onClick={() => handleRoleDropdown(member.id)}
                      disabled={isUpdating}
                    >
                      <span>
                        {isUpdating ? "변경 중..." : getRoleLabel(member.role)}
                      </span>

                      <img
                        src={dropdownIcon}
                        alt=""
                        className={`${styles.dropdownIcon} ${
                          isRoleOpen ? styles.dropdownIconOpen : ""
                        }`}
                      />
                    </button>

                    {isRoleOpen && !isUpdating && (
                      <div className={styles.roleMenu}>
                        {availableRoles.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            className={styles.roleOption}
                            onClick={() => handleRoleSelect(member, role.value)}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* =========================
                  초대 대기
              ========================= */}

            {pendingInvitations.map((invitation) => (
              <div className={styles.pendingRow} key={invitation.invitationId}>
                <div className={styles.pendingAvatar} />

                <span className={styles.pendingEmail}>{invitation.email}</span>

                <span className={styles.pendingText}>초대 승인 대기 중</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default MemberSettings;
