const tab = document.querySelector('.TabMenu');
let recomenders = {
    reference: document.querySelector('.centerDiv'),
    loop: false
};

const cache = {};
const Stack = Array.from({ length: 3 }, () => new Map());
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
        margin:auto;
        margin-left:15px;
        height: 110px;
        transition: 0.5s ease;
    `;

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
    menuTab.style.marginLeft = '10px';
}

function remover(id){
    let elem = document.getElementById(id);
    if (elem) {
        if(elem.psevdoName) {
            Stack[1].delete(elem.psevdoName);
            Stack[0].delete(elem.psevdoName);
        }
        elem.remove();

    }
}
window.addEventListener('DOMContentLoaded', () => {
    checkSize();
    calcIcons([recomenders.reference]);
    tab.style.opacity = '1';
    window.addEventListener('resize', checkSize);
    cache['recomendations'] = recomenders;
});

let flag = false;

function reserveForRecomendations() {
    cache['recomendations'].reference.lastElementChild.remove();
    [...cache['recomendations'].reference.querySelectorAll('*')].forEach(menu => {
        if (menu.classList.contains('divContent')) {
            console.log('mta')
            menu.style.display = 'flex';
        } else
            menu.style.display = 'inline-block';

    });
    cache['recomendations'].reference.style.cssText = `
        width:90%;
        height:80%;
        top:20px;
        left:76px;
        overflow:hidden;
    `
    cache['recomendations'].reference.classList.toggle('sleepMode');
    const menu = document.querySelector('.TabMenu');
    menu.style.marginLeft = '0px';
}

function svernut(rc) {
    const rec = cache[rc] ? cache[rc] : document.getElementById(rc) || recomenders;
    const menuTab = document.querySelector('.TabMenu');
    const {reference, loop} = rec;
    const tab = reference.querySelector('.divContent');
    const queue = document.querySelector('.queue');
    if (tab) {
        tab.style.cssText = !loop
            ? "display: none;"
            : "display: block; display: flex; flex-direction: row;";
    }
    let isHere = rec.reference.firstElementChild.querySelector('.mac-red')
    if (isHere) {
        isHere.remove();
    }
    const toggleBtn = reference.querySelector('.mac-yellow, .mac-green');
    if (toggleBtn) {
        toggleBtn.classList.toggle('mac-green', !loop);
        toggleBtn.classList.toggle('mac-yellow', loop);
    }
    toggleBtn.onclick = () => {
        svernut(rc);
        console.log(rc, rec)
    }

    reference.classList.toggle('minimized');
    if (loop) {
        const controls = reference.querySelector('.mac-controls') || reference.firstElementChild;
        if (controls && !controls.querySelector('.mac-red')) {
            const span = document.createElement('span');
            span.className = 'mac-btn mac-red';

            span.onclick = () => {
                if (reference !== recomenders.reference) {
                    reference.remove();
                    cache[rc] = null;
                    return;
                }

                reference.style.cssText = `
                    order:-1;
                    position: relative;
                    width:110px;
                    height:110px;
                    margin:auto;
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

            };

            controls.prepend(span);
        }
    }
    (function () {
        console.log('mt2')
        console.log(Stack[0])
        let tabMenu = document.querySelector('.TabMenu');
        let names = [...document.querySelector('.TabMenu').children].map(m => m.innerText);
        if (!loop) {
            if (Stack[0].has(reference.psevdoName)) {
                console.log('mta')
                return;
            }
                if (queue.children.length === 0) queue.style.display = 'flex';
            if (reference.parentElement !== tabMenu && !reference.id) {
                let h1 = document.createElement('h1');
                h1.textContent = 'G';
                h1.style = `
                font-size: 20px;
                position: relative;
                color: #8d4a1b;
                left:15px;
                top: 40px;
            `
                console.log(reference.parentElement, tabMenu);
                h1.id = 'temp';
                reference.appendChild(h1);
                reference.remove();
            } else {
                console.log(reference.psevdoName)
                for (let i = 0; i < names.length; i++) {
                    if (reference.psevdoName === names[i]) {
                        let h1 = document.createElement('h1');
                        h1.textContent = names[i][0];
                        h1.style = `
                font-size: 20px;
                position: relative;
                color: #8d4a1b;
                left:17px;
                top: 40px;
            `
                        h1.id = 'temp';
                        reference.appendChild(h1);
                        break;
                    }
                }
            }
            queue.appendChild(reference);
            Stack[0].set(reference.psevdoName,reference);
            Stack[1].delete(reference.psevdoName);
        } else {
            reference.remove();
            if (!reference.psevdoName) {
                let gl = document.querySelector('.glob');
                gl.appendChild(reference);
            } else {
                document.body.appendChild(reference);
                Stack[1].set(reference.psevdoName, reference);
            }
            reference.lastElementChild.remove();
            Stack[0].delete(reference.psevdoName);
            if (queue.children.length === 0) queue.style.display = 'none';
        }
        queue.style.width = `${queue.children.length * 75}px`;


        rec.loop = !loop;
    })()
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
    red.onclick = function () {
        globDiv.remove();
    }

    let yellow = document.createElement('span');
    yellow.className = `mac-btn mac-yellow`;
    yellow.onclick = function () {
        svernut(id);
    }
    buttonsGroup.appendChild(red);
    buttonsGroup.appendChild(yellow);
    cache[id] = {
        loop: false,
        reference: globDiv,
    }
    globDiv.appendChild(buttonsGroup);
    return globDiv;
}

createInstance.count = 0;
function openTab(typeOfTab) {

    let name;

    switch (typeOfTab) {
        case 'Wiki':
            name = 'Recursion Wiki';
            break;
        case 'Examples':
            name = 'Recursion Examples';
            break;
        case 'Cybersecurity':
            name = 'Using Recursion In Cybersecurity';
            break;
        case "Compiler":
            name = 'C++ Compiler';
            break;
        case "AI":
            name = 'Ask to AI';
            break;
    }
    if(Stack[1].has(name)) return;
    if (Stack[0].has(name)) {
        let existingTab = Stack[0].get(name);
        Stack[0].delete(name);

        existingTab.remove();
        document.body.appendChild(existingTab);

        existingTab.classList.toggle('minimized');
        existingTab.lastChild.remove();
        existingTab.firstElementChild.innerHTML = `<div class='mac-controls'> 
            <span class="mac-btn mac-red"></span>
            <span class="mac-btn mac-yellow"></span>
        </div>`
        cache[existingTab.id].loop = false;
        const Queue = document.querySelector('.queue');
        Queue.style.width = `${Queue.children.length * 75}px`;
        let button = existingTab.querySelector('.mac-red');
        let button1 = existingTab.querySelector('.mac-yellow');
        button1.onclick = () => svernut(existingTab.id);
        button.onclick = () => remover(existingTab.id);
        Stack[1].set(name,existingTab);
        return;
    }

    let div = createInstance();
    div.psevdoName = name;
    document.body.appendChild(div);
    Stack[1].set(div.psevdoName,div);
    let redButton = div.querySelector('.mac-red');
    if (redButton) {
        redButton.onclick = () => remover(div.id);
    }
}