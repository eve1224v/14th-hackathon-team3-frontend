import {
  useEffect,
  useState,
} from "react";

import styles from "./CycleDashboard.module.css";

import CycleSummary from "../CycleSummary/CycleSummary";
import CycleTimeline from "../CycleTimeline/CycleTimeline";
import ProgressList from "../ProgressList/ProgressList";
import ActivityLog from "../ActivityLog/ActivityLog";
import AiAnalysis from "../AiAnalysis/AiAnalysis";

import {
  getCycle,
} from "../../../../api/cycleApi";

import {
  getCycleData,
} from "../../data/cycleData";


function CycleDashboard({
  cycleId,
}) {
  const [
    activeTab,
    setActiveTab,
  ] = useState("overview");


  const [
    cycleData,
    setCycleData,
  ] = useState(() => {
    const dummyData =
      getCycleData(
        cycleId
      );


    return {
      ...dummyData,

      id:
        Number(
          cycleId
        ),
    };
  });


  const [
    loading,
    setLoading,
  ] = useState(false);


  /* =========================
     사이클 상세 조회
  ========================= */

  useEffect(() => {
    const fetchCycle =
      async () => {
        const dummyData =
          getCycleData(
            cycleId
          );


        try {
          const response =
            await getCycle(
              cycleId
            );


          console.log(
            "사이클 상세 조회 성공:",
            response
          );


          const data =
            response?.data;


          if (!data) {
            setCycleData({
              ...dummyData,

              id:
                Number(
                  cycleId
                ),
            });

            return;
          }


          const mergedData = {
            ...dummyData,

            id:
              data.cycleId,

            name:
              data.name,

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
                  data.summary?.doneCount ??
                  0
                } / ${
                  data.summary?.totalCount ??
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

            nextCycle:
              data.nextCycle
                ? {
                    id:
                      data.nextCycle
                        .cycleId,

                    name:
                      data.nextCycle
                        .name,

                    startDate:
                      data.nextCycle
                        .startDate,
                  }
                : null,

            lastAnalyzedAt:
              data.lastAnalyzedAt ??
              null,
          };


          setCycleData(
            mergedData
          );
        } catch (error) {
          console.error(
            "사이클 상세 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          setCycleData({
            ...dummyData,

            id:
              Number(
                cycleId
              ),
          });
        } finally {
          setLoading(false);
        }
      };


    if (cycleId) {
      fetchCycle();
    }
  }, [
    cycleId,
  ]);


  return (
    <div
      className={
        styles.dashboard
      }
    >
      <header
        className={
          styles.header
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

          <span
            className={
              styles.cycleBadge
            }
          >
            {
              cycleData.name
            }
          </span>
        </div>


        <p
          className={
            styles.description
          }
        >
          ⓘ AI가 활동을 분석하여 사이클 진행 상황을 업데이트합니다.
        </p>
      </header>


      <CycleSummary
        cycleData={
          cycleData
        }
        loading={
          loading
        }
      />


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


      {activeTab ===
        "overview" && (
        <div
          className={
            styles.overviewGrid
          }
        >
          <CycleTimeline
            activeCycleId={
              cycleData.id
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


      {activeTab ===
        "activity" && (
        <ActivityLog
          cycleData={
            cycleData
          }
        />
      )}


      {activeTab ===
        "analysis" && (
        <AiAnalysis
          cycleData={
            cycleData
          }
        />
      )}
    </div>
  );
}


export default CycleDashboard;