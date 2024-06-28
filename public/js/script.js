document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('game-details')) {
        const gameId = window.location.pathname.split('/').pop();
        fetch(`/games/${gameId}/json`)
            .then(response => response.json())
            .then(data => {
                const gameDetails = document.getElementById('game-details');
                const isFull = data.teams.reduce((count, team) => count + team.players.length, 0) >= data.maxParticipants;
                const status = isFull ? '마감됨' : '모집중';
                gameDetails.innerHTML = `
                    <h2>${data.name}</h2>
                    <p>Status: ${status}</p>
                    <p>Rules: ${data.rules}</p>
                    <h2>Teams</h2>
                    <ul>
                        ${data.teams.map(team => `
                            <li>
                                ${team.name} - Players: ${team.players.join(', ')}
                                <form action="/games/${data._id}/update-team" method="post">
                                    <input type="hidden" name="teamId" value="${team._id}">
                                    <input type="text" name="players" value="${team.players.join(', ')}">
                                    <button type="submit">Update Players</button>
                                </form>
                            </li>`).join('')}
                    </ul>
                    ${status === '모집중' ? `
                    <form action="/games/${data._id}/add-team" method="post">
                        <h3>Add Team</h3>
                        <label for="teamName">Team Name:</label>
                        <input type="text" id="teamName" name="teamName" required>
                        <br>
                        <label for="players">Players (comma separated):</label>
                        <input type="text" id="players" name="players" required>
                        <br>
                        <button type="submit">Add Team</button>
                    </form>
                    ` : `<p>모집이 마감되었습니다.</p>`}
                `;
            })
            .catch(error => console.error('Error fetching game details:', error));
    }
});
