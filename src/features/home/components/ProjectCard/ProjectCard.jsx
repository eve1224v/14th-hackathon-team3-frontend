import styles from "./ProjectCard.module.css";


/* ========================================
   상태 한글 변환
======================================== */

const getStatusText = (status) => {
  switch (status) {
    case "DRAFT":
      return "초안";

    case "ACTIVE":
      return "진행 중";

    case "ENDED":
      return "종료";

    default:
      return status || "-";
  }
};


function ProjectCard({
  name,
  status,
  startDate,
  endDate,
  memberCount,
}) {
  /*
    현재 프로젝트 목록 API에는
    진행률 값이 없기 때문에
    기존 프로젝트 페이지와 동일하게
    디자인 유지용 78% 사용
  */

  const progress = 78;


  return (
    <article
      className={
        styles.projectCard
      }
    >
      {/* 프로젝트명 */}

      <h3>
        {name || "프로젝트"}
      </h3>


      {/* 상태 */}

      <p
        className={
          styles.projectStatus
        }
      >
        {getStatusText(
          status,
        )}
      </p>


      {/* 프로젝트 기간 */}

      <p
        className={
          styles.projectPeriod
        }
      >
        {startDate || "-"}
        {" ~ "}
        {endDate || "-"}
      </p>


      {/* 멤버 */}

      <p
        className={
          styles.projectMember
        }
      >
        멤버{" "}
        {memberCount ?? 0}명
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
              width:
                `${progress}%`,
            }}
          />
        </div>


        <span
          className={
            styles.progressText
          }
        >
          {progress}%
        </span>
      </div>
    </article>
  );
}


export default ProjectCard;