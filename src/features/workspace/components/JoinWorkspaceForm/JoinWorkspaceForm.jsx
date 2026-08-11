import { useNavigate } from "react-router-dom";

import styles from "./JoinWorkspaceForm.module.css";

import { ROUTES } from "../../../../router/routes.constant";

function JoinWorkspaceForm() {
  const navigate = useNavigate();

  const handleJoinWorkspace = () => {
    navigate(ROUTES.CREATE_PROJECT);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        워크스페이스 참여
      </h1>

      <div className={styles.topArea}>
        {/* 초대 링크 */}
        <div className={styles.inviteCard}>
          <h2>
            초대 링크로 참여
          </h2>

          <p>
            초대받은 링크를 아래에 붙여넣으세요.
            링크는 초대한 관리자에게 받을 수 있습니다.
          </p>

          <label htmlFor="inviteLink">
            초대 링크 붙여넣기
            (예: https://relai.app/invite/...)
          </label>

          <input
            id="inviteLink"
            type="text"
          />

          <button
            type="button"
            className={styles.checkButton}
          >
            링크 확인
          </button>
        </div>

        {/* 참여 전 안내 */}
        <div className={styles.guideCard}>
          <h2>
            참여 전 확인하세요
          </h2>

          <ul>
            <li>
              기본 프로필 정보는 참여 후 설정에서
              언제든 수정할 수 있습니다.
            </li>

            <li>
              초대 링크가 만료되었거나 오류가 발생했다면,
              초대한 담당자에게 문의하세요.
            </li>
          </ul>
        </div>
      </div>

      {/* 기본 프로필 */}
      <div className={styles.profileCard}>
        <h2>
          기본 프로필 연결
        </h2>

        <p>
          워크스페이스에서 사용할 이름과 소속 정보를 입력해 주세요.
        </p>

        <div className={styles.field}>
          <label htmlFor="name">
            이름
          </label>

          <input
            id="name"
            type="text"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="company">
            소속 기업
          </label>

          <input
            id="company"
            type="text"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="team">
            팀
          </label>

          <input
            id="team"
            type="text"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="position">
            직책
          </label>

          <input
            id="position"
            type="text"
          />
        </div>
      </div>

      {/* 참여 */}
      <button
        type="button"
        className={styles.joinButton}
        onClick={handleJoinWorkspace}
      >
        워크스페이스 참여
      </button>
    </section>
  );
}

export default JoinWorkspaceForm;