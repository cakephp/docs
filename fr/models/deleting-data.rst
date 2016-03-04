Supprimer des Données
#####################

La classe Model de CakePHP offre de nombreuses façons de supprimer des
enregistrements de votre base de données.

.. _model-delete:

delete
======

``delete(integer $id = null, boolean $cascade = true);``

Supprime l'enregistrement identifié par $id. Par défaut, supprime également les
enregistrements dépendants de l'enregistrement mentionné comme devant être
supprimé.

Par exemple, lors de la suppression d'un enregistrement User lié à plusieurs
enregistrements Recipe (User 'hasMany' ou 'hasAndBelongsToMany' Recipes):

    - si $cascade est fixée à true, les entrées Recipe liées sont aussi
      supprimées si les valeurs "dependant" des models sont à true.
    - si $cascade est fixée à false, les entrées Recipe resteront après que
      l'User a été supprimé.

Si votre base de données permet les clés étrangères et les suppressions en
cascade, il est souvent plus efficace de les utiliser plutôt que le cascade
de CakePHP. Le seul bénéfice pour l'utilisation de la fonctionnalité de cascade
de ``Model::delete()`` est qu'elle vous permet d'influencer les callbacks des
behaviors et des Models::

    $this->Comment->delete($this->request->data('Comment.id'));

Vous pouvez brancher une logique personnalisée dans le processus de suppression
à l'aide des callbacks ``beforeDelete`` et ``afterDelete`` présents dans les
deux Models et Behaviors. Allez voir :doc:`/models/callback-methods` pour plus
d'informations.

.. note::

    Si vous supprimez un enregistrement avec des enregistrements dépendants et
    que l'un des callbacks de suppression, par exemple ``beforeDelete`` retourne
    ``false``, il ne va pas stopper l'event de propagation suivant ni changer
    la valeur de retour du ``delete`` initial.

.. _model-deleteall:

deleteAll
=========

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

``deleteAll()`` est identique à ``delete()``, sauf que ``deleteAll()``
supprimera tous les enregistrements qui matchent les conditions fournies. Le
tableau ``$conditions`` doit être fourni en tant que fragment ou tableau SQL.

* **conditions** Conditions pour matcher.
* **cascade** Booléen, Mis à true pour supprimer les enregistrements qui
  dépendent de cet enregistrement.
* **callbacks** Booléen, Lance les callbacks

Retourne un booléen true en cas de succès, false en cas d'échec.

Exemple::

    // Suppression avec un tableau de conditions similaires à find()
    $this->Comment->deleteAll(array('Comment.spam' => true), false);

Si vous supprimez avec soit callbacks et/ou cascade, les lignes seront trouvées
et ensuite supprimées. Cela impliquera souvent plus de requêtes faîtes. Les
associations vont être réinitialisées avant que les enregistrements
correspondants ne soient supprimés dans deleteAll(). Si vous utilisez
bindModel() ou unbindModel() pour changer les associations, vous devrez définir
**reset** à ``false``.

.. note::

    deleteAll() retournera true même si aucun enregistrement n'est supprimé,
    puisque les conditions pour la requête de suppression est un succès et
    qu'aucun enregistrement correspondant ne reste.


.. meta::
    :title lang=fr: Supprimer des Données
    :keywords lang=fr: modèles doc,logique custom,méthodes callback,classe model,modèle de base de données,callbacks,modèle information,request data,deleteall,fragment,leverage,tableau,cakephp,échec,recettes,bénéfice,suppression,modèle de données
