const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- ВОТ ЭТОГО НЕ ХВАТАЛО!
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. Настраиваем статику
// __dirname = папка 'backend'
// '../' = выход на уровень выше, в папку 'naxagic'
// Теперь сервер видит и style.css, и script.js, и картинки
app.use(express.static(path.join(__dirname, '../')));

// 2. Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 3. Твой API
app.post('/api/data', (req, res) => {
    const dataFromFront = req.body;
    console.log("Получил данные:", dataFromFront);

    res.json({
        message: "Сервер принял!",
        yourData: dataFromFront
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});