3.0 Guia de migração
####################

Esta página resume as alterações do CakePHP 2.x e irá auxiliar na migração
do seu projeto para a versão 3.0, e também será uma referência para atualizá-lo
quanto às principais mudanças do branch 2.x. Certifique-se de ler também as
outras páginas nesse guia para conhecer todas as novas funcionalidades e
mudanças na API.

Requerimentos
=============

- O CakePHP 3.x suporta o PHP 5.4.16 e acima.
- O CakePHP 3.x precisa da extensão mbstring.
- O CakePHP 3.x precisa da extensão intl.

.. atenção::

    O CakePHP 3.0 não irá funcionar se você não atender aos requisitos acima.

Ferramenta de atualização
=========================

Enquanto este documento cobre todas as alterações e melhorias feitas no
CakePHP 3.0, nós também criamos uma aplicação de console para ajudar você
a completar mais facilmente algumas das alterações mecânicas que consomem tempo.
Você pode `pegar a ferramenta de atualização no github <https://github
.com/cakephp/upgrade>`_.

Layout do diretório da aplicação
================================

O Layout do diretório da aplicação mudou e agora segue o
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Você deve usar o projeto do
`esqueleto da aplicação <https://github.com/cakephp/app>`_ como um
ponto de referência quando atualizar sua aplicação.

O CakePHP deve ser instalado via Composer
=========================================

Como o CakePHP não pode mais ser instalado facilmente via PEAR, ou em um
diretório compartilhado, essas opções não são mais suportadas. Ao invés disso,
você deve usar o `Composer <http://getcomposer.org>`_ para instalar o
CakePHP em sua aplicação.

Namespaces
==========

Todas as classes do core do CakePHP agora usam namespaces e seguem as
especificações de autoload (auto-carregamento) do PSR-4. Por exemplo
**src/Cache/Cache.php** tem o namespace ``Cake\Cache\Cache``.  Constantes
globais e métodos de helpers como :php:meth:`__()` e :php:meth:`debug()` não
usam namespaces por questões de conveniência.

Constantes removidas
====================

As seguintes constantes obsoletas foram removidas:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

Configuração
============

As configurações no CakePHP 3.0 estão significativamente diferentes que nas
versões anteriores. Você deve ler a documentação :doc:`/development/configuration`
para ver como a configuração é feita.

Você não pode mais usar o ``App::build()`` para configurar caminhos adicionais
de classes. Ao invés disso, você deve mapear caminhos adicionais usando o
autoloader da sua aplicação. Veja a seção :ref:`additional-class-paths` para
mais informações.

Três novas variáveis de configuração fornecem o caminho de configuração para
plugins, views e arquivos de localização. Você pode adicionar vários caminhos em
``App.paths.templates``, ``App.paths.plugins``, ``App.paths.locales`` para
configurar múltiplos caminhos para templates, plugins e arquivos de localização
respectivamente.

A chave de configuração ``www_root`` mudou para ``wwwRoot`` devido a
consistência. Por favor, ajuste seu arquivo de configuração ``app.php`` assim
como qualquer uso de ``Configure::read('App.wwwRoot')``.

Novo ORM
========

O CakePHP 3.0 possui um novo ORM que foi refeito do zero. O novo ORM é
significativamente diferente e incompatível com o anterior. Migrar para o novo
ORM necessita de alterações extensas em qualquer aplicação que esteja sendo
atualizada. Veja a nova documentação :doc:`/orm` para informações de como usar
o novo ORM.

Básico
======

* O ``LogError()`` foi removido, ele não tinha vantagens e era raramente ou
  mesmo, nunca usado.
* As seguintes funções globais foram removidas: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Debug
=====

* A função ``Configure::write('debug', $bool)`` não suporta mais 0/1/2. Um
  boleano simples é usado para mudar o modo de debug para ligado ou desligado.

Especificações/Configurações de objetos
=======================================

* Os objetos usados no CakePHP agora tem um sistema consistente de armazenamento/recuperação
  de configuração-de-instância. Os códigos que anteriormente acessavam, por exemplo
  ``$object->settings``, devem ser atualizados para usar ``$object->config()``
  alternativamente.

