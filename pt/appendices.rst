Apêndices
#########

Os apêndices contêm informações sobre os novos recursos
introduzidos em cada versão e a forma de executar a migração entre versões.

Guia de Migração
================

:doc:`appendices/migration-guides`

Retrocompatibilidade por Adaptação
==================================

Se você precisar/quiser corrigir o comportamento do 4.x ou migrar parcialmente em etapas, confira
o plugin `Shim <https://github.com/dereuromark/cakephp-shim>`__ que pode ajudar a mitigar algumas alterações que quebram o BC.

Compatibilidade Futura
======================

A correção de compatibilidade com versões anteriores pode preparar seu aplicativo 4.x para o próximo grande
lançamento (5.x).

Se você já deseja aplicar o comportamento do 5.x no 4.x, confira o `plugin Shim
<https://github.com/dereuromark/cakephp-shim>`__. Este plugin visa mitigar
algumas falhas de compatibilidade com versões anteriores e ajudar a retroportar recursos do 5.x para
o 4.x. Quanto mais próximo o seu aplicativo 3.x estiver do 4.x, menor será a diferença
das mudanças e mais suave será a atualização final.

Informações Gerais
===================

.. toctree::
    :maxdepth: 1

    appendices/cakephp-development-process
    appendices/glossary

.. meta::
    :title lang=pt: Apêndices
    :keywords lang=pt: guia de migração,rota de migração,novas funcionalidades,glossário,
