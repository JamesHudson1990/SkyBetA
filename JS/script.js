
//DECK JS
 const SUITS = ["♠","♥","♣","♦"]
 const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
 const GAMESTATES = ["WELCOME", "INSTRUCTIONS", "PLAY", "PAYOUT"]
 const PlayState = ["DEAL", "MOVE"]
 const PLAYERMOVES = ["HIT", "STAND", "SPLIT", "DOUBLEDOWN"]

 class Game {
    constructor() {
        this.deck = new Deck();
        this.player = new Player();
        this.dealer = new Dealer();
        this.state = GAMESTATES.WELCOME;
        this.betAmount = 0;
        this.splitBetAmount = 0;
        this.insuranceTaken = false;
        this.doubledDown = false;
        this.insuranceBetAmount = 0;
    }

    drawCard(userToDraw, handToDrawTo) {
        let drawnCardArray = this.deck.drawCard();

        handToDrawTo.push(drawnCardArray[0]);
        userToDraw.updateHandValue();
    }

    placeBet() {
        this.displayBankroll();
        var betSize = prompt("Please enter your bet", "<bet goes here>");

        if(Number.isInteger(parseInt(betSize)) && betSize < this.player.bankroll){
            this.betAmount = betSize;
            this.player.bankroll -= betSize;
        }
        else
        {
            alert("Sorry, you do not have enough funds to make that wager.")
            // YOU NOT GOT ENOUGH MONEY
        }

        console.log("You have bet: $" + betSize);
    }

    givePlayerBlackJack() {
        let aceOfSpades = new Card("♠","A"); 
        let tenOfSpades = new Card("♠","10");
        this.player.hand.push(aceOfSpades);
        this.player.hand.push(tenOfSpades);
        this.player.updateHandValue();
    }

    giveDealerBlackJack() {
        let aceOfSpades = new Card("♠","A"); 
        let tenOfSpades = new Card("♠","10");
        this.dealer.hand.push(aceOfSpades);
        this.dealer.hand.push(tenOfSpades);
        this.dealer.updateHandValue();
    }

    givePlayerTwoAces() {
        let aceOfSpades = new Card("♠","A"); 
        let aceOfDiamonds = new Card("♦","A"); 
        this.player.hand.push(aceOfSpades);
        this.player.hand.push(aceOfDiamonds);
        this.player.updateHandValue();
    }

    initialDeal() {
        //this.drawCard(this.player);
        // this.drawCard(this.dealer);
        //this.drawCard(this.player);
        //this.drawCard(this.dealer);
        this.givePlayerTwoAces();
        this.giveDealerBlackJack();
    }

    clearHands() {
        this.player.clearHand();
        this.dealer.clearHand()
    }

    playGame() {
        this.clearHands();
        this.placeBet();
        this.deck.shuffle();
        this.initialDeal();
        
        this.displayDealersFirstCard();
        this.displayHand();
        

            if (!this.checkForBlackjack(this.player)) {
                this.playerPlays();
                this.dealerPlays();
            }
            else if(this.checkForBlackjack(this.player) && this.dealerHasFaceUpAce())
                this.dealerPlays();

            this.checkResults();

    }
    
    dealerHasFaceUpAce() {
        if (this.dealer.hand[0].value === 'A'){
            ///this.takeInsurance();
            return true;
        }
        else
            return false;
    }
            
    payoutWinnings(bonusMultiplier) {
        let winnings = this.betAmount * bonusMultiplier;
        console.log("You have won $" + winnings)
        this.player.bankroll += winnings;
        this.displayBankroll();
    }

    payoutInsurance() {
        let winnings = this.insuranceBetAmount * 2;
        console.log("Your insurance paid out $" + winnings);
        this.player.bankroll += winnings;
        this.displayBankroll();
    }

    displayBankroll() {
        console.log("You have $" + this.player.bankroll);
    }

    checkResults() {
        if (this.checkForBlackjack(this.player)) {
            console.log("You have blackjack, you win!");
            this.payoutWinnings(2.5);
        }
        else if (this.player.checkBust()) {
            console.log("You went bust, the House wins");
            this.displayBankroll();
        }
        else if (this.checkForBlackjack(this.dealer)) {
            console.log("The house has blackjack, the House wins");
            this.displayBankroll();
        }
        else if(this.player.getHandValue() === this.dealer.getHandValue()) {
            console.log("Push -- you get your bet back");
            this.payoutWinnings(1);
        }
        else if(this.player.getHandValue() > this.dealer.getHandValue()) {
            console.log("You win!");
            this.payoutWinnings(2);
        }
        else if(this.dealer.checkBust()) {
                console.log("The Dealer bust! You win!");
                this.payoutWinnings(2);
        }
        else
            console.log("The House wins");

        if(this.insuranceTaken) {
            if(this.checkForBlackjack(this.dealer)) {
                this.payoutInsurance();
            }
            else {
                console.log("Your insurance flopped, you lost $" + (this.betAmount / 2));
            }
        }
    }



    hit() {
        this.drawCard(this.player);
        this.displayHand();

        if (this.player.checkBust()){
            console.log("You are bust with " + this.player.handValue)
            this.player.bust = true;
        }
        else {
            console.log("You have " + this.player.handValue)
        }
    }



    dealerPlays() {
        this.displayDealersHand();
        if (!this.dealer.checkBust())
        {
                console.log("The dealer has: " + this.dealer.handValue);
                while(this.dealer.handValue < 17){
                    console.log("The dealer draws a card")
                    this.drawCard(this.dealer);
                    this.displayDealersHand();
                    console.log("The dealer has: " + this.dealer.handValue);

                    if(this.dealer.handValue > 21)
                        this.dealer.bust = true;
                }
        }
    }

    checkForBlackjack(userToCheck) {
        if((userToCheck.hand.length === 2) && (userToCheck.handValue === 21)){
            return true
        }
        else 
            return false;
    }

    playerPlays() {
        let stillPlaying = true;
        while(!this.player.bust && stillPlaying) {
            let playerOption = prompt("1 = hit, 2 = stand, 3 = split, 4 = double down, 5 = take insurence", "");

            switch(playerOption) {
                case '1':
                    this.hit();
                    break;
                case '2':
                    stillPlaying = false;
                    break;
                case '3': 
                    this.playerSplits();
                    break;
                case '4':
                    this.doubleDown();
                    this.hit()
                    stillPlaying = false;
                    break;
                case '5':
                    this.takeInsurance();
                    break;
            }
        }
    }

    displayHand() {
        console.log("Your hand: ");
        for (let card of this.player.hand) {
            console.log("You have " + card.value + card.suit)
        }
    }

    displayDealersFirstCard() {
        console.log("The Dealer has: " + this.dealer.hand[0].value + this.dealer.hand[0].suit)
    }

    displayDealersHand() {
        console.log("Dealers hand: ");
        for (let card of this.dealer.hand) {
            console.log(card.value + card.suit);
        }
    }

    playerSplits() {
        this.player.splitHand();
        //bet for same amount
        this.splitBetAmount = this.betAmount;
        this.player.bankroll -= this.splitBetAmount;
        this.displayBankroll();

        //add card to each hand
        this.drawCard(this.player, this.player.hand);
        this.drawCard(this.player, this.player.hand2);
    }

    takeInsurance() {
        //add validation that player has enough bankroll
        console.log("Insurance taken");
        this.insuranceTaken = true;
        this.insuranceBetAmount = this.betAmount/2;
        console.log("insurance bet of $" + this.insuranceBetAmount);
        this.player.bankroll -= this.insuranceBetAmount;
    }

    doubleDown(){
        if(this.betAmount < this.player.bankroll)
        {
            this.doubledDown = true;
            console.log("You doubled down");
            this.player.bankroll -= this.betAmount;
            this.betAmount = this.betAmount*2;
        }
        else
        {
            // dont have enough money
            console.log("You do not have the facilities for this big man");
        }
    }

    // checkState(GAMESTATES)
    //  {
    //      switch(this.state)
    //      {
    //          case "WELCOME":
    //             // code for the welcome page 
    //             break;

    //         case "INSTRUCTION":
    //             // code for instruction page
    //             break;

    //         case "PLAY":
    //             // Play has sub sets: deal, move
                
    //             playGame();
    //             break;

    //         case "PAYOUT":
    //             // gives player money
    //             payout();
    //             break;
    //     }
    // }
}
        
