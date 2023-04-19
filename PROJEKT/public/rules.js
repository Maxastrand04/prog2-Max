

export function kingMove(xstart, ystart, xfinnish, yfinnish) {

    if (Math.abs(xstart - xfinnish) <= 1 && Math.abs(ystart - yfinnish) <= 1){
        return true

    } else{
        return false
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

    if (team === "black"){
        if(kill == true){
            if(Math.abs(xstart-xfinnish) === 1 && yfinnish - ystart === 1){
                return true
    
            } else{
                return false
            }
        } 
        else {
            if ( firstmove === true){
                if (xstart === xfinnish && yfinnish - ystart ==1 || yfinnish - ystart == 2 ){
                    return true
                }
                else {
                    return false
                }
            }

            else if(xstart === xfinnish && yfinnish - ystart === 1){
                return true
    
            } else {
                return false
            }
        }
    }
    else if(team === "white"){
        if(kill == true){
            if(Math.abs(xstart-xfinnish) === 1 && yfinnish - ystart === -1){
                return true
    
            } else{
                return false
            }
        } 
        else {
            if ( firstmove === true){
                if (xstart === xfinnish && yfinnish - ystart === -1 || yfinnish - ystart === -2 ){
                    return true
                }
                else {
                    return false
                }
            }

            else if(xstart === xfinnish && yfinnish - ystart === -1){
                return true
    
            } else {
                return false
            }
        }
    }
}
