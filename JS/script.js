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
        this.betPlaced = false;
        this.playerHasHit = false;
        this.playing = true;
        this.hasSplit = false;
        this.hand1played = false;
        this.hand2played = false;

        this.currentlySelectedHand = this.player.hand;
        //check if data is saved for bankroll and update
        if(parseInt(localStorage.bankroll))
        {
            this.player.setBankrollFromLocalStorage();
        }
    }

  

    resetLocalData() {
        localStorage.clear();
        this.player.bankroll = 1000;
        this.updateBankrollDisplay();
    }

    offResultsBox() {
        document.getElementById("resultsBox").style.display = "none";

        this.resetDataForRound();
        this.clearHandAndAwaitUserBet();
    }

    clearHandAndAwaitUserBet() {
        document.getElementById("current-bank-roll").innerHTML = this.player.bankroll;

        this.clearHands();
        this.showBettingControls();
    }

    updateBetAmountButton() {
        document.getElementById("currentBetAmountH3").innerHTML = this.betAmount;
    }

    updateBankrollDisplay() {
        document.getElementById("current-bank-roll").innerHTML = this.player.bankroll;
    }

    playGame() {     
        
        this.updateBankrollDisplay();
        this.deck.resetDeck();
        this.deck.shuffle();
        this.initialDeal();

        this.hideInsuranceButton();
        this.hideSplitButton();
        this.hideDoubleDownButton();

        this.showActionControls();
        this.gameTip();
    }
    
    
    placeBet() {
        this.displayBankroll();
        if(this.betAmount > 0)
        {
            this.player.bankroll -= this.betAmount;
            this.player.updateLocalStorageBankroll();
            console.log("You have bet: $" + this.betAmount);
            this.hideBettingControls();
            this.playGame();
        }
        else
            console.log("You have to add a bet");
    }

    increaseBetByAmount(amountToIncrease) {
        if (this.player.bankroll >= (this.betAmount + amountToIncrease)){
            this.betAmount += amountToIncrease;
            this.updateBetAmountDisplay();
        }
        else{
            console.log("You don't have the funds for this");
        }
    }
    
    updateBetAmountDisplay() {
        document.getElementById("current-bet-amount").innerHTML = this.betAmount;
    }

    showBettingControls() {
        var bettingControls = document.getElementById("bettingControls");

        this.updateBetAmountButton();
        this.updateBetAmountDisplay();

        bettingControls.style.display = "block";
    }

    hideSplitButton() {
        document.getElementById("split-btn").style.display = "none";
    }

    hideDoubleDownButton() {
        document.getElementById("double-btn").style.display = "none";
    }

    showSplitButton() {
        document.getElementById("split-btn").style.display = "inline";
    }

    showDoubleDownButton() {
        document.getElementById("double-btn").style.display = "inline";
    }

    showInsuranceButton() {
        document.getElementById("insurance-btn").style.display = "inline";
    }

    hideInsuranceButton() {
        document.getElementById("insurance-btn").style.display = "none";
    }
    
    showActionControls() {
        var actionControls = document.getElementById("actionControls");
        actionControls.style.display = "block";

        if(this.dealerHasFaceUpAce()) {
            this.showInsuranceButton();
        }
       
        let playerCanSplit = (this.player.hand[0].value == this.player.hand[1].value) && ((this.player.bankroll - this.betAmount) > 0);
        if(playerCanSplit)
        {
            this.showSplitButton();
        }

        
        if(this.betAmount <= this.player.bankroll)
            this.showDoubleDownButton();
    }
    
    hideBettingControls() {
        var bettingControls = document.getElementById("bettingControls");
        bettingControls.style.display = "none";
    }
    
    hideActionControls() {
        var actionControls = document.getElementById("actionControls");
        actionControls.style.display = "none";
    }
    
    add25ToBet(){
       this.increaseBetByAmount(25);
       this.updateBetAmountButton();
    }
    
    add50ToBet(){
        this.increaseBetByAmount(50);
        this.updateBetAmountButton();
     }

    add75ToBet(){
        this.increaseBetByAmount(75);
        this.updateBetAmountButton();
     }

    add100ToBet(){
        this.increaseBetByAmount(100);
        this.updateBetAmountButton();
    }

    drawCardFromDeck(handToDrawTo, handDiv, isHidden) {
        let drawnCardArray = this.deck.drawCard();
        handToDrawTo.push(drawnCardArray[0]);
        
        let cardIsRed = ((drawnCardArray[0].suit === '♥') || (drawnCardArray[0].suit === '♦'));

        let suitAndValue = "" + drawnCardArray[0].suit + drawnCardArray[0].value;

        let HTMLforCard = "";

        if (cardIsRed) {
            if (isHidden)
                HTMLforCard = "<div class=\"card-show card-is-red\" id=\"dealers-hidden-card\"> <span>" + suitAndValue + " </span> </div>";
            else
                HTMLforCard = "<div class=\"card-show card-is-red\">" + suitAndValue + "</div>";
        }
        else {
            if (isHidden)
                HTMLforCard = "<div class=\"card-show\" id=\"dealers-hidden-card\"> <span>" + suitAndValue + "</span> </div>";
            else
                HTMLforCard = "<div class=\"card-show\">" + suitAndValue + "</div>";
        }

        handDiv.innerHTML = handDiv.innerHTML + HTMLforCard;
    }

    initialDeal() {
        this.dealerDrawsCard(false);
        this.playerDrawsCard();
        this.dealerDrawsCard(true);
        this.playerDrawsCard();
    }

    dealerDrawsCard(isHidden) {
            this.drawCardFromDeck(this.dealer.hand, document.getElementById("dealersHand"), isHidden);
    }

    playerDrawsCard() {
        this.drawCardFromDeck(this.player.hand, document.getElementById("playersHand"), false);
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
    
    clearHands() {
        this.player.clearHand();
        this.dealer.clearHand();

        //actually update the gui
        document.getElementById("dealersHand").innerHTML = '';
        document.getElementById("playersHand").innerHTML = '';
    }

    dealerHasFaceUpAce() {
            return this.dealer.hand[0].value === 'A';
    }
            
    payoutWinnings(amountToPayOut) {
        console.log("You have won $" + amountToPayOut)
        this.player.bankroll += amountToPayOut;
        this.player.updateLocalStorageBankroll();
        this.updateBankrollDisplay();
    }

    payoutInsurance() {
        let winnings = this.insuranceBetAmount * 2;
        console.log("Your insurance paid out $" + winnings);
        this.player.bankroll += winnings;
        this.player.updateLocalStorageBankroll();
        this.updateBankrollDisplay();
    }

    displayBankroll() {
        console.log("You have $" + this.player.bankroll);
    }

    checkResults(handToCheck, betAmountForHand) {
        this.hideActionControls();

        let playerHasSplitAndNotPlayedSecondHandYet = this.hasSplit && !this.hand1played;

        if(playerHasSplitAndNotPlayedSecondHandYet)  {
            this.hand1played = true;
            this.shiftFocusToSecondHand();
            this.showActionControls();
            return;
            //break out of the checkresults method and wait for use to do something with 2nd hand
        }

        let playerHasSplitAndPlayedBothHands = this.hasSplit && this.hand1played;

        if(playerHasSplitAndNotPlayedSecondHandYet)  {
            this.hand2played = true;
        }

        if (this.hasSplit && this.hand1played && this.hand2played) {
            //player has split and played both their hands
            //reset the boolean flags and then checkresults for both hands
            this.hasSplit = false;
            this.hand1played = false;
            this.hand2played = false;

            this.checkResults(this.player.hand1, this.betAmount);
            this.checkResults(this.player.hand2, this.betAmount);
        }


        let resultsString = "";
        
        let playerHasBlackjack = this.checkForBlackjack(handToCheck);

        if(!playerHasBlackjack)
            this.dealerPlays();

        let playerIsBust = User.checkBust(handToCheck);
        let dealerIsBust = User.checkBust(this.dealer.hand);
        let dealerHasBlackjack = this.checkForBlackjack(this.dealer.hand);
        let dealerAndPlayerHaveSameHandValue = User.getHandValue(handToCheck) === User.getHandValue(this.dealer.hand);
        let playersHandBeatsDealersHand = User.getHandValue(handToCheck) > User.getHandValue(this.dealer.hand);

        if (playerHasBlackjack) {
            resultsString += "You have blackjack, you win! ";
            this.payoutWinnings(2.5*betAmountForHand);
        }
        else if (playerIsBust) {
            resultsString += "You went bust, the House wins. ";
            this.displayBankroll();
        }
        else if (dealerHasBlackjack) {
            resultsString += "The house has blackjack. ";
            this.displayBankroll();
        }
        else if(dealerAndPlayerHaveSameHandValue) {
            resultsString += "Push, your initial wager is returned. ";
            this.payoutWinnings(betAmountForHand);
        }
        else if(playersHandBeatsDealersHand) {
            resultsString += "You win! ";
            this.payoutWinnings(betAmountForHand*2);
        }
        else if(dealerIsBust) {
            resultsString += "The House bust! You win! ";
                this.payoutWinnings(betAmountForHand*2);
        }
        else
            resultsString += "The House wins. ";

        if(this.insuranceTaken) {
            if(dealerHasBlackjack) {
                resultsString += "Your insurance paid out. "
                this.payoutInsurance(); 
            }
            else {
                resultsString += "Your insurance flopped. ";
            }
        }
        this.hideInsuranceTakenIndicator();

        this.showEndOfHandAnimation(resultsString);
    }

    showEndOfHandAnimation(resultsString) {
        const resultsBox = document.getElementById("resultsBox");
        const resultsText = document.getElementById("results-text");
        resultsBox.style.display = 'block';
        resultsText.innerHTML = resultsString;
    }

    hideEndOfHandAnimation() {
        const resultsBox = document.getElementById("resultsBox");
        resultsBox.style.display = 'none';
    }

    hit() {
        this.hideDoubleDownButton();

        //need to refactor so we can call hit on hand1 or hand2
        this.playerDrawsCard();
        if (User.checkBust(this.currentlySelectedHand)){
            this.checkResults(this.currentlySelectedHand, this.betAmount);
        }
    }

    stand() {
        //need to refactor so we can call hit on hand1 or hand2
        this.checkResults(this.currentlySelectedHand, this.betAmount);
    }

    shiftFocusToSecondHand() {
            const hand1Div = document.getElementById("playersHand");
            const hand2Div = document.getElementById("playersHand2");

            hand1Div.className = "";
            hand2Div.className = "active-hand";

            this.currentlySelectedHand = this.player.hand2;
    }

    doubleDown() {
            this.doubledDown = true;

            this.player.bankroll -= this.betAmount;
            this.player.updateLocalStorageBankroll();
            this.betAmount = this.betAmount*2;

            this.updateBankrollDisplay();
            this.updateBetAmountDisplay();

            this.playerDrawsCard();
            this.stand();
        
       
    }

    dealerPlays() {
        let dealerHandValue = User.getHandValue(this.dealer.hand);

        const dealersHiddenCard = document.getElementById("dealers-hidden-card");
        dealersHiddenCard.id = "";

        if (!User.checkBust(this.dealer.hand))
        {
                while(dealerHandValue < 17){
                    this.dealerDrawsCard();
                    dealerHandValue = User.getHandValue(this.dealer.hand);
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

    // playerPlays(handBeingPlayed, betAmountForHand) {

    //     let stillPlaying = true;
    //     while(!this.player.bust && stillPlaying) {
    //         switch(playerOption) {
    //             case '1':
    //                 this.hit(handBeingPlayed);
    //                 break;
    //             case '2':
    //                 stillPlaying = false;
    //                 break;
    //             case '3':
    //                 if (!this.player.hasSplit) {
    //                     this.playerSplits();
    //                     stillPlaying = false;
    //                 }
    //                 else
    //                     console.log("You have already split!")
    //                 break;
    //             case '4':
    //                 this.doubleDown(betAmountForHand);
    //                 this.hit(handBeingPlayed);
    //                 stillPlaying = false;
    //                 break;
    //             case '5':
    //                 if (!this.insuranceTaken){
    //                     this.takeInsurance();
    //                 }
    //                 else{
    //                     console.log("You have already taken out insurance against the dealers hand.")
    //                 }
    //                 break;
    //         }
    //     }
    // }


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
        this.player.splitHand();
        this.hasSplit = true;
        //bet for same amount
        this.splitBetAmount = this.betAmount;
        this.player.bankroll -= this.splitBetAmount;
        this.player.updateLocalStorageBankroll();
        this.displayBankroll();


        const hand1Div=document.getElementById("playersHand");
        const hand2Div=document.getElementById("playersHand2");
        this.drawCardFromDeck(this.player.hand, hand1Div, false);
        this.drawCardFromDeck(this.player.hand2, hand2Div, false);

        this.renderHandsFromScratchAfterSplit();
    }

    renderHandsFromScratchAfterSplit() {
        const hand1Div = document.getElementById("playersHand");
        const hand2Div = document.getElementById("playersHand2");

        hand1Div.innerHTML = "";
        hand2Div.innerHTML = "";

        hand2Div.style.display = "flex";

        for(let card of this.player.hand) {
            let cardIsRed = ((card.suit === '♥') || (card.suit === '♦'));
            let suitAndValue = "" + card.suit + card.value;
            let HTMLforCard = "";

            if (cardIsRed)
                    HTMLforCard = "<div class=\"card-show card-is-red\">" + suitAndValue + "</div>";
            else
                    HTMLforCard = "<div class=\"card-show\">" + suitAndValue + "</div>";

            hand1Div.innerHTML = hand1Div.innerHTML + HTMLforCard;
        }

        for(let card of this.player.hand2) {
            let cardIsRed = ((card.suit === '♥') || (card.suit === '♦'));
            let suitAndValue = "" + card.suit + card.value;
            let HTMLforCard = "";

            if (cardIsRed)
                    HTMLforCard = "<div class=\"card-show card-is-red\">" + suitAndValue + "</div>";
            else
                    HTMLforCard = "<div class=\"card-show\">" + suitAndValue + "</div>";

            hand2Div.innerHTML = hand2Div.innerHTML + HTMLforCard;
        }
    }
    
    
    showInsuranceTakenIndicator() {
        const visualIndicator = document.getElementById("insurance-taken-visual-indicator");
        visualIndicator.style.visibility = "visible";
    }

    hideInsuranceTakenIndicator() {
        const visualIndicator = document.getElementById("insurance-taken-visual-indicator");
        visualIndicator.style.visibility = "hidden";
    }

    takeInsurance() {
        this.hideInsuranceButton();

        this.showInsuranceTakenIndicator();


        console.log("Insurance taken");
        this.insuranceTaken = true;
        this.insuranceBetAmount = this.betAmount/2;
        console.log("insurance bet of $" + this.insuranceBetAmount);
        this.player.bankroll -= this.insuranceBetAmount;
        this.player.updateLocalStorageBankroll();
        this.updateBankrollDisplay();
    }
    
    // METHODS FOR TESTING
    // givePlayerBlackJack() {
    //     let aceOfSpades = new Card("♠","A"); 
    //     let tenOfSpades = new Card("♠","10");
    //     this.player.hand.push(aceOfSpades);
    //     this.player.hand.push(tenOfSpades);
    // }

    giveDealerBlackJack() {
        let aceOfSpades = new Card("♠","A"); 
        let tenOfSpades = new Card("♠","10");
        this.dealer.hand.push(aceOfSpades);
        this.dealer.hand.push(tenOfSpades);
    }

    // givePlayerTwoAces() {
    //     let aceOfSpades = new Card("♠","A"); 
    //     let aceOfDiamonds = new Card("♦","A"); 
    //     this.player.hand.push(aceOfSpades);
    //     this.player.hand.push(aceOfDiamonds);
    // }
    //
    gameTip()
    {
        if(this.dealerHasFaceUpAce())
            {
                console.log("In games with 4 or more decks Dont take insurance this is not worth it.");    
                console.log("In a single game deck like this, the odds are more in your favour so you can take it."); 

                if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 11)
                {
                console.log("Dealer has an ace just take a card.");
                }
                else if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 10)
                {
                console.log("Dealer has an ace just take a card.");
                }
                else if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 9)
                {
                console.log("Dealer has an ace just take a card.");
                }
            }
        else{
            if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 11)
            {
            console.log("You should double down");
            }
            else if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 10)
            {
            console.log("You should double down");
            }
            else if(this.player.hand[0].numericValue() + this.player.hand[1].numericValue() === 9)
            {
            console.log("You should double down");
            }
        
            else if(this.player.hand[0].numericValue()  === this.player.hand[1].numericValue()) 
            {// This needs to be adjusted as it calls this with any two pic cards
            console.log("Split a pair of As or 8s");
            console.log("Never split on a pair of 5s, 10s Js, Qs or Ks");
            }
            else if((this.player.hand[0].numericValue())  === 11 &&( this.player.hand[1].numericValue() ===5 )) 
            {
                console.log("You should double down");
            }
            
            else
            {
                console.log("Testing Testing");
            }
        }
    
    }

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

        for (let card of handToCalculateValueFor) {
            if (card.intValue != 11)
                tempHandValue += card.intValue;
            else {
                numberOfAces++;
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

    setBankrollFromLocalStorage() {
        this.bankroll = localStorage.getItem('bankroll');
    }

    updateLocalStorageBankroll() {
        localStorage.setItem('bankroll', this.bankroll);
    }
    
}

class Player extends User  {
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
        this.cards = [];
         for (let suit of SUITS) {
             for (let value of VALUES) {
                 let cardToAdd = new Card(suit, value);
                 this.cards.push(cardToAdd);
             }
         }
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

//online/offline api stuff
const checkOnlineStatus = async () => {
    try {
      const online = await fetch("https://bet.sbgcdn.com/content/cadmin/700f32ed29c1554daddeb32776c4aa04.jpg", {cache: "no-store"});
      
      return online.status >= 200 && online.status < 300; // either true or false
    } catch (err) {
      return false; // definitely offline
    }
  };

  setInterval(async () => {
    const connected = await checkOnlineStatus();
    
    displayRedirectPopUp(connected);

    }, 60000);

  window.addEventListener("load", async (event) => {
    displayRedirectPopUp(await checkOnlineStatus());
  });


function displayRedirectPopUp(connection) {
    if (connection && remindMe) {
        const popUp = document.getElementById("status-popup");
        popUp.style.display = "block";
    }
}

function hideRedirectPopUp(){
    const popUp = document.getElementById("status-popup");
    popUp.style.display = "none";
}

function redirectToSkyBet() {
    window.location.href = "https://m.skybet.com/";
}

function setRemindMeAboutRedirect() {
    const checkbox = document.getElementById("remind-checkbox");
    remindMe = !checkbox.checked;
}


// init game and function to start

var blackjackGame = new Game();

function startGame() {

    startAudioLoopAndSetVolume();
    document.getElementById("overlay").style.display = "none";
    blackjackGame.clearHandAndAwaitUserBet();
}

var remindMe = true;

function startAudioLoopAndSetVolume() {
    const gameAudio = document.getElementById("gameSound");
    gameAudio.loop = true;
    gameAudio.volume = 0.0;
    gameAudio.play();
}

function toggleSound(){
    var gameAudio = document.getElementById("gameSound");
    var audioButton = document.getElementById("sound-button-img");

    if(gameAudio.muted)
    {
        gameAudio.muted = false;
        audioButton.src = "./CSS/pinkSoundOn.png";
    }
    else
    {
        gameAudio.muted = true;
        audioButton.src = "./CSS/pinkSoundOff.png";
    }
}

function newGame() {
  document.getElementById("overlay").style.display = "none";
}
   