3.2 Guide de Migration
######################

CakePHP 3.2 est une mise à jour de CakePHP 3.1 dont la compatibilité
API est complète. Cette page souligne les changements et améliorations
faits dans 3.2.

PHP 5.5 Requis au Minimum
=========================

CakePHP 3.2 requiert au moins PHP 5.5. En adoptant PHP 5.5, nous pouvons fournir
des librairies de Date et de Time et retirer les dépendances qui concernent les
librairies de compatibilité pour les mots de passe.

Helpers
=======

Les helpers peuvent maintenant avoir une méthode hook ``initialize(array $config)`` comme tous les autres types de classe.

CorsBuilder Ajouté
==================

Afin de faciliter la définition des en-têtes liés aux Requêtes de type
Cross-site (Cross Origin Requests = CORS), un nouveau ``CorsBuilder`` a été
ajouté. Cette classe vous laisse définir les en-têtes liés au CORS avec une
interface simple. Consultez :ref:`cors-headers` pour plus d'informations.
