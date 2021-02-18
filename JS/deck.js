import { Card } from '/JS/card.js';

const SUITS = ["♠","♥","♣","♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export class Deck{
    constructor(){
         this.cards = this.resetDeck();
    }

    resetDeck(){ // this resets the deck after ever hand by making the deck an empty array then repopulating it will all 52 cards
        this.cards = [];
        for (let suit of SUITS) {
            for (let value of VALUES) {
                let cardToAdd = new Card(suit, value);
                this.cards.push(cardToAdd);
            }
        }
    }

    drawCard(){ // this function is called anytime the player or dealer take a card, it returns the top card on the deck
        const cardsDrawn = this.cards.slice(-1);
        this.cards = this.cards.slice(0, -1);
        return cardsDrawn;
    }

    deckSize(){ // returns the size of the deck
         return this.cards.length;
    }

    shuffle(){ // every time the deck is shuffles at the start of each game this function is called
        for(let i = this.deckSize() - 1; i > 0; i--){
            const newLocation = Math.floor(Math.random() * (i + 1)); //Random location before the card we are on
            const oldCard = this.cards[newLocation]; // Switched the card we are currently on with new card at the random location
            this.cards[newLocation] = this.cards[i];
            this.cards[i] = oldCard;
        }
    }
 }