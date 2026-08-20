import axiosInstance from "./axios";


/* =========================
   이슈 생성
========================= */

export const createIssue = async (data) => {
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

export const getIssues = async (
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


  if (Array.isArray(status)) {
    status.forEach(
      (
        value
      ) => {
        if (value) {
          params.append(
            "status",
            value
          );
        }
      }
    );
  } else if (status) {
    params.append(
      "status",
      status
    );
  }


  if (priority) {
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


  if (keyword) {
    params.append(
      "keyword",
      keyword
    );
  }


  if (sort) {
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


/* =========================
   이슈 상태 변경
========================= */

export const updateIssueStatus =
  async (
    issueId,
    data
  ) => {
    const response =
      await axiosInstance.put(
        `/api/v1/issues/${issueId}/status`,
        data
      );


    return response.data;
  };


/* =========================
   완료 조건 체크 변경
========================= */

export const updateChecklistItem =
  async (
    issueId,
    itemId,
    data
  ) => {
    const response =
      await axiosInstance.put(
        `/api/v1/issues/${issueId}/checklist/${itemId}`,
        data
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

   GET
   /api/v1/issues/{issueId}/comments
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

   POST
   /api/v1/issues/{issueId}/comments

   {
     content
   }
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

   PUT
   /api/v1/comments/{commentId}

   {
     content
   }

   성공 시 수정된 댓글 전체 반환
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

   DELETE
   /api/v1/comments/{commentId}
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
        `/api/v1/issues/files/${storedKey}`,
        {
          responseType:
            "blob",
        }
      );


    return response;
  };