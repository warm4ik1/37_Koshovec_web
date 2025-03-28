let blocksList = [];
let currentDragId = "";

const isEditing = () => document.body.classList.contains("editing");

class BaseBlock {
    constructor(id, title = "Новый блок") {
        this.id = id;
        this.title = title;
    }

    renderTitle() {
        return `<h3 ${isEditing() ? `contenteditable="true" oninput="updateTitle('${this.id}', this.textContent)"` : ""}>
      ${this.title}
    </h3>`;
    }

    renderCard(content) {
        return `<div class="card-block" id="${this.id}" draggable="true">
      ${isEditing() ? `<button class="remove" onclick="removeBlock('${this.id}')">&times;</button>` : ""}
      ${content}
    </div>`;
    }

    render() {
        return "";
    }

    static find(id) {
        return blocksList.find((b) => b.id === id);
    }
}

class TextBlock extends BaseBlock {
    constructor(id, title, content = "") {
        super(id, title);
        this.content = content;
    }

    render() {
        const contentHTML = `<p ${isEditing() ? `contenteditable="true" oninput="updateContent('${this.id}',
         this.textContent)"` : ""}>
      ${this.content}
    </p>`;
        return this.renderCard(this.renderTitle() + contentHTML);
    }
}

class ListBlock extends BaseBlock {
    constructor(id, title, items = []) {
        super(id, title);
        this.items = items;
    }

    addItem = () => {
        this.items.push("Новое оружие");
        saveBlocks();
        renderPage();
    };

    deleteItem = (idx) => {
        this.items.splice(idx, 1);
        saveBlocks();
        renderPage();
    };

    static find(id) {
        const block = super.find(id);
        return block instanceof ListBlock ? block : null;
    }

    render() {
        const listHTML = `<ul>
      ${this.items
            .map((el, idx) => `<li>
          <span ${isEditing() ? `contenteditable="true" oninput="editListItem('${this.id}', ${idx}, this.textContent)"` : ""}>
            ${el}
          </span>
          ${isEditing() ? `<button class="remove-item" onclick="ListBlock.find('${this.id}').deleteItem(${idx})">&times;</button>` : ""}
        </li>`)
            .join("")}
    </ul>`;
        const addBtn = isEditing() ? `<button class="add-item" onclick="ListBlock.find('${this.id}').addItem()">Добавить оружие</button>` : "";
        return this.renderCard(this.renderTitle() + listHTML + addBtn);
    }
}

class StatsBlock extends BaseBlock {
    constructor(id, title, stats = {}) {
        super(id, title);
        this.stats = stats;
    }

    addStat = () => {
        let newKey = "Новая способность", count = 1;
        while (this.stats[newKey]) newKey = `Новая способность ${count++}`;
        this.stats[newKey] = 0;
        saveBlocks();
        renderPage();
    };

    deleteStat = (key) => {
        delete this.stats[key];
        saveBlocks();
        renderPage();
    };

    static find(id) {
        const block = super.find(id);
        return block instanceof StatsBlock ? block : null;
    }

    render() {
        const statsHTML = Object.entries(this.stats)
            .map(([key, val]) => `<div class="stat">
        <span class="stat-key" ${isEditing() ? `contenteditable="true" oninput="changeStatKey('${this.id}', '${key}', this.textContent)"` : ""}>
          ${key}:
        </span>
        <span class="stat-value" ${isEditing() ? `contenteditable="true" oninput="changeStatVal('${this.id}', '${key}', this.textContent)"` : ""}>
          ${val}
        </span>
        ${isEditing() ? `<button class="remove-item" onclick="StatsBlock.find('${this.id}').deleteStat('${key}')">&times;</button>` : ""}
      </div>`)
            .join("");
        const addBtn = isEditing() ? `<button class="add-item" onclick="StatsBlock.find('${this.id}').addStat()">Добавить способность</button>` : "";
        return this.renderCard(this.renderTitle() + statsHTML + addBtn);
    }
}

const saveBlocks = () => localStorage.setItem("blocksData", JSON.stringify(blocksList));

const loadBlocks = () => {
    const data = localStorage.getItem("blocksData");
    if (data) {
        const raw = JSON.parse(data);
        blocksList = raw.map((obj) => {
            if ("content" in obj) return new TextBlock(obj.id, obj.title, obj.content);
            if ("items" in obj) return new ListBlock(obj.id, obj.title, obj.items);
            if ("stats" in obj) return new StatsBlock(obj.id, obj.title, obj.stats);
        });
    } else {
        blocksList = [new TextBlock("t1", "погоняло", "Введите имя"), new StatsBlock("s1", "способности", {
            полёт: 100, мегапрыжок: 60, невидимость: 99,
        }), new ListBlock("l1", "оружие", ["дубина", "палка", "валына"]),];
    }
};

const renderBlocks = () => {
    document.getElementById("blocks-container").innerHTML = blocksList
        .map((block) => block.render())
        .join("");
};

const attachDragHandlers = () => {
    document.querySelectorAll(".card-block").forEach((card) => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragover", dragOver);
        card.addEventListener("drop", dropBlock);
    });
};

const renderHeader = () => {
    const hdr = document.querySelector("header");
    hdr.innerHTML = `<button onclick="toggleEditing()">
      ${isEditing() ? "Сохранить" : "Редактировать"}
    </button>
    ${isEditing() ? `<button onclick="createBlock('text')">Новые данные</button>
           <button onclick="createBlock('list')">Новое оружие</button>
           <button onclick="createBlock('stats')">Новые способности</button>
           <button onclick="resetData()">Откат</button>` : ""}
    <nav class="api-nav">
      <button onclick="showApi('fakestore')">FakeStore API</button>
      <button onclick="showApi('jsonplaceholder')">JSONPlaceholder</button>
      <button onclick="showApi('dog')">Dog API</button>
    </nav>`;
};

const renderPage = () => {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
    <div id="blocks-container"></div>
    <div id="api-container">
      <p>Выберите метод для взаимодействия с API из меню выше</p>
    </div>`;
    renderBlocks();
    attachDragHandlers();
};

