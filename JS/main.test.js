const { expect } = require("@jest/globals")

const { clearHand } = require('./script')

test('check that clear hand sets the currents objects to empty arrays', () => {
    const testUser = new User();
    testUser.clearHand();

expect(testUser.hand).toBe([]);
})