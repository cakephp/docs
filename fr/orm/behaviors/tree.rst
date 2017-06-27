Tree
####

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TreeBehavior

Il est courant de vouloir stocker des données hiérarchisées dans une table de
base de données. Des exemples de ce type de données pourrait être des catégories
sans limite de sous-catégories, les données liées à un système de menu
multi-niveau ou une représentation littérale de la hiérarchie comme un
département dans une entreprise.

Les bases de données relationnelles ne sont couramment pas utilisées pour le
stockage et la récupération de ce type de données, mais il y a quelques
techniques connues qui les rendent possible pour fonctionner avec une
information multi-niveau.

Le TreeBehavior vous aide à maintenir une structure de données hiérarchisée
dans la base de données qui peut être requêtée facilement et aide à reconstruire
les données en arbre pour trouver et afficher les processus.

Pré-Requis
==========

Ce behavior nécessite que les colonnes suivantes soient présentes dans votre
table:

- ``parent_id`` (nullable) La colonne contenant l'ID de la ligne parente
- ``lft`` (integer, signed) Utilisé pour maintenir la structure en arbre
- ``rght`` (integer, signed) Utilisé pour maintenir la structure en arbre

Vous pouvez configurer le nom de ces champs.
Plus d'informations sur la signification des champs et comment ils sont utilisés
peuvent être trouvées dans cet article décrivant la
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_

.. warning::

    TreeBehavior ne supporte pas les clés primaires composites pour le moment.

Un Aperçu Rapide
================

Vous activez le behavior Tree en l'ajoutant à la Table où vous voulez stocker
les données hiérarchisées dans::

    class CategoriesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Tree');
        }
    }

Une fois ajoutées, vous pouvez laisser CakePHP construire la structure interne
si la table contient déjà quelques lignes::

    $categories = TableRegistry::get('Categories');
    $categories->recover();

Vous pouvez vérifier que cela fonctionne en récupérant toute ligne de la table
et en demandant le nombre de descendants qu'il a::

    $node = $categories->get(1);
    echo $categories->childCount($node);

Obtenir une liste aplatie des descendants pour un nœud est également facile::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

Si à la place, vous avez besoin d'une liste liée, où les enfants pour
chaque nœud sont imbriqués dans une hiérarchie, vous pouvez utiliser le
finder 'threaded'::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} has " . count($child->children) . " direct children";
    }

Traverser les résultats threaded nécessitent habituellement des fonctions
récursives, mais si vous avez besoin seulement d'un ensemble de résultats
contenant un champ unique à partir de chaque niveau pour afficher une liste,
dans un select HTML par exemple, il est préférable d'utiliser le finder
'treeList'::

    $list = $categories->find('treeList');

    // Dans un fichier template de CakePHP:
    echo $this->Form->control('categories', ['options' => $list]);

    // Ou vous pouvez l'afficher en texte, par exemple dans un script de CLI
    foreach ($list as $categoryName) {
        echo $categoryName . "\n";
    }

La sortie sera similaire à ceci::

    My Categories
    _Fun
    __Sport
    ___Surfing
    ___Skating
    _Trips
    __National
    __International

Le finder ``treeList`` accepte un certain nombre d'options:

* ``keyPath``: Le chemin séparé par des points pour récupérer le champ à
  utiliser en clé de tableau, ou une closure qui retourne la clé de la ligne
  fournie.
* ``valuePath``: Le chemin séparé par des points pour récupérer le champ à
  utiliser en valeur de tableau, ou une closure qui retourne la valeur de la
  ligne fournie.
* ``spacer``: Une chaîne de caractères utilisée en tant que préfixe pour
  désigner la profondeur dans l'arbre pour chaque item.

Un exemple d'utilisation de toutes les options serait::

    $query = $categories->find('treeList', [
        'keyPath' => 'url',
        'valuePath' => 'id',
        'spacer' => ' '
    ]);

Une tâche classique est de trouver le chemin de l'arbre à partir d'un nœud en
particulier vers la racine de l'arbre. C'est utile, par exemple, pour ajouter
la liste des breadcrumbs pour une structure de menu::

    $nodeId = 5;
    $crumbs = $categories->find('path', ['for' => $nodeId]);

    foreach ($crumbs as $crumb) {
        echo $crumb->name . ' > ';
    }

Les arbres construits avec TreeBehavior ne peuvent pas être triés avec d'autres
colonnes que ``lft``, ceci parce que la représentation interne de l'arbre
dépend de ce tri. Heureusement, vous pouvez réorganiser les nœuds à
l'intérieur du même niveau dans avoir à changer leur parent::

    $node = $categories->get(5);

    // Déplace le nœud pour qu'il monte d'une position quand on liste les enfants.
    $categories->moveUp($node);

    // Déplace le nœud vers le haut de la liste dans le même niveau.
    $categories->moveUp($node, true);

    // Déplace le nœud vers le bas.
    $categories->moveDown($node, true);

Configuration
=============

