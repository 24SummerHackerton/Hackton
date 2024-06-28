import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <div>
      <div>MobileNav</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
