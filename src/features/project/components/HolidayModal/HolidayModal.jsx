import { useState } from "react";

import styles from "./HolidayModal.module.css";

import calendarIcon2 from "../../../../assets/icons/calendarIcon2.svg";

function HolidayModal({ onClose, onSave }) {
  const [holidayName, setHolidayName] = useState("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // true = 시작일 선택
  // false = 종료일 선택
  const [selectingStart, setSelectingStart] = useState(true);

  // 처음 열릴 달
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));

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
    if (!value) return null;

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

    return new Date(year, month - 1, day);
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
     기간 일수
  ========================= */

  const getHolidayDays = () => {
    if (!selectedStartDate || !selectedEndDate) {
      return 0;
    }

    const difference = selectedEndDate.getTime() - selectedStartDate.getTime();

    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  /* =========================
     input 표시값
  ========================= */

  const holidayDateValue = (() => {
    if (!startDate) {
      return "";
    }

    if (!endDate) {
      return startDate;
    }

    return `${startDate} - ${endDate} (${getHolidayDays()}일)`;
  })();

  /* =========================
     날짜 클릭
  ========================= */

  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);

    // 첫 번째 클릭
    if (selectingStart) {
      setStartDate(formattedDate);
      setEndDate("");

      setSelectingStart(false);

      return;
    }

    const start = parseDate(startDate);

    // 시작일보다 앞 날짜 선택 시
    // 새 시작일로 설정
    if (start && date.getTime() < start.getTime()) {
      setStartDate(formattedDate);
      setEndDate("");

      setSelectingStart(false);

      return;
    }

    // 두 번째 클릭 = 종료일
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

  // 이전 달 날짜
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = previousMonthLastDate - i;

    calendarDays.push({
      day,
      date: new Date(year, month - 1, day),
      currentMonth: false,
    });
  }

  // 현재 달 날짜
  for (let day = 1; day <= lastDate; day++) {
    calendarDays.push({
      day,
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  // 다음 달 날짜
  let nextMonthDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextMonthDay,
      date: new Date(year, month + 1, nextMonthDay),
      currentMonth: false,
    });

    nextMonthDay += 1;
  }

  /* =========================
     저장
  ========================= */

  const handleSave = () => {
    if (!startDate || !endDate || !holidayName.trim()) {
      return;
    }

    onSave({
      date: holidayDateValue,
      name: holidayName,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>공휴일 추가</h2>

        <p className={styles.description}>
          추가할 공휴일 날짜와 이름을 입력하세요.
        </p>

        {/* =========================
            날짜
        ========================= */}

        <div className={styles.field}>
          <label htmlFor="holidayDate">날짜</label>

          <div className={styles.dateInputWrapper}>
            <input
              id="holidayDate"
              type="text"
              value={holidayDateValue}
              placeholder="2026/08/09 - 2026/08/13 (4일)"
              readOnly
            />

            <button
              type="button"
              className={styles.calendarButton}
              aria-label="날짜 선택"
              onClick={() => {
                setIsCalendarOpen((prev) => !prev);

                if (!isCalendarOpen) {
                  setSelectingStart(true);
                }
              }}
            >
              <img src={calendarIcon2} alt="" />
            </button>

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

                <div className={styles.calendarActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setSelectingStart(true);
                    }}
                    className={styles.resetButton}
                  >
                    초기화
                  </button>

                  <button
                    type="button"
                    className={styles.calendarDoneButton}
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================
            공휴일명
        ========================= */}

        <div className={styles.field}>
          <label htmlFor="holidayName">공휴일명</label>

          <input
            id="holidayName"
            type="text"
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
          />
        </div>

        {/* =========================
            하단 버튼
        ========================= */}

        <div className={styles.buttonArea}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            취소
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </section>
    </div>
  );
}

export default HolidayModal;
