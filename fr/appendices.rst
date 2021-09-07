Annexes
#######

Les annexes contiennent des informations sur les nouvelles fonctionnalités
introduites dans chaque version et le chemin de migration entre les versions.

4.x Guide de Migration
======================

.. toctree::
    :maxdepth: 1

    appendices/4-0-migration-guide
    appendices/4-1-migration-guide
    appendices/4-2-migration-guide
    appendices/4-3-migration-guide
    appendices/fixture-upgrade

Mimer la Compatibilité Descendante
==================================

Si vous devez/voulez mimer le comportement de 3.x, ou migrer partiellement par
étapes, consultez le `plugin Shim <https://github.com/dereuromark/cakephp-shim>`__
qui peut vous aider à atténuer certains changements entraînant une rupture de
compatibilité descendante.

Mimer la Compatibilité Ascendante
=================================

Mimer la compatibilité ascendante peut préparer votre application 3.x pour la
version majeure suivante (4.x).

Si vous voulez mimer d'ores et déjà le comportement de 4.x dans votre 3.x,
consultez le `plugin Shim <https://github.com/dereuromark/cakephp-shim>`__. Ce
plugin est conçu pour atténuer certaines ruptures de compatibilité descendante
et aide à porter des fonctionnalités de 4.x dans 3.x. Plus votre application 3.x
se rapproche de 4.x, moins vous aurez de changements entre les deux, et la mise
à niveau finale en sera d'autant plus sereine.

Informations générales
======================

.. toctree::
    :maxdepth: 1

    appendices/cakephp-development-process
    appendices/glossary

.. meta::
    :title lang=fr: Annexes
    :keywords lang=fr: guide de migration,nouvelles fonctionnalités,glossaire,chemin de migration
