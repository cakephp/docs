3.0 Guia de Migração
###################

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
============

- O CakePHP 3.x suporta a versão do PHP 5.4.16 e acima.
- O CakePHP 3.x precisa da extensão mbstring.
- O CakePHP 3.x precisa da extensão intl.

.. atenção::

    O CakePHP 3.0 não irá funcionar se você não atender aos requisitos acima.
    
    
Ferramenta de Atualização
============

Enquanto este documento cobre todas as alterações e melhorias feitas no
CakePHP 3.0, nós também criamos uma aplicação de console para ajudar você
a completar facilmente algumas das alterações mecânicas que consomem tempo.
Você pode 'pegar a ferramenta de atualização no github <https://github.com/cakephp/upgrade>`_.

O Layout do Diretório da Aplicação
============================

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
=================

As seguintes constantes obsoletas foram removidas:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``


Configuration
=============

Configuration in CakePHP 3.0 is significantly different than in previous
versions. You should read the :doc:`/development/configuration` documentation
for how configuration is done in 3.0.

You can no longer use ``App::build()`` to configure additional class paths.
Instead you should map additional paths using your application's autoloader. See
the section on :ref:`additional-class-paths` for more information.

Three new configure variables provide the path configuration for plugins,
views and locale files. You can add multiple paths to ``App.paths.templates``,
``App.paths.plugins``, ``App.paths.locales`` to configure multiple paths for
templates, plugins and locale files respectively.

The config key ``www_root`` has been changed to ``wwwRoot`` for consistency. Please adjust
your ``app.php`` config file as well as any usage of ``Configure::read('App.wwwRoot')``.

New ORM
=======

CakePHP 3.0 features a new ORM that has been re-built from the ground up. The
new ORM is significantly different and incompatible with the previous one.
Upgrading to the new ORM will require extensive changes in any application that
is being upgraded. See the new :doc:`/orm` documentation for information on how
to use the new ORM.



.. note::
    Você pode referenciar-se à versão inglesa no menu de seleção superior para obter mais informações sobre os tópicos desta página.
