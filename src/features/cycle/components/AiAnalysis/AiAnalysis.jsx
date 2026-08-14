import styles from "./AiAnalysis.module.css";

import aiUpdateIcon from "../../../../assets/icons/aiUpdateIcon.svg";

function AiAnalysis() {
  return (
    <section className={styles.analysis}>
      <div className={styles.analysisHeader}>
        <h2>AI 사이클 분석</h2>

        <span>
          분석 기준: 8월 10일 09:00 (KST)
        </span>
      </div>

      <div className={styles.summaryCard}>
        <img
          src={aiUpdateIcon}
          alt=""
          className={styles.summaryAiIcon}
        />

        <div className={styles.summaryText}>
          <strong>
            전반적으로 일정대로 진행 중입니다.
          </strong>

          <p>
            연동 개발은 목표 대비 10% 빠르게 진행되고 있으나,
            <br />
            파트너사 데이터 연동 이슈 해결이 필요합니다.
          </p>
        </div>
      </div>

      <div className={styles.speedSection}>
        <div className={styles.speedHeader}>
          <h3>진행 속도 추이</h3>

          <div className={styles.legend}>
            <span>
              <i className={styles.expectedLine} />
              예상 진행률
            </span>

            <span>
              <i className={styles.actualLine} />
              실제 진행률
            </span>
          </div>
        </div>

        <div className={styles.chart}>
          <div className={styles.yAxis}>
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>

          <div className={styles.graphArea}>
            {/* 왼쪽 세로축 */}
            <div className={styles.leftAxis} />

            {/* 아래 가로축 */}
            <div className={styles.bottomAxis} />

            <svg
              viewBox="0 0 850 250"
              className={styles.chartSvg}
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
                className={styles.expectedPath}
              />

              {/* 실제 진행률 */}
              <path
                d="
                  M40 190
                  C130 190 170 175 240 145
                  C330 105 410 115 520 110
                "
                className={styles.actualPath}
              />

              <circle
                cx="520"
                cy="110"
                r="10"
                className={styles.currentDot}
              />
            </svg>

            <span className={styles.percentLabel}>
              78%
            </span>

            <div className={styles.xAxis}>
              <span>Cycle 1</span>
              <span>Cycle 2</span>

              <span className={styles.activeCycle}>
                Cycle 3
              </span>

              <span>Cycle 4</span>
              <span>Cycle 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AiAnalysis;