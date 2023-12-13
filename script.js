const welcome = document.querySelector(".welcome");
const namepage = document.querySelector(".name-container");
const player_name = document.querySelectorAll(".name-input");
const namepage_button = document.querySelector(".name-container button");
const playpage = document.querySelector(".play-container");
const gridbox = document.querySelectorAll(".gameboard-box");
const wincard = document.querySelector(".wincard");
const playcard = document.querySelectorAll(".player-card");
const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".menu");

const colorred = "#EB5858";
const colorgreen = "#3DE222";

const player1 = {
    id: 1,
    name: "Player 1",
    sign: "X",
    val: 1,
    mod: 3
};

const player2 = {
    id: 2,
    name: "Player 2",
    sign: "O",
    val: 4,
    mod: 12
};

let board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

let play = false;
let player = player1;

let gamefacts = {
    moves: 0,
    matches: 0,
    wonX: 0,
    wonO: 0,
    streakX: 0,
    streakO: 0,
    maxStreakX: 0,
    maxStreakO: 0,
    last5: [0,0,0,0,0],
    updateMoves: function(){
        this.moves ++;
    },
    resetMoves: function(){
        this.moves = 0;
    },
    updateOutcome: function(outcome){
        this.matches ++;
        for(let i = 4; i>0; i--){
            this.last5[i] = this.last5[i-1];
        }
        if(outcome == "win"){
            if(player == player1){
                this.wonX ++;
            }
            else{
                this.wonO ++;
            }
            this.last5[0] = player.id;
        }
        else{
            this.last5[0] = 0;
        }
        if(this.streakX == 0 && this.last5[0] == 1){
            this.streakX++;
        }
        else if(this.streakO == 0 && this.last5[0] == 2){
            this.streakO++;
        }
        if(this.last5[1] == this.last5[0]){
            if(this.last5[0] == 1)
                this.streakX ++;
            else if(this.last5[0] == 2)
                this.streakO ++;
        }
        else{
            if(this.last5[1] == 1)
                this.streakX = 0;
            else if(this.last5[1] == 2)
                this.streakO = 0;
        }
        if(this.streakX > this.maxStreakX)
            this.maxStreakX = this.streakX;
        if(this.streakO > this.maxStreakO)
            this.maxStreakO = this.streakO;
    },
    resetOutcome: function(){
        this.matches = 0;
        this.wonX = 0;
        this.wonO = 0;
        for(let i = 0; i < 5; i++){
            this.last5[i] = 0;
        }
        this.streakO = 0;
        this.streakX = 0;
        this.maxStreakO = 0;
        this.maxStreakX = 0;
    }
}


function fOfi(foEle, fiEle, timeout, bgc = "", bgi = "", display = "block"){
    foEle.style.opacity = 0;
    setTimeout(() => {
        foEle.style.display = "none";
        fiEle.style.display = display;
        fiEle.offsetHeight;
        fiEle.style.opacity = 1;
        foEle.style.opacity = 1;
        if(bgc || bgi){
            document.body.style.backgroundColor = bgc;
            document.body.style.backgroundImage = bgi;
        }
    }, timeout);
}

function resetE(){
    play = false;
    player = player1;
    resetBoard();
    gamefacts.resetMoves();
    gamefacts.resetOutcome();
    updatePlayerCard();
}

function togglePlayer(){
    if(play){
        play = false;
        player = player1;
        playcard[0].style.backgroundColor = "#d9d9d9e0";
        playcard[1].style.backgroundColor = "#d9d9d99d";
    }
    else{
        play = true;
        player = player2;
        playcard[1].style.backgroundColor = "#d9d9d9e0";
        playcard[0].style.backgroundColor = "#d9d9d99d";
    }
}

function getPos(box){
    let num = Array.prototype.indexOf.call(gridbox, box);
    let x = Math.floor(num/3)
    let y = num % 3;
    return [x, y];
}

function updateBoard(box){
    pos = getPos(box);
    board[pos[0]][pos[1]] = player.val;
}

function resetBoard(){
    let svg;
    for(let i = 0; i<3; i++){
        for(let j = 0; j < 3; j++){
            board[i][j] = 0;
            svg = gridbox[i*3 + j].querySelectorAll("svg");
            svg[0].style.display = "none";
            svg[1].style.display = "none";
        }
    }
}

function checkBox(box){
    pos = getPos(box);
    if(board[pos[0]][pos[1]] == 0)
        return true;
    else
        return false;    
}

function playMove(){
    if(checkBox(this)){
        if(player.sign == 'X'){
            const X = this.querySelector(".cross");
            X.style.display = "block";
        }
        else {
            const O = this.querySelector(".circle");
            O.style.display = "block";
        }
        updateBoard(this);
        gamefacts.updateMoves();
        checkWin(this);
        togglePlayer();
    }
}

function checkRow(x){
    let sum = board[x].reduce((partialSum, a) => partialSum + a, 0);
    console.log(`Row ${sum}`);
    if(sum == player.mod)
        return true;
    else
        return false;
}

function checkCol(y){
    let sum = 0;
    for(let i = 0; i<3; i++){
        sum += board[i][y];
    }
    console.log(`Col ${sum}`);
    if(sum == player.mod)
        return true;
    else
        return false;
}

