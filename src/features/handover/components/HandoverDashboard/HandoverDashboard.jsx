import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import AiCheckPanel from "../AiCheckPanel/AiCheckPanel";
import TransferInfoPanel from "../TransferInfoPanel/TransferInfoPanel";

import {
  ROUTES,
} from "../../../../router/routes.constant";

import {
  createHandoverDraft,
  getHandover,
  refreshHandover,
  saveHandoverDraft,
  deliverHandover,
} from "../../../../api/handoverApi";

import {
  getCycle,
  getCycles,
} from "../../../../api/cycleApi";

import {
  getProjectDetail,
} from "../../../../api/projectApi";


/* ==================================================
   Category
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


const defaultReviewSummary = [
  {
    label: "확인 완료",
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
   Cycle 정렬
================================================== */

const sortCyclesByPeriod = (
  cycles,
) => {
  return [...cycles].sort(
    (a, b) => {
      const startCompare =
        String(
          a.startDate || "",
        ).localeCompare(
          String(
            b.startDate || "",
          ),
        );


      if (
        startCompare !== 0
      ) {
        return startCompare;
      }


      const endCompare =
        String(
          a.endDate || "",
        ).localeCompare(
          String(
            b.endDate || "",
          ),
        );


      if (
        endCompare !== 0
      ) {
        return endCompare;
      }


      return (
        Number(
          a.cycleId || 0,
        ) -
        Number(
          b.cycleId || 0,
        )
      );
    },
  );
};


/* ==================================================
   상대 시간
================================================== */

const getRelativeTimeText = (
  dateString,
) => {
  if (!dateString) {
    return "";
  }


  const syncedDate =
    new Date(
      dateString,
    );


  const now =
    new Date();


  const diffMinutes =
    Math.max(
      0,
      Math.floor(
        (
          now.getTime() -
          syncedDate.getTime()
        ) /
          (1000 * 60),
      ),
    );


  if (
    diffMinutes < 1
  ) {
    return "방금 전";
  }


  if (
    diffMinutes < 60
  ) {
    return `${diffMinutes}분 전`;
  }


  const diffHours =
    Math.floor(
      diffMinutes / 60,
    );


  if (
    diffHours < 24
  ) {
    return `${diffHours}시간 전`;
  }


  return `${Math.floor(
    diffHours / 24,
  )}일 전`;
};


/* ==================================================
   Polling
================================================== */

const wait = (
  milliseconds,
) =>
  new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds,
      );
    },
  );


/* ==================================================
   Timezone 날짜 계산
================================================== */

const getDatePartsInTimezone = (
  date,
  timezone,
) => {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hourCycle:
          "h23",
      },
    );


  const values = {};


  formatter
    .formatToParts(
      date,
    )
    .forEach(
      (part) => {
        if (
          part.type !==
          "literal"
        ) {
          values[
            part.type
          ] =
            Number(
              part.value,
            );
        }
      },
    );


  return values;
};


const buildDateTimeWithOffset = (
  dateString,
  timezone,
  isEnd = false,
) => {
  const [
    year,
    month,
    day,
  ] =
    String(
      dateString,
    )
      .split("-")
      .map(Number);


  if (
    !year ||
    !month ||
    !day
  ) {
    throw new Error(
      "Cycle 날짜 정보가 올바르지 않습니다.",
    );
  }


  const hour =
    isEnd ? 23 : 0;

  const minute =
    isEnd ? 59 : 0;

  const second =
    isEnd ? 59 : 0;


  const targetAsUtc =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
    );


  let instant =
    targetAsUtc;


  for (
    let index = 0;
    index < 3;
    index += 1
  ) {
    const parts =
      getDatePartsInTimezone(
        new Date(
          instant,
        ),
        timezone,
      );


    const timezoneAsUtc =
      Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
      );


    const difference =
      targetAsUtc -
      timezoneAsUtc;


    instant +=
      difference;


    if (
      difference === 0
    ) {
      break;
    }
  }


  const offsetMinutes =
    Math.round(
      (
        targetAsUtc -
        instant
      ) /
        (1000 * 60),
    );


  const sign =
    offsetMinutes >= 0
      ? "+"
      : "-";


  const absoluteOffset =
    Math.abs(
      offsetMinutes,
    );


  const offsetHour =
    String(
      Math.floor(
        absoluteOffset / 60,
      ),
    ).padStart(
      2,
      "0",
    );


  const offsetMinute =
    String(
      absoluteOffset % 60,
    ).padStart(
      2,
      "0",
    );


  const time =
    isEnd
      ? "23:59:59"
      : "00:00:00";


  return `${dateString}T${time}${sign}${offsetHour}:${offsetMinute}`;
};


