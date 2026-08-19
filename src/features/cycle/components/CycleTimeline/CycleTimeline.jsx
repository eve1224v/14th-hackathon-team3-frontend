import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styles from "./CycleTimeline.module.css";


function CycleTimeline({
  cycles = [],
  activeCycleId,
  loading = false,
}) {
  const navigate =
    useNavigate();


  const [
    showMore,
    setShowMore,
  ] = useState(false);


  /* =========================
     타입
  ========================= */

  const getCycleType = (
    cycle
  ) => {
    if (
      cycle.status ===
      "IN_PROGRESS"
    ) {
      return "active";
    }


    if (
      cycle.status ===
        "PLANNED" ||
      cycle.status ===
        "READY"
    ) {
      return "future";
    }


    return "complete";
  };


  /* =========================
     상태 텍스트
  ========================= */

  const getStatusText = (
    status
  ) => {
    switch (
      status
    ) {
      case "IN_PROGRESS":
        return "진행 중";

      case "COMPLETED":
        return "완료";

      case "PLANNED":
      case "READY":
        return null;

      default:
        return null;
    }
  };


  /* =========================
     날짜
  ========================= */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "";
    }


    const [
      year,
      month,
      day,
    ] =
      date.split("-");


    if (
      !year ||
      !month ||
      !day
    ) {
      return date;
    }


    return `${year.slice(
      2
    )}.${month}.${day}`;
  };


  /* =========================
     클릭
  ========================= */

  const handleCycleClick =
    (
      cycle
    ) => {
      if (
        !cycle?.cycleId
      ) {
        return;
      }


      navigate(
        `/cycle/${cycle.cycleId}`
      );
    };


  /* =========================
     표시 목록
  ========================= */

  const visibleCycles =
    showMore
      ? cycles
      : cycles.slice(
          0,
          5
        );


  const isExpanded =
    showMore &&
    cycles.length > 5;


  return (
    <section
      className={`${styles.card} ${
        isExpanded
          ? styles.expandedCard
          : ""
      }`}
    >
      <h2>
        사이클 타임라인
      </h2>


      <div
        className={
          styles.divider
        }
      />


      {loading ? (
        <div
          className={
            styles.timeline
          }
        >
          <p>
            사이클을 불러오는
            중입니다.
          </p>
        </div>
      ) : cycles.length ===
        0 ? (
        <div
          className={
            styles.timeline
          }
        >
          <p>
            등록된 사이클이
            없습니다.
          </p>
        </div>
      ) : (
        <>
          <div
            className={
              styles.timeline
            }
          >
            <div
              className={`${styles.line} ${
                isExpanded
                  ? styles.expandedLine
                  : ""
              }`}
            />


            {visibleCycles.map(
              (
                cycle,
                index
              ) => {
                const type =
                  getCycleType(
                    cycle
                  );


                const statusText =
                  getStatusText(
                    cycle.status
                  );


                const isSelected =
                  Number(
                    activeCycleId
                  ) ===
                  Number(
                    cycle.cycleId
                  );


                /*
                  index는 날짜순 정렬된
                  전체 cycles 기준이므로

                  Cycle 1
                  Cycle 2
                  Cycle 3
                  자동 생성
                */

                const cycleLabel =
                  `Cycle ${
                    index + 1
                  }`;


                return (
                  <div
                    key={
                      cycle.cycleId
                    }
                    className={`${styles.cycleItem} ${
                      isSelected
                        ? styles.activeItem
                        : ""
                    } ${
                      type ===
                      "future"
                        ? styles.futureItem
                        : ""
                    } ${styles.clickableItem}`}
                    onClick={() =>
                      handleCycleClick(
                        cycle
                      )
                    }
                  >
                    <span
                      className={`${styles.dot} ${
                        styles[
                          type
                        ]
                      }`}
                    />


                    <div
                      className={
                        styles.cycleInfo
                      }
                    >
                      <div
                        className={
                          styles.nameRow
                        }
                      >
                        <strong>
                          {
                            cycleLabel
                          }

                          {cycle.name && (
                            <>
                              {" · "}
                              {
                                cycle.name
                              }
                            </>
                          )}
                        </strong>


                        {statusText && (
                          <span
                            className={
                              type ===
                              "active"
                                ? styles.activeStatus
                                : styles.status
                            }
                          >
                            (
                            {
                              statusText
                            }
                            )
                          </span>
                        )}
                      </div>


                      <span
                        className={
                          styles.period
                        }
                      >
                        {formatDate(
                          cycle.startDate
                        )}{" "}
                        ~{" "}
                        {formatDate(
                          cycle.endDate
                        )}
                      </span>
                    </div>


                    <strong
                      className={`${styles.result} ${
                        type ===
                        "active"
                          ? styles.activeResult
                          : ""
                      }`}
                    >
                      {type ===
                      "future"
                        ? "예정"

                        : `${cycle.progressRate ?? 0}%`}
                    </strong>
                  </div>
                );
              }
            )}
          </div>


          {cycles.length >
            5 && (
            <button
              type="button"
              className={
                styles.moreButton
              }
              onClick={() =>
                setShowMore(
                  (
                    prev
                  ) =>
                    !prev
                )
              }
            >
              {showMore
                ? "사이클 접기 ↑"
                : "사이클 더 보기 →"}
            </button>
          )}
        </>
      )}
    </section>
  );
}


export default CycleTimeline;