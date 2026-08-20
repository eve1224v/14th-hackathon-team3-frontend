import styles from "./AiCheckPanel.module.css";

import warningTriangleIcon from "../../../../assets/icons/warningTriangleIcon.svg";
import questionCircleIcon from "../../../../assets/icons/questionCircleIcon.svg";
const isUnansweredQuestion = (item) =>
  item.category === "QUESTION" && item.reviewStatus !== "VERIFIED";

function AiCheckPanel({ items = [], reviewSummary = null }) {
  const reviewItems = items.filter(
    (item) => item.reviewStatus !== "VERIFIED",
  );
  const unansweredItems = reviewItems.filter(isUnansweredQuestion);
  const needsReviewItems = reviewItems.filter(
    (item) => !isUnansweredQuestion(item),
  );
  const needsReviewCount =
    reviewSummary?.needsReviewCount ?? needsReviewItems.length;
  const unansweredCount =
    reviewSummary?.unansweredCount ?? unansweredItems.length;

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>AI 확인 필요</h2>

        <span className={styles.totalBadge}>
          {needsReviewCount + unansweredCount}
        </span>
      </div>

      <div
        className={styles.firstItem}
      >
        <img
          src={warningTriangleIcon}
          alt=""
          className={styles.itemIcon}
        />

        <div className={styles.textArea}>
          <strong>확인이 필요한 내용</strong>
          <p>{needsReviewItems[0]?.title || "확인이 필요한 항목이 없습니다."}</p>
        </div>

        <span className={styles.countBadge}>
          {needsReviewCount}
        </span>
      </div>

      <div className={styles.divider} />

      <div
        className={styles.secondItem}
      >
        <img
          src={questionCircleIcon}
          alt=""
          className={styles.itemIcon}
        />

        <div className={styles.textArea}>
          <strong>미답변 질문</strong>
          <p>{unansweredItems[0]?.title || "미답변 질문이 없습니다."}</p>
        </div>

        <span className={styles.countBadge}>
          {unansweredCount}
        </span>
      </div>
    </section>
  );
}

export default AiCheckPanel;
