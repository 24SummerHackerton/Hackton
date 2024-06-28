import { GrRun } from "react-icons/gr";
import { MdOutlineSportsVolleyball, MdSportsBasketball } from "react-icons/md";
import { PiSoccerBallFill } from "react-icons/pi";
import { useRecoilState } from "recoil";
import { resultList } from "../../atom";

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

export default function ResultCard({ res }) {
  return (
    <div className="flex justify-between gap-5 items-center">
      <div className="font-bold text-[18px] flex gap-2 items-center px-3 w-full">
        {selectIcon(res[0])}
        {res[2]} {res[6]} : {res[7]} {res[3]}
      </div>
      <div className="text-center text-blue-600">
        <div>{res[4]}</div>
        <div>{res[1]}</div>
      </div>
    </div>
  );
}
