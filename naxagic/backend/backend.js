const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/api/compile', (req, res) => {
    const { cppCode } = req.body;

    if (!cppCode) {
        return res.status(400).json({ error: "Код пуст!" });
    }

    const forbiddenWords = ['system(', 'exec(', 'popen(', 'fork(', 'rm -rf'];
    for (let word of forbiddenWords) {
        if (cppCode.includes(word)) {
            console.warn(`🚨 Tryna to hack?: ${word}`);
            return res.status(403).json({
                error: "Security Alert: Системные вызовы запрещены!"
            });
        }
    }

    const filePath = path.join(__dirname, 'temp.cpp');
    const outPath = path.join(__dirname, 'temp.out');

    fs.writeFileSync(filePath, cppCode);

    console.log("🛠️ Compiling");
    const command = `g++ ${filePath} -o ${outPath} && ${outPath}`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

        if (error) {
            if (error.killed) {
                return res.json({ status: "error", result: "⏳ Time Limit Exceeded (3 seconds limit)" });
            }
            return res.json({ status: "error", result: stderr });
        }

        res.json({
            status: "success",
            result: stdout
        });
    });
});

app.post('/api/aiResponse', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Հարցը բացակայում է" });
    }

    try {
        const combinedMessage = `Դու macOS Tahoe ոճի ինտերֆեյսով համակարգի օգնական ես։ Պատասխանիր հակիրճ և խելացի, օգնիր ինձ C++-ի և ռեկուրսիայի հարցերում։\n\nԱհա իմ հարցը. ${question}`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // Քո API Key-ը
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model":"google/gemma-3-4b-it:free",
                "messages": [
                    { "role": "user", "content": combinedMessage }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenRouter API Error:", data.error);
            return res.status(500).json({ error: "AI սերվերը սխալ վերադարձրեց" });
        }

        if (data.choices && data.choices.length > 0) {
            const aiMessage = data.choices[0].message.content;
            res.json({
                status: "success",
                result: aiMessage
            });
        } else {
            res.status(500).json({ error: "AI-ն անհասկանալի պատասխան վերադարձրեց" });
        }

    } catch (error) {
        if(error.code === 429) console.log('AI-ն ծանրաբեռնված է խնդորում եմ նորից փորձել մի փոքր ուշ')
        console.error("Server Fetch Error:", error);
        res.status(500).json({ error: "AI-ն ժամանակավորապես անհասանելի է (Network error)" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Սերվերը միացված է: http://localhost:${PORT}`);
});