Cache
=====

* ``Memcache`` foi removido, use
  :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` alternativamente.
* Cache engines são carregados sob demanda no primeiro uso.
* :php:meth:`Cake\\Cache\\Cache::engine()` foi adicionado.
* :php:meth:`Cake\\Cache\\Cache::enabled()` foi adicionado. Substituindo a
  opção de configuração ``Cache.disable``.
* :php:meth:`Cake\\Cache\\Cache::enable()` foi adicionado.
* :php:meth:`Cake\\Cache\\Cache::disable()` foi adicionado.
* Configuração de cache agora é imutável. Se você precisa alterar a
  configuração, será necessário desfazer-se da configuração e recriá-la. Isso
  previne problemas de sincronização com as opções de configuração.
* ``Cache::set()`` foi removido. É recomendado criar múltiplas configurações de
  cache para substituir ajustes de configuração em tempo de execução
  anteriormente possíveis com ``Cache::set()``.
* Todas as subclasses ``CacheEngine`` agora implementam um método ``config()``.
* :php:meth:`Cake\\Cache\\Cache::readMany()`,
  :php:meth:`Cake\\Cache\\Cache::deleteMany()`,
  e :php:meth:`Cake\\Cache\\Cache::writeMany()` foram adicionados.

Todos os métodos :php:class:`Cake\\Cache\\Cache\\CacheEngine` agora são
responsáveis por manipular o prefixo chave configurado. O
:php:meth:`Cake\\Cache\\CacheEngine::write()` não mais permite definir a
duração na escrita, a duração é captada pela configuração de tempo de execução
do mecanismo de cache. Chamar um método cache com uma chuva vazia irá lançar
uma :php:class:`InvalidArgumentException` ao invés de retornar ``false``.

Core
====

App
---

- ``App::pluginPath()`` foi removido. Use ``CakePlugin::path()``
  alternativamente.
- ``App::build()`` foi removido.
- ``App::location()`` foi removido.
- ``App::paths()`` foi removido.
- ``App::load()`` foi removido.
- ``App::objects()`` foi removido.
- ``App::RESET`` foi removido.
- ``App::APPEND`` foi removido.
- ``App::PREPEND`` foi removido.
- ``App::REGISTER`` foi removido.

Plugin
------

- O :php:meth:`Cake\\Core\\Plugin::load()` não configura a carga automática 
  a menos que você defina a opção ``autoload`` como ``true``.
- Quanto estiver carregando plugins você não pode mais fornecer um ``callable``.
- Quanto estiver carregando plugins você não pode mais fornecer um array de
  arquivos de configuração para carregar.
  

Configure
---------

- O ``Cake\Configure\PhpReader`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig`
- O ``Cake\Configure\IniReader`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig`
- O ``Cake\Configure\ConfigReaderInterface`` foi renomeado para
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface`
- O :php:meth:`Cake\\Core\\Configure::consume()` foi adicionado.
- O :php:meth:`Cake\\Core\\Configure::load()` agora espera o nome de arquivo 
  sem o sufixo de extensão como isso pode ser derivado do mecanismo.
  Ex.: para usar o PhpConfig use ``app`` para carregar ``app.php``.
- Definir uma variável ``$config`` no arquivo PHP config está obsoleto.
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` agora espera que o
  arquivo de configuração retorne um array.
- Um novo mecanismo de configuração :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig` 
  foi adicionado.

Object
------

A classe ``Object`` foi removida. Ela anteriormente continha 
um monte de métodos que eram utilizados em vários locais no framework. 
O mais útil destes métodos foi extraido como um ``trait``.
Você pode usar o :php:trait:`Cake\\Log\\LogTrait` para acessar o método
``log()``. O :php:trait:`Cake\\Routing\\RequestActionTrait` fornece o
método ``requestAction()``.

Console
=======

O executável ``cake`` foi movido do diretório ``app/Console`` para o diretório
``bin`` dentro do esqueleto da aplicação. Você pode agora invocar o console do
CakePHP com ``bin/cake``.
