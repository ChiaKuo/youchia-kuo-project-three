const cardGameApp = {};

// Generates arrays for the deck, player's hand, and dealer's hand
const suitRef = ['♥', '♦', '♠', '♣'];
const valueRef = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const deck = [];
let playerHand = [];
let dealerHand = [];
let dealerHandDisplay = [];
let playerHandValue = 0;
let dealerHandValue = 0;
let dealerHandValueDisplay = 0;
let playerWins = 0;
let dealerWins = 0;

// Function to generate the cards in the deck. Clears the previous deck each time
cardGameApp.generateDeck = function () {
    deck.splice(0, deck.length)
    for (let s = 0; s < suitRef.length; s = s + 1) {
        for (let v = 0; v < valueRef.length; v = v + 1) {
            const tempDeck = {
                suit: suitRef[s],
                value: valueRef[v],
            }
            deck.push(tempDeck)
        }
    }
}

// shuffling snippet from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
cardGameApp.shuffleDeck = function () {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
}


// Function to deal cards to the player and dealer
cardGameApp.dealCards = function () {

    // Clears the hands from the previous game

    playerHand.splice(0, playerHand.length)
    dealerHand.splice(0, dealerHand.length)
    
    // Deals cards to the player and dealer
    for (let p = 0; p < 2; p++) {
        const playerRandom = Math.floor(Math.random() * (deck.length - 1));
        playerHand.push(deck[playerRandom]);
        deck.splice(playerRandom, 1);     
    }

    for (let d = 0; d < 2; d++) {
        const dealerRandom = Math.floor(Math.random() * (deck.length - 1));
        dealerHand.push(deck[dealerRandom]);
        deck.splice(dealerRandom, 1);
    }
    
    // Displays the cards on the page
    playerHand.forEach((card) => {
        const statement = $('<h2>').text(`${card.value}${card.suit}`)
        $('.playerHand').append(statement)
        if (card.suit == '♦' || card.suit == '♥' ) {
            $('.playerHand h2').last().css("color", "red");
        }
    })
    dealerHand.forEach((card) => {
        const statement = $('<h2>').text(`${card.value}${card.suit}`)
        $('.dealerHand').append(statement)
        if (card.suit == '♦' || card.suit == '♥' ) {
            $('.dealerHand h2').last().css("color", "red");
        }
    })
}

// Function to hide the dealer's first card, assigns value of the remaining card
cardGameApp.dealerHide = function () {
    dealerHandValueDisplay = 0;
    if (dealerHand[1].value === "A") {
        dealerHandValueDisplay += 1
    } else if (dealerHand[1].value === "J" || dealerHand[1].value === "Q" ||dealerHand[1].value === "K") {
        dealerHandValueDisplay += 10
    } else {
        dealerHandValueDisplay += parseInt(dealerHand[1].value);
    }
    if (dealerHand[1].value.indexOf("A") != -1 && (dealerHandValue + 10) < 22) {
        dealerHandValueDisplay += 10;
    }
    $('.dealerScore').html('<h2>' + dealerHandValueDisplay + '</h2>')
    $('.dealerHand h2').first().css("background-color", "red");
    $('.dealerHand h2').first().css("color", "red");
}

// Function to reshow the dealer's first card
cardGameApp.dealerDisplay = function () {
    if (dealerHand[0].suit == '♠' || dealerHand[0].suit == '♣' ) {
        $('.dealerHand h2').first().css("background-color", "white");
        $('.dealerHand h2').first().css("color", "black");
    } else {
        $('.dealerHand h2').first().css("background-color", "white");
        $('.dealerHand h2').first().css("color", "red");
    }
}

// Function to check for aces
cardGameApp.check = function(hand,handValue) {

    // Calculates hand value
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].value === "A") {
            handValue += 1
        } else if (hand[i].value === "J" || hand[i].value === "Q" ||hand[i].value === "K") {
            handValue += 10
        } else {
            handValue += parseInt(hand[i].value);
        }
    }

    // Calculates ace value
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].value.indexOf("A") != -1 && (handValue + 10) < 22) {
            handValue += 10;
        }
    }
    // Returns the hand value
    return handValue;
}


// Function to hit the deck
cardGameApp.hit = function(hand, user) {
    const statement = $('<h2>').text(`${deck[0].value}${deck[0].suit}`)
    // Draws a card and adds it to the hand array
    hand.push(deck[0])
    // Removes the card from the deck array
    deck.splice(0,1)
    $('.'+ user + 'Hand').append(statement)
}

