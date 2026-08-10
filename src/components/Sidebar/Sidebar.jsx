import styles from "./Sidebar.module.css";

import homeIcon from "../../assets/icons/homeIcon.svg";
import cycleIcon from "../../assets/icons/cycleIcon.svg";
import issueIcon from "../../assets/icons/issueIcon.svg";
import projectIcon from "../../assets/icons/projectIcon.svg";
import logoIcon from "../../assets/icons/logo.svg";
import notifyIcon from "../../assets/icons/notifyIcon.svg";
import profileIcon from "../../assets/icons/profileIcon.svg";
import settingIcon from "../../assets/icons/settingIcon.svg";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <img className={styles.logo} src={logoIcon} alt="RelAi" />
      </div>

      <div className={styles.sidebarContent}>
        <p className={styles.loginText}>로그인이 필요해요.</p>

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
          <button>Create Team</button>
          <button>Create Issue</button>
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
          <button>
            <img src={notifyIcon} alt="알림 설정" />
          </button>

          <button>
            <img src={profileIcon} alt="프로필" />
          </button>

          <button>
            <img src={settingIcon} alt="설정" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
