ChessBoard = {
    BOARD_ROW: 10,
    BOARD_COL: 9
};

ChessBoard.Init = function() {
	this.InitBackground();
}

ChessBoard.InitBackground = function() {
    this.canvas = document.getElementById("chessboard");
	this.context = this.canvas.getContext("2d");
	var backgroundImg = new Image();
	backgroundImg.src = "img/bg.png";
	if (backgroundImg.complete) {
	    this.context.drawImage(backgroundImg, 0, 0);    
	} else {
	    var that = this;
        backgroundImg.onload = function() {
            that.context.drawImage(backgroundImg, 0, 0);
            that.InitChesses()
        }	    
	}
}

ChessBoard.InitChesses = function() {
    this.chessInfo = []
    for (var row = 0; row < this.BOARD_ROW; row++) {
        var rowList = []
        this.chessInfo.push(rowList)
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.createChess(ChessType.NULL, ChessColor.NULL);
            rowList.push(chess)           
        }
    }
    
    // Black.
    this.chessInfo[0][0] = this.createChess(ChessType.CAR, ChessColor.BLACK);
    this.chessInfo[0][1] = this.createChess(ChessType.HORSE, ChessColor.BLACK);
    this.chessInfo[0][2] = this.createChess(ChessType.ELEPHANT, ChessColor.BLACK);
    this.chessInfo[0][3] = this.createChess(ChessType.GUARD, ChessColor.BLACK);
    this.chessInfo[0][4] = this.createChess(ChessType.KING, ChessColor.BLACK);
    this.chessInfo[0][5] = this.createChess(ChessType.GUARD, ChessColor.BLACK);
    this.chessInfo[0][6] = this.createChess(ChessType.ELEPHANT, ChessColor.BLACK);
    this.chessInfo[0][7] = this.createChess(ChessType.HORSE, ChessColor.BLACK);
    this.chessInfo[0][8] = this.createChess(ChessType.CAR, ChessColor.BLACK);
    
    this.chessInfo[2][1] = this.createChess(ChessType.CANNON, ChessColor.BLACK);
    this.chessInfo[2][7] = this.createChess(ChessType.CANNON, ChessColor.BLACK);
    
    this.chessInfo[3][0] = this.createChess(ChessType.PAWN, ChessColor.BLACK);
    this.chessInfo[3][2] = this.createChess(ChessType.PAWN, ChessColor.BLACK);
    this.chessInfo[3][4] = this.createChess(ChessType.PAWN, ChessColor.BLACK);
    this.chessInfo[3][6] = this.createChess(ChessType.PAWN, ChessColor.BLACK);
    this.chessInfo[3][8] = this.createChess(ChessType.PAWN, ChessColor.BLACK);

    // Red.
    this.chessInfo[9][0] = this.createChess(ChessType.CAR, ChessColor.RED);
    this.chessInfo[9][1] = this.createChess(ChessType.HORSE, ChessColor.RED);
    this.chessInfo[9][2] = this.createChess(ChessType.ELEPHANT, ChessColor.RED);
    this.chessInfo[9][3] = this.createChess(ChessType.GUARD, ChessColor.RED);
    this.chessInfo[9][4] = this.createChess(ChessType.KING, ChessColor.RED);
    this.chessInfo[9][5] = this.createChess(ChessType.GUARD, ChessColor.RED);
    this.chessInfo[9][6] = this.createChess(ChessType.ELEPHANT, ChessColor.RED);
    this.chessInfo[9][7] = this.createChess(ChessType.HORSE, ChessColor.RED);
    this.chessInfo[9][8] = this.createChess(ChessType.CAR, ChessColor.RED);
    
    this.chessInfo[7][1] = this.createChess(ChessType.CANNON, ChessColor.RED);
    this.chessInfo[7][7] = this.createChess(ChessType.CANNON, ChessColor.RED);
    
    this.chessInfo[6][0] = this.createChess(ChessType.PAWN, ChessColor.RED);
    this.chessInfo[6][2] = this.createChess(ChessType.PAWN, ChessColor.RED);
    this.chessInfo[6][4] = this.createChess(ChessType.PAWN, ChessColor.RED);
    this.chessInfo[6][6] = this.createChess(ChessType.PAWN, ChessColor.RED);
    this.chessInfo[6][8] = this.createChess(ChessType.PAWN, ChessColor.RED);
    
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
    
    this.DrawChesses(); 
}

ChessBoard.DrawChesses = function() {
    var startX = 0;
    var startY = 0;
    var stepX = 84;
    var stepY = 84.5;
    var x = startX;
    var y = startY;
    for (var row = 0; row < this.BOARD_ROW; row++) {
        for (var col = 0; col < this.BOARD_COL; col++) {
            var chess = this.chessInfo[row][col];
            var url = this.chessConfig[chess.type][chess.color];
            this.drawChess(url, x, y)
            x += stepX;
        }
        x = startX;
        y += stepY;
    }
}

ChessBoard.createChess = function(chessType, chessColor) {
    var chess = new Chess(chessType, chessColor);
    return chess;
}

ChessBoard.drawChess = function(src, x, y) {
    var chessW = 80;
    var chessH = 80;
    var chessImg = new Image();
    chessImg.src = src;
    if (chessImg.complete) {
        this.context.drawImage(chessImg, x, y, chessW, chessH);
    } else {
        var that = this;
        chessImg.onload = function() {
            that.context.drawImage(chessImg, x, y, chessW, chessH);
        }
    }   
}