// Game Start Function
cardGameApp.startGame = function() {
    $(".hit").prop('disabled', false);
    $(".stay").prop('disabled', false);
    $(".deal").prop('disabled', true);
}

// Game End Function
cardGameApp.endGame = function() {
    $(".deal").prop('disabled', false);
    $(".hit").prop('disabled', true);
    $(".stay").prop('disabled', true);
}

cardGameApp.init = function() {

    // Deal button listener
    $(".deal").on("click", function(){
        $(".playerHand, .dealerHand").css("border", "5px solid white");
        $('div.playerHand, div.dealerHand').children('h2').remove();
        $('div.gameMessage').children('h1').remove();
        cardGameApp.startGame();
        cardGameApp.generateDeck();
        cardGameApp.shuffleDeck();
        cardGameApp.dealCards();
        cardGameApp.dealerHide();
        if(cardGameApp.check(playerHand, playerHandValue) === 21) {
            $(".gameMessage").html("<h1>BlackJack! You Win!</h1>");
            cardGameApp.dealerDisplay();
            cardGameApp.endGame();
            $('.playerWins').html('<h2>Player: ' + (playerWins+1) + '</h2>')
            playerWins++;
            $(".dealerScore").html("<h2>" + cardGameApp.check(dealerHand, dealerHandValue) + "</h2>")
        };
        $('.playerScore').html('<h2>' + cardGameApp.check(playerHand, playerHandValue) + '</h2>')
    });

    // Hit button listener
    $(".hit").on("click", function() {
        cardGameApp.hit(playerHand, 'player')
        cardGameApp.check(playerHand, playerHandValue)
        if(cardGameApp.check(playerHand, playerHandValue) === 21) {
            $(".gameMessage").html("<h1>You Hit 21!</h1>")
            $(".hit").prop('disabled', true);
        } else if (cardGameApp.check(playerHand, playerHandValue) > 21) {
            $(".gameMessage").html("<h1>You Busted! Try Again!</h1>")
            cardGameApp.endGame();
            cardGameApp.dealerDisplay();
            $('.dealerWins').html('<h2>Dealer: ' + (dealerWins+1) + '</h2>')
            dealerWins++;
            $(".dealerScore").html("<h2>" + cardGameApp.check(dealerHand, dealerHandValue) + "</h2>")
        }
        $(".playerScore").html("<h2>" + cardGameApp.check(playerHand, playerHandValue) + "</h2>")
    })

    // Stay button listener
    $(".stay").on("click",function() {
        cardGameApp.dealerDisplay();
        cardGameApp.endGame();
        let playerScore = cardGameApp.check(playerHand, playerHandValue)
        while (cardGameApp.check(dealerHand, dealerHandValue) < 17) {
            if (cardGameApp.check(dealerHand, dealerHandValue) >= playerScore) {
                break;
            }
            cardGameApp.hit(dealerHand, "dealer")
        }
        let dealerScore = cardGameApp.check(dealerHand, dealerHandValue)
        if (playerScore > dealerScore) {
            $(".gameMessage").html("<h1>" + playerScore + " beats " + dealerScore + ", you win!</h1>")
            $('.playerWins').html('<h2>Player: ' + (playerWins+1) + '</h2>')
            playerWins++;
        } else if (dealerScore > 21) {
            $(".gameMessage").html("<h1>Dealer busted, you win!</h1>")
            $('.playerWins').html('<h2>Player: ' + (playerWins+1) + '</h2>')
            playerWins++;
        } else if (playerScore < dealerScore) {
            $(".gameMessage").html("<h1>" + dealerScore + " beats " + playerScore + ", you lose!</h1>")
            $('.dealerWins').html('<h2>Dealer: ' + (dealerWins+1) + '</h2>')
            dealerWins++;
        } else if (playerScore === dealerScore) {
            $(".gameMessage").html("<h1>Dealer wins in ties!</h1>")
            $('.dealerWins').html('<h2>Dealer: ' + (dealerWins+1) + '</h2>')
            dealerWins++;
        }
        $(".dealerScore").html("<h2>" + cardGameApp.check(dealerHand, dealerHandValue) + "</h2>")
    })
}
// Initialize button listener
$(function() {
    cardGameApp.init();
})
