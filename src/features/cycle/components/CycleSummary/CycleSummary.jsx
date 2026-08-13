import styles from "./CycleSummary.module.css";

const statistics = [
  {
    label: "완료된 업무",
    value: "19 / 23",
  },
  {
    label: "진행 중인 업무",
    value: "5",
  },
  {
    label: "확인 필요",
    value: "3",
  },
  {
    label: "취소된 업무",
    value: "1",
  },
];

const PROGRESS_SIZE = 153;
const PROGRESS_STROKE = 14.5;
const PROGRESS_PERCENT = 78;

function CycleSummary() {
  const radius = (PROGRESS_SIZE - PROGRESS_STROKE) / 2;
  const center = PROGRESS_SIZE / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (PROGRESS_PERCENT / 100) * circumference;

  return (
    <section className={styles.summary}>
      <div className={styles.progressArea}>
        <div className={styles.progressCircle}>
          <svg
            width={PROGRESS_SIZE}
            height={PROGRESS_SIZE}
            viewBox={`0 0 ${PROGRESS_SIZE} ${PROGRESS_SIZE}`}
            className={styles.progressSvg}
          >
            <defs>
              <linearGradient
                id="cycleProgressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6D7CFF" />
                <stop offset="100%" stopColor="#4D67FF" />
              </linearGradient>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#343a5a"
              strokeWidth={PROGRESS_STROKE}
              fill="none"
              strokeLinecap="round"
            />

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#cycleProgressGradient)"
              strokeWidth={PROGRESS_STROKE}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </svg>

          <div className={styles.progressInner}>
            <strong>{PROGRESS_PERCENT}%</strong>
            <span>진행률</span>
          </div>
        </div>
      </div>

      <div className={styles.currentCycle}>
        <div className={styles.cycleTitle}>
          <span className={styles.blueDot} />

          <strong>Cycle 3 진행 중</strong>
        </div>

        <div className={styles.periodRow}>
          <span>2026.07.29 ~ 2026.08.12 예정</span>

          <span className={styles.dayBadge}>
            D-4
          </span>
        </div>

        <div className={styles.statistics}>
          {statistics.map((item) => (
            <div
              key={item.label}
              className={styles.statItem}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.nextCycle}>
        <div className={styles.nextTitleRow}>
          <span>다음 사이클</span>

          <span className={styles.nextBadge}>
            Cycle 4
          </span>
        </div>

        <span className={styles.expected}>
          예정 시작일
        </span>

        <strong className={styles.nextDate}>
          2026.08.13 (목)
        </strong>
      </div>
    </section>
  );
}

export default CycleSummary;