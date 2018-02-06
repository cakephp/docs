Bake Console
############

CakePHP's bake console is another effort to get you up and running in CakePHP
– fast. The bake console can create any of CakePHP's basic ingredients: models,
behaviors, views, helpers, controllers, components, test cases, fixtures and plugins.
And we aren't just talking skeleton classes: Bake can create a fully functional
application in just a few minutes. In fact, Bake is a natural step to take once
an application has been scaffolded.

Installation
============

Before trying to use or extend bake, make sure it is installed in your
application. Bake is provided as a plugin that you can install with Composer::

    composer require --dev cakephp/bake:~1.0

The above will install bake as a development dependency. This means that it will
not be installed when you do production deployments. The following sections
cover bake in more detail:

.. toctree::
    :maxdepth: 1

    bake/usage
    bake/development

.. meta::
    :title lang=en: Bake Console
    :keywords lang=en: command line interface,development,bake view, bake template syntax,erb tags,asp tags,percent tags
