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
    currentClickedChess: null
};

ChessBoard.Init = function() {
    var self = this;
    this.canvas = document.getElementById("chessboard");
    this.canvas.onmousedown = function(event) {
        self.onMouseDown(event);
    };
    this.canvas.onmouseup = function(event) {
        self.onMouseUp(event);
    };
    this.canvas.onmousemove = function(event) {
        self.onMouseMove(event);
    };
    this.context = this.canvas.getContext("2d");
    this.initChess();
}

ChessBoard.getPointOnCanvas = function(pageX, pageY) {
    var box = this.canvas.getBoundingClientRect();
    return {
        x: pageX - box.left * (this.canvas.width / box.width),
        y: pageY - box.top * (this.canvas.height / box.height)
    };
}

ChessBoard.onMouseDown = function(event) {
    var canvasXY = this.getPointOnCanvas(event.pageX, event.pageY);
    console.log("mouse down: x=" + canvasXY.x + ", y=" + canvasXY.y);
    var chess = this.getChessUnderPoint(canvasXY.x, canvasXY.y);
    if (chess != null) {
        if (this.currentClickedChess == null) {
            this.currentClickedChess = chess;
        } else {
            alert("error...")
        }
    } else {
        if (this.currentClickedChess != null) {
            var type = this.currentClickedChess.type;
            var color = this.currentClickedChess.color;
            var rowCol = this.getRowColByCanvasXY(canvasXY.x, canvasXY.y);
            var row = rowCol.row;
            var col = rowCol.col;
            this.chessInfo[row][col] = this.createChess(type, color, row, col);
            var oldRow = this.currentClickedChess.row;
            var oldCol = this.currentClickedChess.col;
            this.chessInfo[oldRow][oldCol] = this.createChess();
            this.currentClickedChess = null;
            this.dump();

            this.drawChessboard();
        }
    }
}

ChessBoard.dump = function() {
    for (var row = 0; row < this.BOARD_ROW; row++) {
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.chessInfo[row][col];
            if (chess == null) {
                console.log("[" + row + ", " + col + "] = " + "null");
            } else {
                console.log("[" + row + ", " + col + "] = " + this.chessToString(chess));
            }
        }
    }
}

ChessBoard.chessToString = function(chess) {
    var redChessNameArray = [
        "", "车", "马", "炮", "相", "士", "帅", "兵"
    ];
    var blackChessNameArray = [
        "", "车", "马", "炮", "象", "仕", "将", "卒"
    ];
    var strColor = "ERROR";
    var strName = "ERROR";
    if (chess.color == ChessColor.RED) {
        strColor = "红";
        strName = redChessNameArray[chess.type];
    } else if (chess.color == ChessColor.BLACK) {
        strColor = "黑";
        strName = blackChessNameArray[chess.type];
    } else {
        return "Empty";
    }
    return strColor + strName;
}

ChessBoard.onMouseUp = function(event) {
    //var canvasXY = this.getPointOnCanvas(event.pageX, event.pageY);
    //console.log("mouse up: x=" + canvasXY.x + ", y=" + canvasXY.y);
}

ChessBoard.onMouseMove = function(event) {
    //var canvasXY = this.getPointOnCanvas(event.pageX, event.pageY);
    //console.log("mouse move: x=" + canvasXY.x + ", y=" + canvasXY.y);
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
        var chess = this.chessInfo[row][col];
        console.log("chess.type=" + chess.type + ", chess.color=" + chess.color);
        if (chess && chess.type != ChessType.NULL) {
            return chess;
        } else {
            return null;
        }
    }
    return null;
}

