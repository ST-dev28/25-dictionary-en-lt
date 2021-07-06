class Dictionary {
    constructor(selector) {
        this.selector = selector;

        // sarasas, surandu dominancius elementus
        this.DOM = null;
        this.listDOM = null;

        // kuriu formas naujiems irasams 
        this.enWordDOM = null;
        this.ltWordDOM = null;
        this.buttonSaveDOM = null;
        this.addFormDOM = null;

        // atnaujinu irasus
        this.updateFormDOM = null;
        this.updateWordDOM = null;
        this.buttonUpdateDOM = null;
        this.buttonCancelDOM = null;

        this.allEnMemoDOM = null;
        this.allLtMemoDOM = null;
        // is localStorage bandome nuskaityti visas zinutes. Jei grazinamas error, uzsetinamas tuscias tekstas
        this.localStorageMemoIDcount = 'memoID';
        this.localStorageMemoKey = 'memoList';
        this.latestUsedID = JSON.parse(localStorage.getItem(this.localStorageMemoIDcount)) || 0;
        this.savedWords = JSON.parse(localStorage.getItem(this.localStorageMemoKey)) || [];

        this.init();
    }
    init() {
        if (!this.isValidSelector()) {
            return false
        }
        this.DOM = document.querySelector(this.selector);
        if (!this.DOM) {
            console.error('ERROR: Element not found!');
            return false
        }
        this.render();
        this.addEvents();
        this.renderList();
    };
    isValidSelector() {
        if (typeof this.selector !== 'string' ||
            this.selector === '') {
            console.error("ERROR: not valid selector");
            return false
        }
        return true;
    };
    generateAddForm() {
        return `<h1>Dictionary EN-LT</h1>
                <form id="add_word">
                    <input id="en" type="text" placeholder="type EN word" required value="">
                    <input id="lt" type="text" placeholder="type LT word" required value="">
                    <button id="save" type="submit">Save</button>
                    <button id="reset" type="reset">Reset</button>
                </form>
                <h2>Saved words<br>English - Lithuanian</h2>`
    }
    generateUpdateForm() {
        return `<form id="update_word">
                    <input id="upd_word" type="text" placeholder="type EN word" required>
                    <input id="upd_word" type="text" placeholder="type LT word" required>
                    <button id="update_button" type="submit">Update</button>
                    <button id="cancel_button" type="reset">Cancel</button>
                </form>`;
    }
    generateList() {
        return `<list class="words"></list>`
    }
    renderList() {
        for (const word of this.savedWords) {
            this.renderDictionary(word.id, word.en, word.lt)
        };
    }
    renderDictionary(id, enWord, ltWord) {
        const HTML = `<form class="memory">
            <div class="memo" type="text">${enWord}</div>
            <div class="memo" type="text">${ltWord}</div>
            <button id="edit" type="button" href="html" class="fa fa-pencil" aria-hidden="true"></button>
            <button id="delete" type="button" class="fa fa-trash" aria-hidden="true"></button>
        </form>`

        this.listDOM.insertAdjacentHTML('afterbegin', HTML)

        const memoryDOM = this.listDOM.querySelector('.memory');
        const editDOM = memoryDOM.querySelector('.fa.fa-pencil');
        const deleteDOM = memoryDOM.querySelector('.fa.fa-trash');
        //this.allMemoDOM = document.querySelectorAll('.memo');

        deleteDOM.addEventListener('click', () => {
            if (!confirm('Ar tikrai norite istrinti si irasa?')) {
                return false;
            }
            //console.log('trinamas:', memoryDOM.querySelector('.memo').textContent);
            // istrina is interface, bet ne is atminties. Refresinus puslapy, viskas grizta
            memoryDOM.remove();

            this.savedWords = this.savedWords.filter((memory) => memory.id !== id);
            localStorage.setItem(this.localStorageMemoKey, JSON.stringify(this.savedWords));
        })
        editDOM.addEventListener('click', () => {
            this.addFormDOM.classList.add('hide');
            this.updateFormDOM.classList.remove('hide');
            console.log('editing...', enWord, ltWord);
        })
    };
    render() {
        let HTML = ''
        HTML += this.generateAddForm();
        HTML += this.generateList();
        this.DOM.innerHTML = HTML;

        this.listDOM = document.querySelector('list');

        this.addFormDOM = document.getElementById('add_word');
        this.enWordDOM = document.getElementById('en');
        this.ltWordDOM = document.getElementById('lt');
        this.buttonSaveDOM = document.getElementById('save');

        this.updateFormDOM = document.getElementById('update_word');
        this.updateWordDOM = document.getElementById('upd_word');
        this.buttonUpdateDOM = document.getElementById('update_button');
        this.buttonCancelDOM = document.getElementById('update_cancel');
    }
    addEvents() {
        // pridedu irasus
        this.buttonSaveDOM.addEventListener('click', (e) => {
            e.preventDefault();
            /*if (!confirm('Ar tikrai norite prideti si irasa?')) {
                return false;
            }*/
            const enWord = this.enWordDOM.value;
            const ltWord = this.ltWordDOM.value;

            if (enWord === '' || ltWord === '') {
                return false;
            }
            // i sarasa itraukiam nauja irasa
            this.savedWords.push({
                id: ++this.latestUsedID, //sukuriamas vis sekantis unikalus ID
                en: enWord,
                lt: ltWord
            })

            this.renderDictionary(this.latestUsedID, enWord, ltWord)

            // naujas irasas atnaujina, ka turiu atminty
            localStorage.setItem(this.localStorageMemoIDcount, JSON.stringify(this.latestUsedID));
            localStorage.setItem(this.localStorageMemoKey, JSON.stringify(this.savedWords));
        });
        // trinu irasa

        // grizti i pirmine forma
        /*this.buttonCancelDOM.addEventListener('click', (e) => {
            e.preventDefault();
            this.addFormDOM.classList.remove('hide');
            this.updateFormDOM.classList.add('hide');
            // redaguoju irasa
        })*/
    };
}

export { Dictionary };