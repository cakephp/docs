2.10 Guide de Migration
#######################

CakePHP 2.10 est une mise à jour complète à partir de l'API de 2.9. Cette page
souligne les changements et améliorations faits dans 2.10.

Core
====

* La constante ``CONFIG`` a été ajoutée. Par défaut, elle vaut ``app/Config``.
  Sa création vise à faciliter la compatibilité avec 3.x en cas de migration.

Model
=====

* De nouveaux types de données interne ont été ajoutés pour ``smallinteger`` et
  ``tinyinteger``. Les colonnes existantes en ``SMALLINT`` et ``TINYINT`` seront
  maintenant retournées avec ces nouveaux types. Les colonnes en ``TINYINT(1)``
  continueront à être traitées comme des booléens dans MySQL.
* ``Model::find()`` supporte maintenant des options ``having`` et ``lock`` qui
  vous permettent d'ajouter des clauses ``HAVING`` et ``FOR UPDATE`` pour vos
  opérations de recherches.
* ``TranslateBehavior`` supporte maintenant le chargement de traductions via un
  LEFT JOIN. Utilisez l'option ``joinType`` pour utiliser cette fonctionnalité.

Components
==========

* ``SecurityComponent`` émet maintenant plus de messages d'erreur quand le form
  tampering ou la protection CSRF échoue en mode debug. Cette fonctionnalité
  a été backportée de la version 3.x.
* ``SecurityComponent`` annulera (via le blackhole) les requêtes POST qui n'ont pas
  de données. Ce changement permet de protéger les actions qui crée des enregistrements
  en base en utilisant seulement les valeurs par défaut des tables de la base.
* ``FlashComponent`` empile maintenant les messages de même type. Il s'agit
  d'une fonctionnalité importée de 3.X. Pour désactiver ce comportement,
  ajoutez ``'clear' => true`` à la configuration du ``FlashComponent``.
* ``PaginatorComponent`` supporte maintenant les paginators multiples via
  l'option ``queryScope``. Utiliser cette option lorsque vous paginez des données
  forcera le ``PaginatorComponent`` a lire les données depuis les paramètres 'scopés'
  de la rquête plutôt que les données de la requête mère.

Helpers
=======

* ``HtmlHelper::image()`` supporte maintenant l'option ``base64``. Cette option
  va lire les fichiers image locaux et créer des URIs de données base64.
* ``HtmlHelper::addCrumb()`` supporte maintenant l'option ``prepend``. Elle
  vous permet de préfixer un breadcrumb plutôt que d'ajouter à la liste.
* ``FormHelper`` crée des inputs 'numeric' pour les types ``smallinteger`` et
  ``tinyinteger`` types.

Routing
=======

* ``Router::reverseToArray()`` a été ajoutée.