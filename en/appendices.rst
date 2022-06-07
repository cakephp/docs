Appendices
##########

Appendices contain information regarding the new features
introduced in each version and the migration path between versions.

4.x Migration Guide
===================

.. toctree::
    :maxdepth: 1

    appendices/5-0-migration-guide
    appendices/fixture-upgrade

Backwards Compatibility Shimming
================================

If you need/want to shim 3.x behavior, or partially migrate in steps, check out
the `Shim plugin <https://github.com/dereuromark/cakephp-shim>`__ that can help mitigate some BC breaking changes.

Forwards Compatibility Shimming
===============================

Forwards compatibility shimming can prepare your 3.x app for the next major
release (4.x).

If you already want to shim 4.x behavior into 3.x, check out the `Shim plugin
<https://github.com/dereuromark/cakephp-shim>`__. This plugin aims to mitigate
some backwards compatibility breakage and help backport features from 4.x to
3.x.  The closer your 3.x app is to 4.x, the smaller will be the diff of
changes, and the smoother will be the final upgrade.

General Information
===================

.. toctree::
    :maxdepth: 1

    appendices/cakephp-development-process
    appendices/glossary

.. meta::
    :title lang=en: Appendices
    :keywords lang=en: migration guide,migration path,new features,glossary
