import {IdentificationKey} from "../../src";
import {IdentificationModes} from "../../src/IdentificationKey";

export default () => {
  const children = [
    {
      "uuid": "79caeb21-50fd-473e-9a5c-08db85a7cd60",
      "nodeType": "node",
      "imageUrl": "localcosmos/user_content/content_images/image-85-500.webp",
      "space": {
        "ee604429-7236-4be6-8ab5-31b9ca62d5cd": [
          {
            "spaceIdentifier": "ee604429-7236-4be6-8ab5-31b9ca62d5cd:103",
            "encodedSpace": "<p>erstes Beinpaar ohne großen Scheren</p>"
          }
        ]
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Garnelen & Kleinkrebse",
      "decisionRule": "",
      "taxon": null,
      "factSheets": [],
      "slug": "42-garnelen-kleinkrebse"
    },
    {
      "uuid": "58d2f95e-6bd5-4e3d-92d4-d741eb80bfe8",
      "nodeType": "node",
      "imageUrl": "localcosmos/user_content/content_images/image-86-500.webp",
      "space": {
        "ee604429-7236-4be6-8ab5-31b9ca62d5cd": [
          {
            "spaceIdentifier": "ee604429-7236-4be6-8ab5-31b9ca62d5cd:102",
            "encodedSpace": "<p>erstes Beinpaar mit großen Scheren</p>"
          }
        ],
        "5856fbeb-613e-4af6-8c54-0557e5792c50": [
          {
            "spaceIdentifier": "5856fbeb-613e-4af6-8c54-0557e5792c50:WzEuMCw1LjBd",
            "encodedSpace": [
              1.0,
              5.0
            ]
          }
        ]
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Flusskrebse & Krabben",
      "decisionRule": "",
      "taxon": null,
      "factSheets": [],
      "slug": "41-flusskrebse-krabben"
    },
    {
      "uuid": "fffffffff-6bd5-4e3d-92d4-d741eb80bfe8",
      "nodeType": "node",
      "imageUrl": "localcosmos/user_content/content_images/image-86-500.webp",
      "space": {
        "ee604429-7236-4be6-8ab5-31b9ca62d5cd": [
          {
            "spaceIdentifier": "ee604429-7236-4be6-8ab5-31b9ca62d5cd:103",
            "encodedSpace": "<p>erstes Beinpaar ohne großen Scheren</p>"
          }
        ],
        "fffffffff-7236-4be6-8ab5-31b9ca62d5cd": [
          {
            "spaceIdentifier": "fffffffff-7236-4be6-8ab5-31b9ca62d5cd:001",
            "encodedSpace": "<p>hat flügel</p>",
          }
        ],
        "5856fbeb-613e-4af6-8c54-0557e5792c50": [
          {
            "spaceIdentifier": "5856fbeb-613e-4af6-8c54-0557e5792c50:WzEuMCwxMS4wXQ==",
            "encodedSpace": [
              1.0,
              11.0
            ]
          }
        ],
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Fliegende Krebse",
      "decisionRule": "",
      "taxon": null,
      "factSheets": [],
      "slug": "41-flusskrebse-krabben"
    }
  ]
  const filters =  {
    "ee604429-7236-4be6-8ab5-31b9ca62d5cd": {
      "uuid": "ee604429-7236-4be6-8ab5-31b9ca62d5cd",
      "name": "Beine & Scheren",
      "type": "DescriptiveTextAndImagesFilter",
      "description": null,
      "definition": {
        "allow_multiple_values": false
      },
      "weight": 5,
      "position": 1,
      "restrictions": {},
      "isRestricted": false,
      "allowMultipleValues": false,
      "space": [
        {
          "spaceIdentifier": "ee604429-7236-4be6-8ab5-31b9ca62d5cd:103",
          "encodedSpace": "<p>erstes Beinpaar ohne großen Scheren</p>",
          "imageUrl": "localcosmos/user_content/content_images/image-33-500.webp",
          "secondaryImageUrl": null
        },
        {
          "spaceIdentifier": "ee604429-7236-4be6-8ab5-31b9ca62d5cd:102",
          "encodedSpace": "<p>erstes Beinpaar mit großen Scheren</p>",
          "imageUrl": "localcosmos/user_content/content_images/image-34-500.webp",
          "secondaryImageUrl": null
        },
      ]
    },
    "fffffffff-7236-4be6-8ab5-31b9ca62d5cd": {
      "uuid": "fffffffff-7236-4be6-8ab5-31b9ca62d5cd",
      "name": "Flügel",
      "type": "DescriptiveTextAndImagesFilter",
      "description": null,
      "definition": {
        "allow_multiple_values": false
      },
      "weight": 10,
      "position": 1,
      "restrictions": {},
      "isRestricted": false,
      "allowMultipleValues": false,
      "space": [
        {
          "spaceIdentifier": "fffffffff-7236-4be6-8ab5-31b9ca62d5cd:001",
          "encodedSpace": "<p>hat flügel</p>",
          "imageUrl": "localcosmos/user_content/content_images/image-33-500.webp",
          "secondaryImageUrl": null
        }
      ]
    },
    "5856fbeb-613e-4af6-8c54-0557e5792c50": {
      "uuid": "5856fbeb-613e-4af6-8c54-0557e5792c50",
      "name": "Körperlänge",
      "type": "RangeFilter",
      "position": 4,
      "description": null,
      "weight": 5,
      "restrictions": {},
      "isRestricted": false,
      "allowMultipleValues": false,
      "space": [
        {
          "encodedSpace": [
            1.0,
            15.0
          ],
          "spaceIdentifier": "5856fbeb-613e-4af6-8c54-0557e5792c50:WzEuMCwxNS4wXQ=="
        }
      ],
      "definition": {
        "min": null,
        "max": null,
        "step": 1.0,
        "unit": "cm",
        "unit_verbose": ""
      }
    },
  }


  return new IdentificationKey(
      'Garnelen & Kleinkrebse',
      null,
      children as any,
      IdentificationModes.fluid,
      2,
      [],
      'garnelen-etc',
      'localcosmos/user_content/content_images/image-85-500.webp',
      filters as any,
  )
}