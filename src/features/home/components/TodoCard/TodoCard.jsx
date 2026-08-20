import styles from "./TodoCard.module.css";


function TodoCard({
  title,
  project,
  manager,
  startDate,
  endDate,
  dueLabel,
}) {
  return (
    <article
      className={
        styles.todoCard
      }
    >
      <div
        className={
          styles.todoLeft
        }
      >
        <div
          className={
            styles.todoTitle
          }
        >
          <span
            className={
              styles.todoDot
            }
          />

          <strong>
            {title}
          </strong>
        </div>


        <p>
          프로젝트 ·{" "}
          {project}
        </p>


        <p>
          담당자 ·{" "}
          {manager}
        </p>
      </div>


      <div
        className={
          styles.todoRight
        }
      >
        <strong>
          {dueLabel}
        </strong>


        <div
          className={
            styles.todoDates
          }
        >
          <span>
            시작일{" "}
            {startDate}
          </span>

          <span>
            마감일{" "}
            {endDate}
          </span>
        </div>
      </div>
    </article>
  );
}


export default TodoCard;