import axiosInstance from "./axios";

export const createWorkspace = async ({
  name,
  companyName,
  companyCountryCode,
  collaboratingCompanyNames,
  inviteeEmails,
}) => {
  const response = await axiosInstance.post("/api/v1/workspaces", {
    name,
    companyName,
    companyCountryCode,
    collaboratingCompanyNames,
    inviteeEmails,
  });

  return response.data;
};
