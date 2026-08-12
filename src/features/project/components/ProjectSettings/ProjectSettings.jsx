import { useNavigate } from "react-router-dom";

import styles from "./ProjectSettings.module.css";

import { ROUTES } from "../../../../router/routes.constant";

function ProjectSettings() {
  const navigate = useNavigate();

  const handleTimezoneSettings = () => {
    navigate(ROUTES.TIMEZONE_SETTINGS);
  };

  const handleMemberSettings = () => {
    navigate(ROUTES.MEMBER_SETTINGS);
  };

  const handleIntegrationSettings = () => {
    navigate(ROUTES.INTEGRATION_SETTINGS);
  };

  const handleProjectHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>프로젝트 설정</h1>

      {/* =========================
          프로젝트 기본 정보
      ========================= */}

      <section className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h2>프로젝트 기본 정보</h2>

          <button type="button" className={styles.outlineButton}>
            편집
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.infoGrid}>
          <div className={styles.infoColumn}>
            <div className={styles.infoItem}>
              <span>프로젝트명</span>
              <p>글로벌 리서치 abc</p>
            </div>

            <div className={styles.infoItem}>
              <span>프로젝트 기간</span>
              <p>2026.08.07 ~ 2026.08.24</p>
            </div>

            <div className={styles.infoItem}>
              <span>참여 기업</span>
              <p>2개</p>
            </div>
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.infoItem}>
              <span>프로젝트 목표</span>
              <p>글로벌 어쩌고 어쩌고를 어쩌고 한다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          운영 관리
      ========================= */}

      <h2 className={styles.managementTitle}>운영 관리</h2>

      {/* 근무 시간대 설정 */}

      <section className={styles.managementCard}>
        <div>
          <strong>근무 시간대 설정</strong>

          <p>등록된 팀의 국가, 시간대, 근무 시간, 공휴일을 관리합니다.</p>
        </div>

        <div className={styles.managementMeta}>
          <span>등록된 팀 4개</span>
          <span>KST</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleTimezoneSettings}
        >
          설정
        </button>
      </section>

      {/* 멤버 초대 · 권한 관리 */}

      <section className={styles.managementCard}>
        <div>
          <strong>멤버 초대·권한 관리</strong>

          <p>팀 멤버를 초대하고, 멤버의 접근 권한을 설정합니다.</p>
        </div>

        <div className={styles.managementMeta}>
          <span>멤버 6명</span>
          <span>초대 대기 1명</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleMemberSettings}
        >
          설정
        </button>
      </section>

      {/* 외부 서비스 연동 */}

      <section className={styles.managementCard}>
        <div>
          <strong>외부 서비스 연동</strong>

          <p>
            Slack, Notion, Figma 등 연동된 서비스의 수집 범위와 상태를
            관리합니다.
          </p>
        </div>

        <div className={styles.managementMeta}>
          <span>연동 중 3개</span>
          <span>마지막 동기화 10분 전</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleIntegrationSettings}
        >
          설정
        </button>
      </section>

      {/* =========================
          프로젝트 홈
      ========================= */}

      <div className={styles.finishArea}>
        <button
          type="button"
          className={styles.finishButton}
          onClick={handleProjectHome}
        >
          프로젝트 홈으로
        </button>
      </div>
    </section>
  );
}

export default ProjectSettings;
