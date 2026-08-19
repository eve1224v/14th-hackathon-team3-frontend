import {
  useEffect,
  useState,
} from "react";

import {
  getCycleActivities,
} from "../../../../api/cycleApi";

import styles from "./ActivityLog.module.css";

import issueStatusIcon from "../../../../assets/icons/issueStatusIcon.svg";
import aiUpdateIcon from "../../../../assets/icons/aiUpdateIcon.svg";
import commentIcon from "../../../../assets/icons/commentIcon.svg";
import attachmentIcon from "../../../../assets/icons/attachmentIcon.svg";
import documentIcon from "../../../../assets/icons/documentIcon.svg";


/* =========================
   필터
========================= */

const filters = [
  "전체",
  "이슈 상태",
  "댓글",
  "파일",
  "AI 업데이트",
];


/* =========================
   화면 필터 → API Enum
========================= */

const FILTER_TYPE_MAP = {
  전체: null,

  "이슈 상태":
    "ISSUE_STATUS_CHANGED",

  댓글:
    "COMMENT_ADDED",

  파일:
    "FILE_UPLOADED",

  "AI 업데이트":
    "AI_PROGRESS_UPDATED",
};


/* =========================
   활동 타입 → 화면 타입
========================= */

const getContentType = (
  type
) => {
  switch (type) {
    case "ISSUE_STATUS_CHANGED":
      return "status";

    case "AI_PROGRESS_UPDATED":
      return "ai";

    case "COMMENT_ADDED":
      return "comment";

    case "FILE_UPLOADED":
      return "file";

    default:
      return "";
  }
};


/* =========================
   아이콘
========================= */

const getActivityIcon = (
  type
) => {
  switch (type) {
    case "ISSUE_STATUS_CHANGED":
      return issueStatusIcon;

    case "AI_PROGRESS_UPDATED":
      return aiUpdateIcon;

    case "COMMENT_ADDED":
      return commentIcon;

    case "FILE_UPLOADED":
      return attachmentIcon;

    default:
      return issueStatusIcon;
  }
};


/* =========================
   시간 표시
========================= */

const formatTime = (
  occurredAt
) => {
  if (!occurredAt) {
    return "";
  }

  const timePart =
    occurredAt.split("T")[1];

  if (!timePart) {
    return "";
  }

  return timePart.slice(
    0,
    5
  );
};


/* =========================
   파일 크기 표시
========================= */

