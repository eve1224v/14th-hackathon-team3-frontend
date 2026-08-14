import styles from "./IntegrationSettings.module.css";

import slackIcon from "../../../../assets/icons/slackIcon.svg";
import microsoftIcon from "../../../../assets/icons/microsoftIcon.svg";
import googleDriveIcon from "../../../../assets/icons/googledriveIcon.svg";
import notionIcon from "../../../../assets/icons/notionIcon.svg";
import jiraIcon from "../../../../assets/icons/jiraIcon.svg";

function IntegrationSettings() {
  const services = [
    {
      name: "Slack",
      icon: slackIcon,
      description: "연결된 채널: #general, #dev-team, #handover",
      status: "연결됨",
      synced: "마지막 동기화: 2시간 전",
    },
    {
      name: "Microsoft Teams",
      icon: microsoftIcon,
      description: "연결된 채널: 일반, 개발팀",
      status: "연결됨",
      synced: "마지막 동기화: 5시간 전",
    },
    {
      name: "Google Drive",
      icon: googleDriveIcon,
      description: "연결된 폴더: 프로젝트 공유 드라이브",
      status: "연결됨",
      synced: "마지막 동기화: 1일 전",
    },
    {
      name: "Notion",
      icon: notionIcon,
      description: "연결된 워크스페이스: 2026 글로벌 프로젝트 노트",
      status: "연결됨",
      synced: "마지막 동기화: 2시간 전",
    },
    {
      name: "Jira",
      icon: jiraIcon,
      description: "연결된 프로젝트: Global-2026",
      status: "오류",
      synced: "토큰 만료 · 재인증 필요",
      error: true,
    },
  ];

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>외부 서비스 연동</h1>

      <p className={styles.description}>
        프로젝트의 외부 서비스를 연결해 메시지·문서·업무 기록을 수집합니다.
        수집된 기록은 인수인계 생성과 Q&A 검색에 활용됩니다.
      </p>

      <div className={styles.sectionHeader}>
        <h2>연동된 서비스</h2>

        <button type="button" className={styles.addServiceButton}>
          새 서비스 연결
        </button>
      </div>

      <div className={styles.serviceList}>
        {services.map((service) => (
          <div key={service.name} className={styles.serviceCard}>
            <img src={service.icon} className={styles.serviceIcon} alt="" />

            <div className={styles.serviceInfo}>
              <strong>{service.name}</strong>

              <p>{service.description}</p>
            </div>

            <div className={styles.syncInfo}>
              <strong
                className={
                  service.error ? styles.errorStatus : styles.connectedStatus
                }
              >
                {service.status}
              </strong>

              <span>{service.synced}</span>
            </div>

            <button type="button" className={styles.scopeButton}>
              {service.error ? "재연결" : "접근 범위"}
            </button>

            <button type="button" className={styles.disconnectButton}>
              해제
            </button>
          </div>
        ))}
      </div>

      <section className={styles.guideArea}>
        <h2>수집 정보 안내</h2>

        <p>연동 서비스에서 수집된 기록은 프로젝트 내부에서만 사용됩니다.</p>

        <p>
          각 서비스의 접근 범위는 연동 시 사용자가 승인한 권한 범위를 초과하지
          않습니다.
        </p>

        <p>
          서비스 해제 시 이전 수집된 콘텐츠이며, 기존에 수집된 기록은 프로젝트
          데이터로 유지됩니다.
        </p>
      </section>
    </section>
  );
}

export default IntegrationSettings;
