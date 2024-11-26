// Salvataggio nomi squadre per suggerimenti
const teamSuggestions = new Set();

document.getElementById('start-game').addEventListener('click', function () {
    const team1Name = document.getElementById('team1-name').value.trim();
    const team2Name = document.getElementById('team2-name').value.trim();

    if (!team1Name || !team2Name) {
        alert('Inserisci i nomi di entrambe le squadre!');
        return;
    }

    // Aggiungi i nomi ai suggerimenti
    teamSuggestions.add(team1Name);
    teamSuggestions.add(team2Name);

    document.getElementById('team1-name-display').innerText = team1Name;
    document.getElementById('team2-name-display').innerText = team2Name;
    document.getElementById('team-names').style.display = 'none';
    document.getElementById('score-input').style.display = 'block';
});

document.getElementById('submit-score').addEventListener('click', function () {
    const team1Score = parseInt(document.getElementById('team1-score').value) || 0;
    const team2Score = parseInt(document.getElementById('team2-score').value) || 0;
    const team1Penalty = parseInt(document.getElementById('team1-penalty').value) || 0;
    const team2Penalty = parseInt(document.getElementById('team2-penalty').value) || 0;
    const team1Insufficient = document.getElementById('team1-insufficient').checked;
    const team2Insufficient = document.getElementById('team2-insufficient').checked;

    const currentDate = new Date().toLocaleDateString();

    const summaryBody = document.getElementById('summary-body');

    // Funzione per aggiungere una riga
    function addRow(teamName, totalScore, penalty, insufficient) {
        const newRow = summaryBody.insertRow();
        newRow.insertCell(0).innerText = currentDate;
        newRow.insertCell(1).innerText = teamName;
        newRow.insertCell(2).innerText = totalScore;
        newRow.insertCell(3).innerText = penalty;
        newRow.insertCell(4).innerText = insufficient ? 'Sì' : 'No';
        newRow.insertCell(5).innerText = totalScore > 0 ? '1' : '0'; // Vittoria solo se il punteggio è positivo
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Elimina';
        deleteButton.style.backgroundColor = '#f44336';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.addEventListener('click', () => {
            summaryBody.deleteRow(newRow.rowIndex - 1);
        });
        newRow.insertCell(6).appendChild(deleteButton);
    }

    // Aggiungi le righe per entrambe le squadre
    addRow(document.getElementById('team1-name-display').innerText, team1Score - team1Penalty, team1Penalty, team1Insufficient);
    addRow(document.getElementById('team2-name-display').innerText, team2Score - team2Penalty, team2Penalty, team2Insufficient);

    document.getElementById('score-input').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
});

// Funzione per suggerire i nomi delle squadre
function suggestTeamNames(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', function () {
        const suggestions = Array.from(teamSuggestions).filter(team =>
            team.toLowerCase().includes(input.value.toLowerCase())
        );
        console.log('Suggerimenti:', suggestions); // Debug per verificare i suggerimenti
    });
}

// Attiva i suggerimenti per i campi di input dei nomi squadra
suggestTeamNames('team1-name');
suggestTeamNames('team2-name');

// Altre funzioni
document.getElementById('view-summary').addEventListener('click', function () {
    document.getElementById('score-input').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
});

document.getElementById('back-score-input').addEventListener('click', function () {
    document.getElementById('summary').style.display = 'none';
    document.getElementById('score-input').style.display = 'block';
});

document.getElementById('back-team-names').addEventListener('click', function () {
    document.getElementById('score-input').style.display = 'none';
    document.getElementById('team-names').style.display = 'block';
});

// Elimina tutte le righe
document.getElementById('delete-all').addEventListener('click', function () {
    document.getElementById('summary-body').innerHTML = '';
});

// Nasconde il pop-up dei cookie
document.getElementById('accept-cookies').addEventListener('click', function () {
    document.getElementById('cookie-consent').style.display = 'none';
});

// Ricerca delle squadre
document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#summary-body tr');

    rows.forEach(row => {
        const teamName = row.cells[1].innerText.toLowerCase();
        row.style.display = teamName.includes(searchTerm) ? '' : 'none';
    });
});

// Funzione per inviare dati al backend
async function saveScoresToBackend(scores) {
    try {
        const response = await fetch(`${BACKEND_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scores),
        });
        if (!response.ok) {
            throw new Error('Errore nel salvataggio dei dati');
        }
    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
    }
}

// Funzione per ricaricare i dati dal backend
async function reloadScoresFromBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}`);
        const data = await response.json();
        const summaryBody = document.getElementById('summary-body');
        summaryBody.innerHTML = '';

        data.forEach(score => {
            const newRow = summaryBody.insertRow();
            newRow.insertCell(0).innerText = score.date;
            newRow.insertCell(1).innerText = score.team;
            newRow.insertCell(2).innerText = score.totalScore;
            newRow.insertCell(3).innerText = score.penalty;
            newRow.insertCell(4).innerText = score.insufficient ? 'Sì' : 'No';
            newRow.insertCell(5).innerText = score.victories;
        });
    } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
    }
}

document.getElementById('reload-data').addEventListener('click', reloadScoresFromBackend);

// Aggiorna la funzione "submit-score" per salvare i dati
document.getElementById('submit-score').addEventListener('click', function () {
    const scores = [
        {
            date: new Date().toLocaleDateString(),
            team: document.getElementById('team1-name-display').innerText,
            totalScore: parseInt(document.getElementById('team1-score').value) || 0,
            penalty: parseInt(document.getElementById('team1-penalty').value) || 0,
            insufficient: document.getElementById('team1-insufficient').checked,
            victories: 1,
        },
        {
            date: new Date().toLocaleDateString(),
            team: document.getElementById('team2-name-display').innerText,
            totalScore: parseInt(document.getElementById('team2-score').value) || 0,
            penalty: parseInt(document.getElementById('team2-penalty').value) || 0,
            insufficient: document.getElementById('team2-insufficient').checked,
            victories: 1,
        },
    ];

    saveScoresToBackend(scores); // Salva i dati al backend
});
