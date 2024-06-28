import { useRecoilState } from "recoil";
import { resultList, scheduleStatus } from "../../atom";

export default function ElseResult({ gameId }) {
  const [schedules, setSchedules] = useRecoilState(scheduleStatus);
  const [results, setResults] = useRecoilState(resultList);
  const onSubmit = (e) => {
    e.preventDefault();
    const resultValue = [e.target[0].value, e.target[1].value];
    e.target[0].value = null;
    e.target[1].value = null;
    let temp = schedules;

    temp.forEach((t) => {
      if (t[5] === gameId) {
        const sliceInd = temp.indexOf(t);
        let done = schedules[sliceInd];
        setResults((prev) => prev.concat([done.concat(resultValue)]));
        setSchedules(temp.slice(0, sliceInd).concat(temp.slice(sliceInd + 1)));
      }
    });
  };
  return (
    <form className="flex gap-4 items-center" onSubmit={onSubmit}>
      <input
        required
        type="number"
        className="border-2 rounded-md border-black py-1 w-10"
      />
      <span> : </span>
      <input
        required
        type="number"
        className="border-2 rounded-md border-black py-1 w-10"
      />
      <input
        type="submit"
        value={"완료"}
        className="w-12 rounded-md cursor-pointer bg-pointRed text-white py-1 px-2"
      />
    </form>
  );
}
