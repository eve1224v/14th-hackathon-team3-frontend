import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./OnboardingModal.module.css";

import logo2 from "../../../../assets/icons/logo2.svg";
import rectangle1 from "../../../../assets/icons/rectangle1.svg";
import rectangle2 from "../../../../assets/icons/rectangle2.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import signupIcon1 from "../../../../assets/icons/signupIcon1.svg";
import signupIcon2 from "../../../../assets/icons/signupIcon2.svg";

import { ROUTES } from "../../../../router/routes.constant";

import JoinWorkspaceModal from "../JoinWorkspaceModal/JoinWorkspaceModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.likelion-bato.cloud";

function OnboardingModal({ onClose, userName }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  /* =========================================
     Step 1
  ========================================= */

  const [name, setName] = useState(
    userName || localStorage.getItem("userName") || "",
  );

  const [region, setRegion] = useState("");

  const [isRegionOpen, setIsRegionOpen] = useState(false);

  /* =========================================
     상태
  ========================================= */

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================================
     Join Workspace
  ========================================= */

  const [isJoinWorkspaceModalOpen, setIsJoinWorkspaceModalOpen] =
    useState(false);

  /* =========================================
     Step 1 저장
  ========================================= */

  const handleNext = async () => {
    if (step !== 1 || isSavingSettings) {
      return;
    }

    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("이름을 입력해주세요.");

      return;
    }

    if (!region) {
      setErrorMessage("사용자 지역을 선택해주세요.");

      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setErrorMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");

      return;
    }

    try {
      setIsSavingSettings(true);

      /* =========================================
         1. 지역 저장
      ========================================= */

      const regionResponse = await fetch(
        `${API_BASE_URL}/api/v1/users/me/region`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify({
            region,
          }),
        },
      );

      const regionResult = await regionResponse.json().catch(() => null);

      if (!regionResponse.ok) {
        throw new Error(
          regionResult?.message || "사용자 지역 저장에 실패했습니다.",
        );
      }

      /* =========================================
         2. LocalStorage 저장
      ========================================= */

      localStorage.setItem("userName", trimmedName);

      localStorage.setItem("userRegion", region);

      /* =========================================
         3. 이벤트
      ========================================= */

      window.dispatchEvent(new Event("timeZoneChanged"));

      window.dispatchEvent(new Event("userInfoUpdated"));

      /* =========================================
         4. Step 2
      ========================================= */

      setStep(2);

      setIsRegionOpen(false);
    } catch (error) {
      console.error("온보딩 저장 실패:", error);

      setErrorMessage(error.message || "설정 저장에 실패했습니다.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  /* =========================================
     Progress
  ========================================= */

  const handleProgressClick = (targetStep) => {
    if (targetStep <= step) {
      setStep(targetStep);

      setIsRegionOpen(false);
    }
  };

  /* =========================================
     새 워크스페이스 생성
  ========================================= */

  const handleCreateWorkspace = () => {
    if (onClose) {
      onClose();
    }

    navigate(ROUTES.CREATE_WORKSPACE);
  };

  /* =========================================
     워크스페이스 참여
  ========================================= */

  const handleJoinWorkspace = () => {
    setIsJoinWorkspaceModalOpen(true);
  };

  return (
    <>
      <div className={styles.overlay}>
        <section className={styles.modal}>
          {/* Header */}

          <div className={styles.header}>
            <div>
              <h1>
                환영합니다, <strong>{name || "사용자"}!</strong>
              </h1>

              {step === 1 && (
                <>
                  <h2>업무 시작 전, 기본 정보를 입력해주세요.</h2>

                  <p>글로벌 협업을 위한 기본 정보를 설정합니다.</p>
                </>
              )}

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

          {/* Progress */}

          <div className={styles.progress}>
            <button
              type="button"
              className={styles.progressButton}
              onClick={() => handleProgressClick(1)}
            >
              <img src={step >= 1 ? rectangle1 : rectangle2} alt="" />
            </button>

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

          {/* Step 1 */}

          {step === 1 && (
            <StepOne
              name={name}
              setName={setName}
              region={region}
              setRegion={setRegion}
              isRegionOpen={isRegionOpen}
              setIsRegionOpen={setIsRegionOpen}
            />
          )}

          {/* Step 2 */}

          {step === 2 && (
            <StepTwo
              onCreateWorkspace={handleCreateWorkspace}
              onJoinWorkspace={handleJoinWorkspace}
            />
          )}

          {/* Error */}

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          {/* Next */}

          {step === 1 && (
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={isSavingSettings}
            >
              {isSavingSettings ? "저장 중..." : "다음"}
            </button>
          )}
        </section>
      </div>

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
========================================================= */

function StepOne({
  name,
  setName,

  region,
  setRegion,

  isRegionOpen,
  setIsRegionOpen,
}) {
  const regionOptions = [
    {
      value: "SEOUL",
      label: "[KR] 서울, 대한민국",
    },

    {
      value: "TOKYO",
      label: "[JP] 도쿄, 일본",
    },

    {
      value: "NEW_YORK",
      label: "[US] 뉴욕, 미국",
    },

    {
      value: "LOS_ANGELES",
      label: "[US] 로스앤젤레스, 미국",
    },
  ];

  const handleRegionSelect = (option) => {
    setRegion(option.value);

    setIsRegionOpen(false);
  };

  const selectedRegionLabel =
    regionOptions.find((option) => option.value === region)?.label || "";

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        {/* LEFT */}

        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="name">이름</label>

            <input
              id="name"
              type="text"
              placeholder="이름을 입력하세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className={styles.column}>
          <div className={styles.field}>
            <label>사용자 지역 설정</label>

            <div className={styles.customDropdown}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => setIsRegionOpen((prev) => !prev)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Step 2
========================================================= */

function StepTwo({ onCreateWorkspace, onJoinWorkspace }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.workspaceChoices}>
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
