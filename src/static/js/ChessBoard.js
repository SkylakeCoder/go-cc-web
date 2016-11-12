ChessBoard = {
    BOARD_ROW: 10,
    BOARD_COL: 9,
    START_X: 0,
    START_Y: 0,
    STEP_X: 84,
    STEP_Y: 84.5,
    CHESS_W: 80,
    CHESS_H: 80,

    backgroundImg: null,
    chessImageUsingList: [],
    chessImageUnusedList: [],
    currentSelectedChess: null,
    isRedTurn: true,
    debugFlag: false
};

ChessBoard.Init = function() {
    var self = this;
    this.canvas = document.getElementById("chessboard");
    this.canvas.onmousedown = function(event) {
        self.onMouseDown(event);
    };
    this.context = this.canvas.getContext("2d");
    this.initChess();
}

ChessBoard.toString = function() {
    var str = "";
    for (var row = 0; row < this.BOARD_ROW; row++) {
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.chessBoard[row][col];
            str += chess.toString();
        }
    }
    return str;
}

ChessBoard.getPointOnCanvas = function(pageX, pageY) {
    var box = this.canvas.getBoundingClientRect();
    return {
        x: pageX - box.left * (this.canvas.width / box.width),
        y: pageY - box.top * (this.canvas.height / box.height)
    };
}

ChessBoard.drawImage = function(img, src, x, y, w, h) {
    img.src = src;
    if (img.complete) {
        this.context.drawImage(img, x, y, w, h);
    } else {
        var self = this;
        img.onload = function() {
            self.context.drawImage(img, x, y, w, h);
        };
    }
}

ChessBoard.setCurrentSelectedChess = function(chess) {
    if (chess != null && (this.currentSelectedChess == null ||
            this.currentSelectedChess.row != chess.row ||
            this.currentSelectedChess.col != chess.col)) {
        this.drawChessboard();
    }
    this.currentSelectedChess = chess;
}

ChessBoard.moveCurrentSelectedChess = function(targetRow, targetCol) {
    if (this.currentSelectedChess != null) {
        if (!ChessMovementChecker.Check(this.currentSelectedChess, targetRow, targetCol)) {
            console.log("error movement...");
            return;
        }
        var type = this.currentSelectedChess.type;
        var color = this.currentSelectedChess.color;
        this.chessBoard[targetRow][targetCol] = this.createChess(type, color, targetRow, targetCol);
        var oldRow = this.currentSelectedChess.row;
        var oldCol = this.currentSelectedChess.col;
        this.chessBoard[oldRow][oldCol] = this.createChess();
        this.currentSelectedChess = null;
        // this.dump();
        if (!this.debugFlag) {
            this.isRedTurn = !this.isRedTurn;
        }
        this.drawChessboard();

        var self = this;
        $.get("http://localhost:8686?chess=" + this.toString(), function(data, status) {
            //console.log("data=>" + data);
            var index = 0;
            for (var i = 0; i < data.length; i += 2) {
                var type = +data[i];
                var color = +data[i + 1];
                var row = Math.floor(index / self.BOARD_COL);
                var col = Math.floor(index % self.BOARD_COL);
                index++;
                self.chessBoard[row][col] = self.createChess(type, color, row, col);
            }
            self.drawChessboard();
            if (index != 0) {
                self.isRedTurn = !self.isRedTurn;
            }
        });
    }
}

ChessBoard.onMouseDown = function(event) {
    if (!this.isRedTurn) {
        return;
    }
    var canvasXY = this.getPointOnCanvas(event.pageX, event.pageY);
    //console.log("mouse down: x=" + canvasXY.x + ", y=" + canvasXY.y);
    var chess = this.getChessUnderPoint(canvasXY.x, canvasXY.y);
    if (chess != null) {
        if (this.currentSelectedChess == null && chess.color == ChessColor.RED) {
            this.setCurrentSelectedChess(chess);
        } else {
            if (this.currentSelectedChess && chess.color == this.currentSelectedChess.color) {
                this.setCurrentSelectedChess(chess);
            } else {
                this.moveCurrentSelectedChess(chess.row, chess.col);
            }
        }
    } else {
        var rowCol = this.getRowColByCanvasXY(canvasXY.x, canvasXY.y);
        this.moveCurrentSelectedChess(rowCol.row, rowCol.col);
    }
}

ChessBoard.dump = function() {
    for (var row = 0; row < this.BOARD_ROW; row++) {
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.chessBoard[row][col];
            if (chess == null) {
                console.log("[" + row + ", " + col + "] = " + "null");
            } else {
                console.log("[" + row + ", " + col + "] = " + this.chessToString(chess));
            }
        }
    }
    console.log(this.toString());
}

