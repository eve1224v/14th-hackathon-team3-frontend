import Sidebar from "../../../../components/Sidebar/Sidebar";
import MainHero from "../../components/MainHero/MainHero";

import styles from "./MainPage.module.css";

function MainPage() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.mainContent}>
        <div className={styles.glowSmall} />
        <div className={styles.glowLarge} />

        <MainHero />
      </main>
    </div>
  );
}

export default MainPage;