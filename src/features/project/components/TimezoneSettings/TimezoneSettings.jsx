import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./TimezoneSettings.module.css";

import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import HolidayModal from "../HolidayModal/HolidayModal";

import { ROUTES } from "../../../../router/routes.constant";

import {
  getProjectDetail,
  updateProjectTeamSettings,
} from "../../../../api/projectApi";

function TimezoneSettings() {
  const navigate = useNavigate();

  /* =========================
     팀
  ========================= */

  const [teams, setTeams] = useState([]);

  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [isTeamOpen, setIsTeamOpen] = useState(false);

  /* =========================
     국가 / 시간대 / 언어
  ========================= */

  const [country, setCountry] = useState("");

  const [timezone, setTimezone] = useState("");

  const [language, setLanguage] = useState("한국어");

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  /* =========================
     근무 시간
  ========================= */

  const [startTime, setStartTime] = useState("09:00");

  const [endTime, setEndTime] = useState("18:00");

  const workDays = ["일", "월", "화", "수", "목", "금", "토"];

  const [selectedWorkDays, setSelectedWorkDays] = useState([
    "월",
    "화",
    "수",
    "목",
    "금",
  ]);

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

  /* =========================
     상태
  ========================= */

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     언어 옵션
  ========================= */

  const languageOptions = ["한국어", "English", "日本語", "简体中文"];

  /* =========================
     요일 변환
  ========================= */

  const dayMap = {
    일: "SUN",
    월: "MON",
    화: "TUE",
    수: "WED",
    목: "THU",
    금: "FRI",
    토: "SAT",
  };

  const reverseDayMap = {
    SUN: "일",
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
  };

  /* =========================
     언어 변환
  ========================= */

  const languageMap = {
    한국어: "ko",
    English: "en",
    日本語: "ja",
    简体中文: "zh",
  };

  const reverseLanguageMap = {
    ko: "한국어",
    en: "English",
    ja: "日本語",
    zh: "简体中文",
  };

  /* =========================
     시간대 → 국가 코드
  ========================= */

  const getCountryCodeFromTimezone = (value) => {
    switch (value) {
      case "Asia/Seoul":
        return "KR";

      case "Asia/Tokyo":
        return "JP";

      case "America/New_York":
      case "America/Los_Angeles":
      case "America/Chicago":
      case "America/Denver":
        return "US";

      case "Europe/London":
        return "GB";

      default:
        return "";
    }
  };

  /* =========================
     국가 입력값 → 국가 코드
  ========================= */

  const getCountryCode = (value) => {
    const trimmed = value.trim();

    switch (trimmed) {
      case "대한민국":
      case "한국":
      case "KR":
      case "kr":
        return "KR";

      case "미국":
      case "US":
      case "us":
        return "US";

      case "영국":
      case "GB":
      case "gb":
        return "GB";

      case "일본":
      case "JP":
      case "jp":
        return "JP";

      default:
        return trimmed.toUpperCase();
    }
  };

  /* =========================
     서버 시간 HH:mm:ss → HH:mm
  ========================= */

  const normalizeTime = (value, fallback) => {
    if (!value) {
      return fallback;
    }

    return value.slice(0, 5);
  };

  /* =========================
     프로젝트 상세 조회
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

        console.log("팀 시간대 설정 조회 성공:", result);

        const teamSchedules = result?.data?.teamSchedules || [];

        setTeams(teamSchedules);

        if (teamSchedules.length > 0) {
          const firstTeam = teamSchedules[0];

          setSelectedTeamId(firstTeam.teamId);

          setTimezone(firstTeam.timezone || "");

          /*
              상세 조회에는 countryCode가 없으므로
              timezone 기준으로 자동 설정
            */

          setCountry(getCountryCodeFromTimezone(firstTeam.timezone));

          setLanguage(reverseLanguageMap[firstTeam.languageCode] || "한국어");

          setStartTime(normalizeTime(firstTeam.workStartTime, "09:00"));

          setEndTime(normalizeTime(firstTeam.workEndTime, "18:00"));

          setSelectedWorkDays(
            (firstTeam.workDays || [])
              .map((day) => reverseDayMap[day])
              .filter(Boolean),
          );
        }

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 팀 설정 조회 실패:", error);

        switch (error.code) {
          case "403PROJECT_ACCESS_DENIED":
            setErrorMessage("프로젝트 접근 권한이 없습니다.");

            break;

          case "404PROJECT_NOT_FOUND":
            setErrorMessage("프로젝트를 찾을 수 없습니다.");

            break;

          default:
            setErrorMessage(
              error.message || "팀 설정 정보를 불러오지 못했습니다.",
            );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProjectDetail();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     현재 선택 팀
  ========================= */

  const selectedTeam = teams.find(
    (teamItem) => teamItem.teamId === selectedTeamId,
  );

  /* =========================
     팀 선택
  ========================= */

  const handleTeamSelect = (teamItem) => {
    setSelectedTeamId(teamItem.teamId);

    setTimezone(teamItem.timezone || "");

    setCountry(getCountryCodeFromTimezone(teamItem.timezone));

    setLanguage(reverseLanguageMap[teamItem.languageCode] || "한국어");

    setStartTime(normalizeTime(teamItem.workStartTime, "09:00"));

    setEndTime(normalizeTime(teamItem.workEndTime, "18:00"));

    setSelectedWorkDays(
      (teamItem.workDays || [])
        .map((day) => reverseDayMap[day])
        .filter(Boolean),
    );

    setIsTeamOpen(false);
  };

  /* =========================
     언어 선택
  ========================= */

  const handleLanguageSelect = (value) => {
    setLanguage(value);

    setIsLanguageOpen(false);
  };

  /* =========================
     요일 선택
  ========================= */

  const handleWorkDayClick = (day) => {
    setSelectedWorkDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }

      return [...prev, day];
    });
  };

  /* =========================
     공휴일 직접 추가
  ========================= */

  const handleAddHoliday = (holiday) => {
    setHolidays((prev) => [
      ...prev,

      {
        date: holiday.date,

        name: holiday.name,

        registeredDate: "2026/08/17",

        user: "김메리",
      },
    ]);
  };

  /* =========================
     저장
  ========================= */

  const handleSave = async () => {
    const projectId = localStorage.getItem("projectId");

    setErrorMessage("");

    if (!projectId) {
      setErrorMessage("프로젝트 정보가 없습니다.");

      return;
    }

    if (!selectedTeamId) {
      setErrorMessage("팀을 선택해주세요.");

      return;
    }

    if (!country.trim()) {
      setErrorMessage("국가를 입력해주세요.");

      return;
    }

    if (!timezone.trim()) {
      setErrorMessage("시간대를 입력해주세요.");

      return;
    }

    if (!startTime.trim()) {
      setErrorMessage("근무 시작 시간을 입력해주세요.");

      return;
    }

    if (!endTime.trim()) {
      setErrorMessage("근무 종료 시간을 입력해주세요.");

      return;
    }

    if (selectedWorkDays.length === 0) {
      setErrorMessage("근무 요일을 하나 이상 선택해주세요.");

      return;
    }

    const teamsPayload = [
      {
        teamId: Number(selectedTeamId),

        countryCode: getCountryCode(country),

        timezone: timezone.trim(),

        languageCode: languageMap[language] || language,

        workStartTime: startTime,

        workEndTime: endTime,

        workDays: selectedWorkDays.map((day) => dayMap[day]),

        includeNationalHolidays: holidaysEnabled,
      },
    ];

    console.log("팀 설정 저장 Payload:", {
      teams: teamsPayload,
    });

    try {
      setIsSaving(true);

      const result = await updateProjectTeamSettings(projectId, teamsPayload);

      console.log("팀 시간대 설정 저장 성공:", result);

      alert("팀 시간대 설정이 저장되었습니다.");

      navigate(ROUTES.PROJECT_SETTINGS);
    } catch (error) {
      console.error("팀 시간대 설정 저장 실패:", error);

      switch (error.code) {
        case "400INVALID_TEAM_SETTING":
          setErrorMessage("팀 설정이 올바르지 않습니다.");

          break;

        case "403PROJECT_ADMIN_REQUIRED":
          setErrorMessage("프로젝트 관리 권한이 없습니다.");

          break;

        case "404TEAM_NOT_FOUND":
          setErrorMessage("팀을 찾을 수 없습니다.");

          break;

        case "422INVALID_TIMEZONE":
          setErrorMessage("국가와 시간대 조합이 올바르지 않습니다.");

          break;

        default:
          if (error.status === 401) {
            setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            setErrorMessage(
              error.message || "팀 시간대 설정 저장에 실패했습니다.",
            );
          }
      }
    } finally {
      setIsSaving(false);
    }
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
                disabled={isLoading || teams.length === 0}
                onClick={() => {
                  setIsTeamOpen((prev) => !prev);

                  setIsLanguageOpen(false);
                }}
              >
                <span>{selectedTeam?.teamName || "팀 선택"}</span>

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
                  {teams
                    .filter((teamItem) => teamItem.teamId !== selectedTeamId)
                    .map((teamItem) => (
                      <button
                        key={teamItem.teamId}
                        type="button"
                        className={styles.customSelectOption}
                        onClick={() => handleTeamSelect(teamItem)}
                      >
                        {teamItem.teamName}
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
                placeholder="KR"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className={styles.smallField}>
              <label htmlFor="timezone">시간대</label>

              <input
                id="timezone"
                type="text"
                value={timezone}
                placeholder="Asia/Seoul"
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>

            <button type="button" className={styles.outlineButton}>
              수동 설정
            </button>
          </div>

          {/* =========================
              언어
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
            Error
        ========================= */}

        {errorMessage && <p>{errorMessage}</p>}

        {/* =========================
            저장
        ========================= */}

        <div className={styles.saveArea}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? "저장 중..." : "저장"}
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
