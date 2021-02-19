import { Game } from './game';
import { Deck } from './deck';
import { User } from './user';
import { Card } from './card';
import { expect } from '@jest/globals';

jest.mock('./user');
jest.mock('./deck');

beforeEach(() => {
    User.mockClear();
    Deck.mockClear();
});

test('check that the User constructor is called twice upon creation of a game', () => {
    const testBlackjackGame = new Game();
    expect(User).toHaveBeenCalledTimes(2);
})

test('check that the Deck constructor is called once upon creation of a game', () => {
    const testBlackjackGame = new Game();
    expect(Deck).toHaveBeenCalledTimes(1);
})

test('check that dealerHasFaceUpAce returns true if the dealer has an ace as their first card', () => {
    const testBlackjackGame = new Game();

    testBlackjackGame.dealer.hand = [];

    const aceOfSpades = new Card("Spades","A");
    testBlackjackGame.dealer.hand.push(aceOfSpades);

    expect(testBlackjackGame.dealerHasFaceUpAce()).toBe(true);
})

test('check that dealerHasFaceUpAce returns false if the dealer has an does not have an ace as their first card', () => {
    const testBlackjackGame = new Game();

    testBlackjackGame.dealer.hand = [];

    const tenOfSpades = new Card("Spades","10");
    testBlackjackGame.dealer.hand.push(tenOfSpades);

    expect(testBlackjackGame.dealerHasFaceUpAce()).toBe(false);
})


