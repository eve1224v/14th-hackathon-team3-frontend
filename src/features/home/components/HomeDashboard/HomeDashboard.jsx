import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./HomeDashboard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";

import SummaryCard from "../SummaryCard/SummaryCard";
import TodoCard from "../TodoCard/TodoCard";
import ProjectCard from "../ProjectCard/ProjectCard";
import HandoverCard from "../HandoverCard/HandoverCard";

import { ROUTES } from "../../../../router/routes.constant";

import {
  getProjects,
  getProjectDetail,
} from "../../../../api/projectApi";


/* ========================================
   나의 업무 요약
======================================== */

const summaryItems = [
  {
    label: "진행 중",
    count: 4,
    color: "#4D67FF",
  },
  {
    label: "확인 필요",
    count: 3,
    color: "#FEBC2E",
  },
  {
    label: "지연 중",
    count: 2,
    color: "#FE6057",
  },
  {
    label: "완료",
    count: 12,
    color: "#28C840",
  },
];


/* ========================================
   이어서 할 일
======================================== */

const todoItems = [
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
  {
    title: "API 요구사항 검토",
    project: "Global Payment Integration",
    manager: "김예티",
    startDate: "2026.08.03",
    endDate: "2026.08.07",
  },
];


/* ========================================
   최근 인수인계
======================================== */

const handover = {
  fromCountry: "GB",
  fromTeam: "Product Team",

  toCountry: "KR",
  toTeam: "Engineering Team",

  project: "Global Payment Integration",
  cycle: "Cycle 3",

  completed: 5,
  next: 3,
  questions: 2,
  approvals: 1,
};


/* ========================================
   파트너사 이름

   ProjectList와 동일한 방식
======================================== */

const getPartnerCompanyName = (project) => {
  if (!Array.isArray(project?.participatingCompanies)) {
    return "-";
  }

  const partners = project.participatingCompanies.filter(
    (company) => company.role === "PARTNER",
  );

  if (partners.length === 0) {
    return "-";
  }

  const names = partners
    .map((company) => company.name || company.companyName)
    .filter(Boolean);

  if (names.length === 0) {
    return "-";
  }

  return names.join(", ");
};


/* ========================================
   Cycle 표시

   ProjectList와 동일한 데이터 기준
======================================== */

const getCycleText = (project) => {
  if (project?.cycleName) {
    return project.cycleName;
  }

  if (project?.currentCycleName) {
    return project.currentCycleName;
  }

  if (project?.cycleNumber) {
    return `Cycle ${project.cycleNumber}`;
  }

  if (project?.cycleId) {
    return `Cycle ${project.cycleId}`;
  }

  return "Cycle";
};


/* ========================================
   Arrow Button
======================================== */

function ArrowButton({ children, onClick }) {
  return (
    <button
      type="button"
      className={styles.arrowButton}
      onClick={onClick}
    >
      <span>{children}</span>

      <img
        src={rightArrowIcon}
        alt=""
      />
    </button>
  );
}


