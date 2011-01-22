3.9.1 Basic API For DataSources
-------------------------------

A datasource can, and *should* implement at least one of the
following methods: ``create``, ``read``, ``update`` and/or
``delete`` (the actual method signatures & implementation details
are not important for the moment, and will be described later). You
need not implement more of the methods listed above than necessary
- if you need a read-only datasource, there's no reason to
implement ``create``, ``update``, and ``delete``.



Methods that must be implemented


-  ``describe($model)``
-  ``listSources()``
-  At least one of:
   
   -  ``create($model, $fields = array(), $values = array())``
   -  ``read($model, $queryData = array())``
   -  ``update($model, $fields = array(), $values = array())``
   -  ``delete($model, $id = null)``


It is also possible (and sometimes quite useful) to define the
``$_schema`` class attribute inside the datasource itself, instead
of in the model.

And that's pretty much all there is to it. By coupling this
datasource to a model, you are then able to use
``Model::find()/save()`` as you would normally, and the appropriate
data and/or parameters used to call those methods will be passed on
to the datasource itself, where you can decide to implement
whichever features you need (e.g. Model::find options such as
``'conditions'`` parsing, ``'limit'`` or even your own custom
parameters).
