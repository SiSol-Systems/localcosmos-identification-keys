*****
Usage
*****

Instantiating a new identification key
======================================

.. code-block:: javascript

    let identification = new IdentificationKey(data);


Processing user selections
==========================

If the user selects or deselects a space ("trait") in your frontend, you have to pass those changes to :code:`IdentificationKey`

.. code-block:: javascript

    identification.selectSpace(spaceIdentifier);

    identification.deselectSpace(spaceIdentifier);

The identification matrix will then be recalculated and :code:`IdentificationKey` will emit events accordingly.



Listening to Identification Events
==================================

.. code-block:: javascript

    let identification = new IdentificationKey(data);

    function onItemUpdate(event){
    }

    identification.on("itemUpdate", onItemUpdate);


.. list-table:: Events of IdentificationKey
   :widths: 25 25 50
   :header-rows: 1

   * - event
     - event data
     - description
   * - itemUpdate
     - {}
     - fired a Matrix Item changes, e.g. points or its possibility
   * - filterUpdate
     - {}
     - fired if a Matrix Filter changes, e.g. its possibility
   * - spaceUpdate
     - {}
     - fired if a Matrix Filter Space changes, e.g. its visibility
   * - itemBecamePossible
     - {}
     - fired if a Matrix Item became possible
   * - itemBecameImpossible
     - {}
     - fired if a Matrix Item became impossible
   * - filterBecameVisible
     - {}
     - fired if a Matrix Filter became visible
   * - filterBecameInvisible
     - {}
     - fired if a Matrix Filter became invisible
   * - spaceBecamePossible
     - {}
     - fired if a Matrix Filter Space became possible
   * - spaceBecameImpossible
     - {}
     - fired if a Matrix Filter Space became impossible