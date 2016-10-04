function Chess(type, color) {
    type = type || ChessType.NULL;
    color = color || ChessColor.NULL; 
    this.type = type;
    this.color = color;
}
