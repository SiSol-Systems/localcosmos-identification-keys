import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {IdentificationEvents, IdentificationKey, IdentificationModes} from "../../models/src/IdentificationKey";
import IdentificationKeyFixture from './fixtures/identificationKey';

describe('IdentificationKey', () => {
  let key: IdentificationKey;

  beforeEach(() => {
    key = IdentificationKeyFixture()
  })

  test('creating a new IdentificationKey fills the spaceNodeMapping', () => {
    expect(key.spaceNodeMapping).toEqual([
      [1, 0, 1],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ]);
  })

  test('selecting a space updates the possibleNodes', () => {
    key.selectSpace(0);
    expect(key.possibleNodes).toEqual([1, 0, 1]);
  })

  test('selecting a space updates the possibleSpaces', () => {
    key.selectSpace(0);
    expect(key.possibleSpaces).toEqual([1, 0, 1, 1]);
  })

  test('selecting two spaces updates the possibleNodes', () => {
    key.selectSpace(0);
    key.selectSpace(2);
    expect(key.possibleNodes).toEqual([0, 0, 1]);
  })

  test('selecting two spaces updates the possibleSpaces', () => {
    key.selectSpace(0);
    key.selectSpace(2);
    expect(key.possibleSpaces).toEqual([1, 0, 1, 1]);
  })

  test('selecting another space updates the possibleNodes', () => {
    key.selectSpace(1);
    expect(key.possibleNodes).toEqual([0, 1, 0]);
  })

  test('selecting another space updates the possibleSpaces', () => {
    key.selectSpace(1);
    expect(key.possibleSpaces).toEqual([0, 1, 0, 1]);
  })

  test('selecting and deselecting a space updates the possibleNodes', () => {
    key.selectSpace(0);
    key.deselectSpace(0);
    expect(key.possibleNodes).toEqual([1, 1, 1]);
  })

  test('selecting and deselecting a space updates the possibleSpaces', () => {
    key.selectSpace(0);
    key.deselectSpace(0);
    console.log(key.spaceNodeMapping)
    expect(key.possibleSpaces).toEqual([1, 1, 1, 1]);
  })

  test('selecting a space notifies listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.beforeSpaceSelected, listener);
    key.on(IdentificationEvents.spaceSelected, listener);
    key.selectSpace(0);
    expect(listener).toHaveBeenCalledWith(IdentificationEvents.beforeSpaceSelected, key, { index: 0, encodedSpace: null });
    expect(listener).toHaveBeenCalledWith(IdentificationEvents.spaceSelected, key, { index: 0, encodedSpace: null });
  })

  test('deselecting a space notifies listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.spaceDeselected, listener);
    key.selectSpace(0);
    key.deselectSpace(0);
    expect(listener).toHaveBeenCalledWith(IdentificationEvents.spaceDeselected, key, { index: 0, encodedSpace: null });
  })

  test('selecting a space that is already selected does not notify listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.spaceSelected, listener);
    key.selectSpace(0);
    key.selectSpace(0);
    expect(listener).toHaveBeenCalledTimes(1);
  })

  test('selecting a range filter space filters out nodes that are not in the range', () => {
    key.selectSpace(3, [3.0]);
    expect(key.possibleNodes).toEqual([0, 1, 1]);
  })

  test('selecting a range space again updates the possibleNodes', () => {
    key.selectSpace(3, [3.0]);
    key.selectSpace(3, [7.0]);
    expect(key.possibleNodes).toEqual([0, 0, 1]);
  })

  describe('fluid mode', () => {
    beforeEach(() => {
      key.identificationMode = IdentificationModes.fluid;
    })

    test('selecting a space in fluid mode updates its points', () => {
      key.selectSpace(0);
      expect(key.points[key.children[0].uuid]).toEqual(5);
    })

    test('deselecting a space removes points from it', () => {
      key.selectSpace(0);
      key.deselectSpace(0);
      expect(key.points[key.children[0].uuid]).toEqual(0);
    })

    test('selecting two spaces sums their points', () => {
      key.selectSpace(0);
      key.selectSpace(2);
      expect(key.points[key.children[0].uuid]).toEqual(5);
      expect(key.points[key.children[2].uuid]).toEqual(15);
    })
  });
})