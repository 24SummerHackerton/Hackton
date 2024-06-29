import React from 'react';
import axios from 'axios';

export default function LoginStatus() {
  const handleLogout = async () => {
    console.log('로그아웃 버튼 클릭됨');
    try {
      console.log('로그아웃 요청 시작');
      const response = await axios.get('/api/logout', { withCredentials: true });
      console.log('로그아웃 응답:', response);
      
      if (response.status === 200) {
        console.log('로그아웃 성공, 페이지 새로고침');
        window.location.reload();
      } else {
        console.log('로그아웃 실패:', response.status);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div
      className="bg-pointRed text-white py-3 rounded-full text-center cursor-pointer w-[80%] mx-auto"
      onClick={handleLogout}
    >
      로그아웃
    </div>
  );
}