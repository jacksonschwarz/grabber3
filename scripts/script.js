const TOP_BOUNDS=[100, 400];
const LEFT_BOUNDS=[0, 800];
let tokens=[];
let pattern=""
//what position in the pattern 
let currentToken=0;
let points=0;

let global_timerDuration=25;
let global_patternLength=3;
let global_tokenSpeed=2500;
let global_tokenNumber=1;
//TODO: change population algorithm to have the pattern's tokens mixed in with 3 times the amount of random numbered tokens. Add those tokens to a list to be animated
let populateTokens=function(pattern){
    removeTokens();
    for(let char of pattern.split("")){
        createToken(char)
    }
    for(let i=0;i<pattern.length * 2;i++){
        createToken(Math.round(Math.random()*9))
    }
}
let createToken=function(i){
    let id=Math.round(Math.random()*999);

    tokens.push(id)
    $(".board").append(`
    <div class="token" id="token${id}" style="display:initial; top: ${Math.round(Math.random()*(TOP_BOUNDS[1]))+TOP_BOUNDS[0]};left:${Math.round(Math.random()*(LEFT_BOUNDS[1]))+LEFT_BOUNDS[0]}">
        <span class="token-text">${i}</span>
    </div>
    `)
}
let removeTokens=function(){
    for(let id of tokens){
        $("#token"+id).remove()
    }
}
let animateTokens=function(number, duration){
    for(let tokenID of tokens){
        let top=Math.round(Math.random()*TOP_BOUNDS[1])+TOP_BOUNDS[0]
        let left=Math.round(Math.random()*LEFT_BOUNDS[1])+LEFT_BOUNDS[0]
        $(`#token${tokenID}`).animate({
            top:top,
            left:left
        }, duration, "linear", function(){
            animateTokens(number, duration);
        })
    }
}
let resetTimer=function(){
    $(".timer").stop()
    $(".timer").css({height:"0px"})
 
}
let startTimer=function(duration){
    $(".timer").animate({
        height:"100%"
    },  duration*1000, "linear", function(){
        loseGame();
    })
}
let generatePattern=function(length){
    let hasRepeats=false;
    let pattern="";
    do{
        pattern=(Math.floor(Math.random()*9*Math.pow(10, length-1))+1*Math.pow(10, length-1)).toString()
        for(let number of pattern.split("")){
            if((pattern.match(new RegExp(number, "g") || []).length > 1)){
                hasRepeats=true
            }
            else{
                hasRepeats=false;
            }
        }
    }while(hasRepeats==true)
    return pattern;
}
let highlightCharacter=function(string, index){
    let htmlString=string.substr(0, index)+`<span class="highlight">`+string.substr(index, 1)+`</span>`+string.substr(index+32, string.length)
    $(".pattern").html(htmlString);

}
let loseGame=function(){

    removeTokens();
    $(".game-board").hide();
    $(".lose-screen").show();
    console.log("You lost!");
}
let randomColor=function(){
    let r=Math.floor(Math.random()*225)+50;
    let g=Math.floor(Math.random()*225)+50;
    let b=Math.floor(Math.random()*225)+50;
    return [r, g, b]
}
//does all the beginning functions of the game, populating the tokens, setting the timer, etc.
let newRound=function(patternLength, timerDuration, tokenNumber, tokenSpeed){
    $(".game-board").show();
    resetTimer();
    startTimer(timerDuration);
    if(points > 1 && points % 10 == 0 && patternLength < 10){
        global_patternLength ++;
    }
    if(points % 3 == 0 && global_tokenSpeed > 1000){
        global_tokenSpeed -= 100;
    }
    if(global_timerDuration > 20){
        global_timerDuration--;
    }
    pattern=generatePattern(patternLength);
    // console.log(pattern);
    let newColor=randomColor();
    $(".board").animate({
        backgroundColor:`rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`
    })
    populateTokens(pattern);
    animateTokens(tokenNumber,tokenSpeed);
    highlightCharacter(pattern, currentToken);
    $(".token").click(function(){
        let tokenID=parseInt($(this).attr("id").replace("token", ""))
        onClick(tokenID);
    })

}
let onClick=function(tokenID){
   let patternArray = pattern.split("");
   let tokenLabel=$("#token"+tokenID).text().trim()
//    console.log(tokenLabel)
   if(patternArray[currentToken] == tokenLabel){
       currentToken++;
       $(`#token${tokenID}`).css({
            display:"none"
        })
        highlightCharacter(pattern, currentToken);
   }
   if(currentToken == patternArray.length){
       //reinitialize level
       currentToken=0;
       points++;
       $(".points").text(points);
       newRound(global_patternLength, global_timerDuration, global_tokenNumber, global_tokenSpeed);

   }
   
}

$(document).ready(function(){
    $(".lose-screen").hide();
    $(".points").text(points);
    newRound(global_patternLength, global_timerDuration, global_tokenNumber, global_tokenSpeed);
    highlightCharacter(pattern, currentToken);
    $(".token").click(function(){
        let tokenID=parseInt($(this).attr("id").replace("token", ""))
        onClick(tokenID);
    })
})