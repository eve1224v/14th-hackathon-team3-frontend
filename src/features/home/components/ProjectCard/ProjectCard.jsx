import styles from "./ProjectCard.module.css";


function ProjectCard({
  title,
  company,
  cycle,
  progress,
  issueCount,
  completeCount,
}) {
  const safeProgress =
    Math.min(
      Math.max(
        Number(progress) || 0,
        0,
      ),
      100,
    );


  return (
    <article
      className={
        styles.projectCard
      }
    >
      {/* 프로젝트명 */}

      <h3>
        {title || "-"}
      </h3>


      {/* 파트너사 */}

      <p
        className={
          styles.projectCompany
        }
      >
        {company || "파트너사 · -"}
      </p>


      {/* 현재 사이클 */}

      <p
        className={
          styles.projectCycle
        }
      >
        {cycle || "Cycle"}
      </p>


      {/* 진행률 */}

      <div
        className={
          styles.progressRow
        }
      >
        <div
          className={
            styles.progressTrack
          }
        >
          <div
            className={
              styles.progressFill
            }
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <span
          className={
            styles.progressText
          }
        >
          {safeProgress}%
        </span>
      </div>


      {/* 이슈 정보 */}

      <p
        className={
          styles.projectMeta
        }
      >
        이슈 {issueCount ?? 0}
        {" · "}
        완료 {completeCount ?? 0}
      </p>
    </article>
  );
}


export default ProjectCard;