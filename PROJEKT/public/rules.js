

export function kingMove(xstart, ystart, xfinnish, yfinnish, shortcastle, longcastle) {


    if (shortcastle === true){
        if (xfinnish - xstart === 2 && ystart === yfinnish){
            return {
                shortCastle: true,
                approvedMove: true
            }
        }

    }

    if (longcastle === true){
        if (xstart - xfinnish === 2 && ystart === yfinnish){
            return {
                longCastle: true,
                approvedMove: true
            }
        }
    }

    if (Math.abs(xstart - xfinnish) <= 1 && Math.abs(ystart - yfinnish) <= 1){
        return {approvedMove:true}

    } else{
        return {approvedMove:false}
    }
}


export function queenMove(xstart, ystart, xfinnish, yfinnish){

    if (Math.abs(xstart - xfinnish) === Math.abs(ystart-yfinnish)){
        return true
    }
    else if (xstart === xfinnish || ystart === yfinnish){
        return true

    } else {
        return false
    }
}





export function bishopMove(xstart, ystart, xfinnish, yfinnish){

    if (Math.abs(xstart - xfinnish) === Math.abs(ystart - yfinnish)){
        return true

    } else {
        return false
    }
}



export function knightMove(xstart, ystart, xfinnish, yfinnish){

    if (Math.abs(xstart - xfinnish) === 2 && Math.abs(ystart - yfinnish) === 1){
        return true

    } else if (Math.abs(ystart - yfinnish) === 2 && Math.abs(xstart - xfinnish) === 1){
        return true

    } else{
        return false
    }
}





export function rookMove(xstart, ystart, xfinnish, yfinnish){

    if (xstart === xfinnish || ystart === yfinnish){
        return true

    } else{
        return false
    }
}




export function pawnMove(xstart, ystart, xfinnish, yfinnish, kill, team, firstmove){

    const enPassant = "en Passant"

    if (team === "black"){
        if(kill == true){
            if(Math.abs(xstart-xfinnish) === 1 && yfinnish - ystart === 1){
                
                // Om bonden kommer fram hela vägen så uppgraderas den till drottning
                if (yfinnish == 7){
                    return {
                        approvedMove: true,
                        promotion: true
                    }
                }
                return {approvedMove:true}
    
            } else{
                return {approvedMove:false}
            }
        } 
        else {
            if ( firstmove === true){
                if (xstart === xfinnish && yfinnish - ystart === 1){
                    return {approvedMove: true}
                } else if (xstart === xfinnish && yfinnish - ystart === 2 ){
                    return {
                        enPassant: true,
                        approvedMove: true
                    }
                }
                else {
                    return {approvedMove:false}
                }
            }

            else if (xstart === xfinnish && yfinnish - ystart === 1){
                
                // Om bonden kommer fram hela vägen så uppgraderas den till drottning
                if (yfinnish == 7){
                    return {
                        approvedMove: true,
                        promotion: true
                    }
                }
                return {approvedMove:true}
                
    
            } else {
                return {approvedMove:false}
            }
        }
    }
    else if(team === "white"){
        if(kill == true){
            if(Math.abs(xstart-xfinnish) === 1 && yfinnish - ystart === -1){
                // Om bonden kommer fram hela vägen så uppgraderas den till drottning
                if (yfinnish == 0){
                    return {
                        approvedMove: true,
                        promotion: true
                    }
                }
                return {approvedMove:true}
    
            } else{
                return {approvedMove:false}
            }
        } 
        else {
            if ( firstmove === true){
                if (xstart === xfinnish && yfinnish - ystart === -1){
                    return {approvedMove:true}
                } 
                else if (xstart === xfinnish && yfinnish - ystart === -2 ){
                    return{ 
                        enPassant: true,
                        approvedMove:true
                        
                    }
                }
                else {
                    return {approvedMove:false}
                }
            }

            else if(xstart === xfinnish && yfinnish - ystart === -1){
                
                // Om bonden kommer fram hela vägen så uppgraderas den till drottning
                if (yfinnish == 0){
                    return {
                        approvedMove: true,
                        promotion: true
                    }
                }
                return {approvedMove:true}
    
            } else {
                return {approvedMove:false}
            }
        }
    }
}