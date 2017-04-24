Code
####

Patches and pull requests are a great way to contribute code back to CakePHP.
Pull requests can be created in GitHub, and are prefered over patch files in
ticket comments.

Initial setup
=============

Before working on patches for CakePHP, it's a good idea to get your environment
setup. You'll need the following software:

* Git
* PHP 5.2.8 or greater
* PHPUnit 3.5.10 or greater

Set up your user information with your name/handle and working email address::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    If you are new to Git, we highly recommend you to read the excellent and free
    `ProGit <http://git-scm.com/book/>`_ book.

Get a clone of the CakePHP source code from GitHub:

* If you don't have a `GitHub <http://github.com>`_ account, create one.
* Fork the `CakePHP repository <http://github.com/cakephp/cakephp>`_ by clicking
  the **Fork** button.

After your fork is made, clone your fork to your local machine::

    git clone git@github.com:YOURNAME/cakephp.git

Add the original CakePHP repository as a remote repository. You'll use this
later to fetch changes from the CakePHP repository. This will let you stay up
to date with CakePHP::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Now that you have CakePHP setup you should be able to define a ``$test``
:ref:`database connection <database-configuration>`, and
:ref:`run all the tests <running-tests>`.

Working on a patch
==================

Each time you want to work on a bug, feature or enhancement create a topic
branch.

The branch you create should be based on the version that your fix/enhancement
is for. For example if you are fixing a bug in ``2.3`` you would want to use
the ``2.3`` branch as the base for your branch. If your change is a bug fix
for the current stable release, you should use the ``master`` branch. This
makes merging your changes in later much simpler::

    # fixing a bug on 2.3
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    Use a descriptive name for your branch, referencing the ticket or feature
    name is a good convention. e.g. ticket-1234, feature-awesome

The above will create a local branch based on the upstream (CakePHP) 2.3 branch.
Work on your fix, and make as many commits as you need; but keep in mind the
following:

* Follow the :doc:`/contributing/cakephp-coding-conventions`.
* Add a test case to show the bug is fixed, or that the new feature works.
* Keep your commits logical, and write good clear and concise commit messages.


Submitting a pull request
=========================

Once your changes are done and you're ready for them to be merged into CakePHP,
you'll want to update your branch::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

This will fetch + merge in any changes that have happened in CakePHP since you
started. It will then rebase - or replay your changes on top of the current
code. You might encounter a conflict during the ``rebase``. If the rebase
quits early you can see which files are conflicted/un-merged with ``git status``.
Resolve each conflict, and then continue the rebase::

    git add <filename> # do this for each conflicted file.
    git rebase --continue

Check that all your tests continue to pass. Then push your branch to your
fork::

    git push origin <branch-name>

Once your branch is on GitHub, you can discuss it on the
`cakephp-core <http://groups.google.com/group/cakephp-core>`_ mailing list or
submit a pull request on GitHub.

Choosing where your changes will be merged into
-----------------------------------------------

When making pull requests you should make sure you select the correct base
branch, as you cannot edit it once the pull request is created.

* If your change is a **bugfix** and doesn't introduce new functionality and only
  corrects existing behavior that is present in the current release. Then
  choose **master** as your merge target.
* If your change is a **new feature** or an addition to the framework, then you
  should choose the branch with the next version number. For example if the
  current stable release is ``2.2.2``, the branch accepting new features will be
  ``2.3``
* If your change is a breaks existing functionality, or API's then you'll have
  to choose then next major release. For example, if the current release is
  ``2.2.2`` then the next time existing behavior can be broken will be in
  ``3.0`` so you should target that branch.


.. note::

    Remember that all code you contribute to CakePHP will be licensed under the
    MIT License, and the `Cake Software Foundation <http://cakefoundation.org/pages/about>`_
    will become the owner of any contributed code. Contributors should follow the 
    `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_.

All bug fixes merged into a maintenance branch will also be merged into upcoming
releases periodically by the core team.


.. meta::
    :title lang=en: Code
    :keywords lang=en: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,repository,user information,enhancement,back patches,checkout
