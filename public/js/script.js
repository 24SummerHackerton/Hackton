document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
  
    fetch(`/api/games/${gameId}`)
      .then(response => response.json())
      .then(game => {
        document.getElementById('game-name').textContent = game.name;
        document.getElementById('max-participants').textContent = game.maxParticipants;
        document.getElementById('rules').textContent = game.rules || '없음';
        document.getElementById('status').textContent = game.status;
  
        const teamList = document.getElementById('team-list');
        let html = '<ul>';
        game.teams.forEach(team => {
          html += `<li>${team.name} - Players: ${team.players.join(', ')}</li>`;
        });
        html += '</ul>';
        teamList.innerHTML = html;
      })
      .catch(err => console.error('Error fetching game details:', err));
  
    document.getElementById('add-team-form').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const teamName = document.getElementById('teamName').value;
      const players = document.getElementById('players').value;
  
      fetch(`/games/${gameId}/add-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ teamName, players })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        } else {
          alert('Error adding team: ' + data.message);
        }
      })
      .catch(err => console.error('Error adding team:', err));
    });
  });
  