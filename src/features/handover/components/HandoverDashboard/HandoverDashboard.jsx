import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import styles from "./HandoverDashboard.module.css";

import rightArrowIcon from "../../../../assets/icons/rightArrowIcon.svg";
import infoCircleIcon from "../../../../assets/icons/infoCircleIcon.svg";
import successCheckIcon from "../../../../assets/icons/successCheckIcon.svg";
import closeIcon from "../../../../assets/icons/closeIcon.svg";

import ReviewSummaryCard from "../ReviewSummaryCard/ReviewSummaryCard";
import HandoverSection from "../HandoverSection/HandoverSection";
import SourcePanel from "../SourcePanel/SourcePanel";
import AiCheckPanel from "../AiCheckPanel/AiCheckPanel";
import TransferInfoPanel from "../TransferInfoPanel/TransferInfoPanel";

import {
  ROUTES,
} from "../../../../router/routes.constant";

import {
  getHandover,
  refreshHandover,
  deliverHandover,
} from "../../../../api/handoverApi";


/* ==================================================
   인수인계 Category
================================================== */

const CATEGORY_INFO = {
  COMPLETED: {
    number: 1,
    title: "완료한 업무",
  },

  IN_PROGRESS: {
    number: 2,
    title: "진행 중인 업무",
  },

  NEXT_ACTION: {
    number: 3,
    title: "다음 할 일",
  },

  DECISION: {
    number: 4,
    title: "결정 사항",
  },

  QUESTION: {
    number: 5,
    title: "질문 사항",
  },
};


const CATEGORY_ORDER = [
  "COMPLETED",
  "IN_PROGRESS",
  "NEXT_ACTION",
  "DECISION",
  "QUESTION",
];


/* ==================================================
   기본 AI 검토 결과
================================================== */

const defaultReviewSummary = [
  {
    label: "근거 확인 완료",
    count: 0,
  },

  {
    label: "확인 필요",
    count: 0,
  },

  {
    label: "미답변 질문",
    count: 0,
  },

  {
    label: "전체 항목",
    count: 0,
  },
];


/* ==================================================
   상대 시간 계산
================================================== */

const getRelativeTimeText = (
  dateString
) => {
  if (!dateString) {
    return "";
  }


  const syncedDate =
    new Date(dateString);


  const now =
    new Date();


  const diffMilliseconds =
    now.getTime() -
    syncedDate.getTime();


  const diffMinutes =
    Math.max(
      0,
      Math.floor(
        diffMilliseconds /
          (1000 * 60)
      )
    );


  if (diffMinutes < 1) {
    return "방금 전";
  }


  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }


  const diffHours =
    Math.floor(
      diffMinutes / 60
    );


  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }


  const diffDays =
    Math.floor(
      diffHours / 24
    );


  return `${diffDays}일 전`;
};


/* ==================================================
   HandoverDashboard
================================================== */

