import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Your Express API is up and running!");
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});