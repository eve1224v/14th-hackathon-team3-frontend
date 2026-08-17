import styles from "./ProjectCreateSuccessModal.module.css";

import successIcon from "../../../../assets/icons/successIcon.svg";

function ProjectCreateSuccessModal({ onClose }) {
  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className={styles.title}>새 프로젝트 생성 완료</h2>

        <img src={successIcon} alt="" className={styles.successIcon} />

        <p className={styles.description}>새로운 프로젝트가 생성되었습니다.</p>
      </section>
    </div>
  );
}

export default ProjectCreateSuccessModal;
