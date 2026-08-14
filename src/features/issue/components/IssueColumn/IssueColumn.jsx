import IssueCard from "../IssueCard/IssueCard";

import styles from "./IssueColumn.module.css";

import moreIcon from "../../../../assets/icons/moreIcon.svg";
import addIcon from "../../../../assets/icons/addIcon.svg";


function IssueColumn({
  title,
  type,
  count,
  issues,
}) {
  return (
    <section className={styles.column}>
      {/* =========================
          컬럼 헤더
      ========================= */}

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span
            className={`${styles.statusDot} ${styles[type]}`}
          />

          <strong>
            {title}
          </strong>

          <span className={styles.countBadge}>
            {count}
          </span>
        </div>


        <div className={styles.headerActions}>
          <button
            type="button"
            aria-label="더보기"
          >
            <img
              src={moreIcon}
              alt=""
            />
          </button>

          <button
            type="button"
            aria-label="이슈 추가"
          >
            <img
              src={addIcon}
              alt=""
            />
          </button>
        </div>
      </div>


      {/* =========================
          카드
      ========================= */}

      <div className={styles.cardList}>
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
          />
        ))}
      </div>
    </section>
  );
}


export default IssueColumn;