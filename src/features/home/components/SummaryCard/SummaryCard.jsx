import styles from "./SummaryCard.module.css";


function SummaryCard({
  label,
  count,
  color,
}) {
  return (
    <article className={styles.summaryCard}>
      <div className={styles.summaryLabel}>
        <span
          className={styles.statusDot}
          style={{ backgroundColor: color }}
        />

        <span>{label}</span>
      </div>

      <strong className={styles.summaryCount}>
        {count}
      </strong>
    </article>
  );
}


export default SummaryCard;