export class Card {
    constructor(suit, value){ // each card object has an attreibute of a suit and a value
        this.suit = suit;
        this.value = value;
        this.intValue = this.numericValue();
        this.aceValueOf11 = true;
    }

    numericValue(){ // function returns the numereic value of a card, if its a picture card 10 is returned, ace - 11, other than that the numeric value is just the value of the card
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