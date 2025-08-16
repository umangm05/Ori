const express = require('express');

const authenticateRouter = require('./routers/authentication/authenticateRouter');

const app = express();

const PORT = process.env.PORT || 7000;

app.get('/', async(req, res) => {
    return res.sendStatus(200);
});

app.use('/authenticate', authenticateRouter);

app.listen(PORT, ()=> console.log(`Server listening on PORT: ${PORT}`));