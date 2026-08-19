import styles from "./HandoverSection.module.css";

import HandoverItem from "../HandoverItem/HandoverItem";


function HandoverSection({
  number,
  title,
  count,
  items,
  onAdd,
  onEdit,
}) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <strong>
            {number}. {title}
          </strong>

          <span className={styles.countBadge}>
            {count}개
          </span>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={onAdd}
        >
          <span className={styles.plus}>
            +
          </span>

          <span>
            항목 추가
          </span>
        </button>
      </div>


      <div className={styles.itemList}>
        {items.map((item, index) => (
          <HandoverItem
            key={item.issueId ?? `${number}-${index}`}
            {...item}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}


export default HandoverSection;