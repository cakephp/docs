Shell I18N
##########

La fonctionnalité i18n de CakePHP utilise les 
`fichiers po <http://en.wikipedia.org/wiki/GNU_gettext>`_ comme source de 
traduction. Cela les rend faciles à intégrer avec des outils tels que 
`poedit <http://www.poedit.net/>`_ ou d'autres outils habituels de traduction.

Le Shell de i18n fournit une façon rapide et simple de générer les fichiers 
template po. Les fichiers templates peuvent être donnés aux traducteurs afin 
qu'ils traduisent les chaînes de caractères dans votre application. Une fois 
que votre traduction est faîte, les fichiers pot peuvent être fusionnés avec 
les traductions existantes pour aider la mise à jour de vos traductions.


Générer les fichiers POT
========================

Les fichiers POT peuvent être généres pour une application existante en 
utilisant la commande ``extract``. Cette commande va scaner toutes les fonctions
de type ``__()`` de l'ensemble de votre application, et extraire les chaînes de 
caractères. Chaque chaîne unique dans votre application sera combinée en un
seul fichier POT::

    ./Console/cake i18n extract

La commande du dessus va lancer le shell d'extraction. En plus de l'extraction 
des chaînes de caractères des méthodes ``__()``, Les messages de validation des 
modèles vont aussi être extraits. Le résultat de cette commande va être la 
création du fichier ``app/Locale/default.pot``. Vous utilisez le fichier pot 
comme un template pour créer les fichiers po. Si vous créez manuellement les 
fichiers po à partir du fichier pot, pensez à bien corriger le ``Plural-Forms`` 
de la ligne d'en-tête.

Générer les fichiers POT pour les plugins
-----------------------------------------

Vous pouvez générer un fichier POT pour un plugin spécifique en faisant::

    ./Console/cake i18n extract --plugin <Plugin>

Cela générera les fichiers POT requis utilisés dans les plugins.


Créer les tables utilisées par TranslateBehavior
================================================

Le shell i18n peut aussi être utilisé pour initialiser les tables par défaut 
utilisées par :php:class:`TranslateBehavior`::

    ./Console/cake i18n initdb

Cela va créer la table ``i18n`` utilisée par le behavior Translate.


.. meta::
    :title lang=fr: I18N shell
    :keywords lang=fr: fichiers pot,locale default,traduction outils,message chaîne de caractère,app locale,php class,validation,i18n,traductions,shell,modèle
