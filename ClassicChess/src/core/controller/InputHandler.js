// src/controllers/InputHandler.js
class InputHandler {
    //#region Private Variables
    #boardElement;
    #onSquareSelectCallback;
    //#endregion

    //#region Constructor
    constructor(boardElement, onSquareSelectCallback) {
        this.#boardElement = boardElement;
        this.#onSquareSelectCallback = onSquareSelectCallback;
        this.#initEvents();
    }
    //#endregion

    //#region Private Methods
    #initEvents() {
        this.#boardElement.addEventListener("click", this.#handleClick.bind(this));
    }

    #handleClick(event) {
        const squareElement = event.target.closest("[data-row][data-col]");
        if (!squareElement) {
            return;
        }

        const row = parseInt(squareElement.dataset.row, 10);
        const col = parseInt(squareElement.dataset.col, 10);

        if (!isNaN(row) && !isNaN(col) && typeof this.#onSquareSelectCallback === "function") {
            this.#onSquareSelectCallback({ row, col });
        }
    }
    //#endregion

    //#region Public Methods
    destroy() {
        this.#boardElement.removeEventListener("click", this.#handleClick.bind(this));
        this.#onSquareSelectCallback = null;
    }
    //#endregion
}

export default InputHandler;
