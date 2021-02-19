import { User } from './user';
import { Card } from './card';

test('check that a new user has an empty hand', () => {
    const newUser = new User();
    expect(newUser.hand).toEqual([]);
})

test('check that a new user has a bankroll of 1000', () => {
    const newUser = new User();
    expect(newUser.bankroll).toEqual(1000);
})

test('check that clearHand clears both of the users hands', () => {
    const newUser = new User();
    newUser.hand = [1,2,3];
    newUser.hand2 = [1,2,3];

    newUser.clearHand();

    expect(newUser.hand).toEqual([]);
    expect(newUser.hand2).toEqual([]);
})

test('check that split hand slices the 2nd item in the hand array and adds that to the hand2 array', () => {
    const newUser = new User();
    newUser.hand = [1,2];
    newUser.splitHand();
    expect(newUser.hand).toEqual([1]);
    expect(newUser.hand2).toEqual([2]);
})

test('check that a card can be added to a hand array', () => {
    const newUser = new User();
    const newCard =  new Card("Spades","A");
    newUser.hand.push(newCard);

    expect(newUser.hand[0]).toEqual(newCard);
})

test('check that gethandvalue is returning 21 for a blackjack', () => {
    const newUser = new User();
    const newCard =  new Card("Spades","A");
    const newCard2 =  new Card("Spades","Q");
    newUser.hand.push(newCard);
    newUser.hand.push(newCard2);

    expect(User.getHandValue(newUser.hand)).toEqual(21);
})

test('check that gethandvalue is returning 12 for two aces', () => {
    const newUser = new User();
    const newCard =  new Card("Spades","A");
    const newCard2 =  new Card("Hearts","A");
    newUser.hand.push(newCard);
    newUser.hand.push(newCard2);

    expect(User.getHandValue(newUser.hand)).toEqual(12);
})

test('check that gethandvalue is returning 13 for three aces', () => {
    const newUser = new User();
    const aceOfSpades =  new Card("Spades","A");
    const aceOfHearts =  new Card("Hearts","A");
    const aceOfClubs =  new Card("Clubs","A");

    newUser.hand.push(aceOfSpades);
    newUser.hand.push(aceOfHearts);
    newUser.hand.push(aceOfClubs);

    expect(User.getHandValue(newUser.hand)).toEqual(13);
})

test('check that gethandvalue is returning 14 for four aces', () => {
    const newUser = new User();
    const aceOfSpades =  new Card("Spades","A");
    const aceOfHearts =  new Card("Hearts","A");
    const aceOfClubs =  new Card("Clubs","A");
    const aceOfDiamonds =  new Card("Diamonds","A");

    newUser.hand.push(aceOfSpades);
    newUser.hand.push(aceOfHearts);
    newUser.hand.push(aceOfClubs);
    newUser.hand.push(aceOfDiamonds);

    expect(User.getHandValue(newUser.hand)).toEqual(14);
})

test('check that splitting a pair of aces adds the 2nd ace to the hand 2 array', () => {
    const newUser = new User();
    const aceOfSpades =  new Card("Spades","A");
    const aceOfHearts =  new Card("Hearts","A");

    newUser.hand.push(aceOfSpades);
    newUser.hand.push(aceOfHearts);

    newUser.splitHand();

    expect(newUser.hand[0]).toEqual(aceOfSpades);
    expect(newUser.hand2[0]).toEqual(aceOfHearts);
})

test('check that after splitting a pair of aces calling getHandValue returns 11 for each hand', () => {
    const newUser = new User();
    const aceOfSpades =  new Card("Spades","A");
    const aceOfHearts =  new Card("Hearts","A");

    newUser.hand.push(aceOfSpades);
    newUser.hand.push(aceOfHearts);

    newUser.splitHand();

    expect(User.getHandValue(newUser.hand)).toEqual(11);
    expect(User.getHandValue(newUser.hand2)).toEqual(11);
})

test('check that checkBust on a hand with a value of more than 21 returns true', () => {
    const newUser = new User();
    const tenOfSpades =  new Card("Spades","10");
    const tenOfHearts =  new Card("Hearts","10");
    const fiveOfHearts =  new Card("Hearts","5");

    newUser.hand.push(tenOfSpades);
    newUser.hand.push(tenOfHearts);
    newUser.hand.push(fiveOfHearts);

    expect(User.checkBust(newUser.hand)).toEqual(true);
})

test('check that checkBust on a hand with a value of less than 21 returns false', () => {
    const newUser = new User();
    const tenOfSpades =  new Card("Spades","10");
    const tenOfHearts =  new Card("Hearts","10");

    newUser.hand.push(tenOfSpades);
    newUser.hand.push(tenOfHearts);

    expect(User.checkBust(newUser.hand)).toEqual(false);
})










