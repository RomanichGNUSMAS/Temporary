const tab = document.querySelector('.TabMenu');
let recomenders = {
    reference: document.querySelector('.centerDiv'), loop: false
};
recomenders.reference.psevdoName = 'Effectivity'
recomenders.reference.querySelector('.divContent').classList.add('globber')

const style = document.createElement('style');
style.textContent = `
    /* Убираем скроллбар */
    .divContent::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
    .divContent {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .no-scrollbar::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

    /* 🔥 АНИМАЦИЯ ОТКРЫТИЯ ОКНА (Scale up + Fade in) */
    @keyframes windowOpen {
        0% { opacity: 0; transform: scale(0.85) translateY(20px); filter: blur(10px); }
        100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
    }

    /* 🔥 АНИМАЦИЯ ЗАКРЫТИЯ ОКНА (Scale down + Fade out) */
    @keyframes windowClose {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(5px); }
    }

    /* 🔥 АНИМАЦИЯ СВОРАЧИВАНИЯ (Улет в Док) */
    @keyframes windowMinimize {
        0% { opacity: 1; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0.1) translateY(500px); }
    }

    /* 🔥 АНИМАЦИЯ РАЗВОРАЧИВАНИЯ ИЗ ДОКА */
    @keyframes windowRestore {
        0% { opacity: 0; transform: scale(0.1) translateY(500px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Применяем анимацию открытия по умолчанию для новых окон */
    .centerDiv {
        animation: windowOpen 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Класс для плавного закрытия */
    .closing {
        animation: windowClose 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
    }

    /* Класс для сворачивания */
    .minimizing {
        animation: windowMinimize 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
    }

    /* Класс для разворачивания */
    .restoring {
        animation: windowRestore 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
    }

    /* Исправление невидимости окна в Доке */
    .centerDiv.minimized {
        animation: none !important; 
        opacity: 1 !important;
        transform: none !important;
    }
`;
document.head.appendChild(style);

const cache = {};
const Stack = Array.from({ length: 3 }, () => new Map());
Stack[1].set(recomenders.reference.psevdoName, recomenders.reference);

function restartAnimation(className) {
    tab.classList.remove('tabStartForBig', 'tabStartForSmall');
    void tab.offsetWidth;
    tab.classList.add(className);
}

function checkSize() {
    if (window.innerWidth >= 1024) {
        if (!tab.classList.contains('TabMenuAtBigScreen')) {
            restartAnimation('tabStartForBig');
        }
        tab.classList.remove('TabMenuAtSmallScreen');
        tab.classList.add('TabMenuAtBigScreen');
    } else {
        if (!tab.classList.contains('TabMenuAtSmallScreen')) {
            restartAnimation('tabStartForSmall');
        }
        tab.classList.remove('TabMenuAtBigScreen');
        tab.classList.add('TabMenuAtSmallScreen');
    }
}

function calcIcons(selector) {
    selector.forEach(menu => {
        const icons = menu.querySelector('.mac-controls');
        if (icons) {
            icons.style.left = `25px`;
            icons.style.top = `25px`;
            icons.style.bottom = 'auto';
            icons.style.right = 'auto';
        }
    });
}

function sleepMain() {
    const reference = document.querySelector('.centerDiv');
    const menuTab = document.querySelector('.TabMenu');

    reference.style.cssText = `
        position:relative;
        width: 110px;
        margin-bottom:40px;
        margin-left:20px;
        height: 110px;
        transition: 0.5s ease;
    `;
    Stack[1].delete(cache['recomendations'].reference.psevdoName);
    const button = document.createElement('button');
    button.className = 'tabM';
    button.innerText = 'Recs';
    button.onclick = reserveForRecomendations;
    button.style.cssText = `
        width:90px;
        height:90px;
    `

    Array.from(reference.children).forEach(child => {
        child.style.display = 'none';
    });

    reference.appendChild(button);
    reference.classList.add('sleepMode');
    menuTab.style.marginLeft = '20px';
}

