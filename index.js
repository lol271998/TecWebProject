function hideLogInUser(){
    hideLogIn();
    showUsername();
}

function hideLogInGuest(){
    hideLogIn();
    showGuest();
}

function hideLogIn(){

    document.getElementById("loginDiv").style.visibility = "hidden";

    document.getElementById("settingsDiv").style.visibility = "visible";

    document.getElementById("bottom_container").style.visibility = "visible";
}

function showUsername() { 
    var username = document.createTextNode(document.getElementById("u_name").value);
    document.getElementById("user").appendChild(username);
}

function showGuest(){
    guest = document.createTextNode("guest");
    document.getElementById("user").appendChild(guest);
}

//Question: Is there a more efficient way to just hide the board or the config depending on where are we in the game?

function showInstructions(){

    document.getElementById('scores').style.visibility = "hidden";
    document.getElementById('instructions').style.visibility = "visible";

}
/*Change Instruction showed*/
function changeInstruction(flag) {
    if(flag == 1) {
        document.getElementById('start').style.visibility = "visible";
        document.getElementById('capture').style.visibility = "hidden";
        document.getElementById('end').style.visibility = "hidden";
    }
    else if (flag == 2) {
        document.getElementById('start').style.visibility = "hidden";
        document.getElementById('capture').style.visibility = "visible";
        document.getElementById('end').style.visibility = "hidden";
    }
    else {
        document.getElementById('start').style.visibility = "hidden";
        document.getElementById('capture').style.visibility = "hidden";
        document.getElementById('end').style.visibility = "visible";
    }

}   

function hideInstructions(){
    document.getElementById('instructions').style.visibility = "hidden";
    document.getElementById('start').style.visibility = "hidden";   
    document.getElementById('capture').style.visibility = "hidden";   
    document.getElementById('end').style.visibility = "hidden"; 
}


var n_cav;
var n_seed;
var difficulty;
var turn = 1;
var p1;
var p2;
const user = document.getElementById('u_name');
const pwd = document.getElementById('p_name');


/* Also Generates the board */
function hideConfigAndSubmit() {
    
    const radios = document.getElementsByName('n_cav');
    
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            n_cav = radios[i].value
            break;
        }
    }

    var pc_play = document.getElementsByName('pc_play');

    if(pc_play[0].checked) {
        var n = document.getElementById('select_dif');
        difficulty = n.value;
    }

    n_seed = document.getElementById('n_seed').value;

    document.getElementById('settingsDiv').style.visibility = "hidden";
    document.getElementById('difficulty').style.visibility = "hidden";
    document.getElementById('select_dif').style.visibility = "hidden";
    document.getElementById('board').style.visibility = "visible";

    var board = document.getElementById('board');
    var storage_1 = document.createElement('div');

    storage_1.id = "storage_1";
    storage_1.className = "storage";

    board.appendChild(storage_1);
    
    var game_area = document.createElement('div');
    game_area.id = "game_area";
    board.appendChild(game_area);

    for (var a = 0; a<n_cav; a++) {
        game_area.appendChild(createCollumn(a));
    }

    var storage_2 = document.createElement('div');

    storage_2.id = "storage_2";
    storage_2.className = "storage";

    board.appendChild(storage_2);

    p1 = new Player(user,n_cav,n_seed);
    p2 = new Player("PC",n_cav,n_seed);
}

/* Creates each column with 1 cavity for each player */
function createCollumn(index) {
    var column = document.createElement('div');
    var cavity_1 = document.createElement('div');
    var cavity_2 = document.createElement('div');
    var seed_storage_1 = document.createElement('div');
    var seed_storage_2 = document.createElement('div');
    cavity_1.id = "cavity"+index+"p1";
    cavity_2.id = "cavity"+index+"p2";
    seed_storage_1 = "storage"+index+"p1";
    seed_storage_2 = "storage"+index+"p2";

    cavity_1.className = "cavity";
    cavity_2.className = "cavity";
    seed_storage_1.className = "seed_storage"

    column.className = "column";
    column.style.width = (100/n_cav)+'%';

    column.appendChild(cavity_1);
    column.appendChild(cavity_2);

    
    cavity_1.onclick = ((fun,pos,p) => {
        return () => fun(pos,p);
    })(this.play.bind(this),index,1);

    cavity_2.onclick = ((fun,pos,p) => {
        return () => fun(pos,p);
    })(this.play.bind(this),index,2);

    return column;
}

/*Class for each player*/
class Player {

