import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styles from "./CycleDashboard.module.css";

import CycleSummary from "../CycleSummary/CycleSummary";
import CycleTimeline from "../CycleTimeline/CycleTimeline";
import ProgressList from "../ProgressList/ProgressList";
import ActivityLog from "../ActivityLog/ActivityLog";
import AiAnalysis from "../AiAnalysis/AiAnalysis";
import CycleModal from "../CycleModal/CycleModal";

import {
  createCycle,
  deleteCycle,
  getCycle,
  getCycles,
  updateCycle,
} from "../../../../api/cycleApi";

import {
  getIssues,
} from "../../../../api/issueApi";

import {
  getCycleData,
} from "../../data/cycleData";


/* =========================
   사이클 정렬

   시작일 기준으로
   Cycle 1, Cycle 2...
   자동 계산
========================= */

const sortCyclesByPeriod = (
  cycleList
) => {
  return [
    ...cycleList,
  ].sort(
    (
      a,
      b
    ) => {
      const startCompare =
        String(
          a.startDate || ""
        ).localeCompare(
          String(
            b.startDate || ""
          )
        );


      if (
        startCompare !== 0
      ) {
        return startCompare;
      }


      const endCompare =
        String(
          a.endDate || ""
        ).localeCompare(
          String(
            b.endDate || ""
          )
        );


      if (
        endCompare !== 0
      ) {
        return endCompare;
      }


      return (
        Number(
          a.cycleId
        ) -
        Number(
          b.cycleId
        )
      );
    }
  );
};


/* =========================
   이슈 날짜
========================= */

const formatIssueDate = (
  dueDate
) => {
  if (!dueDate) {
    return "";
  }


  const [
    year,
    month,
    day,
  ] =
    dueDate.split("-");


  if (
    !year ||
    !month ||
    !day
  ) {
    return dueDate;
  }


  return `${year.slice(
    2
  )}.${month}.${day}`;
};


/* =========================
   이슈 지연 여부
========================= */

const isDelayedIssue = (
  issue
) => {
  if (
    issue.status ===
    "DONE"
  ) {
    return false;
  }


  if (
    issue.status ===
    "DELAYED"
  ) {
    return true;
  }


  if (!issue.dueDate) {
    return false;
  }


  const today =
    new Date();


  today.setHours(
    0,
    0,
    0,
    0
  );


  const dueDate =
    new Date(
      `${issue.dueDate}T00:00:00`
    );


  return (
    dueDate <
    today
  );
};


/* =========================
   이슈 타입
========================= */

const getIssueType = (
  issue
) => {
  if (
    isDelayedIssue(
      issue
    )
  ) {
    return "delay";
  }


  switch (
    issue.status
  ) {
    case "TODO":
      return "todo";

    case "IN_PROGRESS":
      return "progress";

    case "NEEDS_REVIEW":
      return "check";

    case "DONE":
      return "complete";

    case "CANCELED":
      return "canceled";

    default:
      return "todo";
  }
};


/* =========================
   이슈 상태 텍스트
========================= */

const getIssueStatusText = (
  issue
) => {
  if (
    isDelayedIssue(
      issue
    )
  ) {
    return "지연됨";
  }


  switch (
    issue.status
  ) {
    case "TODO":
      return "진행 전";


    case "IN_PROGRESS": {
      const doneCount =
        issue.checklistDoneCount ??
        0;


      const totalCount =
        issue.checklistTotalCount ??
        0;


      if (
        totalCount > 0
      ) {
        return `${Math.round(
          (
            doneCount /
            totalCount
          ) *
            100
        )}%`;
      }


      return "진행 중";
    }


    case "NEEDS_REVIEW":
      return "확인 필요";

    case "DONE":
      return "완료";

    case "CANCELED":
      return "취소됨";

    default:
      return (
        issue.status ||
        "-"
      );
  }
};


/* =========================
   이슈 설명
========================= */

const getIssueDescription = (
  issue
) => {
  if (
    issue.status ===
      "IN_PROGRESS" &&
    (
      issue.checklistTotalCount ??
      0
    ) > 0
  ) {
    return `전체 ${
      issue.checklistTotalCount
    }개 중 ${
      issue.checklistDoneCount ??
      0
    }개 완료`;
  }


  const parts = [];


  if (issue.dueDate) {
    parts.push(
      formatIssueDate(
        issue.dueDate
      )
    );
  }


  if (
    issue.assigneeName
  ) {
    parts.push(
      `담당 · ${issue.assigneeName}`
    );
  }


  return (
    parts.join(" ") ||
    "-"
  );
};


