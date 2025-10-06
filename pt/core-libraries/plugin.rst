Classe Plugin
#############

.. php:namespace:: Cake\Core

.. php:class:: Plugin

A classe Plugin é responsável pela localização de recursos e gerenciamento de caminhos de plugins.

Localizando Plugins
===================

.. php:staticmethod:: path(string $plugin)

Plugins podem ser localizados com Plugin. Usar ``Plugin::path('DebugKit');``
por exemplo, lhe dará o caminho completo para o plugin DebugKit::

    $path = Plugin::path('DebugKit');

Verificar se um Plugin está Carregado
======================================

Você pode verificar dinamicamente dentro do seu código se um plugin específico foi carregado::

    $isLoaded = Plugin::isLoaded('DebugKit');

Use ``Plugin::loaded()`` se você quiser obter uma lista de todos os plugins atualmente carregados.

Encontrando Caminhos para Namespaces
=====================================

.. php:staticmethod:: classPath(string $plugin)

Usado para obter a localização dos arquivos de classe do plugin::

    $path = App::classPath('DebugKit');

Encontrando Caminhos para Recursos
===================================

.. php:staticmethod:: templatePath(string $plugin)

O método retorna o caminho para os templates do plugin::

    $path = Plugin::templatePath('DebugKit');

O mesmo vale para o caminho de config::

    $path = Plugin::configPath('DebugKit');

.. meta::
    :title lang=en: Plugin Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
