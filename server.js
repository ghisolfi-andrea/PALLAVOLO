const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATABASE_FILE = './scores.json';

app.use(express.json());

// API per ottenere i dati
app.get('/api/scores', (req, res) => {
    fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del database:', err);
            return res.status(500).send('Errore server');
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// API per salvare i dati
app.post('/api/scores', (req, res) => {
    const newScores = req.body;
    fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
        const scores = data ? JSON.parse(data) : [];
        const updatedScores = scores.concat(newScores);

        fs.writeFile(DATABASE_FILE, JSON.stringify(updatedScores, null, 2), 'utf8', err => {
            if (err) {
                console.error('Errore nel salvataggio:', err);
                return res.status(500).send('Errore server');
            }
            res.status(201).send('Dati salvati');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
