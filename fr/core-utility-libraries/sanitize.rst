Assainissement des Données (Data Sanitization)
##############################################

La classe ``Sanitize`` est dépréciée depuis 2.4, et sera retirée dans CakePHP
3.0. Au lieu d'utiliser la classe Sanitize, vous pouvez accomplir les mêmes
tâches en utilisant d'autres parties de CakePHP, les fonctions PHP natives, ou
d'autres librairies.

Filtre d'Entrées
================

Plutôt que d'utiliser les fonctionnalités de filtre d'entrée destructive de la
classe Sanitize, vous devriez plutôt le faire avec
:doc:`/models/data-validation` pour les données utilisateur que votre
application accepte. En rejetant les entrées invalides, vous pouvez souvent
retirer le besoin de modifier destructivement les données utilisateur. Vous
pouvez aussi avoir envie de regarder à l'
`extension de filtre PHP <https://secure.php.net/filter>`_ dans les situations où vous
aurez besoin de modifier les entrées utilisateur.

Accepter le HTML soumis par l'utilisateur
=========================================

Souvent, le filtre d'entrées est utilisé quand on veut accepter le HTML soumis
par l'utilisateur. Dans ces situations, il est mieux d'utiliser une librairie
dédiée comme ` le Purificateur de HTML
<http://htmlpurifier.org/>`_.

Echappement de SQL
==================

CakePHP gère l'échappement de pour tous les paramètres de
:php:meth:`Model::find()` et :php:meth:`Model::save()`. Dans le rare cas où
vous avez besoin de construire le SQL à la main, en utilisant l'entrée
utilisateur, vous devriez utiliser :ref:`prepared-statements`.
