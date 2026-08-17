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
   워크스페이스 목록 조회

   GET
   /api/v1/workspaces
========================================= */

export const getWorkspaces = async (status) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const queryString = status ? `?status=${encodeURIComponent(status)}` : "";

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspaces${queryString}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseResponse(response);
};

/* =========================================
   워크스페이스 생성

   POST
   /api/v1/workspaces
========================================= */

export const createWorkspace = async ({
  name,
  companyName,
  companyCountryCode,
  collaboratingCompanies = [],
  inviteeEmails = [],
}) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/workspaces`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify({
      name,
      companyName,
      companyCountryCode,
      collaboratingCompanies,
      inviteeEmails,
    }),
  });

  return parseResponse(response);
};

/* =========================================
   워크스페이스 상세 조회

   GET
   /api/v1/workspaces/{workspaceId}
========================================= */

export const getWorkspaceDetail = async (workspaceId) => {
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
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseResponse(response);
};

/* =========================================
   워크스페이스 초대 생성

   POST
   /api/v1/workspaces/{workspaceId}/invitations
========================================= */

export const createWorkspaceInvitation = async ({
  workspaceId,
  type,
  emails = [],
  role = "MEMBER",
  expiresInHours = 72,
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

  const requestBody = {
    type,
    role,
    expiresInHours,
  };

  if (type === "EMAIL") {
    requestBody.emails = emails;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/invitations`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify(requestBody),
    },
  );

  return parseResponse(response);
};
