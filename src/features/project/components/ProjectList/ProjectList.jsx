import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./ProjectList.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import { getProjects } from "../../../../api/projectApi";

import settingIcon from "../../../../assets/icons/settingIcon.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

function ProjectList() {
  const navigate = useNavigate();

  /* =========================
     State
  ========================= */

  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  /* =========================
     프로젝트 목록 조회
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

        setProjects(Array.isArray(result?.data) ? result.data : []);

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
     프로젝트 설정
  ========================= */

  const handleProjectSettings = (project) => {
    localStorage.setItem("projectId", String(project.projectId));

    localStorage.setItem("projectName", project.name);

    localStorage.setItem("selectedProject", JSON.stringify(project));

    window.dispatchEvent(new Event("projectChanged"));

    navigate(ROUTES.PROJECT_SETTINGS);
  };

  /* =========================
     카드 클릭
  ========================= */

  const handleProjectClick = (project) => {
    localStorage.setItem("projectId", String(project.projectId));

    localStorage.setItem("projectName", project.name);

    localStorage.setItem("selectedProject", JSON.stringify(project));

    window.dispatchEvent(new Event("projectChanged"));

    navigate(ROUTES.PROJECT_HOME);
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

        <div className={styles.statusFilter}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">모든 프로젝트</option>

            <option value="DRAFT">초안</option>

            <option value="ACTIVE">진행 중</option>

            <option value="ENDED">종료</option>
          </select>

          <img src={dropdownIcon} alt="" />
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
            /*
                목록 API에 값이 없는 경우
                디자인 확인용 fallback
              */

            const cycleText =
              project.cycleName ||
              (project.cycleNumber
                ? `Cycle ${project.cycleNumber}`
                : "Cycle 3");

            const progress = project.progressRate ?? project.progress ?? 78;

            return (
              <article
                key={project.projectId}
                className={styles.projectCard}
                onClick={() => handleProjectClick(project)}
              >
                {/* =========================
                      CARD TOP
                  ========================= */}

                <div className={styles.cardTop}>
                  <div className={styles.projectInfo}>
                    <h3>{project.name}</h3>

                    <p>{project.description || "프로젝트가 진행 중"}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.settingButton}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleProjectSettings(project);
                    }}
                    aria-label="프로젝트 설정"
                  >
                    <img src={settingIcon} alt="" />
                  </button>
                </div>

                {/* =========================
                      CYCLE
                  ========================= */}

                <p className={styles.cycleText}>{cycleText}</p>

                {/* =========================
                      PROGRESS
                  ========================= */}

                <div className={styles.progressRow}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(Number(progress) || 0, 100)}%`,
                      }}
                    />
                  </div>

                  <span className={styles.progressText}>{progress}%</span>
                </div>

                {/* =========================
                      CARD BOTTOM
                  ========================= */}

                <div className={styles.cardBottom}>
                  {project.participantCount !== undefined && (
                    <>
                      <span>참여 {project.participantCount}</span>

                      <span className={styles.separator}>·</span>
                    </>
                  )}

                  <span>멤버 {project.memberCount ?? 0}</span>
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
