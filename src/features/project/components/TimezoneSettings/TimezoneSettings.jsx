import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./TimezoneSettings.module.css";

import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";
import HolidayModal from "../HolidayModal/HolidayModal";

import { ROUTES } from "../../../../router/routes.constant";

function TimezoneSettings() {
  const navigate = useNavigate();

  /* =========================
     저장
  ========================= */

  const handleSave = () => {
    navigate(ROUTES.PROJECT_SETTINGS);
  };

  /* =========================
     팀 / 국가 / 언어
  ========================= */

  const [team, setTeam] = useState("Product Team");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("한국어");

  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const teamOptions = [
    "Product Team",
    "Design Team",
    "Engineering Team",
    "Marketing Team",
  ];

  const languageOptions = ["한국어", "English", "日本語", "简体中文"];

  const handleTeamSelect = (value) => {
    setTeam(value);
    setIsTeamOpen(false);
  };

  const handleLanguageSelect = (value) => {
    setLanguage(value);
    setIsLanguageOpen(false);
  };

  /* =========================
     근무 시간
  ========================= */

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const workDays = ["일", "월", "화", "수", "목", "금", "토"];

  const [selectedWorkDays, setSelectedWorkDays] = useState(["월", "화", "수"]);

  const handleWorkDayClick = (day) => {
    setSelectedWorkDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }

      return [...prev, day];
    });
  };

  /* =========================
     공휴일
  ========================= */

  const [holidaysEnabled, setHolidaysEnabled] = useState(false);

  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);

  const [holidays, setHolidays] = useState([
    {
      date: "2026/08/09 ~ 2026/08/13 (4일)",
      name: "여름 휴가",
      registeredDate: "2026/06/02",
      user: "김가나",
    },
    {
      date: "2026/08/09 ~ 2026/08/13 (4일)",
      name: "여름 휴가",
      registeredDate: "2026/06/02",
      user: "김가나",
    },
  ]);

  const handleAddHoliday = (holiday) => {
    setHolidays((prev) => [
      ...prev,
      {
        date: holiday.date,
        name: holiday.name,
        registeredDate: "2026/08/12",
        user: "김메리",
      },
    ]);
  };

  return (
    <>
      <section className={styles.container}>
        <h1 className={styles.title}>팀 시간대 설정</h1>

        {/* =========================
            팀 선택
        ========================= */}

        <section className={styles.card}>
          <h2>팀 선택</h2>

          <div className={styles.field}>
            <label>팀</label>

            <div className={styles.customSelect}>
              <button
                type="button"
                className={styles.customSelectButton}
                onClick={() => {
                  setIsTeamOpen((prev) => !prev);
                  setIsLanguageOpen(false);
                }}
              >
                <span>{team}</span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    isTeamOpen ? styles.dropdownIconOpen : ""
                  }`}
                />
              </button>

              {isTeamOpen && (
                <div className={styles.customSelectMenu}>
                  {teamOptions
                    .filter((option) => option !== team)
                    .map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.customSelectOption}
                        onClick={() => handleTeamSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            국가 및 시간대
        ========================= */}

        <section className={styles.card}>
          <h2>국가 및 시간대</h2>

          <div className={styles.countryRow}>
            <div className={styles.smallField}>
              <label htmlFor="country">국가</label>

              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className={styles.smallField}>
              <label htmlFor="timezone">시간대</label>

              <input
                id="timezone"
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>

            <button type="button" className={styles.outlineButton}>
              수동 설정
            </button>
          </div>

          {/* =========================
              언어 선택
          ========================= */}

          <div className={styles.languageField}>
            <label>언어 (기본값)</label>

            <div className={styles.customSelect}>
              <button
                type="button"
                className={styles.customSelectButton}
                onClick={() => {
                  setIsLanguageOpen((prev) => !prev);
                  setIsTeamOpen(false);
                }}
              >
                <span>{language}</span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    isLanguageOpen ? styles.dropdownIconOpen : ""
                  }`}
                />
              </button>

              {isLanguageOpen && (
                <div className={styles.customSelectMenu}>
                  {languageOptions
                    .filter((option) => option !== language)
                    .map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={styles.customSelectOption}
                        onClick={() => handleLanguageSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            근무 시간
        ========================= */}

        <section className={styles.card}>
          <h2>근무 시간</h2>

          <div className={styles.timeRow}>
            <div className={styles.timeField}>
              <label htmlFor="startTime">근무 시작 시간</label>

              <input
                id="startTime"
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className={styles.timeField}>
              <label htmlFor="endTime">근무 종료 시간</label>

              <input
                id="endTime"
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.workDayArea}>
            <span>근무 요일</span>

            <div className={styles.workDays}>
              {workDays.map((day) => {
                const isSelected = selectedWorkDays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.workDayButton} ${
                      isSelected ? styles.selectedWorkDay : ""
                    }`}
                    onClick={() => handleWorkDayClick(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================
            공휴일
        ========================= */}

        <section className={styles.card}>
          <div className={styles.holidayHeader}>
            <div>
              <h2>공휴일 설정</h2>

              <p>국가 공휴일 자동 추가</p>
              <p>추가 공휴일 직접 등록</p>
            </div>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={holidaysEnabled}
                onChange={(e) => setHolidaysEnabled(e.target.checked)}
              />

              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.holidayTable}>
            <div className={styles.tableHeader}>
              <span>등록 날짜</span>
              <span>공휴일명</span>
              <span>적용 기간</span>
              <span>등록자</span>
            </div>

            {holidays.map((holiday, index) => (
              <div className={styles.tableRow} key={`${holiday.name}-${index}`}>
                <span>{holiday.registeredDate}</span>

                <span>{holiday.name}</span>

                <span>{holiday.date}</span>

                <span>{holiday.user}</span>
              </div>
            ))}
          </div>

          <div className={styles.holidayButtonArea}>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => setIsHolidayModalOpen(true)}
            >
              공휴일 추가
            </button>
          </div>
        </section>

        {/* =========================
            저장
        ========================= */}

        <div className={styles.saveArea}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </section>

      {/* =========================
          Holiday Modal
      ========================= */}

      {isHolidayModalOpen && (
        <HolidayModal
          onClose={() => setIsHolidayModalOpen(false)}
          onSave={handleAddHoliday}
        />
      )}
    </>
  );
}

export default TimezoneSettings;
