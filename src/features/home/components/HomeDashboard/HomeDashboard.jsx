import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styles from "./HomeDashboard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";

import SummaryCard from "../SummaryCard/SummaryCard";
import TodoCard from "../TodoCard/TodoCard";
import ProjectCard from "../ProjectCard/ProjectCard";
import HandoverCard from "../HandoverCard/HandoverCard";

import {
  ROUTES,
} from "../../../../router/routes.constant";

import {
  getProjects,
} from "../../../../api/projectApi";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getIssues,
} from "../../../../api/issueApi";

import {
  getHandover,
} from "../../../../api/handoverApi";


/* ========================================
   업무 요약 기본값
======================================== */

const DEFAULT_SUMMARY_ITEMS = [
  {
    label: "진행 중",
    count: 0,
    color: "#4D67FF",
  },
  {
    label: "확인 필요",
    count: 0,
    color: "#FEBC2E",
  },
  {
    label: "지연 중",
    count: 0,
    color: "#FE6057",
  },
  {
    label: "완료",
    count: 0,
    color: "#28C840",
  },
];


/* ========================================
   최근 인수인계 기본값
======================================== */

const DEFAULT_HANDOVER = {
  fromCountry: "",
  fromTeam: "",

  toCountry: "",
  toTeam: "",

  project: "프로젝트",
  cycle: "Cycle -",

  completed: 0,
  next: 0,
  questions: 0,
  needsReview: 0,

  notice:
    "아직 생성된 인수인계가 없습니다.",
};


/* ========================================
   Cycle 정렬
======================================== */

const sortCyclesByPeriod = (
  cycles,
) => {
  return [...cycles].sort(
    (a, b) => {
      const startCompare =
        String(
          a.startDate || "",
        ).localeCompare(
          String(
            b.startDate || "",
          ),
        );

      if (
        startCompare !== 0
      ) {
        return startCompare;
      }

      return (
        Number(
          a.cycleId || 0,
        ) -
        Number(
          b.cycleId || 0,
        )
      );
    },
  );
};


/* ========================================
   지연 이슈 판단
======================================== */

const isDelayedIssue = (
  issue,
) => {
  if (!issue?.dueDate) {
    return false;
  }

  if (
    issue.status === "DONE" ||
    issue.status === "CANCELED"
  ) {
    return false;
  }

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  const dueDate =
    new Date(
      `${issue.dueDate}T00:00:00`,
    );

  if (
    Number.isNaN(
      dueDate.getTime(),
    )
  ) {
    return false;
  }

  return dueDate < today;
};


/* ========================================
   AI 업데이트 시간
======================================== */

const getUpdateNotice = (
  lastSyncedAt,
) => {
  if (!lastSyncedAt) {
    return "AI 인수인계 업데이트 정보가 없습니다.";
  }

  const syncedDate =
    new Date(
      lastSyncedAt,
    );

  if (
    Number.isNaN(
      syncedDate.getTime(),
    )
  ) {
    return "AI 인수인계가 업데이트되었습니다.";
  }

  const now =
    new Date();

  const diffMinutes =
    Math.max(
      0,
      Math.floor(
        (
          now.getTime() -
          syncedDate.getTime()
        ) /
          60000,
      ),
    );

  if (
    diffMinutes < 1
  ) {
    return "AI가 방금 인수인계를 업데이트했습니다.";
  }

  if (
    diffMinutes < 60
  ) {
    return `AI가 ${diffMinutes}분 전에 인수인계를 업데이트했습니다.`;
  }

  const diffHours =
    Math.floor(
      diffMinutes / 60,
    );

  if (
    diffHours < 24
  ) {
    return `AI가 ${diffHours}시간 전에 인수인계를 업데이트했습니다.`;
  }

  const diffDays =
    Math.floor(
      diffHours / 24,
    );

  return `AI가 ${diffDays}일 전에 인수인계를 업데이트했습니다.`;
};


/* ========================================
   ArrowButton
======================================== */

function ArrowButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      className={
        styles.arrowButton
      }
      onClick={
        onClick
      }
    >
      <span>
        {children}
      </span>

      <img
        src={
          rightArrowIcon
        }
        alt=""
      />
    </button>
  );
}


/* ========================================
   HomeDashboard
======================================== */

