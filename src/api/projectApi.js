const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.likelion-bato.cloud";

/* =========================================
   공통 응답 처리
========================================= */

const parseResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "요청 처리 중 오류가 발생했습니다.",
    );

    error.status = response.status;
    error.code = data?.code;
    error.data = data?.data;

    throw error;
  }

  return data;
};

/* =========================================
   프로젝트 생성

   POST
   /api/v1/workspaces/{workspaceId}/projects
========================================= */

export const createProject = async ({
  workspaceId,
  name,
  objective,
  startDate,
  endDate,
  participatingCompanies,
}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!workspaceId) {
    const error = new Error("워크스페이스 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/projects`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        name,
        objective,
        startDate,
        endDate,
        participatingCompanies,
      }),
    },
  );

  return parseResponse(response);
};

export const getProjects = async ({ workspaceId, status, keyword }) => {
  const accessToken = localStorage.getItem("accessToken");

  const params = new URLSearchParams();

  if (status) {
    params.append("status", status);
  }

  if (keyword) {
    params.append("keyword", keyword);
  }

  const queryString = params.toString();

  const url =
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/projects` +
    (queryString ? `?${queryString}` : "");

  const response = await fetch(url, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "프로젝트 목록 조회에 실패했습니다.",
    );

    error.status = response.status;

    error.code = result.code;

    throw error;
  }

  return result;
};

export const getProjectDetail = async (projectId) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result.message || "프로젝트 정보를 불러오지 못했습니다.",
    );

    error.status = response.status;

    error.code = result.code;

    throw error;
  }

  return result;
};

/* ========================================
   프로젝트 멤버 조회
   GET /api/v1/projects/{projectId}/members
======================================== */

export const getProjectMembers = async (
  projectId,
  { companyId, status } = {},
) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!projectId) {
    const error = new Error("프로젝트 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  const params = new URLSearchParams();

  if (companyId) {
    params.append("companyId", companyId);
  }

  if (status) {
    params.append("status", status);
  }

  const queryString = params.toString();

  const url =
    `${API_BASE_URL}/api/v1/projects/${projectId}/members` +
    (queryString ? `?${queryString}` : "");

  const response = await fetch(url, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response);
};

/* ========================================
   프로젝트 멤버 일괄 관리

   PUT
   /api/v1/projects/{projectId}/members
======================================== */

export const manageProjectMembers = async (projectId, actions) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!projectId) {
    const error = new Error("프로젝트 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    const error = new Error("처리할 멤버 작업이 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/members`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        actions,
      }),
    },
  );

  return parseResponse(response);
};

/* ========================================
   프로젝트 팀 시간대 설정 저장

   PUT
   /api/v1/projects/{projectId}/team-settings
======================================== */

export const updateProjectTeamSettings = async (projectId, teams) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!projectId) {
    const error = new Error("프로젝트 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  if (!Array.isArray(teams) || teams.length === 0) {
    const error = new Error("저장할 팀 설정이 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/team-settings`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        teams,
      }),
    },
  );

  return parseResponse(response);
};

/* ========================================
   프로젝트 외부 서비스 연동 일괄 관리

   PUT
   /api/v1/projects/{projectId}/integrations
======================================== */

export const manageProjectIntegrations = async (projectId, actions) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!projectId) {
    const error = new Error("프로젝트 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  if (!Array.isArray(actions) || actions.length === 0) {
    const error = new Error("처리할 외부 연동 작업이 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/integrations`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        actions,
      }),
    },
  );

  return parseResponse(response);
};

/* ========================================
   프로젝트 수정 / 종료

   PUT
   /api/v1/projects/{projectId}
======================================== */

export const updateProject = async (
  projectId,
  {
    name,
    objective,
    startDate,
    endDate,
    participatingCompanies,
    status,
    version,
  },
) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  if (!projectId) {
    const error = new Error("프로젝트 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify({
      name,
      objective,
      startDate,
      endDate,
      participatingCompanies,
      status,
      version,
    }),
  });

  return parseResponse(response);
};
