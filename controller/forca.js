// Sessão de inicialização
const selectedWord = "ALMIR";
const menuUrl = 'projeto-jogo-da-forca\view\menu.html'

// Obtendo elemento da forca
const drawForca = document.getElementById("forca").children
const arrayDrawForca = Array.from(drawForca)

// Função que irá desativar o teclado a fim de evitar que o jogador pressione uma tecla após ter perdido a rodada
const disableKeyboard = () => {
    // Acessando o DOM para selecionar os elementos HTML que representam o teclado no layout
    const btKeyboard = document.getElementsByClassName('bt-keyboard')
    const arrayBtKeyboard = Array.from(btKeyboard)
    
    // Função que irá iterar através dos elementos obtidos no HTML para atribuir a propriedade disabled
    const iterateKeyboard = (keyList) => {
        if(keyList.length == 0)
            return 0

        const [head,...tail] = keyList
        // Atribuindo a propriedade disabled ao elemento HTML que representa a tecla 
        head.disabled = true
        return iterateKeyboard(tail)
    }
    // Chamada da função que irá iterar
    iterateKeyboard(arrayBtKeyboard)
}

// Função que irá renderizar na tela a caixa de texto informando que o usuário venceu a rodada e as opções que ele tem a seguir
const showSucessAlert = () => {
    const sucessAlert = document.getElementById('succesAlert')
    sucessAlert.classList.remove('hidden')

    // Chamada da função para desativar o teclado
    disableKeyboard()
}

// Função que irá renderizar elemento HTML que indica que o usuário perdeu a rodada
const showFailAlert = () => {
    const sucessAlert = document.getElementById('failAlert')
    sucessAlert.classList.remove('hidden')

    // Chamada da função para desativar o teclado
    disableKeyboard()
}

// Função que verifica se o jogador venceu a rodada, ou seja, se todos os campos foram devidademente preenchidos
const checkIfWin = () => {
    // Seleciona o elemento HTML
    const word = document.getElementById("word").children
    // Transforma em um array
    const arrayWord = Array.from(word)
    
    // Função que verifica se todos os campos estão preenchidos, caso tenha algum campo vazio retorna false
    const iterateWord = (list) => {
        if(list.length == 0)
            return true
        
        const [head,...tail] = list
        
        if(head.innerHTML !== "")
            return true && iterateWord(tail)
        
        return false 
    }

    // Chamada da função que irá iterar os campos da palavra para verificar se o usuário venceu a rodada
    return iterateWord(arrayWord)
}

const indef = x => typeof x == 'undefined';

// Função para obter o útimo elemento de uma lista
const returnLast = ([x,...xs]) => xs.length == 0 ? x : returnLast(xs)

// Função que gera o HTML que representa as "caixas" da palavra
const constructWord = (word, pos = null) => {
    if(pos == null)
        pos = 0; 
    return word.length == 0 ? '' : `<td class="border box txt-center" id=${pos}></td>\n` + constructWord(word.slice(1), pos+1);
}

// Função que renderiza o código HTML criado pela função constructWord
const renderWord = (elem) => {
    const container = document.querySelector('.text tr')
    container.innerHTML = elem
}

// Função que receb como parâmetro uma letra e verifica se ela existe em uma palavra, retornando uma lista com as posições onde a palavra foi encontrada
const verificarLetra = (letra,[x,...xs],acc=0) => {
    if (indef(x)) return []
    else if (letra == x) return [acc,...verificarLetra(letra,xs,acc+1)]
    else return [...verificarLetra(letra,xs,acc+1)]
}

// Função que dada uma posicão(id) e uma string, irá renderizar na tela a string na posição indicada
const insertWord = (id, word) => {
    const box = document.getElementById(id)
    // console.log(box)
    box.innerHTML = word    
}

// Função para renderizar o desenho da forca
const renderDraw = (draw) => {
    
    const [head,...tail] = draw
    // Funçao que remove a classe hide do elemento
    const removeElement = head.classList.remove("hide")
    draw.shift()
    if(draw.length == 2){
        showFailAlert()
    }
}

// Função que verifica a existência da letra na palavra e realiza a devida ação para o caso de existir ou não existir
const verifyExistance = (word) => {
    // Verifica se dada a letra word, existe alguma posição na palavra da rodada que corresponda
    const currentPosition = verificarLetra(word, selectedWord);

    // Função que dada uma lista, faz uma iteração para adicionar a letra às posições correspondentes
    const iteratePosition = (list) => {
        if(list.length == 0)  
            return []

        const currentWord = insertWord(list[0], word)

        return iteratePosition(list.slice(1))
    }

    if(currentPosition.length > 0){
        iteratePosition(currentPosition)
        if(checkIfWin())
            // console.log('true')
            // alert('Parabéns, você acertou a palavra!')
            showSucessAlert()
        // else
        //     console.log('false')
    }
    else
        renderDraw(arrayDrawForca)
}

// Renderizando a palavra na tela, inserindo o devido elemento HTML
const currentWord = constructWord(selectedWord);
renderWord(currentWord);

// const restartSession = ()