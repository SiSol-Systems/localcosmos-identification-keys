import {IdentificationKey} from "../../src";

export default () => {
  const children = [
    {
      "id": 42,
      "metaNodeId": 42,
      "nodeType": "node",
      "imageUrl": "localcosmos/user_content/content_images/image-85-500.webp",
      "uuid": "79caeb21-50fd-473e-9a5c-08db85a7cd60",
      "space": {
        "ee604429-7236-4be6-8ab5-31b9ca62d5cd": [
          "<p>erstes Beinpaar ohne großen Scheren</p>"
        ]
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Dings",
      "decisionRule": "",
      "taxon": null,
      "factSheets": []
    },
    {
      "id": 41,
      "metaNodeId": 41,
      "nodeType": "node",
      "imageUrl": "localcosmos/user_content/content_images/image-86-500.webp",
      "uuid": "58d2f95e-6bd5-4e3d-92d4-d741eb80bfe8",
      "space": {
        "ee604429-7236-4be6-8ab5-31b9ca62d5cd": [
          "<p>erstes Beinpaar mit großen Scheren</p>"
        ]
      },
      "maxPoints": 5,
      "isVisible": true,
      "name": "Flusskrebse & Krabben",
      "decisionRule": "",
      "taxon": null,
      "factSheets": []
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
      "restrictions": {},
      "isRestricted": false,
      "allowMultipleValues": false,
      "space": [
        {
          "encodedSpace": "<p>erstes Beinpaar ohne großen Scheren</p>",
          "imageUrl": "localcosmos/user_content/content_images/image-33-500.webp",
          "secondaryImageUrl": null
        },
        {
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
      filters as any
  )
}