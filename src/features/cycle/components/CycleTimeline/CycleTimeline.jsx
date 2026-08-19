import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styles from "./CycleTimeline.module.css";

import {
  getCycles,
} from "../../../../api/cycleApi";


function CycleTimeline({
  activeCycleId,
}) {
  const navigate =
    useNavigate();


  const [
    cycles,
    setCycles,
  ] = useState([]);


  const [
    showMore,
    setShowMore,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =========================
     사이클 목록 조회
  ========================= */

  useEffect(() => {
    const fetchCycles =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          console.warn(
            "projectId가 없습니다."
          );

          setErrorMessage(
            "선택된 프로젝트가 없습니다."
          );

          setLoading(false);

          return;
        }


        try {
          setLoading(true);

          setErrorMessage("");


          const response =
            await getCycles(
              projectId
            );


          console.log(
            "사이클 리스트 조회 성공:",
            response
          );


          const cycleList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setCycles(
            cycleList
          );
        } catch (error) {
          console.error(
            "사이클 리스트 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "404PROJECT"
          ) {
            setErrorMessage(
              "존재하지 않는 프로젝트입니다."
            );
          } else if (
            responseData?.code ===
            "403PROJECT"
          ) {
            setErrorMessage(
              "프로젝트에 대한 접근 권한이 없습니다."
            );
          } else {
            setErrorMessage(
              responseData?.message ||
                "사이클 목록을 불러오지 못했습니다."
            );
          }


          setCycles([]);
        } finally {
          setLoading(false);
        }
      };


    fetchCycles();
  }, []);


  /* =========================
     타입 변환
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
    switch (status) {
      case "IN_PROGRESS":
        return "진행 중";

      case "COMPLETED":
        return "완료";

      case "PLANNED":
        return null;

      case "READY":
        return null;

      default:
        return null;
    }
  };


  /* =========================
     날짜 표시
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
    ] = date.split("-");


    return `${year.slice(
      2
    )}.${month}.${day}`;
  };


  /* =========================
     사이클 클릭
  ========================= */

  const handleCycleClick = (
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
     보여줄 사이클
  ========================= */

  const visibleCycles =
    showMore
      ? cycles
      : cycles.slice(
          0,
          5
        );


  /* =========================
     선 길이
  ========================= */

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
      ) : errorMessage ? (
        <div
          className={
            styles.timeline
          }
        >
          <p>
            {errorMessage}
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
              (cycle) => {
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
                        styles[type]
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
                            cycle.name
                          }
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
                  (prev) =>
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