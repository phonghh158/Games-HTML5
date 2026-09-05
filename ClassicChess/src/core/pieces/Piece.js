// src/core/pieces/Piece.js
class Piece {
    //#region Private Variable
    #type;
    #color;
    #position; // position = { row: number, col: number }
    #hasMoved;
    //#endregion

    //#region Constructor
    constructor(type, color, position, hasMoved = false) {
        if (new.target === Piece) {
            throw new Error("Cannot instantiate abstract class Piece directly.");
        }
        this.#type = type;
        this.#color = color;
        this.#position = { row: position.row, col: position.col };
        this.#hasMoved = hasMoved;
    }
    //#endregion

    //#region Getter Setter
    get type() {
        return this.#type;
    }

    get color() {
        return this.#color;
    }

    get position() {
        return { ...this.#position };
    }

    get hasMoved() {
        return this.#hasMoved;
    }

    set position(position) {
        this.#position = { row: position.row, col: position.col };
    }

    set hasMoved(hasMoved) {
        this.#hasMoved = Boolean(hasMoved);
    }
    //#endregion

    getPossibleMoves(board) {
        throw new Error(
            "Abstract method getPossibleMoves(board) must be implemented by subclass.",
        );
    }

    clone() {
        throw new Error("Abstract method clone() must be implemented by subclass.");
    }
}

export default Piece;
