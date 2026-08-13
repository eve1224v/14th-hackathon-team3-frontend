import { useState } from "react";

import styles from "./OnboardingModal.module.css";

import logo2 from "../../../../assets/icons/logo2.svg";
import rectangle1 from "../../../../assets/icons/rectangle1.svg";
import rectangle2 from "../../../../assets/icons/rectangle2.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

function OnboardingModal({ onClose, userName }) {
  const [step, setStep] = useState(1);

  /* =========================
     Step 1 State
  ========================= */

  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");

  const [language, setLanguage] = useState("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  /* =========================
     Step 2 State
  ========================= */

  const [country, setCountry] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [autoHoliday, setAutoHoliday] = useState(false);

  const [selectedWorkDays, setSelectedWorkDays] = useState(["월", "화"]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /* =========================
     다음
  ========================= */

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }

    setIsLanguageOpen(false);
    setIsCountryOpen(false);
  };

  /* =========================
     Progress Click
  ========================= */

  const handleProgressClick = (targetStep) => {
    if (targetStep <= step) {
      setStep(targetStep);

      setIsLanguageOpen(false);
      setIsCountryOpen(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        {/* =========================
            Header
        ========================= */}

        <div className={styles.header}>
          <div>
            <h1>
              환영합니다, <strong>{userName}님!</strong>
            </h1>

            {step === 1 && (
              <>
                <h2>업무 시작 전, 기본 정보를 입력해주세요.</h2>

                <p>함께 일할 팀이 나를 쉽게 이해할 수 있어요.</p>
              </>
            )}

            {step === 2 && (
              <>
                <h2>나의 업무 시간을 설정해주세요.</h2>

                <p>
                  서로의 근무 시간을 알고, 필요한 순간에 업무를 이어갈 수
                  있어요.
                </p>
              </>
            )}

            {step === 3 && (
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

        {/* =========================
            Progress
        ========================= */}

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

          <button
            type="button"
            className={`${styles.progressButton} ${
              step < 3 ? styles.disabledProgress : ""
            }`}
            onClick={() => handleProgressClick(3)}
          >
            <img src={step >= 3 ? rectangle1 : rectangle2} alt="" />
          </button>
        </div>

        {/* =========================
            Step 1
        ========================= */}

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
            language={language}
            setLanguage={setLanguage}
            isLanguageOpen={isLanguageOpen}
            setIsLanguageOpen={setIsLanguageOpen}
          />
        )}

        {/* =========================
            Step 2
        ========================= */}

        {step === 2 && (
          <StepTwo
            country={country}
            setCountry={setCountry}
            isCountryOpen={isCountryOpen}
            setIsCountryOpen={setIsCountryOpen}
            autoHoliday={autoHoliday}
            setAutoHoliday={setAutoHoliday}
            selectedWorkDays={selectedWorkDays}
            setSelectedWorkDays={setSelectedWorkDays}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        )}

        {/* =========================
            Step 3
        ========================= */}

        {step === 3 && <StepThree />}

        {/* =========================
            하단 버튼
        ========================= */}

        {step < 3 ? (
          <button
            type="button"
            className={styles.nextButton}
            onClick={handleNext}
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            닫기
          </button>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   Step 1
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
  language,
  setLanguage,
  isLanguageOpen,
  setIsLanguageOpen,
}) {
  const languageOptions = ["한국어", "English", "日本語", "简体中文"];

  const handleLanguageSelect = (option) => {
    setLanguage(option);
    setIsLanguageOpen(false);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
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
              type="text"
              placeholder="팀 이름을 입력하세요."
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.column}>
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

          <div className={styles.field}>
            <label>기본 언어 설정</label>

            <div className={styles.customDropdown}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => setIsLanguageOpen((prev) => !prev)}
              >
                <span
                  className={
                    language
                      ? styles.selectedDropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {language || "선택"}
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
                      key={option}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => handleLanguageSelect(option)}
                    >
                      {option}
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

function StepTwo({
  country,
  setCountry,
  isCountryOpen,
  setIsCountryOpen,
  autoHoliday,
  setAutoHoliday,
  selectedWorkDays,
  setSelectedWorkDays,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  const countryOptions = [
    "대한민국 / Asia-Seoul",
    "United Kingdom / Europe-London",
    "United States / America-New_York",
    "Japan / Asia-Tokyo",
  ];

  const workDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handleCountrySelect = (option) => {
    setCountry(option);
    setIsCountryOpen(false);
  };

  const handleWorkDayClick = (day) => {
    setSelectedWorkDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }

      return [...prev, day];
    });
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        {/* 왼쪽 */}

        <div className={styles.column}>
          <div className={styles.field}>
            <label>국가/시간대</label>

            <div className={styles.customDropdown}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => setIsCountryOpen((prev) => !prev)}
              >
                <span
                  className={
                    country
                      ? styles.selectedDropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {country || "국가 및 지역을 선택하세요."}
                </span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    isCountryOpen ? styles.dropdownIconOpen : ""
                  }`}
                />
              </button>

              {isCountryOpen && (
                <div className={styles.dropdownMenu}>
                  {countryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => handleCountrySelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={autoHoliday}
              onChange={(e) => setAutoHoliday(e.target.checked)}
            />

            <span>국가 공휴일 자동 추가</span>
          </label>
        </div>

        {/* 오른쪽 */}

        <div className={styles.column}>
          <div className={styles.field}>
            <label>근무 요일</label>

            <div className={styles.weekDays}>
              {workDays.map((day) => {
                const isSelected = selectedWorkDays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.weekDayButton} ${
                      isSelected ? styles.selectedWeekDay : ""
                    }`}
                    onClick={() => handleWorkDayClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.field}>
            <label>근무 시작 시간/종료 시간</label>

            <input
              type="text"
              value={startTime}
              placeholder="근무 시작 시간"
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="text"
              value={endTime}
              placeholder="근무 종료 시간"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Step 3
========================================================= */

function StepThree() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.workspaceChoices}>
        <button type="button" className={styles.workspaceChoice}>
          새 워크스페이스 만들기
        </button>

        <button type="button" className={styles.workspaceChoice}>
          초대받은 링크로 팀에 참여하기
        </button>
      </div>
    </div>
  );
}

export default OnboardingModal;