ChessBoard.initChess = function() {
    this.chessInfo = [];
    for (var row = 0; row < this.BOARD_ROW; row++) {
        var rowList = [];
        this.chessInfo.push(rowList);
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.createChess(ChessType.NULL, ChessColor.NULL);
            rowList.push(chess);
        }
    }
    
    // Black.
    this.chessInfo[0][0] = this.createChess(ChessType.CAR, ChessColor.BLACK, 0, 0);
    this.chessInfo[0][1] = this.createChess(ChessType.HORSE, ChessColor.BLACK, 0, 1);
    this.chessInfo[0][2] = this.createChess(ChessType.ELEPHANT, ChessColor.BLACK, 0, 2);
    this.chessInfo[0][3] = this.createChess(ChessType.GUARD, ChessColor.BLACK, 0, 3);
    this.chessInfo[0][4] = this.createChess(ChessType.KING, ChessColor.BLACK, 0, 4);
    this.chessInfo[0][5] = this.createChess(ChessType.GUARD, ChessColor.BLACK, 0, 5);
    this.chessInfo[0][6] = this.createChess(ChessType.ELEPHANT, ChessColor.BLACK, 0, 6);
    this.chessInfo[0][7] = this.createChess(ChessType.HORSE, ChessColor.BLACK, 0, 7);
    this.chessInfo[0][8] = this.createChess(ChessType.CAR, ChessColor.BLACK, 0, 8);
    
    this.chessInfo[2][1] = this.createChess(ChessType.CANNON, ChessColor.BLACK, 2, 1);
    this.chessInfo[2][7] = this.createChess(ChessType.CANNON, ChessColor.BLACK, 2, 7);
    
    this.chessInfo[3][0] = this.createChess(ChessType.PAWN, ChessColor.BLACK, 3, 0);
    this.chessInfo[3][2] = this.createChess(ChessType.PAWN, ChessColor.BLACK, 3, 2);
    this.chessInfo[3][4] = this.createChess(ChessType.PAWN, ChessColor.BLACK, 3, 4);
    this.chessInfo[3][6] = this.createChess(ChessType.PAWN, ChessColor.BLACK, 3, 6);
    this.chessInfo[3][8] = this.createChess(ChessType.PAWN, ChessColor.BLACK, 3, 8);

    // Red.
    this.chessInfo[9][0] = this.createChess(ChessType.CAR, ChessColor.RED, 9, 0);
    this.chessInfo[9][1] = this.createChess(ChessType.HORSE, ChessColor.RED, 9, 1);
    this.chessInfo[9][2] = this.createChess(ChessType.ELEPHANT, ChessColor.RED, 9, 2);
    this.chessInfo[9][3] = this.createChess(ChessType.GUARD, ChessColor.RED, 9, 3);
    this.chessInfo[9][4] = this.createChess(ChessType.KING, ChessColor.RED, 9, 4);
    this.chessInfo[9][5] = this.createChess(ChessType.GUARD, ChessColor.RED, 9, 5);
    this.chessInfo[9][6] = this.createChess(ChessType.ELEPHANT, ChessColor.RED, 9, 6);
    this.chessInfo[9][7] = this.createChess(ChessType.HORSE, ChessColor.RED, 9, 7);
    this.chessInfo[9][8] = this.createChess(ChessType.CAR, ChessColor.RED, 9, 8);
    
    this.chessInfo[7][1] = this.createChess(ChessType.CANNON, ChessColor.RED, 7, 1);
    this.chessInfo[7][7] = this.createChess(ChessType.CANNON, ChessColor.RED, 7, 7);
    
    this.chessInfo[6][0] = this.createChess(ChessType.PAWN, ChessColor.RED, 6, 0);
    this.chessInfo[6][2] = this.createChess(ChessType.PAWN, ChessColor.RED, 6, 2);
    this.chessInfo[6][4] = this.createChess(ChessType.PAWN, ChessColor.RED, 6, 4);
    this.chessInfo[6][6] = this.createChess(ChessType.PAWN, ChessColor.RED, 6, 6);
    this.chessInfo[6][8] = this.createChess(ChessType.PAWN, ChessColor.RED, 6, 8);
    
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

ChessBoard.drawChessboard = function(debugFlag) {
    debugFlag = debugFlag || false;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log("clearRect: width=" + this.canvas.width + ", height=" + this.canvas.height);
    if (debugFlag) {
        return;
    }
    /*while (this.chessImageUsingList.length > 0) {
        this.chessImageUnusedList.push(this.chessImageUsingList.pop());
    }*/
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
            var chess = this.chessInfo[row][col];
            if (chess.type != ChessType.NULL) {
                var url = this.chessConfig[chess.type][chess.color];
                this.drawChess(url, x, y);
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
    /*var chessImg = null;
    if (this.chessImageUnusedList.length > 0) {
        chessImg = this.chessImageUnusedList.pop();
    } else {
        chessImg = new Image();
        this.chessImageUsingList.push(chessImg);
    }*/
    var chessImg = new Image();
    chessImg.src = src;
    if (chessImg.complete) {
        this.context.drawImage(chessImg, x, y, this.CHESS_W, this.CHESS_H);
    } else {
        var self = this;
        chessImg.onload = function() {
            self.context.drawImage(chessImg, x, y, self.CHESS_W, self.CHESS_H);
        }
    }   
}
