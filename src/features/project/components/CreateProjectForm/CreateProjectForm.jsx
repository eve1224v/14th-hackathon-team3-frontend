import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateProjectForm.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import calendarIcon from "../../../../assets/icons/calendarIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";

function CreateProjectForm() {
  const navigate = useNavigate();

  /* =========================
     Calendar State
  ========================= */

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // true = 시작 날짜 선택 중
  // false = 마감 날짜 선택 중
  const [selectingStart, setSelectingStart] = useState(true);

  // 처음 보여줄 달력: 2026년 8월
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));

  /* =========================
     Company Search State
  ========================= */

  const [searchCompany, setSearchCompany] = useState("");

  const companies = [
    {
      id: 1,
      name: "기업 A",
      role: "주관사",
      isMine: true,
    },
    {
      id: 2,
      name: "기업 B",
      role: "파트너사",
      isMine: false,
    },
  ];

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchCompany.trim().toLowerCase()),
  );

  /* =========================
     Navigation
  ========================= */

  const handleCreateProject = () => {
    navigate(ROUTES.PROJECT_SETTINGS);
  };

  const handleCancel = () => {
    navigate(ROUTES.HOME);
  };

  /* =========================
     Date Utils
  ========================= */

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  const parseDate = (value) => {
    if (!value) {
      return null;
    }

    const parts = value.split("/");

    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    // 잘못된 날짜 방지
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const selectedStartDate = parseDate(startDate);

  const selectedEndDate = parseDate(endDate);

  const isBetweenDates = (date) => {
    if (!selectedStartDate || !selectedEndDate) {
      return false;
    }

    return (
      date.getTime() > selectedStartDate.getTime() &&
      date.getTime() < selectedEndDate.getTime()
    );
  };

  /* =========================
     Calendar Click
  ========================= */

  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);

    // 시작 날짜 선택
    if (selectingStart) {
      setStartDate(formattedDate);
      setEndDate("");

      setSelectingStart(false);

      return;
    }

    // 마감 날짜 선택
    const start = parseDate(startDate);

    // 시작 날짜보다 이전 날짜를
    // 두 번째로 누르면 새로운 시작 날짜로 설정
    if (start && date.getTime() < start.getTime()) {
      setStartDate(formattedDate);
      setEndDate("");

      setSelectingStart(false);

      return;
    }

    setEndDate(formattedDate);

    setSelectingStart(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  /* =========================
     Calendar Days
  ========================= */

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const lastDate = new Date(year, month + 1, 0).getDate();

  const previousMonthLastDate = new Date(year, month, 0).getDate();

  const calendarDays = [];

  /* 이전 달 */

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = previousMonthLastDate - i;

    calendarDays.push({
      day,

      date: new Date(year, month - 1, day),

      currentMonth: false,
    });
  }

  /* 이번 달 */

  for (let day = 1; day <= lastDate; day++) {
    calendarDays.push({
      day,

      date: new Date(year, month, day),

      currentMonth: true,
    });
  }

  /* 다음 달 */

  let nextMonthDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextMonthDay,

      date: new Date(year, month + 1, nextMonthDay),

      currentMonth: false,
    });

    nextMonthDay += 1;
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>새 프로젝트 만들기</h1>

      {/* =========================
          기본 정보
      ========================= */}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>기본 정보</h2>

        <div className={styles.field}>
          <label htmlFor="projectName">프로젝트명</label>

          <input id="projectName" type="text" />
        </div>

        <div className={styles.field}>
          <label htmlFor="projectGoal">프로젝트 목표</label>

          <textarea id="projectGoal" />
        </div>
      </section>

      {/* =========================
          프로젝트 기간
      ========================= */}

      <section className={`${styles.card} ${styles.periodCard}`}>
        <div className={styles.periodTitleRow}>
          <h2 className={styles.cardTitle}>프로젝트 기간</h2>

          <button
            type="button"
            className={styles.calendarButton}
            aria-label="캘린더 열기"
            onClick={() => {
              setIsCalendarOpen((prev) => !prev);

              if (!isCalendarOpen) {
                setSelectingStart(true);
              }
            }}
          >
            <img src={calendarIcon} className={styles.calendarIcon} alt="" />
          </button>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.dateField}>
            <label htmlFor="startDate">시작 일자</label>

            <input
              id="startDate"
              type="text"
              value={startDate}
              placeholder="2026/08/06"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.dateField}>
            <label htmlFor="endDate">마감 일자</label>

            <input
              id="endDate"
              type="text"
              value={endDate}
              placeholder="2026/08/24"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* =========================
            Calendar Popup
        ========================= */}

        {isCalendarOpen && (
          <div className={styles.calendarPopup}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.monthButton}
                onClick={handlePreviousMonth}
              >
                ‹
              </button>

              <strong>
                {currentDate.toLocaleString("en-US", {
                  month: "long",
                })}{" "}
                {year}
              </strong>

              <button
                type="button"
                className={styles.monthButton}
                onClick={handleNextMonth}
              >
                ›
              </button>
            </div>

            <div className={styles.calendarDivider} />

            <div className={styles.weekRow}>
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            <div className={styles.calendarGrid}>
              {calendarDays.map((item, index) => {
                const isStart = isSameDate(item.date, selectedStartDate);

                const isEnd = isSameDate(item.date, selectedEndDate);

                const isRange = isBetweenDates(item.date);

                const classNames = [
                  styles.dayButton,

                  !item.currentMonth ? styles.otherMonthDay : "",

                  isRange ? styles.rangeDay : "",

                  isStart || isEnd ? styles.selectedDay : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={`${item.date.getTime()}-${index}`}
                    type="button"
                    className={classNames}
                    onClick={() => handleDateClick(item.date)}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* =========================
          참여 기업
      ========================= */}

      <section className={`${styles.card} ${styles.companyCard}`}>
        <h2 className={styles.cardTitle}>참여 기업</h2>

        {/* 검색 */}

        <div className={styles.searchWrapper}>
          <img src={searchIcon} className={styles.searchIcon} alt="" />

          <input
            type="text"
            className={styles.searchInput}
            placeholder="기업명 검색"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
        </div>

        {/* 기업 목록 */}

        <div className={styles.companyList}>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div className={styles.companyItem} key={company.id}>
                <div className={styles.companyCircle} />

                <div className={styles.companyInfo}>
                  <div className={styles.companyNameRow}>
                    <strong>{company.name}</strong>

                    {company.isMine && (
                      <span className={styles.badge}>내 소속</span>
                    )}
                  </div>

                  <p>{company.role}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noCompany}>검색 결과가 없습니다.</p>
          )}
        </div>

        <button type="button" className={styles.addCompanyButton}>
          기업 추가
        </button>
      </section>

      {/* =========================
          Bottom
      ========================= */}

      <div className={styles.bottomActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          취소
        </button>

        <button
          type="button"
          className={styles.createButton}
          onClick={handleCreateProject}
        >
          프로젝트 생성
        </button>
      </div>
    </section>
  );
}

export default CreateProjectForm;
