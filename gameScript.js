var CartasJog, CartasAdv, ImgPizzaria; 
var AllCards = document.getElementsByClassName("numJog")// todas as cartas, usado para inserir as imagens com os números
var pxCartasJog, pxIMgP, pxCartasAdv; // posição X dos elementos que irao se deslocar
var dirCartasJog, dirIMgPizzaria , dirCartasAdv, velDeslocamento;// direção dos elementos anteriores
var adv, jog;// verifica de quem é vez de jogar
//Img da mao que indica que o adversario esta jogando e seus derivados ->
var MaoImg, pxMao, pyMao, remover, primeiraPassada = true;
var sortearCarta, PxCartaSort, PyCartaSort, cartaselecionada;
// até aqui <-
var delay, intervalo, deslizarMao, intervaloCalculo;// intervalos e delays; -> mais para efeitos estéticos
var deslizecentro = false // definir quando deslizar ao centro
var Textinf = document.querySelector("#textoVenc");// texto informativo
var MarcarAdvPontos, MarcarJogPontos;// Marca os pontos nas bolas criculares brancas
var jogo = false
//Calcula as jogadas, o vencedor e verifica se foi usado power-ups
var numerodoAdv, numerodoJogador, substrair, multiplicador, pimenta;
var jogadaJog, jogadaAdv;

window.addEventListener("load", estilizar)

function estilizar(){
    for (var c = 0; c < AllCards.length; c++){
        var imgCartas = document.createElement("img")
        var att1 = document.createAttribute("src")
        att1.value = "cartavirada.jpg"
        imgCartas.setAttributeNode(att1)
        AllCards[c].appendChild(imgCartas)
        var btn = document.querySelector("#btnStart")
        btn.addEventListener("click", StartGame)
    }
}
// chama a função para esconder o botão e começar a jogar
function StartGame(){
    // Daqui
    var Pontos = document.getElementsByClassName("pontos")
    for (var j = 0; j <=27; j++){
        Pontos[j].style.backgroundColor = "black"
    }
    document.querySelector("#jogplaceimg").src = "jog.jpg"
    Textinf.innerHTML = ""
    // até aqui, para quando reiniciar o jogo pelo botão
    c = 1.05
    intervalo = setInterval(btnfadeIn, 70)
}
function btnfadeIn(){
    c -= 0.05
    var btn = document.querySelector("#btnStart")
    var att1 = document.createAttribute("style")
    att1.value = "transform: scale(" + c + ");"
    btn.setAttributeNode(att1)
    if (c <= 0){
        clearInterval(intervalo)
        AtribuirValorVariavies()
        btn.removeAttribute("style")
        btn.src = ""
    }
}

function AtribuirValorVariavies(){
    CartasJog = document.querySelector("#jogadorNums")//cartas do jogador
    CartasAdv = document.querySelector("div#advNums")// cartas do adversario
    ImgPizzaria = document.querySelector("div#pizzaria")//imagem da pizzaria
    velDeslocamento = 5
    pxCartasJog = -228 // posição inicial do conteiner
    pxIMgP = 432 // posiçao inicial
    pxCartasAdv = 650;
    MarcarAdvPontos = 26  
    MarcarJogPontos = 8// relativo a classe, para marcar os pontos
    multiplicador = 1
    jogo = true
    sortearNums()
    ComeçarJogo()
}
// sorteia as cartas
function sortearNums(){
    var n = 4
    var s;
    var especiais = ["doble.jpg", "triple.jpg", "pimenta.jpg"]
    for (var c = 0; c < AllCards.length; c++){
        if (c <= 19){
            AllCards[c].childNodes[0].src = "num" + Math.round(Math.random()*2+1) + ".jpg"
        }else{
            AllCards[c].childNodes[0].src = "num" + Math.round(Math.random()*n+1) + ".jpg"
            if (AllCards[c].childNodes[0].getAttribute("src").match("5")){
                n = 3
            }
        }
    }
    var s2;
    for (c = 0; c < 2; c++){
        if (c == 0){
            s = Math.round(Math.random()*19)// sorteia uma div do jogador para receber power-ups
            s2 = s
        }else{
            do{
                s = Math.round(Math.random()*19)
            }while(s2 == s)
        }
        var p = especiais[Math.round(Math.random()*2)]
        AllCards[s].childNodes[0].src = p
    }
    Textinf.innerHTML = "Roxo pode começar!"
}

