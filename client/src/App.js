import React, { useState, useEffect } from "react";
import "./index.css";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import DesktopLayout from "./desktop/DesktopLayout";
import DesktopReferee from "./desktop/desktopViews/DesktopReferee";
import DesktopHome from "./desktop/desktopViews/DesktopHome";
import DesktopSchedule from "./desktop/desktopViews/DesktopSchedule";
import DesktopCreate from "./desktop/desktopViews/DesktopCreate";
import DesktopSignup from "./desktop/DesktopSignup";
import DesktopLogin from "./desktop/DesktopLogin";
import DesktopManage from "./desktop/desktopViews/DesktopManage";
import MobileHome from "./mobile/mobileViews/MobileHome";
import MobileReferee from "./mobile/mobileViews/MobileReferee";
import MobileSchedule from "./mobile/mobileViews/MobileSchedule";
import MobileEvents from "./mobile/mobileViews/MobileEvents";
import MobileTeams from "./mobile/mobileViews/MobileTeams";
import MobileLayout from "./mobile/MobileLayout";
import MobileSignUp from "./mobile/MobileSignup";
import MobileLogin from "./mobile/MobileLogin";
import DesktopResults from "./desktop/desktopViews/DesktopResults";
import DesktopTournament from "./desktop/desktopViews/DesktopTournament";

// 정규식을 사용하여 모바일 디바이스를 감지하는 함수
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth', { credentials: 'include' });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const isMobile = isMobileDevice();

  const DesktopRouter = createBrowserRouter([
    {
      path: "/",
      element: <RequireAuth><DesktopLayout /></RequireAuth>,
      children: [
        { path: "", element: <DesktopHome /> },
        { path: "referee", element: <RequireAuth><DesktopReferee /></RequireAuth> },
        { path: "schedule", element: <RequireAuth><DesktopSchedule /></RequireAuth> },
        { path: "create", element: <RequireAuth><DesktopCreate /></RequireAuth> },
        { path: "results", element: <RequireAuth><DesktopResults /></RequireAuth> },
        { path: "manage", element: <RequireAuth><DesktopManage /></RequireAuth> },
        { path: "tournament", element: <RequireAuth><DesktopTournament /></RequireAuth> },
      ],
    },
    { path: "/login", element: <DesktopLogin /> },
    { path: "/signup", element: <DesktopSignup /> },
  ]);

  const MobileRouter = createBrowserRouter([
    {
      path: "/",
      element: <RequireAuth><MobileLayout /></RequireAuth>,
      children: [
        { path: "", element: <MobileHome /> },
        { path: "referee", element: <RequireAuth><MobileReferee /></RequireAuth> },
        { path: "schedule", element: <RequireAuth><MobileSchedule /></RequireAuth> },
        { path: "events", element: <RequireAuth><MobileEvents /></RequireAuth> },
        { path: "teams", element: <RequireAuth><MobileTeams /></RequireAuth> },
      ],
    },
    { path: "/login", element: <MobileLogin /> },
    { path: "/signup", element: <MobileSignUp /> },
  ]);

  return (
    <div>
      {isMobile ? (
        <RouterProvider router={MobileRouter} />
      ) : (
        <RouterProvider router={DesktopRouter} />
      )}
    </div>
  );
};

export default App;