class User {
    constructor() {
        this.hand = [];
        this.handValue = 0;
        this.bankroll = 1000;
        this.bust = false;
    }
    
    clearHand() {
        this.hand = [];
    }

    updateHandValue() {
        let tempHandValue = 0;      


        const cardValues = this.hand.map(card => card.intValue);
        cardValues.sort((a, b) => a - b);

        
        for (let cardValue of cardValues) {

            if (cardValue == 11 && ((tempHandValue + cardValue) > 21)){
                tempHandValue += 1;
                //console.log("adding 1 to hand value, total: " + tempHandValue);
            }
            else {
                tempHandValue += cardValue;
                //console.log("adding " + cardValue + " to hand value, total: " + tempHandValue);
            }
        }

        this.handValue = tempHandValue;
    }
    
    getHandValue() {
        this.updateHandValue();
        return this.handValue;
    }

    splitHand() {
        this.hand2 = [];
        this.hand2value = 0;


        const cardToAddToHand2 = this.hand.slice(-1);
        this.hand2.push(cardToAddToHand2[0]);
        this.hand.pop(cardToAddToHand2[0]);
    }

    checkBust() {
        if (this.getHandValue() > 21)
       
             return true;   
           
            
        else
            return false;
    }

    // drawInitialHand() {
    //     this.draw();
    //     this.draw();
    // }
}

class Player extends User  {
    // constructor() {
    //     this.bankroll = 1000;
    //     this.name = "";
    // }
    


    split() {
        let handSizeEqualTwo = (this.hand.length === 2);
        let bothCardsHaveEqualValue = this.hand[0].value === this.hand[1].value;
        
        if(handSizeEqualTwo && bothCardsHaveEqualValue) {
            //logic for split
            //Possibly need to make a tempoary hand2 value and put one in each
            
            console.log("This will be split");
        }
        else
        console.log("This will not be split");
    }




    set name(givenName) {
        this.name = givenName;
    }
}

class Dealer extends User {

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

     shuffle() {
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
         this.aceValueOf11 = true;
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

//game logic
 //SCRIPT JS
//  import Deck from "./deck.js"
const computerCardSlot = document.querySelector('.computer-card-slot')

//const gameOfBlackjack = new Game();
const blackjackGame = new Game();

blackjackGame.playGame();