function ComeçarJogo(){
    adv = true
    jog = false
    primeiraPassada = true
    deslizarPainel()
    delay = setInterval(desenharMao, 700)
}

// Verifica qual direção o painel acima da imgem dos jogagores deve se deslocar
function deslizarPainel(){
    if (adv || deslizecentro){
        dirCartasAdv = dirCartasJog = dirIMgPizzaria = -1
        intervalo = setInterval(deslizar, 20)
    }else if(jog){
        dirCartasAdv = dirCartasJog = dirIMgPizzaria = 1
        intervalo = setInterval(deslizar, 20) 
    }
}
// desloca o painel de acordo com as especificaçoes da funçao acima
function deslizar(){
    pxCartasAdv += velDeslocamento*dirCartasAdv
    pxCartasJog += velDeslocamento*dirCartasJog
    pxIMgP += velDeslocamento*dirIMgPizzaria
    if (pxCartasAdv <= 515 && adv){
        clearInterval(intervalo)
    }
    if (pxCartasJog >= -10 && jog && !deslizecentro){
        clearInterval(intervalo)
    }
    if(pxCartasJog <= -228 && deslizecentro){
        clearInterval(intervalo)
        deslizecentro = false
    }
    CartasAdv.style.marginLeft = pxCartasAdv + "px"
    CartasJog.style.marginLeft = pxCartasJog + "px"
    ImgPizzaria.style.left = pxIMgP + "px"

}

function desenharMao(){
    clearInterval(delay)
    Textinf.innerHTML = ""
    var ImgMao = document.createElement("img")// tamanho 26X23
    var att1 = document.createAttribute("src")
    var att2 = document.createAttribute("id")
    var att3 = document.createAttribute("style")
    att1.value = "mao.png"
    att2.value = "maoImg"
    pxMao = 825
    pyMao = 40
    att3.value = "position: absolute; left:" + pxMao + "px; top:" +  pyMao +"px;"
    ImgMao.setAttributeNode(att1)
    ImgMao.setAttributeNode(att2)
    ImgMao.setAttributeNode(att3)
    document.body.appendChild(ImgMao)
    MaoImg = document.querySelector("img#maoImg")
    do{
        // 20 é a primeira // 35 a última // 16 casas -1 por ser vetor
        sortearCarta = Math.round(Math.random()*15 + 20)
        PxCartaSort = AllCards[sortearCarta].offsetLeft
        PyCartaSort = AllCards[sortearCarta].offsetTop
        cartaselecionada = AllCards[sortearCarta].childNodes[0].getAttribute("src")
    }while(cartaselecionada == "cartavirada.jpg")
    deslizarMao = setInterval(sortearAdvjogada, 200)
}

function sortearAdvjogada(){
    // 825// 898 // 972// 1047// 1122 posiçoes da maozinha seletora no eixo X
    pxMao += 75
    if (pxMao >= 1122){
        pxMao = 825
        pyMao += 75
    }
    if (pyMao >= 340 && primeiraPassada){
        pyMao = 40
        primeiraPassada = false
    }
    if (!primeiraPassada){
        if (((pxMao >= PxCartaSort) && (pxMao <= PxCartaSort + 50)) && ((pyMao >= PyCartaSort) && (pyMao <= PyCartaSort + 65))){
            clearInterval(deslizarMao)
            remover = setInterval(RemoverMao, 1000)
        }
    }
    MaoImg.style.top = pyMao + "px"
    MaoImg.style.left = pxMao + "px"
    
}
// remove a maozinha depois dela escolhar a carta
function RemoverMao(){
    jogadaAdv = document.querySelector("#cartaAdv")
    document.querySelector("#maoImg").remove()
    clearInterval(remover)
    var imgCartaJogada = document.createElement("img")
    var att1 = document.createAttribute("src")
    var att2 = document.createAttribute("id")
    att1.value = cartaselecionada
    att2.value = "imgCartaJogada"
    imgCartaJogada.setAttributeNode(att1)
    imgCartaJogada.setAttributeNode(att2)
    jogadaAdv.appendChild(imgCartaJogada)
    AllCards[sortearCarta].childNodes[0].src = "cartavirada.jpg"
    adv = false
    jog = true
    deslizarPainel()
    addeventosinJog()
}

