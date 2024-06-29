const API_BASE_URL = 'http://localhost:5001'; // 백엔드 서버 URL

export const fetchEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events`);
  return response.json();
};

export const addEvent = async (event) => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  return response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
