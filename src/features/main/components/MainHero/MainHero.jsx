import styles from "./MainHero.module.css";

function MainHero() {
  return (
    <section className={styles.hero}>

      <h2 className={styles.title}>
        글로벌 협업, 끊김 없이 이어가보세요
      </h2>

      <p className={styles.description}>
        언어와 시간대를 넘어 인수인계·소통·프로젝트 관리를 하나의
        워크스페이스에서 관리하세요.
      </p>

      <button className={styles.workspaceButton}>
        워크스페이스 만들기
      </button>

      <div className={styles.authArea}>
        <button>로그인</button>
        <button>회원가입</button>
      </div>
    </section>
  );
}

export default MainHero;