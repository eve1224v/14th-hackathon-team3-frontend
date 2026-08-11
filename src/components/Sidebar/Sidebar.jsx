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

function Sidebar() {
  const navigate = useNavigate();

  // 임시 로그인 상태
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const userName = "김메리";

  const handleLogout = () => {
    // 로그인 상태 제거
    localStorage.removeItem("isLoggedIn");

    // 처음 화면으로 이동
    navigate("/");

    // Sidebar / MainHero가 바로 다시 렌더링되도록
    window.location.reload();
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

            <div className={styles.workspaceSelectWrapper}>
              <select
                className={styles.workspaceSelect}
                defaultValue="workspace1"
              >
                <option value="workspace1">Workspace1</option>
              </select>

              <img
                className={styles.dropdownIcon}
                src={dropdownIcon}
                alt=""
              />
            </div>
          </>
        ) : (
          <p className={styles.loginText}>로그인이 필요해요.</p>
        )}

        <nav className={styles.menu}>
          <button type="button" className={styles.menuItem}>
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

        <div className={styles.actionMenu}>
          {isLoggedIn ? (
            <>
              <button type="button">Create Issue</button>
              <button type="button">Create Project</button>
            </>
          ) : (
            <>
              <button type="button">Create Team</button>
              <button type="button">Create Issue</button>
            </>
          )}
        </div>

        <div className={styles.timeSection}>
          <div>
            <p>[KR] Seoul, Korea</p>
            <strong>13:00</strong>
          </div>

          <div>
            <p>[UK] London, United Kingdom</p>
            <strong>05:00</strong>
          </div>
        </div>

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