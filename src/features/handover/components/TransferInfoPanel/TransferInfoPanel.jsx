import styles from "./TransferInfoPanel.module.css";

import calendarIcon2 from "../../../../assets/icons/calendarIcon2.svg";

function TransferInfoPanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>전달 정보</h2>

        <button
          type="button"
          className={styles.editButton}
        >
          수정
        </button>
      </div>

      <div className={styles.targetSection}>
        <span className={styles.label}>
          전달 대상
        </span>

        <div className={styles.targetRow}>
          <strong>기업 B</strong>

          <span className={styles.partnerBadge}>
            파트너사
          </span>
        </div>

        <p className={styles.teamName}>
          Engineering Team
        </p>
      </div>

      <div className={styles.managerSection}>
        <span className={styles.label}>
          담당자
        </span>

        <div className={styles.managerRow}>
          <div className={styles.avatar} />

          <span>Emily Chh</span>
        </div>
      </div>

      <div className={styles.timeSection}>
        <span className={styles.label}>
          전달 시점
        </span>

        <label className={styles.radioRow}>
          <input
            type="radio"
            name="handoverTime"
            value="now"
          />

          <span className={styles.customRadio} />

          <span className={styles.radioText}>
            지금 바로 전달
          </span>
        </label>

        <label className={styles.radioRow}>
          <input
            type="radio"
            name="handoverTime"
            value="next"
            defaultChecked
          />

          <span className={styles.customRadio} />

          <span className={styles.radioText}>
            다음 업무 시작 시간에 맞춰 전달
          </span>
        </label>

        <div className={styles.dateBox}>
          <span>
            2026-08-10 (월) 09:00 BST
          </span>

          <img
            src={calendarIcon2}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

export default TransferInfoPanel;