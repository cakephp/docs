Guide de mise à jour pour la version 4.0
########################################

Tout d'abord, vérifiez que votre application fonctionne sur la dernière version de CakePHP 3.x.

.. note::
    L'outil de mise à jour ne fonctionne que sur les applications exécutées sur la dernière version de CakePHP 3.x.
    Vous ne pouvez pas exécuter l'outil de mise à jour après la mise à jour vers CakePHP 4.0.

Corrigez les avertissements de dépréciation
===========================================

Une fois que votre application s'exécute sur la dernière version de CakePHP 3.x, activez les avertissements
d'obsolescence dans **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL,
    ]


Maintenant que vous pouvez voir tous les avertissements, assurez-vous qu'ils sont corrigés avant de procéder
à la mise à niveau.

Passez à PHP 7.2
==================

Si vous n'utilisez pas **PHP 7.2 or higher**, vous devrez mettre à jour PHP avant de mettre à jour CakePHP.

.. note::
    CakePHP 4.0 nécessite **a minimum of PHP 7.2**.

.. _upgrade-tool-use:

Utilisez l'outil de mise à niveau
=================================

Parce que CakePHP 4 adopte le mode strict et utilise plus de typehinting, il existe de nombreuses
modifications incompatibles avec les versions précédentes concernant les signatures de méthode et
les renommages de fichiers. Pour accélérer la résolution de ces modifications fastidieuses,
il existe un outil CLI de mise à niveau:

.. warning::
    La commande ``file_rename`` et les règles de l'outil rector for cakephp40, et phpunit80
    sont destinés à être exécutés **avant** que vous n'effectuiez la mise à jour des
    dépendances de votre application vers 4.0. Les règles du recteur ``cakephp40``
    ne fonctionneront pas correctement si votre application a déjà ses dépendances mises à jour
    vers 4.x ou PHPUnit8.

.. code-block:: console

    # Installe l'outil d'upgrade
    git clone https://github.com/cakephp/upgrade
    cd upgrade
    git checkout 4.x
    composer install --no-dev


Une fois l'outil de mise à niveau installé, vous pouvez maintenant l'exécuter sur votre application
ou votre plugin:

.. code-block:: console

    # Renomme les fichiers locaux
    bin/cake upgrade file_rename locales <path/to/app>

    # Renomme les fichiers de template
    bin/cake upgrade file_rename templates <path/to/app>

Une fois que vous avez renommé vos fichiers de template et de traduction, assurez-vous de mettre à jour
les chemins ``App.paths.locales`` et ``App.paths.templates`` (dans **/config/app.php**) avec les
bonnes valeurs. Si besoin, référez-vous à la [configuration du squelette d'une application](https://github.com/cakephp/app/blob/master/config/app.php)

Appliquez le Refactorings de Rector
-----------------------------------

Ensuite, utilisez la commande ``rector`` pour corriger automatiquement de nombreux appels de méthodes
dépréciés dans CakePHP et PHPUnit. Il est important d'appliquer rector **avant** la mise à niveau
vos dépendances::

    bin/cake upgrade rector --rules phpunit80 <path/to/app/tests>
    bin/cake upgrade rector --rules cakephp40 <path/to/app/src>

Vous pouvez également utiliser l'outil de mise à niveau pour appliquer de nouvelles règles de rector
pour chaque version mineure de::

    # Exécutez les règles du recteur pour la mise à niveau 4.0 -> 4.1.
    bin/cake upgrade rector --rules cakephp41 <path/to/app/src>

Mettez à jour la dépendance de CakePHP
======================================

Après avoir appliqué les refactorisations de rector, mettez à niveau CakePHP et PHPUnit en utilisant
les commandes suivantes de composer:

.. code-block:: console

    php composer.phar require --dev --update-with-dependencies "phpunit/phpunit:^8.0"
    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

Application.php
===============

Ensuite, assurez-vous que votre ``src/Application.php`` a été mis à jour pour avoir les mêmes
signatures de méthodes que celles trouvées dans cakephp/app. vous trouverez la dernière version de
`Application.php
<https://github.com/cakephp/app/blob/4.x/src/Application.php>`__ sur GitHub.

Si vous fournissez une API de type REST, n'oubliez pas d'inclure le
:ref:`body-parser-middleware`. Enfin, vous devriez envisager de passer aux nouveaux
`AuthenticationMiddleware </authentication/2/en/index.html>`__
et `AuthorizationMiddleware </authorization/2/en/index.html>`__, si vous utilisez encore
le composant ``AuthComponent``.
