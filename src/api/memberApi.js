import axiosInstance from "./axios";


/* ==================================================
   워크스페이스 조직도 조회

   GET
   /api/v1/workspaces/{workspaceId}/organization-chart
================================================== */

export const getOrganizationChart = async (
  workspaceId
) => {
  const response =
    await axiosInstance.get(
      `/api/v1/workspaces/${workspaceId}/organization-chart`
    );

  return response.data;
};


/* ==================================================
   워크스페이스 멤버 조회

   GET
   /api/v1/workspaces/{workspaceId}/members

   Query
   - status: ACTIVE / INVITED / SUSPENDED
   - keyword: 이름 또는 이메일
================================================== */

export const getWorkspaceMembers = async (
  workspaceId,
  {
    status,
    keyword,
  } = {}
) => {
  const params = {};


  if (status) {
    params.status =
      status;
  }


  if (keyword) {
    params.keyword =
      keyword;
  }


  const response =
    await axiosInstance.get(
      `/api/v1/workspaces/${workspaceId}/members`,
      {
        params,
      }
    );


  return response.data;
};


/* ==================================================
   워크스페이스 구성원 수정

   PUT
   /api/v1/workspaces/{workspaceId}/members
================================================== */

export const updateWorkspaceMembers = async (
  workspaceId,
  actions
) => {
  const response =
    await axiosInstance.put(
      `/api/v1/workspaces/${workspaceId}/members`,
      {
        actions,
      }
    );

  return response.data;
};


/* ==================================================
   워크스페이스 구성원 삭제

   DELETE
   /api/v1/workspaces/{workspaceId}/members
================================================== */

export const removeWorkspaceMembers = async (
  workspaceId,
  memberIds
) => {
  const actions =
    memberIds.map(
      (memberId) => ({
        action:
          "REMOVE",

        memberId,
      })
    );


  const response =
    await axiosInstance.delete(
      `/api/v1/workspaces/${workspaceId}/members`,
      {
        data: {
          actions,
        },
      }
    );


  return response.data;
};