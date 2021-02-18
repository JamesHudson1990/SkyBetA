export class User{
    constructor() {
        this.hand = [];
        this.bankroll = 1000;
        this.bust = false;
        this.hand2 = [];
    }
    
    clearHand(){
        this.hand = [];
        this.hand2 = [];
    }

    static getHandValue(handToCalculateValueFor){
        let tempHandValue = 0;      
        let arrayOfCardIntValues = [];
        let numberOfAces = 0;

        for (let card of handToCalculateValueFor) { // calculates how many aces are in the hand
            if (card.intValue != 11)
                tempHandValue += card.intValue;
            else
                numberOfAces++;
        }
        
        //logic that checks for how many aces a hand has and if each one should be counted as an 11 or a 1
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

    splitHand() { // when the player has they can choose to split, this function divides the hand into two
        const cardToAddToHand2 = this.hand.slice(-1);
        this.hand2.push(cardToAddToHand2[0]);
        this.hand.pop(cardToAddToHand2[0]);
    }

    static checkBust(handToCheck){
        return User.getHandValue(handToCheck) > 21;
    }

    setBankrollFromLocalStorage(){ // when the page is refreshed this function will retrieve the bankroll from local storage and save it as the players bankroll for the current game
        this.bankroll = localStorage.getItem('bankroll');
    }

    updateLocalStorageBankroll(){ // when the bankroll has incresed or decreased this function will save the integer in the local storage to be used when the page is refreshed
        localStorage.setItem('bankroll', this.bankroll);
    }
}