// adiciona o evento de click para o jogador escolher uma carta
function addeventosinJog(){
    for (var c = 0; c <= 19; c++){
        var verificarSrc = (AllCards[c].childNodes[0].getAttribute("src"))
        if (!verificarSrc.match("carta")){
            AllCards[c].addEventListener('click', jogadadoJogador)
        }
    }
}
// verifica a carta escolhida pelo jogador
function jogadadoJogador(){
    jogadaJog = document.querySelector("#cartaJog")
    for (var c = 0; c<= 19; c++){
        if (AllCards[c].childNodes[0].src.match("doble") || AllCards[c].childNodes[0].src.match("pimenta") || AllCards[c].childNodes[0].src.match("triple")){
            AllCards[c].removeEventListener("click", jogadadoJogador)
        }
    }
    if (this.childNodes[0].getAttribute("src").match("doble")){
        this.childNodes[0].src = "cartavirada.jpg"
        multiplicador = 2
        Textinf.innerHTML = "Escolha uma carta para X2"
    }else if (this.childNodes[0].getAttribute("src").match("triple")){
        this.childNodes[0].src = "cartavirada.jpg" 
        multiplicador = 3
        Textinf.innerHTML = "Escolha uma carta para X3"
    }else{
        if (this.childNodes[0].getAttribute("src").match("pimenta")){
            pimenta = true
        }
        for (var c = 0; c<= 19; c++){
            AllCards[c].removeEventListener("click", jogadadoJogador)
        }
        var CartaJog = document.createElement("img")
        var att1 = document.createAttribute("src")
        att1.value = this.childNodes[0].getAttribute("src")
        CartaJog.setAttributeNode(att1)
        jogadaJog.appendChild(CartaJog)
        this.childNodes[0].src = "cartavirada.jpg"
        deslizecentro = true
        deslizarPainel()
        intervaloCalculo = setInterval(calcular, 2000)
        Textinf.innerHTML = "Calculando vencedor"  
    }
}
// Verifica quem foi o vencedor da rodada
function calcular (){
    clearInterval(intervaloCalculo)
    var jogadaJog = document.querySelector("#cartaJog").childNodes[0]
    var jogadaAdv = document.querySelector("#cartaAdv").childNodes[0]
    for (var c = 1; c <= 5; c++){
        if (jogadaJog.getAttribute("src").match(c)){
            numerodoJogador = c*multiplicador
        }
        if(jogadaAdv.getAttribute("src").match(c)){
            numerodoAdv = c
        }
    }
    if (numerodoAdv > (numerodoJogador) && (!pimenta)){
        Textinf.innerHTML= "Roxo Ganhou!"
    }else if ((numerodoJogador > numerodoAdv) && (!pimenta)){
        Textinf.innerHTML = "Vermelho venceu!"  
    }else if ((numerodoAdv == numerodoJogador) && (!pimenta)){
        Textinf.innerHTML = "Houve um Empate!"
    }else if (pimenta){
        Textinf.innerHTML = "Toma essa Roxo!"
        document.querySelector("#jogplaceimg").src = "jogvence.gif"
    }
    intervaloCalculo = setInterval(MostrarPontos, 1000) 
}
// Mostra os pontos nas divs circulares brancas
function MostrarPontos(){
    clearInterval(intervaloCalculo)
    var Pontos = document.getElementsByClassName("pontos")
    if ((numerodoAdv > numerodoJogador) && (!pimenta)){
        //Pontos apartir da posição 10
        substrair = numerodoAdv - numerodoJogador
        for (var c = 1; c <= substrair; c++){
           /* em ordem 26, 22, 18, 14, 10 coluna 1
                       27, 23, 19, 15, 11 coluna 2
                           24, 20, 16, 12 coluna 3
                           25, 21, 17, 13 coluna 4
                      para efeitos visuais, posiçoes das divs no vetor que pega elas via class */
            Pontos[MarcarAdvPontos].style.backgroundColor = "white"
            if (MarcarAdvPontos == 10){
                MarcarAdvPontos = 27 + 4
            }else if (MarcarAdvPontos == 11){
                MarcarAdvPontos = 24 + 4
            }else if (MarcarAdvPontos == 12){
                MarcarAdvPontos = 25 + 4
            }else if (MarcarAdvPontos == 13){
                break
            }
            MarcarAdvPontos -= 4
        }
    }else if ((numerodoJogador > numerodoAdv) && (!pimenta)){
        substrair = numerodoJogador - numerodoAdv
        for (c = 1; c <= substrair; c++){
            // em ordem 8, 6, 4, 2, 0
                     // 9, 7, 5, 3, 1
            Pontos[MarcarJogPontos].style.backgroundColor = "white"
            MarcarJogPontos -= 2
            if (MarcarJogPontos == (-2)){
                MarcarJogPontos = 9
            }else if (MarcarJogPontos == -1){
                break
            }
        }
    }else if (pimenta){
        for (c = 10; c < 28; c++){
            Pontos[c].style.backgroundColor = "black"
            MarcarAdvPontos = 25
        }
    }
    delay = setInterval(removerCartasJogadas,800)
    intervalo = setInterval(ProximaJogada, 1500)
}
// remove as cartas jogadas
function removerCartasJogadas(){
    document.querySelector("#jogplaceimg").src = "jog.jpg"
    Textinf.innerHTML = ""
    clearInterval(delay)
    jogadaAdv.childNodes[0].remove()
    jogadaJog.childNodes[0].remove()
    multiplicador = 1
    pimenta = false
}
// volta a jogada para o adversario e retoma todo loop, caso nao haja nehum vencedor
function ProximaJogada(){
    VerificarVenc()
    clearInterval(intervalo)
    if (jogo){
      ComeçarJogo()  
    }
    
}

