class piece {
    constructor(self, height, width){
        self.height = height
        self.width = width
    }
}

class king extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}

class queen extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}

class bishop extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}

class knight extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}

class rook extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}

class pawn extends piece {
    constructor(self, team, height, width){
        super(height, width)
        self.team = team
    }


}
