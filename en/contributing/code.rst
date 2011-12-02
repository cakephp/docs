Code
####

Patches and pull requests are the best ways to contribute code back to CakePHP.
Patches can be either attached to tickets in `lighthouse
<http://cakephp.lighthouseapp.com>`_. Pull requests can be created in github,
and are generally a better way to contribute code.

Initial setup
=============

Before working on patches for CakePHP, it's a good idea to get your environment
setup.  You'll need the following software:

* Git
* PHP 5.2.6 or greater
* PHPUnit 3.5.10 or greater

Set up your user information with your name/handle and working email address::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    If you are new to Git, we highly recommend you to read the excellent and free 
    `ProGit <http://progit.org>`_ book.

Get a clone of the CakePHP source code from github:

* If you don't have a `github <http://github.com>`_ account, create one.
* Fork the `CakePHP repository <http://github.com/cakephp/cakephp>`_ by clicking
  the **Fork** button.

After your fork is made, clone your fork to your local machine::

    git clone git@github.com:YOURNAME/cakephp.git

Add the original CakePHP repository as a remote repository.  You'll use this
later to fetch changes from the CakePHP repository.  This will let you stay up
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
is for.  For example if you are fixing a bug in ``2.0`` you would want to use
the ``2.0`` branch as the base for your branch.  This makes merging your changes
in later much simpler::

    # fixing a bug on 2.0
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.0

.. tip::

    Use a descriptive name for your branch, referencing the ticket or feature
    name is a good convention. e.g. ticket-1234, feature-awesome

The above will create a local branch based on the upstream (CakePHP) 2.0 branch.
Work on your fix, and make as many commits as you need; but keep in mind the
following:

* Follow the :doc:`/contributing/cakephp-coding-conventions`.
* Add a test case to show the bug is fixed, or that the new feature works.
* Keep your commits logical, and write good clear and concise commit messages.

Submitting a pull request
=========================

Once your changes are done and you're ready for them to be merged into CakePHP,
you'll want to update your branch::

    git checkout 2.0
    git fetch upstream
    git merge upstream/2.0
    git checkout <branch_name>
    git rebase 2.0

This will fetch + merge in any changes that have happened in CakePHP since you
started.  It will then rebase - or replay your changes on top of the current
code.  You might encounter a conflict during the ``rebase``.  If the rebase
quits early you can see which files are conflicted/un-merged with ``git status``.
Resolve each conflict, and then continue the rebase::

    git add <filename> # do this for each conflicted file.
    git rebase --continue

Check that all your tests continue to pass.  Then push your branch to your
fork::

    git push origin <branch-name>

Once your branch is on github, you can discuss it on the 
`cakephp-core <http://groups.google.com/group/cakephp-core>`_ mailing list or
submit a pull request on github.

.. note::

    Remember that all code you contribute to CakePHP will be licensed under the
    MIT License, and the Cake Software Foundation will become the owner of any
    contributed code and all contributed code is subject to the `Contributors
    license agreement <http://cakefoundation.org/pages/cla>`_.

All bug fixes merged into a maintenance branch will also be merged into upcoming
releases periodically by the core team.


.. meta::
    :title lang=en: Code
    :keywords lang=en: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,lighthouse,repository,user information,enhancement,back patches,checkout
