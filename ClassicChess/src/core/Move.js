// src/core/Move.js
class Move {
    //#region Private Variable
    #from;
    #to;
    #piece;
    #capturedPiece;
    #isCastling;
    #isEnPassant;
    #promotionPieceType;
    //#endregion

    //#region Constructor
    constructor({
        from,
        to,
        piece,
        capturedPiece = null,
        isCastling = false,
        isEnPassant = false,
        promotionPieceType = null,
    }) {
        this.#from = { row: from.row, col: from.col };
        this.#to = { row: to.row, col: to.col };
        this.#piece = piece;
        this.#capturedPiece = capturedPiece;
        this.#isCastling = isCastling;
        this.#isEnPassant = isEnPassant;
        this.#promotionPieceType = promotionPieceType;
    }
    //#endregion

    //#region Getter
    get from() {
        return { ...this.#from };
    }

    get to() {
        return { ...this.#to };
    }

    get piece() {
        return this.#piece;
    }

    get capturedPiece() {
        return this.#capturedPiece;
    }

    get isCastling() {
        return this.#isCastling;
    }

    get isEnPassant() {
        return this.#isEnPassant;
    }

    get promotionPieceType() {
        return this.#promotionPieceType;
    }

    get isCapture() {
        return this.#capturedPiece !== null || this.#isEnPassant;
    }
    //#endregion
}

export default Move;
