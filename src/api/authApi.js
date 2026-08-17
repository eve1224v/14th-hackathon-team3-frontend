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
   로그인

   POST
   /api/v1/auth/login
========================================= */

export const login = async (email, password) => {
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

/* =========================================
   로그아웃

   POST
   /api/v1/auth/logout
========================================= */

export const logout = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    const error = new Error("로그인 정보가 없습니다.");

    error.status = 401;

    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response);
};

export const requestPasswordReset = async (email) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/password-reset/request`,
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

export const verifyPasswordReset = async ({ email, verificationCode }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/password-reset/verify`,
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

export const resetPassword = async ({
  email,
  resetToken,
  newPassword,
  newPasswordConfirm,
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/password-reset`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      resetToken,
      newPassword,
      newPasswordConfirm,
    }),
  });

  return parseResponse(response);
};
