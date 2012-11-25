Méthodes et Propriétés supplémentaires
######################################

Bien que les fonctions de model de CakePHP devraient vous emmener là où vous 
souhaitez aller, n'oubliez pas que les classes de models ne sont rien de plus 
que cela : des classes qui vous permettent d'écrire vos propres méthodes ou de 
définir vos propres propriétés.

N'importe quelle opération qui prend en charge la sauvegarde ou la restitution 
de données est mieux située dans vos classes de model. Ce concept est souvent 
appelé fat model ("model gras").

::

    class Exemple extends AppModel {
        public function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

Cette méthode ``getRecent()`` peut maintenant être utilisée dans le controller.

::

    $recent = $this->Exemple->getRecent();

:php:meth:`Model::associations()`
=================================

Obtenir les associations::

    $result = $this->Exemple->associations();
    // $result équivaut à array('belongsTo', 'hasOne', 'hasMany', 'hasAndBelongsToMany')

:php:meth:`Model::buildQuery(string $type = 'first', array $query = array())`
=============================================================================

Construit la requête tableau qui est utilisée par la source de données pour 
générer la requête pour récupérer les données.

:php:meth:`Model::deconstruct(string $field, mixed $data)`
==========================================================

Déconstruit un type de données complexe (tableau ou objet) dans une valeur de 
champ unique.

:php:meth:`Model::escapeField(string $field = null, string $alias = null)`
==========================================================================

Echappe le nom du champ et ajoute le nom du model. L'echappement est fait en 
fonction des règles du driver de la base de données courante.

:php:meth:`Model::exists($id)`
==============================

Retourne true si l'enregistrement avec un ID particulier existe.

Si l'ID n'est pas fourni, elle appelle :php:meth:`Model::getID()` pour obtenir 
l'ID de l'enregistrement courant pour vérifier, et execute ensuite un 
``Model::find('count')`` sur la source de données actuellement configurée pour 
vérifier l'existence de l'enregistrement dans un stockage persistant.
.. note ::

    Le Paramètre $id a été ajouté dans 2.1. Avant cela, elle ne prenait aucun
    paramètre.

::

    $this->Exemple->id = 9;
    if ($this->Exemple->exists()) {
        // ...
    }

    $exists = $this->Foo->exists(2);

:php:meth:`Model::getAffectedRows()`
====================================

Retourne le nombre de lignes affectées par la dernière requête.

:php:meth:`Model::getAssociated(string $type = null)`
=====================================================

Récupère tous les models avec lesquels ce model est associé.

:php:meth:`Model::getColumnType(string $column)`
================================================

Retourne le type de colonne d'une colonne du model.

:php:meth:`Model::getColumnTypes()`
===================================

Retourne un tableau associatif des noms de champs et des types de colonnes.

:php:meth:`Model::getID(integer $list = 0)`
===========================================

Retourne l'ID de l'enregistrement courant.

:php:meth:`Model::getInsertID()`
================================

Retourne l'ID du dernier enregistrement que ce model insère.

:php:meth:`Model::getLastInsertID()`
====================================

Alias pour ``getInsertID()``.


.. meta::
    :title lang=fr: Méthodes et Propriétés supplémentaires
    :keywords lang=fr: classes de model,fonctions du model,classe de model,interval,tableau
