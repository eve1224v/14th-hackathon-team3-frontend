import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./SystemSettingModal.module.css";

import GeneralSetting from "./tabs/GeneralSetting";
import NotificationSetting from "./tabs/NotificationSetting";
import TimeSetting from "./tabs/TimeSetting";
import AccountSetting from "./tabs/AccountSetting";

import settingIcon from "../../../assets/icons/settingIcon.svg";
import notifyIcon2 from "../../../assets/icons/notifyIcon2.svg";
import clockIcon from "../../../assets/icons/clockIcon.svg";
import profileIcon from "../../../assets/icons/profileIcon.svg";
import closeIcon from "../../../assets/icons/closeIcon.svg";

import { getWorkspaceDetail } from "../../../api/workspaceApi";

import { getMyRegion, updateMyRegion } from "../../../api/regionApi";

import { getUserLanguage, updateUserLanguage } from "../../../api/userApi";

function SystemSettingModal() {
  const navigate = useNavigate();

  /* =========================================
     현재 탭
  ========================================= */

  const [activeTab, setActiveTab] = useState("general");

  /* =========================================
     시스템 설정 Form
  ========================================= */

  const [systemForm, setSystemForm] = useState({
    workspaceName: "",
    companyName: "",
    partnerCompany: "",

    /*
      사용자 기본 언어
      UI 번역용이 아니라
      메시지 AI 번역에서 사용할 사용자 언어
    */
    language: "ko",

    /*
      업무 지역 API
    */
    region: "",

    /*
      서버에서 region에 따라 결정되는 timezone
    */
    timezone: "",
  });

  /* =========================================
     Workspace State
  ========================================= */

  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);

  const [workspaceError, setWorkspaceError] = useState("");

  /* =========================================
     Language State
  ========================================= */

  const [isLanguageLoading, setIsLanguageLoading] = useState(true);

  const [languageError, setLanguageError] = useState("");

  /* =========================================
     Region State
  ========================================= */

  const [isRegionLoading, setIsRegionLoading] = useState(true);

  const [regionError, setRegionError] = useState("");

  /* =========================================
     Save State
  ========================================= */

  const [isSaving, setIsSaving] = useState(false);

  /* =========================================
     Notification
  ========================================= */

  const [notificationSettings, setNotificationSettings] = useState({
    mention: true,
    issue: true,
    deadline: true,
    message: true,
    doNotDisturb: true,
  });

  /* =========================================
     사용자 이메일
  ========================================= */

  const userEmail = localStorage.getItem("userEmail") || "";

  /* =========================================
     워크스페이스 정보 조회
  ========================================= */

  useEffect(() => {
    const fetchWorkspace = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        setWorkspaceError("선택된 워크스페이스가 없습니다.");

        setIsWorkspaceLoading(false);

        return;
      }

      try {
        setIsWorkspaceLoading(true);

        setWorkspaceError("");

        const result = await getWorkspaceDetail(workspaceId);

        const workspace = result?.data;

        if (!workspace) {
          setWorkspaceError("워크스페이스 정보를 불러오지 못했습니다.");

          return;
        }

        const partnerNames = Array.isArray(workspace.collaboratingCompanies)
          ? workspace.collaboratingCompanies
              .map((company) => {
                if (typeof company === "string") {
                  return company;
                }

                return company?.name || "";
              })
              .filter(Boolean)
          : [];

        setSystemForm((prev) => ({
          ...prev,

          workspaceName: workspace.name || "",

          companyName: workspace.company?.name || workspace.companyName || "",

          partnerCompany: partnerNames.join(", "),
        }));
      } catch (error) {
        console.error("워크스페이스 조회 실패:", error);

        setWorkspaceError(
          error.message || "워크스페이스 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsWorkspaceLoading(false);
      }
    };

    fetchWorkspace();
  }, []);

  /* =========================================
     사용자 기본 언어 조회
  ========================================= */

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        setIsLanguageLoading(true);

        setLanguageError("");

        const result = await getUserLanguage();

        console.log("사용자 기본 언어 조회 성공:", result);

        /*
          기존 사용자처럼 language가 null일 수 있으므로
          null이면 기본값 ko 사용
        */

        const language = result?.data?.language || "ko";

        setSystemForm((prev) => ({
          ...prev,
          language,
        }));
      } catch (error) {
        console.error("사용자 기본 언어 조회 실패:", error);

        if (error.status === 401) {
          setLanguageError(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );

          return;
        }

        setLanguageError(
          error.message || "기본 언어 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsLanguageLoading(false);
      }
    };

    fetchLanguage();
  }, []);

  /* =========================================
     업무 지역 조회
  ========================================= */

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        setIsRegionLoading(true);

        setRegionError("");

        const result = await getMyRegion();

        console.log("업무 지역 조회 성공:", result);

        const data = result?.data;

        /*
          아직 설정하지 않은 사용자는

          region: null
          timezone: null

          이므로 빈 문자열로 처리
        */

        setSystemForm((prev) => ({
          ...prev,

          region: data?.region || "",

          timezone: data?.timezone || "",
        }));
      } catch (error) {
        console.error("업무 지역 조회 실패:", error);

        if (error.status === 401) {
          setRegionError(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );

          return;
        }

        setRegionError(
          error.message || "업무 지역 정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsRegionLoading(false);
      }
    };

    fetchRegion();
  }, []);

  /* =========================================
     닫기
  ========================================= */

  const handleClose = () => {
    navigate(-1);
  };

  /* =========================================
     Form
  ========================================= */

  const handleSystemFormChange = (e) => {
    const { name, value } = e.target;

    setSystemForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    /* 언어 선택 시 기존 오류 제거 */

    if (name === "language") {
      setLanguageError("");
    }

    /* 지역 선택 시 기존 오류 제거 */

    if (name === "region" || name === "timezone") {
      setRegionError("");
    }
  };

  /* =========================================
     Notification
  ========================================= */

  const handleNotificationChange = (name) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  /* =========================================
     저장
  ========================================= */

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    /* =====================================
       일반 탭 검증
    ===================================== */

    if (activeTab === "general" && !systemForm.language) {
      setLanguageError("기본 언어를 선택해주세요.");

      return;
    }

    /* =====================================
       시간 탭 검증
    ===================================== */

    if (activeTab === "time" && !systemForm.region) {
      setRegionError("업무 지역을 선택해주세요.");

      return;
    }

    try {
      setIsSaving(true);

      /* =====================================
         일반 설정 저장

         사용자 기본 언어 저장
      ===================================== */

      if (activeTab === "general") {
        const result = await updateUserLanguage(systemForm.language);

        console.log("사용자 기본 언어 저장 성공:", result);

        const changedLanguage = result?.data?.language;

        if (changedLanguage) {
          setSystemForm((prev) => ({
            ...prev,
            language: changedLanguage,
          }));
        }
      }

      /* =====================================
         국가 및 시간 저장
      ===================================== */

      if (activeTab === "time") {
        /*
          서버에는 timezone을 보내지 않고
          region만 전송
        */

        const result = await updateMyRegion(systemForm.region);

        console.log("업무 지역 저장 성공:", result);

        const data = result?.data;

        /*
          서버가 실제로 저장한 값을
          다시 화면 state에 반영
        */

        setSystemForm((prev) => ({
          ...prev,

          region: data?.region || "",

          timezone: data?.timezone || "",
        }));
      }

      /* =====================================
         알림 탭
      ===================================== */

      if (activeTab === "notification") {
        console.log("알림 설정:", notificationSettings);
      }

      /* =====================================
         저장 완료
      ===================================== */

      navigate(-1);
    } catch (error) {
      console.error("시스템 설정 저장 실패:", error);

      /* =====================================
         기본 언어 오류
      ===================================== */

      if (activeTab === "general") {
        if (error.status === 400) {
          setLanguageError(
            error.message || "선택한 기본 언어가 올바르지 않습니다.",
          );

          return;
        }

        if (error.status === 401) {
          setLanguageError(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );

          return;
        }

        setLanguageError(error.message || "기본 언어 저장에 실패했습니다.");

        return;
      }

      /* =====================================
         업무 지역 오류
      ===================================== */

      if (activeTab === "time") {
        if (error.status === 400) {
          setRegionError(
            error.message || "선택한 업무 지역이 올바르지 않습니다.",
          );

          return;
        }

        if (error.status === 401) {
          setRegionError(
            "로그인이 만료되었거나 인증 정보가 올바르지 않습니다.",
          );

          return;
        }
      }

      alert(error.message || "설정을 저장하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("accessToken");

    navigate("/");

    window.location.reload();
  };

  return (
    <div className={styles.overlay} onMouseDown={handleClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =================================
            LEFT
        ================================= */}

        <div className={styles.systemSidebar}>
          <h2>시스템 설정</h2>

          <nav className={styles.systemNavigation}>
            {/* 일반 */}

            <button
              type="button"
              className={`${styles.systemNavItem} ${
                activeTab === "general" ? styles.systemNavItemActive : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              <img src={settingIcon} alt="" className={styles.systemNavIcon} />

              <span>일반</span>
            </button>

            {/* 알림 */}

            <button
              type="button"
              className={`${styles.systemNavItem} ${
                activeTab === "notification" ? styles.systemNavItemActive : ""
              }`}
              onClick={() => setActiveTab("notification")}
            >
              <img src={notifyIcon2} alt="" className={styles.systemNavIcon} />

              <span>알림</span>
            </button>

            {/* 국가 및 시간 */}

            <button
              type="button"
              className={`${styles.systemNavItem} ${
                activeTab === "time" ? styles.systemNavItemActive : ""
              }`}
              onClick={() => setActiveTab("time")}
            >
              <img src={clockIcon} alt="" className={styles.systemNavIcon} />

              <span>국가 및 시간</span>
            </button>

            {/* 계정 */}

            <button
              type="button"
              className={`${styles.systemNavItem} ${
                activeTab === "account" ? styles.systemNavItemActive : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              <img src={profileIcon} alt="" className={styles.systemNavIcon} />

              <span>계정</span>
            </button>
          </nav>
        </div>

        {/* =================================
            RIGHT
        ================================= */}

        <div className={styles.systemContent}>
          {/* 닫기 */}

          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="닫기"
          >
            <img src={closeIcon} alt="" />
          </button>

          {/* =================================
              일반
          ================================= */}

          {activeTab === "general" && (
            <>
              <GeneralSetting
                systemForm={systemForm}
                onChange={handleSystemFormChange}
                isLoading={isWorkspaceLoading || isLanguageLoading}
                errorMessage={workspaceError}
                styles={styles}
              />

              {languageError && (
                <p className={styles.generalErrorText}>{languageError}</p>
              )}
            </>
          )}

          {/* =================================
              알림
          ================================= */}

          {activeTab === "notification" && (
            <NotificationSetting
              notificationSettings={notificationSettings}
              onChange={handleNotificationChange}
              styles={styles}
            />
          )}

          {/* =================================
              국가 및 시간
          ================================= */}

          {activeTab === "time" && (
            <TimeSetting
              systemForm={systemForm}
              onChange={handleSystemFormChange}
              isLoading={isRegionLoading}
              errorMessage={regionError}
              styles={styles}
            />
          )}

          {/* =================================
              계정
          ================================= */}

          {activeTab === "account" && (
            <AccountSetting
              userEmail={userEmail}
              onLogout={handleLogout}
              styles={styles}
            />
          )}

          {/* =================================
              하단 버튼
          ================================= */}

          {activeTab !== "account" && (
            <div className={styles.systemActions}>
              <button
                type="button"
                className={styles.systemCancelButton}
                onClick={handleClose}
                disabled={isSaving}
              >
                취소
              </button>

              <button
                type="button"
                className={styles.systemSaveButton}
                onClick={handleSave}
                disabled={
                  isSaving ||
                  (activeTab === "general" &&
                    (isWorkspaceLoading || isLanguageLoading)) ||
                  (activeTab === "time" && isRegionLoading)
                }
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SystemSettingModal;
