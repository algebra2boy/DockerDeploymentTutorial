import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Your Express API is up and running!");
});

app.get("/hello", (req, res) => {
    res.send("hello, world");
});

app.get("/testing", (req, res) => {
    res.send("<h1>HELLO testing</h1>");
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});