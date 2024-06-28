import { Outlet } from "react-router-dom";
import Navigation from "./components/navigation";
import LoginStatus from "./components/loginStatus";

export default function DesktopLayout() {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between pb-12 select-none border-r-2 h-[100vh] w-[300px] fixed">
        <span className="bebas text-red-500 text-[50px] px-10">chepl</span>
        <Navigation />
        <LoginStatus />
      </div>
      <div className="flex justify-center items-center pl-[300px] w-full">
        <Outlet />
      </div>
    </div>
  );
}
