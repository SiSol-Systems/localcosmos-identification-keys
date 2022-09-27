import {describe, beforeEach, test, expect, jest} from "@jest/globals";

import { IdentificationKey } from "./../src/IdentificationKey";
import {MatrixFilter, ColorFilter, MatrixFilterType} from "./../src/MatrixFilter";
import { MatrixFilterSpace, MatrixFilterSpaceReference, ColorFilterSpace } from "./../src/MatrixFilterSpace";
import IdentificationKeyFixture from "./fixtures/identificationKey";

describe('MatrixFilter', () => {
    let identificationKey: IdentificationKey,
        filter: MatrixFilter,
        space: MatrixFilterSpace,
        otherSpace: MatrixFilterSpace;

    beforeEach(() => {
        identificationKey = IdentificationKeyFixture()
        identificationKey.onSelectSpace = jest.fn()
        identificationKey.onDeselectSpace = jest.fn()
        filter = Object.values(identificationKey.matrixFilters)[0]
        space = filter.space[0]
        otherSpace = filter.space[1]
    })

    test('onSelectSpace notifies parent identificationKey', () => {
        expect(identificationKey.onSelectSpace).not.toHaveBeenCalled()
        filter.onSelectSpace(space)
        expect(identificationKey.onSelectSpace).toHaveBeenCalledWith(filter, space)
    })

    test('onSelectSpace notifies other spaces of the filter', () => {
        otherSpace.onOtherSpaceSelected = jest.fn()
        expect(otherSpace.onOtherSpaceSelected).not.toHaveBeenCalled()
        filter.onSelectSpace(space)
        expect(otherSpace.onOtherSpaceSelected).toHaveBeenCalledWith(space)
    })

    test('onDeselectSpace notifies parent identificationKey', () => {
        expect(identificationKey.onDeselectSpace).not.toHaveBeenCalled()
        filter.onDeselectSpace(space)
        expect(identificationKey.onDeselectSpace).toHaveBeenCalledWith(filter, space)
    })

    test('onDeselectSpace notifies other spaces of the filter', () => {
        otherSpace.onOtherSpaceDeselected = jest.fn()
        expect(otherSpace.onOtherSpaceDeselected).not.toHaveBeenCalled()
        filter.onDeselectSpace(space)
        expect(otherSpace.onOtherSpaceDeselected).toHaveBeenCalledWith(space)
    })

    describe('isIdentificationKeyVisible', () => {
        test('returns true if selected space is included in the given reference space', () => {
            expect(filter.isIdentificationKeyVisible(space, identificationKey.children[0])).toEqual(true)
        })

        test('returns false if selected space is not included in the given reference space', () => {
            expect(filter.isIdentificationKeyVisible(space, identificationKey.children[1])).toEqual(false)
        })

        test('calls filter.spaceMatchesReference implementation to determine visibility', () => {
            const matchSpy: any = jest.fn()
            filter.spaceMatchesReference = matchSpy
            filter.isIdentificationKeyVisible(space, identificationKey.children[0])
            expect(matchSpy).toHaveBeenCalledWith(space, identificationKey.children[0].space['ee604429-7236-4be6-8ab5-31b9ca62d5cd'][0])
        })
    })

    describe('spaceMatchesReference', () => {
        test('returns true if identifier and space match', () => {
            const space = new MatrixFilterSpace('id', '<p>test</p>', null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'id', encodedSpace: '<p>test</p>' }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(true)
        })

        test('returns false if identifier does not match', () => {
            const space = new MatrixFilterSpace('id', '<p>test</p>', null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'other-id', encodedSpace: '<p>test</p>' }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(false)
        })

        test('returns false if encoded space does not match', () => {
            const space = new MatrixFilterSpace('id', '<p>test</p>', null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'id', encodedSpace: '<p>no test</p>' }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(false)
        })
    })

    test('createSpace adds a new space to the filter', () => {
        filter.space = []
        const space = filter.createSpace({
            spaceIdentifier: "9986a0a9-e073-4da2-a89d-89b6de3ae111:96",
            encodedSpace: "runder Körper",
            imageUrl: null,
            secondaryImageUrl: null
        })
        expect(filter.space).toHaveLength(1)
        expect(space.matrixFilter).toEqual(filter)
        expect(filter.space).toEqual([space])
    })
})

describe('ColorFilter', () => {
    let identificationKey: IdentificationKey,
        filter: ColorFilter;

    beforeEach(() => {
        identificationKey = {} as IdentificationKey
        filter = new ColorFilter(
            'filter-id',
            'ColorFilter',
            'Fellfarbe',
            null,
            true,
            false,
            1,
            {},
            false,
            identificationKey,
        )
    })

    describe('spaceMatchesReference', () => {
        test('returns true if identifier and space match', () => {
            const space = new ColorFilterSpace('id', [0, 0, 0, 1], null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'id', encodedSpace: [0, 0, 0, 1] }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(true)
        })

        test('returns false if identifier does not match', () => {
            const space = new MatrixFilterSpace('id', [0, 0, 0, 1], null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'other-id', encodedSpace: [0, 0, 0, 1] }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(false)
        })

        test('returns false if encoded space does not match', () => {
            const space = new MatrixFilterSpace('id', [0, 0, 0, 1], null, null, filter)
            const reference: MatrixFilterSpaceReference = { spaceIdentifier: 'id', encodedSpace: [255, 255, 255, 1] }
            expect(filter.spaceMatchesReference(space, reference)).toEqual(false)
        })
    })
})