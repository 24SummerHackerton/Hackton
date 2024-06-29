import { PiSoccerBallFill } from "react-icons/pi";
import { MdSportsBasketball } from "react-icons/md";
import { MdOutlineSportsVolleyball } from "react-icons/md";
import { GrRun } from "react-icons/gr";
import RunningResult from "./typeResult-running";
import ElseResult from "./typeResult-else";

function selectIcon(sport) {
  if (sport === "축구") {
    return <PiSoccerBallFill className="text-[25px]" />;
  } else if (sport === "농구") {
    return <MdSportsBasketball className="text-[25px]" />;
  } else if (sport === "피구") {
    return <MdOutlineSportsVolleyball className="text-[25px]" />;
  } else if (sport === "계주") {
    return <GrRun className="text-[25px]" />;
  } else {
    return <div className="text-[13px]">{sport}</div>;
  }
}

function typeResult(sport, gameId) {
  if (sport === "계주") {
    return <RunningResult gameId={gameId} />;
  } else {
    return <ElseResult gameId={gameId} />;
  }
}

export default function ScheduleCard({ schedule }) {
  return (
    <div className="flex justify-between gap-5 items-center">
      <div className="font-bold text-[18px] flex gap-3 items-center px-3 w-full">
        {selectIcon(schedule.game.sport)}
        {schedule.teamA.name} vs {schedule.teamB.name}
      </div>
      <div className="text-center text-blue-600">
        <div>{new Date(schedule.date).toLocaleDateString()}</div>
        <div>{schedule.status}</div>
      </div>
      <div>{typeResult(schedule.game.sport, schedule._id)}</div>
    </div>
  );
}