const toggleEditing = () => {
    document.body.classList.toggle("editing");
    renderHeader();
    renderPage();
};

const updateTitle = (id, txt) => {
    const block = BaseBlock.find(id);
    if (block) {
        block.title = txt;
        saveBlocks();
    }
};

const updateContent = (id, txt) => {
    const block = BaseBlock.find(id);
    if (block && "content" in block) {
        block.content = txt;
        saveBlocks();
    }
};

const editListItem = (id, idx, txt) => {
    const block = ListBlock.find(id);
    if (block) {
        block.items[idx] = txt;
        saveBlocks();
    }
};

const changeStatKey = (id, oldKey, newKey) => {
    const block = StatsBlock.find(id);
    if (block) {
        block.stats = Object.fromEntries(Object.entries(block.stats).map(([k, v]) => [k === oldKey ? newKey : k, v]));
        saveBlocks();
        renderBlocks();
    }
};

const changeStatVal = (id, key, txt) => {
    const block = StatsBlock.find(id);
    if (block) {
        block.stats[key] = txt;
        saveBlocks();
    }
};

const blockConstructors = {
    text: (id) => new TextBlock(id, "Новые данные", "Введите текст..."),
    list: (id) => new ListBlock(id, "Новое оружие", ["дубина", "палка", "валына"]),
    stats: (id) => new StatsBlock(id, "Новые способности", {Способность: 0}),
};

const createBlock = (type) => {
    if (!isEditing()) return;
    const newId = "block-" + (blocksList.length + 1);
    const constructor = blockConstructors[type];
    if (constructor) {
        blocksList.push(constructor(newId));
        saveBlocks();
        renderPage();
    }
};

const removeBlock = (id) => {
    blocksList = blocksList.filter((b) => b.id !== id);
    saveBlocks();
    renderPage();
};

const resetData = () => {
    if (!isEditing()) return;
    localStorage.clear();
    loadBlocks();
    renderPage();
};

const dragStart = (e) => {
    if (!isEditing()) return;
    currentDragId = e.target.id;
    e.dataTransfer.setData("text/plain", currentDragId);
};

const dragOver = (e) => {
    if (isEditing()) e.preventDefault();
};

const dropBlock = (e) => {
    if (!isEditing()) return;
    e.preventDefault();
    const target = e.target.closest(".card-block");
    if (!target || currentDragId === target.id) return;
    const fromIdx = blocksList.findIndex((b) => b.id === currentDragId);
    const toIdx = blocksList.findIndex((b) => b.id === target.id);
    const [dragged] = blocksList.splice(fromIdx, 1);
    blocksList.splice(toIdx, 0, dragged);
    saveBlocks();
    renderPage();
    currentDragId = "";
};

const initApp = () => {
    document.body.innerHTML = "";
    const hdr = document.createElement("header");
    hdr.className = "page-header";
    document.body.appendChild(hdr);
    const main = document.createElement("main");
    main.id = "main-content";
    document.body.appendChild(main);
    loadBlocks();
    renderHeader();
    renderPage();
};

document.addEventListener("DOMContentLoaded", initApp);
