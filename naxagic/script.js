const tab = document.querySelector('.TabMenu');
let recomenders = {
    reference: document.querySelector('.centerDiv'),
    loop: false
};
recomenders.reference.psevdoName = 'Effectivity'

const style = document.createElement('style');
style.textContent = `
    .divContent::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* Делает фон прозрачным */
    }
    .divContent {
        -ms-overflow-style: none;  /* IE и Edge */
        scrollbar-width: none;  /* Firefox */
    }
`;
document.head.appendChild(style);

const cache = {};
const Stack = Array.from({length: 3}, () => new Map());
Stack[1].set(recomenders.reference.psevdoName,recomenders.reference);
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
    Stack[1].delete(recomenders.reference.psevdoName);
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
        if (elem.psevdoName) {
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
    Stack[1].set(cache['recomendations'].reference);
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

    const toggleBtn = reference.querySelector('.mac-yellow, .mac-green');
    if(toggleBtn.className.includes('mac-green')) {
        if(Stack[1].size) return;
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
        console.log(toggleBtn.className);
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
            Stack[0].set(reference.psevdoName, reference);
            Stack[1].delete(reference.psevdoName);
        } else {
            if(Stack[1].size) return;
            reference.remove();
            document.body.appendChild(reference);
            Stack[1].set(reference.psevdoName, reference);
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
    let div = createInstance();
    switch (typeOfTab) {
        case 'Wiki': {
            name = 'Recursion Wiki';
            let p = Array.from({length: 2}, () => document.createElement('p'));
            const strs = [
                "Ռեկուրսիան իրենից ներկայացնում է ցանկացած օբյեկտի, երևույթի կամ գործընթացի սահմանման այնպիսի մեթոդ, որի դեպքում տվյալ օբյեկտը նկարագրվում է հենց իր միջոցով։ Սա մի եզակի իրավիճակ է, երբ համակարգի կառուցվածքային ամբողջականությունը ենթադրում է հենց նույնատիպ օբյեկտի առկայություն իր իսկ ներսում՝ ավելի փոքր մասշտաբով կամ պարզեցված տեսքով։ Ըստ էության, մենք գործ ունենք ինքնանմանության սկզբունքի հետ, որտեղ գործընթացի յուրաքանչյուր քայլ հղում է կատարում նախորդին կամ հաջորդին՝ ստեղծելով տրամաբանական մի շղթա, որտեղ ամբողջը բաղկացած է իր իսկ պատճեններից:",
                "Ռեկուրսիայի հասկացությունը հիմնարար դերակատարում ունի մարդկային գիտելիքների ամենատարբեր բնագավառներում՝ սկսած լեզվաբանական կառուցվածքների վերլուծությունից, որտեղ նախադասությունները կարող են ներառել այլ նախադասություններ, մինչև ֆորմալ տրամաբանություն և փիլիսոփայություն։ Սակայն իր առավելագույն գործնական և տեսական արժեքը ռեկուրսիան ստանում է մաթեմատիկական գիտություններում և համակարգչային ճարտարագիտության մեջ։ Ծրագրավորման մեջ այն հանդիսանում է հզորագույն գործիք, որը թույլ է տալիս բարդ խնդիրները տրոհել ավելի պարզ, նույնատիպ ենթախնդիրների՝ ապահովելով կոդի էլեգանտությունն ու ալգորիթմական լուծումների արդյունավետությունը հատկապես տվյալների կառուցվածքների հետ աշխատելիս։"
            ]
            for (let i = 0; i < strs.length; i++) {
                console.log(strs[i]);
                p[i].textContent = strs[i];
            }
            let pathOfImg = ['./images/FibSeq.jpg', './images/FibEx.jpg'];
            let img = Array.from({length: 2}, () => document.createElement('img'));

            let div1 = document.createElement('div');
            div1.classList.add('divContent');
            div1.style.cssText = `
    width: 90%;
    height: 80%;
    display: flex;
    margin:0;
    flex-direction: column; /* Հիմնական ուղղությունը՝ ներքև */
    justify-content: flex-start;
    align-items: center;
    gap: 15px; /* Տարածություն էլեմենտների միջև */
    overflow-y: auto; /* Եթե տեքստը շատ լինի, սքրոլ լինի */
`;

            let imgContainer = document.createElement('div');
            imgContainer.style.cssText = `
    display: flex;
    flex-direction: row; /* Նկարները՝ իրար կողք */
    justify-content: center;
    gap: 10px; /* Նկարների միջև հեռավորություն */
    width: 100%;
`;

            img.forEach((element, index) => {
                element.src = pathOfImg[index];
                element.style.width = "45%";
                element.style.objectFit = "cover";
                element.style.borderRadius = "8px";
                imgContainer.appendChild(element);
            });

            div1.appendChild(p[0]);
            div1.appendChild(imgContainer);
            div1.appendChild(p[1]);

            div.appendChild(div1);
            break;
        }
        case 'Examples': {
            name = 'Recursion Examples';
            let imgPath = './images/FibPhoto.jpg';
            let img = document.createElement('img');
            img.src = './images/FibPhoto.jpg';
            img.style.cssText = `
                max-width:60%;
                max-height:70%;
            `
            let p = document.createElement('p');
            p.style.cssText = `
                font-size:22.5px;
            `
            p.textContent = "Այստեղ բերված են օրինակներ ինչպես է ռեկուրսիայով կառուցված բնությունը, այստեղ կարող ենք նկատել, որ այս ամենը հիշեցնում է ֆիբոնաչիի հաջորդականությունը բնության մեջ և դա ճիշտ նկատումն է քանի որ Ֆիբոնաչին ստեղծել է իր հաջորդականությունը հարյուրավոր տարիներ առաջ և դրա հիման վրա ստեղծվել են ռեկուրենտ ֆունկցիաներ և ռեկուրսիայի գաղափարը";
            let div1 = document.createElement('div');
            div1.style.cssText = `
                width: 90%;
                height: 80%;
                display:flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            `
            div1.appendChild(img);
            div1.appendChild(p);
            div.appendChild(div1);
            break;
        }
        case 'Cybersecurity': {
            name = 'Using Recursion In Cybersecurity';
            let imgPath = ['./images/CBRec.jpg','./images/CBRec2.jpg'];
            let img = document.createElement('img');
            let img1 = document.createElement('img');
            [img.src,img1.src] = imgPath;
            let p = Array.from({length:2},function () {
                return document.createElement('p');
            })
            img.style.cssText = `
                max-width:60%;
                max-height:70%;
            `
            img1.style.cssText = `
                max-width:65%;
                max-height:70%;
            `
            const strs = [
                "Ինչպես են ռեկուրսիան օգտագործում\
                ծրագրավորման և կիբեռանվտանգության մեջ?",
                "Ահա մի օրինակ, նկարում պատկերված է  համակարգչի թղթապանակ պարզագույն ծառ, յուրաքանչյուր\ \
                թղթապանակ գտնվում են ուրիշ թղթապանակներ, որոնք պարունակում տարբեր ֆայլեր։ Ռեկուրսիան մեզ հնարավորություն են տալիս \"ճամփորդել\" թղթապանակների մեջ, այսինքն գրելով ռեկուրսիայի հիման վրա համապատասխան ծրագիր այն կարող է մտնել այդ թղթապանակներ, ուսումնասիրել ֆայլային պարունակությունը, ետ գնալ և ուրիշ թղթապանակներ տեղափոխվել մինչև չգտնի մեր նշված ինֆորմացիայով ֆայլը։\
                ինչպես խոսվել է ռեկուրսինա քայլ առ քայլ է կատարում իր գործողությունները և արդյունք ստանալուց հետո քայլ առ քայլ ետ գալիս,\
                սա շատ հարմար յուրահատկություն է, որը կարելի է օգտագործել այսպիսի դեպքերի համար"
            ]
            for(let i = 0;i < 2;++i){
                p[i].textContent = strs[i];
            }
            let div1 = document.createElement('div');
            div1.style.cssText = `
                position:absolute;
                width:90%;
                height:80%;
                display:flex;
                flex-direction: column;
                justify-content: center;
            `
            let div2 = document.createElement('div');
            div2.style.cssText = `
                display:flex;
                flex-direction: row;
                gap:10px;
            `
            div2.appendChild(img);
            div2.appendChild(img1);
            div1.appendChild(div2);
            for(let i of p){
                div1.appendChild(i);
            }
            div.appendChild(div1);
            break;
        }
        case "Compiler":
            name = 'C++ Compiler';
            break;
        case "AI":
            name = 'Ask to AI';
            break;
    }
    if(Stack[1].size) return;
    if (Stack[1].has(name)) return;
    if (Stack[0].has(name)) {
        let existingTab = Stack[0].get(name);
        Stack[0].delete(name);

        existingTab.remove();
        document.body.appendChild(existingTab);

        existingTab.classList.toggle('minimized');
        existingTab.lastChild.remove();

        Array.from(existingTab.children).forEach(child => {
            if (!child.classList.contains('mac-controls')) {
                child.style.display = 'flex';
            }
        });

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
        Stack[1].set(name, existingTab);
        return;
    }
    let h1 = document.createElement('h1');
    h1.textContent = name;
    h1.style = `
        position: absolute;
        top:5px;
        left:${Math.floor([...Stack[1]][0] / 2)}px;
    `
    div.psevdoName = name;
    div.appendChild(h1);
    document.body.appendChild(div);
    Stack[1].set(div.psevdoName, div);
    let redButton = div.querySelector('.mac-red');
    if (redButton) {
        redButton.onclick = () => remover(div.id);
    }
}