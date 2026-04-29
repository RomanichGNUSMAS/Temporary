const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');
const dotenv = require('dotenv')
dotenv.config({ path:path.join(__dirname,'API.env')});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.post('/api/compile', async (req, res) => {
    const { cppCode } = req.body;

    if (typeof cppCode !== 'string' || cppCode.trim().length === 0) {
        return res.status(400).json({ status: 'error', result: 'cppCode is required' });
    }

    const MAX_CODE_CHARS = 100_000;
    if (cppCode.length > MAX_CODE_CHARS) {
        return res.status(413).json({ status: 'error', result: `Code too large (>${MAX_CODE_CHARS} chars)` });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15_000); 

        const response = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                compiler: 'gcc-head',       
                code: cppCode,
                options: 'warning,c++17',  
                'compiler-option-raw': '-O2',
                stdin: '',
            }),
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return res.status(502).json({ status: 'error', result: `Wandbox error: ${response.status}` });
        }

        const data = await response.json();

        if (data.status !== '0') {
            const errMsg = data.compiler_error || data.program_error || `Exit code: ${data.status}`;
            return res.json({ status: 'error', result: errMsg });
        }

        return res.json({ status: 'success', result: data.program_output || '' });

    } catch (err) {
        if (err.name === 'AbortError') {
            return res.status(504).json({ status: 'error', result: 'Wandbox timeout (15s)' });
        }
        return res.status(500).json({ status: 'error', result: `Request failed: ${err.message}` });
    }
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
                "Authorization": `Bearer ${process.env.API}`, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-super-120b-a12b:free",
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
        if (error.code === 429) console.log('AI-ն ծանրաբեռնված է խնդորում եմ նորից փորձել մի փոքր ուշ')
        console.error("Server Fetch Error:", error);
        res.status(500).json({ error: "AI-ն ժամանակավորապես անհասանելի է (Network error)" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Սերվերը միացված է: http://localhost:${PORT}`);
});