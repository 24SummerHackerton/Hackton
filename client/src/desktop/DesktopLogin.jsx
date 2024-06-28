import React from "react";

export default function DesktopLogin() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div className="bg-pointRed bg-opacity-10 w-full h-[100vh] flex">
      <div className="flex-1 flex justify-center items-center">
        <div className="text-pointRed bebas text-[300px]">ChePL</div>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col">
        <div className="mb-4 text-[38px]">
          <div className="text-left w-[600px]">당신의 수고로움을 덜어줄</div>
          <div className="text-right">우리만의 "체육대회 플래너"</div>
        </div>
        <button
          className="bg-pointRed text-white px-16 py-2 rounded-2xl mt-24 text-[27px] w-[700px] h-[100px]"
          onClick={handleGoogleLogin}
        >
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}
