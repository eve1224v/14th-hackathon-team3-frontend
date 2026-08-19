import {
  useNavigate,
} from "react-router-dom";

import styles from "./ProgressList.module.css";

import {
  ROUTES,
} from "../../../../router/routes.constant";


function ProgressList({
  progresses = [],
}) {
  const navigate =
    useNavigate();


  return (
    <section className={styles.card}>
      <h2>
        주요 진행 상황
      </h2>

      <div className={styles.divider} />

      <div className={styles.list}>
        {progresses.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={styles.item}
          >
            <span
              className={`${styles.statusDot} ${styles[item.type]}`}
            />

            <div className={styles.text}>
              <strong>
                {item.title}
              </strong>

              <p
                className={
                  item.type === "progress"
                    ? styles.progressDescription
                    : ""
                }
              >
                {item.description}
              </p>
            </div>

            <span
              className={`${styles.badge} ${
                styles[`${item.type}Badge`]
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.moreButton}
        onClick={() =>
          navigate(ROUTES.ISSUE)
        }
      >
        모든 이슈 보기 →
      </button>
    </section>
  );
}


export default ProgressList;