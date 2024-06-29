import React, { useState, useEffect } from "react";
import axios from 'axios';
import ScheduleCard from "../components/ScheduleCard";

export default function DesktopSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [sports, setSports] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('/schedules');
        setSchedules(response.data);
        
        const parsedData = response.data.reduce((acc, item) => {
          const sport = item.game.sport;
          const round = item.game.round;
          const teamA = item.teamA.name;
          const teamB = item.teamB.name;
          const date = new Date(item.date).toLocaleDateString();
          if (!acc[sport]) {
            acc[sport] = [];
          }
          acc[sport].push({ round, teamA, teamB, date, scoreA: item.scoreA || 0, scoreB: item.scoreB || 0 });
          return acc;
        }, {});
        setSports(Object.entries(parsedData));
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  const handleScoreEdit = (sport, matchIndex) => {
    setEditing({ sport, matchIndex });
  };

  const handleInputChange = (e, sport, matchIndex, field) => {
    const value = e.target.value;
    setSports((prevSports) => {
      const updatedSports = [...prevSports];
      const sportIndex = updatedSports.findIndex(([name]) => name === sport);
      updatedSports[sportIndex][1][matchIndex][field] = value;
      return updatedSports;
    });
  };

  const handleSave = async (sport, matchIndex) => {
    setEditing(null);
    const updatedMatch = sports.find(([name]) => name === sport)[1][matchIndex];
    const scheduleToUpdate = schedules.find(schedule => 
      schedule.game.sport === sport && 
      schedule.teamA.name === updatedMatch.teamA &&
      schedule.teamB.name === updatedMatch.teamB &&
      new Date(schedule.date).toLocaleDateString() === updatedMatch.date
    );

    try {
      await axios.post(`/schedules/${scheduleToUpdate._id}/update`, {
        scoreA: updatedMatch.scoreA,
        scoreB: updatedMatch.scoreB
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    const newSchedule = {
      game: { sport: e.target.sport.value, round: e.target.round.value },
      teamA: e.target.teamA.value,
      teamB: e.target.teamB.value,
      date: new Date(e.target.date.value)
    };
    try {
      await axios.post('/schedules/create', newSchedule);
      // 새 일정을 추가한 후 일정을 다시 불러옵니다.
      const response = await axios.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <div className="p-4 w-[700px]">
      <h1 className="text-[30px] font-bold text-center mb-10">경기일정관리</h1>
      {/* 새로운 일정 생성 폼 */}
      <div>
        <h2>새 일정 추가</h2>
        <form onSubmit={handleCreateSchedule}>
          <input name="sport" placeholder="종목" required />
          <input name="round" placeholder="라운드" required />
          <input name="teamA" placeholder="팀 A" required />
          <input name="teamB" placeholder="팀 B" required />
          <input type="date" name="date" placeholder="날짜" required />
          <button type="submit">추가</button>
        </form>
      </div>
      {sports.map(([sport, matches], sportIndex) => (
        <div key={sportIndex} className="mb-8 font-bold">
          <div className="border-2 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{sport}</h2>
              {editing && editing.sport === sport ? (
                <button onClick={() => handleSave(editing.sport, editing.matchIndex)} className="bg-blue-500 text-white px-4 py-2 rounded-2xl">
                  저장
                </button>
              ) : (
                <button
                  onClick={() => handleScoreEdit(sport, null)}
                  className="bg-black text-white px-4 py-2 rounded-2xl"
                >
                  점수 입력
                </button>
              )}
            </div>
            {matches.map((match, matchIndex) => (
              <div key={matchIndex} className="border-t pt-4 pb-4 flex justify-between items-center">
                <div className="flex justify-center">
                  <div className="w-[120px]">{match.round}</div>
                  {editing && editing.sport === sport && editing.matchIndex === matchIndex ? (
                    <div>
                      <input
                        type="number"
                        value={match.scoreA}
                        onChange={(e) => handleInputChange(e, sport, matchIndex, 'scoreA')}
                        className="border rounded p-1 w-16 mr-2"
                      />
                      :
                      <input
                        type="number"
                        value={match.scoreB}
                        onChange={(e) => handleInputChange(e, sport, matchIndex, 'scoreB')}
                        className="border rounded p-1 w-16 ml-2"
                      />
                    </div>
                  ) : (
                    <span>{match.teamA} {match.scoreA} : {match.scoreB} {match.teamB}</span>
                  )}
                </div>
                <div className="flex flex-col text-right">
                  <span>{match.date}</span>
                </div>
                {editing && editing.sport === sport ? (
                  <button
                    onClick={() => handleScoreEdit(sport, matchIndex)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-2xl"
                  >
                    수정
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
