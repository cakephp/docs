.. _upgrade-shell:

Upgrade shell
#############

The upgrade shell will do most of the work to upgrade your CakePHP application from 1.3 to 2.0.

To run all upgrade steps::

    ./Console/cake upgrade all

If you would like to see what the shell will do without modifying files perform a dry run first with --dry-run::

    ./Console/cake upgrade all --dry-run

To upgrade your plugin run the command::

    ./Console/cake upgrade all --plugin YourPluginName

You are able to run each upgrade step individually. To see all the steps available run the command::

    ./Console/cake upgrade --help

Or visit the API docs for more info: http://api20.cakephp.org/class/upgrade-shell

.. meta::
    :title lang=en: .. _upgrade-shell:
    :keywords lang=en: api docs,shell
