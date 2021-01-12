
//DECK JS
 const SUITS = ["♠","♥","♣","♦"]
 const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
 const GAMESTATES = ["WELCOME", "INSTRUCTIONS", "PLAY", "PAYOUT"]
 const PlayState = ["DEAL", "MOVE"]

 class Game {
    constructor() {
        this.deck = new Deck();
        this.player = new Player();
        this.dealer = new Dealer();
        this.state = WELCOME;
    }


    

    checkState(GAMESTATES)
     {
         switch(GAMESTATES)
         {
             case "WELCOME":
                // code for the welcome page 
                break;

            case "INSTRUCTION":
                // code for instruction page
                break;

            case "PLAY":
                // Play has sub sets: deal, move
                placeBet();
                playGame();
                break;

            case "PAYOUT":
                // gives player money
                payout();
                break;
        }
    }
}
        

class User {
    constructor() {
        this.hand = [];
        this.handValue = 0;
        this.drawInitialHand();
    }
    
     draw() {
        let drawnCardArray = deck.drawCard();
        this.hand.push(drawnCardArray[0]);
        this.calcHandValue();
    }

    calcHandValue() {
        let tempHandValue = 0;

        for (let card of this.hand) {
            tempHandValue += card.intValue;
        }

        this.handValue = tempHandValue;
    }
    
    checkBust() {
        if (this.handValue > 21)
            return true;
        else
            return false;
    }

    drawInitialHand() {
        this.draw();
        this.draw();
    }
}

class Player extends User  {
    // constructor() {
    //     this.bankroll = 1000;
    //     this.name = "";
    // }
    
    hit() {
        this.draw();
        if (this.checkBust() === true){
            console.log("You are bust with " + this.handValue)
            //change some state
        }
        else {
            console.log("You are not bust with " + this.handValue)
        }
    }

    split() {
        let handSizeEqualTwo = (this.hand.length === 2);
        let bothCardsHaveEqualValue = this.hand[0].value === this.hand[1].value;
        
        if(handSizeEqualTwo && bothCardsHaveEqualValue) {
            //logic for split
            console.log("This will be split");
        }
        else
        console.log("This will not be split");
    }


    doubleDown(){
        //dd logic
        console.log("Hey I work");
    }

    set name(givenName) {
        this.name = givenName;
    }
}

class Dealer extends User {
    dealerPlays() {
        console.log("The dealer has: " + this.handValue);
        while(this.handValue < 17){
            console.log("The dealer draws a card")
            this.draw();
            console.log("The dealer has: " + this.handValue);
        }
    }
}

 
class Deck{
     constructor() {
         this.cards = this.createDeck();
     }

     createDeck() {
        let cards = [];
         for (let suit of SUITS) {
             for (let value of VALUES) {
                 let cardToAdd = new Card(suit, value);
                 cards.push(cardToAdd);
             }
         }
         return cards;
     }

     drawCard() {
        const cardsDrawn = this.cards.slice(-1);
        this.cards = this.cards.slice(0, -1);
        return cardsDrawn;
     }

     deckSize() {
         return this.cards.length;
     }

     shuffleDeck() {
         for(let i = this.deckSize() - 1; i > 0; i--){
             const newLocation = Math.floor(Math.random() * (i + 1)); //Random location before the card we are on
             const oldCard = this.cards[newLocation]; // Switched the card we are currently on with new card at the random location
             this.cards[newLocation] = this.cards[i];
             this.cards[i] = oldCard;
         }
     }

     displayDeck() {
         for (let c of this.cards) {
            console.log(c.value + c.suit);
         }
     }
 }

 class Card{
    constructor(suit, value){
         this.suit = suit;
         this.value = value;
         this.intValue = this.numericValue();
     }
    get colour(){
         return this.suit === "♠" || this.suit === "♣" ? 'black': 'red'
    }
    numericValue() {
        if (['J', 'Q', 'K'].includes(this.value)){
            return 10;
        }
        else if (this.value === ('A')){
            return 11;
        }
        else {
            return parseInt(this.value);
        }
    }
 }
 
 


 //SCRIPT JS
//  import Deck from "./deck.js"
const computerCardSlot = document.querySelector('.computer-card-slot')

//const gameOfBlackjack = new Game();
const testDeck = new Deck();


function checkStatus(){
}

function checkBlackJack(){

    let twoCards = (gameOfBlackjack.player.hand.length === 2);
    let blackJackHand = (gameOfBlackjack.player.hand.handValue === 21)

    if(twoCards && blackJackHand){
        console.log("Player has a blackjack");
        GAMESTATES = "PAYOUT";
    }
    // else if(twoCards === true && Dealer.handValue === 21){
        
    // }
    // else{
    //     //Check Player wants to hit / stand / split
    //     calculateResults();
    // }
}

function calculateResults(){

    if(User.handValue > Dealer.handValue){
        // Winner Winner Chicken Dinner
    }
    else if(Dealer.handValue > User.handValue){
        // House wins
    }
    else{
         // Push
    }

}

function placeBet(){

    var betSize = prompt("Please enter your bet", "<bet goes here>");

    if(betSize < User.totalFunds){

        totalFunds = totalFunds - betSize;
    }
    else
    {
        alert("Sorry, you do not have enough funds to make that wager.")
        // YOU NOT GOT ENOUGH MONEY
    }
    
}

function playGame(){
    
    shuffleDeck();
    drawCards();
}

function Payout(){

    payout = betSize + betSize;

    totalFunds = totalFunds + payout;
}

function playAgain(){
    if(confirm('Do you want to play again?')){
        
        GAMESTATES = "PLAY"
    }
    else{
        close();
    }
}
