import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./ProjectSettings.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import { getProjectDetail, updateProject } from "../../../../api/projectApi";

function ProjectSettings() {
  const navigate = useNavigate();

  /* =========================
     프로젝트
  ========================= */

  const [project, setProject] = useState(null);

  /* =========================
     화면 상태
  ========================= */

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  /* =========================
     편집 Form
  ========================= */

  const [editName, setEditName] = useState("");

  const [editObjective, setEditObjective] = useState("");

  const [editStartDate, setEditStartDate] = useState("");

  const [editEndDate, setEditEndDate] = useState("");

  /* =========================
     프로젝트 상세 조회
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const fetchProjectDetail = async () => {
      const projectId = localStorage.getItem("projectId");

      if (!projectId) {
        if (!isCancelled) {
          setErrorMessage("프로젝트 정보가 없습니다.");

          setIsLoading(false);
        }

        return;
      }

      try {
        const result = await getProjectDetail(projectId);

        if (isCancelled) {
          return;
        }

        console.log("프로젝트 상세 조회 성공:", result);

        const data = result?.data || null;

        setProject(data);

        if (data) {
          setEditName(data.name || "");

          setEditObjective(data.objective || "");

          setEditStartDate(data.startDate || "");

          setEditEndDate(data.endDate || "");
        }

        setErrorMessage("");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("프로젝트 상세 조회 실패:", error);

        switch (error.code) {
          case "403PROJECT_ACCESS_DENIED":
            setErrorMessage("프로젝트 접근 권한이 없습니다.");

            break;

          case "404PROJECT_NOT_FOUND":
            setErrorMessage("프로젝트를 찾을 수 없습니다.");

            break;

          default:
            if (error.status === 401) {
              setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
            } else {
              setErrorMessage(
                error.message || "프로젝트 정보를 불러오지 못했습니다.",
              );
            }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProjectDetail();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     Navigation
  ========================= */

  const handleTimezoneSettings = () => {
    navigate(ROUTES.TIMEZONE_SETTINGS);
  };

  const handleMemberSettings = () => {
    navigate(ROUTES.MEMBER_SETTINGS);
  };

  const handleIntegrationSettings = () => {
    navigate(ROUTES.INTEGRATION_SETTINGS);
  };

  const handleProjectHome = () => {
    navigate(ROUTES.PROJECT_HOME);
  };

  /* =========================
     날짜 포맷
  ========================= */

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return value.replaceAll("-", ".");
  };

  /* =========================
     Timezone
  ========================= */

  const formatTimezone = (timezone) => {
    switch (timezone) {
      case "Asia/Seoul":
        return "KST";

      case "Asia/Tokyo":
        return "JST";

      case "America/New_York":
        return "EST";

      case "America/Los_Angeles":
        return "PST";

      case "Europe/London":
        return "GMT";

      default:
        return timezone || "-";
    }
  };

  /* =========================
     마지막 동기화 시간
  ========================= */

  const formatLastSyncedAt = (value) => {
    if (!value) {
      return "동기화 기록 없음";
    }

    const syncedAt = new Date(value);

    const now = new Date();

    const diffMs = now.getTime() - syncedAt.getTime();

    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    if (diffMinutes < 1) {
      return "방금 전";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return `${diffDays}일 전`;
  };

  /* =========================
     편집 시작
  ========================= */

  const handleEditOpen = () => {
    if (!project) {
      return;
    }

    setEditName(project.name || "");

    setEditObjective(project.objective || "");

    setEditStartDate(project.startDate || "");

    setEditEndDate(project.endDate || "");

    setIsEditing(true);

    setErrorMessage("");
  };

  /* =========================
     편집 취소
  ========================= */

  const handleEditCancel = () => {
    setEditName(project?.name || "");

    setEditObjective(project?.objective || "");

    setEditStartDate(project?.startDate || "");

    setEditEndDate(project?.endDate || "");

    setIsEditing(false);

    setErrorMessage("");
  };

  /* =========================
     프로젝트 수정 저장
  ========================= */

  const handleEditSave = async () => {
    if (!project) {
      return;
    }

    const projectId = localStorage.getItem("projectId");

    if (!projectId) {
      setErrorMessage("프로젝트 정보가 없습니다.");

      return;
    }

    if (!editName.trim()) {
      setErrorMessage("프로젝트명을 입력해주세요.");

      return;
    }

    if (!editObjective.trim()) {
      setErrorMessage("프로젝트 목표를 입력해주세요.");

      return;
    }

    if (!editStartDate || !editEndDate) {
      setErrorMessage("프로젝트 기간을 입력해주세요.");

      return;
    }

    if (new Date(editStartDate) > new Date(editEndDate)) {
      setErrorMessage("마감일은 시작일보다 빠를 수 없습니다.");

      return;
    }

    const participatingCompanies = (project.participatingCompanies || []).map(
      (company) => ({
        companyId: company.companyId,

        role: company.role,
      }),
    );

    try {
      setIsSaving(true);

      setErrorMessage("");

      const result = await updateProject(projectId, {
        name: editName.trim(),

        objective: editObjective.trim(),

        startDate: editStartDate,

        endDate: editEndDate,

        participatingCompanies,

        status: project.status,

        version: project.version,
      });

      console.log("프로젝트 수정 성공:", result);

      const updatedProject = {
        ...project,

        name: editName.trim(),

        objective: editObjective.trim(),

        startDate: editStartDate,

        endDate: editEndDate,

        status: result?.data?.status || project.status,

        version: result?.data?.version ?? project.version,
      };

      setProject(updatedProject);

      localStorage.setItem("projectName", updatedProject.name);

      localStorage.setItem("selectedProject", JSON.stringify(updatedProject));

      window.dispatchEvent(new Event("projectChanged"));

      setIsEditing(false);

      alert("프로젝트가 수정되었습니다.");
    } catch (error) {
      console.error("프로젝트 수정 실패:", error);

      switch (error.code) {
        case "400INVALID_PROJECT_INPUT":
          setErrorMessage("프로젝트 정보가 올바르지 않습니다.");

          break;

        case "403PROJECT_ADMIN_REQUIRED":
          setErrorMessage("프로젝트 관리 권한이 없습니다.");

          break;

        case "404PROJECT_NOT_FOUND":
          setErrorMessage("프로젝트를 찾을 수 없습니다.");

          break;

        case "409PROJECT_VERSION_CONFLICT":
          setErrorMessage(
            "다른 사용자가 먼저 프로젝트를 수정했습니다. 새로고침 후 다시 시도해주세요.",
          );

          break;

        default:
          if (error.status === 401) {
            setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            setErrorMessage(error.message || "프로젝트 수정에 실패했습니다.");
          }
      }
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     계산값
  ========================= */

  const teamCount = project?.teamSchedules?.length || 0;

  const memberCount = project?.members?.length || 0;

  const pendingCount = project?.pendingInvitations?.length || 0;

  const integrationCount =
    project?.integrations?.filter((item) => item.status === "CONNECTED")
      ?.length || 0;

  const mainTimezone = formatTimezone(project?.teamSchedules?.[0]?.timezone);

  const syncedIntegrations =
    project?.integrations?.filter((item) => item.lastSyncedAt) || [];

  const lastSyncedAt = syncedIntegrations.length
    ? [...syncedIntegrations].sort(
        (a, b) => new Date(b.lastSyncedAt) - new Date(a.lastSyncedAt),
      )[0]?.lastSyncedAt
    : null;

  /* =========================
     Loading
  ========================= */

  if (isLoading) {
    return (
      <section className={styles.container}>
        <h1 className={styles.title}>프로젝트 설정</h1>

        <p>프로젝트 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  /* =========================
     프로젝트 없음
  ========================= */

  if (!project) {
    return (
      <section className={styles.container}>
        <h1 className={styles.title}>프로젝트 설정</h1>

        <p>{errorMessage || "프로젝트 정보가 없습니다."}</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>프로젝트 설정</h1>

      {/* =========================
          프로젝트 기본 정보
      ========================= */}

      <section className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h2>프로젝트 기본 정보</h2>

          {!isEditing ? (
            <button
              type="button"
              className={styles.outlineButton}
              onClick={handleEditOpen}
            >
              편집
            </button>
          ) : (
            <div>
              <button
                type="button"
                className={styles.outlineButton}
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                취소
              </button>

              <button
                type="button"
                className={styles.outlineButton}
                onClick={handleEditSave}
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        {!isEditing ? (
          <div className={styles.infoGrid}>
            {/* LEFT */}

            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span>프로젝트명</span>

                <p>{project.name || "-"}</p>
              </div>

              <div className={styles.infoItem}>
                <span>프로젝트 기간</span>

                <p>
                  {formatDate(project.startDate)}
                  {" ~ "}
                  {formatDate(project.endDate)}
                </p>
              </div>

              <div className={styles.infoItem}>
                <span>참여 기업</span>

                <p>{project.participatingCompanies?.length || 0}개</p>
              </div>
            </div>

            {/* RIGHT */}

            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span>프로젝트 목표</span>

                <p>{project.objective || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.infoGrid}>
            {/* 편집 LEFT */}

            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span>프로젝트명</span>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className={styles.infoItem}>
                <span>시작일</span>

                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>

              <div className={styles.infoItem}>
                <span>종료일</span>

                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>

              <div className={styles.infoItem}>
                <span>참여 기업</span>

                <p>{project.participatingCompanies?.length || 0}개</p>
              </div>
            </div>

            {/* 편집 RIGHT */}

            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span>프로젝트 목표</span>

                <textarea
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================
          Error
      ========================= */}

      {errorMessage && <p>{errorMessage}</p>}

      {/* =========================
          운영 관리
      ========================= */}

      <h2 className={styles.managementTitle}>운영 관리</h2>

      {/* 근무 시간대 */}

      <section className={styles.managementCard}>
        <div>
          <strong>근무 시간대 설정</strong>

          <p>등록된 팀의 국가, 시간대, 근무 시간, 공휴일을 관리합니다.</p>
        </div>

        <div className={styles.managementMeta}>
          <span>등록된 팀 {teamCount}개</span>

          <span>{mainTimezone}</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleTimezoneSettings}
        >
          설정
        </button>
      </section>

      {/* 멤버 */}

      <section className={styles.managementCard}>
        <div>
          <strong>멤버 초대·권한 관리</strong>

          <p>팀 멤버를 초대하고, 멤버의 접근 권한을 설정합니다.</p>
        </div>

        <div className={styles.managementMeta}>
          <span>멤버 {memberCount}명</span>

          <span>초대 대기 {pendingCount}명</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleMemberSettings}
        >
          설정
        </button>
      </section>

      {/* 외부 연동 */}

      <section className={styles.managementCard}>
        <div>
          <strong>외부 서비스 연동</strong>

          <p>
            Slack, Notion, Figma 등 연동된 서비스의 수집 범위와 상태를
            관리합니다.
          </p>
        </div>

        <div className={styles.managementMeta}>
          <span>연동 중 {integrationCount}개</span>

          <span>마지막 동기화 {formatLastSyncedAt(lastSyncedAt)}</span>
        </div>

        <button
          type="button"
          className={styles.outlineButton}
          onClick={handleIntegrationSettings}
        >
          설정
        </button>
      </section>

      {/* =========================
          프로젝트 홈
      ========================= */}

      <div className={styles.finishArea}>
        <button
          type="button"
          className={styles.finishButton}
          onClick={handleProjectHome}
        >
          프로젝트 홈으로
        </button>
      </div>
    </section>
  );
}

export default ProjectSettings;