function HandoverDashboard() {
  const navigate =
    useNavigate();


  /* =========================
      실제 API 데이터
  ========================= */

  const [
    handoverData,
    setHandoverData,
  ] = useState(null);


  const [
    reviewSummary,
    setReviewSummary,
  ] = useState(
    defaultReviewSummary
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const [
    isDelivering,
    setIsDelivering,
  ] = useState(false);


  const [
    isCompleteModalOpen,
    setIsCompleteModalOpen,
  ] = useState(false);


  /* =========================
      프로젝트 / Cycle 표시
  ========================= */

  const projectName =
    localStorage.getItem(
      "projectName"
    ) ||
    "프로젝트";


  const cycleName =
    localStorage.getItem(
      "cycleName"
    ) ||
    "Cycle";


  /* =========================
      인수인계 ID
  ========================= */

  const getCurrentHandoverId =
    () => {
      if (
        handoverData?.handoverId
      ) {
        return String(
          handoverData.handoverId
        );
      }


      return localStorage.getItem(
        "handoverId"
      );
    };


  /* =========================
      AI 인수인계 전체 조회

      GET
      /api/v1/handovers/{handoverId}
  ========================= */

  useEffect(() => {
    const fetchHandover =
      async () => {
        const handoverId =
          localStorage.getItem(
            "handoverId"
          );


        /*
          초안 생성 전에는
          실제 handoverId가 없을 수 있음.

          임시 ID를 사용하지 않음.
        */

        if (!handoverId) {
          console.warn(
            "handoverId가 없습니다."
          );

          return;
        }


        try {
          setIsLoading(
            true
          );


          const response =
            await getHandover(
              handoverId
            );


          console.log(
            "AI 인수인계 전체 조회 성공:",
            response
          );


          const data =
            response?.data;


          if (!data) {
            return;
          }


          /*
            조회 응답의 실제 handoverId를
            다시 저장해 ID를 일치시킴.
          */

          if (data.handoverId) {
            localStorage.setItem(
              "handoverId",
              String(
                data.handoverId
              )
            );
          }


          setHandoverData(
            data
          );


          /* =========================
              AI 검토 결과
          ========================= */

          const summary =
            data.reviewSummary;


          if (summary) {
            setReviewSummary([
              {
                label:
                  "근거 확인 완료",

                count:
                  summary.verifiedCount ??
                  0,
              },

              {
                label:
                  "확인 필요",

                count:
                  summary.needsReviewCount ??
                  0,
              },

              {
                label:
                  "미답변 질문",

                count:
                  summary.unansweredCount ??
                  0,
              },

              {
                label:
                  "전체 항목",

                count:
                  summary.totalCount ??
                  0,
              },
            ]);
          }
        } catch (error) {
          console.error(
            "AI 인수인계 전체 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );
        } finally {
          setIsLoading(
            false
          );
        }
      };


    fetchHandover();
  }, []);


  /* =========================
      API items
      → 화면 5개 섹션
  ========================= */

  const handoverSections =
    useMemo(() => {
      const items =
        handoverData?.items ??
        [];


      return CATEGORY_ORDER.map(
        (category) => {
          const categoryInfo =
            CATEGORY_INFO[
              category
            ];


          const categoryItems =
            items
              .filter(
                (item) =>
                  item.category ===
                  category
              )
              .map(
                (item) => ({
                  /*
                    명세상 handover item ID
                  */

                  itemId:
                    item.itemId,


                  /*
                    HandoverItem 컴포넌트가
                    현재 issueId prop을 사용하고 있으므로
                    렌더링용 식별자로 itemId 전달.

                    실제 Issue ID라는 의미는 아님.
                  */

                  issueId:
                    item.itemId,


                  title:
                    item.title ||
                    "",


                  description:
                    item.description ||
                    "",


                  /*
                    전체 조회 명세에는
                    담당자 이름이 없음.

                    assigneeMemberId만 내려옴.
                  */

                  manager:
                    item.assigneeMemberId
                      ? `멤버 ${item.assigneeMemberId}`
                      : "-",


                  /*
                    실제 evidences 배열 길이
                  */

                  evidenceCount:
                    Array.isArray(
                      item.evidences
                    )
                      ? item.evidences.length
                      : 0,


                  /*
                    VERIFIED가 아닌 항목은
                    현재 UI의 확인 필요 표시 사용
                  */

                  warning:
                    item.reviewStatus !==
                    "VERIFIED",
                })
              );


          return {
            number:
              categoryInfo.number,

            title:
              categoryInfo.title,

            count:
              categoryItems.length,

            items:
              categoryItems,
          };
        }
      );
    }, [
      handoverData,
    ]);


  /* =========================
      마지막 AI 반영 시간
  ========================= */

  const lastSyncedText =
    getRelativeTimeText(
      handoverData?.lastSyncedAt
    );


  /* =========================
      AI 최신 활동 재반영

      POST
      /api/v1/handovers/{handoverId}/refresh
  ========================= */

  const handleRefresh =
    async () => {
      const handoverId =
        getCurrentHandoverId();


      if (!handoverId) {
        console.warn(
          "handoverId가 없습니다."
        );

        return;
      }


      if (isRefreshing) {
        return;
      }


      try {
        setIsRefreshing(
          true
        );


        /*
          실제 명세 기준

          sourceTypes
          → 선택값
          → 미입력 시 전체 협업 도구

          preserveManualEdits
          → 사용자 수정 내용 보존
        */

        const response =
          await refreshHandover(
            handoverId,
            {
              preserveManualEdits:
                true,
            }
          );


        console.log(
          "AI 최신 활동 재반영 요청 성공:",
          response
        );


        /*
          응답은 202 Accepted.

          data 예시:
          {
            handoverId,
            generationJobId,
            status: "AI_GENERATING"
          }

          비동기 작업이므로
          요청 성공 직후 기존 내용을
          임의로 변경하지 않음.
        */
      } catch (error) {
        console.error(
          "AI 최신 활동 재반영 요청 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      } finally {
        setIsRefreshing(
          false
        );
      }
    };


  /* =========================
      이슈 전체 보기
  ========================= */

  const handleViewAllIssues =
    () => {
      navigate(
        ROUTES.ISSUE
      );
    };


  /* =========================
      새 이슈 추가
  ========================= */

  const handleAddIssue =
    () => {
      navigate(
        ROUTES.CREATE_ISSUE
      );
    };


  /* =========================
      인수인계 항목 수정
  ========================= */

  const handleEditIssue =
    (
      itemId
    ) => {
      /*
        전체 조회 명세에는
        itemId는 있지만 실제 issueId는 없음.

        따라서 itemId를 이용해
        /issue/{id}/edit로 이동시키지 않음.
      */

      console.warn(
        "인수인계 itemId:",
        itemId,
        "전체 조회 응답에 실제 issueId가 없습니다."
      );
    };


  /* =========================
      실제 인수인계 전달

      POST
      /api/v1/handovers/{handoverId}/deliver
  ========================= */

  const handleDeliverHandover =
    async () => {
      const handoverId =
        getCurrentHandoverId();


      /* =========================
          handoverId 확인
      ========================= */

      if (!handoverId) {
        console.warn(
          "handoverId가 없습니다."
        );

        return;
      }


      /* =========================
          최신 version 확인

          전체 조회 명세에서
          version이 내려옴.
      ========================= */

      const version =
        handoverData?.version;


      if (
        version === null ||
        version === undefined
      ) {
        console.warn(
          "인수인계 version이 없습니다."
        );

        return;
      }


      if (isDelivering) {
        return;
      }


      try {
        setIsDelivering(
          true
        );


        /*
          실제 명세 기준

          version
          → GET 전체 조회에서 받은 최신 버전

          acknowledgeReviewAlerts
          → 사용자가 최종 전달 버튼을 눌렀으므로
             확인 필요 / 미답변 항목을 인지하고
             전달하는 것으로 처리

          deliveryRequestId
          → 중복 전달 방지를 위한
             새로운 UUID 생성
        */

        const deliveryRequestId =
          crypto.randomUUID();


        const response =
          await deliverHandover(
            handoverId,
            {
              version,

              acknowledgeReviewAlerts:
                true,

              deliveryRequestId,
            }
          );


        console.log(
          "인수인계 전달 요청 성공:",
          response
        );


        /*
          실제 성공 응답은
          202 Accepted.

          API 요청이 성공했을 때만
          완료 모달 표시.
        */

        setIsCompleteModalOpen(
          true
        );


        /*
          반환된 전달 정보가 있다면
          현재 handoverData에 보존.

          response.data 예시:
          {
            handoverId,
            deliveryId,
            status,
            scheduledAt,
            timezone
          }
        */

        if (response?.data) {
          setHandoverData(
            (prev) => {
              if (!prev) {
                return prev;
              }


              return {
                ...prev,

                deliveryResult:
                  response.data,
              };
            }
          );
        }
      } catch (error) {
        console.error(
          "인수인계 전달 요청 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      } finally {
        setIsDelivering(
          false
        );
      }
    };


  /* =========================
      전달 완료 모달 닫기
  ========================= */

  const handleCloseCompleteModal =
    () => {
      navigate(
        ROUTES.DASHBOARD
      );
    };


  return (
    <>
      <div
        className={
          styles.dashboard
        }
      >
        {/* =========================
            HEADER
        ========================= */}

        <header
          className={
            styles.pageHeader
          }
        >
          <div
            className={
              styles.headerText
            }
          >
            <h1>
              인수인계
            </h1>


            <div
              className={
                styles.projectRow
              }
            >
              <strong>
                {
                  projectName
                }
              </strong>


              <span
                className={
                  styles.cycleBadge
                }
              >
                {
                  cycleName
                }
              </span>
            </div>


            <div
              className={
                styles.aiNotice
              }
            >
              <img
                src={
                  infoCircleIcon
                }
                alt=""
              />


              <span>
                {lastSyncedText
                  ? `AI가 ${lastSyncedText}에 최신 활동을 반영했습니다.`
                  : isLoading
                    ? "AI 인수인계 정보를 불러오는 중입니다."
                    : "AI 최신 활동 정보가 없습니다."}
              </span>
            </div>
          </div>


          {/* =========================
              상단 버튼
          ========================= */}

          <div
            className={
              styles.headerButtons
            }
          >
            <button
              type="button"
              className={
                styles.refreshButton
              }
              onClick={
                handleRefresh
              }
              disabled={
                isRefreshing
              }
            >
              새로 고침
            </button>


            <button
              type="button"
              className={
                styles.issueButton
              }
              onClick={() =>
                navigate(
                  ROUTES.CREATE_ISSUE
                )
              }
            >
              새 이슈 등록
            </button>
          </div>
        </header>


        {/* =========================
            CONTENT
        ========================= */}

        <div
          className={
            styles.contentGrid
          }
        >
          <main
            className={
              styles.mainColumn
            }
          >
            {/* =========================
                AI 검토 결과
            ========================= */}

            <section
              className={
                styles.reviewSection
              }
            >
              <h2
                className={
                  styles.sectionTitle
                }
              >
                AI 검토 결과
              </h2>


              <div
                className={
                  styles.summaryGrid
                }
              >
                {reviewSummary.map(
                  (
                    item
                  ) => (
                    <ReviewSummaryCard
                      key={
                        item.label
                      }
                      label={
                        item.label
                      }
                      count={
                        item.count
                      }
                    />
                  )
                )}
              </div>
            </section>


            {/* =========================
                할 일
            ========================= */}

            <section
              className={
                styles.todoSection
              }
            >
              <div
                className={
                  styles.todoHeader
                }
              >
                <h2
                  className={
                    styles.sectionTitle
                  }
                >
                  할 일
                </h2>


                <button
                  type="button"
                  className={
                    styles.viewAllButton
                  }
                  onClick={
                    handleViewAllIssues
                  }
                >
                  <span>
                    전체 보기
                  </span>


                  <img
                    src={
                      rightArrowIcon
                    }
                    alt=""
                  />
                </button>
              </div>


              {/* =========================
                  인수인계 항목
              ========================= */}

              <div
                className={
                  styles.taskBoard
                }
              >
                <div
                  className={
                    styles.sectionList
                  }
                >
                  {handoverSections.map(
                    (
                      section
                    ) => (
                      <HandoverSection
                        key={
                          section.number
                        }
                        number={
                          section.number
                        }
                        title={
                          section.title
                        }
                        count={
                          section.count
                        }
                        items={
                          section.items
                        }
                        onAdd={
                          handleAddIssue
                        }
                        onEdit={
                          handleEditIssue
                        }
                      />
                    )
                  )}
                </div>
              </div>


              {/* =========================
                  인수인계 전달
              ========================= */}

              <div
                className={
                  styles.bottomActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.transferButton
                  }
                  onClick={
                    handleDeliverHandover
                  }
                  disabled={
                    isDelivering
                  }
                >
                  <span
                    className={
                      styles.transferText
                    }
                  >
                    인수인계 전달 →
                  </span>
                </button>
              </div>
            </section>
          </main>


          {/* =========================
              오른쪽 패널
          ========================= */}

          <aside
            className={
              styles.sideColumn
            }
          >
            <SourcePanel />

            <AiCheckPanel />

            <TransferInfoPanel />
          </aside>
        </div>
      </div>


      {/* =========================
          실제 전달 성공 후에만
          표시되는 완료 모달
      ========================= */}

      {isCompleteModalOpen && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={
              styles.completeModal
            }
          >
            <button
              type="button"
              className={
                styles.modalCloseButton
              }
              aria-label="닫기"
              onClick={
                handleCloseCompleteModal
              }
            >
              <img
                src={
                  closeIcon
                }
                alt=""
              />
            </button>


            <h2
              className={
                styles.modalTitle
              }
            >
              인수인계 전달 완료
            </h2>


            <img
              src={
                successCheckIcon
              }
              alt=""
              className={
                styles.successCheckIcon
              }
            />


            <p
              className={
                styles.modalDescription
              }
            >
              인수인계 전달이 완료되었습니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}


export default HandoverDashboard;