// src/core/utils/constants.js
const COLORS = Object.freeze({
    WHITE: "white",
    BLACK: "black",
});

const BOARD_SIZE = 8;

const PIECE_TYPES = Object.freeze({
    PAWN: "pawn",
    KNIGHT: "knight",
    BISHOP: "bishop",
    ROOK: "rook",
    QUEEN: "queen",
    KING: "king",
});

const MOVE_TYPES = Object.freeze({
    NORMAL: "normal",
    CAPTURE: "capture",
    CASTLING: "castling",
    EN_PASSANT: "en_passant",
    PROMOTION: "promotion",
});

const GAME_STATUS = Object.freeze({
    ACTIVE: "active",
    CHECK: "check",
    CHECKMATE: "checkmate",
    STALEMATE: "stalemate",
    DRAW: "draw",
});

export { COLORS, BOARD_SIZE, PIECE_TYPES, MOVE_TYPES, GAME_STATUS };
