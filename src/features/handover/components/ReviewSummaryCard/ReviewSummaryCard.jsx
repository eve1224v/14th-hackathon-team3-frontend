import styles from "./ReviewSummaryCard.module.css";

function ReviewSummaryCard({ label, count }) {
  return (
    <article className={styles.card}>
      <span>{label}</span>
      <strong>{count}</strong>
    </article>
  );
}

export default ReviewSummaryCard;