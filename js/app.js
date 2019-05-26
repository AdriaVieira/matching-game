
let cartasViradas = []; //array que recebera as duas cartas viradas
let simbolo = []; //array de verificacao se simbolos sao iguais
let pontos = 0; //contagem de quantos acertos foram feitos
let cartas; //variavel receberá as cartas do baralho
const modal = $('.modal'); //chamada da tela modal
let movimentos = 0; //contagem de movimentos
const stars = $('.fa-star'); //array que recebera os elementos com a classe fa-star
let starCount = 3; //contagem das estrelas
const segundo = $('#segundo'); //recebe o id segundo usado no temporizador
const minuto = $('#minuto'); //recebe o id minuto usado no temporizador
let seg = 0; //variavel de incremento usado no temporizador
let min = 0; //variavel de incremento usado no temporizador
let reset;
let paused = false;

//evento para o botao de start
$('#startGame').on('click', function(){
	//condicoes para o botao pause
	if($('#startGame').html() === "Start"){
	jogo();
	$('#startGame').html('Pause');

	}else if($('#startGame').html() === "Pause"){
		paused = true;
		$('#startGame').html('Back');

	}else if($('#startGame').html() === "Back"){
		paused = false;
		$('#startGame').html('Pause');
	}

});


function jogo(){
	start(); //inicio do jogo
	//funcao que adiciona um evento aos elementos do deck
	$(".deck").on("click", function(evt){
			if(evt.target.nodeName.toLowerCase() === 'li'){
				if(paused === true){
					return;
				}else{
					virarCarta(evt.target);
				}
			}
	});

	//funcao para o botao de restart
	$('.restart').on("click", function(){
		cartas.removeClass('open show match');
		start();
	});

	//essa funcao comeca o jogo
	function start(){
		//quando um novo jogo comeca, as variaveis são zeradas
		cartasViradas = [];
		simbolo = [];
		pontos = 0;
		movimentos = 0;
		starCount = 3; //reinicia a contagem
		min = 0;
		seg = 0;
		minuto.html('0');
	  	segundo.html('0');
		$('.moves').html('0'); //zera o elemento span moves
		var score = $('.stars'); //atribuindo o elemento que mantem as estrelas a variaval score
		score.html(stars); //score recebera a variavel stars que possui as tres figuras de estrela
		pararTempo(); //dando um clear no setInterval
		reset = setInterval(tempo, 1000);
		paused = false;
		$('#startGame').html('Pause');


		cartas = $('.card'); //lista que mantem todas as cartas
		shuffle(cartas); //chamando a funcao shuffle e embaralhando as cartas logo no comeco do jogo
		$( ".deck" ).append(cartas); //o elemento deck recebendo a lista com as cartas embaralhadas
	}

	/*na funcao contagem, eu estou verificando se a variavel cliques tem o valor 2,
	 *se sim, eu adiciono 1 a variavel movimentos e zero a variavel clique
	 *desse forma, os movimentos so vão ser contabilizados quando a segunda carta é clicada
	 *ela é chamada dentro da funcao virarCarta pois assim não haverá contagem se for clicado mais de uma vez na mesma carta
	 */
	function contagem(){
		if(cartasViradas.length === 2){
			movimentos++;
			$('.moves').html(movimentos);
			estrelas();
		}
	}

	//funcao para retirada de estrelas baseado na quantidade de movimentos
	function estrelas(){
		if(movimentos === 15){
			var first = stars[0];
			first.remove();
			starCount--; //estrela diminui baseado na quantidade de movimentos

		}else if(movimentos === 20){
			var second = stars[1];
			second.remove();
			starCount--;
		}
	}

	//funcao que adiciona a classe de rotacao da carta
	function virarCarta(lista){
		if(cartasViradas.length < 2){ //verificando se o array possui menos de 1 elemento

			/*if em que verifica se os elementos da lista possuem mais de uma classe
			 *se possuir, ele não terá ação, dessa forma, não poderei clicar na carta duas vezes
			 */
			if(lista.classList.length > 1){
				return;
			}


			//se não possuir mais duas classes, adiciona classes open e show
			$(lista).toggleClass("open show");

			cartasViradas.push(lista); //adicionando o elemnto ao array

			/*se a array cartasViradas possuir dois elementos, chamara a funcao comparar cartas
			 *que somente executará depois de um segundo
			 */
			if(cartasViradas.length === 2){
				setTimeout(compararCarta, 1000);
				contagem();
			}
		}
	}

	// funcao para comparar as cartas
	function compararCarta(){
		if(cartasViradas.length === 2){
			//atribuindo os valores da array cartasViradas a array simbolo
			simbolo[0] = cartasViradas[0].childNodes[1]; //childeNodes possui a classe do elemento i
			simbolo[1] = cartasViradas[1].childNodes[1];

			//verificando se os elementos possuem as mesmas classes e atribuindo a classe match se forem iguais
			if(simbolo[0].className === simbolo[1].className){
				$(cartasViradas[0]).toggleClass("match");
				$(cartasViradas[1]).toggleClass("match");

				pontos++; //incrementando os pontos em caso de match
				if(pontos === 8){ //verificacao da quantidade de pontos para checagem de jogo ganho
					pararTempo();
					gameOver();
				}

			}else{
				$(cartasViradas[0]).toggleClass("open show"); //retira as classes
				$(cartasViradas[1]).toggleClass("open show");

				simbolo = []; //esvazia o array
			}

			cartasViradas = []; //esvazia o array
		}

	}

	function tempo(){
		if(paused === false){
			seg++;
		  if(seg === 60){
		  	min++;
		  	minuto.html(min);
		  	seg = 0;
		  }else{
		  	segundo.html(seg);
		  }
		}
	}

	function pararTempo(){
		clearInterval(reset);
	}

	//funcao que chama a tela modal quando o jogo é ganho
	function gameOver(){
		modal.css('z-index','1'); //trazendo o modal para frente
		modal.css('background-color','rgba(255, 255, 255,0.8)'); //melhor transparencia
		$('#score').html('With ' + movimentos + ' moves and ' + starCount + ' Stars!'); //texto na tela modal
		if(min > 0){
			$('#timer').html("The game took " + min + " minutes and " + seg + " seconds");
		}else{
			$('#timer').html("The game took " + seg + " seconds");
		}


		$("#botao").on("click", function(){
			start();
			modal.css('z-index','-2'); //ao clicar no botao, o modal é levado para tras
			modal.css('background-color','rgba(255, 255, 255,0)');
			cartas.removeClass('open show match');
			start();
			/*foi preciso chamar a funcao start no comeco pois,
			 *assim seria recebido os elementos com as classes open show match fazendo assim possivel retira-las
			 *e no final a funcao foi chamada com a variavel cartas sem essas classes
			 */
		});
	}

	/*
	 * Display the cards on the page
	 *   - shuffle the list of cards using the provided "shuffle" method below
	 *   - loop through each card and create its HTML
	 *   - add each card's HTML to the page
	 */

	// Shuffle function from http://stackoverflow.com/a/2450976
	function shuffle(array) {
	    var currentIndex = array.length, temporaryValue, randomIndex;

	    while (currentIndex !== 0) {
	        randomIndex = Math.floor(Math.random() * currentIndex);
	        currentIndex -= 1;
	        temporaryValue = array[currentIndex];
	        array[currentIndex] = array[randomIndex];
	        array[randomIndex] = temporaryValue;
	    }

	    return array;
	}


	/*
	 * set up the event listener for a card. If a card is clicked:
	 *  - display the card's symbol (put this functionality in another function that you call from this one)
	 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) OK
	 *  - if the list already has another card, check to see if the two cards match
	 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
	 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
	 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
	 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
	 */

}