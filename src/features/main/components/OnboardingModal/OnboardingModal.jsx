import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./OnboardingModal.module.css";

import logo2 from "../../../../assets/icons/logo2.svg";
import rectangle1 from "../../../../assets/icons/rectangle1.svg";
import rectangle2 from "../../../../assets/icons/rectangle2.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import signupIcon1 from "../../../../assets/icons/signupIcon1.svg";
import signupIcon2 from "../../../../assets/icons/signupIcon2.svg";

import { ROUTES } from "../../../../router/routes.constant";

import JoinWorkspaceModal from "../JoinWorkspaceModal/JoinWorkspaceModal";

/* =========================================================
   Onboarding Modal
========================================================= */

function OnboardingModal({ onClose, userName }) {
  const navigate = useNavigate();

  /* =========================================
     현재 Step
  ========================================= */

  const [step, setStep] = useState(1);

  /* =========================================
     Step 1 State
  ========================================= */

  const [company, setCompany] = useState("");

  const [department, setDepartment] = useState("");

  const [team, setTeam] = useState("");

  const [position, setPosition] = useState("");

  /* 사용자 지역 */

  const [region, setRegion] = useState("");

  const [isRegionOpen, setIsRegionOpen] = useState(false);

  /* 기본 언어 */

  const [language, setLanguage] = useState("");

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  /* =========================================
     초대 워크스페이스 Modal
  ========================================= */

  const [isJoinWorkspaceModalOpen, setIsJoinWorkspaceModalOpen] =
    useState(false);

  /* =========================================
     다음
  ========================================= */

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }

    setIsRegionOpen(false);

    setIsLanguageOpen(false);
  };

  /* =========================================
     Progress Click
  ========================================= */

  const handleProgressClick = (targetStep) => {
    /*
      현재 진행한 단계까지만 이동 가능
    */

    if (targetStep <= step) {
      setStep(targetStep);

      setIsRegionOpen(false);

      setIsLanguageOpen(false);
    }
  };

  /* =========================================
     새 워크스페이스 만들기
  ========================================= */

  const handleCreateWorkspace = () => {
    /*
      온보딩 닫기
    */

    if (onClose) {
      onClose();
    }

    /*
      워크스페이스 생성 페이지 이동
    */

    navigate(ROUTES.CREATE_WORKSPACE);
  };

  /* =========================================
     초대받은 워크스페이스 참여
  ========================================= */

  const handleJoinWorkspace = () => {
    /*
      바로 /workspace/join으로 이동하지 않고
      초대 코드 입력 Modal 먼저 띄움
    */

    setIsJoinWorkspaceModalOpen(true);
  };

  return (
    <>
      <div className={styles.overlay}>
        <section className={styles.modal}>
          {/* =========================================
              Header
          ========================================= */}

          <div className={styles.header}>
            <div>
              <h1>
                환영합니다, <strong>{userName || "사용자"}!</strong>
              </h1>

              {/* Step 1 Header */}

              {step === 1 && (
                <>
                  <h2>업무 시작 전, 기본 정보를 입력해주세요.</h2>

                  <p>함께 일할 팀이나 다른 사람이 이해할 수 있어요.</p>
                </>
              )}

              {/* Step 2 Header */}

              {step === 2 && (
                <>
                  <h2>함께할 공간을 선택해주세요.</h2>

                  <p>
                    새 워크스페이스를 만들거나, 초대받은 팀에 참여할 수 있어요.
                  </p>
                </>
              )}
            </div>

            <img className={styles.logo} src={logo2} alt="RelAi" />
          </div>

          {/* =========================================
              Progress
          ========================================= */}

          <div className={styles.progress}>
            {/* Step 1 */}

            <button
              type="button"
              className={styles.progressButton}
              onClick={() => handleProgressClick(1)}
            >
              <img src={step >= 1 ? rectangle1 : rectangle2} alt="" />
            </button>

            {/* Step 2 */}

            <button
              type="button"
              className={`${styles.progressButton} ${
                step < 2 ? styles.disabledProgress : ""
              }`}
              onClick={() => handleProgressClick(2)}
            >
              <img src={step >= 2 ? rectangle1 : rectangle2} alt="" />
            </button>
          </div>

          {/* =========================================
              Step 1
          ========================================= */}

          {step === 1 && (
            <StepOne
              company={company}
              setCompany={setCompany}
              department={department}
              setDepartment={setDepartment}
              team={team}
              setTeam={setTeam}
              position={position}
              setPosition={setPosition}
              region={region}
              setRegion={setRegion}
              isRegionOpen={isRegionOpen}
              setIsRegionOpen={setIsRegionOpen}
              language={language}
              setLanguage={setLanguage}
              isLanguageOpen={isLanguageOpen}
              setIsLanguageOpen={setIsLanguageOpen}
            />
          )}

          {/* =========================================
              Step 2
          ========================================= */}

          {step === 2 && (
            <StepTwo
              onCreateWorkspace={handleCreateWorkspace}
              onJoinWorkspace={handleJoinWorkspace}
            />
          )}

          {/* =========================================
              하단 버튼

              Step 1에서만 다음 버튼
          ========================================= */}

          {step === 1 && (
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
            >
              다음
            </button>
          )}
        </section>
      </div>

      {/* =========================================
          초대 워크스페이스 참여 Modal

          Step 2의
          "초대받은 링크로 팀에 참여하기"
          버튼 클릭 시 표시
      ========================================= */}

      {isJoinWorkspaceModalOpen && (
        <JoinWorkspaceModal
          onClose={() => setIsJoinWorkspaceModalOpen(false)}
        />
      )}
    </>
  );
}

