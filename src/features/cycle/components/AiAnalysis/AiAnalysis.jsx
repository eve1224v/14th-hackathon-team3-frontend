import {
  useEffect,
  useState,
} from "react";

import styles from "./AiAnalysis.module.css";

import aiUpdateIcon from "../../../../assets/icons/aiUpdateIcon.svg";

import {
  getCycleAiAnalysis,
} from "../../../../api/cycleApi";


function AiAnalysis({
  cycleData,
}) {
  const [
    analysis,
    setAnalysis,
  ] = useState(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =========================
     AI 분석 조회
  ========================= */

  useEffect(() => {
    const fetchAiAnalysis =
      async () => {
        const cycleId =
          cycleData?.id;


        if (!cycleId) {
          return;
        }


        try {
          const response =
            await getCycleAiAnalysis(
              cycleId
            );


          console.log(
            "사이클 AI 분석 조회 성공:",
            response
          );


          const data =
            response?.data;


          if (!data) {
            setAnalysis(null);
            return;
          }


          setAnalysis(data);

          setErrorMessage("");
        } catch (error) {
          console.error(
            "사이클 AI 분석 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          /*
            아직 AI 분석을 한 적이 없는 경우
          */
          if (
            responseData?.code ===
            "404CYCLE"
          ) {
            setAnalysis(null);

            setErrorMessage(
              responseData?.message ||
                "아직 분석 이력이 없습니다."
            );

            return;
          }


          setAnalysis(null);

          setErrorMessage(
            responseData?.message ||
              "AI 분석을 불러오지 못했습니다."
          );
        }
      };


    fetchAiAnalysis();
  }, [
    cycleData?.id,
  ]);


  /* =========================
     분석 시간 표시
  ========================= */

  const formatAnalyzedAt = (
    analyzedAt
  ) => {
    if (!analyzedAt) {
      return "-";
    }


    const date =
      new Date(
        analyzedAt
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return analyzedAt;
    }


    return new Intl.DateTimeFormat(
      "ko-KR",
      {
        month:
          "long",

        day:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",

        hour12:
          false,

        timeZone:
          "Asia/Seoul",
      }
    ).format(date);
  };


  const currentProgress =
    analysis?.progressRate ??
    cycleData?.progress ??
    0;


  const previousProgress =
    analysis?.previousProgressRate ??
    0;


  const progressDifference =
    currentProgress -
    previousProgress;


  /* =========================
     분석 이력 없음
  ========================= */

  if (!analysis) {
    return (
      <section
        className={
          styles.analysis
        }
      >
        <div
          className={
            styles.analysisHeader
          }
        >
          <h2>
            AI 사이클 분석
          </h2>

          <span>
            분석 기준: -
          </span>
        </div>


        <div
          className={
            styles.summaryCard
          }
        >
          <img
            src={
              aiUpdateIcon
            }
            alt=""
            className={
              styles.summaryAiIcon
            }
          />

          <div
            className={
              styles.summaryText
            }
          >
            <strong>
              {errorMessage ||
                "아직 분석 이력이 없습니다."}
            </strong>

            <p>
              AI 분석이 생성되면
              이곳에서 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section
      className={
        styles.analysis
      }
    >
      {/* =========================
          헤더
      ========================= */}

      <div
        className={
          styles.analysisHeader
        }
      >
        <h2>
          AI 사이클 분석
        </h2>

        <span>
          분석 기준:{" "}
          {formatAnalyzedAt(
            analysis.analyzedAt
          )}{" "}
          (KST)
        </span>
      </div>


      {/* =========================
          AI 요약
      ========================= */}

      <div
        className={
          styles.summaryCard
        }
      >
        <img
          src={
            aiUpdateIcon
          }
          alt=""
          className={
            styles.summaryAiIcon
          }
        />

        <div
          className={
            styles.summaryText
          }
        >
          <strong>
            {analysis.summary ||
              "AI 분석 결과가 없습니다."}
          </strong>

          <p>
            이전 분석 대비 진행률이{" "}
            {progressDifference >
            0
              ? `${progressDifference}% 증가했습니다.`
              : progressDifference <
                  0
                ? `${Math.abs(
                    progressDifference
                  )}% 감소했습니다.`
                : "변동되지 않았습니다."}
          </p>
        </div>
      </div>


      {/* =========================
          진행 속도
      ========================= */}

      <div
        className={
          styles.speedSection
        }
      >
        <div
          className={
            styles.speedHeader
          }
        >
          <h3>
            진행 속도 추이
          </h3>

          <div
            className={
              styles.legend
            }
          >
            <span>
              <i
                className={
                  styles.expectedLine
                }
              />
              예상 진행률
            </span>

            <span>
              <i
                className={
                  styles.actualLine
                }
              />
              실제 진행률
            </span>
          </div>
        </div>


        <div
          className={
            styles.chart
          }
        >
          <div
            className={
              styles.yAxis
            }
          >
            <span>
              100%
            </span>

            <span>
              50%
            </span>

            <span>
              0%
            </span>
          </div>


          <div
            className={
              styles.graphArea
            }
          >
            {/* 왼쪽 세로축 */}

            <div
              className={
                styles.leftAxis
              }
            />


            {/* 아래 가로축 */}

            <div
              className={
                styles.bottomAxis
              }
            />


            <svg
              viewBox="0 0 850 250"
              className={
                styles.chartSvg
              }
              preserveAspectRatio="none"
            >
              {/* 예상 진행률 */}

              <path
                d="
                  M40 190
                  C150 190 180 165 250 145
                  C350 115 430 135 520 120
                  C600 105 680 65 769 45
                "
                className={
                  styles.expectedPath
                }
              />


              {/* 실제 진행률 */}

              <path
                d="
                  M40 190
                  C130 190 170 175 240 145
                  C330 105 410 115 520 110
                "
                className={
                  styles.actualPath
                }
              />


              <circle
                cx="520"
                cy="110"
                r="10"
                className={
                  styles.currentDot
                }
              />
            </svg>


            <span
              className={
                styles.percentLabel
              }
            >
              {currentProgress}%
            </span>


            <div
              className={
                styles.xAxis
              }
            >
              <span>
                이전 분석
              </span>

              <span
                className={
                  styles.activeCycle
                }
              >
                {cycleData?.name ||
                  "현재 사이클"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default AiAnalysis;