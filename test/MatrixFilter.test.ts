import {describe, beforeEach, test, expect, jest} from "@jest/globals";

import { IdentificationKey } from "./../src/IdentificationKey";
import { MatrixFilter } from "./../src/MatrixFilter";
import { MatrixFilterSpace } from "./../src/MatrixFilterSpace";
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