Si les noms de colonne par défaut qui sont utilisés par ce behavior ne
correspondent pas à votre schéma, vous pouvez leur fournir des alias::

    public function initialize(array $config)
    {
        $this->addBehavior('Tree', [
            'parent' => 'ancestor_id', // Utilise ceci plutôt que parent_id,
            'left' => 'tree_left', // Utilise ceci plutôt que lft
            'right' => 'tree_right' // Utilise ceci plutôt que rght
        ]);
    }

Niveau des Nœuds (profondeur)
=============================

Connaître la profondeur d'une structure arbre peut être utile lorsque vous
voulez récupérer des nœuds jusqu'à un certain niveau uniquement par exemple
lorsque pour générer un menu. Vous pouvez utiliser l'option ``level`` pour
spécifier les champs qui sauvegarderont la profondeur de chaque nœud::

    $this->addBehavior('Tree', [
        'level' => 'level', // Defaults to null, i.e. no level saving
    ]);

Si vous ne souhaitez pas mettre en cache le niveau en utilisant un champ
de base de données, vous pouvez utiliser la méthode ``TreeBehavior::getLevel()``
pour connaître le niveau d'un nœuds.

Scoping et Arbres Multiples
===========================

Parfois vous voulez avoir plus d'une structure d'arbre dans la même table, vous
pouvez arriver à faire ceci en utilisant la configuration 'scope'. Par exemple,
dans une table locations vous voudrez créer un arbre par pays::

    class LocationsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Tree', [
                'scope' => ['country_name' => 'Brazil']
            ]);
        }

    }

Dans l'exemple précédent, toutes les opérations sur l'arbre seront scoped
seulement pour les lignes ayant la colonne ``country_name`` défini à 'Brazil'.
Vous pouvez changer le scoping à la volée en utilisant la fonction 'config'::

    $this->behaviors()->Tree->config('scope', ['country_name' => 'France']);

En option, vous pouvez avoir un contrôle plus fin du scope en passant une
closure au scope::

    $this->behaviors()->Tree->config('scope', function ($query) {
        $country = $this->getConfigureContry(); // A made-up function
        return $query->where(['country_name' => $country]);
    });

Récupération avec un Tri Personnalisé du Champ
==============================================

.. versionadded:: 3.0.14

Par défaut, recover() trie les items en utilisant la clé primaire. Ceci
fonctionne bien s'il s'agit d'une colonne numérique (avec incrémentation auto),
mais cela peut entraîner des résultats étranges si vous utilisez les UUIDs.

Si vous avez besoin de tri personnalisé pour la récupération, vous pouvez
définir une clause order personnalisée dans votre config::

        $this->addBehavior('Tree', [
            'recoverOrder' => ['country_name' => 'DESC'],
        ]);

Sauvegarder les Données Hiérarchisées
=====================================

Quand vous utilisez le behavior Tree, vous n'avez habituellement pas besoin
de vous soucier de la représentation interne de la structure hiérarchisée. Les
positions où les nœuds sont placés dans l'arbre se déduisent de la colonne
'parent_id' dans chacune de vos entities::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = 5;
    $categoriesTable->save($aCategory);

Fournir des ids de parent non existant lors de la sauvegarde ou tenter de
créer une boucle dans l'arbre (faire un nœud enfant de lui-même) va lancer
une exception.

Vous pouvez faire un nœud à la racine de l'arbre en configurant la colonne
'parent_id' à null::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = null;
    $categoriesTable->save($aCategory);

Les enfants pour un nouveau nœud à la racine seront préservés.

Supprimer les Nœuds
===================

Supprimer un nœud et tout son sous-arbre (tout enfant qu'il peut avoir à tout
niveau dans l'arbre) est facile::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->delete($aCategory);

TreeBehavior va s'occuper de toutes les opérations internes de suppression.
Il est aussi possible de supprimer seulement un nœud et de réassigner tous les
enfants au nœud parent immédiatement supérieur dans l'arbre::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->removeFromTree($aCategory);
    $categoriesTable->delete($aCategory);

Tous les nœuds enfant seront conservés et un nouveau parent leur sera assigné.

La suppression d'un noeud est basée sur les valeurs lft et rght de l'entity.
C'est important de le noter quand on fait une boucle des différents enfants
d'un noeud pour des suppressions conditionnelles::

    $descendants = $teams->find('children', ['for' => 1]);

    foreach ($descendants as $descendant) {
        $team = $teams->get($descendant->id); // cherche l'objet entity mis à jour
        if ($team->expired) {
            $teams->delete($team); // la suppression re-trie les entrées lft et rght de la base de données
        }
    }

TreeBehavior re-trie les valeurs lft et rght des enregistrements de la table
quand un noeud est supprimé. Telles quelles, les valeurs lft et rght des
entities dans ``$descendants`` (sauvegardées avant l'opération de suppression)
seront erronées. Les entities devront être chargées et modifiées à la volée
pour éviter les incohérences dans la table.
