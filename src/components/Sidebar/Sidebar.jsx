import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import homeIcon from "../../assets/icons/homeIcon.svg";
import cycleIcon from "../../assets/icons/cycleIcon.svg";
import issueIcon from "../../assets/icons/issueIcon.svg";
import projectIcon from "../../assets/icons/projectIcon.svg";
import logoIcon from "../../assets/icons/logo.svg";

import notifyIcon from "../../assets/icons/notifyIcon.svg";
import notifyIcon2 from "../../assets/icons/notifyIcon2.svg";
import moonIcon from "../../assets/icons/moonIcon.svg";
import profileIcon from "../../assets/icons/profileIcon.svg";

import settingIcon from "../../assets/icons/settingIcon.svg";
import logoutIcon from "../../assets/icons/logoutIcon.svg";
import dropdownIcon from "../../assets/icons/dropdownIcon.svg";

import profileimgIcon from "../../assets/icons/profileimgIcon.svg";
import closeIcon from "../../assets/icons/closeIcon.svg";
import clockIcon from "../../assets/icons/clockIcon.svg";
import pencilIcon from "../../assets/icons/pencilIcon.svg";

import { ROUTES } from "../../router/routes.constant";

function Sidebar() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  /* =========================================
     사용자 정보
  ========================================= */

  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "사용자",
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "",
  );

  const userCompany = "기업 A";

  /* =========================================
     Workspace
  ========================================= */

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [selectedWorkspace, setSelectedWorkspace] = useState("Workspace 1");

  /* =========================================
     Bottom
  ========================================= */

  const [isNotificationOn, setIsNotificationOn] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* =========================================
     Modal
  ========================================= */

  const [isProfileSettingOpen, setIsProfileSettingOpen] = useState(false);

  const [isSystemSettingOpen, setIsSystemSettingOpen] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [systemSettingTab, setSystemSettingTab] = useState("general");

  /* =========================================
     Profile Form
  ========================================= */

  const [profileForm, setProfileForm] = useState({
    name: localStorage.getItem("userName") || "",
    company: "기업 A",
    department: "Product/Product Team",
    position: "Product Manager",
  });

  /* =========================================
     비밀번호 변경 Form
  ========================================= */

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordCheck: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  /* =========================================
     알림 설정
  ========================================= */

  const [notificationSettings, setNotificationSettings] = useState({
    mention: true,
    issue: true,
    deadline: true,
    message: true,
    doNotDisturb: true,
  });

  /* =========================================
     System Form
  ========================================= */

  const [systemForm, setSystemForm] = useState({
    workspaceName: "",
    companyName: "",
    partnerCompany: "",
    language: "한국어",
    country: "대한민국",
    timezone: "Asia/Seoul",
  });

  /* =========================================
     Workspace 목록
  ========================================= */

  const workspaces = [
    "Workspace 1",
    "Workspace 2",
    "Workspace 3",
    "Workspace 4",
  ];

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setIsWorkspaceOpen(false);
  };

  /* =========================================
     시간
  ========================================= */

  const getTime = (timeZone) => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  };

  const [seoulTime, setSeoulTime] = useState(getTime("Asia/Seoul"));

  const [londonTime, setLondonTime] = useState(getTime("Europe/London"));

  useEffect(() => {
    const updateTime = () => {
      setSeoulTime(getTime("Asia/Seoul"));
      setLondonTime(getTime("Europe/London"));
    };

    updateTime();

    const timer = setInterval(updateTime, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* =========================================
     사용자 정보 갱신
  ========================================= */

  useEffect(() => {
    const updateUserInfo = () => {
      const savedName = localStorage.getItem("userName");

      const savedEmail = localStorage.getItem("userEmail");

      setUserName(savedName || "사용자");
      setUserEmail(savedEmail || "");

      setProfileForm((prev) => ({
        ...prev,
        name: savedName || "",
      }));
    };

    window.addEventListener("userInfoUpdated", updateUserInfo);

    window.addEventListener("storage", updateUserInfo);

    return () => {
      window.removeEventListener("userInfoUpdated", updateUserInfo);

      window.removeEventListener("storage", updateUserInfo);
    };
  }, []);

  /* =========================================
     로그아웃
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    navigate("/");

    window.location.reload();
  };

  /* =========================================
     프로필 팝업
  ========================================= */

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  /* =========================================
     프로필 설정
  ========================================= */

  const handleProfileSettingOpen = () => {
    setIsProfileOpen(false);

    setProfileForm((prev) => ({
      ...prev,
      name: localStorage.getItem("userName") || "",
    }));

    setIsProfileSettingOpen(true);
  };

  const handleProfileSettingClose = () => {
    setIsProfileSettingOpen(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = () => {
    const trimmedName = profileForm.name.trim();

    if (!trimmedName) {
      return;
    }

    localStorage.setItem("userName", trimmedName);

    setUserName(trimmedName);

    window.dispatchEvent(new Event("userInfoUpdated"));

    setIsProfileSettingOpen(false);
  };

  /* =========================================
     시스템 설정
  ========================================= */

  const handleSystemSettingOpen = () => {
    setIsProfileOpen(false);

    setSystemSettingTab("general");

    setIsSystemSettingOpen(true);
  };

  const handleSystemSettingClose = () => {
    setIsSystemSettingOpen(false);
  };

  const handleSystemFormChange = (e) => {
    const { name, value } = e.target;

    setSystemForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (name) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSystemSave = () => {
    console.log("시스템 설정:", systemForm);

    console.log("알림 설정:", notificationSettings);

    setIsSystemSettingOpen(false);
  };

  /* =========================================
     비밀번호 변경 모달
  ========================================= */

  const handlePasswordModalOpen = () => {
    setPasswordMessage("");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      newPasswordCheck: "",
    });

    setIsPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);

    setPasswordMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = () => {
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

    console.log("비밀번호 변경:", passwordForm);

    /*
      추후 비밀번호 변경 API 연결
    */

    setIsPasswordModalOpen(false);
  };

  return (
    <>
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <img className={styles.logo} src={logoIcon} alt="RelAi" />
        </div>

        <div className={styles.sidebarContent}>
          {isLoggedIn ? (
            <>
              <div className={styles.userArea}>
                <p className={styles.greeting}>
                  안녕하세요, <strong>{userName}님</strong>
                </p>

                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  aria-label="로그아웃"
                >
                  <img src={logoutIcon} alt="" />
                </button>
              </div>

              {/* Workspace */}

              <div className={styles.workspaceDropdown}>
                <button
                  type="button"
                  className={styles.workspaceButton}
                  onClick={() => setIsWorkspaceOpen((prev) => !prev)}
                >
                  <span>{selectedWorkspace}</span>

                  <img
                    src={dropdownIcon}
                    alt=""
                    className={`${styles.workspaceDropdownIcon} ${
                      isWorkspaceOpen ? styles.workspaceDropdownIconOpen : ""
                    }`}
                  />
                </button>

                {isWorkspaceOpen && (
                  <div className={styles.workspaceMenu}>
                    {workspaces
                      .filter((workspace) => workspace !== selectedWorkspace)
                      .map((workspace) => (
                        <button
                          key={workspace}
                          type="button"
                          className={styles.workspaceOption}
                          onClick={() => handleWorkspaceSelect(workspace)}
                        >
                          {workspace}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className={styles.loginText}>로그인이 필요해요.</p>
          )}

          {/* =========================================
              MENU
          ========================================= */}

          <nav className={styles.menu}>
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              <img src={homeIcon} alt="" />
              <span>Home</span>
            </button>

            <button
              type="button"
              className={styles.menuItem}
              onClick={() => navigate(ROUTES.CYCLE)}
            >
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

          {/* =========================================
              CREATE
          ========================================= */}

          <div className={styles.actionMenu}>
            {isLoggedIn ? (
              <>
                <button type="button">Create Issue</button>

                <button
                  type="button"
                  onClick={() => navigate(ROUTES.CREATE_PROJECT)}
                >
                  Create Project
                </button>
              </>
            ) : (
              <>
                <button type="button">Create Issue</button>

                <button type="button">Create Project</button>
              </>
            )}
          </div>

          {/* =========================================
              TIME
          ========================================= */}

          <div className={styles.timeSection}>
            <div>
              <p>[KR] Seoul, Korea</p>

              <strong>{seoulTime}</strong>
            </div>

            <div>
              <p>[UK] London, United Kingdom</p>

              <strong>{londonTime}</strong>
            </div>
          </div>

          {/* =========================================
              BOTTOM
          ========================================= */}

          {isLoggedIn && (
            <div className={styles.bottomMenu}>
              <button
                type="button"
                className={styles.bottomButton}
                aria-label="알림"
              >
                <img src={isNotificationOn ? notifyIcon : notifyIcon2} alt="" />
              </button>

              <div className={styles.notifyRow}>
                <button
                  type="button"
                  className={styles.bottomButton}
                  aria-label="다크모드"
                >
                  <img src={moonIcon} alt="" />
                </button>

                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={isNotificationOn}
                    onChange={(e) => setIsNotificationOn(e.target.checked)}
                  />

                  <span className={styles.toggleSlider} />
                </label>
              </div>

              {/* PROFILE */}

              <div className={styles.profileWrapper}>
                <button
                  type="button"
                  className={styles.bottomButton}
                  aria-label="프로필"
                  onClick={handleProfileClick}
                >
                  <img src={profileIcon} alt="" />
                </button>

                {isProfileOpen && (
                  <div className={styles.profilePopup}>
                    <div className={styles.profileInfo}>
                      <div className={styles.profileImage}>
                        <img src={profileIcon} alt="프로필" />
                      </div>

                      <div className={styles.profileText}>
                        <strong>{userName}</strong>

                        <span>{userEmail}</span>

                        <span>{userCompany}</span>
                      </div>
                    </div>

                    <div className={styles.accountSection}>
                      <p className={styles.accountTitle}>내 계정 설정</p>

                      <button
                        type="button"
                        className={styles.profileMenuItem}
                        onClick={handleProfileSettingOpen}
                      >
                        <img src={profileIcon} alt="" />

                        <span>프로필 설정</span>
                      </button>

                      <button
                        type="button"
                        className={styles.profileMenuItem}
                        onClick={handleSystemSettingOpen}
                      >
                        <img src={settingIcon} alt="" />

                        <span>시스템 설정</span>
                      </button>
                    </div>

                    <div className={styles.profileDivider} />

                    <button
                      type="button"
                      className={styles.profileLogoutButton}
                      onClick={handleLogout}
                    >
                      <img src={logoutIcon} alt="" />

                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================
          PROFILE MODAL
      ========================================= */}

      {isProfileSettingOpen && (
        <div
          className={styles.profileModalOverlay}
          onMouseDown={handleProfileSettingClose}
        >
          <section
            className={styles.profileModal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.profileModalHeader}>
              <h2>프로필 설정</h2>

              <button
                type="button"
                className={styles.profileModalClose}
                onClick={handleProfileSettingClose}
              >
                <img src={closeIcon} alt="닫기" />
              </button>
            </div>

            <div className={styles.profileModalContent}>
              <div className={styles.profilePhotoArea}>
                <div className={styles.profilePhotoCircle} />

                <button type="button" className={styles.profilePhotoEditButton}>
                  <img src={profileimgIcon} alt="" />
                </button>
              </div>

              <div className={styles.profileForm}>
                <div className={styles.profileField}>
                  <label htmlFor="profileName">이름</label>

                  <input
                    id="profileName"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className={styles.profileField}>
                  <label htmlFor="profileCompany">소속 기업</label>

                  <input
                    id="profileCompany"
                    name="company"
                    value={profileForm.company}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className={styles.profileField}>
                  <label htmlFor="profileDepartment">소속 부서/팀</label>

                  <input
                    id="profileDepartment"
                    name="department"
                    value={profileForm.department}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className={styles.profileField}>
                  <label htmlFor="profilePosition">직책</label>

                  <input
                    id="profilePosition"
                    name="position"
                    value={profileForm.position}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className={styles.profileModalActions}>
                  <button
                    type="button"
                    className={styles.profileCancelButton}
                    onClick={handleProfileSettingClose}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    className={styles.profileSaveButton}
                    onClick={handleProfileSave}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================
          SYSTEM MODAL
      ========================================= */}

      {isSystemSettingOpen && (
        <div
          className={styles.systemModalOverlay}
          onMouseDown={handleSystemSettingClose}
        >
          <section
            className={styles.systemModal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* 왼쪽 */}

            <div className={styles.systemSidebar}>
              <h2>시스템 설정</h2>

              <nav className={styles.systemNavigation}>
                <button
                  type="button"
                  className={`${styles.systemNavItem} ${
                    systemSettingTab === "general"
                      ? styles.systemNavItemActive
                      : ""
                  }`}
                  onClick={() => setSystemSettingTab("general")}
                >
                  <img
                    src={settingIcon}
                    alt=""
                    className={styles.systemNavIcon}
                  />

                  <span>일반</span>
                </button>

                <button
                  type="button"
                  className={`${styles.systemNavItem} ${
                    systemSettingTab === "notification"
                      ? styles.systemNavItemActive
                      : ""
                  }`}
                  onClick={() => setSystemSettingTab("notification")}
                >
                  <img
                    src={notifyIcon2}
                    alt=""
                    className={styles.systemNavIcon}
                  />

                  <span>알림</span>
                </button>

                <button
                  type="button"
                  className={`${styles.systemNavItem} ${
                    systemSettingTab === "time"
                      ? styles.systemNavItemActive
                      : ""
                  }`}
                  onClick={() => setSystemSettingTab("time")}
                >
                  <img
                    src={clockIcon}
                    alt=""
                    className={styles.systemNavIcon}
                  />

                  <span>국가 및 시간</span>
                </button>

                <button
                  type="button"
                  className={`${styles.systemNavItem} ${
                    systemSettingTab === "account"
                      ? styles.systemNavItemActive
                      : ""
                  }`}
                  onClick={() => setSystemSettingTab("account")}
                >
                  <img
                    src={profileIcon}
                    alt=""
                    className={styles.systemNavIcon}
                  />

                  <span>계정</span>
                </button>
              </nav>
            </div>

            {/* 오른쪽 */}

            <div className={styles.systemContent}>
              <button
                type="button"
                className={styles.systemCloseButton}
                onClick={handleSystemSettingClose}
              >
                <img src={closeIcon} alt="닫기" />
              </button>

              {/* 일반 */}

              {systemSettingTab === "general" && (
                <div className={styles.systemPage}>
                  <h3>일반</h3>

                  <h4>워크스페이스 정보</h4>

                  <div className={styles.systemGroup}>
                    <div className={styles.systemRow}>
                      <div>
                        <strong>워크스페이스 이름</strong>

                        <p>워크스페이스 이름을 설정합니다.</p>
                      </div>

                      <input
                        name="workspaceName"
                        value={systemForm.workspaceName}
                        onChange={handleSystemFormChange}
                      />
                    </div>

                    <div className={styles.systemRow}>
                      <div>
                        <strong>회사명</strong>

                        <p>소속 회사명을 설정합니다.</p>
                      </div>

                      <input
                        name="companyName"
                        value={systemForm.companyName}
                        onChange={handleSystemFormChange}
                      />
                    </div>

                    <div className={styles.systemRow}>
                      <div>
                        <strong>파트너사</strong>

                        <p>협업 중인 파트너사를 설정합니다.</p>
                      </div>

                      <input
                        name="partnerCompany"
                        value={systemForm.partnerCompany}
                        onChange={handleSystemFormChange}
                      />
                    </div>
                  </div>

                  <div className={styles.systemSection}>
                    <h4>기본 설정</h4>

                    <div className={styles.systemGroup}>
                      <div className={styles.systemRow}>
                        <div>
                          <strong>기본 언어</strong>

                          <p>서비스의 기본 언어를 설정합니다.</p>
                        </div>

                        <select
                          name="language"
                          value={systemForm.language}
                          onChange={handleSystemFormChange}
                        >
                          <option value="한국어">한국어</option>

                          <option value="English">English</option>

                          <option value="日本語">日本語</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 알림 */}

              {systemSettingTab === "notification" && (
                <div className={styles.systemPage}>
                  <h3>알림</h3>

                  <h4>알림 항목</h4>

                  <div className={styles.notificationList}>
                    {[
                      {
                        key: "mention",
                        title: "멘션 및 댓글",
                        description: "누군가 나를 멘션하거나 댓글을 남길 때",
                      },
                      {
                        key: "issue",
                        title: "이슈 업데이트",
                        description: "이슈가 생성, 변경, 완료되었을 때",
                      },
                      {
                        key: "deadline",
                        title: "마감일 및 진행률",
                        description: "마감일 임박 및 진행률 변경 시",
                      },
                      {
                        key: "message",
                        title: "메시지",
                        description: "새로운 메시지를 받았을 때",
                      },
                      {
                        key: "doNotDisturb",
                        title: "방해 금지 모드",
                        description: "알림을 받지 않는 시간을 설정합니다.",
                      },
                    ].map(({ key, title, description }) => (
                      <div key={key} className={styles.notificationRow}>
                        <div>
                          <strong>{title}</strong>

                          <p>{description}</p>
                        </div>

                        <label className={styles.systemToggle}>
                          <input
                            type="checkbox"
                            checked={notificationSettings[key]}
                            onChange={() => handleNotificationChange(key)}
                          />

                          <span />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 국가 및 시간 */}

              {systemSettingTab === "time" && (
                <div className={styles.systemPage}>
                  <h3>국가 및 시간</h3>

                  <h4>기본 설정</h4>

                  <div className={styles.systemGroup}>
                    <div className={styles.systemRow}>
                      <div>
                        <strong>국가/지역</strong>

                        <p>워크스페이스의 국가를 설정합니다.</p>
                      </div>

                      <select
                        name="country"
                        value={systemForm.country}
                        onChange={handleSystemFormChange}
                      >
                        <option value="대한민국">대한민국</option>

                        <option value="영국">영국</option>

                        <option value="미국">미국</option>

                        <option value="일본">일본</option>
                      </select>
                    </div>

                    <div className={styles.systemRow}>
                      <div>
                        <strong>시간대</strong>

                        <p>시간대를 설정합니다.</p>
                      </div>

                      <select
                        name="timezone"
                        value={systemForm.timezone}
                        onChange={handleSystemFormChange}
                      >
                        <option value="Asia/Seoul">Asia/Seoul</option>

                        <option value="Europe/London">Europe/London</option>

                        <option value="America/New_York">
                          America/New_York
                        </option>

                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================
                  계정
              ========================================= */}

              {systemSettingTab === "account" && (
                <div className={styles.systemPage}>
                  <h3>계정</h3>

                  <h4>기본 정보</h4>

                  <div className={styles.systemGroup}>
                    <div className={styles.systemRow}>
                      <div>
                        <strong>
                          아이디 <span>(Email)</span>
                        </strong>
                      </div>

                      <input value={userEmail} readOnly />
                    </div>

                    <div className={styles.systemRow}>
                      <div>
                        <strong>비밀번호</strong>
                      </div>

                      <div className={styles.passwordArea}>
                        <input type="password" value="12345678" readOnly />

                        <button
                          type="button"
                          className={styles.passwordChangeButton}
                          onClick={handlePasswordModalOpen}
                        >
                          <img src={pencilIcon} alt="" />

                          <span>변경</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.dangerSection}>
                    <div className={styles.dangerRow}>
                      <div>
                        <strong>로그아웃</strong>

                        <p>현재 계정에서 로그아웃합니다.</p>
                      </div>

                      <button type="button" onClick={handleLogout}>
                        로그아웃
                      </button>
                    </div>

                    <div className={styles.dangerRow}>
                      <div>
                        <strong>계정 삭제</strong>

                        <p>
                          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                        </p>
                      </div>

                      <button type="button">계정 삭제</button>
                    </div>
                  </div>
                </div>
              )}

              {systemSettingTab !== "account" && (
                <div className={styles.systemActions}>
                  <button
                    type="button"
                    className={styles.systemCancelButton}
                    onClick={handleSystemSettingClose}
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    className={styles.systemSaveButton}
                    onClick={handleSystemSave}
                  >
                    저장
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* =========================================
          PASSWORD CHANGE MODAL
      ========================================= */}

      {isPasswordModalOpen && (
        <div
          className={styles.passwordModalOverlay}
          onMouseDown={handlePasswordModalClose}
        >
          <section
            className={styles.passwordModal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2>비밀번호 변경</h2>

            <div className={styles.passwordModalForm}>
              {/* 현재 비밀번호 */}

              <div className={styles.passwordModalField}>
                <label htmlFor="currentPassword">현재 비밀번호</label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              {/* 새 비밀번호 */}

              <div className={styles.passwordModalField}>
                <label htmlFor="newPassword">새 비밀번호</label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="8자 이상, 영문+숫자 포함"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              {/* 새 비밀번호 확인 */}

              <div className={styles.passwordModalField}>
                <input
                  id="newPasswordCheck"
                  name="newPasswordCheck"
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={passwordForm.newPasswordCheck}
                  onChange={handlePasswordChange}
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
                onClick={handlePasswordModalClose}
              >
                취소
              </button>

              <button
                type="button"
                className={styles.passwordSubmitButton}
                onClick={handlePasswordSubmit}
              >
                변경
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Sidebar;
