2.9 Guide de Migration
######################

CakePHP 2.9 est une mise à jour complète à partir de l'API de 2.8. Cette page
souligne les changements et améliorations faits dans 2.9.

Compatibilité avec PHP7
=======================

CakePHP 2.9 est compatible et testé pour PHP7.

Dépréciations
=============

* La classe ``Object`` a été dépréciée à cause des collisions possibles avec la
  version PHP7. Plus de détails ci-dessous.

Core
====

Object
------

- La classe ``Object`` a été renommée en ``CakeObject`` car `object` devient un
  mot réservé dans l'une des prochaines versions mineurs de PHP7. (voir la
  [RFC](https://wiki.php.net/rfc/reserve_even_more_types_in_php_7)).
