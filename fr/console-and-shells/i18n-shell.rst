Shell I18N
##########

Les fonctionnalités i18n de CakePHP utilisent les
`fichiers po <http://fr.wikipedia.org/wiki/GNU_gettext>`_ comme source de
traduction. Cela les rend facile à intégrer avec des outils tels que
`poedit <http://www.poedit.net/>`_ ou d'autres outils habituels de traduction.

Le Shell i18n est une façon rapide et simple de générer des fichiers de
template po. Les fichiers de template peuvent être donnés aux traducteurs afin
qu'ils traduisent les chaînes de caractères dans votre application. Une fois
que votre traduction est faîte, les fichiers pot peuvent être fusionnés avec
les traductions existantes pour aider la mise à jour de vos traductions.

Générer les Fichiers POT
========================

Les fichiers POT peuvent être générés pour une application existante en
utilisant la commande ``extract``. Cette commande va scanner toutes les
fonctions de type ``__()`` de l'ensemble de votre application et extraire les
chaînes de caractères. Chaque chaîne unique dans votre application sera
combinée en un seul fichier POT::

    bin/cake i18n extract

La commande ci-dessus va lancer le shell d'extraction. Le résultat de cette
commande va être la création du fichier **src/Locale/default.pot**. Vous
utilisez le fichier pot comme un template pour créer les fichiers po. Si vous
créez manuellement les fichiers po à partir du fichier pot, pensez à bien
corriger le ``Plural-Forms`` de la ligne d'en-tête.

Générer les Fichiers POT pour les Plugins
-----------------------------------------

Vous pouvez générer un fichier POT pour un plugin spécifique en faisant::

    bin/cake i18n extract --plugin <Plugin>

Cela générera les fichiers POT requis utilisés dans les plugins.

Extraire de plusieurs dossiers à la fois
----------------------------------------

Vous pouvez parfois avoir besoin d'extraire des chaînes depuis plus d'un
dossier de votre application. Par exemple, si vous définissez des chaînes à
traduire dans le dossier ``config`` de votre application, vous voudrez
probablement extraire les chaînes de ce dossier en plus de celles du dossier
``src``. Vous pouvez le faire en utilisant l'option ``--paths``. Elle accepte
une liste de chemins absolus séparés par une virgule::

    bin/cake i18n extract --paths /var/www/app/config,/var/www/app/src

Exclure les fichiers
--------------------

Vous pouvez passer une liste de dossiers séparées par une virgule que vous
souhaitez exclure. Tout chemin contenant une partie de chemin avec les valeurs
fournies sera ignoré::

    bin/cake i18n extract --exclude Test,Vendor

Eviter l'Écrasement des Avertissements pour les Fichiers POT Existants
----------------------------------------------------------------------

En ajoutant ``--overwrite``, le script de shell ne va plus vous avertir si un
fichier POT existe déjà et va écraser par défaut::

    bin/cake i18n extract --overwrite

Extraire les Messages des Librairies du Cœur de CakePHP
-------------------------------------------------------

Par défaut le script de shell d'extraction va vous demander si vous souhaitez
extraire les messages utilisés dans les librairies du cœur de CakePHP.
Définissez ``--extract-core`` à yes ou no pour définir le comportement par
défaut::

    bin/cake i18n extract --extract-core yes

    // ou

    bin/cake i18n extract --extract-core no

.. meta::
    :title lang=fr: I18N shell
    :keywords lang=fr: fichiers pot,locale default,traduction outils,message chaîne de caractère,app locale,php class,validation,i18n,traductions,shell,modèle
