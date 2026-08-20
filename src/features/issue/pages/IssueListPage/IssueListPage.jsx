import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../../../components/MainLayout/MainLayout";
import IssueBoard from "../../components/IssueBoard/IssueBoard";

import styles from "./IssueListPage.module.css";

import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";
import searchIcon from "../../../../assets/icons/searchIcon.svg";

import {
  ROUTES,
} from "../../../../router/routes.constant";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getIssues,
} from "../../../../api/issueApi";


/* ==================================================
   사이클 기간순 정렬
================================================== */

const sortCyclesByPeriod = (
  cycleList
) => {
  return [
    ...cycleList,
  ].sort(
    (
      a,
      b
    ) => {
      const startCompare =
        String(
          a.startDate || ""
        ).localeCompare(
          String(
            b.startDate || ""
          )
        );


      if (
        startCompare !== 0
      ) {
        return startCompare;
      }


      const endCompare =
        String(
          a.endDate || ""
        ).localeCompare(
          String(
            b.endDate || ""
          )
        );


      if (
        endCompare !== 0
      ) {
        return endCompare;
      }


      return (
        Number(
          a.cycleId || 0
        ) -
        Number(
          b.cycleId || 0
        )
      );
    }
  );
};


function IssueListPage() {
  const navigate =
    useNavigate();


  const [
    dateSort,
    setDateSort,
  ] = useState(
    "최신순"
  );


  const [
    prioritySort,
    setPrioritySort,
  ] = useState(
    "높은순"
  );


  const [
    activeSortField,
    setActiveSortField,
  ] = useState(
    "date"
  );


  const [
    dateOpen,
    setDateOpen,
  ] = useState(false);


  const [
    priorityOpen,
    setPriorityOpen,
  ] = useState(false);


  const [
    keyword,
    setKeyword,
  ] = useState("");


  const [
    cycle,
    setCycle,
  ] = useState(null);


  const [
    cycleLabel,
    setCycleLabel,
  ] = useState(
    "Cycle"
  );


  const [
    issues,
    setIssues,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =========================
     등록일 옵션
  ========================= */

  const dateOptions =
    useMemo(() => {
      const options = [
        "최신순",
        "등록순",
      ];


      return [
        dateSort,

        ...options.filter(
          (
            option
          ) =>
            option !==
            dateSort
        ),
      ];
    }, [
      dateSort,
    ]);


  /* =========================
     우선순위 옵션
  ========================= */

  const priorityOptions =
    useMemo(() => {
      const options = [
        "높은순",
        "낮은순",
      ];


      return [
        prioritySort,

        ...options.filter(
          (
            option
          ) =>
            option !==
            prioritySort
        ),
      ];
    }, [
      prioritySort,
    ]);


  /* ==================================================
     현재 프로젝트 Cycle 조회
  ================================================== */

  useEffect(() => {
    const fetchCycle =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (!projectId) {
          setErrorMessage(
            "선택된 프로젝트가 없습니다."
          );


          setLoading(
            false
          );


          return;
        }


        try {
          const response =
            await getCycles(
              projectId
            );


          console.log(
            "사이클 리스트 조회 성공:",
            response
          );


          const cycleList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          if (
            cycleList.length ===
            0
          ) {
            setErrorMessage(
              "등록된 사이클이 없습니다."
            );


            setCycle(
              null
            );


            setCycleLabel(
              "Cycle"
            );


            setLoading(
              false
            );


            return;
          }


          const sortedCycles =
            sortCyclesByPeriod(
              cycleList
            );


          const currentCycle =
            sortedCycles.find(
              (
                item
              ) =>
                item.status ===
                "IN_PROGRESS"
            ) ||
            sortedCycles[0];


          const currentCycleIndex =
            sortedCycles.findIndex(
              (
                item
              ) =>
                Number(
                  item.cycleId
                ) ===
                Number(
                  currentCycle
                    ?.cycleId
                )
            );


          setCycle(
            currentCycle
          );


          setCycleLabel(
            currentCycleIndex >= 0
              ? `Cycle ${
                  currentCycleIndex +
                  1
                }`
              : "Cycle"
          );


          setErrorMessage(
            ""
          );
        } catch (error) {
          console.error(
            "사이클 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          setErrorMessage(
            error.response?.data
              ?.message ||
              "사이클을 불러오지 못했습니다."
          );


          setCycle(
            null
          );


          setCycleLabel(
            "Cycle"
          );


          setLoading(
            false
          );
        }
      };


    fetchCycle();
  }, []);


  /* ==================================================
     이슈 목록 조회
  ================================================== */

  useEffect(() => {
    if (
      !cycle?.cycleId
    ) {
      return;
    }


    const fetchIssues =
      async () => {
        try {
          setLoading(
            true
          );


          setErrorMessage(
            ""
          );


          let sort =
            "createdAt,desc";


          if (
            activeSortField ===
            "date"
          ) {
            sort =
              dateSort ===
              "최신순"
                ? "createdAt,desc"
                : "createdAt,asc";
          }


          if (
            activeSortField ===
            "priority"
          ) {
            sort =
              prioritySort ===
              "높은순"
                ? "priority,desc"
                : "priority,asc";
          }


          const response =
            await getIssues(
              cycle.cycleId,
              {
                keyword:
                  keyword.trim() ||
                  undefined,

                sort,

                page: 0,

                size: 100,
              }
            );


          console.log(
            "이슈 리스트 조회 성공:",
            response
          );


          const issueList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          setIssues(
            issueList
          );
        } catch (error) {
          console.error(
            "이슈 리스트 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "404CYCLE"
          ) {
            setErrorMessage(
              "존재하지 않는 사이클입니다."
            );
          } else {
            setErrorMessage(
              responseData?.message ||
                "이슈 목록을 불러오지 못했습니다."
            );
          }


          setIssues([]);
        } finally {
          setLoading(
            false
          );
        }
      };


    fetchIssues();
  }, [
    cycle?.cycleId,
    keyword,
    dateSort,
    prioritySort,
    activeSortField,
  ]);


  /* ==================================================
     댓글 개수 즉시 변경

     IssueCommentPanel
     → IssueBoard
     → 여기까지 전달됨

     페이지 재조회 없이
     해당 이슈의 commentCount만 변경
  ================================================== */

  const handleCommentCountChange =
    (
      issueId,
      count
    ) => {
      setIssues(
        (
          prev
        ) =>
          prev.map(
            (
              issue
            ) =>
              Number(
                issue.issueId
              ) ===
              Number(
                issueId
              )
                ? {
                    ...issue,

                    commentCount:
                      count,
                  }
                : issue
          )
      );
    };


  /* =========================
     등록일 정렬
  ========================= */

  const handleDateSelect =
    (
      option
    ) => {
      setDateSort(
        option
      );


      setActiveSortField(
        "date"
      );


      setDateOpen(
        false
      );
    };


  /* =========================
     우선순위 정렬
  ========================= */

  const handlePrioritySelect =
    (
      option
    ) => {
      setPrioritySort(
        option
      );


      setActiveSortField(
        "priority"
      );


      setPriorityOpen(
        false
      );
    };


  /* =========================
     이슈 생성
  ========================= */

  const handleCreateIssue =
    () => {
      navigate(
        ROUTES.CREATE_ISSUE
      );
    };


  return (
    <MainLayout>
      <main
        className={
          styles.page
        }
      >
        {/* =========================
            Header
        ========================= */}

        <div
          className={
            styles.header
          }
        >
          <div
            className={
              styles.titleRow
            }
          >
            <h1>
              이슈
            </h1>


            <span
              className={
                styles.cycleBadge
              }
            >
              {
                cycleLabel
              }
            </span>
          </div>


          <p>
            사이클 내 모든 이슈를 확인하고 관리하세요.
          </p>
        </div>


        {/* =========================
            Toolbar
        ========================= */}

        <div
          className={
            styles.toolbar
          }
        >
          <div
            className={
              styles.sort
            }
          >
            {/* 등록일 */}

            <div
              className={
                styles.sortGroup
              }
            >
              <button
                type="button"
                className={
                  styles.sortButton
                }
                onClick={() => {
                  setDateOpen(
                    (
                      prev
                    ) =>
                      !prev
                  );


                  setPriorityOpen(
                    false
                  );
                }}
              >
                <span>
                  등록일{" "}
                  {
                    dateSort
                  }
                </span>


                <img
                  src={
                    dropdownIcon
                  }
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    dateOpen
                      ? styles.dropdownOpen
                      : ""
                  }`}
                />
              </button>


              {dateOpen && (
                <div
                  className={
                    styles.dropdownMenu
                  }
                >
                  {dateOptions.map(
                    (
                      option
                    ) => (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`${styles.dropdownOption} ${
                          option ===
                          dateSort
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() =>
                          handleDateSelect(
                            option
                          )
                        }
                      >
                        {
                          option
                        }
                      </button>
                    )
                  )}
                </div>
              )}
            </div>


            {/* 우선순위 */}

            <div
              className={
                styles.sortGroup
              }
            >
              <button
                type="button"
                className={
                  styles.sortButton
                }
                onClick={() => {
                  setPriorityOpen(
                    (
                      prev
                    ) =>
                      !prev
                  );


                  setDateOpen(
                    false
                  );
                }}
              >
                <span>
                  우선순위{" "}
                  {
                    prioritySort
                  }
                </span>


                <img
                  src={
                    dropdownIcon
                  }
                  alt=""
                  className={`${styles.dropdownIcon} ${
                    priorityOpen
                      ? styles.dropdownOpen
                      : ""
                  }`}
                />
              </button>


              {priorityOpen && (
                <div
                  className={
                    styles.dropdownMenu
                  }
                >
                  {priorityOptions.map(
                    (
                      option
                    ) => (
                      <button
                        key={
                          option
                        }
                        type="button"
                        className={`${styles.dropdownOption} ${
                          option ===
                          prioritySort
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() =>
                          handlePrioritySelect(
                            option
                          )
                        }
                      >
                        {
                          option
                        }
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>


          {/* 검색 / 이슈 생성 */}

          <div
            className={
              styles.rightToolbar
            }
          >
            <div
              className={
                styles.searchBox
              }
            >
              <img
                src={
                  searchIcon
                }
                alt=""
                className={
                  styles.searchIcon
                }
              />


              <input
                type="text"
                aria-label="이슈 검색"
                value={
                  keyword
                }
                onChange={(
                  event
                ) =>
                  setKeyword(
                    event.target
                      .value
                  )
                }
              />
            </div>


            <button
              type="button"
              className={
                styles.createButton
              }
              onClick={
                handleCreateIssue
              }
            >
              이슈 생성
            </button>
          </div>
        </div>


        {/* 로딩 */}

        {loading && (
          <p>
            이슈를 불러오는 중입니다.
          </p>
        )}


        {/* 오류 */}

        {!loading &&
          errorMessage && (
          <p>
            {
              errorMessage
            }
          </p>
        )}


        {/* =========================
            Board
        ========================= */}

        {!loading &&
          !errorMessage && (
          <IssueBoard
            issues={
              issues
            }
            onCommentCountChange={
              handleCommentCountChange
            }
          />
        )}
      </main>
    </MainLayout>
  );
}


export default IssueListPage;