const cardGameApp = {};

// Generates arrays for the deck, player's hand, and dealer's hand
const suitRef = ['♥', '♦', '♠', '♣'];
const valueRef = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
const deck = [];
let playerHand = [];
let dealerHand = [];
let playerHandValue = 0;
let dealerHandValue = 0;
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
        const statement = $('<h2>').text(`[${card.value} ${card.suit}]`)
        $('.playerHand').append(statement)
    })
    dealerHand.forEach((card) => {
        const statement = $('<h2>').text(`[${card.value} ${card.suit}]`)
        $('.dealerHand').append(statement)
    })
}

// Function to check for aces
cardGameApp.check = function(hand,handValue) {
    // Turn these into forEach. refer to museum codealong for a guide.

    // Calculates hand value
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].value === "Ace") {
            handValue += 1
        } else if (hand[i].value === "Jack" || hand[i].value === "Queen" ||hand[i].value === "King") {
            handValue += 10
        } else {
            handValue += parseInt(hand[i].value);
        }
    }

    // Calculates ace value
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].value.indexOf("Ace") != -1 && (handValue + 10) < 22) {
            handValue += 10;
        }
    }
    // Returns the hand value
    return handValue;
}


// Function to hit the deck
cardGameApp.hit = function(hand, user) {
    const statement = $('<h2>').text(`[${deck[0].value} ${deck[0].suit}]`)
    // Draws a card and adds it to the hand array
    hand.push(deck[0])
    // Removes the card from the deck array
    deck.splice(0,1)
    $('.'+ user + 'Hand').append(statement)
}


// Game Restarts Function
cardGameApp.endGame = function() {
    $(".deal").prop('disabled', false);
    $(".hit").prop('disabled', true);
    $(".stay").prop('disabled', true);
}

// Score update Function


cardGameApp.init = function() {

    // Deal button listener
    $(".deal").on("click", function(){
        $(".hit").prop('disabled', false);
        $(".stay").prop('disabled', false);
        $(this).prop('disabled', true);
        $('div.playerHand').children('h2').remove();
        $('div.dealerHand').children('h2').remove();
        $('div.gameMessage').children('h1').remove();
        cardGameApp.generateDeck();
        cardGameApp.shuffleDeck();
        cardGameApp.dealCards();
        if(cardGameApp.check(playerHand, playerHandValue) === 21) {
            $(".gameMessage").html("<h1>BlackJack! You Win!</h1>");
            cardGameApp.endGame();
            $('.playerWins').html('<h2>Player: ' + (playerWins+1) + '</h2>')
            playerWins++;
        };
        $('.playerScore').html('<h2>' + cardGameApp.check(playerHand, playerHandValue) + '</h2>')
        $('.dealerScore').html('<h2>' + cardGameApp.check(dealerHand, dealerHandValue) + '</h2>')
    });

    
    $(".hit").on("click", function() {
        cardGameApp.hit(playerHand, 'player')
        cardGameApp.check(playerHand, playerHandValue)
        if(cardGameApp.check(playerHand, playerHandValue) === 21) {
            $(".gameMessage").html("<h1>You Hit 21!</h1>")
            $(".hit").prop('disabled', true);
        } else if (cardGameApp.check(playerHand, playerHandValue) > 21) {
            $(".gameMessage").html("<h1>You Busted! Try Again!</h1>")
            cardGameApp.endGame();
            $('.dealerWins').html('<h2>Dealer: ' + (dealerWins+1) + '</h2>')
            dealerWins++;
        }
        $(".playerScore").html("<h2>" + cardGameApp.check(playerHand, playerHandValue) + "</h2>")
    })


    $(".stay").on("click",function() {
        cardGameApp.endGame();
        let playerScore = cardGameApp.check(playerHand, playerHandValue)
        while (cardGameApp.check(dealerHand, dealerHandValue) < 17) {
            if (cardGameApp.check(dealerHand, dealerHandValue) >= playerScore) {
                break;
            }
            cardGameApp.hit(dealerHand, "dealer")
            $(".dealerScore").html("<h2>" + cardGameApp.check(dealerHand, dealerHandValue) + "</h2>")
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
    })
}
$(function() {
    cardGameApp.init();
})
