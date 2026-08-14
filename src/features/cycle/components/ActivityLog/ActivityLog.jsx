import { useState } from "react";

import styles from "./ActivityLog.module.css";

import issueStatusIcon from "../../../../assets/icons/issueStatusIcon.svg";
import aiUpdateIcon from "../../../../assets/icons/aiUpdateIcon.svg";
import commentIcon from "../../../../assets/icons/commentIcon.svg";
import attachmentIcon from "../../../../assets/icons/attachmentIcon.svg";
import documentIcon from "../../../../assets/icons/documentIcon.svg";

const filters = [
  "전체",
  "이슈 상태",
  "댓글",
  "파일",
  "AI 업데이트",
];

const todayActivities = [
  {
    id: "today-1",
    type: "이슈 상태",
    contentType: "status",
    time: "14:32",
    icon: issueStatusIcon,
  },
  {
    id: "today-2",
    type: "AI 업데이트",
    contentType: "ai",
    time: "14:32",
    icon: aiUpdateIcon,
  },
  {
    id: "today-3",
    type: "댓글",
    contentType: "comment",
    time: "14:32",
    icon: commentIcon,
  },
  {
    id: "today-4",
    type: "파일",
    contentType: "file",
    time: "14:32",
    icon: attachmentIcon,
  },
];

const yesterdayActivities = [
  {
    id: "yesterday-1",
    type: "이슈 상태",
    contentType: "status",
    time: "14:32",
    icon: issueStatusIcon,
  },
  {
    id: "yesterday-2",
    type: "AI 업데이트",
    contentType: "ai",
    time: "14:32",
    icon: aiUpdateIcon,
  },
];

function ActivityLog() {
  const [activeFilter, setActiveFilter] = useState("전체");

  const filterActivities = (activities) => {
    if (activeFilter === "전체") {
      return activities;
    }

    return activities.filter(
      (activity) => activity.type === activeFilter
    );
  };

  const filteredToday = filterActivities(todayActivities);
  const filteredYesterday = filterActivities(yesterdayActivities);

  const renderActivityCard = (activity) => {
    if (activity.contentType === "status") {
      return (
        <article className={styles.activityCard}>
          <div className={styles.contentRow}>
            <div className={styles.profileCircle} />

            <div className={styles.mainContent}>
              <p className={styles.activityTitle}>
                <strong>김민준</strong>
                <span> 님이 이슈 상태를 변경했습니다.</span>
              </p>

              <strong className={styles.subject}>
                결제 API v3 연동
              </strong>

              <div className={styles.statusChange}>
                <span className={styles.progressBadge}>
                  진행 중
                </span>

                <span className={styles.arrow}>
                  →
                </span>

                <span className={styles.completeBadge}>
                  완료
                </span>
              </div>
            </div>
          </div>

          <div className={styles.cardRight}>
            <span className={styles.typeBadge}>
              이슈 상태
            </span>

            <button
              type="button"
              className={styles.detailButton}
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }

    if (activity.contentType === "ai") {
      return (
        <article
          className={`${styles.activityCard} ${styles.aiCard}`}
        >
          <div className={styles.contentRow}>
            <div className={styles.cardIconWrap}>
              <img
                src={aiUpdateIcon}
                alt=""
                className={styles.cardActivityIcon}
              />
            </div>

            <div className={styles.mainContent}>
              <p className={styles.activityTitle}>
                AI가 사이클 진행률을 업데이트했습니다.
              </p>

              <div className={styles.percentChange}>
                <span>72%</span>

                <span className={styles.arrow}>
                  →
                </span>

                <strong>78%</strong>
              </div>

              <div className={styles.reasonBox}>
                <strong>판단 근거</strong>

                <ul>
                  <li>
                    완료된 업무 2개가 추가되었습니다.
                  </li>

                  <li>
                    QA 체크리스트 업데이트가 감지되었습니다.
                  </li>

                  <li>
                    구글드라이브 일부 페이지가 병합되었습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.cardRight}>
            <span className={styles.typeBadge}>
              AI 업데이트
            </span>

            <button
              type="button"
              className={styles.detailButton}
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }

    if (activity.contentType === "comment") {
      return (
        <article className={styles.activityCard}>
          <div className={styles.contentRow}>
            <div className={styles.cardIconWrap}>
              <img
                src={commentIcon}
                alt=""
                className={styles.cardActivityIcon}
              />
            </div>

            <div className={styles.mainContent}>
              <p className={styles.activityTitle}>
                <strong>Emily Chh</strong>
                <span> 님이 댓글을 남겼습니다.</span>
              </p>

              <strong className={styles.subject}>
                파트너사 데이터 연동 확인
              </strong>

              <div className={styles.commentBox}>
                “API 키 권한 확인 후 다시 공유하겠습니다.”
              </div>
            </div>
          </div>

          <div className={styles.cardRight}>
            <span className={styles.typeBadge}>
              댓글
            </span>

            <button
              type="button"
              className={styles.detailButton}
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }

    if (activity.contentType === "file") {
      return (
        <article className={styles.activityCard}>
          <div className={styles.contentRow}>
            <div className={styles.profileCircle} />

            <div className={styles.mainContent}>
              <p className={styles.activityTitle}>
                <strong>김서연</strong>
                <span> 님이 파일을 업로드했습니다.</span>
              </p>

              <div className={styles.fileRow}>
                <div className={styles.documentBox}>
                  <img
                    src={documentIcon}
                    alt=""
                  />
                </div>

                <div className={styles.fileInfo}>
                  <strong>
                    QA_Result_v2.pdf
                  </strong>

                  <span>(2.4MB)</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cardRight}>
            <span className={styles.typeBadge}>
              파일
            </span>

            <button
              type="button"
              className={styles.detailButton}
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }

    return null;
  };

  const renderTimeline = (activities) => {
    return (
      <div className={styles.timeline}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={styles.timelineRow}
          >
            <span className={styles.time}>
              {activity.time}
            </span>

            <div className={styles.iconColumn}>
              <div
                className={`${styles.iconCircle} ${
                  styles[
                    `${activity.contentType}Circle`
                  ]
                }`}
              >
                <img
                  src={activity.icon}
                  alt=""
                  className={styles.activityIcon}
                />
              </div>
            </div>

            {renderActivityCard(activity)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className={styles.activity}>
      <div className={styles.filterCard}>
        <h2>활동 기록</h2>

        <p>
          Cycle 3에 포함된 모든 활동 기록을 확인하세요.
        </p>

        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                activeFilter === filter
                  ? styles.activeFilter
                  : ""
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredToday.length > 0 && (
        <div className={styles.dateSection}>
          <h3 className={styles.dateTitle}>
            오늘
          </h3>

          {renderTimeline(filteredToday)}
        </div>
      )}

      {filteredYesterday.length > 0 && (
        <div className={styles.dateSection}>
          <h3 className={styles.dateTitle}>
            어제
          </h3>

          {renderTimeline(filteredYesterday)}
        </div>
      )}
    </section>
  );
}

export default ActivityLog;