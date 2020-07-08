4.2 Migration Guide
###################

CakePHP 4.2 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.2.


Deprecations
============

4.2 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp42 <path/to/app/src>

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

New Features
============
