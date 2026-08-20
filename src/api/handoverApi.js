import axiosInstance from "./axios";


/* ==================================================
   AI 인수인계 초안 생성

   POST
   /api/v1/projects/{projectId}/cycles/{cycleId}/handovers
================================================== */

export const createHandoverDraft = async (
  projectId,
  cycleId,
  {
    sourceRange,
  },
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/projects/${projectId}/cycles/${cycleId}/handovers`,
      {
        sourceRange,
      },
    );


  const handoverId =
    response.data?.data?.handoverId;


  if (handoverId) {
    localStorage.setItem(
      "handoverId",
      String(handoverId),
    );

    localStorage.setItem(
      "handoverProjectId",
      String(projectId),
    );

    localStorage.setItem(
      "handoverCycleId",
      String(cycleId),
    );
  }


  return response.data;
};


/* ==================================================
   AI 인수인계 전체 조회

   GET
   /api/v1/handovers/{handoverId}
================================================== */

export const getHandover = async (
  handoverId,
) => {
  const response =
    await axiosInstance.get(
      `/api/v1/handovers/${handoverId}`,
    );


  return response.data;
};


/* ==================================================
   인수인계 초안 일괄 저장

   PUT
   /api/v1/handovers/{handoverId}/draft

   - 항목 추가
   - 항목 수정
   - 항목 삭제
   - 전달 정보 수정
================================================== */

export const saveHandoverDraft = async (
  handoverId,
  {
    items,
    removedItemIds = [],
    delivery,
    version,
  },
) => {
  const response =
    await axiosInstance.put(
      `/api/v1/handovers/${handoverId}/draft`,
      {
        items,
        removedItemIds,
        delivery,
        version,
      },
    );


  return response.data;
};


/* ==================================================
   AI 최신 활동 재반영

   POST
   /api/v1/handovers/{handoverId}/refresh
================================================== */

export const refreshHandover = async (
  handoverId,
  {
    preserveManualEdits = true,
  } = {},
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/handovers/${handoverId}/refresh`,
      {
        preserveManualEdits,
      },
    );


  return response.data;
};


/* ==================================================
   인수인계 전달

   POST
   /api/v1/handovers/{handoverId}/deliver
================================================== */

export const deliverHandover = async (
  handoverId,
  {
    version,
    acknowledgeReviewAlerts,
    deliveryRequestId,
  },
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/handovers/${handoverId}/deliver`,
      {
        version,
        acknowledgeReviewAlerts,
        deliveryRequestId,
      },
    );


  return response.data;
};
