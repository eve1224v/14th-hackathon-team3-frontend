import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../features/main/pages/MainPage/MainPage";
import HomePage from "../features/home/pages/HomePage/HomePage";

import CreateWorkspacePage from "../features/workspace/pages/CreateWorkspacePage/CreateWorkspacePage";
import JoinWorkspacePage from "../features/workspace/pages/JoinWorkspacePage/JoinWorkspacePage";

import CreateProjectPage from "../features/project/pages/CreateProjectPage/CreateProjectPage";
import ProjectSettingsPage from "../features/project/pages/ProjectSettingsPage/ProjectSettingsPage";
import TimezoneSettingsPage from "../features/project/pages/TimezoneSettingsPage/TimezoneSettingsPage";
import MemberSettingsPage from "../features/project/pages/MemberSettingsPage/MemberSettingsPage";
import IntegrationSettingsPage from "../features/project/pages/IntegrationSettingsPage/IntegrationSettingsPage";

import HandoverPage from "../features/handover/pages/HandoverPage/HandoverPage";

import CyclePage from "../features/cycle/pages/CyclePage/CyclePage";

import IssueListPage from "../features/issue/pages/IssueListPage/IssueListPage";
import IssueDetailPage from "../features/issue/pages/IssueDetailPage/IssueDetailPage";
import CreateIssuePage from "../features/issue/pages/CreateIssuePage/CreateIssuePage";
import EditIssuePage from "../features/issue/pages/EditIssuePage/EditIssuePage";

import { ROUTES } from "./routes.constant";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={<MainPage />}
        />

        <Route
          path={ROUTES.DASHBOARD}
          element={<HomePage />}
        />

        <Route
          path={ROUTES.CREATE_WORKSPACE}
          element={<CreateWorkspacePage />}
        />

        <Route
          path={ROUTES.JOIN_WORKSPACE}
          element={<JoinWorkspacePage />}
        />

        <Route
          path={ROUTES.CREATE_PROJECT}
          element={<CreateProjectPage />}
        />

        <Route
          path={ROUTES.PROJECT_SETTINGS}
          element={<ProjectSettingsPage />}
        />

        <Route
          path={ROUTES.TIMEZONE_SETTINGS}
          element={<TimezoneSettingsPage />}
        />

        <Route
          path={ROUTES.MEMBER_SETTINGS}
          element={<MemberSettingsPage />}
        />

        <Route
          path={ROUTES.INTEGRATION_SETTINGS}
          element={<IntegrationSettingsPage />}
        />

        <Route
          path={ROUTES.HANDOVER}
          element={<HandoverPage />}
        />

        <Route
          path={ROUTES.CYCLE}
          element={<CyclePage />}
        />

        {/* =========================
            Issue
        ========================= */}

        <Route
          path={ROUTES.ISSUE}
          element={<IssueListPage />}
        />

        <Route
          path={ROUTES.MY_ISSUE}
          element={<IssueListPage type="my" />}
        />

        <Route
          path={ROUTES.TEAM_ISSUE}
          element={<IssueListPage type="team" />}
        />

        <Route
          path={ROUTES.CREATE_ISSUE}
          element={<CreateIssuePage />}
        />

        <Route
          path={ROUTES.ISSUE_DETAIL}
          element={<IssueDetailPage />}
        />

        <Route
          path={ROUTES.ISSUE_EDIT}
          element={<EditIssuePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;