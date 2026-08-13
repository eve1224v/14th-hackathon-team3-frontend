import styles from "./HandoverItem.module.css";

import warningTriangleIcon from "../../../../assets/icons/warningTriangleIcon.svg";
import referenceLinkIcon from "../../../../assets/icons/referenceLinkIcon.svg";
import editPencilIcon from "../../../../assets/icons/editPencilIcon.svg";

function HandoverItem({
  title,
  description,
  manager,
  evidenceCount,
  warning,
}) {
  return (
    <div className={styles.itemRow}>
      <article className={styles.item}>
        <strong className={styles.title}>
          {title}
        </strong>

        <p className={styles.description}>
          {description}
        </p>

        <span className={styles.manager}>
          담당자 · {manager}
        </span>

        {warning ? (
          <div className={styles.warning}>
            <img
              src={warningTriangleIcon}
              alt=""
            />

            <span>근거 부족</span>
          </div>
        ) : (
          <div className={styles.evidence}>
            <img
              src={referenceLinkIcon}
              alt=""
            />

            <span>근거 {evidenceCount}개</span>
          </div>
        )}
      </article>

      <button
        type="button"
        className={styles.editButton}
      >
        <img
          src={editPencilIcon}
          alt=""
        />

        <span>수정</span>
      </button>
    </div>
  );
}

export default HandoverItem;