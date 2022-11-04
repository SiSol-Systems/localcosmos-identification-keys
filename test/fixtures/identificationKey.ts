import {IdentificationKey} from "../../src";

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
        ]
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Flusskrebse & Krabben",
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
        }
      ]
    }
  }


  return new IdentificationKey(
      'Garnelen & Kleinkrebse',
      null,
      children as any,
      'fluid',
      2,
      [],
      'garnelen-etc',
      filters as any,
  )
}