import { useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import MessageModal from "../MessageModal/MessageModal";

import chatIcon from "../../assets/icons/chatIcon.svg";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.mainViewport}>
        <div className={styles.mainCanvas}>
          {children}

          <button
            type="button"
            className={styles.chatButton}
            aria-label="메시지"
            onClick={() => setIsMessageOpen(true)}
          >
            <img src={chatIcon} alt="" />
          </button>
        </div>
      </main>

      {isMessageOpen && (
        <MessageModal onClose={() => setIsMessageOpen(false)} />
      )}
    </div>
  );
}

export default MainLayout;
