3.8.4 Behavior callbacks
------------------------

Model Behaviors can define a number of callbacks that are triggered
before/after the model callbacks of the same name. Behavior
callbacks allow your behaviors to capture events in attached models
and augment the parameters or splice in additional behavior.



The available callbacks are:


-  ``beforeValidate`` is fired before a model's beforeValidate
-  ``beforeFind`` is fired before a model's beforeFind
-  ``afterFind`` is fired before a model's afterFind
-  ``beforeSave`` is fired before a model's beforeSave
-  ``afterSave`` is fired before a model's afterSave
-  ``beforeDelete`` is fired after a model's beforeDelete
-  ``afterDelete`` is fired before a model's afterDelete
