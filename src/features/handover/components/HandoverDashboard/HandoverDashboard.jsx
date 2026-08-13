import styles from "./HandoverDashboard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";
import infoCircleIcon from "../../../../assets/icons/infoCircleIcon.svg";

import ReviewSummaryCard from "../ReviewSummaryCard/ReviewSummaryCard";
import HandoverSection from "../HandoverSection/HandoverSection";
import SourcePanel from "../SourcePanel/SourcePanel";
import AiCheckPanel from "../AiCheckPanel/AiCheckPanel";
import TransferInfoPanel from "../TransferInfoPanel/TransferInfoPanel";

const reviewSummary = [
  {
    label: "근거 확인 완료",
    count: 12,
  },
  {
    label: "확인 필요",
    count: 2,
  },
  {
    label: "미답변 질문",
    count: 1,
  },
  {
    label: "전체 항목",
    count: 15,
  },
];

const handoverSections = [
  {
    number: 1,
    title: "완료한 업무",
    count: 2,
    items: [
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
    ],
  },

  {
    number: 2,
    title: "진행 중인 업무",
    count: 2,
    items: [
      {
        title: "API 연동 테스트",
        description: "결제 승인 API 연동이 완료되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
    ],
  },

  {
    number: 3,
    title: "다음 할 일",
    count: 2,
    items: [
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
    ],
  },

  {
    number: 4,
    title: "결정 사항",
    count: 2,
    items: [
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
    ],
  },

  {
    number: 5,
    title: "질문 사항",
    count: 2,
    items: [
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        warning: true,
      },
      {
        title: "결제 API 요구사항 확정",
        description: "v3 명세로 최종 확정되었습니다.",
        manager: "홍길동",
        evidenceCount: 3,
      },
    ],
  },
];

function HandoverDashboard() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1>인수인계</h1>

          <div className={styles.projectRow}>
            <strong>Global Payment Integration</strong>
            <span className={styles.cycleBadge}>Cycle 3</span>
          </div>

          <div className={styles.aiNotice}>
            <img src={infoCircleIcon} alt="" />
            <span>AI가 8분 전에 최신 활동을 반영했습니다.</span>
          </div>
        </div>

        <div className={styles.headerButtons}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleRefresh}
          >
            새로 고침
          </button>

          <button type="button" className={styles.issueButton}>
            새 이슈 등록
          </button>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <main className={styles.mainColumn}>
          <section className={styles.reviewSection}>
            <h2 className={styles.sectionTitle}>AI 검토 결과</h2>

            <div className={styles.summaryGrid}>
              {reviewSummary.map((item) => (
                <ReviewSummaryCard
                  key={item.label}
                  label={item.label}
                  count={item.count}
                />
              ))}
            </div>
          </section>

          <section className={styles.todoSection}>
            <div className={styles.todoHeader}>
              <h2 className={styles.sectionTitle}>할 일</h2>

              <button type="button" className={styles.viewAllButton}>
                <span>전체 보기</span>
                <img src={rightArrowIcon} alt="" />
              </button>
            </div>

            <div className={styles.taskBoard}>
              <div className={styles.sectionList}>
                {handoverSections.map((section) => (
                  <HandoverSection
                    key={section.number}
                    number={section.number}
                    title={section.title}
                    count={section.count}
                    items={section.items}
                  />
                ))}
              </div>
            </div>

            <div className={styles.bottomActions}>
              <button type="button" className={styles.saveButton}>
                임시 저장
              </button>

              <button type="button" className={styles.transferButton}>
                <span>인수인계 전달</span>
                <span className={styles.transferArrow}>→</span>
              </button>
            </div>
          </section>
        </main>

        <aside className={styles.sideColumn}>
          <SourcePanel />
          <AiCheckPanel />
          <TransferInfoPanel />
        </aside>
      </div>
    </div>
  );
}

export default HandoverDashboard;