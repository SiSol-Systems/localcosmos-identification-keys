import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {IdentificationEvents, IdentificationKey} from "../../models/src/IdentificationKey";
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
    ]);
  })

  test('selecting a space updates the possibleNodes', () => {
    key.selectSpace(0);
    expect(key.possibleNodes).toEqual([1, 0, 1]);
  })

  test('selecting a space updates the possibleSpaces', () => {
    key.selectSpace(0);
    expect(key.possibleSpaces).toEqual([1, 0, 1]);
  })

  test('selecting two spaces updates the possibleNodes', () => {
    key.selectSpace(0);
    key.selectSpace(2);
    expect(key.possibleNodes).toEqual([0, 0, 1]);
  })

  test('selecting two spaces updates the possibleSpaces', () => {
    key.selectSpace(0);
    key.selectSpace(2);
    expect(key.possibleSpaces).toEqual([1, 0, 1]);
  })

  test('selecting the last space updates the possibleNodes', () => {
    key.selectSpace(1);
    expect(key.possibleNodes).toEqual([0, 1, 0]);
  })

  test('selecting the last space updates the possibleSpaces', () => {
    key.selectSpace(1);
    expect(key.possibleSpaces).toEqual([0, 1, 0]);
  })

  test('selecting and deselecting a space updates the possibleNodes', () => {
    key.selectSpace(0);
    key.deselectSpace(0);
    expect(key.possibleNodes).toEqual([1, 1, 1]);
  })

  test('selecting and deselecting a space updates the possibleSpaces', () => {
    key.selectSpace(0);
    key.deselectSpace(0);
    expect(key.possibleSpaces).toEqual([1, 1, 1]);
  })

  test('selecting a space notifies listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.spaceSelected, listener);
    key.selectSpace(0);
    expect(listener).toHaveBeenCalledWith(IdentificationEvents.spaceSelected, key, key.spaces[0]);
  })

  test('deselecting a space notifies listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.spaceDeselected, listener);
    key.selectSpace(0);
    key.deselectSpace(0);
    expect(listener).toHaveBeenCalledWith(IdentificationEvents.spaceDeselected, key, key.spaces[0]);
  })

  test('selecting a space that is already selected does not notify listeners', () => {
    const listener = jest.fn();
    key.on(IdentificationEvents.spaceSelected, listener);
    key.selectSpace(0);
    key.selectSpace(0);
    expect(listener).toHaveBeenCalledTimes(1);
  })

  test('selecting a space that is already selected does not compute possibleNodes', () => {
    const listener = jest.spyOn(key, 'computePossibleValues');
    key.selectSpace(0);
    key.selectSpace(0);
    expect(listener).toHaveBeenCalledTimes(1);
  })

  test('selecting a space that is impossible does not compute possibleNodes', () => {
    const listener = jest.spyOn(key, 'computePossibleValues');
    key.selectSpace(0);
    key.selectSpace(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });
})