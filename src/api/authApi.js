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
    throw {
      status: response.status,
      code: data?.code,
      message: data?.message || "요청 처리 중 오류가 발생했습니다.",
      data: data?.data,
    };
  }

  return data;
};

/* =========================================
   로그인
========================================= */

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  return parseResponse(response);
};

/* =========================================
   이메일 인증번호 요청

   POST
   /api/v1/auth/email-verifications
========================================= */

export const requestEmailVerification = async (email) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/email-verifications`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
      }),
    },
  );

  return parseResponse(response);
};

/* =========================================
   이메일 인증번호 검증

   POST
   /api/v1/auth/email-verifications/verify
========================================= */

export const verifyEmailVerification = async ({ email, verificationCode }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/email-verifications/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        verificationCode,
      }),
    },
  );

  return parseResponse(response);
};
