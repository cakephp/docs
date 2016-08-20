Code
####

Les correctifs et les pull requests sont les meilleures façons de contribuer
au code de CakePHP. Les pull requests peuvent être créés sur Github, et sont
préférés aux correctifs attachés aux tickets.

Configuration Initiale
======================

Avant de travailler sur les correctifs pour CakePHP, c'est une bonne idée de
définir la configuration de votre environnement. Vous aurez besoin des logiciels
suivants:

* Git
* PHP 5.6.0 ou supérieur
* PHPUnit 3.7.0 ou supérieur

Mettez en place vos informations d'utilisateur avec votre nom/titre et adresse
e-mail de travail::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Si vous êtes nouveau sous Git, nous vous recommandons fortement de lire
    l'excellent livre gratuit `ProGit <http://git-scm.com/book/>`_.

Récupérez un clone du code source de CakePHP sous GitHub:

* Si vous n'avez pas de compte `github <http://github.com>`_ , créez-en un.
* Forkez le `dépôt de CakePHP <http://github.com/cakephp/cakephp>`_ en cliquant
  sur le bouton **Fork**.

Après que le fork est fait, clonez votre fork sur votre machine locale::

    git clone git@github.com:YOURNAME/cakephp.git

Ajoutez le dépôt CakePHP d'origine comme un dépôt distant. Vous utiliserez ceci
plus tard pour aller chercher les changements du dépôt CakePHP. Cela vous
permettra de rester à jour avec CakePHP::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Maintenant que vous avez configuré CakePHP, vous devriez être en mesure
de définir une :ref:`connexion à la base <database-configuration>` ``$test``,
et :ref:`d'exécuter tous les tests <running-tests>`.

Travailler sur un Correctif
===========================

A chaque fois que vous voulez travailler sur un bug, une fonctionnalité ou
une amélioration, créez une branche avec un sujet.

La branche que vous créez devra être basée sur la version pour laquelle
votre correctif/amélioration tourne. Par exemple, si vous réglez un bug dans
``3.x``, vous pouvez utiliser la branche ``master`` comme base de votre branche.
Si vos changements ont pou objet de régler un bug pour les séries de version
2.x, vous devrez utiliser la branche ``2.x``. Cela simplifiera la fusion future
de vos changements puisque Github ne vous permet pas de modifier la branche
cible::

    # régler un bug dans 3.x
    git fetch upstream
    git checkout -b ticket-1234 upstream/master

    # régler un bug dans 2.x
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.x

.. tip::

    Utiliser un nom descriptif pour vos branches, en référence au ticket ou
    au nom de la fonctionnalité, est une bonne convention. Ex: ticket-1234,
    great-fonctionnality.

Ce qui précède va créer une branche locale basée sur la branche (CakePHP) 2.x
en amont. Travaillez sur votre correctif, et faîtes autant de commits que vous
le souhaitez; mais gardez à l'esprit ce qui suit:

* Suivez ceci :doc:`/contributing/cakephp-coding-conventions`.
* Ajoutez un cas de test pour montrer que le bug est réglé, ou que la nouvelle
  fonctionnalité marche.
* Faîtes des commits logiques, et écrivez des messages de commit bien clairs
  et concis.

Soumettre un Pull Request
=========================

Une fois que vos changements sont faits et que vous êtes prêts pour la fusion
dans CakePHP, vous pouvez mettre à jour votre branche::

    # Rebaser un fix en haut de la branche master
    git checkout master
    git fetch upstream
    git merge upstream/master
    git checkout <branch_name>
    git rebase master

Cela récupérera et fusionnera tous les changements qui se sont passés dans
CakePHP depuis que vous avez commencé. Cela rebasera - ou remettra vos
changements au dessus du code actuel. Il y aura peut-être un conflit pendant
le ``rebase``. Si le rebase quitte rapidement, vous pourrez voir les fichiers
qui sont en conflit/Non fusionnés avec ``git status``.
Résolvez chaque conflit et continuer le rebase::

    git add <filename> # Faîtes ceci pour chaque fichier en conflit.
    git rebase --continue

Vérifiez que tous les tests continuent de fonctionner. Ensuite faîtes un push de
votre branche à votre fork::

    git push origin <branch-name>

Si vous avez rebasé après avoir pusher votre branche, vous devrez utiliser le
push avec l'option force::

    git push --force origin <branch-name>

Une fois que votre branche est sur GitHub, vous pouvez soumettre un pull request
sur GitHub.

Choisir l'Emplacement dans lequel vos Changements seront Fusionnés
------------------------------------------------------------------

Quand vous faîtes vos pull requests, vous devez vous assurer de sélectionner
la bonne branche de base, puisque vous ne pouvez pas l'éditer une fois que
le pull request est créée.

* Si votre changement est un **bugfix** et n'introduit pas de nouvelles
  fonctionnalités et corrige seulement un comportement existant qui est présent
  dans la version courante. Dans ce cas, choisissez **master** comme votre cible
  de fusion.
* Si votre changement est une **nouvelle fonctionnalité** ou un ajout
  au framework, alors vous devez choisir la branche avec le nombre de la version
  prochaine. Par exemple si la version stable courante est ``3.2.10``, la
  branche acceptant les nouvelles fonctionnalités sera ``3.next``.
* Si votre changement casse une fonctionnalité existante, ou casse l'API, alors
  vous devrez choisir la prochaine version majeure. Par exemple, si la version
  courante est ``3.2.2`` alors la prochaine fois qu'un comportement peut être
  cassé sera dans ``4.x`` ainsi vous devez cibler cette branche.

.. note::

    Souvenez-vous que tout le code auquel vous contribuez pour CakePHP sera
    sous Licence MIT, et la
    `Cake Software Foundation <http://cakefoundation.org/pages/about>`_ sera la
    propriétaire de toutes les contributions de code. Les contributeurs doivent
    suivre les `Guidelines de la Communauté CakePHP <http://community.cakephp.org/guidelines>`_.

Tous les bugs réparés fusionnés sur une branche de maintenance seront aussi
fusionnés périodiquement à la version publiée par l'équipe centrale (core team).

.. meta::
    :title lang=fr: Code
    :keywords lang=fr: cakephp source code,code correctifs patches,test ref,nom descriptif,bob barker,configuration initiale,utilisateur global,connexion base de données,clone,dépôt,information utilisateur,amélioration,back patches,checkout
