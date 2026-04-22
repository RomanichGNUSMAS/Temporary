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

app.post('/api/compile', (req, res) => {
    const { cppCode } = req.body;

    if (typeof cppCode !== 'string' || cppCode.trim().length === 0) {
        return res.status(400).json({ status: 'error', result: 'cppCode is required' });
    }
Ё

    const MAX_CODE_CHARS = 100_000;
    if (cppCode.length > MAX_CODE_CHARS) {
        return res.status(413).json({ status: 'error', result: `Code too large (>${MAX_CODE_CHARS} chars)` });
    }

    const id = crypto.randomBytes(8).toString('hex');
    const outPath = path.join(os.tmpdir(), `naxagic_${id}.exe`);

    const compileArgs = [
        '-x', 'c++',
        '-std=c++17',
        '-O2',
        '-pipe',
        '-o', outPath,
        '-', // stdin
    ];

    const compiler = spawn('g++', compileArgs, { windowsHide: true });

    let compileStdout = '';
    let compileStderr = '';

    compiler.stdout.on('data', (d) => { compileStdout += d.toString(); });
    compiler.stderr.on('data', (d) => { compileStderr += d.toString(); });
    compiler.on('error', (err) => {
        if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        return res.status(500).json({ status: 'error', result: `Failed to start g++: ${err.message}` });
    });

    compiler.stdin.write(cppCode);
    compiler.stdin.end();

    compiler.on('close', (code) => {
        if (code !== 0) {
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
            return res.json({ status: 'error', result: compileStderr || `Compilation failed (code ${code})` });
        }

        const RUN_TIMEOUT_MS = 2000;
        const runner = spawn(outPath, [], { windowsHide: true });

        let runStdout = '';
        let runStderr = '';
        let killedByTimeout = false;

        const t = setTimeout(() => {
            killedByTimeout = true;
            runner.kill('SIGKILL');
        }, RUN_TIMEOUT_MS);

        runner.stdout.on('data', (d) => { runStdout += d.toString(); });
        runner.stderr.on('data', (d) => { runStderr += d.toString(); });
        runner.on('error', (err) => {
            clearTimeout(t);
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
            return res.status(500).json({ status: 'error', result: `Failed to run program: ${err.message}` });
        });

        runner.on('close', (runCode) => {
            clearTimeout(t);
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

            if (killedByTimeout) {
                return res.json({ status: 'error', result: `Time limit exceeded (${RUN_TIMEOUT_MS}ms)` });
            }

            if (runCode !== 0) {
                return res.json({ status: 'error', result: runStderr || `Runtime error (code ${runCode})` });
            }

            return res.json({ status: 'success', result: runStdout });
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