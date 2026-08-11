import Sidebar from "../Sidebar/Sidebar";

import chatIcon from "../../assets/icons/chatIcon.svg";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.mainViewport}>
        <div className={styles.mainCanvas}>
          {children}

          <button type="button" className={styles.chatButton} aria-label="채팅">
            <img src={chatIcon} alt="" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
