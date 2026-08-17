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
   내 프로필 조회

   GET
   /api/v1/workspaces/{workspaceId}/members/me/profile
========================================= */

export const getMyProfile = async (workspaceId) => {
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
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/members/me/profile`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseResponse(response);
};

export const updateMyProfile = async (
  workspaceId,
  { name, companyName, teamName, jobTitle },
) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/members/me/profile`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        name,
        companyName,
        teamName,
        jobTitle,
      }),
    },
  );

  return parseResponse(response);
};
