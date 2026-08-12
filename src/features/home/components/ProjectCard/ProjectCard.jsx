import styles from "./ProjectCard.module.css";


function ProjectCard({
  title,
  company,
  cycle,
  progress,
  issueCount,
  completeCount,
}) {
  return (
    <article className={styles.projectCard}>
      <h3>
        {title}
      </h3>

      <p className={styles.projectCompany}>
        {company}
      </p>

      <p className={styles.projectCycle}>
        {cycle}
      </p>

      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className={styles.progressText}>
          {progress}%
        </span>
      </div>

      <p className={styles.projectMeta}>
        이슈 {issueCount} · 완료 {completeCount}
      </p>
    </article>
  );
}


export default ProjectCard;