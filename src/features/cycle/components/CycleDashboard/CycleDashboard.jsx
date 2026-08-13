import { useState } from "react";

import styles from "./CycleDashboard.module.css";

import CycleSummary from "../CycleSummary/CycleSummary";
import CycleTimeline from "../CycleTimeline/CycleTimeline";
import ProgressList from "../ProgressList/ProgressList";
import ActivityLog from "../ActivityLog/ActivityLog";
import AiAnalysis from "../AiAnalysis/AiAnalysis";

function CycleDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1>사이클</h1>

          <span className={styles.cycleBadge}>
            Cycle 3
          </span>
        </div>

        <p className={styles.description}>
          ⓘ AI가 활동을 분석하여 사이클 진행 상황을 업데이트합니다.
        </p>
      </header>

      <CycleSummary />

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          사이클 개요
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "activity" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("activity")}
        >
          활동 기록
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "analysis" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          AI 분석
        </button>
      </div>

      {activeTab === "overview" && (
        <div className={styles.overviewGrid}>
          <CycleTimeline />
          <ProgressList />
        </div>
      )}

      {activeTab === "activity" && <ActivityLog />}

      {activeTab === "analysis" && <AiAnalysis />}
    </div>
  );
}

export default CycleDashboard;