function HomeDashboard() {
  const navigate = useNavigate();

  /* ========================================
     프로젝트
  ========================================= */

  const [projects, setProjects] = useState([]);

  const [isProjectLoading, setIsProjectLoading] =
    useState(true);

  const [projectError, setProjectError] =
    useState("");


  /* ========================================
     프로젝트 조회

     ProjectList와 동일하게
     목록 조회 → 상세 병합
  ========================================= */

  useEffect(() => {
    let isCancelled = false;


    const fetchProjects = async () => {
      const workspaceId =
        localStorage.getItem("workspaceId");


      if (!workspaceId) {
        if (!isCancelled) {
          setProjects([]);

          setProjectError(
            "워크스페이스 정보가 없습니다.",
          );

          setIsProjectLoading(false);
        }

        return;
      }


      try {
        setIsProjectLoading(true);

        setProjectError("");


        /* =========================
           1. 프로젝트 목록 조회

           ProjectList 기본 필터와 동일
        ========================= */

        const result = await getProjects({
          workspaceId,

          status: "",

          keyword: "",
        });


        if (isCancelled) {
          return;
        }


        console.log(
          "홈 프로젝트 목록 조회 성공:",
          result,
        );


        const projectList =
          Array.isArray(result?.data)
            ? result.data
            : [];


        /* =========================
           2. 각 프로젝트 상세 조회

           ProjectList와 동일하게 병합
        ========================= */

        const projectsWithDetail =
          await Promise.all(
            projectList.map(
              async (project) => {
                try {
                  const detailResult =
                    await getProjectDetail(
                      project.projectId,
                    );


                  const detail =
                    detailResult?.data || {};


                  return {
                    ...project,

                    participatingCompanies:
                      detail.participatingCompanies ||
                      [],

                    teamSchedules:
                      detail.teamSchedules ||
                      [],

                    members:
                      detail.members ||
                      [],

                    objective:
                      detail.objective ||
                      "",

                    version:
                      detail.version,

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
                } catch (error) {
                  console.error(
                    `홈 프로젝트 ${project.projectId} 상세 조회 실패:`,
                    error,
                  );


                  /*
                    상세 하나가 실패해도
                    프로젝트 목록 자체는 유지
                  */

                  return project;
                }
              },
            ),
          );


        if (isCancelled) {
          return;
        }


        console.log(
          "홈 상세 정보 병합 프로젝트:",
          projectsWithDetail,
        );


        /* =========================
           3. Home ProjectCard 형태 변환

           홈에는 최대 3개 표시
        ========================= */

        const homeProjects =
          projectsWithDetail
            .slice(0, 3)
            .map((project) => {
              const progress =
                Number(
                  project.progressRate ??
                    project.progress ??
                    0,
                ) || 0;


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


              const partnerCompanyName =
                getPartnerCompanyName(
                  project,
                );


              return {
                id:
                  project.projectId,

                projectId:
                  project.projectId,

                title:
                  project.name || "-",

                company:
                  `파트너사 · ${partnerCompanyName}`,

                cycle:
                  getCycleText(
                    project,
                  ),

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

                cycleId:
                  project.cycleId ??
                  null,

                rawProject:
                  project,
              };
            });


        console.log(
          "홈 프로젝트 카드 데이터:",
          homeProjects,
        );


        setProjects(homeProjects);

        setProjectError("");
      } catch (error) {
        if (isCancelled) {
          return;
        }


        console.error(
          "홈 프로젝트 목록 조회 실패:",
          error,
        );


        setProjects([]);


        switch (error.code) {
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
            if (error.status === 401) {
              setProjectError(
                "로그인이 만료되었습니다. 다시 로그인해주세요.",
              );
            } else {
              setProjectError(
                error.message ||
                  "프로젝트 목록을 불러오지 못했습니다.",
              );
            }
        }
      } finally {
        if (!isCancelled) {
          setIsProjectLoading(false);
        }
      }
    };


    fetchProjects();


    return () => {
      isCancelled = true;
    };
  }, []);


  /* ========================================
     상단 새로 고침
  ========================================= */

  const handleRefresh = () => {
    window.location.reload();
  };


  /* ========================================
     프로젝트 선택 정보 저장
  ========================================= */

  const saveSelectedProject = (
    project,
  ) => {
    const rawProject =
      project.rawProject ||
      project;


    localStorage.setItem(
      "projectId",
      String(project.projectId),
    );


    localStorage.setItem(
      "projectName",
      project.title || "",
    );


    localStorage.setItem(
      "selectedProject",
      JSON.stringify(rawProject),
    );


    if (project.cycleId) {
      localStorage.setItem(
        "cycleId",
        String(project.cycleId),
      );
    } else {
      localStorage.removeItem(
        "cycleId",
      );
    }


    /*
      이전 프로젝트에서 사용하던
      handover 정보 제거
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
      new Event("projectChanged"),
    );
  };


  /* ========================================
     프로젝트 카드 클릭

     ProjectList와 동일하게
     해당 프로젝트 Cycle로 이동
  ========================================= */

  const handleProjectClick = (
    project,
  ) => {
    console.log(
      "홈에서 선택한 프로젝트:",
      project,
    );


    if (!project.cycleId) {
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
              project.rawProject
                ?.joined,
            ),

          viewOnly:
            !project.rawProject
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
          상단 인사
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
            <strong>
              London
            </strong>{" "}
            팀이 업무를 마쳤어요.
            <br />
            이어서 진행해야 할 업무가
            3개 있습니다.
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
                (item) => (
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
              {todoItems.map(
                (
                  item,
                  index,
                ) => (
                  <TodoCard
                    key={
                      index
                    }
                    {...item}
                  />
                ),
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

              {/* 프로젝트 페이지로 이동 */}

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


            {/* Loading */}

            {isProjectLoading && (
              <p>
                프로젝트를 불러오는
                중입니다.
              </p>
            )}


            {/* Error */}

            {!isProjectLoading &&
              projectError && (
                <p>
                  {
                    projectError
                  }
                </p>
              )}


            {/* Empty */}

            {!isProjectLoading &&
              !projectError &&
              projects.length ===
                0 && (
                <p>
                  등록된 프로젝트가
                  없습니다.
                </p>
              )}


            {/* 프로젝트 카드 */}

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