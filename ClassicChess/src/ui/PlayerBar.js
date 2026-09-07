// src/ui/PlayerBar.js
class PlayerBar {
    //#region Private Variables
    #element;
    #nameElement;
    #eloElement;
    #avatarElement;
    #capturedListElement;
    #advantageElement;
    #clockElement;
    //#endregion

    //#region Constructor
    constructor({ name = "Player", elo = 1200, avatar = "" } = {}) {
        this.#element = null;
        this.#nameElement = null;
        this.#eloElement = null;
        this.#avatarElement = null;
        this.#capturedListElement = null;
        this.#advantageElement = null;
        this.#clockElement = null;
        this.#createElement(name, elo, avatar);
    }
    //#endregion

    //#region Getters
    get element() {
        return this.#element;
    }
    //#endregion

    //#region Private Methods
    #createElement(name, elo, avatar) {
        this.#element = document.createElement("div");
        this.#element.className = "player-bar";

        const info = document.createElement("div");
        info.className = "player-info";

        this.#avatarElement = document.createElement("img");
        this.#avatarElement.className = "player-avatar";
        this.#avatarElement.src =
            avatar ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='%23888'><rect width='32' height='32'/></svg>";
        this.#avatarElement.alt = name;

        const meta = document.createElement("div");
        meta.className = "player-meta";

        const nameWrapper = document.createElement("div");
        nameWrapper.className = "player-name-wrapper";

        this.#nameElement = document.createElement("span");
        this.#nameElement.className = "player-name";
        this.#nameElement.textContent = name;

        this.#eloElement = document.createElement("span");
        this.#eloElement.className = "player-elo";
        this.#eloElement.textContent = `(${elo})`;

        nameWrapper.appendChild(this.#nameElement);
        nameWrapper.appendChild(this.#eloElement);

        const capturedWrapper = document.createElement("div");
        capturedWrapper.style.display = "flex";
        capturedWrapper.style.alignItems = "center";

        this.#capturedListElement = document.createElement("div");
        this.#capturedListElement.className = "captured-pieces-list";

        this.#advantageElement = document.createElement("span");
        this.#advantageElement.className = "material-advantage";

        capturedWrapper.appendChild(this.#capturedListElement);
        capturedWrapper.appendChild(this.#advantageElement);

        meta.appendChild(nameWrapper);
        meta.appendChild(capturedWrapper);

        info.appendChild(this.#avatarElement);
        info.appendChild(meta);

        this.#clockElement = document.createElement("div");
        this.#clockElement.className = "player-clock";
        this.#clockElement.textContent = "10:00";

        this.#element.appendChild(info);
        this.#element.appendChild(this.#clockElement);
    }
    //#endregion

    //#region Public Methods
    updateCaptured(pieces = [], advantage = 0) {
        this.#capturedListElement.innerHTML = "";
        for (const piece of pieces) {
            const item = document.createElement("div");
            item.className = "captured-piece-item";
            const colorFolder = piece.color.toLowerCase();
            const pieceName = piece.type.toLowerCase();
            item.style.backgroundImage = `url('../assets/pieces/${colorFolder}/${pieceName}.svg')`;
            this.#capturedListElement.appendChild(item);
        }

        if (advantage > 0) {
            this.#advantageElement.textContent = `+${advantage}`;
        } else {
            this.#advantageElement.textContent = "";
        }
    }

    setTime(timeString) {
        this.#clockElement.textContent = timeString;
    }

    setActiveTurn(isActive) {
        if (isActive) {
            this.#clockElement.classList.add("active-turn");
        } else {
            this.#clockElement.classList.remove("active-turn");
        }
    }
    //#endregion
}

export default PlayerBar;
