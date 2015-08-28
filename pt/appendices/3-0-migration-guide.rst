3.0 Guia de Migração
####################

Essa pagina resume as alterações do CakePHP 2.x que irá auxiliar na migração
do seu projeto para o 3.0, assim como uma referencia para se atualizar com as
alterações ao núcleo do Cake desde a ramificação 2.x. Certifique-se de ler também 
as outras páginas neste guia para todas as funcionalidades e mudanças na API.


.. note::
    Atualmente esta página não está totalmente suportada pela língua portuguesa.

    Por favor, sinta-se a vontade para nos enviar um pull request no
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **Improve This Doc** para propor suas mudanças diretamente.


Requerimentos
=============

- O CakePHP 3.x suporta a versão do PHP 5.4.16 e acima.
- O CakePHP 3.x precisa da extensão mbstring.
- O CakePHP 3.x precisa da extensão intl.

.. atenção::

    O CakePHP 3.0 não irá funcionar se você não atender aos requisitos acima.
    
    
Ferramenta de Atualização
=========================

Enquanto este documento cobre todas as alterações e melhorias feitas no
CakePHP 3.0, nós também criamos uma aplicação de console para ajudar você
a completar facilmente algumas das alterações mecânicas que consomem tempo.
Você pode 'pegar a ferramenta de atualização no github <https://github.com/cakephp/upgrade>`_.

O Layout do Diretório da Aplicação
==================================

O Layout do Diretório da Aplicação mudou e agora segue o
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. Você deve usar o projeto
`app skeleton <https://github.com/cakephp/app>`_ como um ponto de referência
quando atualizar sua aplicação.

O CakePHP deve ser instalado via Composer
=========================================

Como o CakePHP não pode ser instalado facilmente via PEAR, ou em um diretório
compartilhado, essas opções não são mais suportadas. Ao invés disso, você deve 
usar o `Composer <http://getcomposer.org>`_ para instalar o CakePHP em sua aplicação.


Namespaces
==========

Todas as classes do núcleo do CakePHP's agora usam namespaces e segue as especificações
de autoload (carga automática) do PSR-4. Por exemplo **src/Cache/Cache.php** tem o namespace
``Cake\Cache\Cache``.  Constantes globais e métodos helper's (ajudantes) como :php:meth:`__()`
e :php:meth:`debug()` não usam namespaces por questões de conveniência.



Constantes Removidas
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
para ver como a configuração é feita no 3.0.

Você não pode mais usar o ``App::build()`` para configurar caminhos adicionais
de classes. Ao invés disso, você deve mapear caminhos adicionais usando o autoloader
da sua aplicação. Veja a seção :ref:`additional-class-paths` para mais informações.

Três novas variáveis de configuração fornecem o caminho de configuração para plugins,
views e arquivos de localização. Você pode adicionar vários caminhos em 
``App.paths.templates``, ``App.paths.plugins``, ``App.paths.locales`` para configurar
múltiplos caminhos para templates, plugins e arquivos de localização respectivamente.

A chave de configuração ``www_root`` mudou para ``wwwRoot`` para manter consistente. 
Por favor, ajuste seu arquivo de configuração ``app.php`` assim como qualquer uso de ``Configure::read('App.wwwRoot')``.

Novo ORM
========

O CakePHP 3.0 possui um novo ORM que foi refeito do zero. O novo ORM é significativamente
diferente e incompatível com o anterior. Migrar para o novo ORM necessita de alterações
extensas em qualquer aplicação que esteja sendo atualizada. Veja a nova documentação 
:doc:`/orm` para informações de como usar o novo ORM.

Básico
======

* O ``LogError()`` foi removido, ele não tinha vantagens e era raramente/nunca usado.
* As seguintes funções globais foram removidas: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Debugando
=========

* A função ``Configure::write('debug', $bool)`` não suporta mais 0/1/2. Um booleano simples
  é usado ao invés disso para mudar o modo de debug para ligado ou desligado.

Configurações de objetos
========================

* Os objetos usados no CakePHP agora tem um sistema consistente de armazenamento/recuperação 
  de configuração-de-instância. Os códigos que anteriormente acessavam, por exemplo 
  ``$object->settings``, devem ser atualizados para usar ``$object->config()`` alternativamente.

Cache
=====

* ``Memcache`` engine has been removed, use :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` instead.
* Cache engines are now lazy loaded upon first use.
* :php:meth:`Cake\\Cache\\Cache::engine()` has been added.
* :php:meth:`Cake\\Cache\\Cache::enabled()` has been added. This replaced the
  ``Cache.disable`` configure option.
* :php:meth:`Cake\\Cache\\Cache::enable()` has been added.
* :php:meth:`Cake\\Cache\\Cache::disable()` has been added.
* Cache configurations are now immutable. If you need to change configuration
  you must first drop the configuration and then re-create it. This prevents
  synchronization issues with configuration options.
* ``Cache::set()`` has been removed. It is recommended that you create multiple
  cache configurations to replace runtime configuration tweaks previously
  possible with ``Cache::set()``.
* All ``CacheEngine`` subclasses now implement a ``config()`` method.
* :php:meth:`Cake\\Cache\\Cache::readMany()`, :php:meth:`Cake\\Cache\\Cache::deleteMany()`,
  and :php:meth:`Cake\\Cache\\Cache::writeMany()` were added.

All :php:class:`Cake\\Cache\\Cache\\CacheEngine` methods now honor/are responsible for handling the
configured key prefix. The :php:meth:`Cake\\Cache\\CacheEngine::write()` no longer permits setting
the duration on write - the duration is taken from the cache engine's runtime config. Calling a
cache method with an empty key will now throw an :php:class:`InvalidArgumentException`, instead
of returning ``false``.


.. note::
    Você pode referenciar-se à versão inglesa no menu de seleção superior para obter mais informações sobre os tópicos desta página.
