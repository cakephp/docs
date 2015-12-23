3.2 Guide de Migration
######################

CakePHP 3.2 est une mise à jour de CakePHP 3.1 dont la compatibilité
API est complète. Cette page souligne les changements et améliorations
faits dans 3.2.

PHP 5.5 Requis au Minimum
=========================

CakePHP 3.2 requiert au moins PHP 5.5.8. En adoptant PHP 5.5, nous pouvons fournir
des librairies de Date et de Time et retirer les dépendances qui concernent les
librairies de compatibilité pour les mots de passe.

Carbon Remplacé par Chronos
===========================

La librairie Carbon a été remplacée par :doc:`cakephp/chronos </chronos>`. Cette
nouvelle librairie est un fork de Carbon sans aucune dépendance additionnelle.
Elle offre également un objet date calendaire, et une version immutable des
objets date et datime.

Helpers
=======

Les helpers peuvent maintenant avoir une méthode hook ``initialize(array $config)`` comme tous les autres types de classe.

Nouvel Objet Date
=================

La classe ``Date`` vous permet de mapper proprement les colonnes ``DATE`` vers
des objets PHP. Les instances de Date définiront toujours leur heure à
``00:00:00 UTC``. par défaut, l'ORM crée maintenant des instances de ``Date``
lorsqu'il mappe des colonnes ``DATE``.

Nouveaux Objets Immutables Date et Time
=======================================

Les classes ``FrozenTime`` et ``FrozenDate`` ont été ajoutées. Ces classes
offrent la même API que l'objet ``Time``. Les classes "frozen" (gelées)
fournissent des variantes immutables de ``Time`` et ``Date``. En utilisant les
objets immutables, vous pouvez éviter les mutations accidentelles. Au lieu de
modifications directes, les méthodes de modification renvoient de *nouvelles*
instances::

    use Cake\I18n\FrozenTime;

    $time = new FrozenTime('2016-01-01 12:23:32');
    $newTime = $time->modify('+1 day');

Dans le code ci-dessus, ``$time`` et ``$newTime`` sont des objets différents.
L'objet ``$time`` garde sa valeur originale alors que ``$newTime`` contient la
valeur modifiée. Pour plus d'informations, référez-vous à la section sur les
:ref:`Temps Immutables <immutable-time>`. A partir de 3.2, l'ORM peut mapper les
colonnes date/datetime vers des objets immutables. Regardez la section
:ref:`immutable-datetime-mapping` pour plus d'informations.

CorsBuilder Ajouté
==================

Afin de faciliter la définition des en-têtes liés aux Requêtes de type
Cross-site (Cross Origin Requests = CORS), un nouveau ``CorsBuilder`` a été
ajouté. Cette classe vous laisse définir les en-têtes liés au CORS avec une
interface simple. Consultez :ref:`cors-headers` pour plus d'informations.

ORM
---

* Faire un contain avec la même association plusieurs fois fonctionne maintenant
  de la façon esperée, et les fonctions du constructeur de requête sont
  maintenant empilées.
