import {beforeEach, describe, expect, jest, test} from '@jest/globals';

import { MatrixFilterSpace } from "./../../src/spaces/MatrixFilterSpace";
import { MatrixFilter } from "./../../src/matrix-filters/MatrixFilter";
import IdentificationKeyFixture from "./../fixtures/identificationKey";

describe('MatrixFilterSpace', () => {
    let space: MatrixFilterSpace, filter: MatrixFilter;

    beforeEach(() => {
        const identificationKey = IdentificationKeyFixture()
        filter = Object.values(identificationKey.matrixFilters)[0]
        space = filter.space[0]
    })

    test('select triggers event on parent filter', () => {
        const eventSpy = jest.fn()
        filter.onSelectSpace = eventSpy;
        space.select()
        expect(eventSpy).toHaveBeenCalledTimes(1)
        expect(eventSpy).toHaveBeenCalledWith(space)
    })

    test('select event not triggered when space is impossible', () => {
        const eventSpy = jest.fn()
        filter.onSelectSpace = eventSpy;
        space.isPossible = false
        space.select()
        expect(eventSpy).not.toHaveBeenCalled()
    })

    test('deselect triggers event on parent if element was selected', () => {
        const eventSpy = jest.fn()
        filter.onDeselectSpace = eventSpy;
        space.isSelected = true
        space.deselect()
        expect(eventSpy).toHaveBeenCalledTimes(1)
        expect(eventSpy).toHaveBeenCalledWith(space)
    })

    test('deselect event not triggered if element was not selected', () => {
        const eventSpy = jest.fn()
        filter.onDeselectSpace = eventSpy;
        space.deselect()
        expect(eventSpy).not.toHaveBeenCalled()
    })

    test('element deselects if other space is selected and its not a multispace', () => {
        space.isSelected = true
        filter.isMultispace = false
        space.onOtherSpaceSelected(filter.space[1])
        expect(space.isSelected).toEqual(false)
    })

    test('element not deselected if other space is selected but its a multispace', () => {
        space.isSelected = true
        filter.isMultispace = true
        space.onOtherSpaceSelected(filter.space[1])
        expect(space.isSelected).toEqual(true)
    })
})