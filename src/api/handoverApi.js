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
    sourceTypes,
  }
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/projects/${projectId}/cycles/${cycleId}/handovers`,
      {
        sourceRange,
        sourceTypes,
      }
    );


  /*
    초안 생성 성공 응답

    data: {
      handoverId,
      generationJobId,
      status
    }

    이후 전체 조회 / 갱신 / 전달에서
    같은 handoverId가 필요하므로 저장
  */

  const handoverId =
    response.data?.data
      ?.handoverId;


  if (handoverId) {
    localStorage.setItem(
      "handoverId",
      String(handoverId)
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
  handoverId
) => {
  const response =
    await axiosInstance.get(
      `/api/v1/handovers/${handoverId}`
    );


  return response.data;
};


/* ==================================================
   AI 최신 활동 재반영

   POST
   /api/v1/handovers/{handoverId}/refresh

   sourceTypes
   - 선택값
   - 미입력 시 전체 협업 도구

   preserveManualEdits
   - 선택값
   - 사용자 수정 내용 보존 여부
================================================== */

export const refreshHandover = async (
  handoverId,
  {
    sourceTypes,
    preserveManualEdits = true,
  } = {}
) => {
  const requestData = {
    preserveManualEdits,
  };


  /*
    명세상 sourceTypes는 선택값.

    화면에서 특정 협업 도구를
    선택하는 UI가 없기 때문에
    값이 있을 때만 전송.

    미입력 시 서버가 전체 협업 도구를 갱신함.
  */

  if (
    Array.isArray(sourceTypes) &&
    sourceTypes.length > 0
  ) {
    requestData.sourceTypes =
      sourceTypes;
  }


  const response =
    await axiosInstance.post(
      `/api/v1/handovers/${handoverId}/refresh`,
      requestData
    );


  return response.data;
};


/* ==================================================
   인수인계 전달

   POST
   /api/v1/handovers/{handoverId}/deliver

   필수
   - version
   - acknowledgeReviewAlerts
   - deliveryRequestId
================================================== */

export const deliverHandover = async (
  handoverId,
  {
    version,
    acknowledgeReviewAlerts,
    deliveryRequestId,
  }
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/handovers/${handoverId}/deliver`,
      {
        version,
        acknowledgeReviewAlerts,
        deliveryRequestId,
      }
    );


  return response.data;
};