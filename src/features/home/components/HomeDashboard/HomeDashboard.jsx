import { useNavigate } from "react-router-dom";

import styles from "./HomeDashboard.module.css";

import refreshIcon from "../../../../assets/icons/refreshIcon.svg";
import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";

import SummaryCard from "../SummaryCard/SummaryCard";
import TodoCard from "../TodoCard/TodoCard";
import ProjectCard from "../ProjectCard/ProjectCard";
import HandoverCard from "../HandoverCard/HandoverCard";

import { ROUTES } from "../../../../router/routes.constant";


const summaryItems = [
  {
    label: "진행 중",
    count: 4,
    color: "#4D67FF",
  },
  {
    label: "확인 필요",
    count: 3,
    color: "#FEBC2E",
  },
  {
    label: "지연 중",
    count: 2,
    color: "#FE6057",
  },
  {
    label: "완료",
    count: 12,
    color: "#28C840",
  },
];


const todoItems = [
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
];


const projects = [
  {
    title: "Global Payment Integration",
    company: "파트너사 · 기업 B",
    cycle: "Cycle 3",
    progress: 78,
    issueCount: 12,
    completeCount: 8,
  },
  {
    title: "Global Payment Integration",
    company: "파트너사 · 기업 B",
    cycle: "Cycle 3",
    progress: 78,
    issueCount: 12,
    completeCount: 8,
  },
  {
    title: "Global Payment Integration",
    company: "파트너사 · 기업 B",
    cycle: "Cycle 3",
    progress: 78,
    issueCount: 12,
    completeCount: 8,
  },
];


const handover = {
  fromCountry: "GB",
  fromTeam: "Product Team",

  toCountry: "KR",
  toTeam: "Engineering Team",

  project: "Global Payment Integration",
  cycle: "Cycle 3",

  completed: 5,
  next: 3,
  questions: 2,
  approvals: 1,
};


const activities = [
  {
    time: "14:32",
    content: "Emily가 「Design System Update」를 완료했습니다.",
  },
  {
    time: "13:48",
    content: "James가 「Payment API」에 질문을 남겼습니다.",
  },
  {
    time: "12:21",
    content: "AI가 Cycle 3 진행률을 72% → 78%로 업데이트했습니다.",
  },
  {
    time: "11:03",
    content: "Design Team이 새로운 파일을 공유했습니다.",
  },
];


function ArrowButton({ children, onClick }) {
  return (
    <button
      type="button"
      className={styles.arrowButton}
      onClick={onClick}
    >
      <span>
        {children}
      </span>

      <img
        src={rightArrowIcon}
        alt=""
      />
    </button>
  );
}


function HomeDashboard() {
  const navigate = useNavigate();


  const handleRefresh = () => {
    window.location.reload();
  };


  return (
    <div className={styles.dashboard}>
      {/* =========================
          상단 인사
      ========================= */}

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.location}>
            대한민국 · 서울 · 09:14
          </p>

          <h1>
            좋은 아침이에요, 예티님 👋
          </h1>

          <p className={styles.heroDescription}>
            <strong>London</strong> 팀이 업무를 마쳤어요.
            <br />
            이어서 진행해야 할 업무가 3개 있습니다.
          </p>
        </div>


        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleRefresh}
          >
            새로 고침
          </button>

          <button
            type="button"
            className={styles.issueButton}
            onClick={() => navigate(ROUTES.CREATE_ISSUE)}
          >
            새 이슈 등록
          </button>
        </div>
      </header>


      {/* =========================
          본문
      ========================= */}

      <div className={styles.contentGrid}>
        {/* =========================
            왼쪽 영역
        ========================= */}

        <main className={styles.leftColumn}>
          {/* 나의 업무 요약 */}

          <section>
            <h2 className={styles.sectionTitle}>
              나의 업무 요약
            </h2>

            <div className={styles.summaryList}>
              {summaryItems.map((item) => (
                <SummaryCard
                  key={item.label}
                  {...item}
                />
              ))}
            </div>
          </section>


          {/* 이어서 할 일 */}

          <section className={styles.todoSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                이어서 할 일
              </h2>

              <ArrowButton
                onClick={() => navigate(ROUTES.HANDOVER)}
              >
                전체 보기
              </ArrowButton>
            </div>

            <div className={styles.todoList}>
              {todoItems.map((item, index) => (
                <TodoCard
                  key={index}
                  {...item}
                />
              ))}
            </div>
          </section>


          {/* 진행 중인 프로젝트 */}

          <section className={styles.projectSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                진행 중인 프로젝트
              </h2>

              <ArrowButton>
                모든 프로젝트
              </ArrowButton>
            </div>

            <div className={styles.projectList}>
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  {...project}
                />
              ))}
            </div>
          </section>
        </main>


        {/* =========================
            오른쪽 영역
        ========================= */}

        <aside className={styles.rightColumn}>
          {/* 최근 인수인계 */}

          <section>
            <h2 className={styles.sectionTitle}>
              최근 인수인계
            </h2>

            <HandoverCard
              {...handover}
            />
          </section>


          {/* 최근 활동 */}

          <section className={styles.activitySection}>
            <div className={styles.activityHeader}>
              <h2 className={styles.sectionTitle}>
                최근 활동
              </h2>

              <button
                type="button"
                className={styles.activityRefresh}
                onClick={handleRefresh}
                aria-label="최근 활동 새로고침"
              >
                <img
                  src={refreshIcon}
                  alt=""
                />
              </button>
            </div>


            <div className={styles.activityList}>
              {activities.map((activity) => (
                <div
                  key={activity.time}
                  className={styles.activityItem}
                >
                  <strong>
                    {activity.time}
                  </strong>

                  <p>
                    {activity.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}


export default HomeDashboard;