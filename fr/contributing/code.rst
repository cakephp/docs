Code
####

Les correctifs et les pull requests sont les meilleures façons de contribuer
au code de CakePHP. Les pull requests peuvent être créés sur Github, et sont
préférés aux correctifs attachés aux tickets.

Configuration initiale
======================

Avant de travailler sur les correctifs pour CakePHP, c'est une bonne idée de
récupérer la configuration de votre environnement.
Vous aurez besoin du logiciel suivant:

* Git
* PHP 5.3.0 ou supérieur
* ext/mcrypt
* ext/mbstring
* PHPUnit 3.7.0 ou supérieur (3.7.38 recommandé)
* MySQL, SQLite, ou Postgres

Mettez en place vos informations d'utilisateur avec votre nom / titre et
adresse e-mail de travail::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Si vous êtes nouveau sous Git, nous vous recommandons fortement de lire l'
    excellent livre gratuit `ProGit <http://git-scm.com/book/>`_.

Récupérer un clone du code source de CakePHP sous GitHub.:

* Si vous n'avez pas de compte `github <https://github.com>`_ , créez en un.
* Forkez le `dépôt de CakePHP <https://github.com/cakephp/cakephp>`_ en cliquant
  sur le bouton **Fork**.

Après que le fork est fait, clonez votre fork sur votre machine local::

    git clone git@github.com:YOURNAME/cakephp.git

Ajoutez le dépôt CakePHP d'origine comme un dépôt distant. Vous utiliserez ceci
plus tard pour aller chercher les changements du dépôt CakePHP. Cela vous
permettra de rester à jour avec CakePHP::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Maintenant que vous avez configuré CakePHP, vous devriez être en mesure
de définir un ``$ test`` : ref: `connexion à la base <database-configuration>`,
et : ref: `exécuter tous les tests de <running-tests>`.

Travailler sur un correctif
===========================

A chaque fois que vous voulez travailler sur un bug, une fonctionnalité ou
une amélioration, créez une branche avec un sujet.

La branche que vous créez devrait être basée sur la version pour laquelle
se tourne votre correctif/amélioration.
Par exemple, si vous régler un bug dans ``2.3``, vous pouvez utiliser la
branche ``2.3`` comme la base de votre branche. Cela simplifiera la fusion
future de vos changements::

    # gérer un bug dans 2.3
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    Utiliser un nom descriptif pour vos branches, en référence au ticket ou
    au nom de la fonctionnalité, est une bonne convention. Ex: ticket-1234,
    fonctionnalité-géniale.

Ce qui précède va créer une branche locale basée sur la branche (CakePHP) 2.3
en amont. Travaillez sur votre correctif, et faîtes autant de commits que vous
le souhaitez; mais gardez à l'esprit ce qui suit:

* Suivez ceci :doc:`/contributing/cakephp-coding-conventions`.
* Ajoutez un cas de test pour montrer que le bug est réglé, ou que la nouvelle
  fonctionnalité marche.
* Faîtes des commits logiques, et écrivez des messages de commit bien clairs
  et concis.

Soumettre un pull request
=========================

Une fois que vos changements sont faits et que vous êtes prêts pour la fusion
dans CakePHP, vous voudrez mettre à jour votre branche::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

Cela récupérera et fusionnera tous les changements qui se sont passés dans
CakePHP depuis que vous avez commencé. Cela rebasera - ou remettra vos
changements au dessus du code actuel. Il y aura peut-être un conflit pendant
le ``rebase``. Si le rebase quitte rapidement, vous pourrez voir les fichiers
qui sont en conflit/Non fusionnés avec ``git status``.
Résolvez chaque conflit et continuer le rebase::

    git add <filename> # Faîtes ceci pour chaque fichier en conflit.
    git rebase --continue

Vérifiez que tous les tests continuent. Ensuite faîtes un push de votre branche
à votre fork::

    git push origin <branch-name>

Une fois que votre branche est sur GitHub, vous pouvez discuter de cela sur la
mailing-liste `cakephp-core <http://groups.google.com/group/cakephp-core>`_  ou
soumettre un pull request sur GitHub.

Choisir l'emplacement dans lequel vos changements seront fusionnés
------------------------------------------------------------------

Quand vous faîtes vos pull requests, vous devez vous assurer de sélectionner
la branche de base correcte, puisque vous ne pouvez pas l'éditer une fois que
la pull request est créée.

* Si votre changement est un **bugfix** et n'introduit pas de nouvelles
  fonctionnalités et corrige seulement un comportement existant qui est présent
  dans la version courante. Dans ce cas, choisissez **2.x** comme votre cible
  de fusion.
* Si votre changement est une **nouvelle fonctionnalité** ou un ajout
  au framework, alors vous devez choisir la branche ``2.next``.
* Si votre changement casse une fonctionnalité existante, votre patch ne sera
  probablement pas fusionné dans 2.x. A la place, vous devrez cibler la
  branche 4.0.

.. note::

    Rappelez vous que tout le code auquel vous contribuez pour CakePHP sera
    sous la licence MIT License, et la
    `Cake Software Foundation <http://cakefoundation.org/pages/about>`_ sera le
    propriétaire de toutes les contributions de code et toutes les
    contributions de code sont soumises au `contrat de licence des
    Contributeurs <http://cakefoundation.org/pages/cla>`_.

Tous les bugs réparés fusionnés sur une branche de maintenance seront aussi
fusionnés périodiquement à la version publiée par l'équipe centrale (core team).


.. meta::
    :title lang=fr: Code
    :keywords lang=fr: cakephp source code,code correctifs patches,test ref,nom descriptif,bob barker,configuration initiale,utilisateur global,connexion base de données,clone,dépôt,information utilisateur,amélioration,back patches,checkout