/* =========================================================
   Step 1

   기본 정보
   + 사용자 지역
   + 기본 언어
========================================================= */

function StepOne({
  company,
  setCompany,

  department,
  setDepartment,

  team,
  setTeam,

  position,
  setPosition,

  region,
  setRegion,

  isRegionOpen,
  setIsRegionOpen,

  language,
  setLanguage,

  isLanguageOpen,
  setIsLanguageOpen,
}) {
  const { t } = useTranslation();

  /* =========================================
     사용자 지역
  ========================================= */

  const regionOptions = [
    {
      value: "SEOUL",
      label: "[KR] 서울, 대한민국",
      timezone: "Asia/Seoul",
    },

    {
      value: "TOKYO",
      label: "[JP] 도쿄, 일본",
      timezone: "Asia/Tokyo",
    },

    {
      value: "NEW_YORK",
      label: "[US] 뉴욕, 미국",
      timezone: "America/New_York",
    },

    {
      value: "LOS_ANGELES",
      label: "[US] 로스앤젤레스, 미국",
      timezone: "America/Los_Angeles",
    },
  ];

  /* =========================================
     기본 언어
  ========================================= */

  const languageOptions = [
    {
      value: "ko",
      label: t("languages.korean"),
    },

    {
      value: "en",
      label: t("languages.english"),
    },

    {
      value: "ja",
      label: t("languages.japanese"),
    },
  ];

  /* =========================================
     지역 선택
  ========================================= */

  const handleRegionSelect = (option) => {
    setRegion(option.value);

    setIsRegionOpen(false);

    setIsLanguageOpen(false);

    /*
      Sidebar 시간 표시용
    */

    localStorage.setItem("userRegion", option.value);

    localStorage.setItem("userTimezone", option.timezone);

    /*
      Sidebar에 지역 변경 알림
    */

    window.dispatchEvent(new Event("timeZoneChanged"));
  };

  /* =========================================
     언어 선택
  ========================================= */

  const handleLanguageSelect = (option) => {
    setLanguage(option.value);

    setIsLanguageOpen(false);

    setIsRegionOpen(false);

    /*
      추후 서버 API 연결 전까지
      선택값 저장
    */

    localStorage.setItem("userLanguage", option.value);
  };

  /* =========================================
     선택된 지역 표시
  ========================================= */

  const selectedRegionLabel =
    regionOptions.find((option) => option.value === region)?.label || "";

  /* =========================================
     선택된 언어 표시
  ========================================= */

  const selectedLanguageLabel =
    languageOptions.find((option) => option.value === language)?.label || "";

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        {/* =========================================
            왼쪽
        ========================================= */}

        <div className={styles.column}>
          {/* 소속 기업 */}

          <div className={styles.field}>
            <label htmlFor="company">소속 기업</label>

            <input
              id="company"
              type="text"
              placeholder="기업 이름을 입력하세요."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* 부서 / 팀 */}

          <div className={styles.field}>
            <label htmlFor="department">부서/팀</label>

            <input
              id="department"
              type="text"
              placeholder="부서 이름을 입력하세요."
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              id="team"
              type="text"
              placeholder="팀 이름을 입력하세요."
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
        </div>

        {/* =========================================
            오른쪽
        ========================================= */}

        <div className={styles.column}>
          {/* 직책 */}

          <div className={styles.field}>
            <label htmlFor="position">직책</label>

            <input
              id="position"
              type="text"
              placeholder="직책 이름을 입력하세요."
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          {/* =========================================
              사용자 지역 및 기본 언어
          ========================================= */}

          <div className={styles.field}>
            <label>사용자 지역 및 기본 언어 설정</label>

            {/* =====================================
                사용자 지역
            ===================================== */}

            <div className={styles.customDropdown}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => {
                  setIsRegionOpen((prev) => !prev);

                  setIsLanguageOpen(false);
                }}
              >
                <span
                  className={
                    region
                      ? styles.selectedDropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {selectedRegionLabel || "사용자 지역 선택"}
                </span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    isRegionOpen ? styles.dropdownIconOpen : ""
                  }`}
                />
              </button>

              {isRegionOpen && (
                <div className={styles.dropdownMenu}>
                  {regionOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => handleRegionSelect(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* =====================================
                기본 언어
            ===================================== */}

            <div className={styles.customDropdown}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => {
                  setIsLanguageOpen((prev) => !prev);

                  setIsRegionOpen(false);
                }}
              >
                <span
                  className={
                    language
                      ? styles.selectedDropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {selectedLanguageLabel || "기본 언어 선택"}
                </span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    isLanguageOpen ? styles.dropdownIconOpen : ""
                  }`}
                />
              </button>

              {isLanguageOpen && (
                <div className={styles.dropdownMenu}>
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => handleLanguageSelect(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Step 2

   워크스페이스 선택
========================================================= */

function StepTwo({ onCreateWorkspace, onJoinWorkspace }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.workspaceChoices}>
        {/* =========================================
            새 워크스페이스 만들기
        ========================================= */}

        <button
          type="button"
          className={styles.workspaceChoice}
          onClick={onCreateWorkspace}
        >
          <img
            src={signupIcon1}
            alt=""
            className={styles.workspaceChoiceIcon}
          />

          <span>새 워크스페이스 만들기</span>
        </button>

        {/* =========================================
            초대받은 링크로 팀에 참여하기
        ========================================= */}

        <button
          type="button"
          className={styles.workspaceChoice}
          onClick={onJoinWorkspace}
        >
          <img
            src={signupIcon2}
            alt=""
            className={styles.workspaceChoiceIcon}
          />

          <span>초대받은 링크로 팀에 참여하기</span>
        </button>
      </div>
    </div>
  );
}

export default OnboardingModal;
