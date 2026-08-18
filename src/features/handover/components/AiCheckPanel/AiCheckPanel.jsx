import { useNavigate } from "react-router-dom";

import styles from "./AiCheckPanel.module.css";

import warningTriangleIcon from "../../../../assets/icons/warningTriangleIcon.svg";
import questionCircleIcon from "../../../../assets/icons/questionCircleIcon.svg";
import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";

function AiCheckPanel() {
  const navigate = useNavigate();

  const handleIssueDetail = () => {
    navigate("/issue/1");
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>AI 확인 필요</h2>

        <span className={styles.totalBadge}>
          2
        </span>
      </div>

      <div
        className={styles.firstItem}
        onClick={handleIssueDetail}
      >
        <img
          src={warningTriangleIcon}
          alt=""
          className={styles.itemIcon}
        />

        <div className={styles.textArea}>
          <strong>근거가 부족한 내용</strong>
          <p>A 업무 담당자를 찾지 못했습니다.</p>
        </div>

        <span className={styles.countBadge}>
          3
        </span>

        <img
          src={rightArrowIcon}
          alt=""
          className={styles.arrowIcon}
        />
      </div>

      <div className={styles.divider} />

      <div
        className={styles.secondItem}
        onClick={handleIssueDetail}
      >
        <img
          src={questionCircleIcon}
          alt=""
          className={styles.itemIcon}
        />

        <div className={styles.textArea}>
          <strong>미답변 질문</strong>
          <p>파트너사의 개발 일정은 언제인가요?</p>
        </div>

        <span className={styles.countBadge}>
          1
        </span>

        <img
          src={rightArrowIcon}
          alt=""
          className={styles.arrowIcon}
        />
      </div>
    </section>
  );
}

export default AiCheckPanel;