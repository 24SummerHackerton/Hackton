import { useRecoilState, useRecoilValue } from "recoil";
import { resultList, scheduleStatus } from "../../atom";

export default function RunningResult({ gameId }) {
  const [schedules, setSchedules] = useRecoilState(scheduleStatus);
  const [results, setResults] = useRecoilState(resultList);
  const onSubmit = (e) => {
    e.preventDefault();
    const winner = e.target[0].value;
    let temp = schedules;

    temp.forEach((t) => {
      if (t[5] === gameId) {
        const sliceInd = temp.indexOf(t);
        if (temp[sliceInd][2] === winner) {
          let done = schedules[sliceInd];
          setResults((prev) => prev.concat([done.concat([1, 0])]));
          setSchedules(
            temp.slice(0, sliceInd).concat(temp.slice(sliceInd + 1))
          );
        } else if (temp[sliceInd][3] === winner) {
          let done = schedules[sliceInd];
          setResults((prev) => prev.concat([done.concat([0, 1])]));
          setSchedules(
            temp.slice(0, sliceInd).concat(temp.slice(sliceInd + 1))
          );
        } else {
          alert("팀명을 다시 입력해주세요!");
        }
      }
    });
  };
  return (
    <form className="flex gap-4 items-center" onSubmit={onSubmit}>
      <input
        required
        type="text"
        placeholder="승리팀을 입력해주세요"
        className="placeholder:text-[12px] border-2 rounded-md border-black py-1 w-[115px]"
      />

      <input
        type="submit"
        value={"완료"}
        className="w-12 rounded-md cursor-pointer bg-pointRed text-white py-1 px-2"
      />
    </form>
  );
}
