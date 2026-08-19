import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./CreateProjectForm.module.css";

import { ROUTES } from "../../../../router/routes.constant";

import calendarIcon from "../../../../assets/icons/calendarIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";
import backbuttonIcon from "../../../../assets/icons/backbuttonIcon.svg";

import { getWorkspaceDetail } from "../../../../api/workspaceApi";
import { createProject } from "../../../../api/projectApi";

import ProjectCreateSuccessModal from "../ProjectCreateSuccessModal/ProjectCreateSuccessModal";

function CreateProjectForm() {
  const navigate = useNavigate();

  /* =========================
     Project
  ========================= */

  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");

  /* =========================
     Calendar
  ========================= */

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectingStart, setSelectingStart] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));

  /* =========================
     Company
  ========================= */

  const [searchCompany, setSearchCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  /* =========================
     State
  ========================= */

  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  /* =========================
     성공 Modal
  ========================= */

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  /* =========================
     현재 워크스페이스 회사 정보 불러오기

     중요:
     workspaceCompany /
     workspaceCollaboratingCompanies
     localStorage 값을 사용하지 않음.

     현재 workspaceId의 실제 상세 API 응답을
     기준으로 참여 기업 목록을 구성함.
  ========================= */

  useEffect(() => {
    let isCancelled = false;

    const loadCompanies = async () => {
      const workspaceId = localStorage.getItem("workspaceId");

      if (!workspaceId) {
        if (!isCancelled) {
          setCompanies([]);
          setErrorMessage("워크스페이스 정보가 없습니다.");
          setIsWorkspaceLoading(false);
        }

        return;
      }

      try {
        if (!isCancelled) {
          setIsWorkspaceLoading(true);
          setErrorMessage("");
        }

        console.log("현재 프로젝트 생성 workspaceId:", workspaceId);

        /*
         * localStorage의 예전 회사 정보를 사용하지 않고
         * 현재 workspaceId로 상세 조회
         */
        const result = await getWorkspaceDetail(workspaceId);

        if (isCancelled) {
          return;
        }

        console.log("현재 워크스페이스 상세 조회 성공:", result);

        const data = result?.data;

        if (!data) {
          setCompanies([]);

          setErrorMessage("워크스페이스 정보를 불러오지 못했습니다.");

          return;
        }

        const companyList = [];

        /* =========================
           주관사
        ========================= */

        if (data.company) {
          companyList.push({
            id: data.company.companyId,
            name: data.company.name,
            countryCode: data.company.countryCode,
            role: "주관사",
            apiRole: "HOST",
            isMine: true,
          });
        }

        /* =========================
           파트너사
        ========================= */

        if (Array.isArray(data.collaboratingCompanies)) {
          data.collaboratingCompanies.forEach((company) => {
            companyList.push({
              id: company.companyId,
              name: company.name,
              countryCode: company.countryCode,
              role: "파트너사",
              apiRole: "PARTNER",
              isMine: false,
            });
          });
        }

        console.log("프로젝트 참여 기업 목록:", companyList);

        setCompanies(companyList);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        console.error("워크스페이스 회사 정보 조회 실패:", error);

        setCompanies([]);

        switch (error.code) {
          case "403WORKSPACE_ACCESS_DENIED":
            setErrorMessage("워크스페이스 접근 권한이 없습니다.");
            break;

          case "404WORKSPACE_NOT_FOUND":
            setErrorMessage("워크스페이스를 찾을 수 없습니다.");
            break;

          default:
            if (error.status === 401) {
              setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
            } else {
              setErrorMessage(
                error.message || "회사 정보를 불러오지 못했습니다.",
              );
            }
        }
      } finally {
        if (!isCancelled) {
          setIsWorkspaceLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      isCancelled = true;
    };
  }, []);

  /* =========================
     검색
  ========================= */

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchCompany.trim().toLowerCase()),
  );

  /* =========================
     Date Utils
  ========================= */

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  const formatApiDate = (value) => {
    if (!value) {
      return "";
    }

    const parts = value.split("/");

    if (parts.length !== 3) {
      return "";
    }

    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  };

  const parseDate = (value) => {
    if (!value) {
      return null;
    }

    const parts = value.split("/");

    if (parts.length !== 3) {
      return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) {
      return false;
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const selectedStartDate = parseDate(startDate);
  const selectedEndDate = parseDate(endDate);

  const isBetweenDates = (date) => {
    if (!selectedStartDate || !selectedEndDate) {
      return false;
    }

    return (
      date.getTime() > selectedStartDate.getTime() &&
      date.getTime() < selectedEndDate.getTime()
    );
  };

  /* =========================
     Calendar
  ========================= */

  const handleDateClick = (date) => {
    const formattedDate = formatDate(date);

    if (selectingStart) {
      setStartDate(formattedDate);
      setEndDate("");
      setSelectingStart(false);

      return;
    }

    const start = parseDate(startDate);

    if (start && date.getTime() < start.getTime()) {
      setStartDate(formattedDate);
      setEndDate("");
      setSelectingStart(false);

      return;
    }

    setEndDate(formattedDate);
    setSelectingStart(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const lastDate = new Date(year, month + 1, 0).getDate();

  const previousMonthLastDate = new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = previousMonthLastDate - i;

    calendarDays.push({
      day,
      date: new Date(year, month - 1, day),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= lastDate; day++) {
    calendarDays.push({
      day,
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextMonthDay = 1;

  while (calendarDays.length < 42) {
    calendarDays.push({
      day: nextMonthDay,
      date: new Date(year, month + 1, nextMonthDay),
      currentMonth: false,
    });

    nextMonthDay += 1;
  }

  /* =========================
     프로젝트 생성
  ========================= */

  const handleCreateProject = async () => {
    setErrorMessage("");

    const workspaceId = localStorage.getItem("workspaceId");

    const trimmedName = projectName.trim();
    const trimmedGoal = projectGoal.trim();

    if (!workspaceId) {
      setErrorMessage("워크스페이스 정보가 없습니다.");

      return;
    }

    if (!trimmedName) {
      setErrorMessage("프로젝트명을 입력해주세요.");

      return;
    }

    if (!trimmedGoal) {
      setErrorMessage("프로젝트 목표를 입력해주세요.");

      return;
    }

    const parsedStart = parseDate(startDate);
    const parsedEnd = parseDate(endDate);

    if (!parsedStart) {
      setErrorMessage("시작 일자를 입력해주세요.");

      return;
    }

    if (!parsedEnd) {
      setErrorMessage("마감 일자를 입력해주세요.");

      return;
    }

    if (parsedStart.getTime() > parsedEnd.getTime()) {
      setErrorMessage("마감 일자는 시작 일자보다 빠를 수 없습니다.");

      return;
    }

    if (companies.length === 0) {
      setErrorMessage("참여 기업 정보가 없습니다.");

      return;
    }

    const companyWithoutId = companies.find((company) => !company.id);

    if (companyWithoutId) {
      setErrorMessage(
        `${companyWithoutId.name}의 회사 ID를 확인할 수 없습니다.`,
      );

      return;
    }

    /* =========================
       현재 워크스페이스의
       주관사 + 파트너사를 API 형식으로 변환
    ========================= */

    const participatingCompanies = companies.map((company) => ({
      companyId: Number(company.id),
      role: company.apiRole,
    }));

    console.log(
      "프로젝트 생성 participatingCompanies:",
      participatingCompanies,
    );

    try {
      setIsCreating(true);

      const result = await createProject({
        workspaceId,

        name: trimmedName,

        objective: trimmedGoal,

        startDate: formatApiDate(startDate),

        endDate: formatApiDate(endDate),

        participatingCompanies,
      });

      console.log("프로젝트 생성 성공:", result);

      const projectId = result?.data?.projectId;

      if (!projectId) {
        setErrorMessage("프로젝트 ID를 받지 못했습니다.");

        return;
      }

      /* =========================
           프로젝트 저장
      ========================= */

      localStorage.setItem("projectId", String(projectId));

      localStorage.setItem("projectName", trimmedName);

      localStorage.setItem(
        "selectedProject",
        JSON.stringify({
          projectId,

          name: trimmedName,

          objective: trimmedGoal,

          startDate: formatApiDate(startDate),

          endDate: formatApiDate(endDate),

          status: result?.data?.status || "DRAFT",

          participatingCompanies,
        }),
      );

      /* =========================
           프로젝트 갱신 이벤트
      ========================= */

      window.dispatchEvent(new Event("projectCreated"));

      window.dispatchEvent(new Event("projectChanged"));

      /* =========================
           성공 Modal OPEN
      ========================= */

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);

      switch (error.code) {
        case "400INVALID_PROJECT_INPUT":
          setErrorMessage(
            error.message || "프로젝트 입력값 또는 기간을 확인해주세요.",
          );

          break;

        case "403PROJECT_CREATE_DENIED":
          setErrorMessage("프로젝트 생성 권한이 없습니다.");

          break;

        case "409PROJECT_NAME_DUPLICATED":
          setErrorMessage("동일한 이름의 프로젝트가 이미 존재합니다.");

          break;

        default:
          if (error.status === 401) {
            setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            setErrorMessage(error.message || "프로젝트 생성에 실패했습니다.");
          }
      }
    } finally {
      setIsCreating(false);
    }
  };

  /* =========================
     성공 Modal 닫기
  ========================= */

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);

    navigate(ROUTES.PROJECT_HOME);
  };

  return (
    <>
      <section className={styles.container}>
        {/* =========================
            BACK
        ========================= */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <img src={backbuttonIcon} alt="" className={styles.backButtonIcon} />

          <span>뒤로</span>
        </button>

        <h1 className={styles.title}>새 프로젝트 만들기</h1>

        {/* =========================
            기본 정보
        ========================= */}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>기본 정보</h2>

          <div className={styles.field}>
            <label htmlFor="projectName">프로젝트명</label>

            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="projectGoal">프로젝트 목표</label>

            <textarea
              id="projectGoal"
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
            />
          </div>
        </section>

        {/* =========================
            프로젝트 기간
        ========================= */}

        <section className={`${styles.card} ${styles.periodCard}`}>
          <div className={styles.periodTitleRow}>
            <h2 className={styles.cardTitle}>프로젝트 기간</h2>

            <button
              type="button"
              className={styles.calendarButton}
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              <img src={calendarIcon} alt="" className={styles.calendarIcon} />
            </button>
          </div>

          <div className={styles.dateRow}>
            <div className={styles.dateField}>
              <label>시작 일자</label>

              <input
                type="text"
                value={startDate}
                placeholder="2026/08/06"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className={styles.dateField}>
              <label>마감 일자</label>

              <input
                type="text"
                value={endDate}
                placeholder="2026/08/24"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {isCalendarOpen && (
            <div className={styles.calendarPopup}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.monthButton}
                  onClick={handlePreviousMonth}
                >
                  ‹
                </button>

                <strong>
                  {currentDate.toLocaleString("en-US", {
                    month: "long",
                  })}{" "}
                  {year}
                </strong>

                <button
                  type="button"
                  className={styles.monthButton}
                  onClick={handleNextMonth}
                >
                  ›
                </button>
              </div>

              <div className={styles.calendarDivider} />

              <div className={styles.weekRow}>
                <span>SUN</span>
                <span>MON</span>
                <span>TUE</span>
                <span>WED</span>
                <span>THU</span>
                <span>FRI</span>
                <span>SAT</span>
              </div>

              <div className={styles.calendarGrid}>
                {calendarDays.map((item, index) => {
                  const isStart = isSameDate(item.date, selectedStartDate);

                  const isEnd = isSameDate(item.date, selectedEndDate);

                  const isRange = isBetweenDates(item.date);

                  const classNames = [
                    styles.dayButton,

                    !item.currentMonth ? styles.otherMonthDay : "",

                    isRange ? styles.rangeDay : "",

                    isStart || isEnd ? styles.selectedDay : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={`${item.date.getTime()}-${index}`}
                      type="button"
                      className={classNames}
                      onClick={() => handleDateClick(item.date)}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* =========================
            참여 기업
        ========================= */}

        <section className={`${styles.card} ${styles.companyCard}`}>
          <h2 className={styles.cardTitle}>참여 기업</h2>

          <div className={styles.searchWrapper}>
            <img src={searchIcon} alt="" className={styles.searchIcon} />

            <input
              type="text"
              className={styles.searchInput}
              placeholder="기업명 검색"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
            />
          </div>

          <div className={styles.companyList}>
            {isWorkspaceLoading ? (
              <p className={styles.noCompany}>기업 정보를 불러오는 중입니다.</p>
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company, index) => (
                <div
                  className={styles.companyItem}
                  key={company.id ?? `${company.name}-${index}`}
                >
                  <div className={styles.companyCircle} />

                  <div className={styles.companyInfo}>
                    <div className={styles.companyNameRow}>
                      <strong>{company.name}</strong>

                      {company.isMine && (
                        <span className={styles.badge}>내 소속</span>
                      )}
                    </div>

                    <p>{company.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noCompany}>검색 결과가 없습니다.</p>
            )}
          </div>

          {/*
            아직 별도의 "새 회사 생성/검색 API"가 없으므로
            버튼 디자인은 기존 그대로 유지.
            현재는 별도 동작을 연결하지 않음.
          */}

          <button type="button" className={styles.addCompanyButton}>
            기업 추가
          </button>
        </section>

        {/* =========================
            ERROR
        ========================= */}

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {/* =========================
            Bottom Buttons
        ========================= */}

        <div className={styles.bottomActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
            disabled={isCreating}
          >
            취소
          </button>

          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreateProject}
            disabled={isCreating || isWorkspaceLoading}
          >
            {isCreating ? "생성 중..." : "프로젝트 생성"}
          </button>
        </div>
      </section>

      {/* =========================
          프로젝트 생성 성공 Modal
      ========================= */}

      {isSuccessModalOpen && (
        <ProjectCreateSuccessModal onClose={handleSuccessModalClose} />
      )}
    </>
  );
}

export default CreateProjectForm;
