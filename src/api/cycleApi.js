import axiosInstance from "./axios";


/* =========================
   사이클 생성

   사용자가 사이클 페이지에서
   직접 새 사이클을 추가할 때 사용

   프로젝트 최초 생성 시
   백엔드가 자동 생성하는 흐름과는 별개
========================= */

export const createCycle = async (
  projectId,
  data
) => {
  const response =
    await axiosInstance.post(
      `/api/v1/projects/${projectId}/cycles`,
      data
    );

  return response.data;
};


/* =========================
   사이클 리스트 조회
========================= */

export const getCycles = async (
  projectId,
  status
) => {
  const response =
    await axiosInstance.get(
      `/api/v1/projects/${projectId}/cycles`,
      {
        params: status
          ? {
              status,
            }
          : undefined,
      }
    );

  return response.data;
};


/* =========================
   사이클 상세 조회
========================= */

export const getCycle = async (
  cycleId
) => {
  const response =
    await axiosInstance.get(
      `/api/v1/cycles/${cycleId}`
    );

  return response.data;
};


/* =========================
   사이클 수정
========================= */

export const updateCycle = async (
  cycleId,
  data
) => {
  const response =
    await axiosInstance.put(
      `/api/v1/cycles/${cycleId}`,
      data
    );

  return response.data;
};


/* =========================
   사이클 삭제
========================= */

export const deleteCycle = async (
  cycleId
) => {
  const response =
    await axiosInstance.delete(
      `/api/v1/cycles/${cycleId}`
    );

  return response.data;
};


/* =========================
   사이클 상태 변경
========================= */

export const updateCycleStatus =
  async (
    cycleId,
    {
      status,
      moveUnfinishedIssues = false,
      targetCycleId,
    }
  ) => {
    const response =
      await axiosInstance.put(
        `/api/v1/cycles/${cycleId}/status`,
        {
          status,

          ...(status ===
          "COMPLETED"
            ? {
                moveUnfinishedIssues,

                ...(moveUnfinishedIssues
                  ? {
                      targetCycleId,
                    }
                  : {}),
              }
            : {}),
        }
      );

    return response.data;
  };


/* =========================
   사이클 활동 기록 조회
========================= */

export const getCycleActivities =
  async (
    cycleId,
    {
      type,
      page = 0,
      size = 100,
    } = {}
  ) => {
    const response =
      await axiosInstance.get(
        `/api/v1/cycles/${cycleId}/activities`,
        {
          params: {
            ...(type
              ? {
                  type,
                }
              : {}),

            page,
            size,
          },
        }
      );

    return response.data;
  };


/* =========================
   사이클 AI 분석 조회
========================= */

export const getCycleAiAnalysis =
  async (
    cycleId
  ) => {
    const response =
      await axiosInstance.get(
        `/api/v1/cycles/${cycleId}/ai-analysis`
      );

    return response.data;
  };


/* =========================
   사이클 AI 분석 실행/재실행
========================= */

export const rerunCycleAiAnalysis =
  async (
    cycleId,
    force = false
  ) => {
    const response =
      await axiosInstance.post(
        `/api/v1/cycles/${cycleId}/ai-analysis`,
        {
          force,
        }
      );

    return response.data;
  };