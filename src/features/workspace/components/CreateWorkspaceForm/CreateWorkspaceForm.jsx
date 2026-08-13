import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateWorkspaceForm.module.css";

import plusmemberIcon from "../../../../assets/icons/plusmemberIcon.svg";
import { ROUTES } from "../../../../router/routes.constant";

function CreateWorkspaceForm() {
  const navigate = useNavigate();

  /* =========================
     초대할 팀원 이메일 목록
  ========================= */

  const [memberEmails, setMemberEmails] = useState([""]);

  /* =========================
     이메일 입력
  ========================= */

  const handleEmailChange = (index, value) => {
    setMemberEmails((prev) =>
      prev.map((email, emailIndex) => (emailIndex === index ? value : email)),
    );
  };

  /* =========================
     이메일 입력칸 추가
  ========================= */

  const handleAddMember = () => {
    setMemberEmails((prev) => [...prev, ""]);
  };

  /* =========================
     워크스페이스 생성
  ========================= */

  const handleCreateWorkspace = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>새로운 워크스페이스</h1>

      <div className={styles.formGrid}>
        {/* =========================
            왼쪽 영역
        ========================= */}

        <div className={styles.leftColumn}>
          <div className={styles.field}>
            <label htmlFor="workspaceName">워크스페이스 이름</label>

            <input id="workspaceName" type="text" />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyName">회사명</label>

            <input id="companyName" type="text" />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyCountry">회사 국가</label>

            <input id="companyCountry" type="text" />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyType">회사 기업</label>

            <input id="companyType" type="text" />
          </div>
        </div>

        {/* 오른쪽 영역 */}
        <div className={styles.rightColumn}>
          <div className={styles.field}>
            <label>초대할 팀원 이메일</label>

            <div className={styles.memberEmailList}>
              {memberEmails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  aria-label={`초대할 팀원 이메일 ${index + 1}`}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
              ))}
            </div>

            <div className={styles.plusMemberArea}>
              <button
                type="button"
                className={styles.plusMemberButton}
                onClick={handleAddMember}
                aria-label="팀원 이메일 입력칸 추가"
              >
                <img
                  src={plusmemberIcon}
                  alt=""
                  className={styles.plusMemberIcon}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          초대 코드
      ========================= */}

      <div className={styles.inviteArea}>
        <button type="button" className={styles.inviteButton}>
          초대 코드 생성
        </button>

        <input
          type="text"
          className={styles.inviteCodeInput}
          aria-label="초대 코드"
        />
      </div>

      {/* =========================
          워크스페이스 생성
      ========================= */}

      <button
        type="button"
        className={styles.createButton}
        onClick={handleCreateWorkspace}
      >
        워크스페이스 생성
      </button>
    </section>
  );
}

export default CreateWorkspaceForm;
