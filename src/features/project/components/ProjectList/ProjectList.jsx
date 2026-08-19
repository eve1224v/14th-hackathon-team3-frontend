import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ProjectList.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import {
  getProjects,
  getProjectDetail,
  joinProject,
} from "../../../../api/projectApi";

import settingIcon from "../../../../assets/icons/settingIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

const STATUS_OPTIONS = [
  {
    value: "",
    label: "모든 프로젝트",
  },
  {
    value: "DRAFT",
    label: "초안",
  },
  {
    value: "ACTIVE",
    label: "진행 중",
  },
  {
    value: "ENDED",
    label: "종료",
  },
];

function ProjectList() {
  const navigate = useNavigate();

  /* =========================
     State
  ========================= */

  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [joiningProjectId, setJoiningProjectId] = useState(null);

  /* =========================
     프로젝트 목록 조회
     + 프로젝트 상세 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchProjects = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        if (!isCancelled) {
          setProjects([]);

          setErrorMessage("워크스페이스 정보가 없습니다.");

          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProjects({
          workspaceId,

          status: selectedStatus,

          keyword: "",
        });

        if (isCancelled) {
          return;
        }

        console.log("프로젝트 목록 조회 성공:", result);

        const projectList = Array.isArray(result?.data) ? result.data : [];

        /* =========================
           각 프로젝트 상세 조회
        ========================= */

        const projectsWithDetail = await Promise.all(
          projectList.map(async (project) => {
            try {
              const detailResult = await getProjectDetail(project.projectId);

              const detail = detailResult?.data || {};

              return {
                ...project,

                participatingCompanies: detail.participatingCompanies || [],

                teamSchedules: detail.teamSchedules || [],

                members: detail.members || [],

                objective: detail.objective || "",

                version: detail.version,

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
                `프로젝트 ${project.projectId} 상세 조회 실패:`,
                error,
              );

              return project;
            }
          }),
        );

        if (isCancelled) {
          return;
        }

        console.log("상세 정보 병합 프로젝트 목록:", projectsWithDetail);

        setProjects(projectsWithDetail);

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 목록 조회 실패:", error);

        setProjects([]);

        switch (error.code) {
          case "403WORKSPACE_ACCESS_DENIED":
            setErrorMessage("워크스페이스 접근 권한이 없습니다.");

            break;

          case "404WORKSPACE_NOT_FOUND":
            setErrorMessage("워크스페이스를 찾을 수 없습니다.");

            break;

          default:
            if (error.status === 401) {
              setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
            } else {
              setErrorMessage(
                error.message || "프로젝트 목록을 불러오지 못했습니다.",
              );
            }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    queueMicrotask(() => {
      if (!isCancelled) {
        setIsLoading(true);
      }
    });

    fetchProjects();

    return () => {
      isCancelled = true;
    };
  }, [selectedStatus, refreshKey]);

  /* =========================
     프로젝트 생성
  ========================= */

  const handleCreateProject = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  /* =========================
     새로고침
  ========================= */

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  /* =========================
     선택 프로젝트 저장
  ========================= */

  const saveSelectedProject = (project) => {
    localStorage.setItem("projectId", String(project.projectId));

    localStorage.setItem("projectName", project.name || "");

    localStorage.setItem("selectedProject", JSON.stringify(project));

    if (project.cycleId) {
      localStorage.setItem("cycleId", String(project.cycleId));
    }

    window.dispatchEvent(new Event("projectChanged"));
  };

  /* =========================
     실제 파트너사 이름
  ========================= */

  const getPartnerCompanyName = (project) => {
    if (!Array.isArray(project.participatingCompanies)) {
      return "-";
    }

    const partners = project.participatingCompanies.filter(
      (company) => company.role === "PARTNER",
    );

    if (partners.length === 0) {
      return "-";
    }

    return partners
      .map((company) => company.name || company.companyName)
      .filter(Boolean)
      .join(", ");
  };

  /* =========================
     프로젝트 설정
  ========================= */

  const handleProjectSettings = (project) => {
    saveSelectedProject(project);

    navigate(ROUTES.PROJECT_SETTINGS);
  };

  /* =========================
     카드 클릭
  ========================= */

  const handleProjectClick = (project) => {
    if (!project.cycleId) {
      alert("프로젝트 사이클 정보를 확인할 수 없습니다.");

      return;
    }

    saveSelectedProject(project);

    navigate(`/cycle/${project.cycleId}`, {
      state: {
        viewOnly: !project.joined,

        joined: Boolean(project.joined),

        projectId: project.projectId,

        cycleId: project.cycleId,
      },
    });
  };

  /* =========================
     프로젝트 참가
  ========================= */

  const handleJoinProject = async (event, project) => {
    event.stopPropagation();

    const projectId = project.projectId;

    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");

      return;
    }

    if (!project.cycleId) {
      alert("프로젝트 사이클 정보를 확인할 수 없습니다.");

      return;
    }

    if (project.joined) {
      return;
    }

    if (joiningProjectId === projectId) {
      return;
    }

    try {
      setJoiningProjectId(projectId);

      const result = await joinProject(projectId);

      console.log("프로젝트 참가 성공:", result);

      const data = result?.data;

      const joinedProject = {
        ...project,
        joined: true,
      };

      saveSelectedProject(joinedProject);

      if (data?.memberId) {
        localStorage.setItem("projectMemberId", String(data.memberId));
      }

      if (data?.role) {
        localStorage.setItem("projectRole", data.role);
      }

      if (data?.accessScope) {
        localStorage.setItem("projectAccessScope", data.accessScope);
      }

      setProjects((prev) =>
        prev.map((item) =>
          item.projectId === projectId
            ? {
                ...item,
                joined: true,
              }
            : item,
        ),
      );

      alert(result?.message || "프로젝트에 참가했습니다.");

      navigate(`/cycle/${project.cycleId}`, {
        state: {
          viewOnly: false,

          joined: true,

          projectId: data?.projectId || projectId,

          cycleId: project.cycleId,

          memberId: data?.memberId,

          role: data?.role,

          accessScope: data?.accessScope,
        },
      });
    } catch (error) {
      console.error("프로젝트 참가 실패:", error);

      switch (error.code) {
        case "401UNAUTHORIZED":
          alert("로그인이 필요합니다.");

          break;

        case "403WORKSPACE_ACCESS_DENIED":
          alert(
            "현재 워크스페이스의 활성 멤버만 프로젝트에 참가할 수 있습니다.",
          );

          break;

        case "403PROJECT_ACCESS_DENIED":
          alert("현재 사용자의 회사는 이 프로젝트의 참여 회사가 아닙니다.");

          break;

        case "404PROJECT_NOT_FOUND":
          alert("프로젝트를 찾을 수 없습니다.");

          break;

        case "404TEAM_NOT_FOUND":
          alert("사용자 회사에 배정 가능한 프로젝트 팀이 없습니다.");

          break;

        case "409ALREADY_PROJECT_MEMBER":
          alert("이미 참가한 프로젝트입니다.");

          setProjects((prev) =>
            prev.map((item) =>
              item.projectId === projectId
                ? {
                    ...item,
                    joined: true,
                  }
                : item,
            ),
          );

          break;

        default:
          if (error.status === 401) {
            alert("로그인이 필요합니다.");
          } else {
            alert(error.message || "프로젝트 참가에 실패했습니다.");
          }
      }
    } finally {
      setJoiningProjectId(null);
    }
  };

  /* =========================
     현재 선택 필터 이름
  ========================= */

  const selectedStatusLabel =
    STATUS_OPTIONS.find((option) => option.value === selectedStatus)?.label ||
    "모든 프로젝트";

  /* =========================
     필터 선택
  ========================= */

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);

    setIsStatusOpen(false);
  };

  /* =========================
     진행 중 프로젝트 수
  ========================= */

  const activeProjectCount = projects.filter(
    (project) => !project.status || project.status === "ACTIVE",
  ).length;

  return (
    <section className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>프로젝트</h1>

          <p className={styles.summary}>
            총{" "}
            {selectedStatus === "ACTIVE"
              ? projects.length
              : activeProjectCount || projects.length}
            개의 프로젝트가 진행 중입니다.
          </p>
        </div>

        <div className={styles.headerButtons}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? "새로 고침 중" : "새로 고침"}
          </button>

          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreateProject}
          >
            새 프로젝트 등록
          </button>
        </div>
      </div>

      {/* =========================
          SECTION HEADER
      ========================= */}

      <div className={styles.sectionHeader}>
        <h2>진행 중인 프로젝트</h2>

        {/* =========================
            STATUS FILTER
        ========================= */}

        <div className={styles.statusFilter}>
          <button
            type="button"
            className={`${styles.statusFilterButton} ${
              isStatusOpen ? styles.statusFilterButtonOpen : ""
            }`}
            onClick={() => setIsStatusOpen((prev) => !prev)}
          >
            <span>{selectedStatusLabel}</span>

            <img
              src={dropdownIcon}
              alt=""
              className={`${styles.statusDropdownIcon} ${
                isStatusOpen ? styles.statusDropdownIconOpen : ""
              }`}
            />
          </button>

          {isStatusOpen && (
            <div className={styles.statusMenu}>
              {STATUS_OPTIONS.map((option) => {
                const isSelected = selectedStatus === option.value;

                return (
                  <button
                    key={option.value || "ALL"}
                    type="button"
                    className={`${styles.statusOption} ${
                      isSelected ? styles.statusOptionActive : ""
                    }`}
                    onClick={() => handleStatusSelect(option.value)}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <span className={styles.statusCheck}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {isLoading && (
        <p className={styles.stateMessage}>프로젝트를 불러오는 중입니다.</p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!isLoading && errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!isLoading && !errorMessage && projects.length === 0 && (
        <p className={styles.stateMessage}>등록된 프로젝트가 없습니다.</p>
      )}

      {/* =========================
          PROJECT LIST
      ========================= */}

      {!isLoading && !errorMessage && projects.length > 0 && (
        <div className={styles.projectList}>
          {projects.map((project) => {
            const cycleText =
              project.cycleName ||
              project.currentCycleName ||
              (project.cycleNumber
                ? `Cycle ${project.cycleNumber}`
                : project.cycleId
                  ? `Cycle ${project.cycleId}`
                  : "Cycle");

            const progress =
              Number(project.progressRate ?? project.progress ?? 0) || 0;

            const partnerCompanyName = getPartnerCompanyName(project);

            const issueCount =
              project.issueCount ??
              project.totalIssueCount ??
              project.totalIssues ??
              0;

            const completedIssueCount =
              project.completedIssueCount ??
              project.completeIssueCount ??
              project.completedIssues ??
              0;

            const isJoining = joiningProjectId === project.projectId;

            return (
              <article
                key={project.projectId}
                className={styles.projectCard}
                onClick={() => handleProjectClick(project)}
              >
                {/* CARD TOP */}

                <div className={styles.cardTop}>
                  <div className={styles.projectInfo}>
                    <h3>{project.name}</h3>

                    <p className={styles.partnerText}>
                      파트너사 · {partnerCompanyName}
                    </p>
                  </div>

                  <div className={styles.cardActions}>
                    {!project.joined && (
                      <button
                        type="button"
                        className={styles.joinButton}
                        disabled={isJoining}
                        onClick={(event) => handleJoinProject(event, project)}
                      >
                        {isJoining ? "참가 중..." : "참가하기"}
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.settingButton}
                      onClick={(event) => {
                        event.stopPropagation();

                        handleProjectSettings(project);
                      }}
                      aria-label="프로젝트 설정"
                    >
                      <img src={settingIcon} alt="" />
                    </button>
                  </div>
                </div>

                {/* CYCLE */}

                <p className={styles.cycleText}>{cycleText}</p>

                {/* PROGRESS */}

                <div className={styles.progressRow}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(Math.max(progress, 0), 100)}%`,
                      }}
                    />
                  </div>

                  <span className={styles.progressText}>{progress}%</span>
                </div>

                {/* ISSUE */}

                <div className={styles.issueInfo}>
                  <span>이슈 {issueCount}</span>

                  <span className={styles.separator}>·</span>

                  <span>완료 {completedIssueCount}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProjectList;
