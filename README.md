# localcosmos-identification-keys

Utility for identification keys built for Local Cosmos Apps. Written in TypeScript.

Documentation: [https://localcosmos-identification-keys.readthedocs.io/en/latest/](https://localcosmos-identification-keys.readthedocs.io/en/latest/)

## Matrix Idea

```typescript
import { IdentificationKeyReference } from "./IdentificationKey";
import { MatrixFilterSpace } from "./MatrixFilterSpace";

const nodes: IdentificationKeyReference[] = [
  {uuid: 'node1'},
  {uuid: 'node2'},
  {uuid: 'node3'},
];

// all spaces, for dynamic filters like range, create one generic entry
const spaces: MatrixFilterSpace[] = [
  {uuid: 'space1'},
  {uuid: 'space2'},
  {uuid: 'space3', filterType: 'range', value: [9] },
];

// 1 if node has a space encoded, 0 otherwise:
// each row is a space, each column a node, e.g. space 1 encodes only for node 3
const spaceNodeMapping = [
  [0, 0, 1],
  [0, 1, 1],
  [1, 1, 0],
];

// selected spaces are 1 if the according index is active, otherwise 0
let selectedSpaces: number[] = [1, 1, 0];

// = spaceNodeMapping[i] * selectedSpaces[i]
const  selectedSpaceMatrix: number[][] = [
  [0, 0, 1],
  [0, 1, 1],
  [0, 0, 0],
];

// 1 if column contains at least one 1, otherwise 0
const possibleNodes = [0, 0, 1]; // todo: wie bekomme ich das hier hin? -1, 0, 1
// 1 if row contains at least one 1, otherwise 0
const possibleSpaces = [1, 1, 0];

const computePossibleValues = function () {
  for (let i = 0; i < spaces.length; i++) {
    possibleSpaces[i] = selectedSpaceMatrix[i].find(v => v === 1) ? 1 : 0;
  }
  for (let i = 0; i < nodes.length; i++) {
    possibleNodes[i] = selectedSpaceMatrix.map((row, index) => row[i]).find(v => v === 1) ? 1 : 0;
  }
}

/***
 * Select Space:
 * To select a space we flip the value in `selectedSpaces` to 1 and compute the follow up matrices
 */
const selectSpace = function (index) {
  selectedSpaces[index] = 1;
  // by definition only column `index` could've changed during this update.
  // because we are selecting a space we simply copy the values from the spaceNodeMapping over
  selectedSpaceMatrix[index] = spaceNodeMapping[index];
  for (let i = 0; i < nodes.length; i++) {
    // let the space decide if it matches a given node and let it return 1 or 0
    // matchesNode is currently named `spaceMatchesReference`
    const match = spaces[index].matchesNode(nodes[i]);
    selectedSpaceMatrix[index][i] = match ? 1 : 0;
    if (match) {
      nodes[i].points += spaces[index].points;
    }
  }
  computePossibleValues();
}

const deselectSpace = function (index) {
  selectedSpaces[index] = 0;
  selectedSpaceMatrix[index] = (new Array(nodes.length)).fill(0);
  for (let i = 0; i < nodes.length; i++) {
    if (spaces[index].matchesNode(nodes[i])) {
      nodes[i].points -= spaces[index].points;
    }
  }
  computePossibleValues();
}
```

### Range Filters:

A `RangeFilter` can be implemented by overwriting the `matchesNode` method of the `RangeFilterSpace`. 
This allows for a dynamic space that can update its own selected range.

### Filter visibility:

```typescript
import { MatrixFilter } from "./MatrixFilter";

const filters: MatrixFilter[] = [];
const visibleFilters: number[] = [1, 0]; // filters.map(filter => filter.isVisible ? 1 : 0);

const computeVisibleFilters = function () {
  visibleFilters = filters.map(filter => {
    if (!filter.restrictions) {
      return 1;
    }
    
    return !!selectedSpaces.find((selected, index) => !!filter.restrictions[spaces[index].uuid] && spaces[index].matchesNode(filter)) ? 1 : 0;
  })
}
```

### Points:

Implemented in `selectSpace` and `deselectSpace`.

### Resetting:

```typescript
selectedSpaces = (new Array(spaces.length)).fill(0);
```