    constructor (uname,n_cav,n_seed) {
        this.uname = uname;
        this.n_cav = n_cav;
        this.n_seeds = n_seed;
        this.cav_array = [];
        this.storage = 0;
        this.victory = 0;
        for(var i = 0; i<n_cav; i++) {
            this.cav_array.push(n_seed);
        }
    }

    reset_array() {
        this.cav_array = [];
        for(var i = 0; i<n_cav; i++) {
            this.cav_array.push(n_seed);
        }
    }
}

const turnName = ["Jogador 1","Jogador 2"]
var started = 0;

/* Just starts the game */
function startGame(){
    if(started == 1){
        alert("O jogo já começou");
        return;
    }
    started = 1;
    p1.storage = 0;
    p2.storage = 0;

    document.getElementById('state').style.visibility = "visible";
    
    fillSpots();
}

/* Main function that plays the game */
function play(index,p) {

    if(started != 1){
        alert("Carregue em Começar o Jogo");
        return;
    }

    if(check_cav(p) == 0){ 
        finish_game();
        return;
    }

    //P1 Plays
    if(p == 1 && turn == 1) {
        //Number of seeds Available to spread
        let temp = p1.cav_array[index];
        if(temp == 0){
            //No seeds, choose another cav
            alert("Escolher outra cavidade, essa está vazia");
            return;
        }
        else {
            //Empty chosen cav
            p1.cav_array[index] = 0;
            index--;
            while(temp != 0) {
                //Feed P1 cav - Counter ClockWise
                for(let i = index; i>=0; i--) {
                    p1.cav_array[i]++;
                    temp--;
                    index--;
                    //Ended on P1 cav - P2 plays
                    if(temp == 0) {
                        turn = 2;
                        fillSpots();
                        return;
                    }
                }
                //Storage P1
                if(index == -1) {
                    p1.storage++;
                    temp--;
                    //Storage for last piece - P1 plays again
                    if(temp == 0){
                        turn = 1;
                        fillSpots();
                        return;
                    }
                    //Feed P2 cav
                    else {
                        for(let i = 0; i<p2.cav_array.length; i++) {
                            p2.cav_array[i]++;
                            temp--;
                            //Ended on P2 board - P2 turn
                            if(temp == 0) {
                                turn = 2;
                                fillSpots();
                                return;
                            }
                        }                     
                    }
                }
                //Did not finished temp
                index = p1.cav_array.length-1;  
            }
            turn = 2;
            fillSpots();
            return;
        }
    }
    //Not P1 turn
    else if(p == 1 && turn == 2){
        alert("Não é a sua vez de jogar");
        return;
    }
    //P2 Plays
    if(p == 2 && turn == 2) {
        
        //Number of seeds Available to spread
        let temp = p2.cav_array[index];
        if(temp == 0){
            //Chose empty cav
            alert("Escolher outra cavidade, essa está vazia");
            return;
        }
        else {   
            //Empty chosen Cav 
            p2.cav_array[index] = 0;
            index++;
            while(temp != 0) {  
                //Feed P2 cav - Counter Clock Wise
                for(let i = index; i<p2.cav_array.length; i++) {
                    p2.cav_array[i]++;
                    index++;
                    temp--;
                    //Ended on P2 cav - P1 plays
                    if(temp == 0) {
                        turn = 1;
                        fillSpots();
                        return;
                    }
                }
                //Storage P2
                if(index == p2.cav_array.length) {
                    p2.storage++;
                    temp--;
                    //Storage for last piece - P2 plays again
                    if(temp == 0){
                        turn = 2;
                        fillSpots();
                        return;
                    }
                    //Feed P1 cav - Counter ClockWise
                    else {
                        for(let i = p1.cav_array.length-1; i>=0; i--) {
                            p1.cav_array[i]++;
                            temp--;
                            //Ended on P1 board - P1 turn
                            if(temp == 0) {
                                turn = 1;
                                fillSpots();
                                return;
                            }
                        }                     
                    }
                }
                //Did not finished temp
                index = 0;  
            }
            turn = 1;           
            fillSpots();
            return;
        }
    }
    else if(p == 2 && turn == 1) {
        alert("Não é a sua vez de jogar");
        return;
    }
}

/* Checks if game is ready to end */
function check_cav(p) {
    if(p == 1) {
        for(let i = 0; i<p1.cav_array.length; i++) {
            if(p1.cav_array[i] != 0) return 1;
        }
        return 0;
    }
    else { 
        for(let i = 0; i<p2.cav_array.length; i++) {
            if(p2.cav_array[i] != 0) return 1;
        }
        return 0;
    }
}

