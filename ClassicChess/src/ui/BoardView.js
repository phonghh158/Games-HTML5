// src/ui/BoardView.js
import PromotionModal from "./PromotionModal.js";

class BoardView {
    //#region Private Variables
    #container;
    #boardElement;
    #squares;
    #promotionModal;
    #selectedCoords;
    #lastMoveCoords;
    //#endregion

    //#region Constructor
    constructor(container) {
        this.#container = container;
        this.#boardElement = null;
        this.#squares = [];
        this.#promotionModal = null;
        this.#selectedCoords = null;
        this.#lastMoveCoords = null;
    }
    //#endregion

    //#region Getters
    get boardElement() {
        return this.#boardElement;
    }
    //#endregion

    //#region Lifecycle Methods
    init() {
        this.#container.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "board-wrapper";

        this.#boardElement = document.createElement("div");
        this.#boardElement.className = "chess-board";

        this.#squares = [];
        for (let row = 0; row < 8; row++) {
            this.#squares[row] = [];
            for (let col = 0; col < 8; col++) {
                const square = document.createElement("div");
                const isLight = (row + col) % 2 === 0;
                square.className = `square ${isLight ? "light" : "dark"}`;
                square.dataset.row = row;
                square.dataset.col = col;

                if (col === 7) {
                    const rankLabel = document.createElement("span");
                    rankLabel.className = "coordinate-label coordinate-rank";
                    rankLabel.textContent = 8 - row;
                    square.appendChild(rankLabel);
                }

                if (row === 7) {
                    const fileLabel = document.createElement("span");
                    fileLabel.className = "coordinate-label coordinate-file";
                    fileLabel.textContent = String.fromCharCode(97 + col);
                    square.appendChild(fileLabel);
                }

                this.#boardElement.appendChild(square);
                this.#squares[row][col] = square;
            }
        }

        wrapper.appendChild(this.#boardElement);
        this.#container.appendChild(wrapper);

        this.#promotionModal = new PromotionModal(wrapper);
    }
    //#endregion

    //#region Render Methods
    render(board) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.#squares[row][col];
                const piece = board.getPiece(row, col);

                const existingPiece = square.querySelector(".piece-element");
                if (existingPiece) {
                    existingPiece.remove();
                }

                if (piece !== null) {
                    const pieceElement = document.createElement("div");
                    pieceElement.className = "piece-element";
                    const prefix = piece.color === "WHITE" ? "w" : "b";
                    const typeChar = piece.type === "KNIGHT" ? "N" : piece.type[0];
                    pieceElement.style.backgroundImage = `url('./assets/pieces/${prefix}${typeChar}.svg')`;
                    square.appendChild(pieceElement);
                }
            }
        }
    }

    highlightSelectedSquare(position) {
        this.clearHighlights();
        this.#selectedCoords = position;
        const square = this.#squares[position.row][position.col];
        square.classList.add("selected");
    }

    highlightValidMoves(positions) {
        for (const pos of positions) {
            const square = this.#squares[pos.row][pos.col];
            const hasPiece = square.querySelector(".piece-element") !== null;

            const indicator = document.createElement("div");
            indicator.className = hasPiece ? "capture-move-indicator" : "valid-move-indicator";
            square.appendChild(indicator);
        }
    }

    highlightLastMove(from, to) {
        this.clearLastMove();
        this.#lastMoveCoords = { from, to };
        this.#squares[from.row][from.col].classList.add("last-move");
        this.#squares[to.row][to.col].classList.add("last-move");
    }

    highlightCheck(position) {
        if (position) {
            this.#squares[position.row][position.col].classList.add("in-check");
        }
    }

    clearHighlights() {
        this.#selectedCoords = null;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.#squares[row][col];
                square.classList.remove("selected", "in-check");
                const indicator = square.querySelector(
                    ".valid-move-indicator, .capture-move-indicator",
                );
                if (indicator) {
                    indicator.remove();
                }
            }
        }
    }

    clearLastMove() {
        if (this.#lastMoveCoords) {
            this.#squares[this.#lastMoveCoords.from.row][
                this.#lastMoveCoords.from.col
            ].classList.remove("last-move");
            this.#squares[this.#lastMoveCoords.to.row][
                this.#lastMoveCoords.to.col
            ].classList.remove("last-move");
            this.#lastMoveCoords = null;
        }
    }

    updateStatus(status, turn) {
        // Co the mo rong xu ly overlay khi checkmate / draw
    }

    async showPromotionModal(color) {
        return await this.#promotionModal.show(color);
    }
    //#endregion
}

export default BoardView;
