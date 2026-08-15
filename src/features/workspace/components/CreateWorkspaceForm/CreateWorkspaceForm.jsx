import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateWorkspaceForm.module.css";

import plusmemberIcon from "../../../../assets/icons/plusmemberIcon.svg";
import { ROUTES } from "../../../../router/routes.constant";

import { createWorkspace } from "../../../../api/workspaceApi";

function CreateWorkspaceForm() {
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("");
  const [collaboratingCompanyName, setCollaboratingCompanyName] = useState("");

  const [memberEmails, setMemberEmails] = useState([""]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (index, value) => {
    setMemberEmails((prev) =>
      prev.map((email, emailIndex) => (emailIndex === index ? value : email)),
    );
  };

  const handleAddMember = () => {
    setMemberEmails((prev) => [...prev, ""]);
  };

  const handleCreateWorkspace = async () => {
    if (
      !workspaceName.trim() ||
      !companyName.trim() ||
      !companyCountryCode.trim()
    ) {
      setErrorMessage("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await createWorkspace({
        name: workspaceName,
        companyName,
        companyCountryCode: companyCountryCode.toUpperCase(),

        collaboratingCompanyNames: collaboratingCompanyName.trim()
          ? [collaboratingCompanyName.trim()]
          : [],

        inviteeEmails: memberEmails
          .map((email) => email.trim())
          .filter((email) => email !== ""),
      });

      console.log("워크스페이스 생성 성공:", response);

      const workspaceId = response.data.workspaceId;
      const organizationCode = response.data.organizationCode;

      localStorage.setItem("workspaceId", String(workspaceId));

      localStorage.setItem("organizationCode", organizationCode);

      navigate(ROUTES.CREATE_PROJECT);
    } catch (error) {
      console.error("워크스페이스 생성 실패:", error);

      const errorCode = error.response?.data?.code;

      if (errorCode === "400INVALID_WORKSPACE_INPUT") {
        setErrorMessage("워크스페이스 정보를 올바르게 입력해주세요.");
      } else if (errorCode === "409WORKSPACE_NAME_DUPLICATED") {
        setErrorMessage("이미 사용 중인 워크스페이스 이름입니다.");
      } else if (error.response?.status === 401) {
        setErrorMessage("로그인이 필요합니다.");
      } else {
        setErrorMessage("워크스페이스 생성 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>새로운 워크스페이스</h1>

      <div className={styles.formGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.field}>
            <label htmlFor="workspaceName">워크스페이스 이름</label>

            <input
              id="workspaceName"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyName">회사명</label>

            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyCountry">회사 국가</label>

            <input
              id="companyCountry"
              type="text"
              value={companyCountryCode}
              onChange={(e) => setCompanyCountryCode(e.target.value)}
              placeholder="예: KR"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="companyType">협업 기업</label>

            <input
              id="companyType"
              type="text"
              value={collaboratingCompanyName}
              onChange={(e) => setCollaboratingCompanyName(e.target.value)}
            />
          </div>
        </div>

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

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <button
        type="button"
        className={styles.createButton}
        onClick={handleCreateWorkspace}
        disabled={isLoading}
      >
        {isLoading ? "생성 중..." : "워크스페이스 생성"}
      </button>
    </section>
  );
}

export default CreateWorkspaceForm;
