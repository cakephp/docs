Shell I18N
##########

La fonctionnalité i18n de CakePHP utilise les
`fichiers po <https://en.wikipedia.org/wiki/GNU_gettext>`_ comme source de
traduction. Cela les rend faciles à intégrer avec des outils tels que
`poedit <http://www.poedit.net/>`_ ou d'autres outils habituels de traduction.

Le Shell de i18n fournit une façon rapide et simple de générer les fichiers
template po. Les fichiers templates peuvent être donnés aux traducteurs afin
qu'ils traduisent les chaînes de caractères dans votre application. Une fois
que votre traduction est faîte, les fichiers pot peuvent être fusionnés avec
les traductions existantes pour aider la mise à jour de vos traductions.

Générer les fichiers POT
========================

Les fichiers POT peuvent être générés pour une application existante en
utilisant la commande ``extract``. Cette commande va scanner toutes les
fonctions de type ``__()`` de l'ensemble de votre application, et extraire les
chaînes de caractères. Chaque chaîne unique dans votre application sera
combinée en un seul fichier POT::

    ./Console/cake i18n extract

La commande du dessus va lancer le shell d'extraction. En plus de l'extraction
des chaînes de caractères des méthodes ``__()``, les messages de validation des
models vont aussi être extraits. Le résultat de cette commande va être la
création du fichier ``app/Locale/default.pot``. Vous utilisez le fichier pot
comme un template pour créer les fichiers po. Si vous créez manuellement les
fichiers po à partir du fichier pot, pensez à bien corriger le ``Plural-Forms``
de la ligne d'en-tête.

Générer les fichiers POT pour les plugins
-----------------------------------------

Vous pouvez générer un fichier POT pour un plugin spécifique en faisant::

    ./Console/cake i18n extract --plugin <Plugin>

Cela générera les fichiers POT requis utilisés dans les plugins.

Messages de Validation de Model
-------------------------------

Vous pouvez définir le domaine à utiliser pour les messages de validation
extraits dans vos models. Si le model a toujours une propriété
``$validationDomain``, le domaine de validation donnée va être ignoré::

    ./Console/cake i18n extract --validation-domain validation_errors

Vous pouvez aussi éviter que le shell n'extraie des messages de validation::

    ./Console/cake i18n extract --ignore-model-validation


Exclure les fichiers
--------------------

Vous pouvez passer une liste de dossiers séparée par une virgule que vous
souhaitez exclure. Tout chemin contenant une partie de chemin avec les valeurs
fournies sera ignoré::

    ./Console/cake i18n extract --exclude Test,Vendor

Eviter l'écrasement des avertissements pour les fichiers POT existants
----------------------------------------------------------------------
.. versionadded:: 2.2

En ajoutant ``--overwrite``, le script de shell ne va plus vous avertir si un
fichier POT existe déjà et va écraser par défaut::

    ./Console/cake i18n extract --overwrite

Extraire les messages des librairies du coeur de CakePHP
--------------------------------------------------------
.. versionadded:: 2.2

Par défaut, le script de shell d'extraction va vous demander si vous souhaitez
extraire les messages utilisés dans les librairies du coeur de CakePHP.
Définissez ``--extract-core`` à ``yes`` ou ``no`` pour définir le comportement
par défaut.

::

    ./Console/cake i18n extract --extract-core yes

    ou

    ./Console/cake i18n extract --extract-core no

Créer les tables utilisées par TranslateBehavior
================================================

Le shell i18n peut aussi être utilisé pour initialiser les tables par défaut
utilisées par :php:class:`TranslateBehavior`::

    ./Console/cake i18n initdb

Cela va créer la table ``i18n`` utilisée par le behavior Translate.


.. meta::
    :title lang=fr: I18N shell
    :keywords lang=fr: fichiers pot,locale default,traduction outils,message chaîne de caractère,app locale,php class,validation,i18n,traductions,shell,modèle
