import styles from "./CycleTimeline.module.css";

const cycles = [
  {
    cycle: "Cycle 1",
    status: "완료",
    period: "26.06.15 ~ 26.06.30",
    result: "100%",
    type: "complete",
  },
  {
    cycle: "Cycle 2",
    status: "완료",
    period: "26.07.01 ~ 26.07.28",
    result: "100%",
    type: "complete",
  },
  {
    cycle: "Cycle 3",
    status: "진행 중",
    period: "26.07.29 ~ 26.08.12",
    result: "78%",
    type: "active",
  },
  {
    cycle: "Cycle 4",
    status: null,
    period: "26.08.13 ~ 26.08.19",
    result: "예정",
    type: "future",
  },
  {
    cycle: "Cycle 5",
    status: null,
    period: "26.08.20 ~ 26.08.30",
    result: "예정",
    type: "future",
  },
];

function CycleTimeline() {
  return (
    <section className={styles.card}>
      <h2>사이클 타임라인</h2>

      <div className={styles.divider} />

      <div className={styles.timeline}>
        <div className={styles.line} />

        {cycles.map((item) => (
          <div
            key={item.cycle}
            className={`${styles.cycleItem} ${
              item.type === "active"
                ? styles.activeItem
                : ""
            }`}
          >
            <span
              className={`${styles.dot} ${styles[item.type]}`}
            />

            <div className={styles.cycleInfo}>
              <div className={styles.nameRow}>
                <strong>{item.cycle}</strong>

                {item.status && (
                  <span
                    className={
                      item.type === "active"
                        ? styles.activeStatus
                        : styles.status
                    }
                  >
                    ({item.status})
                  </span>
                )}
              </div>

              <span className={styles.period}>
                {item.period}
              </span>
            </div>

            <strong
              className={`${styles.result} ${
                item.type === "active"
                  ? styles.activeResult
                  : ""
              }`}
            >
              {item.result}
            </strong>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.moreButton}
      >
        사이클 더 보기 →
      </button>
    </section>
  );
}

export default CycleTimeline;