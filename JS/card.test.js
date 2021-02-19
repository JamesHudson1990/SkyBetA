import { Card } from './card';

test('check that a new card object is initilized the the specified value', () => {
    const newCard = new Card("Spades","A");
    expect(newCard.value).toBe("A");
})

test('check numericvalue is returning the expected value of an Ace', () => {
    const newCard = new Card("Spades","A");
    expect(newCard.numericValue()).toBe(11);
})

test('check numericvalue is returning the expected value of a Queen', () => {
    const newCard = new Card("Spades","Q");
    expect(newCard.numericValue()).toBe(10);
})

test('check numericvalue is returning the expected value of a Jack', () => {
    const newCard = new Card("Spades","J");
    expect(newCard.numericValue()).toBe(10);
})

test('check numericvalue is returning the expected value of a King', () => {
    const newCard = new Card("Spades","K");
    expect(newCard.numericValue()).toBe(10);
})

test('check that the intvalue is the expected value for a King', () => {
    const newCard = new Card("Spades","K");
    expect(newCard.intValue).toBe(10);
})

test('check numericvalue is returning the expected value of a 3', () => {
    const newCard = new Card("Spades","3");
    expect(newCard.numericValue()).toBe(3);
})