function checkDiag(x, y){
    if(x == y || x == (2-y)){
        let diagx = 0;
        let diagy = 0;
        for(let i = 0; i<3; i++){
            diagx += board[i][i];
            diagy += board[i][(2-i)];
        }
        console.log(`Diagx ${diagx}`);
        console.log(`Diagy ${diagy}`);
        
        if((diagx == player.mod) || (diagy == player.mod))
            return true;
        else
            return false;
    }
    else
        return false;
}

function checkWin(box){
    pos = getPos(box);
    if(checkRow(pos[0]) || checkCol(pos[1]) || checkDiag(pos[0], pos[1]))
        wins();
    else if(gamefacts.moves == 9)
        draw();
    updatePlayerCard();
}

function wins(){
    gamefacts.updateOutcome("win");
    gamefacts.resetMoves();
    resetBoard();
    console.log(`${player.name} Wins!`)
    wincard.innerHTML = `${player.name} Wins!`;
    fOfi(playpage, wincard, 1000);
    setTimeout(() => {
        fOfi(wincard, playpage, 1000, "", "", "flex");
        togglePlayer();
    },1000)
}

function draw(){
    gamefacts.updateOutcome("draw");
    gamefacts.resetMoves();
    resetBoard();
    console.log("draw");
    wincard.innerHTML = "Draw";
    fOfi(playpage, wincard, 1000);
    setTimeout(() => {
        fOfi(wincard, playpage, 1000, "", "", "flex");
        togglePlayer();
    },1000)
}

function updatePlayerCard(){
    for(let i = 0; i < 5; i++){
        if(gamefacts.last5[i] == 1){
            playcard[1].querySelectorAll(".results div")[i].style.backgroundColor = colorred;
            playcard[0].querySelectorAll(".results div")[i].style.backgroundColor = colorgreen;
        }
        else if(gamefacts.last5[i] == 2){
            playcard[0].querySelectorAll(".results div")[i].style.backgroundColor = colorred;
            playcard[1].querySelectorAll(".results div")[i].style.backgroundColor = colorgreen;
        }
        else{
            playcard[0].querySelectorAll(".results div")[i].style.backgroundColor = "#00000000";
            playcard[1].querySelectorAll(".results div")[i].style.backgroundColor = "#00000000";
        }
    }
    if(gamefacts.matches > 0){
        let wonXPer = (gamefacts.wonX*100/gamefacts.matches).toFixed(0);
        let wonOPer = (gamefacts.wonO*100/gamefacts.matches).toFixed(0);
        playcard[0].querySelector(".per").innerHTML = `${wonXPer}%`;
        playcard[1].querySelector(".per").innerHTML = `${wonOPer}%`;
        playcard[0].querySelector(".streak").innerHTML = gamefacts.maxStreakX;
        playcard[1].querySelector(".streak").innerHTML = gamefacts.maxStreakO;
    }
}

function viewPlay(){
    menu.style.opacity = 0;
    menu.style.zIndex = -1;
    playpage.style.zIndex = 1;
    playpage.style.opacity = 1;
    menuButton.style.transform = "scale(1)";
    setTimeout(() => {
        menuButton.querySelector("svg").style.display = "block";
        document.body.style.backgroundImage = "radial-gradient(50% 50% at 50% 50%, #414141 0%, #2D2D2D 100%)";
        document.body.style.backgroundColor = "";
    }, 1000)
}

fOfi(welcome, namepage, 1000);

namepage_button.addEventListener('click', () => {
    if(player_name[0].value){
        player1.name = player_name[0].value;
        playcard[0].querySelector("h1").innerHTML = player_name[0].value;
    }
    if(player_name[1].value){
        player2.name = player_name[1].value;
        playcard[1].querySelector("h1").innerHTML = player_name[1].value;
    }
    playcard[0].style.backgroundColor = "#d9d9d9e0";
    fOfi(namepage, playpage, 1000, "", "radial-gradient(50% 50% at 50% 50%, #414141 0%, #2D2D2D 100%)", display = "flex")
})

for(var i = 0; i<gridbox.length; i++){
    gridbox[i].addEventListener('click', playMove);
}

menuButton.addEventListener('click', () => {
    menuButton.querySelector("svg").style.display = "none";
    menuButton.style.transform = "scale(50)";
    setTimeout(() => {
        document.body.style.backgroundImage = "";
        document.body.style.backgroundColor = "#D9D9D9";
        playpage.style.opacity = 0;
        playpage.style.zIndex = -1;
        menu.style.zIndex = 1;
        menu.style.opacity = 1;
    }, 1000);
})

menu.querySelector(".reset-board").addEventListener('click', () => {
    resetBoard();
    gamefacts.resetMoves();
    if(gamefacts.last5[0] == player1.id){
        play = false
        player = player1;
    }
    else if(gamefacts.last5[0] == player2.id){
        play = true;
        player = player2;
    }
    else if(gamefacts.last5[0] == 0){
        if(gamefacts.last5[1] == player1.id){
            play = false;
            player = player1;
        }
        else if(gamefacts.last5[1] == player2.id){
            play = true;
            player = player2;
        }
    }
    viewPlay();
})

menu.querySelector(".new-session").addEventListener('click', () => {
    resetE();
    viewPlay();
})

menu.querySelector(".resume").addEventListener('click', () => {
    viewPlay();
})

