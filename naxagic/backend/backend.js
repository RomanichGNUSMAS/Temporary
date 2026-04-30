const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');          // ← добавь
const WebSocket = require('ws');
const { exec, spawn } = require('child_process');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'API.env') });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ── WebSocket ────────────────────────────────────────────────
const server = http.createServer(app);   // ← один сервер
const wss = new WebSocket.Server({ server }); // ← привязан к нему

wss.on('connection', (ws) => {
    let proc = null;
    let tmpDir = null;

    const cleanup = () => {
        if (proc) {
            try { proc.kill(); } catch (e) { }
            proc = null;
        }
        if (tmpDir) {
            try {
                fs.rmSync(tmpDir, {
                    recursive: true,
                    force: true,
                    maxRetries: 5,
                    retryDelay: 100
                });
            } catch (e) {
                console.error("Не удалось удалить временную папку:", e.message);
            }
            tmpDir = null;
        }
    };

    ws.on('message', (raw) => {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch (e) {
            console.error("Ой, прилетел не JSON:", raw);
            return;
        }

        if (msg.type === 'run') {
            if (!msg.code) return ws.send(JSON.stringify({ type: 'stderr', data: 'Код пуст, бро!' }));
            if (proc) cleanup();

            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-'));
            const src = path.join(tmpDir, 'main.cpp');
            const bin = path.join(tmpDir, 'main');
            fs.writeFileSync(src, msg.code);

            exec(`g++ -O2 -std=c++17 -o ${bin} ${src} 2>&1`, (err, out) => {
                if (err) {
                    ws.send(JSON.stringify({ type: 'stderr', data: out }));
                    ws.send(JSON.stringify({ type: 'exit', code: 1 }));
                    cleanup();
                    return;
                }

                proc = spawn(bin, [], { stdio: ['pipe', 'pipe', 'pipe'] });
                ws.send(JSON.stringify({ type: 'start' }));
                proc.stdout.on('data', d => ws.send(JSON.stringify({ type: 'stdout', data: d.toString() })));
                proc.stderr.on('data', d => ws.send(JSON.stringify({ type: 'stderr', data: d.toString() })));
                proc.on('close', code => { ws.send(JSON.stringify({ type: 'exit', code })); cleanup(); });
                proc.on('error', err => { ws.send(JSON.stringify({ type: 'stderr', data: err.message })); cleanup(); });

                setTimeout(() => {
                    if (proc) {
                        cleanup();
                        ws.send(JSON.stringify({ type: 'stderr', data: '\n[Timeout: 15s]' }));
                        ws.send(JSON.stringify({ type: 'exit', code: -1 }));
                    }
                }, 15000);
            });
        }

        if (msg.type === 'stdin' && proc) proc.stdin.write(msg.data + '\n');
        if (msg.type === 'kill') cleanup();
    });

    ws.on('close', cleanup);
});

// ── REST API ─────────────────────────────────────────────────
app.post('/api/aiResponse', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Հարցը բացակայում է" });

    try {
        const combinedMessage = `Դու macOS Tahoe ոճի ինտերֆեյսով համակարգի օգնական ես։ Պատասխանիր հակիրճ և խելացի, օгնիր ինձ C++-ի և ռեկուрсիայի հарцерум։\n\nАха иmy հарцы. ${question}`;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free",
                messages: [{ role: "user", content: combinedMessage }]
            })
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: "AI սерверը схал верадарцрец" });

        if (data.choices?.length > 0) {
            res.json({ status: "success", result: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "AI-ն анhасканали патасхан верадарцрец" });
        }
    } catch (error) {
        console.error("Server Fetch Error:", error);
        res.status(500).json({ error: "AI-ն жаманаворапес анhасанели е" });
    }
});

// ── Запуск ───────────────────────────────────────────────────
server.listen(PORT, () => {   
    console.log(`🚀 Server starts in: http://localhost:${PORT}`);
});