// src/api/messageApi.js

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
   메시지 상대 조회
   기존 조직도 조회 API 재사용

   GET
   /api/v1/workspaces/{workspaceId}/organization-chart
========================================= */

export const getMessageRecipients = async (workspaceId) => {
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
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/organization-chart`,
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
   최근 대화 조회

   GET
   /api/v1/workspaces/{workspaceId}/conversations/recent
========================================= */

export const getRecentConversations = async (workspaceId) => {
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
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/conversations/recent`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return parseResponse(response);
};

/* =========================================
   1:1 대화방 조회 / 생성

   POST
   /api/v1/workspaces/{workspaceId}/conversations/direct
========================================= */

export const getOrCreateDirectConversation = async (
  workspaceId,
  targetMemberId,
) => {
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

  if (!targetMemberId) {
    const error = new Error("대화 상대 정보가 없습니다.");

    error.status = 400;

    throw error;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspaces/${workspaceId}/conversations/direct`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        targetMemberId,
      }),
    },
  );

  return parseResponse(response);
};
