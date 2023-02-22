const assert = require('assert/strict');
const helpers = require('./helpers');
const {
  describe, it
} = require('mocha');

describe('helpers', () => {
  describe('intersection', () => {
    it('Should intersect the first given object and its values with the second given object', () => {
      const o1 = {
        v1 : 1,
        v2 : 2,
        v3 : 3
      }
      const o2 = {
        v2 : 'ignored',
        v4 : 'ignored'
      }
      const expected = { v2 : 2 }

      assert.deepEqual(helpers.intersection(o1, o2), expected);
    })

    it('Should give an empty result when nothing intersects', () => {
      const o1 = {
        v1 : 1,
        v2 : 2,
        v3 : 3
      }
      const o2 = { v4 : 'ignored' }
      const expected = {}

      assert.deepEqual(helpers.intersection(o1, o2), expected);
    })
  })
})