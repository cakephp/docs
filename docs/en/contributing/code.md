# Code

Patches and pull requests are a great way to contribute code back to CakePHP.
Pull requests can be created in GitHub, and are preferred over patch files in
ticket comments.

## Initial Setup

Before working on patches for CakePHP, it's a good idea to get your environment
setup. You'll need the following software:

- Git
- PHP |minphpversion| or greater - PHPUnit 5.7.0 or greater

Set up your user information with your name/handle and working email address:

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

> [!NOTE]
> If you are new to Git, we highly recommend you to read the excellent and
> free [ProGit](https://git-scm.com/book/) book.

Get a clone of the CakePHP source code from GitHub:

- If you don't have a [GitHub](https://github.com) account, create one.
- Fork the [CakePHP repository](https://github.com/cakephp/cakephp) by clicking
  the **Fork** button.

After your fork is made, clone your fork to your local machine:

    git clone git@github.com:YOURNAME/cakephp.git

Add the original CakePHP repository as a remote repository. You'll use this
later to fetch changes from the CakePHP repository. This will let you stay up
to date with CakePHP:

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Now that you have CakePHP setup you should be able to define a `$test`
[database connection](../orm/database-basics#database-configuration), and
[run all the tests](../development/testing#running-tests).

## Working on a Patch

Each time you want to work on a bug, feature or enhancement create a topic
branch.

The branch you create should be based on the version that your fix/enhancement
is for. For example if you are fixing a bug in `3.x` you would want to use the
`master` branch as the base for your branch. If your change is a bug fix for
the 2.x release series, you should use the `2.x` branch:

``` text
# fixing a bug on 3.x
git fetch upstream
git checkout -b ticket-1234 upstream/master

# fixing a bug on 2.x
git fetch upstream
git checkout -b ticket-1234 upstream/2.x
```

> [!TIP]
> Use a descriptive name for your branch, referencing the ticket or feature
> name is a good convention. e.g. ticket-1234, feature-awesome

The above will create a local branch based on the upstream (CakePHP) 2.x branch.
Work on your fix, and make as many commits as you need; but keep in mind the
following:

- Follow the [Coding Standards](../contributing/cakephp-coding-conventions).
- Add a test case to show the bug is fixed, or that the new feature works.
- Keep your commits logical, and write clear commit messages that provide
  context on what you changed and why.

## Submitting a Pull Request

Once your changes are done and you're ready for them to be merged into CakePHP,
you'll want to update your branch:

``` text
# Rebase fix on top of master
git checkout master
git fetch upstream
git merge upstream/master
git checkout <branch_name>
git rebase master
```

This will fetch + merge in any changes that have happened in CakePHP since you
started. It will then rebase - or replay your changes on top of the current
code. You might encounter a conflict during the `rebase`. If the rebase quits
early you can see which files are conflicted/un-merged with `git status`.
Resolve each conflict, and then continue the rebase:

``` text
git add <filename> # do this for each conflicted file.
git rebase --continue
```

Check that all your tests continue to pass. Then push your branch to your fork:

``` text
git push origin <branch-name>
```

If you've rebased after pushing your branch, you'll need to use force push:

``` text
git push --force origin <branch-name>
```

Once your branch is on GitHub, you can submit a pull request on GitHub.

### Choosing Where Your Changes will be Merged Into

When making pull requests you should make sure you select the correct base
branch, as you cannot edit it once the pull request is created.

- If your change is a **bugfix** and doesn't introduce new functionality and
  only corrects existing behavior that is present in the current release. Then
  choose **master** as your merge target.
- If your change is a **new feature** or an addition to the framework, then you
  should choose the branch with the next version number. For example if the
  current stable release is `3.6.0`, the branch accepting new features will
  be `3.next`.
- If your change is a breaks existing functionality, or APIs then you'll have
  to choose then next major release. For example, if the current release is
  `3.6.0` then the next time existing behavior can be broken will be in
  `4.x` so you should target that branch.

> [!NOTE]
> Remember that all code you contribute to CakePHP will be licensed under the
> MIT License, and the [Cake Software Foundation](https://cakefoundation.org/pages/about) will become the owner of any
> contributed code. Contributors should follow the [CakePHP Community
> Guidelines](https://community.cakephp.org/guidelines).

All bug fixes merged into a maintenance branch will also be merged into upcoming
releases periodically by the core team.
