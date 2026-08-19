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
    <section
      className={
        styles.card
      }
    >
      <h2>
        주요 진행 상황
      </h2>


      <div
        className={
          styles.divider
        }
      />


      <div
        className={
          styles.list
        }
      >
        {progresses.length ===
        0 ? (
          <div
            className={
              styles.empty
            }
          >
            등록된 이슈가 없습니다.
          </div>
        ) : (
          progresses.map(
            (
              item
            ) => (
              <div
                key={
                  item.issueId
                }
                className={
                  styles.item
                }
              >
                {/* 상태 점 */}

                <span
                  className={`${styles.statusDot} ${
                    styles[
                      item.type
                    ]
                  }`}
                />


                {/* 이슈 내용 */}

                <div
                  className={
                    styles.text
                  }
                >
                  <strong>
                    {
                      item.title
                    }
                  </strong>


                  <p
                    className={
                      item.type ===
                      "progress"
                        ? styles.progressDescription
                        : ""
                    }
                  >
                    {
                      item.description
                    }
                  </p>
                </div>


                {/* 상태 */}

                <span
                  className={`${styles.badge} ${
                    styles[
                      `${item.type}Badge`
                    ]
                  }`}
                >
                  {
                    item.status
                  }
                </span>
              </div>
            )
          )
        )}
      </div>


      {/* =========================
          전체 이슈 페이지
      ========================= */}

      <button
        type="button"
        className={
          styles.moreButton
        }
        onClick={() =>
          navigate(
            ROUTES.ISSUE
          )
        }
      >
        모든 이슈 보기 →
      </button>
    </section>
  );
}


export default ProgressList;