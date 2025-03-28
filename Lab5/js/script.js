let blocksList = [];
let currentDragId = "";

class BaseBlock {
    constructor(id, title = "Новый блок") {
        this.id = id;
        this.title = title;
    }

    renderTitle() {
        const isEdit = document.body.classList.contains("editing");
        return `<h3 ${isEdit ? `contenteditable="true" oninput="updateTitle('${this.id}', this.textContent)"` : ""}>
      ${this.title}
    </h3>`;
    }

    renderCard(content) {
        const isEdit = document.body.classList.contains("editing");
        return `<div class="card-block" id="${this.id}" draggable="true">
      ${isEdit ? `<button class="remove" onclick="removeBlock('${this.id}')">&times;</button>` : ""}
      ${content}
    </div>`;
    }

    render() {
        return "";
    }

    static find(id) {
        return blocksList.find(b => b.id === id);
    }
}

class TextBlock extends BaseBlock {
    constructor(id, title, content = "") {
        super(id, title);
        this.content = content;
    }

    render() {
        const isEdit = document.body.classList.contains("editing");
        const contentHTML = `<p ${isEdit ? `contenteditable="true" oninput="updateContent('${this.id}', this.textContent)"` : ""}>
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

    addItem() {
        this.items.push("Новое оружие");
        saveBlocks();
        renderPage();
    }

    deleteItem(idx) {
        this.items.splice(idx, 1);
        saveBlocks();
        renderPage();
    }

    static find(id) {
        return super.find(id) instanceof ListBlock ? super.find(id) : null;
    }

    render() {
        const isEdit = document.body.classList.contains("editing");
        const listHTML = `<ul>
      ${this.items.map((el, idx) => `
        <li>
          <span ${isEdit ? `contenteditable="true" oninput="editListItem('${this.id}', ${idx}, this.textContent)"` : ""}>
            ${el}
          </span>
          ${isEdit ? `<button class="remove-item" onclick="ListBlock.find('${this.id}').deleteItem(${idx})">&times;</button>` : ""}
        </li>`).join("")}
    </ul>`;
        const addBtn = isEdit ? `<button class="add-item" onclick="ListBlock.find('${this.id}').addItem()">Добавить оружие</button>` : "";
        return this.renderCard(this.renderTitle() + listHTML + addBtn);
    }
}

class StatsBlock extends BaseBlock {
    constructor(id, title, stats = {}) {
        super(id, title);
        this.stats = stats;
    }

    addStat() {
        let newKey = "Новая способность", count = 1;
        while (this.stats[newKey]) newKey = `Новая способность ${count++}`;
        this.stats[newKey] = 0;
        saveBlocks();
        renderPage();
    }

    deleteStat(key) {
        delete this.stats[key];
        saveBlocks();
        renderPage();
    }

    static find(id) {
        return super.find(id) instanceof StatsBlock ? super.find(id) : null;
    }

    render() {
        const isEdit = document.body.classList.contains("editing");
        const statsHTML = Object.entries(this.stats).map(([key, val]) => `
      <div class="stat">
        <span class="stat-key" ${isEdit ? `contenteditable="true" oninput="changeStatKey('${this.id}', '${key}', this.textContent)"` : ""}>
          ${key}:
        </span>
        <span class="stat-value" ${isEdit ? `contenteditable="true" oninput="changeStatVal('${this.id}', '${key}', this.textContent)"` : ""}>
          ${val}
        </span>
        ${isEdit ? `<button class="remove-item" onclick="StatsBlock.find('${this.id}').deleteStat('${key}')">&times;</button>` : ""}
      </div>`).join("");
        const addBtn = isEdit ? `<button class="add-item" onclick="StatsBlock.find('${this.id}').addStat()">Добавить способность</button>` : "";
        return this.renderCard(this.renderTitle() + statsHTML + addBtn);
    }
}

const saveBlocks = () => localStorage.setItem("blocksData", JSON.stringify(blocksList));

const loadBlocks = () => {
    const data = localStorage.getItem("blocksData");
    if (data) {
        const raw = JSON.parse(data);
        blocksList = raw.map(obj => {
            if ("content" in obj) return new TextBlock(obj.id, obj.title, obj.content);
            if ("items" in obj) return new ListBlock(obj.id, obj.title, obj.items);
            if ("stats" in obj) return new StatsBlock(obj.id, obj.title, obj.stats);
        });
    } else {
        blocksList = [
            new TextBlock("t1", "погоняло", "Введите имя"),
            new StatsBlock("s1", "способности", {"полёт": 0, "мегапрыжок": 0, "невидимость": 0}),
            new ListBlock("l1", "оружие", ["дубина", "палка", "валына"])
        ];
    }
};

const renderBlocks = () => {
    document.getElementById("main-content").innerHTML = blocksList.map(block => block.render()).join("");
};

const attachDragHandlers = () => {
    const cards = document.querySelectorAll(".card-block");
    cards.forEach(card => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragover", dragOver);
        card.addEventListener("drop", dropBlock);
    });
};

const renderHeader = () => {
    const isEdit = document.body.classList.contains("editing");
    const hdr = document.querySelector("header");
    hdr.innerHTML = `<button onclick="toggleEditing()">
    ${isEdit ? "Сохранить" : "Редактировать"}
  </button>`;
    if (isEdit) {
        hdr.innerHTML += `
      <button onclick="createBlock('text')">новые данные</button>
      <button onclick="createBlock('list')">Новое оружие</button>
      <button onclick="createBlock('stats')">Новые способности</button>
      <button onclick="resetData()">откат</button>
    `;
    }
};

const renderPage = () => {
    renderBlocks();
    attachDragHandlers();
};

const toggleEditing = () => {
    document.body.classList.toggle("editing");
    renderHeader();
    renderPage();
};

const updateTitle = (id, txt) => {
    const b = BaseBlock.find(id);
    if (b) {
        b.title = txt;
        saveBlocks();
    }
};

const updateContent = (id, txt) => {
    const b = BaseBlock.find(id);
    if (b && "content" in b) {
        b.content = txt;
        saveBlocks();
    }
};

const editListItem = (id, idx, txt) => {
    const b = ListBlock.find(id);
    if (b) {
        b.items[idx] = txt;
        saveBlocks();
    }
};

const changeStatKey = (id, oldKey, newKey) => {
    const b = StatsBlock.find(id);
    if (b) {
        const newStats = {};
        Object.entries(b.stats).forEach(([k, v]) => newStats[k === oldKey ? newKey : k] = v);
        b.stats = newStats;
        saveBlocks();
        renderBlocks();
    }
};

const changeStatVal = (id, key, txt) => {
    const b = StatsBlock.find(id);
    if (b) {
        b.stats[key] = txt;
        saveBlocks();
    }
};

const blockConstructors = {
    text: id => new TextBlock(id, "новые данные", "Введите текст..."),
    list: id => new ListBlock(id, "Новое оружие", ["дубина", "палка", "валына"]),
    stats: id => new StatsBlock(id, "Новые способности", {"Способность": 0})
};

const createBlock = type => {
    if (!document.body.classList.contains("editing")) return;
    const newId = "block-" + (blocksList.length + 1);
    const constructor = blockConstructors[type];
    if (constructor) {
        blocksList.push(constructor(newId));
        saveBlocks();
        renderPage();
    }
};

const removeBlock = id => {
    blocksList = blocksList.filter(b => b.id !== id);
    saveBlocks();
    renderPage();
};

const resetData = () => {
    if (!document.body.classList.contains("editing")) return;
    localStorage.clear();
    loadBlocks();
    renderPage();
};

const dragStart = e => {
    if (!document.body.classList.contains("editing")) return;
    currentDragId = e.target.id;
    e.dataTransfer.setData("text/plain", currentDragId);
};

const dragOver = e => {
    if (document.body.classList.contains("editing")) e.preventDefault();
};

const dropBlock = e => {
    if (!document.body.classList.contains("editing")) return;
    e.preventDefault();
    const target = e.target.closest(".card-block");
    if (!target || currentDragId === target.id) return;
    const fromIdx = blocksList.findIndex(b => b.id === currentDragId);
    const toIdx = blocksList.findIndex(b => b.id === target.id);
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