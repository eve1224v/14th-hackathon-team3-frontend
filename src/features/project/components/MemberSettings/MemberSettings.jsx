import { useEffect, useState } from "react";

import styles from "./MemberSettings.module.css";

import helpIcon from "../../../../assets/icons/helpIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import {
  getProjectDetail,
  getProjectMembers,
  manageProjectMembers,
} from "../../../../api/projectApi";

function MemberSettings() {
  /* =========================
     기본 State
  ========================= */

  const [members, setMembers] = useState([]);

  const [pendingInvitations, setPendingInvitations] = useState([]);

  const [teamId, setTeamId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     역할 Dropdown
  ========================= */

  const roleOptions = ["PROJECT_ADMIN", "MEMBER"];

  const roleLabelMap = {
    PROJECT_ADMIN: "관리자",
    MEMBER: "멤버",
  };

  const [openRoleMemberId, setOpenRoleMemberId] = useState(null);

  /* =========================
     프로젝트 상세 조회
     → teamId 확보
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchProjectDetail = async () => {
      const projectId = localStorage.getItem("projectId");

      if (!projectId) {
        if (!isCancelled) {
          setErrorMessage("프로젝트 정보가 없습니다.");

          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProjectDetail(projectId);

        if (isCancelled) {
          return;
        }

        console.log("프로젝트 상세 조회 성공:", result);

        const teamSchedules = Array.isArray(result?.data?.teamSchedules)
          ? result.data.teamSchedules
          : [];

        if (teamSchedules.length > 0) {
          const firstTeam = teamSchedules[0];

          setTeamId(firstTeam.teamId);
        } else {
          setTeamId(null);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 상세 조회 실패:", error);

        if (error.status === 401) {
          setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
        } else {
          setErrorMessage(
            error.message || "프로젝트 정보를 불러오지 못했습니다.",
          );
        }
      }
    };

    fetchProjectDetail();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     멤버 조회
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

        const data = result?.data || {};

        setMembers(Array.isArray(data.members) ? data.members : []);

        setPendingInvitations(
          Array.isArray(data.pendingInvitations) ? data.pendingInvitations : [],
        );

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 멤버 조회 실패:", error);

        switch (error.code) {
          case "403PROJECT_ACCESS_DENIED":
            setErrorMessage("프로젝트 접근 권한이 없습니다.");

            break;

          case "404PROJECT_NOT_FOUND":
            setErrorMessage("프로젝트를 찾을 수 없습니다.");

            break;

          default:
            if (error.status === 401) {
              setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
            } else {
              setErrorMessage(
                error.message || "프로젝트 멤버를 불러오지 못했습니다.",
              );
            }
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
     역할 Dropdown
  ========================= */

  const handleRoleDropdown = (memberId) => {
    setOpenRoleMemberId((prev) => (prev === memberId ? null : memberId));
  };

  /* =========================
     역할 변경
  ========================= */

  const handleRoleSelect = async (member, newRole) => {
    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    const memberTeamId = member.teamId || teamId;

    if (!memberTeamId) {
      alert("멤버의 팀 정보를 확인할 수 없습니다.");

      return;
    }

    const actions = [
      {
        type: "UPDATE",

        memberId: member.memberId,

        teamId: Number(memberTeamId),

        role: newRole,

        accessScope: member.accessScope || "TEAM_ONLY",
      },
    ];

    console.log("멤버 UPDATE Payload:", {
      actions,
    });

    try {
      const result = await manageProjectMembers(projectId, actions);

      console.log("멤버 역할 수정 성공:", result);

      const failedActions = result?.data?.failedActions || [];

      if (failedActions.length > 0) {
        alert("멤버 역할 변경에 실패했습니다.");

        return;
      }

      setMembers((prev) =>
        prev.map((item) =>
          item.memberId === member.memberId
            ? {
                ...item,

                role: newRole,
              }
            : item,
        ),
      );

      setOpenRoleMemberId(null);
    } catch (error) {
      console.error("멤버 역할 수정 실패:", error);

      switch (error.code) {
        case "400INVALID_MEMBER_ACTION":
          alert("멤버 작업 정보가 올바르지 않습니다.");

          break;

        case "403PROJECT_ADMIN_REQUIRED":
          alert("프로젝트 관리 권한이 없습니다.");

          break;

        case "404MEMBER_OR_TEAM_NOT_FOUND":
          alert("멤버 또는 팀을 찾을 수 없습니다.");

          break;

        case "409LAST_PROJECT_ADMIN_CANNOT_CHANGE":
          alert("마지막 프로젝트 관리자는 변경할 수 없습니다.");

          break;

        default:
          alert(error.message || "멤버 역할 변경에 실패했습니다.");
      }
    }
  };

  return (
    <section className={styles.container}>
      {/* =========================
          Title
      ========================= */}

      <h1 className={styles.title}>멤버 초대·권한 관리</h1>

      {/* =========================
          Error
      ========================= */}

      {errorMessage && <p>{errorMessage}</p>}

      {/* =========================
          액세스 권한이 있는 멤버
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

            {/* =========================
                Tooltip
            ========================= */}

            <div className={styles.roleTooltip}>
              <div className={styles.tooltipTitle}>
                <img src={helpIcon} alt="" />

                <strong>역할 설정</strong>
              </div>

              <div className={styles.tooltipContent}>
                <div className={styles.tooltipItem}>
                  <strong>관리자</strong>

                  <p>
                    프로젝트 설정과 멤버 관리 등 프로젝트 전반을 관리할 수
                    있습니다.
                  </p>
                </div>

                <div className={styles.tooltipItem}>
                  <strong>멤버</strong>

                  <p>
                    프로젝트에 참여하고 허용된 접근 범위의 데이터를 사용할 수
                    있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Loading
        ========================= */}

        {isLoading ? (
          <p>멤버를 불러오는 중입니다.</p>
        ) : (
          <div className={styles.memberList}>
            {/* =========================
                멤버 목록
            ========================= */}

            {members.map((member) => {
              const isRoleOpen = openRoleMemberId === member.memberId;

              const availableRoles = roleOptions.filter(
                (role) => role !== member.role,
              );

              return (
                <div
                  key={member.memberId}
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
                      {member.companyName || "-"}

                      {member.teamName && (
                        <>
                          {" · "}
                          {member.teamName}
                        </>
                      )}

                      {member.accessScope && (
                        <>
                          {" · "}
                          {member.accessScope}
                        </>
                      )}
                    </p>
                  </div>

                  {/* =========================
                        역할 Dropdown
                    ========================= */}

                  <div className={styles.roleDropdown}>
                    <button
                      type="button"
                      className={styles.roleButton}
                      onClick={() => handleRoleDropdown(member.memberId)}
                    >
                      <span>{roleLabelMap[member.role] || member.role}</span>

                      <img
                        src={dropdownIcon}
                        alt=""
                        className={`${styles.dropdownIcon} ${
                          isRoleOpen ? styles.dropdownIconOpen : ""
                        }`}
                      />
                    </button>

                    {isRoleOpen && (
                      <div className={styles.roleMenu}>
                        {availableRoles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            className={styles.roleOption}
                            onClick={() => handleRoleSelect(member, role)}
                          >
                            {roleLabelMap[role] || role}
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
              <div key={invitation.invitationId} className={styles.pendingRow}>
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
