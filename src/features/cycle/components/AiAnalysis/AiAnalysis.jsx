import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./AiAnalysis.module.css";

import aiUpdateIcon from "../../../../assets/icons/aiUpdateIcon.svg";

import {
  getCycleAiAnalysis,
  rerunCycleAiAnalysis,
} from "../../../../api/cycleApi";


/* =========================
   대기
========================= */

const wait = (
  milliseconds
) => {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
};


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


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);


  /*
    개발환경 StrictMode 등으로
    같은 사이클에 POST가 중복되는 것 방지
  */

  const requestedCycleRef =
    useRef(null);


  /* ==================================================
     AI 분석 조회 / 생성
  ================================================== */

  useEffect(() => {
    let cancelled =
      false;


    const cycleId =
      cycleData?.id;


    if (!cycleId) {
      return undefined;
    }


    /* =========================
       분석 완료까지 조회
    ========================= */

    const pollAnalysis =
      async (
        estimatedSeconds = 30
      ) => {
        const INTERVAL =
          2000;


        const MAX_ATTEMPTS =
          Math.max(
            10,
            Math.ceil(
              (
                estimatedSeconds +
                20
              ) /
                2
            )
          );


        for (
          let attempt = 1;
          attempt <=
          MAX_ATTEMPTS;
          attempt += 1
        ) {
          if (cancelled) {
            return null;
          }


          await wait(
            INTERVAL
          );


          if (cancelled) {
            return null;
          }


          try {
            const response =
              await getCycleAiAnalysis(
                cycleId
              );


            console.log(
              `사이클 AI 분석 조회 ${attempt}/${MAX_ATTEMPTS}:`,
              response
            );


            const data =
              response?.data;


            if (data) {
              return data;
            }
          } catch (error) {
            const responseData =
              error.response?.data;


            /*
              분석 작업이 아직 완료되지 않은 경우

              명세:
              404CYCLE
              "아직 분석 이력이 없습니다."
            */

            if (
              responseData?.code ===
              "404CYCLE"
            ) {
              console.log(
                `AI 분석 생성 대기 중... ${attempt}/${MAX_ATTEMPTS}`
              );


              continue;
            }


            throw error;
          }
        }


        return null;
      };


    /* =========================
       AI 분석 초기화
    ========================= */

    const initializeAiAnalysis =
      async () => {
        try {
          setLoading(
            true
          );


          setErrorMessage(
            ""
          );


          /* =========================================
             1. 기존 분석 조회
          ========================================= */

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


            if (
              data &&
              !cancelled
            ) {
              setAnalysis(
                data
              );


              return;
            }
          } catch (error) {
            const responseData =
              error.response?.data;


            /*
              분석 이력이 없는 경우에만
              분석 생성 요청으로 이동
            */

            if (
              responseData?.code !==
              "404CYCLE"
            ) {
              throw error;
            }


            console.log(
              "AI 분석 이력 없음:",
              {
                cycleId,

                message:
                  responseData?.message,
              }
            );
          }


          if (cancelled) {
            return;
          }


          /* =========================================
             2. AI 분석 생성 요청
          ========================================= */

          let estimatedSeconds =
            30;


          if (
            requestedCycleRef.current !==
            String(
              cycleId
            )
          ) {
            requestedCycleRef.current =
              String(
                cycleId
              );


            setIsGenerating(
              true
            );


            try {
              console.log(
                "사이클 AI 분석 생성 요청:",
                {
                  cycleId,

                  force:
                    false,
                }
              );


              const response =
                await rerunCycleAiAnalysis(
                  cycleId,
                  false
                );


              console.log(
                "사이클 AI 분석 생성 요청 성공:",
                response
              );


              estimatedSeconds =
                response?.data
                  ?.estimatedSeconds ??
                30;


              console.log(
                "AI 분석 요청 정보:",
                {
                  analysisId:
                    response?.data
                      ?.analysisId,

                  status:
                    response?.data
                      ?.status,

                  estimatedSeconds,
                }
              );
            } catch (error) {
              const responseData =
                error.response?.data;


              /*
                명세:

                409CYCLE
                이미 분석이 진행 중인 경우

                새 POST를 보내지 않고
                기존 분석 완료를 기다림
              */

              if (
                responseData?.code ===
                "409CYCLE"
              ) {
                console.log(
                  "이미 AI 분석이 진행 중입니다. 결과를 기다립니다."
                );
              } else {
                throw error;
              }
            }
          }


          if (cancelled) {
            return;
          }


          /* =========================================
             3. 분석 완료까지 GET 반복 조회
          ========================================= */

          const generatedAnalysis =
            await pollAnalysis(
              estimatedSeconds
            );


          if (cancelled) {
            return;
          }


          if (
            generatedAnalysis
          ) {
            console.log(
              "사이클 AI 분석 완료:",
              generatedAnalysis
            );


            setAnalysis(
              generatedAnalysis
            );


            setErrorMessage(
              ""
            );
          } else {
            setAnalysis(
              null
            );


            setErrorMessage(
              "AI 분석 요청은 접수되었지만 아직 결과가 준비되지 않았습니다."
            );
          }
        } catch (error) {
          if (cancelled) {
            return;
          }


          console.error(
            "사이클 AI 분석 처리 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          setAnalysis(
            null
          );


          setErrorMessage(
            responseData?.message ||
              "AI 분석을 처리하지 못했습니다."
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false
            );


            setIsGenerating(
              false
            );
          }
        }
      };


    initializeAiAnalysis();


    return () => {
      cancelled =
        true;
    };
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
    ).format(
      date
    );
  };


  /* =========================
     진행률
  ========================= */

  const currentProgress =
    analysis?.progressRate ??
    cycleData?.progress ??
    0;


  const plannedProgress =
    cycleData?.plannedProgress ??
    currentProgress;


  const planDifference =
    currentProgress -
    plannedProgress;


  /* =========================
     AI 요약 제목
  ========================= */

  const summaryHeadline =
    planDifference >= 10
      ? "전반적으로 계획보다 빠르게 진행 중입니다."

      : planDifference <= -10
        ? "전반적으로 계획보다 느리게 진행 중입니다."

        : "전반적으로 일정대로 진행 중입니다.";


  /* =========================
     로딩 / 분석 중
  ========================= */

  if (
    loading ||
    isGenerating
  ) {
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
              AI가 사이클을 분석하고 있습니다.
            </strong>


            <p>
              분석이 완료되면 결과를 자동으로 불러옵니다.
            </p>
          </div>
        </div>
      </section>
    );
  }


  /* =========================
     분석 결과 없음
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
              AI 분석이 완료되면
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
            {
              summaryHeadline
            }
          </strong>


          <p>
            {analysis.summary ||
              "AI 분석 결과가 없습니다."}
          </p>
        </div>
      </div>


      {/* =========================
          진행 속도 추이

          그래프는 기존 디자인 그대로 사용
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
          {/* Y축 */}

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


          {/* 그래프 */}

          <div
            className={
              styles.graphArea
            }
          >
            <div
              className={
                styles.leftAxis
              }
            />


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


            {/* 실제 API 진행률 숫자 */}

            <span
              className={
                styles.percentLabel
              }
            >
              {currentProgress}%
            </span>


            {/* X축 */}

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