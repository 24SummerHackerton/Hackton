import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function DesktopReferee() {
  const [referees, setReferees] = useState([]);
  const [editingReferee, setEditingReferee] = useState(null);
  const [newReferee, setNewReferee] = useState({
    college: "",
    department: "",
    studentId: "",
    name: "",
    phone: "",
    team: ""
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchReferees();
  }, []);

  const fetchReferees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/referees');
      setReferees(response.data);
    } catch (error) {
      console.error('Error fetching referees:', error);
    }
  };

  const handleEditReferee = (index) => {
    setEditingReferee(index);
  };

  const handleSaveReferee = async (index) => {
    const updatedReferee = referees[index];
    try {
      await axios.patch(`http://localhost:5001/referees/${updatedReferee._id}`, updatedReferee);
      setEditingReferee(null);
      fetchReferees(); // Save 후 데이터 새로고침
    } catch (error) {
      console.error('Error saving referee:', error);
    }
  };

  const handleDeleteReferee = async (index) => {
    const refereeId = referees[index]._id;
    try {
      await axios.delete(`http://localhost:5001/referees/${refereeId}`);
      setReferees(prevReferees => prevReferees.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting referee:', error);
    }
  };

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    setReferees(prevReferees => {
      const updatedReferees = [...prevReferees];
      updatedReferees[index][field] = value;
      return updatedReferees;
    });
  };

  const handleNewRefereeChange = (e, field) => {
    const { value } = e.target;
    setNewReferee(prevReferee => ({
      ...prevReferee,
      [field]: value
    }));
  };

  const handleAddReferee = () => {
    setIsAdding(true);
  };

  const handleSaveNewReferee = async () => {
    try {
      await axios.post('http://localhost:5001/referees', newReferee);
      setNewReferee({
        college: "",
        department: "",
        studentId: "",
        name: "",
        phone: "",
        team: ""
      });
      setIsAdding(false);
      fetchReferees(); // Save 후 데이터 새로고침
    } catch (error) {
      console.error('Error saving new referee:', error);
    }
  };

  const handleCancelNewReferee = () => {
    setNewReferee({
      college: "",
      department: "",
      studentId: "",
      name: "",
      phone: "",
      team: ""
    });
    setIsAdding(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <button onClick={handleAddReferee} className="bg-pointRed text-white p-2 rounded">
          추가하기
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">번호</th>
            <th className="py-2">이름</th>
            <th className="py-2">학과</th>
            <th className="py-2">학번</th>
            <th className="py-2">전화번호</th>
            <th className="py-2">배정된 팀</th>
            <th className="py-2">수정</th>
            <th className="py-2">삭제</th>
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newReferee.name}
                  onChange={(e) => handleNewRefereeChange(e, 'name')}
                  className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  placeholder="이름"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newReferee.department}
                  onChange={(e) => handleNewRefereeChange(e, 'department')}
                  className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  placeholder="학과"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newReferee.studentId}
                  onChange={(e) => handleNewRefereeChange(e, 'studentId')}
                  className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  placeholder="학번"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newReferee.phone}
                  onChange={(e) => handleNewRefereeChange(e, 'phone')}
                  className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  placeholder="전화번호"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  value={newReferee.team}
                  onChange={(e) => handleNewRefereeChange(e, 'team')}
                  className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  placeholder="팀"
                />
              </td>
              <td className="border px-4 py-2">
                <button onClick={handleSaveNewReferee} className="bg-blue-500 text-white p-2 rounded">
                  저장
                </button>
              </td>
              <td className="border px-4 py-2">
                <button onClick={handleCancelNewReferee} className="bg-red-500 text-white p-2 rounded">
                  취소
                </button>
              </td>
            </tr>
          )}
          {referees.map((referee, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                {editingReferee === index ? (
                  <input
                    type="text"
                    value={referee.name}
                    onChange={(e) => handleInputChange(e, 'name', index)}
                    className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  />
                ) : (
                  referee.name
                )}
              </td>
              <td className="border px-4 py-2">{referee.department}</td>
              <td className="border px-4 py-2">{referee.studentId}</td>
              <td className="border px-4 py-2">
                {editingReferee === index ? (
                  <input
                    type="text"
                    value={referee.phone}
                    onChange={(e) => handleInputChange(e, 'phone', index)}
                    className="border rounded p-1 focus:outline-none focus:border-pointRed"
                  />
                ) : (
                  referee.phone
                )}
              </td>
              <td className="border px-4 py-2">{referee.team}</td>
              <td className="border px-4 py-2">
                {editingReferee === index ? (
                  <button onClick={() => handleSaveReferee(index)} className="bg-blue-500 text-white p-2 rounded">
                    저장
                  </button>
                ) : (
                  <button onClick={() => handleEditReferee(index)} className="bg-blue-500 text-white p-2 rounded">
                    수정
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => handleDeleteReferee(index)} className="bg-red-500 text-white p-2 rounded">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