ChessBoard.chessToString = function(chess) {
    var redChessNameArray = [
        "", "��", "��", "��", "��", "ʿ", "˧", "��"
    ];
    var blackChessNameArray = [
        "", "��", "��", "��", "��", "��", "��", "��"
    ];
    var strColor = "ERROR";
    var strName = "ERROR";
    if (chess.color == ChessColor.RED) {
        strColor = "��";
        strName = redChessNameArray[chess.type];
    } else if (chess.color == ChessColor.BLACK) {
        strColor = "��";
        strName = blackChessNameArray[chess.type];
    } else {
        return "Empty";
    }
    return strColor + strName;
}

ChessBoard.getRowColByCanvasXY = function(canvasX, canvasY) {
    return {
        row: Math.floor(canvasY / this.STEP_Y),
        col: Math.floor(canvasX / this.STEP_X)
    };
}

ChessBoard.getChessUnderPoint = function(canvasX, canvasY) {
    var rowCol = this.getRowColByCanvasXY(canvasX, canvasY);
    var row = rowCol.row;
    var col = rowCol.col;
    if (row >=0 && row < this.BOARD_ROW &&
        col >=0 && col < this.BOARD_COL) {
        var chess = this.chessBoard[row][col];
        //console.log("chess.type=" + chess.type + ", chess.color=" + chess.color);
        if (chess && chess.type != ChessType.NULL) {
            return chess;
        } else {
            return null;
        }
    }
    return null;
}

ChessBoard.initChess = function() {
    this.chessBoard = [];
    var initBoard = [
        [ 2, 1, 2, 2, 2, 4, 2, 5, 2, 6, 2, 5, 2, 4, 2, 2, 2, 1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0 ],
        [ 2, 7, 0, 0, 2, 7, 0, 0, 2, 7, 0, 0, 2, 7, 0, 0, 2, 7 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 7, 0, 0, 1, 7, 0, 0, 1, 7, 0, 0, 1, 7, 0, 0, 1, 7 ],
        [ 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 2, 1, 4, 1, 5, 1, 6, 1, 5, 1, 4, 1, 2, 1, 1 ]
    ];
    for (var row = 0; row < this.BOARD_ROW; row++) {
        var rowList = [];
        this.chessBoard.push(rowList);
        for (var col = 0; col < this.BOARD_COL * 2; col+=2) {
            var chess = this.createChess(initBoard[row][col + 1], initBoard[row][col], row, col);
            rowList.push(chess);
        }
    }
    
    this.chessConfig = [
        {},
        {
            1: "img/r_car.png",
            2: "img/b_car.png"
        },
        {
            1: "img/r_horse.png",
            2: "img/b_horse.png"
        },
        {
            1: "img/r_cannon.png",
            2: "img/b_cannon.png"
        },
        {
            1: "img/r_elephant.png",
            2: "img/b_elephant.png"
        },
        {
            1: "img/r_guard.png",
            2: "img/b_guard.png"
        },
        {
            1: "img/r_king.png",
            2: "img/b_king.png"
        },
        {
            1: "img/r_pawn.png",
            2: "img/b_pawn.png"
        }
    ];
    this.drawChessboard();
}

ChessBoard.drawChessboard = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.backgroundImg == null) {
        this.backgroundImg = new Image();
    }
    this.backgroundImg.src = "img/bg.png";
    if (this.backgroundImg.complete) {
        this.context.drawImage(this.backgroundImg, 0, 0);
        this.drawAllChess();
    } else {
        var self = this;
        this.backgroundImg.onload = function() {
            self.context.drawImage(self.backgroundImg, 0, 0);
            self.drawAllChess();
        }
    }
}

ChessBoard.drawAllChess = function() {
    var x = this.START_X;
    var y = this.START_Y;
    for (var row = 0; row < this.BOARD_ROW; row++) {
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.chessBoard[row][col];
            if (chess.type != ChessType.NULL) {
                var url = this.chessConfig[chess.type][chess.color];
                this.drawChess(url, x, y);
                if (this.currentSelectedChess != null &&
                    this.currentSelectedChess.row == chess.row &&
                    this.currentSelectedChess.col == chess.col) {
                    var x = chess.col * this.STEP_X;
                    var y = chess.row * this.STEP_Y;
                    var flagImg = new Image();
                    this.drawImage(flagImg, "img/r_box.png", x, y, this.CHESS_W, this.CHESS_H);
                }
            }
            x += this.STEP_X;
        }
        x = this.START_X;
        y += this.STEP_Y;
    }
}

ChessBoard.createChess = function(chessType, chessColor, chessRow, chessCol) {
    if (chessType == undefined) {
        chessType = ChessType.NULL;
    }
    if (chessColor == undefined) {
        chessColor = ChessType.NULL;
    }
    if (chessRow == undefined) {
        chessRow = -1;
    }
    if (chessCol == undefined) {
        chessCol = -1;
    }
    var chess = new Chess(chessType, chessColor, chessRow, chessCol);
    return chess;
}

ChessBoard.drawChess = function(src, x, y) {
    var chessImg = new Image();
    this.drawImage(chessImg, src, x, y, this.CHESS_W, this.CHESS_H);
}