function remover(id) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.classList.add('closing');
        setTimeout(() => {
            if (elem.psevdoName !== undefined) {
                Stack[1].delete(elem.psevdoName);
                Stack[0].delete(elem.psevdoName);
            }
            elem.remove();
            delete cache[id];
        }, 300);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    checkSize();
    calcIcons([recomenders.reference]);
    tab.style.opacity = '1';
    window.addEventListener('resize', checkSize);
    cache['recomendations'] = recomenders;
});

function reserveForRecomendations() {
    cache['recomendations'].reference.lastElementChild.remove();
    [...cache['recomendations'].reference.querySelectorAll('*')].forEach(menu => {
        if (menu.classList.contains('divContent')) {
            menu.style.display = 'flex';
        } else menu.style.display = 'inline-block';
    });
    Stack[1].set(cache['recomendations'].reference.psevdoName, cache['recomendations'].reference);
    cache['recomendations'].reference.style.cssText = `
        width:90%;
        height:80%;
        top:20px;
        left:76px;
        overflow:hidden;
    `
    cache['recomendations'].reference.classList.toggle('sleepMode');
    cache['recomendations'].reference.firstElementChild.style.cssText = `
        display:flex;
        flex-direction:row;
    `
    const menu = document.querySelector('.TabMenu');
    menu.style.marginLeft = '0px';
}

function svernut(rc) {
    const rec = cache[rc] ? cache[rc] : document.getElementById(rc) || recomenders;
    const { reference, loop } = rec;

    if (!loop) {
        reference.classList.remove('restoring');
        reference.classList.add('minimizing');

        setTimeout(() => {
            executeSvernutLogic(rc, rec, reference);
        }, 400);
    } else {
        executeSvernutLogic(rc, rec, reference);
    }
}

function executeSvernutLogic(rc, rec, reference) {
    const loop = rec.loop;
    const menuTab = document.querySelector('.TabMenu');
    const queue = document.querySelector('.queue');
    const toggleBtn = reference.querySelector('.mac-yellow, .mac-green');

    if (toggleBtn && toggleBtn.className.includes('mac-green')) {
        if (Stack[1].size) return;
    }

    Array.from(reference.children).forEach(child => {
        if (!child.classList.contains('mac-controls') && child.id !== 'temp') {
            child.style.display = !loop ? "none" : "flex";
        }
    });

    let isHere = rec.reference.firstElementChild.querySelector('.mac-red')
    if (isHere) {
        isHere.remove();
    }

    if (toggleBtn) {
        toggleBtn.classList.toggle('mac-green', !loop);
        toggleBtn.classList.toggle('mac-yellow', loop);
        toggleBtn.onclick = () => { svernut(rc); };
    }

    reference.classList.remove('minimizing');
    reference.classList.toggle('minimized');

    if (loop) {
        const controls = reference.querySelector('.mac-controls') || reference.firstElementChild;
        if (controls && !controls.querySelector('.mac-red')) {
            const span = document.createElement('span');
            span.className = 'mac-btn mac-red';

            span.onclick = () => {
                if (reference !== recomenders.reference) {
                    remover(reference.id);
                    return;
                }

                reference.style.cssText = `
                    order:-1;
                    position: relative;
                    width:110px;
                    height:110px;
                    margin-bottom:50px;
                    margin-left:20px;
                    overflow:hidden;
                    border-radius:34px;
                    transition: 0.5s ease;
                `;

                const button = document.createElement('button');
                button.className = 'tabM';
                button.innerText = 'Recs';
                button.style.cssText = `
                    width: 90px;
                    height: 90px;
                    display: block;
                    margin: auto;
                    cursor: pointer;
                    backdrop-filter: blur(25px) saturate(180%);
                    -webkit-backdrop-filter: blur(25px) saturate(180%);
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 29px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3);
                `;

                button.onclick = reserveForRecomendations;

                Array.from(reference.children).forEach(child => {
                    child.style.display = 'none';
                });

                reference.appendChild(button);
                reference.classList.add('sleepMode');
                menuTab.style.cssText = 'margin-left:10px;';
                rec.loop = false;
                Stack[1].delete(reference.psevdoName);
            };
            controls.prepend(span);
        }
    }

    (function () {
        let tabMenu = document.querySelector('.TabMenu');
        let names = [...document.querySelector('.TabMenu').children].map(m => m.innerText);
        if (!loop) {
            if (Stack[0].has(reference.psevdoName)) return;

            if (queue.children.length === 0) queue.style.display = 'flex';

            if (reference.parentElement !== tabMenu && !reference.id) {
                let h1 = document.createElement('h1');
                h1.textContent = 'G';
                h1.style = `font-size: 20px; position: relative; color: #8d4a1b; left:15px; top: 40px;`
                h1.id = 'temp';
                reference.appendChild(h1);
                reference.remove();
            } else {
                for (let i = 0; i < names.length; i++) {
                    if (reference.psevdoName === names[i]) {
                        let h1 = document.createElement('h1');
                        h1.textContent = names[i][0];
                        h1.style = `font-size: 20px; position: relative; color: #8d4a1b; left:17px; top: 40px;`
                        h1.id = 'temp';
                        reference.appendChild(h1);
                        break;
                    }
                }
            }
            queue.appendChild(reference);
            Stack[0].set(reference.psevdoName, reference);
            Stack[1].delete(reference.psevdoName);
        } else {
            if (Stack[1].size) return;
            reference.remove();
            document.body.appendChild(reference);
            Stack[1].set(reference.psevdoName, reference);
            reference.lastElementChild.remove();
            Stack[0].delete(reference.psevdoName);
            if (queue.children.length === 0) queue.style.display = 'none';
        }
        queue.style.width = `${queue.children.length * 75}px`;

        rec.loop = !loop;
    })();
}

