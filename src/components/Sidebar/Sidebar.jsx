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

/* ========================================
   지역 정보
======================================== */

const REGION_INFO_MAP = {
  SEOUL: {
    name: "[KR] 서울, 대한민국",
    timezone: "Asia/Seoul",
  },

  TOKYO: {
    name: "[JP] 도쿄, 일본",
    timezone: "Asia/Tokyo",
  },

  NEW_YORK: {
    name: "[US] 뉴욕, 미국",
    timezone: "America/New_York",
  },

  LOS_ANGELES: {
    name: "[US] 로스앤젤레스, 미국",
    timezone: "America/Los_Angeles",
  },
};

function Sidebar() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  /* ========================================
     로그인 정보
  ======================================== */

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const accessToken = localStorage.getItem("accessToken");

  const isAuthenticated = isLoggedIn && Boolean(accessToken);

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
  ======================================== */

  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem("activityStatus") === "ACTIVE";
  });

  const [isActivityUpdating, setIsActivityUpdating] = useState(false);

  /* ========================================
     로그아웃
  ======================================== */

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /* ========================================
     Profile
  ======================================== */

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* ========================================
     시간 계산
  ======================================== */

  const getTime = (timeZone) => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone,

        hour: "2-digit",

        minute: "2-digit",

        hour12: false,
      }).format(new Date());
    } catch (error) {
      console.error("시간대 변환 실패:", error);

      return "--:--";
    }
  };

  /* ========================================
     서울 시간
  ======================================== */

  const [seoulTime, setSeoulTime] = useState(() => getTime("Asia/Seoul"));

  /* ========================================
     사용자 설정 지역
  ======================================== */

  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem("userRegion") || "SEOUL";
  });

  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    return localStorage.getItem("userTimezone") || "Asia/Seoul";
  });

  const selectedRegionInfo = REGION_INFO_MAP[selectedRegion] || {
    name: selectedRegion || "[KR] 서울, 대한민국",

    timezone: selectedTimezone,
  };

  const [selectedRegionTime, setSelectedRegionTime] = useState(() =>
    getTime(selectedTimezone),
  );

  /* ========================================
     시간 업데이트
  ======================================== */

  useEffect(() => {
    const updateTime = () => {
      /* 서울은 항상 고정 */

      setSeoulTime(getTime("Asia/Seoul"));

      /* 아래 시간만 설정 지역 */

      setSelectedRegionTime(getTime(selectedTimezone));
    };

    updateTime();

    const timer = setInterval(updateTime, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [selectedTimezone]);

  /* ========================================
     시스템 설정 지역 변경 감지
  ======================================== */

  useEffect(() => {
    const handleTimeZoneChanged = () => {
      const savedRegion = localStorage.getItem("userRegion") || "SEOUL";

      const savedTimezone =
        localStorage.getItem("userTimezone") || "Asia/Seoul";

      console.log("Sidebar 지역 변경:", savedRegion);

      console.log("Sidebar 시간대 변경:", savedTimezone);

      setSelectedRegion(savedRegion);

      setSelectedTimezone(savedTimezone);

      /*
          이벤트 받은 즉시
          아래 시간도 바로 변경
        */

      setSelectedRegionTime(getTime(savedTimezone));
    };

    window.addEventListener("timeZoneChanged", handleTimeZoneChanged);

    /*
      다른 탭에서 localStorage가
      변경된 경우
    */

    window.addEventListener("storage", handleTimeZoneChanged);

    return () => {
      window.removeEventListener("timeZoneChanged", handleTimeZoneChanged);

      window.removeEventListener("storage", handleTimeZoneChanged);
    };
  }, []);

  /* ========================================
     워크스페이스 / 활동 상태 조회
  ======================================== */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    /* ===============================
       워크스페이스 조회
    =============================== */

    const fetchWorkspaces = async () => {
      try {
        setIsWorkspaceLoading(true);

        setWorkspaceError("");

        const result = await getWorkspaces("ACTIVE");

        const workspaceList = Array.isArray(result?.data) ? result.data : [];

        setWorkspaces(workspaceList);

        /* ===============================
             워크스페이스 없는 경우
          =============================== */

        if (workspaceList.length === 0) {
          setSelectedWorkspace(null);

          localStorage.removeItem("workspaceId");

          localStorage.removeItem("workspaceName");

          localStorage.removeItem("workspaceCompanyName");

          localStorage.removeItem("selectedWorkspace");

          return;
        }

        /* ===============================
             기존 선택 워크스페이스
          =============================== */

        const savedWorkspaceId = localStorage.getItem("workspaceId");

        let workspaceToSelect = null;

        if (savedWorkspaceId) {
          workspaceToSelect = workspaceList.find(
            (workspace) =>
              String(workspace.workspaceId) === String(savedWorkspaceId),
          );
        }

        /* ===============================
             저장된 워크스페이스 없으면
             첫 번째 선택
          =============================== */

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

    /* ===============================
       활동 상태 조회
    =============================== */

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
  }, [isAuthenticated, t]);

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
  ======================================== */

  const handleActivityToggle = async (e) => {
    if (!isAuthenticated) {
      return;
    }

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
  ======================================== */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      if (accessToken) {
        const result = await logout();

        console.log("로그아웃 성공:", result);
      }

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

      localStorage.removeItem("userRegion");

      localStorage.removeItem("userTimezone");

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
      {/* =========================
          Logo
      ========================= */}

      <div className={styles.logoArea}>
        <img className={styles.logo} src={logoIcon} alt="RelAi" />
      </div>

      <div className={styles.sidebarContent}>
        {/* ========================================
            로그인 사용자 정보
        ======================================== */}

        {isLoggedIn ? (
          <>
            <div className={styles.userArea}>
              <p className={styles.greeting}>
                {t("sidebar.greeting", {
                  name: userName,
                })}
              </p>
            </div>

            {/* Workspace */}

            <div className={styles.workspaceDropdown}>
              <button
                type="button"
                className={styles.workspaceButton}
                disabled={
                  !isAuthenticated ||
                  isWorkspaceLoading ||
                  workspaces.length === 0
                }
                onClick={() => setIsWorkspaceOpen((prev) => !prev)}
              >
                <span>
                  {!isAuthenticated
                    ? t("sidebar.noWorkspace")
                    : isWorkspaceLoading
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

        {/* ========================================
            메뉴
        ======================================== */}

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

        {/* ========================================
            빠른 메뉴
        ======================================== */}

        <div className={styles.actionMenu}>
          <button type="button">{t("sidebar.createIssue")}</button>

          <button type="button" onClick={() => navigate(ROUTES.CREATE_PROJECT)}>
            {t("sidebar.createProject")}
          </button>
        </div>

        {/* ========================================
            시간

            위 = 서울 고정
            아래 = 시스템 설정 지역
        ======================================== */}

        <div className={styles.timeSection}>
          {/* 서울 */}

          <div>
            <p>{t("sidebar.seoul")}</p>

            <strong>{seoulTime}</strong>
          </div>

          {/* 사용자 설정 지역 */}

          <div>
            <p>{selectedRegionInfo.name}</p>

            <strong>{selectedRegionTime}</strong>
          </div>
        </div>

        {/* ========================================
            하단 메뉴
        ======================================== */}

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
                  disabled={isActivityUpdating || !isAuthenticated}
                  onChange={handleActivityToggle}
                  aria-label={
                    isActive ? t("sidebar.active") : t("sidebar.doNotDisturb")
                  }
                />

                <span className={styles.toggleSlider} />
              </label>
            </div>

            {/* ========================================
                프로필
            ======================================== */}

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