const formatFileSize = (
  size
) => {
  if (
    size === null ||
    size === undefined
  ) {
    return "";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (
    size <
    1024 * 1024
  ) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};


/* =========================
   상태 한글 표시
========================= */

const getStatusText = (
  status
) => {
  switch (status) {
    case "IN_PROGRESS":
      return "진행 중";

    case "DONE":
      return "완료";

    case "COMPLETED":
      return "완료";

    case "NEEDS_REVIEW":
      return "확인 필요";

    case "CANCELLED":
      return "취소";

    default:
      return status || "";
  }
};


function ActivityLog({
  cycleData,
}) {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("전체");


  const [
    activityGroups,
    setActivityGroups,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =========================
     활동 기록 조회
  ========================= */

  useEffect(() => {
    const fetchActivities =
      async () => {
        const cycleId =
          cycleData?.id;


        if (!cycleId) {
          setActivityGroups(
            []
          );

          return;
        }


        try {
          setLoading(true);

          setErrorMessage("");


          const type =
            FILTER_TYPE_MAP[
              activeFilter
            ];


          const response =
            await getCycleActivities(
              cycleId,
              {
                type,
                page: 0,
                size: 100,
              }
            );


          console.log(
            "사이클 활동 기록 조회 성공:",
            response
          );


          const groups =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setActivityGroups(
            groups
          );
        } catch (error) {
          console.error(
            "사이클 활동 기록 조회 실패:",
            error
          );

          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          switch (
            responseData?.code
          ) {
            case "400CYCLE":
              setErrorMessage(
                "지원하지 않는 활동 유형입니다."
              );

              break;

            case "400CYCLE_PAGE":
              setErrorMessage(
                "페이지 번호 또는 크기가 올바르지 않습니다."
              );

              break;

            case "404CYCLE":
              setErrorMessage(
                "존재하지 않는 사이클입니다."
              );

              break;

            default:
              setErrorMessage(
                responseData?.message ||
                  "활동 기록을 불러오지 못했습니다."
              );
          }


          setActivityGroups(
            []
          );
        } finally {
          setLoading(false);
        }
      };


    fetchActivities();
  }, [
    cycleData?.id,
    activeFilter,
  ]);


  /* =========================
     활동 카드
  ========================= */

  const renderActivityCard = (
    activity
  ) => {
    const contentType =
      getContentType(
        activity.type
      );


    /* =========================
       이슈 상태 변경
    ========================= */

    if (
      contentType ===
      "status"
    ) {
      return (
        <article
          className={
            styles.activityCard
          }
        >
          <div
            className={
              styles.contentRow
            }
          >
            <div
              className={
                styles.profileCircle
              }
            />

            <div
              className={
                styles.mainContent
              }
            >
              <p
                className={
                  styles.activityTitle
                }
              >
                <strong>
                  {
                    activity.actorName
                  }
                </strong>

                <span>
                  {" "}
                  님이 이슈 상태를
                  변경했습니다.
                </span>
              </p>


              <strong
                className={
                  styles.subject
                }
              >
                {
                  activity.issueTitle
                }
              </strong>


              <div
                className={
                  styles.statusChange
                }
              >
                <span
                  className={
                    styles.progressBadge
                  }
                >
                  {getStatusText(
                    activity.before
                  )}
                </span>


                <span
                  className={
                    styles.arrow
                  }
                >
                  →
                </span>


                <span
                  className={
                    styles.completeBadge
                  }
                >
                  {getStatusText(
                    activity.after
                  )}
                </span>
              </div>
            </div>
          </div>


          <div
            className={
              styles.cardRight
            }
          >
            <span
              className={
                styles.typeBadge
              }
            >
              이슈 상태
            </span>

            <button
              type="button"
              className={
                styles.detailButton
              }
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }


    /* =========================
       AI 진행률 업데이트
    ========================= */

    if (
      contentType ===
      "ai"
    ) {
      return (
        <article
          className={`${styles.activityCard} ${styles.aiCard}`}
        >
          <div
            className={
              styles.contentRow
            }
          >
            <div
              className={
                styles.cardIconWrap
              }
            >
              <img
                src={
                  aiUpdateIcon
                }
                alt=""
                className={
                  styles.cardActivityIcon
                }
              />
            </div>


            <div
              className={
                styles.mainContent
              }
            >
              <p
                className={
                  styles.activityTitle
                }
              >
                {activity.title ||
                  "AI가 사이클 진행률을 업데이트했습니다."}
              </p>


              <div
                className={
                  styles.percentChange
                }
              >
                <span>
                  {
                    activity.before
                  }
                  %
                </span>

                <span
                  className={
                    styles.arrow
                  }
                >
                  →
                </span>

                <strong>
                  {
                    activity.after
                  }
                  %
                </strong>
              </div>


              {activity.reason && (
                <div
                  className={
                    styles.reasonBox
                  }
                >
                  <strong>
                    판단 근거
                  </strong>

                  <ul>
                    <li>
                      {
                        activity.reason
                      }
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>


          <div
            className={
              styles.cardRight
            }
          >
            <span
              className={
                styles.typeBadge
              }
            >
              AI 업데이트
            </span>

            <button
              type="button"
              className={
                styles.detailButton
              }
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }


    /* =========================
       댓글
    ========================= */

    if (
      contentType ===
      "comment"
    ) {
      return (
        <article
          className={
            styles.activityCard
          }
        >
          <div
            className={
              styles.contentRow
            }
          >
            <div
              className={
                styles.cardIconWrap
              }
            >
              <img
                src={
                  commentIcon
                }
                alt=""
                className={
                  styles.cardActivityIcon
                }
              />
            </div>


            <div
              className={
                styles.mainContent
              }
            >
              <p
                className={
                  styles.activityTitle
                }
              >
                <strong>
                  {
                    activity.actorName
                  }
                </strong>

                <span>
                  {" "}
                  님이 댓글을
                  남겼습니다.
                </span>
              </p>


              <strong
                className={
                  styles.subject
                }
              >
                {
                  activity.issueTitle
                }
              </strong>


              {activity.reason && (
                <div
                  className={
                    styles.commentBox
                  }
                >
                  “
                  {
                    activity.reason
                  }
                  ”
                </div>
              )}
            </div>
          </div>


          <div
            className={
              styles.cardRight
            }
          >
            <span
              className={
                styles.typeBadge
              }
            >
              댓글
            </span>

            <button
              type="button"
              className={
                styles.detailButton
              }
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }


    /* =========================
       파일 업로드
    ========================= */

    if (
      contentType ===
      "file"
    ) {
      return (
        <article
          className={
            styles.activityCard
          }
        >
          <div
            className={
              styles.contentRow
            }
          >
            <div
              className={
                styles.profileCircle
              }
            />

            <div
              className={
                styles.mainContent
              }
            >
              <p
                className={
                  styles.activityTitle
                }
              >
                <strong>
                  {
                    activity.actorName
                  }
                </strong>

                <span>
                  {" "}
                  님이 파일을
                  업로드했습니다.
                </span>
              </p>


              <div
                className={
                  styles.fileRow
                }
              >
                <div
                  className={
                    styles.documentBox
                  }
                >
                  <img
                    src={
                      documentIcon
                    }
                    alt=""
                  />
                </div>


                <div
                  className={
                    styles.fileInfo
                  }
                >
                  <strong>
                    {
                      activity.fileName
                    }
                  </strong>

                  <span>
                    (
                    {formatFileSize(
                      activity.fileSize
                    )}
                    )
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div
            className={
              styles.cardRight
            }
          >
            <span
              className={
                styles.typeBadge
              }
            >
              파일
            </span>

            <button
              type="button"
              className={
                styles.detailButton
              }
            >
              자세히 보기 →
            </button>
          </div>
        </article>
      );
    }


    return null;
  };


  /* =========================
     타임라인
  ========================= */

  const renderTimeline = (
    activities
  ) => {
    return (
      <div
        className={
          styles.timeline
        }
      >
        {activities.map(
          (
            activity
          ) => {
            const contentType =
              getContentType(
                activity.type
              );


            return (
              <div
                key={
                  activity.activityId
                }
                className={
                  styles.timelineRow
                }
              >
                <span
                  className={
                    styles.time
                  }
                >
                  {formatTime(
                    activity.occurredAt
                  )}
                </span>


                <div
                  className={
                    styles.iconColumn
                  }
                >
                  <div
                    className={`${styles.iconCircle} ${
                      styles[
                        `${contentType}Circle`
                      ] || ""
                    }`}
                  >
                    <img
                      src={getActivityIcon(
                        activity.type
                      )}
                      alt=""
                      className={
                        styles.activityIcon
                      }
                    />
                  </div>
                </div>


                {renderActivityCard(
                  activity
                )}
              </div>
            );
          }
        )}
      </div>
    );
  };


  return (
    <section
      className={
        styles.activity
      }
    >
      {/* =========================
          필터
      ========================= */}

      <div
        className={
          styles.filterCard
        }
      >
        <h2>
          활동 기록
        </h2>

        <p>
          {cycleData.name}에 포함된 모든 활동 기록을 확인하세요.
        </p>


        <div
          className={
            styles.filters
          }
        >
          {filters.map(
            (
              filter
            ) => (
              <button
                key={
                  filter
                }
                type="button"
                className={
                  activeFilter ===
                  filter
                    ? styles.activeFilter
                    : ""
                }
                onClick={() =>
                  setActiveFilter(
                    filter
                  )
                }
              >
                {
                  filter
                }
              </button>
            )
          )}
        </div>
      </div>


      {/* =========================
          로딩
      ========================= */}

      {loading && (
        <div
          className={
            styles.dateSection
          }
        >
          <p>
            활동 기록을
            불러오는 중입니다.
          </p>
        </div>
      )}


      {/* =========================
          오류
      ========================= */}

      {!loading &&
        errorMessage && (
          <div
            className={
              styles.dateSection
            }
          >
            <p>
              {
                errorMessage
              }
            </p>
          </div>
        )}


      {/* =========================
          활동 없음
      ========================= */}

      {!loading &&
        !errorMessage &&
        activityGroups.length ===
          0 && (
          <div
            className={
              styles.dateSection
            }
          >
            <p>
              활동 기록이
              없습니다.
            </p>
          </div>
        )}


      {/* =========================
          날짜별 활동
      ========================= */}

      {!loading &&
        !errorMessage &&
        activityGroups.map(
          (
            group
          ) => (
            <div
              key={
                group.date
              }
              className={
                styles.dateSection
              }
            >
              <h3
                className={
                  styles.dateTitle
                }
              >
                {
                  group.dateLabel
                }
              </h3>


              {renderTimeline(
                group.activities ||
                  []
              )}
            </div>
          )
        )}
    </section>
  );
}


export default ActivityLog;