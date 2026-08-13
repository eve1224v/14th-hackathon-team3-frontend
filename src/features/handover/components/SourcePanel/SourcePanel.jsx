import styles from "./SourcePanel.module.css";

import slackIcon from "../../../../assets/icons/slackIcon.svg";
import microsoftIcon from "../../../../assets/icons/microsoftIcon.svg";
import notionIcon from "../../../../assets/icons/notionIcon.svg";
import googleDriveIcon from "../../../../assets/icons/googleDriveIcon.svg";

const sources = [
  {
    icon: slackIcon,
    name: "Slack",
    description: "#general, #handover",
    count: 3,
  },
  {
    icon: microsoftIcon,
    name: "Microsoft Teams",
    description: "일반, 개발팀",
    count: 3,
  },
  {
    icon: notionIcon,
    name: "Notion",
    description: "2026 글로벌 프로젝트 노트",
    count: 3,
  },
  {
    icon: googleDriveIcon,
    name: "Google Drive",
    description: "프로젝트 공유 드라이브",
    count: 3,
  },
  {
    icon: googleDriveIcon,
    name: "Google Drive",
    description: "프로젝트 공유 드라이브",
    count: 3,
  },
];

function SourcePanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2>출처 및 근거</h2>

        <span className={styles.totalBadge}>
          21
        </span>
      </div>

      <div className={styles.list}>
        {sources.map((source, index) => (
          <div
            key={`${source.name}-${index}`}
            className={styles.item}
          >
            <img
              src={source.icon}
              alt=""
              className={styles.icon}
            />

            <div className={styles.text}>
              <strong>{source.name}</strong>
              <p>{source.description}</p>
            </div>

            <span className={styles.countBadge}>
              {source.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SourcePanel;