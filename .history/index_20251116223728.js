const express = require('express');
const app = express();
const port = 3000;

// To read JSON from POST request body
app.use(express.json());

// GET Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// POST Route
app.post('/create', (req, res) => {
    const data = req.body; // whatever the client sends
    res.send({
        message: "POST request received!",
        yourData: data
    });
});



app.post('/update', (req, res) => {
    const data = req.body; // whatever the client sends
    res.send({
        message: "POST request received!",
        yourData: data
    });
});



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
