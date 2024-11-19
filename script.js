document.getElementById('start-game').addEventListener('click', function () {
    const team1Name = document.getElementById('team1-name').value;
    const team2Name = document.getElementById('team2-name').value;

    if (!team1Name || !team2Name) {
        alert('Inserisci i nomi di entrambe le squadre!');
        return;
    }

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

    const totalScore1 = team1Score - team1Penalty;
    const totalScore2 = team2Score - team2Penalty;

    const summaryBody = document.getElementById('summary-body');
    const newRow = summaryBody.insertRow();

    newRow.insertCell(0).innerText = currentDate;
    newRow.insertCell(1).innerText = document.getElementById('team1-name-display').innerText;
    newRow.insertCell(2).innerText = totalScore1;
    newRow.insertCell(3).innerText = team1Penalty;
    newRow.insertCell(4).innerText = team1Insufficient ? 'Sì' : 'No';
    newRow.insertCell(5).innerText = '1'; // Incremento vittoria di squadra 1
    const deleteButton1 = document.createElement('button');
    deleteButton1.innerText = 'Elimina';
    deleteButton1.style.backgroundColor = '#f44336'; // Rosso
    deleteButton1.style.color = 'white';
    deleteButton1.style.border = 'none';
    deleteButton1.style.padding = '5px 10px';
    deleteButton1.style.cursor = 'pointer';
    deleteButton1.addEventListener('click', function () {
        summaryBody.deleteRow(newRow.rowIndex - 1);
    });
    newRow.insertCell(6).appendChild(deleteButton1);

    const newRow2 = summaryBody.insertRow();
    newRow2.insertCell(0).innerText = currentDate;
    newRow2.insertCell(1).innerText = document.getElementById('team2-name-display').innerText;
    newRow2.insertCell(2).innerText = totalScore2;
    newRow2.insertCell(3).innerText = team2Penalty;
    newRow2.insertCell(4).innerText = team2Insufficient ? 'Sì' : 'No';
    newRow2.insertCell(5).innerText = '1'; // Incremento vittoria di squadra 2
    const deleteButton2 = document.createElement('button');
    deleteButton2.innerText = 'Elimina';
    deleteButton2.style.backgroundColor = '#f44336'; // Rosso
    deleteButton2.style.color = 'white';
    deleteButton2.style.border = 'none';
    deleteButton2.style.padding = '5px 10px';
    deleteButton2.style.cursor = 'pointer';
    deleteButton2.addEventListener('click', function () {
        summaryBody.deleteRow(newRow2.rowIndex - 1);
    });
    newRow2.insertCell(6).appendChild(deleteButton2);

    document.getElementById('score-input').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
});

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

// Funzione per eliminare tutte le righe
document.getElementById('delete-all').addEventListener('click', function () {
    const summaryBody = document.getElementById('summary-body');
    summaryBody.innerHTML = '';
});

// Funzione per accettare i cookie
document.getElementById('accept-cookies').addEventListener('click', function () {
    document.getElementById('cookie-consent').style.display = 'none';
});

// Funzione di ricerca
document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#summary-body tr');

    rows.forEach(row => {
        const teamName = row.cells[1].innerText.toLowerCase();
        row.style.display = teamName.includes(searchTerm) ? '' : 'none';
    });
});
