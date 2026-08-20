import {
  useState,
} from "react";

import styles from "./CycleModal.module.css";

import closeIcon from "../../../../assets/icons/closeIcon.svg";
import calendarIcon from "../../../../assets/icons/calendarIcon.svg";


/* =========================
   YYYY-MM-DD
   → YYYY/MM/DD
========================= */

const toSlashDate = (
  value
) => {
  if (!value) {
    return "";
  }


  return value.replaceAll(
    "-",
    "/"
  );
};


/* =========================
   Date → YYYY/MM/DD
========================= */

const formatDate = (
  date
) => {
  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}/${month}/${day}`;
};


/* =========================
   API 날짜
========================= */

const formatApiDate = (
  value
) => {
  if (!value) {
    return "";
  }


  return value.replaceAll(
    "/",
    "-"
  );
};


/* =========================
   String → Date
========================= */

const parseDate = (
  value
) => {
  if (!value) {
    return null;
  }


  const normalized =
    value.replaceAll(
      "-",
      "/"
    );


  const parts =
    normalized.split("/");


  if (
    parts.length !==
    3
  ) {
    return null;
  }


  const year =
    Number(
      parts[0]
    );


  const month =
    Number(
      parts[1]
    );


  const day =
    Number(
      parts[2]
    );


  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }


  return new Date(
    year,
    month - 1,
    day
  );
};


/* =========================
   같은 날짜
========================= */

const isSameDate = (
  date1,
  date2
) => {
  if (
    !date1 ||
    !date2
  ) {
    return false;
  }


  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  );
};


function CycleModal({
  mode = "create",
  cycleData,
  cycleLabel = "Cycle",
  onClose,
  onSubmit,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) {
  const isEdit =
    mode ===
    "edit";


  /* =========================
     사이클 이름
  ========================= */

  const [
    cycleName,
    setCycleName,
  ] = useState(
    isEdit
      ? cycleData?.name ||
          ""

      : ""
  );


  /* =========================
     목표
  ========================= */

  const [
    cycleGoal,
    setCycleGoal,
  ] = useState(
    isEdit
      ? cycleData?.goal ||
          ""

      : ""
  );


  /* =========================
     날짜
  ========================= */

  const [
    startDate,
    setStartDate,
  ] = useState(
    isEdit
      ? toSlashDate(
          cycleData
            ?.startDate
        )

      : ""
  );


  const [
    endDate,
    setEndDate,
  ] = useState(
    isEdit
      ? toSlashDate(
          cycleData
            ?.endDate
        )

      : ""
  );


  const [
    isCalendarOpen,
    setIsCalendarOpen,
  ] = useState(false);


  const [
    selectingStart,
    setSelectingStart,
  ] = useState(true);


  const initialDate =
    parseDate(
      isEdit
        ? cycleData
            ?.startDate

        : ""
    ) ||
    new Date();


  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1
    )
  );


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const selectedStartDate =
    parseDate(
      startDate
    );


  const selectedEndDate =
    parseDate(
      endDate
    );


  /* =========================
     범위 날짜
  ========================= */

  const isBetweenDates =
    (
      date
    ) => {
      if (
        !selectedStartDate ||
        !selectedEndDate
      ) {
        return false;
      }


      return (
        date.getTime() >
          selectedStartDate.getTime() &&
        date.getTime() <
          selectedEndDate.getTime()
      );
    };


  /* =========================
     날짜 클릭
  ========================= */

  const handleDateClick =
    (
      date
    ) => {
      const formattedDate =
        formatDate(
          date
        );


      if (
        selectingStart
      ) {
        setStartDate(
          formattedDate
        );


        setEndDate(
          ""
        );


        setSelectingStart(
          false
        );


        return;
      }


      const start =
        parseDate(
          startDate
        );


      if (
        start &&
        date.getTime() <
          start.getTime()
      ) {
        setStartDate(
          formattedDate
        );


        setEndDate(
          ""
        );


        setSelectingStart(
          false
        );


        return;
      }


      setEndDate(
        formattedDate
      );


      setSelectingStart(
        true
      );
    };


  /* =========================
     이전 / 다음 달
  ========================= */

  const handlePreviousMonth =
    () => {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() -
            1,
          1
        )
      );
    };


  const handleNextMonth =
    () => {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() +
            1,
          1
        )
      );
    };


  const year =
    currentDate.getFullYear();


  const month =
    currentDate.getMonth();


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const lastDate =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const previousMonthLastDate =
    new Date(
      year,
      month,
      0
    ).getDate();


  const calendarDays =
    [];


  /* =========================
     이전 달
  ========================= */

  for (
    let i =
      firstDay - 1;
    i >= 0;
    i -= 1
  ) {
    const day =
      previousMonthLastDate -
      i;


    calendarDays.push({
      day,

      date:
        new Date(
          year,
          month - 1,
          day
        ),

      currentMonth:
        false,
    });
  }


  /* =========================
     현재 달
  ========================= */

  for (
    let day = 1;
    day <= lastDate;
    day += 1
  ) {
    calendarDays.push({
      day,

      date:
        new Date(
          year,
          month,
          day
        ),

      currentMonth:
        true,
    });
  }


  /* =========================
     다음 달
  ========================= */

  let nextMonthDay =
    1;


  while (
    calendarDays.length <
    42
  ) {
    calendarDays.push({
      day:
        nextMonthDay,

      date:
        new Date(
          year,
          month + 1,
          nextMonthDay
        ),

      currentMonth:
        false,
    });


    nextMonthDay +=
      1;
  }


  /* =========================
     제출
  ========================= */

  const handleSubmit =
    () => {
      if (
        isSaving ||
        isDeleting
      ) {
        return;
      }


      setErrorMessage(
        ""
      );


      const trimmedName =
        cycleName.trim();


      const trimmedGoal =
        cycleGoal.trim();


      if (!trimmedName) {
        setErrorMessage(
          "사이클 명을 입력해주세요."
        );


        return;
      }


      const parsedStart =
        parseDate(
          startDate
        );


      const parsedEnd =
        parseDate(
          endDate
        );


      if (!parsedStart) {
        setErrorMessage(
          "시작 일자를 선택해주세요."
        );


        return;
      }


      if (!parsedEnd) {
        setErrorMessage(
          "마감 일자를 선택해주세요."
        );


        return;
      }


      if (
        parsedStart.getTime() >
        parsedEnd.getTime()
      ) {
        setErrorMessage(
          "마감 일자는 시작 일자보다 빠를 수 없습니다."
        );


        return;
      }


      onSubmit({
        name:
          trimmedName,

        startDate:
          formatApiDate(
            startDate
          ),

        endDate:
          formatApiDate(
            endDate
          ),

        goal:
          trimmedGoal,
      });
    };


  const handleDelete =
    () => {
      if (
        isSaving ||
        isDeleting
      ) {
        return;
      }


      onDelete?.();
    };


  const handleOverlayClick =
    (
      event
    ) => {
      if (
        isSaving ||
        isDeleting
      ) {
        return;
      }


      if (
        event.target ===
        event.currentTarget
      ) {
        onClose();
      }
    };


  return (
    <div
      className={
        styles.overlay
      }
      onMouseDown={
        handleOverlayClick
      }
    >
      <div
        className={
          styles.modal
        }
      >
        {/* 닫기 */}

        <button
          type="button"
          className={
            styles.closeButton
          }
          onClick={
            onClose
          }
          disabled={
            isSaving ||
            isDeleting
          }
          aria-label="닫기"
        >
          <img
            src={
              closeIcon
            }
            alt=""
          />
        </button>


        {/* =========================
            Modal 제목

            edit:
            Cycle 1

            create:
            새 사이클 생성
        ========================= */}

        <h2
          className={
            styles.title
          }
        >
          {isEdit
            ? cycleLabel
            : "새 사이클 생성"}
        </h2>


        {/* 사이클 명 */}

        <div
          className={
            styles.field
          }
        >
          <label
            htmlFor="cycleName"
          >
            사이클 명
          </label>


          <input
            id="cycleName"
            type="text"
            value={
              cycleName
            }
            onChange={(
              event
            ) =>
              setCycleName(
                event.target
                  .value
              )
            }
            placeholder="사이클 명을 입력해주세요."
            disabled={
              isSaving ||
              isDeleting
            }
          />
        </div>


        {/* 사이클 목표 */}

        <div
          className={
            styles.field
          }
        >
          <label
            htmlFor="cycleGoal"
          >
            사이클 목표
          </label>


          <textarea
            id="cycleGoal"
            value={
              cycleGoal
            }
            onChange={(
              event
            ) =>
              setCycleGoal(
                event.target
                  .value
              )
            }
            placeholder="사이클 목표를 입력해주세요."
            disabled={
              isSaving ||
              isDeleting
            }
          />
        </div>


        {/* =========================
            날짜
        ========================= */}

        <div
          className={
            styles.dateSection
          }
        >
          <label>
            날짜
          </label>


          <button
            type="button"
            className={
              styles.dateButton
            }
            onClick={() =>
              setIsCalendarOpen(
                (
                  prev
                ) =>
                  !prev
              )
            }
            disabled={
              isSaving ||
              isDeleting
            }
          >
            <span
              className={
                startDate &&
                endDate
                  ? styles.dateValue
                  : styles.datePlaceholder
              }
            >
              {startDate &&
              endDate
                ? `${startDate} ~ ${endDate}`

                : startDate
                  ? `${startDate} ~ 종료일 선택`

                  : "날짜를 선택해주세요."}
            </span>


            <img
              src={
                calendarIcon
              }
              alt=""
              className={
                styles.calendarIcon
              }
            />
          </button>


          {/* 달력 */}

          {isCalendarOpen && (
            <div
              className={
                styles.calendarPopup
              }
            >
              <div
                className={
                  styles.calendarHeader
                }
              >
                <button
                  type="button"
                  className={
                    styles.monthButton
                  }
                  onClick={
                    handlePreviousMonth
                  }
                >
                  ‹
                </button>


                <strong>
                  {currentDate.toLocaleString(
                    "en-US",
                    {
                      month:
                        "long",
                    }
                  )}{" "}
                  {year}
                </strong>


                <button
                  type="button"
                  className={
                    styles.monthButton
                  }
                  onClick={
                    handleNextMonth
                  }
                >
                  ›
                </button>
              </div>


              <div
                className={
                  styles.calendarDivider
                }
              />


              <div
                className={
                  styles.weekRow
                }
              >
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>


              <div
                className={
                  styles.calendarGrid
                }
              >
                {calendarDays.map(
                  (
                    item,
                    index
                  ) => {
                    const isStart =
                      isSameDate(
                        item.date,
                        selectedStartDate
                      );


                    const isEnd =
                      isSameDate(
                        item.date,
                        selectedEndDate
                      );


                    const isRange =
                      isBetweenDates(
                        item.date
                      );


                    const classNames =
                      [
                        styles.dayButton,

                        !item.currentMonth
                          ? styles.otherMonthDay
                          : "",

                        isRange
                          ? styles.rangeDay
                          : "",

                        isStart ||
                        isEnd
                          ? styles.selectedDay
                          : "",
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " "
                        );


                    return (
                      <button
                        key={`${item.date.getTime()}-${index}`}
                        type="button"
                        className={
                          classNames
                        }
                        onClick={() =>
                          handleDateClick(
                            item.date
                          )
                        }
                      >
                        {
                          item.day
                        }
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>


        {errorMessage && (
          <p
            className={
              styles.errorMessage
            }
          >
            {
              errorMessage
            }
          </p>
        )}


        {/* =========================
            Buttons
        ========================= */}

        <div
          className={
            styles.actions
          }
        >
          <button
            type="button"
            className={
              styles.primaryButton
            }
            onClick={
              handleSubmit
            }
            disabled={
              isSaving ||
              isDeleting
            }
          >
            {isSaving
              ? "저장 중..."

              : isEdit
                ? "완료"

                : "사이클 생성"}
          </button>


          {isEdit && (
            <button
              type="button"
              className={
                styles.deleteButton
              }
              onClick={
                handleDelete
              }
              disabled={
                isSaving ||
                isDeleting
              }
            >
              {isDeleting
                ? "삭제 중..."
                : "삭제"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default CycleModal;