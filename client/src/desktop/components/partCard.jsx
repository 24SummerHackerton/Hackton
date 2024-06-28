import React from 'react';
import { useRecoilValue } from 'recoil';
import { eventsState } from '../../atom';

export default function PartCard({ manageText, onClick, onDelete }) {
  const events = useRecoilValue(eventsState);

  // 종목명만 추출하여 중복 제거
  const uniqueEvents = Array.from(new Set(events.map(event => event[5])));

  return (
    <div className="flex flex-col gap-4">
      {uniqueEvents.map((eventName, index) => (
        <div key={index} className="border-2 border-black rounded-md w-[400px] px-3 py-2">
          <div className="flex justify-between">
            <div className="">
              <div className="font-bold text-2xl">{eventName}</div>
              <div>모집현황: 4팀</div>
            </div>
            <div className="flex self-start items-center gap-2 rounded-full shadow-md px-3">
              <div className="bg-green-300 rounded-full w-2 h-2" />
              모집중
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div
              className="cursor-pointer flex justify-center items-center px-4 py-1 rounded-full bg-black text-white hover:bg-gray-500"
              onClick={() => onClick(eventName)}
            >
              {manageText}
            </div>
            {onDelete && (
              <button
                className="cursor-pointer flex justify-center items-center px-4 py-1 rounded-full bg-red-500 text-white hover:bg-red-700"
                onClick={() => onDelete(eventName)}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