/* Finishes the game */
function finish_game() {

    for(let i = 0; i<p1.cav_array.length; i++) {
        p1.storage+=p1.cav_array[i];
        p2.storage+=p2.cav_array[i];
    }

    if(p1.storage>p2.storage){
        alert("Terminou ganhou p1");
        p1.victory++;
    }
    else if(p1.storage<p2.storage){
        alert("Terminou ganhou p2");
        p2.victory++;
    }
    else {
        alert("Empate");
    }

    p1.storage = 0;
    p2.storage = 0;

    started = 0;

    p1.reset_array();
    p2.reset_array();

    alert("Carregue em Começar jogo, para jogar mais uma vez");

}

/* Update status from status board, and classifications */
function updateStatus () {

    if(turn == 1) {
        document.getElementById("turn").innerHTML=p1.uname.value;
    }
    else {
        document.getElementById("turn").innerHTML=p2.uname;
    }

    document.getElementById("storage_seed_p1").innerHTML = p1.storage;
    document.getElementById("storage_seed_p2").innerHTML = p2.storage;

    document.getElementById("victory_p1").innerHTML = p1.victory;
    document.getElementById("victory_p2").innerHTML = p2.victory;
    document.getElementById("victory_p1_class").innerHTML = p1.victory;
    document.getElementById("victory_p2_class").innerHTML = p2.victory;
}

//Creates Game based on p1 and p2 array
function fillSpots () {
    updateStatus();
    var node = document.getElementsByClassName('cavity');
    for(var i = 0; i<node.length; i++) {
        node[i].innerHTML = "";
    }

    var node = document.getElementsByClassName('storage');
    for(var i = 0; i<node.length; i++) {
        node[i].innerHTML = "";
    }
    
    //alert("all clean");

    var cavity = document.getElementsByClassName('cavity');
    let cav_p1 = 0;
    let cav_p2 = 0;
    var s1 = document.getElementById("storage_1");
    var s2 = document.getElementById("storage_2");
    
    for(let i = 0; i<p1.storage; i++) {
        //alert("creating: "+p1.cav_array[cav_p1]);
        var seed = document.createElement('div');
        s1.appendChild(seed);
        seed.className = "seed";
    }

    for(let i = 0; i<p2.storage; i++) {
        //alert("creating: "+p1.cav_array[cav_p1]);
        var seed = document.createElement('div');
        s2.appendChild(seed);
        seed.className = "seed";
    }

    for(var i = 0; i<cavity.length; i++) {
        if(i%2 == 0) {
            //alert(i);
            for(var j = 0; j<p1.cav_array[cav_p1]; j++) {
                //alert("creating: "+p1.cav_array[cav_p1]);
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
            }
            cav_p1++;
        }
        else {
            for(var j = 0; j<p2.cav_array[cav_p2]; j++) {
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
            }
            cav_p2++;
        }
    }
}

//Fazer um pedido genérico para todas as funções

function getRanking() {

    document.getElementById('instructions').style.visibility = "hidden";
    document.getElementById('scores').style.visibility = "visible";

    if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

    const xhr = new XMLHttpRequest();

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/ranking');
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            insertRanks(data);
        }
    }
    xhr.send(JSON.stringify({}));
}

// Melhorar

function insertRanks(data) {
    var window = document.getElementById('scores_window');
    var ranking = document.createElement('ul');
    window.appendChild(ranking);

    for(var i = 0; i<data.ranking.length; i++) {
        var rank = document.createElement('ol');
        ranking.appendChild(rank);
        rank.innerHTML = i+':' +data.ranking[i].nick+' '+data.ranking[i].victories+' '+data.ranking[i].games;
    }
}

function hideScores(){
    document.getElementById('scores').style.visibility = "hidden";
}

function notify() {

}



function resgister() {
    var user = document.getElementById('u_name');
    var pwd = document.getElementById('p_name');

    document.getElementById('instructions').style.visibility = "hidden";
    document.getElementById('scores').style.visibility = "visible";

    if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

    const xhr = new XMLHttpRequest();

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/register');
    
    xhr.onreadystatechange = function() {
        let response = JSON.parse(xhr.responseText);
        console.log(response);
        if(xhr.readyState == 4 && xhr.status == 200) {
            
        }
        else {
            //Erro da response
            if (response.error) {
                //Display da mensagem e fazer reset aos inputs. A vermelho
            }
        }
    }
    xhr.send(JSON.stringify());

}

/*5 argumentos*/
function join() {

}

function leave() {

}


function update() {
    
}