function HomeDashboard() {
  const navigate =
    useNavigate();


  const [
    summaryItems,
    setSummaryItems,
  ] = useState(
    DEFAULT_SUMMARY_ITEMS,
  );


  /*
    ★ 이제 이슈가 아니라
      인수인계 NEXT_ACTION
  */

  const [
    todoItems,
    setTodoItems,
  ] = useState([]);


  const [
    projects,
    setProjects,
  ] = useState([]);


  const [
    handover,
    setHandover,
  ] = useState(
    DEFAULT_HANDOVER,
  );


  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);


  /* ========================================
     홈 데이터 조회
  ======================================== */

  useEffect(() => {
    let cancelled =
      false;


    const fetchHomeData =
      async () => {
        const workspaceId =
          localStorage.getItem(
            "workspaceId",
          );


        if (
          !workspaceId
        ) {
          console.warn(
            "홈: workspaceId가 없습니다.",
          );

          return;
        }


        try {
          /* ========================================
             1. 프로젝트 조회
          ======================================== */

          const projectResponse =
            await getProjects({
              workspaceId,
              status: "",
              keyword: "",
            });


          if (
            cancelled
          ) {
            return;
          }


          const projectList =
            Array.isArray(
              projectResponse
                ?.data,
            )
              ? projectResponse.data
              : [];


          console.log(
            "홈 프로젝트 목록:",
            projectList,
          );


          setProjects(
            projectList,
          );


          /* ========================================
             2. 프로젝트별 Cycle 조회
          ======================================== */

          const cycleResults =
            await Promise.allSettled(
              projectList.map(
                async (
                  project,
                ) => {
                  const response =
                    await getCycles(
                      project.projectId,
                    );


                  const cycles =
                    Array.isArray(
                      response?.data,
                    )
                      ? sortCyclesByPeriod(
                          response.data,
                        )
                      : [];


                  return {
                    project,
                    cycles,
                  };
                },
              ),
            );


          if (
            cancelled
          ) {
            return;
          }


          const cyclesByProject =
            new Map();


          const allCycles =
            [];


          cycleResults.forEach(
            (
              result,
            ) => {
              if (
                result.status !==
                "fulfilled"
              ) {
                console.error(
                  "홈 Cycle 조회 실패:",
                  result.reason,
                );

                return;
              }


              const {
                project,
                cycles,
              } =
                result.value;


              cyclesByProject.set(
                String(
                  project.projectId,
                ),
                cycles,
              );


              allCycles.push(
                ...cycles,
              );
            },
          );


          /* ========================================
             3. 모든 이슈 조회

             ★ 나의 업무 요약에서만 사용
          ======================================== */

          const issueResults =
            await Promise.allSettled(
              allCycles.map(
                (
                  cycle,
                ) =>
                  getIssues(
                    cycle.cycleId,
                    {
                      page: 0,
                      size: 100,
                      sort:
                        "createdAt,desc",
                    },
                  ),
              ),
            );


          if (
            cancelled
          ) {
            return;
          }


          const issueMap =
            new Map();


          issueResults.forEach(
            (
              result,
            ) => {
              if (
                result.status !==
                "fulfilled"
              ) {
                console.error(
                  "홈 이슈 조회 실패:",
                  result.reason,
                );

                return;
              }


              const issues =
                Array.isArray(
                  result.value
                    ?.data,
                )
                  ? result.value.data
                  : [];


              issues.forEach(
                (
                  issue,
                ) => {
                  if (
                    issue.issueId ===
                      undefined ||
                    issue.issueId ===
                      null
                  ) {
                    return;
                  }


                  issueMap.set(
                    String(
                      issue.issueId,
                    ),
                    issue,
                  );
                },
              );
            },
          );


          const allIssues =
            Array.from(
              issueMap.values(),
            );


          /* ========================================
             4. 업무 요약

             여기는 계속 이슈 데이터 사용
          ======================================== */

          const inProgressCount =
            allIssues.filter(
              (
                issue,
              ) =>
                issue.status ===
                "IN_PROGRESS",
            ).length;


          const needsReviewCount =
            allIssues.filter(
              (
                issue,
              ) =>
                issue.status ===
                "NEEDS_REVIEW",
            ).length;


          const delayedCount =
            allIssues.filter(
              isDelayedIssue,
            ).length;


          const doneCount =
            allIssues.filter(
              (
                issue,
              ) =>
                issue.status ===
                "DONE",
            ).length;


          setSummaryItems([
            {
              label:
                "진행 중",

              count:
                inProgressCount,

              color:
                "#4D67FF",
            },

            {
              label:
                "확인 필요",

              count:
                needsReviewCount,

              color:
                "#FEBC2E",
            },

            {
              label:
                "지연 중",

              count:
                delayedCount,

              color:
                "#FE6057",
            },

            {
              label:
                "완료",

              count:
                doneCount,

              color:
                "#28C840",
            },
          ]);


          /* ========================================
             5. 인수인계 조회

             ★ 이어서 할 일
             ★ 최근 인수인계

             둘 다 여기 데이터 사용
          ======================================== */

          const handoverId =
            localStorage.getItem(
              "handoverId",
            );


          const handoverProjectId =
            localStorage.getItem(
              "handoverProjectId",
            );


          const handoverCycleId =
            localStorage.getItem(
              "handoverCycleId",
            );


          /*
            아직 생성된 인수인계 없음
          */

          if (
            !handoverId
          ) {
            setTodoItems([]);

            setHandover(
              DEFAULT_HANDOVER,
            );

            return;
          }


          try {
            const handoverResponse =
              await getHandover(
                handoverId,
              );


            if (
              cancelled
            ) {
              return;
            }


            const handoverData =
              handoverResponse
                ?.data ||
              {};


            console.log(
              "홈 인수인계 전체 조회:",
              handoverData,
            );


            const items =
              Array.isArray(
                handoverData.items,
              )
                ? handoverData.items
                : [];


            /* ========================================
               프로젝트 이름
            ======================================== */

            const handoverProject =
              projectList.find(
                (
                  project,
                ) =>
                  Number(
                    project.projectId,
                  ) ===
                  Number(
                    handoverProjectId,
                  ),
              );


            const projectName =
              handoverProject
                ?.name ||
              localStorage.getItem(
                "projectName",
              ) ||
              "프로젝트";


            /* ========================================
               Cycle N
            ======================================== */

            const handoverCycles =
              cyclesByProject.get(
                String(
                  handoverProjectId,
                ),
              ) || [];


            const cycleIndex =
              handoverCycles.findIndex(
                (
                  cycle,
                ) =>
                  Number(
                    cycle.cycleId,
                  ) ===
                  Number(
                    handoverCycleId,
                  ),
              );


            const cycleLabel =
              cycleIndex >= 0
                ? `Cycle ${
                    cycleIndex +
                    1
                  }`
                : "Cycle -";


            /* ========================================
               6. 이어서 할 일

               ★ NEXT_ACTION만 사용

               items가 []이면
               todoItems도 []
            ======================================== */

            const nextActions =
              items
                .filter(
                  (
                    item,
                  ) =>
                    item.category ===
                    "NEXT_ACTION",
                )
                .slice(
                  0,
                  3,
                )
                .map(
                  (
                    item,
                  ) => ({
                    id:
                      item.itemId,

                    title:
                      item.title ||
                      "제목 없음",

                    project:
                      projectName,

                    manager:
                      item.assigneeMemberId
                        ? `멤버 #${item.assigneeMemberId}`
                        : "미지정",

                    startDate:
                      "-",

                    endDate:
                      "-",

                    dueLabel:
                      "다음 업무",
                  }),
                );


            console.log(
              "홈 이어서 할 일:",
              nextActions,
            );


            setTodoItems(
              nextActions,
            );


            /* ========================================
               7. 최근 인수인계 카드
            ======================================== */

            const completedCount =
              items.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "COMPLETED",
              ).length;


            const nextCount =
              items.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "NEXT_ACTION",
              ).length;


            /*
              질문 개수는
              reviewSummary의 unansweredCount 우선
            */

            const questionCount =
              handoverData
                ?.reviewSummary
                ?.unansweredCount ??
              items.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "QUESTION",
              ).length;


            const reviewCount =
              handoverData
                ?.reviewSummary
                ?.needsReviewCount ??
              0;


            setHandover({
              fromCountry: "",
              fromTeam: "",

              toCountry: "",
              toTeam: "",

              project:
                projectName,

              cycle:
                cycleLabel,

              completed:
                completedCount,

              next:
                nextCount,

              questions:
                questionCount,

              needsReview:
                reviewCount,

              notice:
                getUpdateNotice(
                  handoverData.lastSyncedAt,
                ),
            });
          } catch (
            error
          ) {
            console.error(
              "홈 인수인계 조회 실패:",
              error,
            );


            if (
              cancelled
            ) {
              return;
            }


            setTodoItems([]);

            setHandover({
              ...DEFAULT_HANDOVER,

              notice:
                "인수인계 내용을 불러오지 못했습니다.",
            });
          }
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }


          console.error(
            "홈 데이터 조회 실패:",
            error,
          );


          setProjects([]);

          setTodoItems([]);

          setSummaryItems(
            DEFAULT_SUMMARY_ITEMS,
          );

          setHandover(
            DEFAULT_HANDOVER,
          );
        }
      };


    void fetchHomeData();


    return () => {
      cancelled =
        true;
    };
  }, [
    refreshKey,
  ]);


  /* ========================================
     워크스페이스 변경
  ======================================== */

  useEffect(() => {
    const handleWorkspaceChanged =
      () => {
        setRefreshKey(
          (
            prev,
          ) =>
            prev + 1,
        );
      };


    window.addEventListener(
      "workspaceChanged",
      handleWorkspaceChanged,
    );


    return () => {
      window.removeEventListener(
        "workspaceChanged",
        handleWorkspaceChanged,
      );
    };
  }, []);


  /* ========================================
     새로 고침
  ======================================== */

  const handleRefresh =
    () => {
      setRefreshKey(
        (
          prev,
        ) =>
          prev + 1,
      );
    };


  /* ========================================
     모든 프로젝트
  ======================================== */

  const handleViewAllProjects =
    () => {
      navigate(
        ROUTES.PROJECT_HOME,
      );
    };


  /* ========================================
     프로젝트 카드 클릭
  ======================================== */

  const handleProjectClick =
    (
      project,
    ) => {
      if (
        !project
          ?.projectId
      ) {
        return;
      }


      localStorage.setItem(
        "projectId",
        String(
          project.projectId,
        ),
      );


      localStorage.setItem(
        "projectName",
        project.name ||
          "",
      );


      localStorage.setItem(
        "selectedProject",
        JSON.stringify(
          project,
        ),
      );


      localStorage.removeItem(
        "cycleId",
      );

      localStorage.removeItem(
        "cycleName",
      );


      window.dispatchEvent(
        new Event(
          "projectChanged",
        ),
      );


      navigate(
        ROUTES.CYCLE,
      );
    };


  /* ========================================
     인수인계 이동

     1. 이어서 할 일 → 전체 보기
     2. 최근 인수인계 → 내용 확인
  ======================================== */

  const handleViewHandover =
    () => {
      navigate(
        ROUTES.HANDOVER,
      );
    };


  const visibleProjects =
    projects.slice(
      0,
      3,
    );


  return (
    <div
      className={
        styles.dashboard
      }
    >
      {/* =========================
          상단
      ========================= */}

      <header
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.heroText
          }
        >
          <p
            className={
              styles.location
            }
          >
            대한민국 · 서울 · 09:14
          </p>


          <h1>
            좋은 아침이에요, 예티님 👋
          </h1>


          <p
            className={
              styles.heroDescription
            }
          >
            이어서 진행해야 할 업무가{" "}
            {todoItems.length}개 있습니다.
          </p>
        </div>


        <div
          className={
            styles.heroButtons
          }
        >
          <button
            type="button"
            className={
              styles.refreshButton
            }
            onClick={
              handleRefresh
            }
          >
            새로 고침
          </button>


          <button
            type="button"
            className={
              styles.issueButton
            }
            onClick={() =>
              navigate(
                ROUTES.CREATE_ISSUE,
              )
            }
          >
            새 이슈 등록
          </button>
        </div>
      </header>


      {/* =========================
          본문
      ========================= */}

      <div
        className={
          styles.contentGrid
        }
      >
        <main
          className={
            styles.leftColumn
          }
        >
          {/* =========================
              나의 업무 요약
          ========================= */}

          <section>
            <h2
              className={
                styles.sectionTitle
              }
            >
              나의 업무 요약
            </h2>


            <div
              className={
                styles.summaryList
              }
            >
              {summaryItems.map(
                (
                  item,
                ) => (
                  <SummaryCard
                    key={
                      item.label
                    }
                    {...item}
                  />
                ),
              )}
            </div>
          </section>


          {/* =========================
              이어서 할 일

              ★ handover NEXT_ACTION
          ========================= */}

          <section
            className={
              styles.todoSection
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <h2
                className={
                  styles.sectionTitle
                }
              >
                이어서 할 일
              </h2>


              <ArrowButton
                onClick={
                  handleViewHandover
                }
              >
                전체 보기
              </ArrowButton>
            </div>


            <div
              className={
                styles.todoList
              }
            >
              {todoItems.map(
                (
                  item,
                ) => (
                  <TodoCard
                    key={
                      item.id
                    }
                    {...item}
                  />
                ),
              )}
            </div>
          </section>


          {/* =========================
              프로젝트
          ========================= */}

          <section
            className={
              styles.projectSection
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <h2
                className={
                  styles.sectionTitle
                }
              >
                진행 중인 프로젝트
              </h2>


              <ArrowButton
                onClick={
                  handleViewAllProjects
                }
              >
                모든 프로젝트
              </ArrowButton>
            </div>


            <div
              className={
                styles.projectList
              }
            >
              {visibleProjects.map(
                (
                  project,
                ) => (
                  <div
                    key={
                      project.projectId
                    }
                    className={
                      styles.projectCardWrapper
                    }
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      handleProjectClick(
                        project,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        event.preventDefault();


                        handleProjectClick(
                          project,
                        );
                      }
                    }}
                  >
                    <ProjectCard
                      {...project}
                    />
                  </div>
                ),
              )}
            </div>
          </section>
        </main>


        {/* =========================
            최근 인수인계
        ========================= */}

        <aside
          className={
            styles.rightColumn
          }
        >
          <section>
            <h2
              className={
                styles.sectionTitle
              }
            >
              최근 인수인계
            </h2>


            <HandoverCard
              {...handover}
              onView={
                handleViewHandover
              }
            />
          </section>
        </aside>
      </div>
    </div>
  );
}


export default HomeDashboard;