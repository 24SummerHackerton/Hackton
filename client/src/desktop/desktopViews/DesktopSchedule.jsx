import React, { useState, useEffect } from "react";
import scheduleData from "./schedule.json";

export default function DesktopSchedule() {
  const [sports, setSports] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const parsedData = scheduleData.reduce((acc, item) => {
      const [sport, round, teamA, teamB, date] = item;
      if (!acc[sport]) {
        acc[sport] = [];
      }
      acc[sport].push({ round, teamA, teamB, date, scoreA: 0, scoreB: 0 });
      return acc;
    }, {});
    setSports(Object.entries(parsedData));
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

  const handleSave = () => {
    setEditing(null);
    //서버에 업데이트
  };

  return (
    <div className="p-4 w-[700px]">
      <h1 className="text-[30px] font-bold text-center mb-10">경기일정관리</h1>
      {sports.map(([sport, matches], sportIndex) => (
        <div key={sportIndex} className="mb-8 font-bold">
          <div className="border-2 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{sport}</h2>
              {editing && editing.sport === sport ? (
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-2xl">
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
