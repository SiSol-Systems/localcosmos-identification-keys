import {beforeEach, describe, expect, jest, test} from '@jest/globals';

import {IdentificationEvents, IdentificationKey} from "./../src/IdentificationKey";
import IdentificationKeyFixture from './fixtures/identificationKey';

describe('IdentificationKey', () => {
    let identificationKey: IdentificationKey;

    beforeEach(() => {
        identificationKey = IdentificationKeyFixture()
    })

    test('calculates filtered children after construction', () => {
        expect(identificationKey.children.length).toEqual(2)
        expect(identificationKey.filteredChildren.length).toEqual(identificationKey.children.length)
    })

    test('calls listeners registered to an event', () => {
        const callback = jest.fn()
        identificationKey.on(IdentificationEvents.childrenUpdated, callback)
        identificationKey.notifyListeners(IdentificationEvents.childrenUpdated, 'payload')
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(IdentificationEvents.childrenUpdated, identificationKey, 'payload')
    })

    test('does not call listener of a different event', () => {
        const callback = jest.fn()
        identificationKey.on(IdentificationEvents.childrenUpdated, callback)
        identificationKey.notifyListeners(IdentificationEvents.matrixItemUpdate)
        expect(callback).not.toHaveBeenCalled()
    })

    test('does not call unregistered listener', () => {
        const callback = jest.fn()
        identificationKey.on(IdentificationEvents.childrenUpdated, callback)
        identificationKey.off(IdentificationEvents.childrenUpdated, callback)
        identificationKey.notifyListeners(IdentificationEvents.childrenUpdated)
        expect(callback).not.toHaveBeenCalled()
    })

    test('notifies listeners on space selection', () => {
        const callback = jest.fn()
        identificationKey.on(IdentificationEvents.childrenUpdated, callback)

        const filter = identificationKey.matrixFilters['ee604429-7236-4be6-8ab5-31b9ca62d5cd']
        identificationKey.onSelectSpace(filter, filter.space[0])
        expect(identificationKey.filteredChildren.length).toEqual(1)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(IdentificationEvents.childrenUpdated, identificationKey, identificationKey.filteredChildren)
    })

    test('notifies listeners on space deselection', () => {
        const callback = jest.fn()
        identificationKey.on(IdentificationEvents.childrenUpdated, callback)

        const filter = identificationKey.matrixFilters['ee604429-7236-4be6-8ab5-31b9ca62d5cd']
        identificationKey.onSelectSpace(filter, filter.space[0])
        identificationKey.onDeselectSpace(filter, filter.space[0])
        expect(identificationKey.filteredChildren.length).toEqual(2)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(IdentificationEvents.childrenUpdated, identificationKey, identificationKey.filteredChildren)
    })
})