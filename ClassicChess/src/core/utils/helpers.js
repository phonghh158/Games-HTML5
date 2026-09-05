// src/core/utils/helpers.js
import { BOARD_SIZE } from "./constants.js";

function isInsideBoard(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export { isInsideBoard };
