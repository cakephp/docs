Apêndices
#########

Os apêndices contêm informações sobre os novos recursos
introduzidos em cada versão e o caminho de migração entre versões.

Guias de Migração
=================

:doc:`appendices/migration-guides`

Compatibilidade Retroativa com Shim
====================================

Se você precisa/quer adicionar o comportamento do 4.x, ou migrar parcialmente em etapas, confira
o `Plugin Shim <https://github.com/dereuromark/cakephp-shim>`__ que pode ajudar a mitigar algumas mudanças que quebram a compatibilidade retroativa.

Compatibilidade Futura com Shim
================================

A compatibilidade futura com shim pode preparar sua aplicação 4.x para a próxima versão principal
(5.x).

Se você já quer adicionar o comportamento do 5.x no 4.x, confira o `Plugin Shim
<https://github.com/dereuromark/cakephp-shim>`__. Este plugin tem como objetivo mitigar
algumas quebras de compatibilidade retroativa e ajudar a fazer backport de recursos do 5.x para
4.x. Quanto mais próxima sua aplicação 3.x estiver do 4.x, menor será o diff de
mudanças, e mais suave será a atualização final.

Informações Gerais
==================

.. toctree::
    :maxdepth: 1

    appendices/cakephp-development-process
    appendices/glossary

.. meta::
    :title lang=pt: Apêndices
    :keywords lang=pt: guia de migração,caminho de migração,novos recursos,glossário
