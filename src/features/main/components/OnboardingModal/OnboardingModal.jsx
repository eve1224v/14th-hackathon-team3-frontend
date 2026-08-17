import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./OnboardingModal.module.css";

import logo2 from "../../../../assets/icons/logo2.svg";
import rectangle1 from "../../../../assets/icons/rectangle1.svg";
import rectangle2 from "../../../../assets/icons/rectangle2.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

function OnboardingModal({ onClose, userName }) {
  const { t } = useTranslation();

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

  const [selectedWorkDays, setSelectedWorkDays] = useState(["mon", "tue"]);

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
              {t("onboarding.welcome", {
                name: userName,
              })}
            </h1>

            {step === 1 && (
              <>
                <h2>{t("onboarding.step1.title")}</h2>

                <p>{t("onboarding.step1.description")}</p>
              </>
            )}

            {step === 2 && (
              <>
                <h2>{t("onboarding.step2.title")}</h2>

                <p>{t("onboarding.step2.description")}</p>
              </>
            )}

            {step === 3 && (
              <>
                <h2>{t("onboarding.step3.title")}</h2>

                <p>{t("onboarding.step3.description")}</p>
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
            {t("common.next")}
          </button>
        ) : (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            {t("common.close")}
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
  const { t } = useTranslation();

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

  const handleLanguageSelect = (option) => {
    setLanguage(option.value);
    setIsLanguageOpen(false);
  };

  const selectedLanguageLabel =
    languageOptions.find((option) => option.value === language)?.label || "";

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="company">{t("onboarding.company")}</label>

            <input
              id="company"
              type="text"
              placeholder={t("onboarding.companyPlaceholder")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="department">{t("onboarding.departmentTeam")}</label>

            <input
              id="department"
              type="text"
              placeholder={t("onboarding.departmentPlaceholder")}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="text"
              placeholder={t("onboarding.teamPlaceholder")}
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="position">{t("onboarding.position")}</label>

            <input
              id="position"
              type="text"
              placeholder={t("onboarding.positionPlaceholder")}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>{t("onboarding.defaultLanguage")}</label>

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
                  {selectedLanguageLabel || t("common.select")}
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
  const { t } = useTranslation();

  const countryOptions = [
    {
      value: "KR",
      label: `${t("countries.korea")} / Asia-Seoul`,
    },
    {
      value: "GB",
      label: `${t("countries.uk")} / Europe-London`,
    },
    {
      value: "US",
      label: `${t("countries.usa")} / America-New_York`,
    },
    {
      value: "JP",
      label: `${t("countries.japan")} / Asia-Tokyo`,
    },
  ];

  const workDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const handleCountrySelect = (option) => {
    setCountry(option.value);
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

  const selectedCountryLabel =
    countryOptions.find((option) => option.value === country)?.label || "";

  return (
    <div className={styles.stepContent}>
      <div className={styles.twoColumn}>
        <div className={styles.column}>
          <div className={styles.field}>
            <label>{t("onboarding.countryTimezone")}</label>

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
                  {selectedCountryLabel || t("onboarding.countryPlaceholder")}
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
                      key={option.value}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => handleCountrySelect(option)}
                    >
                      {option.label}
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

            <span>{t("onboarding.autoHoliday")}</span>
          </label>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <label>{t("onboarding.workDays")}</label>

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
                    {t(`weekDays.${day}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.field}>
            <label>{t("onboarding.workTime")}</label>

            <input
              type="text"
              value={startTime}
              placeholder={t("onboarding.startTime")}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="text"
              value={endTime}
              placeholder={t("onboarding.endTime")}
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
  const { t } = useTranslation();

  return (
    <div className={styles.stepContent}>
      <div className={styles.workspaceChoices}>
        <button type="button" className={styles.workspaceChoice}>
          {t("onboarding.createWorkspace")}
        </button>

        <button type="button" className={styles.workspaceChoice}>
          {t("onboarding.joinWorkspace")}
        </button>
      </div>
    </div>
  );
}

export default OnboardingModal;
