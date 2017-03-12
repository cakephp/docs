.. _upgrade-shell:

Mise à jour shell
#################

La mise à jour shell va faire quasiment tout le boulot pour mettre à jour vos
applications cakePHP de la version 1.3 à 2.0.

Pour lancer la mise à jour::

    ./Console/cake upgrade all

Si vous voulez voir ce que le shell va faire sans modifier les fichiers,
faîtes d'abord une exécution à blanc avec --dry-run::

    ./Console/cake upgrade all --dry-run

Pour mettre à jour vos Plugins, lancer la commande::

    ./Console/cake upgrade all --plugin YourPluginName

Il est aussi possible de lancer chaque mise à jour individuellement. Pour voir
toutes les étapes possibles, lancez la commande::

    ./Console/cake upgrade --help

Ou allez voir les
`docs de l'API <https://api.cakephp.org/2.x/class-UpgradeShell.html>`_
pour plus d'informations:

Mise à jour de votre App
------------------------

Vous trouverez ici un guide pour vous aider à mettre à jour votre
application CakePHP 1.3 vers cakePHP 2.x en utilisant le shell upgrade.
La structure de dossiers de votre application 1.3 ressemble à cela::

    monsiteweb/
        app/             <- Votre App
        cake/            <- Version de CakePHP 1.3
        plugins/
        vendors/
        .htaccess
        index.php

La première étape est de télécharger (ou de faire ``git clone``) la nouvelle
version de CakePHP dans un autre dossier en dehors de votre dossier
``monsiteweb``, que nous appellerons ``cakephp``. Nous ne souhaitons pas que
le dossier téléchargé ``app`` écrase votre dossier app. Maintenant, il est
grand temps de faire une sauvegarde de votre dossier app,
par exemple:``cp -R app app-backup``.

Copiez le dossier ``cakephp/lib`` dans votre dossier ``monsiteweb/lib`` pour
mettre à jour la nouvelle version de CakePHP dans votre app, par exemple :
``cp -R ../cakephp/lib .``.
Symlinking est aussi une bonne alternative pour copier, 
par exemple.: ``ln -s /var/www/cakephp/lib``. 

Avant de lancer notre shell de mise à jour, nous avons aussi besoin des
nouveaux scripts de console. Copiez le dossier ``cakephp/app/Console`` dans le
dossier ``monsiteweb/app``, exemple.:
``cp -R ../cakephp/app/Console ./app``.

La structure de votre dossier devrait ressembler à cela maintenant::

    monsiteweb/
        app/              <- Votre App
            Console/      <- Dossiers Copiés app/Console
        app-backup/       <- Sauvegarde de votre App
        cake/             <- 1.3 Version de CakePHP
        lib/              <- 2.x Version de CakePHP
            Cake/
        plugins/
        vendors/
        .htaccess
        index.php

Maintenant nous pouvons lancer la mise à jour shell en tapant ``cd`` puis le
chemin vers votre app et en lançant la commande::

    ./Console/cake upgrade all

Cela fera la **plupart** du travail pour mettre à jour votre app vers 2.x.
Vérifiez dans votre dossier ``app`` mis à jour. Si tout a l'air bien, félicitez
vous vous-mêmes et supprimez votre dossier ``mywebsite/cake``. Bienvenue dans
la version 2.x!


.. meta::
    :title lang=fr: .. _upgrade-shell:
    :keywords lang=fr: api docs,shell
