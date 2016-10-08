ChessMovementChecker = {}

ChessMovementChecker.Check = function(chess, targetRow, targetCol) {
    switch(chess.type) {
        case ChessType.CAR:
            return this.CheckCar(chess, targetRow, targetCol);
        case ChessType.HORSE:
            return this.CheckHorse(chess, targetRow, targetCol);
        case ChessType.CANNON:
            return this.CheckCannon(chess, targetRow, targetCol);
        case ChessType.ELEPHANT:
            return this.CheckElephant(chess, targetRow, targetCol);
        case ChessType.GUARD:
            return this.CheckGuard(chess, targetRow, targetCol);
        case ChessType.KING:
            return this.CheckKing(chess, targetRow, targetCol);
        case ChessType.PAWN:
            return this.CheckPawn(chess, targetRow, targetCol);
        default:
            alert("error-type::Check()");
            return false;
    }
}

ChessMovementChecker.CheckCar = function(chessCar, targetRow, targetCol) {
    var chessBoard = ChessBoard.chessBoard;
    var row = chessCar.row;
    var col = chessCar.col;
    if (row != targetRow && col != targetCol) {
        return false;
    }
    if (row == targetRow && col != targetCol) {
        var startCol = 0;
        var endCol = 0;
        if (col > targetCol) {
            startCol = targetCol + 1;
            endCol = col;
        } else {
            startCol = col + 1;
            endCol = targetCol;
        }
        for (var i = startCol; i < endCol; i++) {
            var chess = chessBoard[row][i];
            if (chess.type != ChessType.NULL) {
                return false;
            }
        }
    } else if (col == targetCol && row != targetRow) {
        var startRow = 0;
        var endRow = 0;
        if (row > targetRow) {
            startRow = targetRow + 1;
            endRow = row;
        } else {
            startRow = row + 1;
            endRow = targetRow;
        }
        for (var i = startRow; i < endRow; i++) {
            var chess = chessBoard[i][col];
            if (chess.type != ChessType.NULL) {
                return false;
            }
        }
    }
    return true;
}

ChessMovementChecker.CheckHorse = function(chessHorse, targetRow, targetCol) {
    var chessBoard = ChessBoard.chessBoard;
    var row = chessHorse.row;
    var col = chessHorse.col;
    var disRow = row - targetRow;
    var disCol = col - targetCol;
    if (Math.abs(disRow) > 2 || Math.abs(disCol) > 2) {
        return false;
    }
    if (disRow == 0 || disCol == 0) {
        return false;
    }
    if (Math.abs(disRow) == Math.abs(disCol)) {
        return false;
    }
    if (Math.abs(disRow) == 2) {
        if (disRow > 0) {
            var blockChess = chessBoard[row - 1][col];
            if (blockChess.type != ChessType.NULL) {
                return false;
            }
        } else {
            var blockChess = chessBoard[row + 1][col];
            if (blockChess.type != ChessType.NULL) {
                return false;
            }
        }
    } else if (Math.abs(disCol) == 2) {
        if (disCol > 0) {
            var blockChess = chessBoard[row][col - 1];
            if (blockChess.type != ChessType.NULL) {
                return false;
            }
        } else {
            var blockChess = chessBoard[row][col + 1];
            if (blockChess.type != ChessType.NULL) {
                return false;
            }
        }
    }
    return true;
}

ChessMovementChecker.CheckCannon = function(chessCannon, targetRow, targetCol) {
    var chessBoard = ChessBoard.chessBoard;
    var row = chessCannon.row;
    var col = chessCannon.col;
    var eat = false;
    if (chessBoard[targetRow][targetCol].type != ChessType.NULL) {
        eat = true;
    }
    if (row != targetRow && col != targetCol) {
        return false;
    }
    if (row == targetRow && col != targetCol) {
        var startCol = 0;
        var endCol = 0;
        if (col > targetCol) {
            startCol = targetCol + 1;
            endCol = col;
        } else {
            startCol = col + 1;
            endCol = targetCol;
        }
        var count = 0;
        for (var i = startCol; i < endCol; i++) {
            var chess = chessBoard[row][i];
            if (chess.type != ChessType.NULL) {
                ++count;
            }
        }
        if (!eat) {
            if (count > 0) {
                return false;
            }
        } else if (count != 1) {
            return false;
        }
    } else if (col == targetCol && row != targetRow) {
        var startRow = 0;
        var endRow = 0;
        if (row > targetRow) {
            startRow = targetRow + 1;
            endRow = row;
        } else {
            startRow = row + 1;
            endRow = targetRow;
        }
        var count = 0;
        for (var i = startRow; i < endRow; i++) {
            var chess = chessBoard[i][col];
            if (chess.type != ChessType.NULL) {
                ++count;
            }
        }
        if (!eat) {
            if (count > 0) {
                return false;
            }
        } else if (count != 1) {
            return false;
        }
    }
    return true;
}

ChessMovementChecker.CheckElephant = function(chessElephant, targetRow, targetCol) {
    var chessBoard = ChessBoard.chessBoard;
    var row = chessElephant.row;
    var col = chessElephant.col;
    var disRow = row - targetRow;
    var disCol = col - targetCol;
    if (Math.abs(disRow) != 2 || Math.abs(disCol) != 2) {
        return false;
    }
    var blockRow = Math.floor((row + targetRow) / 2);
    var blockCol = Math.floor((col + targetCol) / 2);
    if (chessBoard[blockRow][blockCol].type != ChessType.NULL) {
        return false;
    }
    return true;
}

ChessMovementChecker.CheckGuard = function(chessGuard, targetRow, targetCol) {
    if (!(targetCol >= 3 && targetCol <= 5)) {
        return false;
    }
    if (!(targetRow >= 0 && targetRow <= 2) &&
        !(targetRow >= 7 && targetRow <= 9)) {
        return false;
    }
    var chessBoard = ChessBoard.chessBoard;
    var row = chessGuard.row;
    var col = chessGuard.col;
    var disRow = row - targetRow;
    var disCol = col - targetCol;
    if (Math.abs(disRow) != 1 || Math.abs(disCol) != 1) {
        return false;
    }
    return true;
}

ChessMovementChecker.CheckKing = function(chessKing, targetRow, targetCol) {
    if (!(targetCol >= 3 && targetCol <= 5)) {
        return false;
    }
    if (!(targetRow >= 0 && targetRow <= 2) &&
        !(targetRow >= 7 && targetRow <= 9)) {
        return false;
    }
    var row = chessKing.row;
    var col = chessKing.col;
    var disRow = row - targetRow;
    var disCol = col - targetCol;
    if (Math.abs(disRow) == Math.abs(disCol)) {
        return false;
    }
    return true;
}

ChessMovementChecker.CheckPawn = function(chessPawn, targetRow, targetCol) {
    var chessBoard = ChessBoard.chessBoard;
    var row = chessPawn.row;
    var col = chessPawn.col;
    var disRow = row - targetRow;
    var disCol = col - targetCol;
    if (Math.abs(disRow) > 1 || Math.abs(disCol) > 1) {
        return false;
    }
    if (Math.abs(disRow) == 1 && Math.abs(disCol) == 1) {
        return false;
    }
    if (chessPawn.color == ChessColor.RED) {
        if (targetRow > row) {
            return false;
        }
        if (row >= 5) {
            if (targetCol != col) {
                return false;
            }
        }
    } else {
        if (targetRow < row) {
            return false;
        }
        if (row <= 4) {
            if (targetCol != col) {
                return false;
            }
        }
    }
    return true;
}
