
//Hides login and goes to configuration
function hideLogIn(){

    document.getElementById("loginDiv").style.visibility = "hidden";

    document.getElementById("settingsDiv").style.visibility = "visible";

    document.getElementById("bottom_container").style.visibility = "visible";
}

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

const group = 48;
var game_code;
var user_,pwd_;
var n_cav;
var n_seed;
var difficulty;
var turn = 1;
var p1;
var p2;


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

    createBoard(pc_play);
}

/* Creates the Board */
//pc = 0 - vs Person
//pc = 1 - vs PC
function createBoard(pc) {

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

    if(pc == 0) {
        p1 = new Player(user_,n_cav,n_seed);
        p2 = new Player("other_user",n_cav,n_seed);
    }
    else {
        p1 = new Player(user_,n_cav,n_seed);
        p2 = new Player("PC",n_cav,n_seed);
    }
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
    seed_storage_2.className = "seed_storage"

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
    join();
    if(started == 1){
        alert("O jogo já começou");
        return;
    }
    started = 1;
    p1.storage = 0;
    p2.storage = 0;

    //document.getElementById('state').style.visibility = "visible";
    
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

/* Creates Game based on p1 and p2 array */
function fillSpots () {
    //updateStatus();
    var node = document.getElementsByClassName('cavity');
    for(var i = 0; i<node.length; i++) {
        node[i].innerHTML = "";
    }

    var node = document.getElementsByClassName('storage');
    for(var i = 0; i<node.length; i++) {
        node[i].innerHTML = "";
    }


    var cavity = document.getElementsByClassName('cavity');
    let cav_p1 = 0;
    let cav_p2 = 0;
    var s1 = document.getElementById("storage_1");
    var s2 = document.getElementById("storage_2");
    
    //Filling storage p1
    for(let i = 0; i<p1.storage; i++) {
        //alert("creating: "+p1.cav_array[cav_p1]);
        var seed = document.createElement('div');
        s1.appendChild(seed);
        seed.className = "seed";
        seed.style.width = 30+'%';
        seed.style.height = 30+'%';
        if(p1.storage>9) seed.style.width = 20+'%';
    }

    //Filling storage p2
    for(let i = 0; i<p2.storage; i++) {
        //alert("creating: "+p1.cav_array[cav_p1]);
        var seed = document.createElement('div');
        s2.appendChild(seed);
        seed.className = "seed";
        if(p2.storage>9) seed.style.width = 20+'%';
    }

    //Filling cavities
    for(var i = 0; i<cavity.length; i++) {
        if(i%2 == 0) {
            //alert(i);
            for(var j = 0; j<p1.cav_array[cav_p1]; j++) {
                //alert("creating: "+p1.cav_array[cav_p1]);
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
                seed.style.display = "block-inline";
                if(p1.cav_array[cav_p1] > 9) seed.style.width = 20+'%';
            }
            cav_p1++;
        }
        else {
            for(var j = 0; j<p2.cav_array[cav_p2]; j++) {
                var seed = document.createElement('div');
                cavity[i].appendChild(seed);
                seed.className = "seed";
                seed.style.display = "block-inline";
                if(p2.cav_array[cav_p2] > 9) seed.style.width = 20+'%';
            }
            cav_p2++;
        }
    }
}

/* Fazer um pedido genérico para todas as funções */
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

//TODO - Melhorar
function insertRanks(data) {
    var window = document.getElementById('scores_window');
    window.innerHTML = '<button class = "close_window" onclick = hideScores()>X</button>';
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

//log = 0 - register
//log = 1 - login
function register_log(log) {
    const user = document.getElementById('u_name').value;
    const pwd = document.getElementById('p_name').value;
    user_ = user.toString();
    pwd_ = pwd.toString();

    //Caso não seja introduzido nada nos campos
    if(user_ == "" || pwd_ == "") {
        alert("user name ou password inválida");
        document.location.reload(true);
        return;
    }

    uname = document.createTextNode(user_);
    document.getElementById("user").appendChild(uname);

    const user_pass = {"nick": user_,"password": pwd_};
    console.log(JSON.stringify(user_pass));

    hideLogIn();

    if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

    const xhr = new XMLHttpRequest();

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/register');
    
    xhr.onreadystatechange = function() {
        var response = (xhr.responseText);
        console.log(response);
        if(xhr.readyState == 4 && xhr.status == 200) {
            if(log == 1) {
                alert("login concluido com sucesso");
            }
            else alert("registro concluido com sucesso");
            hideLogIn();
        }
        else {
            //Erro da response
            if (response.error) {
                alert("Username registrado com outra password");
                document.location.reload(true);
                return;
            }
        }
    }
    xhr.send(JSON.stringify(user_pass));
}

/* Emparelha os jogadores */
function join() {
    
    const join_a = {"group": group,"nick": user_,"password": pwd_,"size": n_cav,"initial": n_seed};

    console.log(join_a);

    if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

    const xhr = new XMLHttpRequest();

    xhr.open('POST','http://twserver.alunos.dcc.fc.up.pt:8008/join');
    
    xhr.onreadystatechange = function() {
        var response = (xhr.responseText);
        if(xhr.readyState == 4 && xhr.status == 200) {
            var responseJSON = JSON.parse(response);
            console.log(responseJSON.game)
            update(responseJSON.game);
        }
        else {
            //Erro da response
            if (response.error) {
                alert("erro");
            }
        }
    }
    xhr.send(JSON.stringify(join_a));
    console.log(game_code);

}

function update(response) {
    
    if(!XMLHttpRequest) { console.log('XHR not supported'); return; }

    const xhr = new XMLHttpRequest();
    
    xhr.open('GET','http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+user_+'&game='+response);

    xhr.onreadystatechange = function() {
        var response = (xhr.responseText);
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(response);
        }
        else {
            if (response.error) {
                alert("erro");
            }
        }
    }
}

function leave() {

}