async function sendCode(code, stdin) {
    if (!code) return false;
    try {
        const response = await fetch('https://temporary-4qcg.onrender.com/api/compile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cppCode: code, stdin: stdin })
        });
        const compiled = await response.json();
        return compiled;
    } catch (error) {
        console.error("Ошибка сети:", error);
        return { error: "Бэкенд недоступен" };
    }
}

function createInstance() {
    let id = `Tab${createInstance.count++}`;
    let globDiv = document.createElement('div');
    globDiv.id = id;
    globDiv.classList.add('centerDiv');

    let buttonsGroup = document.createElement('div');
    buttonsGroup.classList.add('mac-controls');

    let red = document.createElement('span');
    red.className = `mac-btn mac-red`;
    red.onclick = function () { remover(id); } // Вызов плавного удаления

    let yellow = document.createElement('span');
    yellow.className = `mac-btn mac-yellow`;
    yellow.onclick = function () { svernut(id); }

    buttonsGroup.appendChild(red);
    buttonsGroup.appendChild(yellow);

    cache[id] = { loop: false, reference: globDiv }
    globDiv.appendChild(buttonsGroup);
    return globDiv;
}

createInstance.count = 0;

function openTab(typeOfTab) {
    let name;
    let div = createInstance();
    switch (typeOfTab) {
        case 'Wiki': {
            name = 'Recursion Wiki';
            window.open('https://en.wikipedia.org/wiki/Recursion', '_blank');
            return;
        }
        case 'Examples': {
            name = 'Recursion Examples';
            let img = document.createElement('img');
            img.src = './images/FibPhoto.jpg';
            img.style.cssText = `max-width:60%; max-height:70%;`
            let p = document.createElement('p');
            p.style.cssText = `font-size:22.5px;`
            p.textContent = "Այստեղ բերված են օրինակներ ինչպես է ռեկուրսիայով կառուցված բնությունը, այստեղ կարող ենք նկատել, որ այս ամենը հիշեցնում է ֆիբոնաչիի հաջորդականությունը բնության մեջ և դա ճիշտ նկատումն է քանի որ Ֆիբոնաչին ստեղծել է իր հաջորդականությունը հարյուրավոր տարիներ առաջ և դրա հիման վրա ստեղծվել են ռեկուրենտ ֆունկցիաներ և ռեկուրսիայի գաղափարը";
            let div1 = document.createElement('div');
            div1.style.cssText = `width: 90%; height: 80%; display:flex; flex-direction: row; justify-content: center; align-items: center;`
            div1.appendChild(img);
            div1.appendChild(p);
            div.appendChild(div1);
            break;
        }
        case 'Cybersecurity': {
            name = 'Using Recursion In Cybersecurity';
            let imgPath = ['./images/CBRec.jpg', './images/CBRec2.jpg'];
            let img = document.createElement('img');
            let img1 = document.createElement('img');
            [img.src, img1.src] = imgPath;

            let p = Array.from({ length: 2 }, () => document.createElement('p'));

            img.style.cssText = `max-width:45%; max-height: 100%; border-radius: 8px; object-fit: cover;`;
            img1.style.cssText = `max-width:45%; max-height: 100%; border-radius: 8px; object-fit: cover;`;

            const strs = [
                "Ինչպես են ռեկուրսիան օգտագործում ծրագրավորման և կիբեռանվտանգության մեջ?",
                "Ահա մի օրինակ, նկարում պատկերված է համակարգչի թղթապանակ պարզագույն ծառ, յուրաքանչյուր թղթապանակ գտնվում են ուրիշ թղթապանակներ, որոնք պարունակում տարբեր ֆայլեր։ Ռեկուրսիան մեզ հնարավորություն են տալիս \"ճամփորդել\" թղթապանակների մեջ, այսինքն գրելով ռեկուրսիայի հիման վրա համապատասխան ծրագիր այն կարող է մտնել այդ թղթապանակներ, ուսումնասիրել ֆայլային պարունակությունը, ետ գնալ և ուրիշ թղթապանակներ տեղափոխվել մինչև չգտնի մեր նշված ինֆորմացիայով ֆայլը։ ինչպես խոսվել է ռեկուրսինա քայլ առ քայլ է կատարում իր գործողությունները և արդյունք ստանալուց հետո քայլ առ քայլ ետ գալիս, սա շատ հարմար յուրահատկություն է, որը կարելի է օգտագործել այսպիսի դեպքերի համար"
            ];

            for (let i = 0; i < 2; ++i) {
                p[i].textContent = strs[i];
                p[i].style.cssText = `margin: 10px 0; line-height: 1.5; text-align: justify; padding: 0 20px;`;
            }

            let div1 = document.createElement('div');
            div1.classList.add('no-scrollbar');
            div1.style.cssText = `
                width: 90%;
                height: 80%; 
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-y: auto; 
                padding-top: 30px;
                margin-top: 20px;
            `;

            let div2 = document.createElement('div');
            div2.style.cssText = `
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 15px;
                width: 100%;
                margin-bottom: 20px;
            `;

            div2.appendChild(img);
            div2.appendChild(img1);

            div1.appendChild(p[0]);
            div1.appendChild(div2);
            div1.appendChild(p[1]);

            div.appendChild(div1);
            break;
        }
        case "Compiler": {
            name = 'C++ Compiler';
            let contentDiv = document.createElement('div');
            contentDiv.classList.add('divContent');
            contentDiv.style.cssText = `width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;`;

            let compileBtn = document.createElement('button');
            compileBtn.innerHTML = 'Run <span style="font-size: 1.2em; vertical-align: middle;">▶</span>';
            compileBtn.style.cssText = `position: fixed; right: 5.5px; bottom: 1.5%; width: 8%; height: 91%; padding: 0px 15px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px) saturate(150%); -webkit-backdrop-filter: blur(25px) saturate(150%); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5), inset 0 -1px 1px rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.9); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 24px; font-family: "Samsung Sharp Sans", sans-serif; font-weight: bold; cursor: pointer; letter-spacing: 0.5px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); z-index: 10; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);`;

            compileBtn.onmouseover = () => { compileBtn.style.background = 'rgba(255, 255, 255, 0.08)'; compileBtn.style.transform = 'translateY(-2px)'; compileBtn.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6), inset 0 -1px 1px rgba(255, 255, 255, 0.1)`; compileBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)'; };
            compileBtn.onmouseout = () => { compileBtn.style.background = 'rgba(255, 255, 255, 0.03)'; compileBtn.style.transform = 'translateY(0px)'; compileBtn.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5), inset 0 -1px 1px rgba(255, 255, 255, 0.05)`; compileBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)'; };
            compileBtn.onmousedown = () => { compileBtn.style.transform = 'translateY(1px) scale(0.98)'; compileBtn.style.background = 'rgba(255, 255, 255, 0.02)'; compileBtn.style.boxShadow = `0 5px 15px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)`; };
            compileBtn.onmouseup = () => { compileBtn.style.transform = 'translateY(-2px) scale(1)'; compileBtn.style.background = 'rgba(255, 255, 255, 0.08)'; };

            let mainContainer = document.createElement('div');
            mainContainer.style.cssText = `display: flex; flex-direction: column; width: 90%; height: 91%; position: fixed; top: 50px; left: 1%; border-radius: 27px; box-shadow: rgba(0, 0, 0, 0.5) 0px 20px 50px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);`;

            let editorWrapper = document.createElement('div');
            editorWrapper.style.cssText = `display: flex; flex: 7; background: rgba(30, 30, 30, 0.65); backdrop-filter: blur(20px); font-family: Menlo, Monaco, "Courier New", monospace; font-size: 13px; line-height: 1.6; border-bottom: 1px solid rgba(255, 255, 255, 0.1);`;

            let lineNumbers = document.createElement('div');
            lineNumbers.style.cssText = `width: 45px; background-color: rgba(255, 255, 255, 0.03); color: #5c6370; text-align: right; padding: 15px 10px 10px 0; box-sizing: border-box; border-right: 1px solid rgba(255, 255, 255, 0.05); user-select: none; overflow: hidden; font-family: inherit;`;
            lineNumbers.innerText = '1';

            let textarea = document.createElement('textarea');
            textarea.setAttribute('spellcheck', 'false');
            textarea.style.cssText = `flex: 1; background-color: transparent; color: #e6e6e6; border: none; outline: none; padding: 15px; resize: none; white-space: pre; overflow: auto; font-family: inherit; font-size: inherit; line-height: inherit; caret-color: #528bff;`;
            textarea.value = '#include <iostream>\n\nint main() {\n    // Write your code here\n    std::cout << "Hello 94th School!";\n    return 0;\n}';

            const updateLines = () => {
                const numberOfLines = textarea.value.split('\n').length;
                lineNumbers.innerHTML = Array(numberOfLines).fill(0).map((_, i) => i + 1).join('<br>');
            };

            const syncScroll = () => { lineNumbers.scrollTop = textarea.scrollTop; };
            textarea.addEventListener('input', updateLines);
            textarea.addEventListener('scroll', syncScroll);
            setTimeout(updateLines, 0);

            textarea.addEventListener('keydown', function (e) {
                if (e.key == 'Tab') {
                    e.preventDefault();
                    let start = this.selectionStart;
                    let end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                    updateLines();
                }
            });

            let terminalWrapper = document.createElement('div');
            terminalWrapper.style.cssText = `flex: 3; display: flex; flex-direction: column; background: rgba(10,10,10,0.85); backdrop-filter: blur(20px); font-family: Menlo, Monaco, "Courier New", monospace; overflow: hidden;`;

            let terminalHeader = document.createElement('div');
            terminalHeader.style.cssText = `color: #858585; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 8px 15px 6px; font-weight: bold; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0;`;
            terminalHeader.innerHTML = `<span>Terminal</span><span id="termStatus" style="color:#858585;">Ready</span>`;

            let terminalOutput = document.createElement('div');
            terminalOutput.style.cssText = `color: #e6e6e6; font-size: 13px; flex: 1; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; padding: 10px 15px 6px;`;
            terminalOutput.innerText = ">_ Awaiting compilation...";

            let inputLine = document.createElement('div');
            inputLine.style.cssText = `display: flex; align-items: center; padding: 6px 15px 8px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;`;

            let inputPrompt = document.createElement('span');
            inputPrompt.style.cssText = `color: #5a9fd4; font-size: 13px; margin-right: 8px; user-select: none;`;
            inputPrompt.textContent = '❯';

            let inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = 'waiting for program...';
            inputField.disabled = true;
            inputField.setAttribute('spellcheck', 'false');
            inputField.style.cssText = `flex: 1; background: transparent; border: none; outline: none; color: #e6e6e6; font-family: inherit; font-size: 13px; caret-color: #528bff; opacity: 0.4; transition: opacity 0.2s;`;

            inputLine.appendChild(inputPrompt);
            inputLine.appendChild(inputField);

            terminalWrapper.appendChild(terminalHeader);
            terminalWrapper.appendChild(terminalOutput);
            terminalWrapper.appendChild(inputLine);

            let ws = null;
            const statusSpan = () => terminalHeader.querySelector('#termStatus');

            const appendOutput = (text, color) => {
                const span = document.createElement('span');
                span.style.color = color || '#e6e6e6';
                span.textContent = text;
                terminalOutput.appendChild(span);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            };

            const setRunning = (running) => {
                inputField.disabled = !running;
                inputField.style.opacity = running ? '1' : '0.4';
                inputField.placeholder = running ? 'Enter input, press Enter...' : 'waiting for program...';
                compileBtn.innerHTML = running ? '■ Stop' : 'Run <span style="font-size:1.2em;vertical-align:middle;">▶</span>';
                compileBtn.style.opacity = '1';
                if (running) inputField.focus();
            };

            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && ws && !inputField.disabled) {
                    const val = inputField.value;
                    appendOutput(val + '\n', '#5a9fd4');
                    ws.send(JSON.stringify({ type: 'stdin', data: val }));
                    inputField.value = '';
                }
            });

            compileBtn.onclick = () => {
                if (ws) {
                    ws.send(JSON.stringify({ type: 'kill' }));
                    ws.close();
                    ws = null;
                    setRunning(false);
                    statusSpan().innerText = 'Stopped';
                    return;
                }

                terminalOutput.innerHTML = '';
                statusSpan().innerText = 'Compiling...';
                statusSpan().style.color = '#FFA500';
                compileBtn.innerHTML = 'WAIT';

                const serverAddress = "wss://temporary-4qcg.onrender.com";
                ws = new WebSocket(serverAddress);

                ws.onopen = () => {
                    ws.send(JSON.stringify({ type: 'run', code: textarea.value }));
                };

                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data);

                    if (msg.type === 'start') {
                        setRunning(true);
                        statusSpan().innerText = 'Running';
                        statusSpan().style.color = '#4CAF50';
                    }

                    if (msg.type === 'stdout') {
                        appendOutput(msg.data, '#e6e6e6');
                    }

                    if (msg.type === 'stderr') {
                        appendOutput(msg.data, '#FF6B6B');
                    }

                    if (msg.type === 'exit') {
                        statusSpan().innerText = msg.code === 0 ? 'Done ✓' : `Exit ${msg.code}`;
                        appendOutput(`\n[Process completed with code ${msg.code}]`, '#555');
                        setRunning(false);
                        ws = null;
                    }
                };

                ws.onerror = (err) => {
                    console.error("WS Error:", err);
                    appendOutput('\n>_ Connection error. Is Node.js running on port 3000?\n', '#FF6B6B');
                    statusSpan().innerText = 'Failed';
                    setRunning(false);
                    ws = null;
                };
            };

            editorWrapper.appendChild(lineNumbers);
            editorWrapper.appendChild(textarea);
            mainContainer.appendChild(editorWrapper);
            mainContainer.appendChild(terminalWrapper);



            contentDiv.appendChild(mainContainer);
            contentDiv.appendChild(compileBtn);
            div.appendChild(contentDiv);
            break;
        }
        case "AI": {
            name = 'Ask to AI';

            let contentDiv = document.createElement('div');
            contentDiv.classList.add('divContent');
            contentDiv.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                position: relative;
            `;

            const displayMessage = (text, isUser) => {
                let msg = document.createElement('div');

                let baseStyle = `
                    max-width: 75%;
                    padding: 14px 20px;
                    border-radius: 22px;
                    font-family: "Samsung Sharp Sans", -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 14.5px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                    animation: windowOpen 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    word-wrap: break-word;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                `;

                if (isUser) {
                    msg.style.cssText = baseStyle + `
                        align-self: flex-end; 
                        background: linear-gradient(135deg, #0a84ff 0%, #0058C9 100%); 
                        border: 1px solid rgba(255,255,255,0.1);
                        border-bottom-right-radius: 6px; /* Хвостик как в iMessage */
                        color: #ffffff;
                        text-shadow: 0 1px 1px rgba(0,0,0,0.1);
                    `;
                    msg.innerText = text;
                } else {
                    msg.style.cssText = baseStyle + `
                        align-self: flex-start; 
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%); 
                        backdrop-filter: blur(25px) saturate(180%);
                        -webkit-backdrop-filter: blur(25px) saturate(180%);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-bottom: 1px solid rgba(255,255,255,0.05); /* Блик по краям */
                        border-bottom-left-radius: 6px; /* Хвостик как в iMessage */
                        color: #f5f5f7;
                    `;

                    let formattedText = text
                        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: white; font-weight: 800;">$1</strong>')
                        .replace(/```(.*?)\n([\s\S]*?)```/g, (match, lang, code) => {
                            return `<div style="
                                background: rgba(0, 0, 0, 0.4); 
                                border-radius: 12px; 
                                padding: 12px; 
                                margin: 10px 0; 
                                font-family: Menlo, Monaco, monospace; 
                                border: 1px solid rgba(255,255,255,0.1);
                                box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
                                overflow-x: auto;
                            "><span style="color:#a1a1aa; font-size:10px; text-transform:uppercase; font-family: sans-serif; font-weight:bold; letter-spacing: 1px;">${lang || 'code'}</span><br><code style="color: #e6e6e6; font-size: 13.5px;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></div>`;
                        })
                        .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.15); padding: 3px 6px; border-radius: 6px; color: #ff9f0a; font-family: Menlo, monospace;">$1</code>')
                        .replace(/\n/g, '<br>');

                    msg.innerHTML = formattedText;
                }

                chatArea.appendChild(msg);
                chatArea.scrollTop = chatArea.scrollHeight;
            };

            let chatArea = document.createElement('div');
            chatArea.style.cssText = `
                left: 2%;
                position: fixed;
                width: 92%;
                height: 70%;
                margin-top: 40px;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                mask-image: linear-gradient(transparent 0%, black 10%, black 90%, transparent 100%);
                -webkit-mask-image: linear-gradient(transparent 0%, black 10%, black 90%, transparent 100%);
            `;

            let inputWrapper = document.createElement('div');
            inputWrapper.style.cssText = `
                position: fixed;
                width: 80%;
                height: 55px;
                right: 9%;
                bottom: 5%;
                display: flex;
                align-items: center;
                padding: 0px 15px;
                /* Эффект чистого мак-стекла */
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%);
                backdrop-filter: blur(35px) saturate(200%);
                -webkit-backdrop-filter: blur(35px) saturate(200%);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Объем снизу */
                border-right: 1px solid rgba(255, 255, 255, 0.05); /* Объем справа */
                border-radius: 28px; /* Идеальное скругление */
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.4);
            `;

            let textArea = document.createElement('textarea');
            textArea.placeholder = 'Ask anything to Gemini...';
            textArea.style.cssText = `
                flex: 1; 
                background: transparent; 
                border: 0; 
                outline: none; 
                color: #ffffff;
                font-family: "Samsung Sharp Sans", -apple-system, sans-serif; 
                font-weight: 500;
                font-size: 15px; 
                resize: none; 
                padding: 18px 5px; 
                height: 20px;
                caret-color: #0a84ff; /* Синяя каретка мака */
            `;

            let sendBtn = document.createElement('button');
            sendBtn.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
            `;
            sendBtn.id = "SendToAi";
            sendBtn.style.cssText = `
                width: 36px; 
                height: 36px; 
                border-radius: 50%; 
                border: none;
                background: linear-gradient(135deg, #0a84ff 0%, #0056b3 100%);
                box-shadow: 0 4px 10px rgba(0, 122, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
                cursor: pointer; 
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
                margin-left: 10px;
            `;

            sendBtn.onmouseover = () => sendBtn.style.transform = 'scale(1.05)';
            sendBtn.onmouseout = () => sendBtn.style.transform = 'scale(1)';
            sendBtn.onmousedown = () => sendBtn.style.transform = 'scale(0.92)';
            sendBtn.onmouseup = () => sendBtn.style.transform = 'scale(1.05)';

            sendBtn.onclick = async () => {
                let button = document.getElementById('SendToAi');
                const text = textArea.value.trim();
                if (!text) return;

                displayMessage(text, true);
                textArea.value = '';

                let tempId = "loader-" + Date.now();
                let loadingMsg = document.createElement('div');
                loadingMsg.id = tempId;

                loadingMsg.innerHTML = '<span style="animation: opacity 1.5s infinite;">Gemini is thinking...</span>';
                loadingMsg.style.cssText = "align-self: flex-start; color: rgba(255,255,255,0.5); font-size: 12px; margin-left: 15px; font-style: italic;";
                chatArea.appendChild(loadingMsg);
                chatArea.scrollTop = chatArea.scrollHeight;

                try {

                    if (button) button.style.display = 'none';
                    const response = await fetch('https://temporary-4qcg.onrender.com/api/aiResponse', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question: text })
                    });
                    const data = await response.json();

                    document.getElementById(tempId).remove();
                    button.style.display = 'block'
                    if (data.status === 'success') {
                        displayMessage(data.result, false);
                    } else {
                        displayMessage("❌ Системная ошибка сервера:", false);
                    }

                } catch (err) {
                    if (document.getElementById(tempId)) document.getElementById(tempId).remove();
                    displayMessage("⚠️ Бэкенд не отвечает. Проверь консоль сервера.", false);
                }
            };

            textArea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendBtn.click();
                }
            });

            inputWrapper.appendChild(textArea);
            inputWrapper.appendChild(sendBtn);
            contentDiv.appendChild(chatArea);
            contentDiv.appendChild(inputWrapper);
            div.appendChild(contentDiv);
            break;
        }
    }

    if (Stack[1].has(name)) {
        div.remove();
        delete cache[div.id];
        return;
    }

    if (Stack[1].size) {
        const [, currentTab] = [...Stack[1].entries()][0];
        const cacheKey = currentTab.id || 'recomendations';
        svernut(cacheKey);
    }

    if (Stack[0].has(name)) {
        let existingTab = Stack[0].get(name);
        Stack[0].delete(name);

        existingTab.remove();
        document.body.appendChild(existingTab);

        existingTab.classList.toggle('minimized');
        existingTab.lastChild.remove();

        existingTab.classList.remove('minimizing', 'closing');
        existingTab.classList.add('restoring');
        setTimeout(() => existingTab.classList.remove('restoring'), 500);

        Array.from(existingTab.children).forEach(child => {
            if (!child.classList.contains('mac-controls')) {
                child.style.display = 'flex';
            }
        });

        existingTab.firstElementChild.innerHTML = ` 
            <span class="mac-btn mac-red"></span>
            <span class="mac-btn mac-yellow"></span>
        `;

        cache[existingTab.id].loop = false;

        const Queue = document.querySelector('.queue');
        if (Queue) Queue.style.width = `${Queue.children.length * 75}px`;

        let button = existingTab.querySelector('.mac-red');
        let button1 = existingTab.querySelector('.mac-yellow');
        button1.onclick = () => svernut(existingTab.id);
        button.onclick = () => remover(existingTab.id);

        Stack[1].set(name, existingTab);
        return;
    }

    let h1 = document.createElement('h1');
    h1.textContent = name || 'New Tab';
    h1.style.cssText = `position: absolute; top: 10px; left: 50%; transform: translateX(-50%); margin: 0; color: #391313; font-family: "Samsung Sharp Sans", sans-serif; font-weight: bold;`;

    div.psevdoName = name || 'Unknown';
    if (window.innerWidth > 1024 && window.innerHeight > 1024)
        div.appendChild(h1);
    document.body.appendChild(div);
    Stack[1].set(div.psevdoName, div);

    let redButton = div.querySelector('.mac-red');
    if (redButton) {
        redButton.onclick = () => remover(div.id);
    }
}