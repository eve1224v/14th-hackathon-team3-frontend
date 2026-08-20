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
  getProjectDetail,
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
   기본 업무 요약
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
   날짜 표시
======================================== */

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return String(date)
    .slice(0, 10)
    .replaceAll("-", ".");
};


/* ========================================
   지연 여부
======================================== */

const isDelayedIssue = (
  issue,
) => {
  if (
    !issue?.dueDate ||
    issue.status === "DONE"
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

  return (
    dueDate <
    today
  );
};


/* ========================================
   Cycle 기간 순 정렬
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

      const endCompare =
        String(
          a.endDate || "",
        ).localeCompare(
          String(
            b.endDate || "",
          ),
        );

      if (
        endCompare !== 0
      ) {
        return endCompare;
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
   파트너사 이름

   ProjectList와 같은 방식
======================================== */

const getPartnerCompanyName = (
  project,
) => {
  if (
    !Array.isArray(
      project
        ?.participatingCompanies,
    )
  ) {
    return "-";
  }

  const partners =
    project
      .participatingCompanies
      .filter(
        (company) =>
          company.role ===
          "PARTNER",
      );

  if (
    partners.length === 0
  ) {
    return "-";
  }

  const names =
    partners
      .map(
        (company) =>
          company.name ||
          company.companyName,
      )
      .filter(Boolean);

  return (
    names.join(", ") ||
    "-"
  );
};


/* ========================================
   프로젝트 카드 Cycle
======================================== */

const getCycleText = (
  project,
) => {
  if (
    project?.cycleName
  ) {
    return project.cycleName;
  }

  if (
    project?.currentCycleName
  ) {
    return project.currentCycleName;
  }

  if (
    project?.cycleNumber
  ) {
    return `Cycle ${project.cycleNumber}`;
  }

  if (
    project?.cycleId
  ) {
    return `Cycle ${project.cycleId}`;
  }

  return "Cycle";
};


/* ========================================
   timezone → 국가 코드

   HandoverCard 국기 표시용
======================================== */

const getCountryCodeFromTimezone = (
  timezone,
) => {
  switch (timezone) {
    case "Asia/Seoul":
      return "KR";

    case "Asia/Tokyo":
      return "JP";

    case "Europe/London":
      return "GB";

    case "America/New_York":
    case "America/Los_Angeles":
    case "America/Chicago":
    case "America/Denver":
      return "US";

    default:
      return "";
  }
};


/* ========================================
   Arrow Button
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
      onClick={onClick}
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


function HomeDashboard() {
  const navigate =
    useNavigate();


  /* ========================================
     사용자
  ========================================= */

  const userName =
    localStorage.getItem(
      "userName",
    ) ||
    "사용자";


  /* ========================================
     나의 업무 요약
  ========================================= */

  const [
    summaryItems,
    setSummaryItems,
  ] = useState(
    DEFAULT_SUMMARY_ITEMS,
  );


  /* ========================================
     이어서 할 일
  ========================================= */

  const [
    todoItems,
    setTodoItems,
  ] = useState([]);


  /* ========================================
     진행 중인 프로젝트
  ========================================= */

  const [
    projects,
    setProjects,
  ] = useState([]);


  const [
    isProjectLoading,
    setIsProjectLoading,
  ] = useState(true);


  const [
    projectError,
    setProjectError,
  ] = useState("");


  /* ========================================
     최근 인수인계
  ========================================= */

  const [
    recentHandover,
    setRecentHandover,
  ] = useState(null);


  /* ========================================
     홈 데이터 전체 조회
  ========================================= */

  useEffect(() => {
    let cancelled =
      false;


    const fetchHomeData =
      async () => {
        const workspaceId =
          localStorage.getItem(
            "workspaceId",
          );


        if (!workspaceId) {
          if (
            !cancelled
          ) {
            setProjects([]);

            setSummaryItems(
              DEFAULT_SUMMARY_ITEMS,
            );

            setTodoItems([]);

            setRecentHandover(
              null,
            );

            setProjectError(
              "워크스페이스 정보가 없습니다.",
            );

            setIsProjectLoading(
              false,
            );
          }

          return;
        }


        try {
          setIsProjectLoading(
            true,
          );

          setProjectError(
            "",
          );


          /* ========================================
             1. 프로젝트 목록 조회
          ========================================= */

          const projectResponse =
            await getProjects({
              workspaceId,

              status: "",

              keyword: "",
            });


          const projectList =
            Array.isArray(
              projectResponse
                ?.data,
            )
              ? projectResponse
                  .data
              : [];


          console.log(
            "홈 프로젝트 목록 조회 성공:",
            projectResponse,
          );


          /* ========================================
             2. 프로젝트 상세 조회

             ProjectList와 같은 방식
          ========================================= */

          const projectsWithDetail =
            await Promise.all(
              projectList.map(
                async (
                  project,
                ) => {
                  try {
                    const detailResponse =
                      await getProjectDetail(
                        project.projectId,
                      );


                    const detail =
                      detailResponse
                        ?.data ||
                      {};


                    return {
                      ...project,

                      participatingCompanies:
                        detail
                          .participatingCompanies ||
                        project
                          .participatingCompanies ||
                        [],

                      teamSchedules:
                        detail
                          .teamSchedules ||
                        project
                          .teamSchedules ||
                        [],

                      members:
                        detail.members ||
                        project.members ||
                        [],

                      objective:
                        detail.objective ||
                        project.objective ||
                        "",

                      version:
                        detail.version ??
                        project.version,

                      issueCount:
                        detail.issueCount ??
                        detail.totalIssueCount ??
                        project.issueCount ??
                        project.totalIssueCount ??
                        0,

                      completedIssueCount:
                        detail.completedIssueCount ??
                        detail.completeIssueCount ??
                        project.completedIssueCount ??
                        project.completeIssueCount ??
                        0,

                      progressRate:
                        detail.progressRate ??
                        detail.progress ??
                        project.progressRate ??
                        project.progress ??
                        0,
                    };
                  } catch (
                    error
                  ) {
                    console.error(
                      `홈 프로젝트 ${project.projectId} 상세 조회 실패:`,
                      error,
                    );

                    return project;
                  }
                },
              ),
            );


          if (
            cancelled
          ) {
            return;
          }


          console.log(
            "홈 상세 정보 병합 프로젝트:",
            projectsWithDetail,
          );


          /* ========================================
             3. 홈 프로젝트 카드

             현재 연결된 방식 유지
          ========================================= */

          const projectCards =
            projectsWithDetail
              .slice(
                0,
                3,
              )
              .map(
                (
                  project,
                ) => {
                  const progress =
                    Number(
                      project.progressRate ??
                        project.progress ??
                        0,
                    ) ||
                    0;


                  const issueCount =
                    project.issueCount ??
                    project.totalIssueCount ??
                    project.totalIssues ??
                    0;


                  const completeCount =
                    project.completedIssueCount ??
                    project.completeIssueCount ??
                    project.completedIssues ??
                    0;


                  return {
                    id:
                      project.projectId,

                    projectId:
                      project.projectId,

                    title:
                      project.name ||
                      "-",

                    company:
                      `파트너사 · ${getPartnerCompanyName(
                        project,
                      )}`,

                    cycle:
                      getCycleText(
                        project,
                      ),

                    cycleId:
                      project.cycleId ??
                      null,

                    progress:
                      Math.min(
                        Math.max(
                          progress,
                          0,
                        ),
                        100,
                      ),

                    issueCount,

                    completeCount,

                    rawProject:
                      project,
                  };
                },
              );


          setProjects(
            projectCards,
          );


          console.log(
            "홈 프로젝트 카드 데이터:",
            projectCards,
          );


          /* ========================================
             4. 모든 프로젝트의 모든 Cycle 조회

             나의 업무 요약용
          ========================================= */

          const cycleMap =
            new Map();


          const projectIssues =
            await Promise.all(
              projectsWithDetail.map(
                async (
                  project,
                ) => {
                  try {
                    const cycleResponse =
                      await getCycles(
                        project.projectId,
                      );


                    const cycles =
                      Array.isArray(
                        cycleResponse
                          ?.data,
                      )
                        ? cycleResponse
                            .data
                        : [];


                    cycleMap.set(
                      String(
                        project.projectId,
                      ),
                      cycles,
                    );


                    if (
                      cycles.length ===
                      0
                    ) {
                      return [];
                    }


                    const issueResults =
                      await Promise.all(
                        cycles.map(
                          async (
                            cycle,
                          ) => {
                            try {
                              const issueResponse =
                                await getIssues(
                                  cycle.cycleId,
                                  {
                                    page:
                                      0,

                                    size:
                                      100,
                                  },
                                );


                              return Array.isArray(
                                issueResponse
                                  ?.data,
                              )
                                ? issueResponse
                                    .data
                                : [];
                            } catch (
                              error
                            ) {
                              console.error(
                                `Cycle ${cycle.cycleId} 이슈 조회 실패:`,
                                error,
                              );

                              return [];
                            }
                          },
                        ),
                      );


                    return issueResults.flat();
                  } catch (
                    error
                  ) {
                    console.error(
                      `프로젝트 ${project.projectId} 사이클 조회 실패:`,
                      error,
                    );

                    return [];
                  }
                },
              ),
            );


          const allIssues =
            projectIssues.flat();


          console.log(
            "홈 전체 이슈:",
            allIssues,
          );


          /* ========================================
             5. 나의 업무 요약 집계
          ========================================= */

          const inProgressCount =
            allIssues.filter(
              (issue) =>
                issue.status ===
                "IN_PROGRESS",
            ).length;


          const needsReviewCount =
            allIssues.filter(
              (issue) =>
                issue.status ===
                "NEEDS_REVIEW",
            ).length;


          const delayedCount =
            allIssues.filter(
              (
                issue,
              ) =>
                isDelayedIssue(
                  issue,
                ),
            ).length;


          const doneCount =
            allIssues.filter(
              (issue) =>
                issue.status ===
                "DONE",
            ).length;


          if (
            !cancelled
          ) {
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
          }


          /* ========================================
             6. 현재 인수인계 조회

             이어서 할 일 + 최근 인수인계
          ========================================= */

          const handoverId =
            localStorage.getItem(
              "handoverId",
            );


          if (
            !handoverId
          ) {
            if (
              !cancelled
            ) {
              setTodoItems([]);

              setRecentHandover(
                null,
              );
            }

            return;
          }


          try {
            const handoverResponse =
              await getHandover(
                handoverId,
              );


            console.log(
              "홈 인수인계 조회 성공:",
              handoverResponse,
            );


            const handoverData =
              handoverResponse
                ?.data;


            if (
              !handoverData
            ) {
              if (
                !cancelled
              ) {
                setTodoItems([]);

                setRecentHandover(
                  null,
                );
              }

              return;
            }


            const handoverItems =
              Array.isArray(
                handoverData.items,
              )
                ? handoverData.items
                : [];


            /* ========================================
               Handover의 프로젝트 찾기
            ========================================= */

            const handoverProjectId =
              localStorage.getItem(
                "handoverProjectId",
              ) ||
              localStorage.getItem(
                "projectId",
              );


            const handoverCycleId =
              localStorage.getItem(
                "handoverCycleId",
              ) ||
              localStorage.getItem(
                "cycleId",
              );


            let handoverProject =
              projectsWithDetail.find(
                (
                  project,
                ) =>
                  Number(
                    project.projectId,
                  ) ===
                  Number(
                    handoverProjectId,
                  ),
              ) ||
              null;


            /*
              현재 프로젝트 목록에 없을 경우
              상세 조회로 보완
            */

            if (
              !handoverProject &&
              handoverProjectId
            ) {
              try {
                const detailResponse =
                  await getProjectDetail(
                    handoverProjectId,
                  );


                handoverProject =
                  detailResponse
                    ?.data ||
                  null;
              } catch (
                error
              ) {
                console.error(
                  "홈 인수인계 프로젝트 조회 실패:",
                  error,
                );
              }
            }


            /* ========================================
               Handover Cycle N 계산
            ========================================= */

            let handoverCycles =
              cycleMap.get(
                String(
                  handoverProjectId,
                ),
              ) ||
              [];


            if (
              handoverCycles.length ===
                0 &&
              handoverProjectId
            ) {
              try {
                const cycleResponse =
                  await getCycles(
                    handoverProjectId,
                  );


                handoverCycles =
                  Array.isArray(
                    cycleResponse
                      ?.data,
                  )
                    ? cycleResponse
                        .data
                    : [];
              } catch (
                error
              ) {
                console.error(
                  "홈 인수인계 사이클 조회 실패:",
                  error,
                );
              }
            }


            const sortedCycles =
              sortCyclesByPeriod(
                handoverCycles,
              );


            const selectedCycleIndex =
              sortedCycles.findIndex(
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


            const selectedCycle =
              selectedCycleIndex >=
              0
                ? sortedCycles[
                    selectedCycleIndex
                  ]
                : null;


            const cycleLabel =
              selectedCycleIndex >=
              0
                ? `Cycle ${
                    selectedCycleIndex +
                    1
                  }`
                : "Cycle";


            /* ========================================
               7. 이어서 할 일

               NEXT_ACTION 최대 3개
            ========================================= */

            const nextActions =
              handoverItems
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
                    title:
                      item.title ||
                      "-",

                    project:
                      handoverProject
                        ?.name ||
                      localStorage.getItem(
                        "projectName",
                      ) ||
                      "-",

                    manager:
                      item.assigneeName ||
                      (
                        item.assigneeMemberId
                          ? `멤버 ${item.assigneeMemberId}`
                          : "담당자 없음"
                      ),

                    startDate:
                      formatDate(
                        item.startDate ||
                          selectedCycle
                            ?.startDate,
                      ),

                    endDate:
                      formatDate(
                        item.dueDate ||
                          item.endDate ||
                          selectedCycle
                            ?.endDate,
                      ),
                  }),
                );


            if (
              !cancelled
            ) {
              setTodoItems(
                nextActions,
              );
            }


            /* ========================================
               8. 최근 인수인계 카테고리 집계
            ========================================= */

            const completedCount =
              handoverItems.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "COMPLETED",
              ).length;


            const nextCount =
              handoverItems.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "NEXT_ACTION",
              ).length;


            const questionCount =
              handoverItems.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "QUESTION",
              ).length;


            const decisionCount =
              handoverItems.filter(
                (
                  item,
                ) =>
                  item.category ===
                  "DECISION",
              ).length;


            /* ========================================
               전달 대상 팀
            ========================================= */

            const teamSchedules =
              Array.isArray(
                handoverProject
                  ?.teamSchedules,
              )
                ? handoverProject
                    .teamSchedules
                : [];


            const targetTeam =
              teamSchedules.find(
                (
                  team,
                ) =>
                  Number(
                    team.teamId,
                  ) ===
                  Number(
                    handoverData
                      ?.delivery
                      ?.targetTeamId,
                  ),
              ) ||
              null;


            /*
              GET 응답에서 source team 정보가
              따로 없으므로 프로젝트 팀 정보 사용
            */

            const sourceTeam =
              teamSchedules.find(
                (
                  team,
                ) =>
                  Number(
                    team.teamId,
                  ) !==
                  Number(
                    targetTeam
                      ?.teamId,
                  ),
              ) ||
              teamSchedules[0] ||
              null;


            const sourceTimezone =
              sourceTeam
                ?.timezone ||
              "";


            const targetTimezone =
              targetTeam
                ?.timezone ||
              handoverData
                ?.delivery
                ?.timezone ||
              "";


            const handoverCardData = {
              fromCountry:
                getCountryCodeFromTimezone(
                  sourceTimezone,
                ),

              fromTeam:
                sourceTeam
                  ?.teamName ||
                "현재 팀",

              toCountry:
                getCountryCodeFromTimezone(
                  targetTimezone,
                ),

              toTeam:
                targetTeam
                  ?.teamName ||
                "전달 팀 미설정",

              project:
                handoverProject
                  ?.name ||
                localStorage.getItem(
                  "projectName",
                ) ||
                "-",

              cycle:
                cycleLabel,

              completed:
                completedCount,

              next:
                nextCount,

              questions:
                questionCount,

              approvals:
                decisionCount,
            };


            if (
              !cancelled
            ) {
              setRecentHandover(
                handoverCardData,
              );
            }


            console.log(
              "홈 이어서 할 일:",
              nextActions,
            );


            console.log(
              "홈 최근 인수인계:",
              handoverCardData,
            );
          } catch (
            error
          ) {
            console.error(
              "홈 인수인계 조회 실패:",
              error,
            );


            if (
              !cancelled
            ) {
              setTodoItems([]);

              setRecentHandover(
                null,
              );
            }
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

          setSummaryItems(
            DEFAULT_SUMMARY_ITEMS,
          );


          switch (
            error.code
          ) {
            case "403WORKSPACE_ACCESS_DENIED":
              setProjectError(
                "워크스페이스 접근 권한이 없습니다.",
              );

              break;


            case "404WORKSPACE_NOT_FOUND":
              setProjectError(
                "워크스페이스를 찾을 수 없습니다.",
              );

              break;


            default:
              if (
                error.status ===
                401
              ) {
                setProjectError(
                  "로그인이 만료되었습니다.",
                );
              } else {
                setProjectError(
                  error.message ||
                    "홈 정보를 불러오지 못했습니다.",
                );
              }
          }
        } finally {
          if (
            !cancelled
          ) {
            setIsProjectLoading(
              false,
            );
          }
        }
      };


    fetchHomeData();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* ========================================
     새로고침
  ========================================= */

  const handleRefresh =
    () => {
      window.location.reload();
    };


  /* ========================================
     프로젝트 선택
  ========================================= */

  const saveSelectedProject =
    (
      project,
    ) => {
      const rawProject =
        project.rawProject ||
        project;


      localStorage.setItem(
        "projectId",
        String(
          project.projectId,
        ),
      );


      localStorage.setItem(
        "projectName",
        project.title ||
          "",
      );


      localStorage.setItem(
        "selectedProject",
        JSON.stringify(
          rawProject,
        ),
      );


      if (
        project.cycleId
      ) {
        localStorage.setItem(
          "cycleId",
          String(
            project.cycleId,
          ),
        );
      } else {
        localStorage.removeItem(
          "cycleId",
        );
      }


      /*
        다른 프로젝트로 이동하면
        기존 Handover ID 제거
      */

      localStorage.removeItem(
        "handoverId",
      );

      localStorage.removeItem(
        "handoverProjectId",
      );

      localStorage.removeItem(
        "handoverCycleId",
      );


      window.dispatchEvent(
        new Event(
          "projectChanged",
        ),
      );
    };


  /* ========================================
     프로젝트 카드 클릭
  ========================================= */

  const handleProjectClick =
    (
      project,
    ) => {
      console.log(
        "홈에서 선택한 프로젝트:",
        project,
      );


      if (
        !project.cycleId
      ) {
        alert(
          "프로젝트 사이클 정보를 확인할 수 없습니다.",
        );

        return;
      }


      saveSelectedProject(
        project,
      );


      navigate(
        `/cycle/${project.cycleId}`,
        {
          state: {
            projectId:
              project.projectId,

            cycleId:
              project.cycleId,

            joined:
              Boolean(
                project
                  .rawProject
                  ?.joined,
              ),

            viewOnly:
              !project
                .rawProject
                ?.joined,
          },
        },
      );
    };


  /* ========================================
     최근 인수인계
  ========================================= */

  const handleViewHandover =
    () => {
      navigate(
        ROUTES.HANDOVER,
      );
    };


  return (
    <div
      className={
        styles.dashboard
      }
    >
      {/* ========================================
          상단
      ======================================== */}

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
            대한민국 · 서울
          </p>


          <h1>
            좋은 하루예요,{" "}
            {userName}님 👋
          </h1>


          <p
            className={
              styles.heroDescription
            }
          >
            이어서 진행해야 할
            업무가{" "}
            <strong>
              {todoItems.length}개
            </strong>{" "}
            있습니다.
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


      {/* ========================================
          본문
      ======================================== */}

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
          {/* ========================================
              나의 업무 요약
          ======================================== */}

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


          {/* ========================================
              이어서 할 일
          ======================================== */}

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
                onClick={() =>
                  navigate(
                    ROUTES.HANDOVER,
                  )
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
              {todoItems.length >
              0 ? (
                todoItems.map(
                  (
                    item,
                    index,
                  ) => (
                    <TodoCard
                      key={
                        `${item.title}-${index}`
                      }
                      {...item}
                    />
                  ),
                )
              ) : (
                <p>
                  이어서 할 일이 없습니다.
                </p>
              )}
            </div>
          </section>


          {/* ========================================
              진행 중인 프로젝트
          ======================================== */}

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
                onClick={() =>
                  navigate(
                    ROUTES.PROJECT_HOME,
                  )
                }
              >
                모든 프로젝트
              </ArrowButton>
            </div>


            {isProjectLoading && (
              <p>
                프로젝트를 불러오는
                중입니다.
              </p>
            )}


            {!isProjectLoading &&
              projectError && (
                <p>
                  {
                    projectError
                  }
                </p>
              )}


            {!isProjectLoading &&
              !projectError &&
              projects.length ===
                0 && (
                <p>
                  등록된 프로젝트가
                  없습니다.
                </p>
              )}


            {!isProjectLoading &&
              !projectError &&
              projects.length >
                0 && (
                <div
                  className={
                    styles.projectList
                  }
                >
                  {projects.map(
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
                        tabIndex={
                          0
                        }
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
                          title={
                            project.title
                          }
                          company={
                            project.company
                          }
                          cycle={
                            project.cycle
                          }
                          progress={
                            project.progress
                          }
                          issueCount={
                            project.issueCount
                          }
                          completeCount={
                            project.completeCount
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
          </section>
        </main>


        {/* ========================================
            오른쪽
        ======================================== */}

        <aside
          className={
            styles.rightColumn
          }
        >
          {/* ========================================
              최근 인수인계
          ======================================== */}

          <section>
            <h2
              className={
                styles.sectionTitle
              }
            >
              최근 인수인계
            </h2>


            {recentHandover ? (
              <HandoverCard
                {...recentHandover}
                onView={
                  handleViewHandover
                }
              />
            ) : (
              <p>
                최근 인수인계가
                없습니다.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}


export default HomeDashboard;