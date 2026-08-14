import styles from "./ProgressList.module.css";

const progresses = [
  {
    title: "결제 API v3 연동 개발 완료",
    description: "26.08.04    담당 · 홍길동",
    status: "완료",
    type: "complete",
  },
  {
    title: "결제 API v3 연동 개발 완료",
    description: "26.08.04    담당 · 홍길동",
    status: "완료",
    type: "complete",
  },
  {
    title: "보안 취약점 테스트 진행 중",
    description: "전체 12개 중 7개 완료",
    status: "58%",
    type: "progress",
  },
  {
    title: "파트너사 데이터 연동 확인 필요",
    description: "응답 스펙 불일치 이슈 확인 필요",
    status: "확인 필요",
    type: "check",
  },
  {
    title: "결제 오류 케이스 자동화",
    description: "테스트 환경 이슈로 지연",
    status: "지연됨",
    type: "delay",
  },
];

function ProgressList() {
  return (
    <section className={styles.card}>
      <h2>주요 진행 상황</h2>

      <div className={styles.divider} />

      <div className={styles.list}>
        {progresses.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={styles.item}
          >
            <span
              className={`${styles.statusDot} ${
                styles[item.type]
              }`}
            />

            <div className={styles.text}>
              <strong>{item.title}</strong>

              <p
                className={
                  item.type === "progress"
                    ? styles.progressDescription
                    : ""
                }
              >
                {item.description}
              </p>
            </div>

            <span
              className={`${styles.badge} ${
                styles[`${item.type}Badge`]
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.moreButton}
      >
        모든 이슈 보기 →
      </button>
    </section>
  );
}

export default ProgressList;