/* =========================
   ProgressList용 변환
========================= */

const formatProgressIssue = (
  issue
) => {
  return {
    issueId:
      issue.issueId,

    title:
      issue.title ||
      "제목 없음",

    description:
      getIssueDescription(
        issue
      ),

    type:
      getIssueType(
        issue
      ),

    status:
      getIssueStatusText(
        issue
      ),
  };
};


function CycleDashboard({
  cycleId,
}) {
  const navigate =
    useNavigate();


  /* =========================
     Tab
  ========================= */

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "overview"
  );


  /* =========================
     현재 사이클
  ========================= */

  const [
    cycleData,
    setCycleData,
  ] = useState(
    () => {
      const dummyData =
        getCycleData(
          cycleId
        ) || {};


      return {
        ...dummyData,

        id:
          Number(
            cycleId
          ),

        progresses:
          [],
      };
    }
  );


  /* =========================
     전체 사이클 목록

     Cycle N 계산 +
     Timeline 공유
  ========================= */

  const [
    cycles,
    setCycles,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  /* =========================
     Modal
  ========================= */

  const [
    modalMode,
    setModalMode,
  ] = useState(null);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);


  /* ==================================================
     전체 사이클 목록 재조회

     수정 / 생성 / 삭제 후
     공통으로 사용
  ================================================== */

  const refreshCycleList =
    async () => {
      const projectId =
        localStorage.getItem(
          "projectId"
        );


      if (!projectId) {
        console.warn(
          "projectId가 없습니다."
        );


        setCycles([]);


        return [];
      }


      try {
        const response =
          await getCycles(
            projectId
          );


        console.log(
          "사이클 리스트 조회 성공:",
          response
        );


        const list =
          Array.isArray(
            response?.data
          )
            ? response.data
            : [];


        const sortedList =
          sortCyclesByPeriod(
            list
          );


        setCycles(
          sortedList
        );


        return sortedList;
      } catch (error) {
        console.error(
          "사이클 리스트 조회 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        return [];
      }
    };


  /* ==================================================
     현재 사이클 상세
     +
     주요 이슈
     +
     사이클 목록
  ================================================== */

  useEffect(() => {
    const fetchCycle =
      async () => {
        const dummyData =
          getCycleData(
            cycleId
          ) || {};


        const projectId =
          localStorage.getItem(
            "projectId"
          );


        setLoading(
          true
        );


        try {
          const requests = [
            getCycle(
              cycleId
            ),

            getIssues(
              cycleId,
              {
                sort:
                  "createdAt,desc",

                page: 0,

                size: 5,
              }
            ),
          ];


          if (projectId) {
            requests.push(
              getCycles(
                projectId
              )
            );
          }


          const results =
            await Promise.allSettled(
              requests
            );


          const cycleResult =
            results[0];


          const issueResult =
            results[1];


          const listResult =
            projectId
              ? results[2]
              : null;


          let mergedData = {
            ...dummyData,

            id:
              Number(
                cycleId
              ),

            progresses:
              [],
          };


          /* =========================
             사이클 상세
          ========================= */

          if (
            cycleResult.status ===
            "fulfilled"
          ) {
            const response =
              cycleResult.value;


            console.log(
              "사이클 상세 조회 성공:",
              response
            );


            const data =
              response?.data;


            if (data) {
              mergedData = {
                ...mergedData,

                id:
                  data.cycleId,

                /*
                  사용자가 직접 정한
                  사이클 이름
                */

                name:
                  data.name ||
                  "",

                /*
                  사이클 목표
                */

                goal:
                  data.goal ??
                  "",

                status:
                  data.status,

                progress:
                  data.progressRate ??
                  0,

                plannedProgress:
                  data.plannedProgressRate ??
                  0,

                startDate:
                  data.startDate,

                endDate:
                  data.endDate,

                dDay:
                  data.dDay,

                statistics: [
                  {
                    label:
                      "완료된 업무",

                    value: `${
                      data.summary
                        ?.doneCount ??
                      0
                    } / ${
                      data.summary
                        ?.totalCount ??
                      0
                    }`,
                  },

                  {
                    label:
                      "진행 중인 업무",

                    value:
                      String(
                        data.summary
                          ?.inProgressCount ??
                          0
                      ),
                  },

                  {
                    label:
                      "확인 필요",

                    value:
                      String(
                        data.summary
                          ?.needsReviewCount ??
                          0
                      ),
                  },

                  {
                    label:
                      "취소된 업무",

                    value:
                      String(
                        data.summary
                          ?.canceledCount ??
                          0
                      ),
                  },
                ],

                lastAnalyzedAt:
                  data.lastAnalyzedAt ??
                  null,
              };
            }
          } else {
            console.error(
              "사이클 상세 조회 실패:",
              cycleResult.reason
            );


            console.error(
              "서버 응답:",
              cycleResult.reason
                ?.response
                ?.data
            );
          }


          /* =========================
             실제 이슈
          ========================= */

          if (
            issueResult.status ===
            "fulfilled"
          ) {
            const response =
              issueResult.value;


            console.log(
              "사이클 주요 이슈 조회 성공:",
              response
            );


            const issueList =
              Array.isArray(
                response?.data
              )
                ? response.data
                : [];


            mergedData.progresses =
              issueList
                .slice(
                  0,
                  5
                )
                .map(
                  formatProgressIssue
                );
          } else {
            console.error(
              "사이클 주요 이슈 조회 실패:",
              issueResult.reason
            );


            mergedData.progresses =
              [];
          }


          /* =========================
             전체 사이클 목록
          ========================= */

          if (
            listResult?.status ===
            "fulfilled"
          ) {
            const response =
              listResult.value;


            console.log(
              "사이클 리스트 조회 성공:",
              response
            );


            const list =
              Array.isArray(
                response?.data
              )
                ? response.data
                : [];


            setCycles(
              sortCyclesByPeriod(
                list
              )
            );
          }


          setCycleData(
            mergedData
          );
        } catch (error) {
          console.error(
            "사이클 화면 조회 실패:",
            error
          );


          setCycleData({
            ...dummyData,

            id:
              Number(
                cycleId
              ),

            progresses:
              [],
          });
        } finally {
          setLoading(
            false
          );
        }
      };


    if (cycleId) {
      fetchCycle();
    }
  }, [
    cycleId,
  ]);


  /* ==================================================
     현재 Cycle N
  ================================================== */

  const currentCycleIndex =
    cycles.findIndex(
      (
        cycle
      ) =>
        Number(
          cycle.cycleId
        ) ===
        Number(
          cycleData.id
        )
    );


  const cycleLabel =
    currentCycleIndex >= 0
      ? `Cycle ${
          currentCycleIndex +
          1
        }`

      : "Cycle";


  /* ==================================================
     다음 사이클
  ================================================== */

  const nextCycle =
    currentCycleIndex >= 0
      ? cycles[
          currentCycleIndex +
            1
        ] || null

      : null;


  const nextCycleLabel =
    nextCycle
      ? `Cycle ${
          currentCycleIndex +
          2
        }`

      : null;


  /* =========================
     새 사이클 모달
  ========================= */

  const handleCreateCycle =
    () => {
      setModalMode(
        "create"
      );
    };


  /* =========================
     수정 모달
  ========================= */

  const handleEditCycle =
    () => {
      setModalMode(
        "edit"
      );
    };


  /* =========================
     모달 닫기
  ========================= */

  const handleCloseModal =
    () => {
      if (
        isSaving ||
        isDeleting
      ) {
        return;
      }


      setModalMode(
        null
      );
    };


  /* ==================================================
     사이클 생성 / 수정
  ================================================== */

  const handleCycleSubmit =
    async (
      formData
    ) => {
      /* ==================================================
         새 사이클 생성

         ★ 프로젝트 최초 생성 시
           자동 사이클 생성 로직과는 별개

         ★ 여기서는 사용자가
           "새 사이클 생성" 버튼을
           누른 경우에만 호출됨
      ================================================== */

      if (
        modalMode ===
        "create"
      ) {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          alert(
            "프로젝트 정보가 없습니다."
          );


          return;
        }


        try {
          setIsSaving(
            true
          );


          const requestData = {
            name:
              formData.name,

            startDate:
              formData.startDate,

            endDate:
              formData.endDate,

            goal:
              formData.goal,
          };


          console.log(
            "사이클 생성 요청:",
            {
              projectId,

              ...requestData,
            }
          );


          const response =
            await createCycle(
              projectId,
              requestData
            );


          console.log(
            "사이클 생성 성공:",
            response
          );


          const newCycleId =
            response?.data
              ?.cycleId;


          /*
            생성 후 목록 재조회

            → Timeline 즉시 갱신
            → Cycle N 다시 계산
          */

          await refreshCycleList();


          setModalMode(
            null
          );


          /*
            새로 생성된 사이클로 이동
          */

          if (newCycleId) {
            navigate(
              `/cycle/${newCycleId}`
            );
          }
        } catch (error) {
          console.error(
            "사이클 생성 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          /* =========================
             시작일 > 마감일
          ========================= */

          if (
            responseData?.code ===
            "400CYCLE"
          ) {
            alert(
              responseData.message ||
                "사이클 기간을 확인해주세요."
            );


            return;
          }


          /* =========================
             기존 사이클과 기간 중복
          ========================= */

          if (
            responseData?.code ===
            "409CYCLE"
          ) {
            alert(
              responseData.message ||
                "기존 사이클과 기간이 중복됩니다."
            );


            return;
          }


          alert(
            responseData?.message ||
              "사이클 생성에 실패했습니다."
          );
        } finally {
          setIsSaving(
            false
          );
        }


        return;
      }


      /* ==================================================
         사이클 수정
      ================================================== */

      try {
        setIsSaving(
          true
        );


        const requestData = {
          name:
            formData.name,

          startDate:
            formData.startDate,

          endDate:
            formData.endDate,

          goal:
            formData.goal,
        };


        console.log(
          "사이클 수정 요청 데이터:",
          {
            cycleId:
              cycleData.id,

            ...requestData,
          }
        );


        const response =
          await updateCycle(
            cycleData.id,
            requestData
          );


        console.log(
          "사이클 수정 성공:",
          response
        );


        const updatedData =
          response?.data;


        /* =========================
           현재 카드 즉시 반영
        ========================= */

        setCycleData(
          (
            prev
          ) => ({
            ...prev,

            name:
              updatedData?.name ??
              formData.name,

            goal:
              updatedData?.goal ??
              formData.goal,

            startDate:
              updatedData
                ?.startDate ??
              formData.startDate,

            endDate:
              updatedData
                ?.endDate ??
              formData.endDate,
          })
        );


        /*
          수정 후 목록 재조회

          → Timeline도 수정
          → 기간 변경 시 Cycle N 재계산
        */

        await refreshCycleList();


        setModalMode(
          null
        );
      } catch (error) {
        console.error(
          "사이클 수정 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        alert(
          error.response?.data
            ?.message ||
            "사이클 수정에 실패했습니다."
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };


  /* ==================================================
     사이클 삭제
  ================================================== */

  const handleDeleteCycle =
    async () => {
      if (
        isDeleting
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "사이클을 삭제하시겠습니까?\n활동 기록과 AI 분석 기록도 함께 삭제됩니다."
        );


      if (!confirmed) {
        return;
      }


      const deletedIndex =
        currentCycleIndex;


      try {
        setIsDeleting(
          true
        );


        console.log(
          "사이클 삭제 요청:",
          {
            cycleId:
              cycleData.id,
          }
        );


        const response =
          await deleteCycle(
            cycleData.id
          );


        console.log(
          "사이클 삭제 성공:",
          response
        );


        setModalMode(
          null
        );


        /*
          서버 기준 전체 목록 다시 조회

          → 삭제된 사이클이
             Timeline에서도 즉시 제거
        */

        const remainingCycles =
          await refreshCycleList();


        /* =========================
           사이클 전부 삭제됨
        ========================= */

        if (
          remainingCycles.length ===
          0
        ) {
          navigate(
            "/cycle",
            {
              replace:
                true,
            }
          );


          return;
        }


        /*
          삭제된 자리에 다음 Cycle이 있으면
          그 Cycle로 이동.

          마지막 Cycle을 삭제했다면
          이전 Cycle로 이동.
        */

        const targetIndex =
          Math.min(
            Math.max(
              deletedIndex,
              0
            ),

            remainingCycles.length -
              1
          );


        const targetCycle =
          remainingCycles[
            targetIndex
          ];


        navigate(
          `/cycle/${targetCycle.cycleId}`,
          {
            replace:
              true,
          }
        );
      } catch (error) {
        console.error(
          "사이클 삭제 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );


        const responseData =
          error.response?.data;


        /* =========================
           존재하지 않는 Cycle
        ========================= */

        if (
          responseData?.code ===
          "404CYCLE"
        ) {
          alert(
            responseData.message ||
              "존재하지 않는 사이클입니다."
          );


          return;
        }


        /* =========================
           소속 이슈 존재
        ========================= */

        if (
          responseData?.code ===
          "409CYCLE"
        ) {
          alert(
            responseData.message ||
              "소속된 이슈가 있어 삭제할 수 없습니다."
          );


          return;
        }


        alert(
          responseData?.message ||
            "사이클 삭제에 실패했습니다."
        );
      } finally {
        setIsDeleting(
          false
        );
      }
    };


  return (
    <>
      <div
        className={
          styles.dashboard
        }
      >
        {/* =========================
            Header
        ========================= */}

        <header
          className={
            styles.header
          }
        >
          <div
            className={
              styles.headerTop
            }
          >
            <div
              className={
                styles.titleRow
              }
            >
              <h1>
                사이클
              </h1>


              {/* 자동 Cycle N */}

              <span
                className={
                  styles.cycleBadge
                }
              >
                {
                  cycleLabel
                }
              </span>
            </div>


            <button
              type="button"
              className={
                styles.createCycleButton
              }
              onClick={
                handleCreateCycle
              }
            >
              새 사이클 생성
            </button>
          </div>


          <p
            className={
              styles.description
            }
          >
            ⓘ AI가 활동을 분석하여 사이클 진행 상황을 업데이트합니다.
          </p>
        </header>


        {/* =========================
            Summary
        ========================= */}

        <CycleSummary
          cycleData={
            cycleData
          }
          cycleLabel={
            cycleLabel
          }
          nextCycle={
            nextCycle
          }
          nextCycleLabel={
            nextCycleLabel
          }
          loading={
            loading
          }
          onEdit={
            handleEditCycle
          }
        />


        {/* =========================
            Tabs
        ========================= */}

        <div
          className={
            styles.tabs
          }
        >
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab ===
              "overview"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "overview"
              )
            }
          >
            사이클 개요
          </button>


          <button
            type="button"
            className={`${styles.tab} ${
              activeTab ===
              "activity"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "activity"
              )
            }
          >
            활동 기록
          </button>


          <button
            type="button"
            className={`${styles.tab} ${
              activeTab ===
              "analysis"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "analysis"
              )
            }
          >
            AI 분석
          </button>
        </div>


        {/* =========================
            Overview
        ========================= */}

        {activeTab ===
          "overview" && (
          <div
            className={
              styles.overviewGrid
            }
          >
            <CycleTimeline
              cycles={
                cycles
              }
              activeCycleId={
                cycleData.id
              }
              loading={
                loading
              }
            />


            <ProgressList
              progresses={
                cycleData.progresses ||
                []
              }
            />
          </div>
        )}


        {/* =========================
            Activity
        ========================= */}

        {activeTab ===
          "activity" && (
          <ActivityLog
            cycleData={
              cycleData
            }
          />
        )}


        {/* =========================
            AI
        ========================= */}

        {activeTab ===
          "analysis" && (
          <AiAnalysis
            cycleData={
              cycleData
            }
          />
        )}
      </div>


      {/* =========================
          Cycle Modal
      ========================= */}

      {modalMode && (
        <CycleModal
          mode={
            modalMode
          }
          cycleData={
            modalMode ===
            "edit"
              ? cycleData
              : null
          }
          cycleLabel={
            cycleLabel
          }
          onClose={
            handleCloseModal
          }
          onSubmit={
            handleCycleSubmit
          }
          onDelete={
            handleDeleteCycle
          }
          isSaving={
            isSaving
          }
          isDeleting={
            isDeleting
          }
        />
      )}
    </>
  );
}


export default CycleDashboard;