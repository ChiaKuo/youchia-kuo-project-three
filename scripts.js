// Function for Get Started Button


// Generates arrays for the deck, player's hand, and dealer's hand
    const suitRef = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    const valueRef = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
    const deck = [];
    const playerHand = [];
    const dealerHand = [];
    
// Function to generate the cards in the deck. Clears the previous deck each time
    function generateDeck() {
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
    function shuffleDeck() {
        for(let i = deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = deck[i]
            deck[i] = deck[j]
            deck[j] = temp
          }
    }

    // Function to deal cards to the player and dealer
    function dealCards() {
        // Clears the hands from the previous game
        deck.splice(0, playerHand.length)
        deck.splice(0, dealerHand.length)
        for (let p = 0; p < 2; p++) {
            const playerRandom = Math.floor(Math.random() * (deck.length - 1));
            playerHand.push(deck[playerRandom]);
            deck.splice(playerRandom, 1);
            // console.log(`Dealt a ${playerHand[p].value} of ${playerHand[p].suit} to the player`);
            // console.log(`${deck.length} cards remaining in the deck!`)
            
        }
        for (let d = 0; d < 2; d++) {
            const dealerRandom = Math.floor(Math.random() * (deck.length - 1));
            dealerHand.push(deck[dealerRandom]);
            deck.splice(dealerRandom, 1);
            // console.log(`Dealt a ${dealerHand[d].value} of ${dealerHand[d].suit} to the dealer`);
            // console.log(`${deck.length} cards remaining in the deck!`)
        }
        $('.playerOne').html(`<h2>${playerHand[0].value} of ${playerHand[0].suit}</h2>`)
        $('.playerTwo').html(`<h2>${playerHand[1].value} of ${playerHand[1].suit}</h2>`)
        $('.dealerOne').html(`<h2>${dealerHand[0].value} of ${dealerHand[0].suit}</h2>`)
        $('.dealerTwo').html(`<h2>${dealerHand[1].value} of ${dealerHand[1].suit}</h2>`)
    }

    // Callback function for the game mechanics
    
    // Function to check for aces
    function check(hand) {
        let handValue = 0;
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].value === "Ace") {
                handValue += 1
            } else if (hand[i].value === "Jack" || hand[i].value === "Queen" ||         hand[i].value === "King") {
                handValue += 10
            } else {
                handValue += parseInt(hand[i].value);
            }
        }
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].value.indexOf("Ace") != -1 && (handValue + 10) < 22) {
                handValue += 10;
            }
        }
        
        return handValue;
        
    }

    // While loop for the game

    // Function to hit the deck
    function hit(hand) {
        hand.push(deck[0])
        deck.splice(0,1)
        console.log(`Dealt a ${hand[hand.length-1].value} of ${hand[hand.length-1].suit} to the player`);
    }

    generateDeck();
    shuffleDeck();
    dealCards();
    console.log(`Player has ${check(playerHand)}`);
    console.log(`Dealer has ${check(dealerHand)}`);
    hit(playerHand);
    console.log(playerHand);
    console.log(`Player has ${check(playerHand)}`);


    // }
    // blackjackPlay()

    // Function to stay
    function stay() {

    }

    // Function for dealer AI
    function dealer() {

    }

    // Function for win or loss
    function checkScore() {
        
    }

