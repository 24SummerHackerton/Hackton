import { useRecoilState, useRecoilValue } from "recoil";
import ScheduleCard from "./scheduleCard";
import { resultList, scheduleStatus } from "../../atom";
import { useEffect } from "react";
import ResultCard from "./resultCard";

function parseDate(dateStr) {
  const [year, month, day] = dateStr
    .split(/[.()]/)
    .filter((part) => part.trim() && !isNaN(part));
  const parsedYear = parseInt(year) + 2000; // 24를 2024로 변환
  const parsedMonth = parseInt(month) - 1; // 월은 0부터 시작하므로 1을 빼줌
  const parsedDay = parseInt(day);
  return new Date(parsedYear, parsedMonth, parsedDay);
}

function sortedData(schedules) {
  const schedulesCopy = [...schedules]; // 데이터를 복사하여 원본 배열을 수정하지 않음
  return schedulesCopy.sort((a, b) => parseDate(a[4]) - parseDate(b[4]));
}

export default function Todo() {
  const [schedules, setSchedules] = useRecoilState(scheduleStatus);
  const [results, setResults] = useRecoilState(resultList);
  useEffect(() => {
    const temp = [...schedules];
    setSchedules(sortedData(temp));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-2xl font-bold">경기 일정</div>
        {schedules.map((schedule, i) => (
          <ScheduleCard key={i} schedule={schedule} />
        ))}
      </div>
      <div>
        <div className="text-2xl font-bold">완료된 경기</div>
        {results.map((res, i) => {
          return <ResultCard key={i} res={res} />;
        })}
      </div>
    </div>
  );
}
