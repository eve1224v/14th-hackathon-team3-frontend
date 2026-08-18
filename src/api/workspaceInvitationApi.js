const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.likelion-bato.cloud";

/* =========================================
   워크스페이스 초대 참여

   POST
   /api/v1/workspace-invitations/join
========================================= */

export const joinWorkspace = async ({
  inviteToken,
  name,
  companyName,
  teamName,
  jobTitle,
}) => {
  const accessToken = localStorage.getItem("accessToken");

  /* =========================================
     로그인 확인
  ========================================= */

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  /* =========================================
     API 요청
  ========================================= */

  const response = await fetch(
    `${API_BASE_URL}/api/v1/workspace-invitations/join`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify({
        inviteToken,
        name,
        companyName,
        teamName,
        jobTitle: jobTitle || "",
      }),
    },
  );

  /* =========================================
     응답 처리
  ========================================= */

  const result = await response.json().catch(() => null);

  /* =========================================
     실패
  ========================================= */

  if (!response.ok) {
    const error = new Error(
      result?.message || "워크스페이스 참여에 실패했습니다.",
    );

    error.status = response.status;
    error.code = result?.code;
    error.data = result?.data;

    throw error;
  }

  /* =========================================
     성공
  ========================================= */

  return result;
};
