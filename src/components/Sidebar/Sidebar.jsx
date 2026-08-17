import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./Sidebar.module.css";

import homeIcon from "../../assets/icons/homeIcon.svg";
import cycleIcon from "../../assets/icons/cycleIcon.svg";
import issueIcon from "../../assets/icons/issueIcon.svg";
import projectIcon from "../../assets/icons/projectIcon.svg";
import logoIcon from "../../assets/icons/logo.svg";

import notifyIcon from "../../assets/icons/notifyIcon.svg";
import notifyIcon2 from "../../assets/icons/notifyIcon2.svg";
import moonIcon from "../../assets/icons/moonIcon.svg";
import profileIcon from "../../assets/icons/profileIcon.svg";

import settingIcon from "../../assets/icons/settingIcon.svg";
import logoutIcon from "../../assets/icons/logoutIcon.svg";
import dropdownIcon from "../../assets/icons/dropdownIcon.svg";

import { ROUTES } from "../../router/routes.constant";

import { getWorkspaces } from "../../api/workspaceApi";

import { getActivityStatus, updateActivityStatus } from "../../api/userApi";

import { logout } from "../../api/authApi";

function Sidebar() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  /* ========================================
     사용자 정보
  ======================================== */

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "사용자",
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "",
  );

  const [userCompany, setUserCompany] = useState(
    localStorage.getItem("userCompany") || "",
  );

  /* ========================================
     Workspace
  ======================================== */

  const [workspaces, setWorkspaces] = useState([]);

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);

  const [workspaceError, setWorkspaceError] = useState("");

  /* ========================================
     활동 상태

     true  = ACTIVE
     false = OFF
  ======================================== */

  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem("activityStatus") === "ACTIVE";
  });

  const [isActivityUpdating, setIsActivityUpdating] = useState(false);

  /* ========================================
     로그아웃 상태
  ======================================== */

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* ========================================
     Profile
  ======================================== */

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* ========================================
     시간
  ======================================== */

  const getTime = (timeZone) => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,

      hour: "2-digit",

      minute: "2-digit",

      hour12: false,
    }).format(new Date());
  };

  const [seoulTime, setSeoulTime] = useState(getTime("Asia/Seoul"));

  const [londonTime, setLondonTime] = useState(getTime("Europe/London"));

  /* ========================================
     시간 업데이트
  ======================================== */

  useEffect(() => {
    const updateTime = () => {
      setSeoulTime(getTime("Asia/Seoul"));

      setLondonTime(getTime("Europe/London"));
    };

    updateTime();

    const timer = setInterval(updateTime, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* ========================================
     워크스페이스 목록 조회
     + 활동 상태 조회
  ======================================== */

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchWorkspaces = async () => {
      try {
        setIsWorkspaceLoading(true);

        setWorkspaceError("");

        const result = await getWorkspaces("ACTIVE");

        const workspaceList = Array.isArray(result?.data) ? result.data : [];

        setWorkspaces(workspaceList);

        if (workspaceList.length === 0) {
          setSelectedWorkspace(null);

          localStorage.removeItem("workspaceId");

          localStorage.removeItem("workspaceName");

          localStorage.removeItem("workspaceCompanyName");

          localStorage.removeItem("selectedWorkspace");

          return;
        }

        const savedWorkspaceId = localStorage.getItem("workspaceId");

        let workspaceToSelect = null;

        if (savedWorkspaceId) {
          workspaceToSelect = workspaceList.find(
            (workspace) =>
              String(workspace.workspaceId) === String(savedWorkspaceId),
          );
        }

        if (!workspaceToSelect) {
          workspaceToSelect = workspaceList[0];
        }

        setSelectedWorkspace(workspaceToSelect);

        localStorage.setItem(
          "workspaceId",
          String(workspaceToSelect.workspaceId),
        );

        localStorage.setItem("workspaceName", workspaceToSelect.name);

        localStorage.setItem(
          "workspaceCompanyName",
          workspaceToSelect.companyName || "",
        );

        localStorage.setItem(
          "selectedWorkspace",
          JSON.stringify(workspaceToSelect),
        );

        window.dispatchEvent(new Event("workspaceChanged"));
      } catch (error) {
        console.error("워크스페이스 목록 조회 실패:", error);

        if (error.status === 401) {
          setWorkspaceError(t("sidebar.loginExpired"));

          return;
        }

        setWorkspaceError(error.message || t("sidebar.workspaceLoadError"));
      } finally {
        setIsWorkspaceLoading(false);
      }
    };

    const fetchActivityStatus = async () => {
      try {
        const result = await getActivityStatus();

        const status = result?.data?.status;

        const active = status === "ACTIVE";

        setIsActive(active);

        if (status) {
          localStorage.setItem("activityStatus", status);
        }
      } catch (error) {
        console.error("활동 상태 조회 실패:", error);
      }
    };

    fetchWorkspaces();

    fetchActivityStatus();

    window.addEventListener("workspaceCreated", fetchWorkspaces);

    return () => {
      window.removeEventListener("workspaceCreated", fetchWorkspaces);
    };
  }, [isLoggedIn, t]);

  /* ========================================
     Workspace 선택
  ======================================== */

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);

    setIsWorkspaceOpen(false);

    localStorage.setItem("workspaceId", String(workspace.workspaceId));

    localStorage.setItem("workspaceName", workspace.name);

    localStorage.setItem("workspaceCompanyName", workspace.companyName || "");

    localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));

    window.dispatchEvent(new Event("workspaceChanged"));
  };

  /* ========================================
     사용자 정보 업데이트
  ======================================== */

  useEffect(() => {
    const updateUserInfo = () => {
      const savedName = localStorage.getItem("userName");

      const savedEmail = localStorage.getItem("userEmail");

      const savedCompany = localStorage.getItem("userCompany");

      setUserName(savedName || "사용자");

      setUserEmail(savedEmail || "");

      setUserCompany(savedCompany || "");
    };

    window.addEventListener("userInfoUpdated", updateUserInfo);

    window.addEventListener("storage", updateUserInfo);

    return () => {
      window.removeEventListener("userInfoUpdated", updateUserInfo);

      window.removeEventListener("storage", updateUserInfo);
    };
  }, []);

  /* ========================================
     활동 상태 변경

     ON  → ACTIVE
     OFF → OFF
  ======================================== */

  const handleActivityToggle = async (e) => {
    const checked = e.target.checked;

    const newStatus = checked ? "ACTIVE" : "OFF";

    try {
      setIsActivityUpdating(true);

      const result = await updateActivityStatus(newStatus);

      console.log("활동 상태 변경 성공:", result);

      const responseStatus = result?.data?.status || newStatus;

      const newIsActive = responseStatus === "ACTIVE";

      setIsActive(newIsActive);

      localStorage.setItem("activityStatus", responseStatus);
    } catch (error) {
      console.error("활동 상태 변경 실패:", error);

      if (error.status === 401) {
        alert(t("sidebar.loginExpiredAgain"));
      } else {
        alert(error.message || t("sidebar.activityUpdateError"));
      }
    } finally {
      setIsActivityUpdating(false);
    }
  };

  /* ========================================
     로그아웃

     1. 서버 로그아웃 API 호출
     2. 서버에서 activityStatus = OFF
     3. 성공 후 localStorage 정리
  ======================================== */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      const result = await logout();

      console.log("로그아웃 성공:", result);

      setIsActive(false);
    } catch (error) {
      console.error("로그아웃 API 실패:", error);

      if (error.status !== 401) {
        alert(error.message || t("sidebar.logoutError"));

        return;
      }
    } finally {
      localStorage.removeItem("isLoggedIn");

      localStorage.removeItem("accessToken");

      localStorage.removeItem("workspaceId");

      localStorage.removeItem("workspaceName");

      localStorage.removeItem("workspaceCompanyName");

      localStorage.removeItem("selectedWorkspace");

      localStorage.removeItem("workspaceCompany");

      localStorage.removeItem("workspaceCollaboratingCompanies");

      localStorage.removeItem("workspaceInviteUrl");

      localStorage.removeItem("projectId");

      localStorage.removeItem("projectName");

      localStorage.removeItem("selectedProject");

      localStorage.removeItem("activityStatus");

      navigate("/");

      window.location.reload();
    }
  };

  /* ========================================
     Profile
  ======================================== */

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  /* ========================================
     프로필 설정
  ======================================== */

  const handleProfileSettingOpen = () => {
    setIsProfileOpen(false);

    if (!selectedWorkspace) {
      console.error(t("sidebar.noSelectedWorkspace"));

      return;
    }

    navigate(ROUTES.PROFILE_SETTINGS);
  };

  /* ========================================
     시스템 설정
  ======================================== */

  const handleSystemSettingOpen = () => {
    setIsProfileOpen(false);

    navigate(ROUTES.SYSTEM_SETTINGS);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <img className={styles.logo} src={logoIcon} alt="RelAi" />
      </div>

      <div className={styles.sidebarContent}>
        {isLoggedIn ? (
          <>
            <div className={styles.userArea}>
              <p className={styles.greeting}>
                {t("sidebar.greeting", {
                  name: userName,
                })}
              </p>
            </div>

            <div className={styles.workspaceDropdown}>
              <button
                type="button"
                className={styles.workspaceButton}
                disabled={isWorkspaceLoading || workspaces.length === 0}
                onClick={() => setIsWorkspaceOpen((prev) => !prev)}
              >
                <span>
                  {isWorkspaceLoading
                    ? t("common.loading")
                    : selectedWorkspace
                      ? selectedWorkspace.name
                      : t("sidebar.noWorkspace")}
                </span>

                {workspaces.length > 0 && (
                  <img
                    src={dropdownIcon}
                    alt=""
                    className={`${styles.workspaceDropdownIcon} ${
                      isWorkspaceOpen ? styles.workspaceDropdownIconOpen : ""
                    }`}
                  />
                )}
              </button>

              {workspaceError && (
                <p className={styles.workspaceError}>{workspaceError}</p>
              )}

              {isWorkspaceOpen && workspaces.length > 1 && (
                <div className={styles.workspaceMenu}>
                  {workspaces
                    .filter(
                      (workspace) =>
                        workspace.workspaceId !==
                        selectedWorkspace?.workspaceId,
                    )
                    .map((workspace) => (
                      <button
                        key={workspace.workspaceId}
                        type="button"
                        className={styles.workspaceOption}
                        onClick={() => handleWorkspaceSelect(workspace)}
                      >
                        {workspace.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className={styles.loginText}>{t("sidebar.loginRequired")}</p>
        )}

        <nav className={styles.menu}>
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <img src={homeIcon} alt="" />

            <span>{t("sidebar.home")}</span>
          </button>

          <button
            type="button"
            className={styles.menuItem}
            onClick={() => navigate(ROUTES.CYCLE)}
          >
            <img src={cycleIcon} alt="" />

            <span>{t("sidebar.cycle")}</span>
          </button>

          <button type="button" className={styles.menuItem}>
            <img src={issueIcon} alt="" />

            <span>{t("sidebar.issue")}</span>
          </button>

          <button
            type="button"
            className={styles.menuItem}
            onClick={() => navigate(ROUTES.PROJECT_HOME)}
          >
            <img src={projectIcon} alt="" />

            <span>{t("sidebar.project")}</span>
          </button>
        </nav>

        <div className={styles.actionMenu}>
          <button type="button">{t("sidebar.createIssue")}</button>

          <button type="button" onClick={() => navigate(ROUTES.CREATE_PROJECT)}>
            {t("sidebar.createProject")}
          </button>
        </div>

        <div className={styles.timeSection}>
          <div>
            <p>{t("sidebar.seoul")}</p>

            <strong>{seoulTime}</strong>
          </div>

          <div>
            <p>{t("sidebar.london")}</p>

            <strong>{londonTime}</strong>
          </div>
        </div>

        {isLoggedIn && (
          <div className={styles.bottomMenu}>
            <button
              type="button"
              className={styles.bottomButton}
              aria-label={
                isActive ? t("sidebar.active") : t("sidebar.doNotDisturb")
              }
              title={isActive ? t("sidebar.active") : t("sidebar.doNotDisturb")}
            >
              <img src={isActive ? notifyIcon : notifyIcon2} alt="" />
            </button>

            <div className={styles.notifyRow}>
              <button
                type="button"
                className={styles.bottomButton}
                aria-label={t("sidebar.activityStatus")}
              >
                <img src={moonIcon} alt="" />
              </button>

              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={isActive}
                  disabled={isActivityUpdating}
                  onChange={handleActivityToggle}
                  aria-label={
                    isActive ? t("sidebar.active") : t("sidebar.doNotDisturb")
                  }
                />

                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.profileWrapper}>
              <button
                type="button"
                className={styles.bottomButton}
                aria-label={t("sidebar.profile")}
                onClick={handleProfileClick}
              >
                <img src={profileIcon} alt="" />
              </button>

              {isProfileOpen && (
                <div className={styles.profilePopup}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileImage}>
                      <img src={profileIcon} alt={t("sidebar.profile")} />
                    </div>

                    <div className={styles.profileText}>
                      <strong>{userName}</strong>

                      {userEmail && <span>{userEmail}</span>}

                      {userCompany && <span>{userCompany}</span>}
                    </div>
                  </div>

                  <div className={styles.accountSection}>
                    <p className={styles.accountTitle}>
                      {t("sidebar.myAccountSettings")}
                    </p>

                    <button
                      type="button"
                      className={styles.profileMenuItem}
                      onClick={handleProfileSettingOpen}
                    >
                      <img src={profileIcon} alt="" />

                      <span>{t("sidebar.profileSettings")}</span>
                    </button>

                    <button
                      type="button"
                      className={styles.profileMenuItem}
                      onClick={handleSystemSettingOpen}
                    >
                      <img src={settingIcon} alt="" />

                      <span>{t("sidebar.systemSettings")}</span>
                    </button>
                  </div>

                  <div className={styles.profileDivider} />

                  <button
                    type="button"
                    className={styles.profileLogoutButton}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <img src={logoutIcon} alt="" />

                    <span>
                      {isLoggingOut
                        ? t("sidebar.loggingOut")
                        : t("sidebar.logout")}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
