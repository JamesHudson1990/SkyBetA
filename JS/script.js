
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

    drawCardFromDeck(handToDrawTo) {
        let drawnCardArray = this.deck.drawCard();
        handToDrawTo.push(drawnCardArray[0]);
    }

    // METHODS FOR TESTING
    // givePlayerBlackJack() {
    //     let aceOfSpades = new Card("♠","A"); 
    //     let tenOfSpades = new Card("♠","10");
    //     this.player.hand.push(aceOfSpades);
    //     this.player.hand.push(tenOfSpades);
    // }

    // giveDealerBlackJack() {
    //     let aceOfSpades = new Card("♠","A"); 
    //     let tenOfSpades = new Card("♠","10");
    //     this.dealer.hand.push(aceOfSpades);
    //     this.dealer.hand.push(tenOfSpades);
    // }

    // givePlayerTwoAces() {
    //     let aceOfSpades = new Card("♠","A"); 
    //     let aceOfDiamonds = new Card("♦","A"); 
    //     this.player.hand.push(aceOfSpades);
    //     this.player.hand.push(aceOfDiamonds);
    // }
    //

    initialDeal() {
        this.drawCardFromDeck(this.player.hand);
        this.drawCardFromDeck(this.dealer.hand);
        this.drawCardFromDeck(this.player.hand);
        this.drawCardFromDeck(this.dealer.hand);
    }

    clearHands() {
        this.player.clearHand();
        this.dealer.clearHand();
    }

    resetDataForRound() {
        this.clearHands();
        this.betAmount = 0;
        this.splitBetAmount = 0;
        this.insuranceTaken = false;
        this.doubledDown = false;
        this.insuranceBetAmount = 0;
        this.deck.resetDeck();
        this.deck.shuffle();
    }

    playGame() {
            //this.resetDataForRound();
            console.log("data reset");
            this.clearHands();
            this.placeBet();
            
            console.log("bet placed");
            this.deck.resetDeck();
            this.deck.shuffle();

            
            console.log("dealing 2 cards to each player");
            this.initialDeal();
            
            console.log("displaying dealers first card");
            this.displayDealersFirstCard();
            this.displayHand(this.player.hand);
            

            if (!this.checkForBlackjack(this.player.hand)) {
                    this.playerPlays(this.player.hand, this.betAmount);
                    this.dealerPlays();
            }
            else if(this.checkForBlackjack(this.player.hand) && this.dealerHasFaceUpAce())
                    this.dealerPlays();

            
            if(this.player.hasSplit) {
                console.log("first hand results");
                this.checkResults(this.player.hand, this.betAmount);
                console.log("second hand results");
                this.checkResults(this.player.hand2, this.splitBetAmount);
            }
            else {
                this.checkResults(this.player.hand, this.betAmount);
            }
    }
    
    
    dealerHasFaceUpAce() {
        if (this.dealer.hand[0].value === 'A'){
            return true;
        }
        else
            return false;
    }
            
    payoutWinnings(amountToPayOut) {
        console.log("You have won $" + amountToPayOut)
        this.player.bankroll += amountToPayOut;
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


    placeBet() {
        
        this.displayBankroll();
        var betSize = prompt("Please enter your bet", "<bet goes here>");
    
        if(Number.isInteger(parseInt(betSize)) && betSize <= this.player.bankroll){
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

    checkResults(handToCheck, betAmountForHand) {

        let playerHasBlackjack = this.checkForBlackjack(handToCheck);
        let playerIsBust = User.checkBust(handToCheck);
        let dealerIsBust = User.checkBust(this.dealer.hand);
        let dealerHasBlackjack = this.checkForBlackjack(this.dealer.hand);
        let dealerAndPlayerHaveSameHandValue = User.getHandValue(handToCheck) === User.getHandValue(this.dealer.hand);
        let playersHandBeatsDealersHand = User.getHandValue(handToCheck) > User.getHandValue(this.dealer.hand);



        if (playerHasBlackjack) {
            console.log("You have blackjack, you win!");
            this.payoutWinnings(2.5*betAmountForHand);
        }
        else if (playerIsBust) {
            console.log("You went bust, the House wins");
            this.displayBankroll();
        }
        else if (dealerHasBlackjack) {
            console.log("The house has blackjack, the House wins");
            this.displayBankroll();
        }
        else if(dealerAndPlayerHaveSameHandValue) {
            console.log("Push -- you get your bet back");
            this.payoutWinnings(betAmountForHand);
        }
        else if(playersHandBeatsDealersHand) {
            console.log("You win!");
            this.payoutWinnings(betAmountForHand*2);
        }
        else if(dealerIsBust) {
                console.log("The Dealer bust! You win!");
                this.payoutWinnings(betAmountForHand*2);
        }
        else
            console.log("The House wins");

        if(this.insuranceTaken) {
            if(dealerHasBlackjack) {
                this.payoutInsurance();
                this.insuranceTaken = false;      
            }
            else {
                console.log("Your insurance flopped, you lost $" + (this.betAmount / 2));
            }
        }
    }



    hit(handToHit) {
        this.drawCardFromDeck(handToHit);
        this.displayHand(handToHit);

        if (User.checkBust(handToHit)){
            console.log("You are bust with " + User.getHandValue(handToHit));
            this.player.bust = true;
        }
        else {
            console.log("You have " + User.getHandValue(handToHit));
        }
    }

    dealerPlays() {
        let dealerHandValue = User.getHandValue(this.dealer.hand);

        this.displayDealersHand();
        if (!User.checkBust(this.dealer.hand))
        {
                console.log("The dealer has: " + dealerHandValue);
                while(dealerHandValue < 17){
                    console.log("The dealer draws a card")
                    this.drawCardFromDeck(this.dealer.hand);
                    dealerHandValue = User.getHandValue(this.dealer.hand);
                    this.displayDealersHand();
                    console.log("The dealer has: " +dealerHandValue);

                    if(dealerHandValue > 21)
                        this.dealer.bust = true;

                }
        }
    }

    checkForBlackjack(handToCheckForBlackjack) {
        if((handToCheckForBlackjack.length === 2) && (User.getHandValue(handToCheckForBlackjack) === 21)){
            return true
        }
        else 
            return false;
    }

    playerPlays(handBeingPlayed, betAmountForHand) {
        let stillPlaying = true;
        while(!this.player.bust && stillPlaying) {
            let playerOption = prompt("1 = hit, 2 = stand, 3 = split, 4 = double down, 5 = take insurence", "");

            switch(playerOption) {
                case '1':
                    this.hit(handBeingPlayed);
                    break;
                case '2':
                    stillPlaying = false;
                    break;
                case '3':
                    if (!this.player.hasSplit) {
                        this.playerSplits();
                        stillPlaying = false;
                    }
                    else
                        console.log("You have already split!")
                    break;
                case '4':
                    this.doubleDown(betAmountForHand);
                    this.hit(handBeingPlayed);
                    stillPlaying = false;
                    break;
                case '5':
                    if (!this.insuranceTaken){
                        this.takeInsurance();
                    }
                    else{
                        console.log("You have already taken out insurance against the dealers hand.")
                    }
                    break;
            }
        }
    }

    displayHand(handToDisplay) {
        for (let card of handToDisplay) {
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
        if(this.betAmount < this.player.bankroll)
        {
        this.player.splitHand();
        //bet for same amount
        this.splitBetAmount = this.betAmount;
        this.player.bankroll -= this.splitBetAmount;
        this.displayBankroll();

        //add card to each hand
        this.drawCardFromDeck(this.player.hand);
        this.drawCardFromDeck(this.player.hand2);


        console.log("first hand")
        this.displayHand(this.player.hand);

        console.log("second hand")
        this.displayHand(this.player.hand2);

        console.log("playing first hand")
        this.playerPlays(this.player.hand, this.betAmount);

        console.log("playing second hand")
        this.playerPlays(this.player.hand2, this.splitBetAmount);
    }
        else
        {
            console.log("You do not have the facilities for this big man");
            this.displayHand(this.player.hand);            
        }
        
    }
    
        

    takeInsurance() {
        //add validation that player has enough bankroll
        console.log("Insurance taken");
        this.insuranceTaken = true;
        this.insuranceBetAmount = this.betAmount/2;
        console.log("insurance bet of $" + this.insuranceBetAmount);
        this.player.bankroll -= this.insuranceBetAmount;
    }

    doubleDown(betToDoubleDown){
        if(betToDoubleDown < this.player.bankroll)
        {
            this.doubledDown = true;
            console.log("You doubled down");
            this.player.bankroll -= betToDoubleDown;
            betToDoubleDown = betToDoubleDown*2;
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
        this.bankroll = 1000;
        this.bust = false;
        this.hasSplit = false;
    }
    
    clearHand() {
        this.hand = [];
    }

    static getHandValue(handToCalculateValueFor) {
        let tempHandValue = 0;      
        let arrayOfCardIntValues = [];
        let numberOfAces = 0;

        // let cardValues = handToCalculateValueFor.map(card => card.intValue);
        // cardValues.sort((a, b) => a - b);

        for (let card of handToCalculateValueFor) {
            if (card.intValue != 11)
                tempHandValue += card.intValue;
            else {
                numberOfAces++;
                //console.log("Counted " + numberOfAces + " aces")
            }
                
        }

        if (numberOfAces > 0){
            if(numberOfAces == 1){
                if((tempHandValue + 11) > 21)
                    tempHandValue += 1;
                else
                    tempHandValue += 11;
            }
            else if (numberOfAces == 2){
                if((tempHandValue + 12) > 21)
                    tempHandValue += 2;
                else
                    tempHandValue += 12;
            }
            else if (numberOfAces == 3){
                if((tempHandValue + 13) > 21)
                    tempHandValue += 3;
                else
                    tempHandValue += 13;
            }
            else if (numberOfAces == 4){
                if((tempHandValue + 14) > 21)
                    tempHandValue += 4;
                else
                    tempHandValue += 14;
            }
        }



        return parseInt(tempHandValue);
    }
    
    // getHandValue(handToCalculateValueFor) {
    //     this.updateHandValue(handToCalculateValueFor);
    //     return this.handValue;
    // }

    splitHand() {
        this.hasSplit = true;
        this.hand2 = [];

        const cardToAddToHand2 = this.hand.slice(-1);
        this.hand2.push(cardToAddToHand2[0]);
        this.hand.pop(cardToAddToHand2[0]);
    }

    static checkBust(handToCheck) {
        if (User.getHandValue(handToCheck) > 21)
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
}

class Dealer extends User {

}

 
class Deck{
     constructor() {
         this.cards = this.resetDeck();
     }

    resetDeck() {
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


console.log(blackjackGame.player.bankroll > 0);



while (blackjackGame.player.bankroll > 0) {
    blackjackGame.playGame();
}


