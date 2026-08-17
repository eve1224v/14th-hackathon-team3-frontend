import { useState } from "react";

function PasswordChangeModal({ onClose, styles }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordCheck: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordMessage("");
  };

  const handleSubmit = () => {
    const { currentPassword, newPassword, newPasswordCheck } = passwordForm;

    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordMessage("현재 비밀번호를 입력해주세요.");

      return;
    }

    if (!newPassword) {
      setPasswordMessage("새 비밀번호를 입력해주세요.");

      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("새 비밀번호는 8자 이상 입력해주세요.");

      return;
    }

    if (!newPasswordCheck) {
      setPasswordMessage("새 비밀번호 확인을 입력해주세요.");

      return;
    }

    if (newPassword !== newPasswordCheck) {
      setPasswordMessage("새 비밀번호가 일치하지 않습니다.");

      return;
    }

    /*
      TODO:
      비밀번호 변경 API 명세 확정 후 연결
    */

    console.log("비밀번호 변경:", passwordForm);

    onClose();
  };

  return (
    <div className={styles.passwordModalOverlay} onMouseDown={onClose}>
      <section
        className={styles.passwordModal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>비밀번호 변경</h2>

        <div className={styles.passwordModalForm}>
          <div className={styles.passwordModalField}>
            <label htmlFor="currentPassword">현재 비밀번호</label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className={styles.passwordModalField}>
            <label htmlFor="newPassword">새 비밀번호</label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="8자 이상, 영문+숫자 포함"
              value={passwordForm.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className={styles.passwordModalField}>
            <input
              id="newPasswordCheck"
              name="newPasswordCheck"
              type="password"
              placeholder="새 비밀번호 확인"
              value={passwordForm.newPasswordCheck}
              onChange={handleChange}
            />
          </div>

          {passwordMessage && (
            <p className={styles.passwordErrorMessage}>{passwordMessage}</p>
          )}
        </div>

        <div className={styles.passwordModalActions}>
          <button
            type="button"
            className={styles.passwordCancelButton}
            onClick={onClose}
          >
            취소
          </button>

          <button
            type="button"
            className={styles.passwordSubmitButton}
            onClick={handleSubmit}
          >
            변경
          </button>
        </div>
      </section>
    </div>
  );
}

export default PasswordChangeModal;
