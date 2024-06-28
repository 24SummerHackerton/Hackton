import { AiFillSchedule } from "react-icons/ai";
import { GiWhistle } from "react-icons/gi";
import { TbTournament } from "react-icons/tb";
import { FaClipboardList } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";

export default function Navigation() {
  const navigate = useNavigate();
  return (
    <div className="flex-col flex gap-5 h-[75%]">
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/")}
      >
        <GoHomeFill className="text-[35px]" />
        <span className="text-[20px]">홈</span>
      </div>
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/schedule")}
      >
        <AiFillSchedule className="text-[35px]" />
        <span className="text-[20px]">경기 일정 관리</span>
      </div>
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/referee")}
      >
        <GiWhistle className="text-[35px]" />
        <span className="text-[20px]">심판진 관리</span>
      </div>
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/tournament")}
      >
        <TbTournament className="text-[35px]" />
        <span className="text-[20px]">대진 관리</span>
      </div>
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/manage")}
      >
        <FaClipboardList className="text-[35px]" />
        <span className="text-[20px]">종목 관리</span>
      </div>
      <div
        className="flex gap-3 justify-start items-center cursor-pointer hover:bg-gray-200 py-5 px-10"
        onClick={() => navigate("/results")}
      >
        <FaTrophy className="text-[35px]" />
        <span className="text-[20px]">경기 결과</span>
      </div>
    </div>
  );
}
