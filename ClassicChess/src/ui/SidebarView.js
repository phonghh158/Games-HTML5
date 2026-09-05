// src/ui/SidebarView.js
class SidebarView {
    //#region Private Variables
    #element;
    #movesContainer;
    #bubbleElement;
    #btnRestart;
    #btnResign;
    #btnDraw;
    #onRestartCallback;
    #onResignCallback;
    #onDrawCallback;
    //#endregion

    //#region Constructor
    constructor({ onRestart, onResign, onDraw } = {}) {
        this.#element = null;
        this.#movesContainer = null;
        this.#bubbleElement = null;
        this.#btnRestart = null;
        this.#btnResign = null;
        this.#btnDraw = null;
        this.#onRestartCallback = onRestart;
        this.#onResignCallback = onResign;
        this.#onDrawCallback = onDraw;
        this.#createElement();
    }
    //#endregion

    //#region Getters
    get element() {
        return this.#element;
    }
    //#endregion

    //#region Private Methods
    #createElement() {
        this.#element = document.createElement("div");
        this.#element.className = "game-right-column";

        const top = document.createElement("div");
        top.className = "sidebar-top";

        const botAvatar = document.createElement("div");
        botAvatar.className = "sidebar-avatar";

        this.#bubbleElement = document.createElement("div");
        this.#bubbleElement.className = "sidebar-bubble";
        this.#bubbleElement.textContent = "Good luck, have fun!";

        top.appendChild(botAvatar);
        top.appendChild(this.#bubbleElement);

        this.#movesContainer = document.createElement("div");
        this.#movesContainer.className = "sidebar-moves";

        const controls = document.createElement("div");
        controls.className = "sidebar-controls";

        this.#btnRestart = document.createElement("button");
        this.#btnRestart.className = "btn-control primary";
        this.#btnRestart.textContent = "New Game";
        this.#btnRestart.addEventListener("click", () => {
            if (typeof this.#onRestartCallback === "function") {
                this.#onRestartCallback();
            }
        });

        this.#btnResign = document.createElement("button");
        this.#btnResign.className = "btn-control";
        this.#btnResign.textContent = "Resign";
        this.#btnResign.addEventListener("click", () => {
            if (typeof this.#onResignCallback === "function") {
                this.#onResignCallback();
            }
        });

        this.#btnDraw = document.createElement("button");
        this.#btnDraw.className = "btn-control";
        this.#btnDraw.textContent = "Draw";
        this.#btnDraw.addEventListener("click", () => {
            if (typeof this.#onDrawCallback === "function") {
                this.#onDrawCallback();
            }
        });

        controls.appendChild(this.#btnRestart);
        controls.appendChild(this.#btnResign);
        controls.appendChild(this.#btnDraw);

        this.#element.appendChild(top);
        this.#element.appendChild(this.#movesContainer);
        this.#element.appendChild(controls);
    }
    //#endregion

    //#region Public Methods
    setDialogue(text) {
        this.#bubbleElement.textContent = text;
    }

    updateHistory(history = []) {
        this.#movesContainer.innerHTML = "";
        let rowElement = null;

        for (let i = 0; i < history.length; i++) {
            const move = history[i];
            if (i % 2 === 0) {
                rowElement = document.createElement("div");
                rowElement.className = "move-row";

                const moveNumber = document.createElement("div");
                moveNumber.className = "move-number";
                moveNumber.textContent = `${Math.floor(i / 2) + 1}.`;
                rowElement.appendChild(moveNumber);

                this.#movesContainer.appendChild(rowElement);
            }

            const moveItem = document.createElement("div");
            moveItem.className = "move-item";
            moveItem.textContent = move.notation || "";
            if (i === history.length - 1) {
                moveItem.classList.add("selected");
            }

            rowElement.appendChild(moveItem);
        }

        this.#movesContainer.scrollTop = this.#movesContainer.scrollHeight;
    }

    clearHistory() {
        this.#movesContainer.innerHTML = "";
    }
    //#endregion
}

export default SidebarView;
