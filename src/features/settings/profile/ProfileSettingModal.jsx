import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./ProfileSettingModal.module.css";

import profileimgIcon from "../../../assets/icons/profileimgIcon.svg";
import closeIcon from "../../../assets/icons/closeIcon.svg";

import { getMyProfile, updateMyProfile } from "../../../api/profileApi";

function ProfileSettingModal() {
  const navigate = useNavigate();

  /* =========================================
     Form
  ========================================= */

  const [profileForm, setProfileForm] = useState({
    name: "",
    company: "",
    department: "",
    position: "",
  });

  /* =========================================
     State
  ========================================= */

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================
     내 프로필 조회
  ========================================= */

  useEffect(() => {
    const fetchProfile = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        setErrorMessage("선택된 워크스페이스가 없습니다.");

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);

        setErrorMessage("");

        const result = await getMyProfile(workspaceId);

        console.log("내 프로필 조회 성공:", result);

        const profile = result?.data;

        if (!profile) {
          setErrorMessage("프로필 정보가 없습니다.");

          return;
        }

        /* =========================================
           API → 화면 데이터
        ========================================= */

        setProfileForm({
          name: profile.name || "",

          company: profile.companyName || "",

          department: profile.teamName || "",

          position: profile.jobTitle || "",
        });

        /* =========================================
           Sidebar 사용자 정보 저장
        ========================================= */

        localStorage.setItem("userName", profile.name || "");

        localStorage.setItem("userCompany", profile.companyName || "");

        localStorage.setItem("userTeam", profile.teamName || "");

        localStorage.setItem("userJobTitle", profile.jobTitle || "");

        if (profile.workspaceId) {
          localStorage.setItem("workspaceId", String(profile.workspaceId));
        }

        window.dispatchEvent(new Event("userInfoUpdated"));
      } catch (error) {
        console.error("내 프로필 조회 실패:", error);

        if (error.status === 401) {
          setErrorMessage(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );

          return;
        }

        if (error.status === 403) {
          setErrorMessage("해당 워크스페이스에 접근할 권한이 없습니다.");

          return;
        }

        if (error.status === 404) {
          setErrorMessage("프로필 정보를 찾을 수 없습니다.");

          return;
        }

        setErrorMessage(error.message || "프로필 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================================
     닫기
  ========================================= */

  const handleClose = () => {
    navigate(-1);
  };

  /* =========================================
     입력값 변경
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,

      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  /* =========================================
     저장
  ========================================= */

  const handleSave = async () => {
    const workspaceId = localStorage.getItem("workspaceId");

    setErrorMessage("");
    setSuccessMessage("");

    /* =========================================
       workspaceId 확인
    ========================================= */

    if (!workspaceId) {
      setErrorMessage("선택된 워크스페이스가 없습니다.");

      return;
    }

    /* =========================================
       필수값 검사
    ========================================= */

    const trimmedName = profileForm.name.trim();

    const trimmedCompany = profileForm.company.trim();

    const trimmedDepartment = profileForm.department.trim();

    const trimmedPosition = profileForm.position.trim();

    if (!trimmedName) {
      setErrorMessage("이름을 입력해주세요.");

      return;
    }

    if (!trimmedCompany) {
      setErrorMessage("소속 기업을 입력해주세요.");

      return;
    }

    if (!trimmedDepartment) {
      setErrorMessage("소속 부서/팀을 입력해주세요.");

      return;
    }

    try {
      setIsSaving(true);

      /* =========================================
         프로필 수정 API
      ========================================= */

      const result = await updateMyProfile(workspaceId, {
        name: trimmedName,

        companyName: trimmedCompany,

        teamName: trimmedDepartment,

        /*
            jobTitle은 선택값이므로
            비어있어도 전송
          */
        jobTitle: trimmedPosition,
      });

      console.log("내 프로필 수정 성공:", result);

      const updatedProfile = result?.data;

      if (!updatedProfile) {
        setErrorMessage("수정된 프로필 정보를 받지 못했습니다.");

        return;
      }

      /* =========================================
         API 응답값으로 Form 다시 동기화
      ========================================= */

      setProfileForm({
        name: updatedProfile.name || "",

        company: updatedProfile.companyName || "",

        department: updatedProfile.teamName || "",

        position: updatedProfile.jobTitle || "",
      });

      /* =========================================
         Sidebar에 사용되는 사용자 정보 갱신
      ========================================= */

      localStorage.setItem("userName", updatedProfile.name || "");

      localStorage.setItem("userCompany", updatedProfile.companyName || "");

      localStorage.setItem("userTeam", updatedProfile.teamName || "");

      localStorage.setItem("userJobTitle", updatedProfile.jobTitle || "");

      if (updatedProfile.workspaceId) {
        localStorage.setItem("workspaceId", String(updatedProfile.workspaceId));
      }

      /* =========================================
         Sidebar 즉시 갱신
      ========================================= */

      window.dispatchEvent(new Event("userInfoUpdated"));

      /* =========================================
         성공 메시지
      ========================================= */

      setSuccessMessage(result?.message || "프로필이 수정되었습니다.");
    } catch (error) {
      console.error("내 프로필 수정 실패:", error);

      switch (error.status) {
        case 400:
          setErrorMessage(
            error.message || "입력한 프로필 정보를 확인해주세요.",
          );
          break;

        case 401:
          setErrorMessage(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );
          break;

        case 404:
          setErrorMessage(
            error.message ||
              "워크스페이스 또는 프로필 정보를 찾을 수 없습니다.",
          );
          break;

        default:
          setErrorMessage(error.message || "프로필 수정에 실패했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =================================
            HEADER
        ================================= */}

        <div className={styles.header}>
          <h2>프로필 설정</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="닫기"
          >
            <img src={closeIcon} alt="" />
          </button>
        </div>

        {/* =================================
            LOADING
        ================================= */}

        {isLoading && (
          <div className={styles.stateArea}>
            <p>프로필 정보를 불러오는 중입니다.</p>
          </div>
        )}

        {/* =================================
            LOAD ERROR
        ================================= */}

        {!isLoading && errorMessage && (
          <div className={styles.stateArea}>
            <p className={styles.errorMessage}>{errorMessage}</p>
          </div>
        )}

        {/* =================================
            PROFILE
        ================================= */}

        {!isLoading && (
          <div className={styles.content}>
            {/* 프로필 사진 */}

            <div className={styles.photoArea}>
              <div className={styles.photoCircle} />

              <button
                type="button"
                className={styles.photoEditButton}
                aria-label="프로필 사진 변경"
              >
                <img src={profileimgIcon} alt="" />
              </button>
            </div>

            {/* Form */}

            <div className={styles.form}>
              {/* 이름 */}

              <div className={styles.field}>
                <label htmlFor="profileName">이름</label>

                <input
                  id="profileName"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleChange}
                />
              </div>

              {/* 소속 기업 */}

              <div className={styles.field}>
                <label htmlFor="profileCompany">소속 기업</label>

                <input
                  id="profileCompany"
                  name="company"
                  type="text"
                  value={profileForm.company}
                  onChange={handleChange}
                />
              </div>

              {/* 소속 부서/팀 */}

              <div className={styles.field}>
                <label htmlFor="profileDepartment">소속 부서/팀</label>

                <input
                  id="profileDepartment"
                  name="department"
                  type="text"
                  value={profileForm.department}
                  onChange={handleChange}
                />
              </div>

              {/* 직책 */}

              <div className={styles.field}>
                <label htmlFor="profilePosition">직책</label>

                <input
                  id="profilePosition"
                  name="position"
                  type="text"
                  value={profileForm.position}
                  onChange={handleChange}
                />
              </div>

              {/* 메시지 */}

              {errorMessage && (
                <p className={styles.formErrorMessage}>{errorMessage}</p>
              )}

              {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
              )}

              {/* 버튼 */}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  취소
                </button>

                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfileSettingModal;
