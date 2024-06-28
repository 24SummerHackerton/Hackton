document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-list')) {
        fetch('/games')
            .then(response => response.json())
            .then(data => {
                const gameList = document.getElementById('game-list');
                gameList.innerHTML = data.map(game => `
                    <div>
                        <h2>${game.name} - ${game.status}</h2>
                        <p>Max Participants: ${game.maxParticipants}</p>
                        <p>${game.rules}</p>
                        <a href="/games/${game._id}">Details</a>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error fetching games:', error));
    }

    if (document.getElementById('game-details')) {
        const gameId = window.location.pathname.split('/').pop();
        fetch(`/games/${gameId}`)
            .then(response => response.json())
            .then(data => {
                const gameDetails = document.getElementById('game-details');
                gameDetails.innerHTML = `
                    <h2>${data.name}</h2>
                    <p>Status: ${data.status}</p>
                    <p>Max Participants: ${data.maxParticipants}</p>
                    <p>${data.rules}</p>
                    <h3>Teams</h3>
                    <ul>
                        ${data.teams.map(team => `<li>${team.name} - ${team.players.join(', ')}</li>`).join('')}
                    </ul>
                `;
            })
            .catch(error => console.error('Error fetching game details:', error));
    }
});
