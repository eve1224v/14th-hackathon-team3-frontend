import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import homeIcon from "../../assets/icons/homeIcon.svg";
import cycleIcon from "../../assets/icons/cycleIcon.svg";
import issueIcon from "../../assets/icons/issueIcon.svg";
import projectIcon from "../../assets/icons/projectIcon.svg";
import logoIcon from "../../assets/icons/logo.svg";
import notifyIcon from "../../assets/icons/notifyIcon.svg";
import profileIcon from "../../assets/icons/profileIcon.svg";
import settingIcon from "../../assets/icons/settingIcon.svg";
import logoutIcon from "../../assets/icons/logoutIcon.svg";
import dropdownIcon from "../../assets/icons/dropdownIcon.svg";

import { ROUTES } from "../../router/routes.constant";

function Sidebar() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const userName = "김메리";

  /* =========================
     Workspace Dropdown
  ========================= */

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [selectedWorkspace, setSelectedWorkspace] = useState("Workspace 1");

  const workspaces = [
    "Workspace 1",
    "Workspace 2",
    "Workspace 3",
    "Workspace 4",
  ];

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setIsWorkspaceOpen(false);
  };

  /* =========================
     현재 시간
  ========================= */

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

  /* =========================
     로그아웃
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    navigate("/");

    window.location.reload();
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
        {/* =========================
            사용자 영역
        ========================= */}

        {isLoggedIn ? (
          <>
            <div className={styles.userArea}>
              <p className={styles.greeting}>
                안녕하세요, <strong>{userName}님</strong>
              </p>

              <button
                type="button"
                className={styles.logoutButton}
                aria-label="로그아웃"
                onClick={handleLogout}
              >
                <img src={logoutIcon} alt="" />
              </button>
            </div>

            {/* =========================
                Workspace Dropdown
            ========================= */}

            <div className={styles.workspaceDropdown}>
              <button
                type="button"
                className={styles.workspaceButton}
                onClick={() => setIsWorkspaceOpen((prev) => !prev)}
              >
                <span>{selectedWorkspace}</span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.workspaceDropdownIcon} ${
                    isWorkspaceOpen ? styles.workspaceDropdownIconOpen : ""
                  }`}
                />
              </button>

              {isWorkspaceOpen && (
                <div className={styles.workspaceMenu}>
                  {workspaces
                    .filter((workspace) => workspace !== selectedWorkspace)
                    .map((workspace) => (
                      <button
                        key={workspace}
                        type="button"
                        className={styles.workspaceOption}
                        onClick={() => handleWorkspaceSelect(workspace)}
                      >
                        {workspace}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className={styles.loginText}>로그인이 필요해요.</p>
        )}

        {/* =========================
            Main Menu
        ========================= */}

        <nav className={styles.menu}>
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <img src={homeIcon} alt="" />
            <span>Home</span>
          </button>

          <button type="button" className={styles.menuItem}>
            <img src={cycleIcon} alt="" />
            <span>Cycle</span>
          </button>

          <button type="button" className={styles.menuItem}>
            <img src={issueIcon} alt="" />
            <span>Issue</span>
          </button>

          <button type="button" className={styles.menuItem}>
            <img src={projectIcon} alt="" />
            <span>Project</span>
          </button>
        </nav>

        {/* =========================
            Create Menu
        ========================= */}

        <div className={styles.actionMenu}>
          {isLoggedIn ? (
            <>
              <button type="button">Create Issue</button>

              <button
                type="button"
                onClick={() => navigate(ROUTES.CREATE_PROJECT)}
              >
                Create Project
              </button>
            </>
          ) : (
            <>
              <button type="button">Create Team</button>

              <button type="button">Create Issue</button>
            </>
          )}
        </div>

        {/* =========================
            현재 시간
        ========================= */}

        <div className={styles.timeSection}>
          <div>
            <p>[KR] Seoul, Korea</p>
            <strong>{seoulTime}</strong>
          </div>

          <div>
            <p>[UK] London, United Kingdom</p>
            <strong>{londonTime}</strong>
          </div>
        </div>

        {/* =========================
            Bottom Menu
        ========================= */}

        <div className={styles.bottomMenu}>
          <div className={styles.notifyRow}>
            <button
              type="button"
              className={styles.bottomButton}
              aria-label="알림 설정"
            >
              <img src={notifyIcon} alt="" />
            </button>

            {isLoggedIn && (
              <label className={styles.toggle}>
                <input type="checkbox" aria-label="알림 켜기" />

                <span className={styles.toggleSlider} />
              </label>
            )}
          </div>

          <button
            type="button"
            className={styles.bottomButton}
            aria-label="프로필"
          >
            <img src={profileIcon} alt="" />
          </button>

          <button
            type="button"
            className={styles.bottomButton}
            aria-label="설정"
          >
            <img src={settingIcon} alt="" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
