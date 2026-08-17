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
   활동 상태 변경

   PATCH
   /api/v1/users/me/activity-status

   ACTIVE = 활동 중
   OFF = 퇴근 / 방해금지
========================================= */

export const updateActivityStatus = async (status) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/users/me/activity-status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  return parseResponse(response);
};

export const getActivityStatus = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/users/me/activity-status`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseResponse(response);
};

export const getUserLanguage = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/me/language`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response);
};

export const updateUserLanguage = async (language) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/users/me/language`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify({
      language,
    }),
  });

  return parseResponse(response);
};
