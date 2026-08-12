import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../features/main/pages/MainPage/MainPage";

import CreateWorkspacePage from "../features/workspace/pages/CreateWorkspacePage/CreateWorkspacePage";
import JoinWorkspacePage from "../features/workspace/pages/JoinWorkspacePage/JoinWorkspacePage";

import CreateProjectPage from "../features/project/pages/CreateProjectPage/CreateProjectPage";
import ProjectSettingsPage from "../features/project/pages/ProjectSettingsPage/ProjectSettingsPage";

import TimezoneSettingsPage from "../features/project/pages/TimezoneSettingsPage/TimezoneSettingsPage";
import MemberSettingsPage from "../features/project/pages/MemberSettingsPage/MemberSettingsPage";
import IntegrationSettingsPage from "../features/project/pages/IntegrationSettingsPage/IntegrationSettingsPage";

import { ROUTES } from "./routes.constant";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainPage />} />

        <Route
          path={ROUTES.CREATE_WORKSPACE}
          element={<CreateWorkspacePage />}
        />

        <Route path={ROUTES.JOIN_WORKSPACE} element={<JoinWorkspacePage />} />

        <Route path={ROUTES.CREATE_PROJECT} element={<CreateProjectPage />} />

        <Route
          path={ROUTES.PROJECT_SETTINGS}
          element={<ProjectSettingsPage />}
        />

        <Route
          path={ROUTES.TIMEZONE_SETTINGS}
          element={<TimezoneSettingsPage />}
        />

        <Route path={ROUTES.MEMBER_SETTINGS} element={<MemberSettingsPage />} />

        <Route
          path={ROUTES.INTEGRATION_SETTINGS}
          element={<IntegrationSettingsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