function VerificarVenc(){
    var Pontos = document.getElementsByClassName("pontos")
    var pontosAdv = 0; // max 18 (vetor de classe do 10 ao 27)
    var pontosJogador = 0 // max 10
    for (var c = 10; c <= 27; c++){
        if (Pontos[c].style.backgroundColor.match("white")){
            pontosAdv++
        }
    }
    for (c = 0; c <= 9; c++){
        if (Pontos[c].style.backgroundColor.match("white")){
            pontosJogador++
        }
    }
    var cartasAdvViradas = 0 // max 16
    var cartasJogViradas = 0 // max 20
    for (c = 20; c < AllCards.length; c++){
        if (AllCards[c].childNodes[0].getAttribute("src").match("cartavirada")){
            cartasAdvViradas ++
        }
    }
    for (c = 0; c <= 19; c++){
        if (AllCards[c].childNodes[0].getAttribute("src").match("cartavirada")){
            cartasJogViradas ++
        }
    }
    if ((pontosJogador == 10) ||(cartasJogViradas == 20 && pontosAdv < pontosJogador) || (cartasAdvViradas == 16 && pontosJogador > pontosAdv)){
        Textinf.innerHTML = "Parabéns Vermelho, você venceu!"
        document.querySelector("#jogplaceimg").src = "jogvence.gif"
        Reiniciar()
        jogo = false
    }else if ((pontosAdv == 18) || (cartasAdvViradas == 16 && pontosJogador < pontosAdv) || (cartasJogViradas == 20 && pontosAdv > pontosJogador)){
        Textinf.innerHTML = "Parabéns Roxo, você venceu!"
        Reiniciar()
        jogo = false
    }else if ((pontosJogador == pontosAdv && cartasJogViradas == 20) || (pontosJogador == pontosAdv && cartasAdvViradas == 16)){
        Textinf.innerHTML = "Partida empatou! Diputem novamente!"
        Reiniciar()
        jogo = false
    }
}

function Reiniciar(){
    var btn = document.querySelector("#btnStart")
    //btn.style.transform = "scale(1.05)"
    btn.src = "start.png"
    for (c = 0; c < AllCards.length; c++){
        AllCards[c].childNodes[0].remove()
    }
    estilizar()
}


