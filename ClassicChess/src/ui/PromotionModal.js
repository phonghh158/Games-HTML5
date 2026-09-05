// src/ui/PromotionModal.js
class PromotionModal {
    //#region Private Variables
    #overlayElement;
    #containerElement;
    #resolvePromise;
    //#endregion

    //#region Constructor
    constructor(parentContainer) {
        this.#overlayElement = null;
        this.#containerElement = null;
        this.#resolvePromise = null;
        this.#createElements(parentContainer);
    }
    //#endregion

    //#region Private Methods
    #createElements(parentContainer) {
        this.#overlayElement = document.createElement("div");
        this.#overlayElement.className = "promotion-modal-overlay";
        this.#overlayElement.style.display = "none";

        this.#containerElement = document.createElement("div");
        this.#containerElement.className = "promotion-modal-container";

        const title = document.createElement("div");
        title.className = "promotion-title";
        title.textContent = "Select Promotion Piece";

        const choicesContainer = document.createElement("div");
        choicesContainer.className = "promotion-choices";

        const pieces = ["QUEEN", "ROOK", "BISHOP", "KNIGHT"];
        for (const type of pieces) {
            const btn = document.createElement("button");
            btn.className = "promotion-choice-btn";
            btn.dataset.pieceType = type;
            btn.addEventListener("click", () => this.#handleSelect(type));

            const icon = document.createElement("div");
            icon.className = "promotion-piece-icon";
            icon.dataset.piece = type;
            btn.appendChild(icon);

            choicesContainer.appendChild(btn);
        }

        this.#containerElement.appendChild(title);
        this.#containerElement.appendChild(choicesContainer);
        this.#overlayElement.appendChild(this.#containerElement);
        parentContainer.appendChild(this.#overlayElement);
    }

    #handleSelect(pieceType) {
        this.hide();
        if (typeof this.#resolvePromise === "function") {
            this.#resolvePromise(pieceType);
            this.#resolvePromise = null;
        }
    }
    //#endregion

    //#region Public Methods
    show(color) {
        const pieceIcons = this.#containerElement.querySelectorAll(".promotion-piece-icon");
        pieceIcons.forEach((icon) => {
            const type = icon.dataset.piece;
            const prefix = color === "WHITE" ? "w" : "b";
            const typeChar = type === "KNIGHT" ? "N" : type[0];
            icon.style.backgroundImage = `url('./assets/pieces/${prefix}${typeChar}.svg')`;
        });

        this.#overlayElement.style.display = "flex";

        return new Promise((resolve) => {
            this.#resolvePromise = resolve;
        });
    }

    hide() {
        this.#overlayElement.style.display = "none";
    }
    //#endregion
}

export default PromotionModal;
