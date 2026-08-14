import { useMemo, useState } from "react";

import MainLayout from "../../../../components/MainLayout/MainLayout";
import IssueBoard from "../../components/IssueBoard/IssueBoard";

import styles from "./IssueListPage.module.css";

import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";


function IssueListPage() {
  const [dateSort, setDateSort] = useState("최신순");
  const [prioritySort, setPrioritySort] = useState("높은순");

  const [dateOpen, setDateOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);


  const dateOptions = useMemo(() => {
    const options = ["최신순", "등록순"];

    return [
      dateSort,
      ...options.filter((option) => option !== dateSort),
    ];
  }, [dateSort]);


  const priorityOptions = useMemo(() => {
    const options = ["높은순", "낮은순"];

    return [
      prioritySort,
      ...options.filter((option) => option !== prioritySort),
    ];
  }, [prioritySort]);


  const handleDateSelect = (option) => {
    setDateSort(option);
    setDateOpen(false);
  };


  const handlePrioritySelect = (option) => {
    setPrioritySort(option);
    setPriorityOpen(false);
  };


  return (
    <MainLayout>
      <main className={styles.page}>
        {/* =========================
            상단 제목
        ========================= */}

        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h1>이슈</h1>

            <span className={styles.cycleBadge}>
              Cycle 3
            </span>
          </div>

          <p>
            사이클 내 모든 이슈를 확인하고 관리하세요.
          </p>
        </div>


        {/* =========================
            정렬 / 검색
        ========================= */}

        <div className={styles.toolbar}>
          <div className={styles.sort}>
            {/* =========================
                등록일 정렬
            ========================= */}

            <div className={styles.sortGroup}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => {
                  setDateOpen((prev) => !prev);
                  setPriorityOpen(false);
                }}
              >
                <span>
                  등록일 {dateSort}
                </span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    dateOpen ? styles.dropdownOpen : ""
                  }`}
                />
              </button>


              {dateOpen && (
                <div className={styles.dropdownMenu}>
                  {dateOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.dropdownOption} ${
                        option === dateSort
                          ? styles.selectedOption
                          : ""
                      }`}
                      onClick={() =>
                        handleDateSelect(option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* =========================
                우선순위 정렬
            ========================= */}

            <div className={styles.sortGroup}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => {
                  setPriorityOpen((prev) => !prev);
                  setDateOpen(false);
                }}
              >
                <span>
                  우선순위 {prioritySort}
                </span>

                <img
                  src={dropdownIcon}
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    priorityOpen ? styles.dropdownOpen : ""
                  }`}
                />
              </button>


              {priorityOpen && (
                <div className={styles.dropdownMenu}>
                  {priorityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.dropdownOption} ${
                        option === prioritySort
                          ? styles.selectedOption
                          : ""
                      }`}
                      onClick={() =>
                        handlePrioritySelect(option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* =========================
              검색 / 프로젝트 생성
          ========================= */}

          <div className={styles.rightToolbar}>
            <div className={styles.searchBox}>
              <img
                src={searchIcon}
                alt=""
                className={styles.searchIcon}
              />

              <input
                type="text"
                aria-label="이슈 검색"
              />
            </div>

            <button
              type="button"
              className={styles.createButton}
            >
              프로젝트 생성
            </button>
          </div>
        </div>


        {/* =========================
            이슈 보드
        ========================= */}

        <IssueBoard />
      </main>
    </MainLayout>
  );
}


export default IssueListPage;