function Chess(type, color, row, col) {
    type = type || ChessType.NULL;
    color = color || ChessColor.NULL; 
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
}