/* ==================================================
   Error
================================================== */

const getErrorMessage = (
  error,
) =>
  error.response?.data?.message ||
  error.data?.message ||
  error.message ||
  "AI 인수인계 요청에 실패했습니다.";


/* ==================================================
   GET item → PUT draft item
================================================== */

const buildDraftItems = (
  items,
) => {
  return (
    Array.isArray(
      items,
    )
      ? items
      : []
  ).map(
    (item) => {
      let evidenceIds =
        [];


      if (
        Array.isArray(
          item.evidenceIds,
        )
      ) {
        evidenceIds =
          item.evidenceIds;
      } else if (
        Array.isArray(
          item.evidences,
        )
      ) {
        evidenceIds =
          item.evidences
            .map(
              (evidence) =>
                evidence
                  ?.evidenceId,
            )
            .filter(
              (id) =>
                id !== null &&
                id !== undefined,
            );
      }


      return {
        itemId:
          item.itemId ??
          null,

        category:
          item.category,

        title:
          item.title || "",

        description:
          item.description ||
          "",

        assigneeMemberId:
          item.assigneeMemberId ??
          null,

        evidenceIds,

        reviewStatus:
          item.reviewStatus ||
          "NEEDS_REVIEW",
      };
    },
  );
};


function HandoverDashboard() {
  const navigate =
    useNavigate();


  const isUnmountedRef =
    useRef(false);


  const initializeStartedRef =
    useRef(false);


  const [
    handoverData,
    setHandoverData,
  ] = useState(null);


  const [
    reviewSummary,
    setReviewSummary,
  ] = useState(
    defaultReviewSummary,
  );


  const [
    projectName,
    setProjectName,
  ] = useState(
    localStorage.getItem(
      "projectName",
    ) ||
      "프로젝트",
  );


  const [
    cycleLabel,
    setCycleLabel,
  ] = useState(
    "Cycle",
  );


  const [
    deliveryDraft,
    setDeliveryDraft,
  ] = useState(null);


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const [
    isSavingDraft,
    setIsSavingDraft,
  ] = useState(false);


  const [
    isDelivering,
    setIsDelivering,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const [
    isCompleteModalOpen,
    setIsCompleteModalOpen,
  ] = useState(false);


  /* ==================================================
     Handover 데이터 적용
  ================================================== */

  const applyHandoverData =
    useCallback(
      (data) => {
        if (!data) {
          return;
        }


        if (
          data.handoverId
        ) {
          localStorage.setItem(
            "handoverId",
            String(
              data.handoverId,
            ),
          );
        }


        setHandoverData(
          data,
        );


        setDeliveryDraft(data.delivery ?? null);


        const summary =
          data.reviewSummary;


        if (summary) {
          setReviewSummary([
            {
              label:
                "확인 완료",

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
      },
      [],
    );


  const getCurrentHandoverId =
    useCallback(
      () =>
        handoverData
          ?.handoverId ||
        localStorage.getItem(
          "handoverId",
        ),
      [
        handoverData,
      ],
    );


  /* ==================================================
     GET polling
  ================================================== */

  const fetchHandoverUntilReady =
    useCallback(
      async (
        handoverId,
      ) => {
        const MAX_ATTEMPTS =
          30;

        const INTERVAL =
          2000;


        let lastData =
          null;


        for (
          let attempt = 0;
          attempt <
          MAX_ATTEMPTS;
          attempt += 1
        ) {
          if (
            isUnmountedRef.current
          ) {
            return null;
          }


          try {
            const response =
              await getHandover(
                handoverId,
              );


            console.log(
              "AI 인수인계 전체 조회:",
              response,
            );


            const data =
              response?.data;


            if (data) {
              lastData =
                data;


              applyHandoverData(
                data,
              );


              const generationStatus =
                data.generation
                  ?.status;


              if (
                generationStatus ===
                "COMPLETED"
              ) {
                return data;
              }


              if (
                generationStatus ===
                "FAILED"
              ) {
                throw new Error(
                  "AI 인수인계 생성에 실패했습니다.",
                );
              }


              /*
                PENDING
                RUNNING
                AI_GENERATING

                → 계속 polling
              */

              const isRunning =
                [
                  "PENDING",
                  "RUNNING",
                  "AI_GENERATING",
                ].includes(
                  generationStatus,
                );


              if (
                !isRunning &&
                data.status &&
                data.status !==
                  "AI_GENERATING"
              ) {
                return data;
              }
            }
          } catch (error) {
            const status =
              error.response
                ?.status ||
              error.status;


            if (
              status !== 404 ||
              attempt ===
                MAX_ATTEMPTS -
                  1
            ) {
              throw error;
            }
          }


          await wait(
            INTERVAL,
          );
        }


        return lastData;
      },
      [
        applyHandoverData,
      ],
    );


  /* ==================================================
     최초 진입

     handoverId가 없으면 자동 생성
  ================================================== */

  useEffect(() => {
    /*
      React StrictMode 대응
    */

    isUnmountedRef.current =
      false;


    if (
      initializeStartedRef.current
    ) {
      return () => {
        isUnmountedRef.current =
          true;
      };
    }


    initializeStartedRef.current =
      true;


    const initializeHandover =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId",
          );


        const cycleId =
          localStorage.getItem(
            "cycleId",
          );


        if (!projectId) {
          setErrorMessage(
            "선택된 프로젝트가 없습니다.",
          );

          return;
        }


        if (!cycleId) {
          setErrorMessage(
            "선택된 Cycle이 없습니다. 사이클 페이지에서 Cycle을 먼저 선택해주세요.",
          );

          return;
        }


        try {
          setIsLoading(
            true,
          );

          setErrorMessage(
            "",
          );


          /* =========================
             프로젝트 Cycle 목록
          ========================= */

          const cycleListResponse =
            await getCycles(
              projectId,
            );


          const cycleList =
            Array.isArray(
              cycleListResponse
                ?.data,
            )
              ? cycleListResponse
                  .data
              : [];


          const sortedCycles =
            sortCyclesByPeriod(
              cycleList,
            );


          const selectedCycleIndex =
            sortedCycles.findIndex(
              (cycle) =>
                Number(
                  cycle.cycleId,
                ) ===
                Number(
                  cycleId,
                ),
            );


          if (
            selectedCycleIndex <
            0
          ) {
            throw new Error(
              "선택한 Cycle이 현재 프로젝트에 속하지 않습니다.",
            );
          }


          setCycleLabel(
            `Cycle ${
              selectedCycleIndex +
              1
            }`,
          );


          const [
            cycleResponse,
            projectResponse,
          ] =
            await Promise.all([
              getCycle(
                cycleId,
              ),

              getProjectDetail(
                projectId,
              ),
            ]);


          const cycleData =
            cycleResponse
              ?.data;


          const projectData =
            projectResponse
              ?.data;


          if (
            !cycleData ||
            !projectData
          ) {
            throw new Error(
              "프로젝트 또는 Cycle 정보를 불러오지 못했습니다.",
            );
          }


          if (
            projectData.name
          ) {
            setProjectName(
              projectData.name,
            );

            localStorage.setItem(
              "projectName",
              projectData.name,
            );
          }


          /* =========================
             기존 handoverId
          ========================= */

          const existingHandoverId =
            localStorage.getItem(
              "handoverId",
            );


          const handoverProjectId =
            localStorage.getItem(
              "handoverProjectId",
            );


          const handoverCycleId =
            localStorage.getItem(
              "handoverCycleId",
            );


          const isSameHandover =
            existingHandoverId &&
            handoverProjectId ===
              String(
                projectId,
              ) &&
            handoverCycleId ===
              String(
                cycleId,
              );


          if (
            isSameHandover
          ) {
            console.log(
              "기존 인수인계 조회:",
              existingHandoverId,
            );


            await fetchHandoverUntilReady(
              existingHandoverId,
            );


            return;
          }


          /* =========================
             현재 프로젝트/Cycle에
             handoverId가 없으므로 생성
          ========================= */

          localStorage.removeItem(
            "handoverId",
          );

          localStorage.removeItem(
            "handoverProjectId",
          );

          localStorage.removeItem(
            "handoverCycleId",
          );


          if (
            !cycleData.startDate ||
            !cycleData.endDate
          ) {
            throw new Error(
              "Cycle 기간 정보가 없습니다.",
            );
          }


          const projectTimezone =
            projectData
              ?.teamSchedules
              ?.find(
                (team) =>
                  team.timezone,
              )
              ?.timezone;


          const timezone =
            projectTimezone ||
            Intl.DateTimeFormat()
              .resolvedOptions()
              .timeZone ||
            "Asia/Seoul";


          const sourceRange = {
            from:
              buildDateTimeWithOffset(
                cycleData.startDate,
                timezone,
                false,
              ),

            to:
              buildDateTimeWithOffset(
                cycleData.endDate,
                timezone,
                true,
              ),
          };


          console.log(
            "AI 인수인계 초안 생성 Payload:",
            {
              projectId:
                Number(
                  projectId,
                ),

              cycleId:
                Number(
                  cycleId,
                ),

              sourceRange,

              sourceTypes: [],
            },
          );


          const draftResponse =
            await createHandoverDraft(
              projectId,
              cycleId,
              {
                sourceRange,
              },
            );


          console.log(
            "AI 인수인계 초안 생성 성공:",
            draftResponse,
          );


          const handoverId =
            draftResponse
              ?.data
              ?.handoverId;


          if (!handoverId) {
            throw new Error(
              "handoverId를 받지 못했습니다.",
            );
          }


          localStorage.setItem(
            "handoverId",
            String(
              handoverId,
            ),
          );

          localStorage.setItem(
            "handoverProjectId",
            String(
              projectId,
            ),
          );

          localStorage.setItem(
            "handoverCycleId",
            String(
              cycleId,
            ),
          );


          await fetchHandoverUntilReady(
            handoverId,
          );
        } catch (error) {
          console.error(
            "AI 인수인계 초기화 실패:",
            error,
          );


          console.error(
            "서버 응답:",
            error.response?.data ||
              error.data,
          );


          setErrorMessage(
            getErrorMessage(
              error,
            ),
          );
        } finally {
          if (
            !isUnmountedRef.current
          ) {
            setIsLoading(
              false,
            );
          }
        }
      };


    initializeHandover();


    return () => {
      isUnmountedRef.current =
        true;
    };
  }, [
    fetchHandoverUntilReady,
  ]);


  /* ==================================================
     화면 Section
  ================================================== */

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
                  category,
              )
              .map(
                (item) => ({
                  itemId:
                    item.itemId,

                  title:
                    item.title ||
                    "",

                  description:
                    item.description ||
                    "",

                  manager:
                    item.assigneeMemberId
                      ? `멤버 ${item.assigneeMemberId}`
                      : "-",

                  evidenceCount:
                    Array.isArray(
                      item.evidences,
                    )
                      ? item
                          .evidences
                          .length
                      : 0,

                  warning:
                    item.reviewStatus !==
                    "VERIFIED",
                }),
              );


          return {
            category,

            number:
              categoryInfo.number,

            title:
              categoryInfo.title,

            count:
              categoryItems.length,

            items:
              categoryItems,
          };
        },
      );
    }, [
      handoverData,
    ]);


  /* ==================================================
     PUT /draft 공통 저장
  ================================================== */

  const saveCurrentDraft =
    useCallback(
      async ({
        items =
          handoverData?.items ??
          [],

        delivery =
          deliveryDraft,
      } = {}) => {
        const handoverId =
          handoverData
            ?.handoverId ||
          localStorage.getItem(
            "handoverId",
          );


        const version =
          handoverData
            ?.version;


        if (!handoverId) {
          throw new Error(
            "handoverId가 없습니다.",
          );
        }


        if (
          version === null ||
          version === undefined
        ) {
          throw new Error(
            "인수인계 version이 없습니다.",
          );
        }


        if (
          !delivery
            ?.targetTeamId ||
          !delivery
            ?.recipientMemberId ||
          !delivery
            ?.timingType ||
          !delivery
            ?.timezone
        ) {
          throw new Error(
            "전달 정보를 먼저 설정해주세요.",
          );
        }


        const request = {
          items:
            buildDraftItems(
              items,
            ),

          removedItemIds:
            [],

          delivery: {
            targetTeamId:
              Number(
                delivery.targetTeamId,
              ),

            recipientMemberId:
              Number(
                delivery.recipientMemberId,
              ),

            timingType:
              delivery.timingType,

            scheduledAt:
              delivery.scheduledAt ??
              null,

            timezone:
              delivery.timezone,
          },

          version:
            Number(
              version,
            ),
        };


        console.log(
          "인수인계 draft 저장 Payload:",
          request,
        );


        try {
          setIsSavingDraft(
            true,
          );

          setErrorMessage(
            "",
          );


          const response =
            await saveHandoverDraft(
              handoverId,
              request,
            );


          console.log(
            "인수인계 draft 저장 성공:",
            response,
          );


          /*
            저장 후 GET으로 서버 상태 동기화
          */

          const latestResponse =
            await getHandover(
              handoverId,
            );


          const latestData =
            latestResponse
              ?.data;


          if (latestData) {
            applyHandoverData(
              latestData,
            );


            return latestData;
          }


          /*
            GET에 데이터가 없을 경우
            저장 응답 version이라도 반영
          */

          const savedVersion =
            response?.data
              ?.version;


          const fallbackData = {
            ...handoverData,

            items,

            delivery,

            version:
              savedVersion ??
              version,
          };


          applyHandoverData(
            fallbackData,
          );


          return fallbackData;
        } catch (error) {
          console.error(
            "인수인계 draft 저장 실패:",
            error,
          );


          console.error(
            "서버 응답:",
            error.response?.data ||
              error.data,
          );


          setErrorMessage(
            getErrorMessage(
              error,
            ),
          );


          throw error;
        } finally {
          setIsSavingDraft(
            false,
          );
        }
      },
      [
        handoverData,
        deliveryDraft,
        applyHandoverData,
      ],
    );


  /* ==================================================
     전달 정보 변경
  ================================================== */

  const handleDeliveryChange =
    useCallback(
      (delivery) => {
        setDeliveryDraft(
          delivery,
        );
      },
      [],
    );


  const handleDeliverySave =
    useCallback(
      async (
        delivery,
      ) => {
        setDeliveryDraft(
          delivery,
        );


        await saveCurrentDraft({
          delivery,
        });
      },
      [
        saveCurrentDraft,
      ],
    );


  /* ==================================================
     항목 추가

     임시 prompt UI
     +
     PUT /draft
  ================================================== */

  const handleAddItem =
    async (
      category,
    ) => {
      const title =
        window.prompt(
          "인수인계 항목 제목을 입력해주세요.",
        );


      if (
        !title?.trim()
      ) {
        return;
      }


      const description =
        window.prompt(
          "인수인계 항목 내용을 입력해주세요.",
        );


      if (
        !description?.trim()
      ) {
        return;
      }


      const newItem = {
        itemId:
          null,

        category,

        title:
          title.trim(),

        description:
          description.trim(),

        assigneeMemberId:
          null,

        evidenceIds:
          [],

        evidences:
          [],

        reviewStatus:
          "NEEDS_REVIEW",
      };


      const nextItems = [
        ...(handoverData
          ?.items ?? []),

        newItem,
      ];


      try {
        await saveCurrentDraft({
          items:
            nextItems,
        });
      } catch {
        // errorMessage에서 표시
      }
    };


  /* ==================================================
     항목 수정

     임시 prompt UI
     +
     PUT /draft
  ================================================== */

  const handleEditItem =
    async (
      itemId,
    ) => {
      const items =
        handoverData
          ?.items ?? [];


      const target =
        items.find(
          (item) =>
            Number(
              item.itemId,
            ) ===
            Number(
              itemId,
            ),
        );


      if (!target) {
        return;
      }


      const title =
        window.prompt(
          "제목을 수정해주세요.",
          target.title ||
            "",
        );


      if (
        title === null
      ) {
        return;
      }


      const description =
        window.prompt(
          "내용을 수정해주세요.",
          target.description ||
            "",
        );


      if (
        description ===
        null
      ) {
        return;
      }


      if (
        !title.trim() ||
        !description.trim()
      ) {
        alert(
          "제목과 내용은 비워둘 수 없습니다.",
        );

        return;
      }


      const nextItems =
        items.map(
          (item) =>
            Number(
              item.itemId,
            ) ===
            Number(
              itemId,
            )
              ? {
                  ...item,

                  title:
                    title.trim(),

                  description:
                    description.trim(),
                }
              : item,
        );


      try {
        await saveCurrentDraft({
          items:
            nextItems,
        });
      } catch {
        // errorMessage에서 표시
      }
    };


  /* ==================================================
     Refresh
  ================================================== */

  const handleRefresh =
    async () => {
      const handoverId =
        getCurrentHandoverId();


      if (
        !handoverId ||
        isRefreshing
      ) {
        return;
      }


      try {
        setIsRefreshing(
          true,
        );

        setErrorMessage(
          "",
        );


        const response =
          await refreshHandover(
            handoverId,
            {
              preserveManualEdits:
                true,
            },
          );


        console.log(
          "AI 최신 활동 재반영 성공:",
          response,
        );


        await fetchHandoverUntilReady(
          response?.data
            ?.handoverId ||
            handoverId,
        );
      } catch (error) {
        setErrorMessage(
          getErrorMessage(
            error,
          ),
        );
      } finally {
        setIsRefreshing(
          false,
        );
      }
    };


  /* ==================================================
     최종 전달

     draft 저장
     ↓
     최신 version
     ↓
     deliver
  ================================================== */

  const handleDeliverHandover =
    async () => {
      if (
        isDelivering
      ) {
        return;
      }


      try {
        setIsDelivering(
          true,
        );

        setErrorMessage(
          "",
        );


        /*
          전달 직전 현재 화면 상태 저장
        */

        const savedData =
          await saveCurrentDraft();


        const handoverId =
          savedData
            ?.handoverId ||
          getCurrentHandoverId();


        const version =
          savedData
            ?.version;

        if (!savedData?.delivery) {
          throw new Error("전달 정보를 먼저 저장해주세요.");
        }

        if (!Array.isArray(savedData?.items) || savedData.items.length === 0) {
          throw new Error("전달할 인수인계 항목이 없습니다.");
        }


        if (
          !handoverId ||
          version === null ||
          version === undefined
        ) {
          throw new Error(
            "전달에 필요한 인수인계 정보가 없습니다.",
          );
        }


        const response =
          await deliverHandover(
            handoverId,
            {
              version:
                Number(
                  version,
                ),

              acknowledgeReviewAlerts:
                true,

              deliveryRequestId:
                crypto.randomUUID(),
            },
          );


        console.log(
          "인수인계 전달 성공:",
          response,
        );


        setIsCompleteModalOpen(
          true,
        );
      } catch (error) {
        console.error(
          "인수인계 전달 실패:",
          error,
        );


        setErrorMessage(
          getErrorMessage(
            error,
          ),
        );
      } finally {
        setIsDelivering(
          false,
        );
      }
    };


  const generationStatus =
    handoverData
      ?.generation
      ?.status;


  const generationProgress =
    handoverData
      ?.generation
      ?.progress ??
    0;


  const isGenerating =
    [
      "PENDING",
      "RUNNING",
      "AI_GENERATING",
    ].includes(
      generationStatus,
    );


  const itemCount =
    Array.isArray(
      handoverData?.items,
    )
      ? handoverData.items.length
      : 0;


  const isEmptyDraft =
    Boolean(
      handoverData,
    ) &&
    !isGenerating &&
    itemCount === 0;


  const lastSyncedText =
    getRelativeTimeText(
      handoverData
        ?.lastSyncedAt,
    );


  return (
    <>
      <div
        className={
          styles.dashboard
        }
      >
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
                  cycleLabel
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
                {errorMessage
                  ? errorMessage

                  : isGenerating
                    ? `AI 인수인계를 생성하고 있습니다. (${generationProgress}%)`

                    : isEmptyDraft
                      ? "사이클에 등록된 이슈가 없어 빈 초안이 생성되었습니다."

                    : lastSyncedText
                      ? `AI가 ${lastSyncedText}에 최신 활동을 반영했습니다.`

                      : isLoading
                        ? "AI 인수인계 정보를 불러오는 중입니다."

                        : "AI 최신 활동 정보가 없습니다."}
              </span>
            </div>
          </div>


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
                isRefreshing ||
                isLoading ||
                !handoverData
              }
            >
              {isRefreshing
                ? "반영 중"
                : "새로 고침"}
            </button>


            <button
              type="button"
              className={
                styles.issueButton
              }
              onClick={() =>
                navigate(
                  ROUTES.CREATE_ISSUE,
                )
              }
            >
              새 이슈 등록
            </button>
          </div>
        </header>


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
                  (item) => (
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
                  ),
                )}
              </div>
            </section>


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
                  onClick={() =>
                    navigate(
                      ROUTES.ISSUE,
                    )
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


              <div
                className={
                  styles.taskBoard
                }
              >
                {isEmptyDraft && (
                  <div
                    className={
                      styles.emptyDraftNotice
                    }
                  >
                    <strong>
                      아직 이 사이클에 등록된 이슈가 없습니다.
                    </strong>

                    <p>
                      AI는 이 사이클의 이슈, 진행 상태, 완료 조건을 분석해 인수인계
                      초안을 만듭니다. 이슈를 등록하거나 아래에서 항목을 직접 추가할 수 있습니다.
                    </p>
                  </div>
                )}

                <div
                  className={
                    styles.sectionList
                  }
                >
                  {handoverSections.map(
                    (section) => (
                      <HandoverSection
                        key={
                          section.category
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
                        onAdd={() =>
                          handleAddItem(
                            section.category,
                          )
                        }
                        onEdit={
                          handleEditItem
                        }
                      />
                    ),
                  )}
                </div>
              </div>


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
                    isDelivering ||
                    isSavingDraft ||
                    isLoading ||
                    !handoverData
                  }
                >
                  <span
                    className={
                      styles.transferText
                    }
                  >
                    {isDelivering ||
                    isSavingDraft
                      ? "처리 중..."
                      : "인수인계 전달 →"}
                  </span>
                </button>
              </div>
            </section>
          </main>


          <aside
            className={
              styles.sideColumn
            }
          >
            <AiCheckPanel
              items={handoverData?.items ?? []}
              reviewSummary={handoverData?.reviewSummary ?? null}
            />


            <TransferInfoPanel
              initialDelivery={
                handoverData
                  ?.delivery ??
                null
              }
              onChange={
                handleDeliveryChange
              }
              onSave={
                handleDeliverySave
              }
            />
          </aside>
        </div>
      </div>


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
              onClick={() =>
                navigate(
                  ROUTES.DASHBOARD,
                )
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