2.10 Guide de Migration
#######################

CakePHP 2.10 est une mise à jour complète à partir de l'API de 2.9. Cette page
souligne les changements et améliorations faits dans 2.10.

Components
==========

* ``SecurityComponent`` émet maintenant plus de messages d'erreur quand le form
  tampering ou la protection CSRF échoue en mode debug. Cette fonctionnalité
  a été backportée de la version 3.x.
  from 3.x

Helpers
=======

* ``HtmlHelper::image()`` supporte maintenant l'option ``base64``. Cette option
  va lire les fichiers image locaux et créer des URIs de données base64.
