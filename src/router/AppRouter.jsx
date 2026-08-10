import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainPage from "../features/main/pages/MainPage/MainPage";

import { ROUTES } from "./routes.constant";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.MAIN}
          element={<MainPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;