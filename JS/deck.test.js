import { Deck } from './deck';
import { Card } from './card';
import { expect, jest } from '@jest/globals';

jest.mock('./card');

beforeEach(() => {
    Card.mockClear();
});

test('check that upon creation of a deck the card constructor has been called 52 times', () => {
    const testDeck = new Deck();
    expect(Card).toHaveBeenCalledTimes(52);
})

test('check that the decksize returns 1 on a deck of a single card', () => {
    const testDeck = new Deck();
    const newCard = new Card("Spades","A");
    testDeck.cards = [];
    testDeck.cards.push(newCard);

    expect(testDeck.deckSize()).toBe(1);
})

test('check that the decksize returns 52 on a full deck of cards', () => {
    const testDeck = new Deck();
    const newCard = new Card("Spades","A");
    testDeck.cards = [];

    for(let i=0; i < 52; i++)
        testDeck.cards.push(newCard);


    expect(testDeck.deckSize()).toBe(52);
})

test('check that the drawCard returns the only card of a deck of a single card', () => {
    const testDeck = new Deck();
    const newCard = new Card("Spades","A");
    testDeck.cards = [];
    testDeck.cards.push(newCard);

    expect(testDeck.drawCard()).toStrictEqual([newCard]);
})

test('check that when resetDeck method is called that the card constructor is called 52 times', () => {
    const testDeck = new Deck();
    const defaultCardCallsFromConstructor = 52;
    
    testDeck.resetDeck();

    expect(Card).toHaveBeenCalledTimes(defaultCardCallsFromConstructor+52);
})