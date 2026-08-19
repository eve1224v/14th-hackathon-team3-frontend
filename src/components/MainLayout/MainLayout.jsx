import { useEffect, useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import MessageModal from "../MessageModal/MessageModal";

import chatIcon from "../../assets/icons/chatIcon.svg";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("accessToken"));
  });

  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");

      setIsLoggedIn(Boolean(accessToken));

      if (!accessToken) {
        setIsMessageOpen(false);
      }
    };

    window.addEventListener("authChanged", checkLoginStatus);

    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("authChanged", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.mainViewport}>
        <div className={styles.mainCanvas}>
          {children}

          {/* 로그인한 경우에만 메시지 버튼 표시 */}
          {isLoggedIn && (
            <button
              type="button"
              className={styles.chatButton}
              aria-label="메시지"
              onClick={() => setIsMessageOpen(true)}
            >
              <img src={chatIcon} alt="" />
            </button>
          )}
        </div>
      </main>

      {isLoggedIn && isMessageOpen && (
        <MessageModal onClose={() => setIsMessageOpen(false)} />
      )}
    </div>
  );
}

export default MainLayout;
