import { useState } from "react";

import styles from "./MemberSettings.module.css";

import helpIcon from "../../../../assets/icons/helpIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

function MemberSettings() {
  const [email, setEmail] = useState("");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "김메리",
      company: "기업 A",
      team: "Product",
      position: "Product Manager",
      role: "담당자",
      owner: true,
    },
    {
      id: 2,
      name: "김상영",
      company: "기업 A",
      team: "Design",
      position: "Product Designer",
      role: "승인자",
      owner: false,
    },
    {
      id: 3,
      name: "박지윤",
      company: "기업 A",
      team: "Engineering",
      position: "Frontend Engineer",
      role: "담당자",
      owner: false,
    },
    {
      id: 4,
      name: "이민재",
      company: "기업 A",
      team: "Engineering",
      position: "Backend Engineer",
      role: "담당자",
      owner: false,
    },
    {
      id: 5,
      name: "최유진",
      company: "기업 A",
      team: "Engineering",
      position: "Tech Lead",
      role: "검토자",
      owner: false,
    },
    {
      id: 6,
      name: "오세진",
      company: "기업 A",
      team: "Marketing",
      position: "Product Marketer",
      role: "참조자",
      owner: false,
    },
  ]);

  /* =========================
     역할 Dropdown
  ========================= */

  const roleOptions = ["담당자", "검토자", "승인자", "참조자"];

  const [openRoleMemberId, setOpenRoleMemberId] = useState(null);

  const handleRoleChange = (memberId, newRole) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              role: newRole,
            }
          : member,
      ),
    );
  };

  const handleRoleSelect = (memberId, newRole) => {
    handleRoleChange(memberId, newRole);

    setOpenRoleMemberId(null);
  };

  const handleRoleDropdown = (memberId) => {
    setOpenRoleMemberId((prev) => (prev === memberId ? null : memberId));
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
          />

          <button type="button" className={styles.inviteButton}>
            초대
          </button>
        </div>

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
                  <strong>담당자</strong>

                  <p>
                    업무 작성·편집, 파일 업로드, 메시지 전송 및 인수인계 작성이
                    가능합니다.
                  </p>
                </div>

                <div className={styles.tooltipItem}>
                  <strong>검토자</strong>

                  <p>
                    업무 내용을 열람하고 댓글·질문을 남기며 수정 요청을 전달할
                    수 있습니다.
                  </p>
                </div>

                <div className={styles.tooltipItem}>
                  <strong>승인자</strong>

                  <p>
                    승인 요청을 검토하고 승인·반려 처리 및 승인 상태를 변경할 수
                    있습니다.
                  </p>
                </div>

                <div className={styles.tooltipItem}>
                  <strong>참조자</strong>

                  <p>
                    프로젝트 진행 상황과 승인 결과를 열람할 수 있으며 편집
                    권한은 없습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            멤버 목록
        ========================= */}

        <div className={styles.memberList}>
          {members.map((member) => {
            const isRoleOpen = openRoleMemberId === member.id;

            const availableRoles = roleOptions.filter(
              (role) => role !== member.role,
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

                    {member.owner && (
                      <span className={styles.ownerBadge}>소유자</span>
                    )}
                  </div>

                  <p>
                    {member.company} · {member.team} · {member.position}
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
                  >
                    <span>{member.role}</span>

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
                          onClick={() => handleRoleSelect(member.id, role)}
                        >
                          {role}
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

          <div className={styles.pendingRow}>
            <div className={styles.pendingAvatar} />

            <span className={styles.pendingEmail}>abcde@company.com</span>

            <span className={styles.pendingText}>초대 승인 대기 중</span>
          </div>
        </div>
      </section>
    </section>
  );
}

export default MemberSettings;
