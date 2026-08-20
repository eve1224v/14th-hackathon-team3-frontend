import axiosInstance from "./axios";


/* =========================
   이슈 생성
========================= */

export const createIssue =
  async (
    data
  ) => {
    const response =
      await axiosInstance.post(
        "/api/v1/issues",
        data
      );


    return response.data;
  };


/* =========================
   이슈 리스트 조회
========================= */

export const getIssues =
  async (
    cycleId,
    {
      status,
      priority,
      assigneeId,
      keyword,
      sort = "createdAt,desc",
      page = 0,
      size = 20,
    } = {}
  ) => {
    const params =
      new URLSearchParams();


    if (
      Array.isArray(
        status
      )
    ) {
      status.forEach(
        (
          value
        ) => {
          if (
            value
          ) {
            params.append(
              "status",
              value
            );
          }
        }
      );
    } else if (
      status
    ) {
      params.append(
        "status",
        status
      );
    }


    if (
      priority
    ) {
      params.append(
        "priority",
        priority
      );
    }


    if (
      assigneeId !==
        undefined &&
      assigneeId !==
        null &&
      assigneeId !==
        ""
    ) {
      params.append(
        "assigneeId",
        assigneeId
      );
    }


    if (
      keyword
    ) {
      params.append(
        "keyword",
        keyword
      );
    }


    if (
      sort
    ) {
      params.append(
        "sort",
        sort
      );
    }


    params.append(
      "page",
      page
    );


    params.append(
      "size",
      size
    );


    const response =
      await axiosInstance.get(
        `/api/v1/cycles/${cycleId}/issues`,
        {
          params,
        }
      );


    return response.data;
  };


/* =========================
   이슈 상세 조회
========================= */

export const getIssue =
  async (
    issueId
  ) => {
    const response =
      await axiosInstance.get(
        `/api/v1/issues/${issueId}`
      );


    return response.data;
  };


/* =========================
   이슈 수정
========================= */

export const updateIssue =
  async (
    issueId,
    data
  ) => {
    const response =
      await axiosInstance.put(
        `/api/v1/issues/${issueId}`,
        data
      );


    return response.data;
  };


/* ==================================================
   이슈 상태 변경

   아래 두 형태 모두 지원

   updateIssueStatus(
     issueId,
     "IN_PROGRESS"
   )

   또는

   updateIssueStatus(
     issueId,
     {
       status: "IN_PROGRESS"
     }
   )

   실제 서버 요청은 항상

   {
     status,
     comment
   }

   형태로 전송
================================================== */

export const updateIssueStatus =
  async (
    issueId,
    statusOrData,
    comment = ""
  ) => {
    const requestData =
      typeof statusOrData ===
      "string"
        ? {
            status:
              statusOrData,

            comment,
          }
        : {
            ...statusOrData,

            comment:
              statusOrData
                ?.comment ??
              comment,
          };


    const response =
      await axiosInstance.put(
        `/api/v1/issues/${issueId}/status`,
        requestData
      );


    return response.data;
  };


/* ==================================================
   완료 조건 체크 변경

   boolean 또는 객체 모두 받을 수 있지만

   실제 서버에는 항상

   {
     isDone
   }

   전송
================================================== */

export const updateChecklistItem =
  async (
    issueId,
    itemId,
    isDoneOrData
  ) => {
    const isDone =
      typeof isDoneOrData ===
      "boolean"
        ? isDoneOrData
        : Boolean(
            isDoneOrData
              ?.isDone
          );


    const response =
      await axiosInstance.put(
        `/api/v1/issues/${issueId}/checklist/${itemId}`,
        {
          isDone,
        }
      );


    return response.data;
  };


/* =========================
   이슈 삭제
========================= */

export const deleteIssue =
  async (
    issueId
  ) => {
    const response =
      await axiosInstance.delete(
        `/api/v1/issues/${issueId}`
      );


    return response.data;
  };


/* ==================================================
   댓글 목록 조회
================================================== */

export const getIssueComments =
  async (
    issueId
  ) => {
    const response =
      await axiosInstance.get(
        `/api/v1/issues/${issueId}/comments`
      );


    return response.data;
  };


/* ==================================================
   댓글 작성
================================================== */

export const createIssueComment =
  async (
    issueId,
    content
  ) => {
    const response =
      await axiosInstance.post(
        `/api/v1/issues/${issueId}/comments`,
        {
          content,
        }
      );


    return response.data;
  };


/* ==================================================
   댓글 수정
================================================== */

export const updateIssueComment =
  async (
    commentId,
    content
  ) => {
    const response =
      await axiosInstance.put(
        `/api/v1/comments/${commentId}`,
        {
          content,
        }
      );


    return response.data;
  };


/* ==================================================
   댓글 삭제
================================================== */

export const deleteIssueComment =
  async (
    commentId
  ) => {
    const response =
      await axiosInstance.delete(
        `/api/v1/comments/${commentId}`
      );


    return response.data;
  };


/* =========================
   S3 파일 업로드
========================= */

export const uploadIssueFiles =
  async (
    files
  ) => {
    const formData =
      new FormData();


    files.forEach(
      (
        file
      ) => {
        formData.append(
          "files",
          file
        );
      }
    );


    const response =
      await axiosInstance.post(
        "/api/v1/issues/file",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );


    return response.data;
  };


/* =========================
   첨부파일 다운로드
========================= */

export const downloadIssueFile =
  async (
    storedKey
  ) => {
    const response =
      await axiosInstance.get(
        `/api/v1/issues/files/${encodeURIComponent(
          storedKey
        )}`,
        {
          responseType:
            "blob",
        }
      );


    return response;
  };