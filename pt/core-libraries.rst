Bibliotecas do Núcleo
##############

CakePHP vem com uma infinidade de funções internas e classes. essas classes
e funções tentam cobrir algumas das características mais comuns requeridos nas
aplicações web.

Propósito Geral
===============

Bibliotecas de uso geral estão disponíveis e reutilizado nos muitos lugares em todo
CakePHP.

.. toctree::
    :maxdepth: 2

    core-libraries/global-constants-and-functions
    core-libraries/collections

.. _core-components:

Componentes
==========

CakePHP tem uma seleção de componentes para ajudar a cuidar das tarefas básicas do seu
controladores. Veja a seção sobre :doc:`/controllers/components` para saber como
configurar e usar componentes.

.. toctree::
    :maxdepth: 2

    core-libraries/components/access-control-lists
    core-libraries/components/authentication
    core-libraries/components/cookie
    core-libraries/components/email
    core-libraries/components/request-handling
    core-libraries/components/pagination
    core-libraries/components/security-component
    core-libraries/components/sessions

.. _core-helpers:

Helpers
=======

CakePHP apresenta uma série de helpers que auxiliam na criação da view. Eles ajudam na
criação de marcação bem formatada (incluindo formulários), ajuda na formatação de texto, tempos e
números, e pode até mesmo integrar-se com bibliotecas populares javascript. Aqui está uma
resumo dos helpers incorporado.

Leia :doc:`/views/helpers` para saber mais sobre helpers, sua api, e como você
pode criar e usar seus próprios helpers.

.. toctree::
    :maxdepth: 2

    core-libraries/helpers/cache
    core-libraries/helpers/form
    core-libraries/helpers/html
    core-libraries/helpers/js
    core-libraries/helpers/number
    core-libraries/helpers/paginator
    core-libraries/helpers/rss
    core-libraries/helpers/session
    core-libraries/helpers/text
    core-libraries/helpers/time

.. _core-behaviors:

Behaviors
=========

Behaviors adiciona funcionalidades extras aos seus models. CakePHP vem
com uma série de behaviors incorporados tal como :php:class:`TreeBehavior`
e :php:class:`ContainableBehavior`.

Para saber mais sobre criação e uso de behaviors, leia a seção
em :doc:`/models/behaviors`.

.. toctree::
    :maxdepth: 2

    core-libraries/behaviors/acl
    core-libraries/behaviors/containable
    core-libraries/behaviors/translate
    core-libraries/behaviors/tree

Bibliotecas do Núcleo
==============

Além dos componentes MVC do núcleo, CakePHP inclui uma grande seleção de utilitários
classes que vão ajudá-lo a fazer tudo a partir de solicitações webservice, para armazenar em cache, para
criar logs, internacionalização e mais.

.. toctree::
    :maxdepth: 2

    core-libraries/logging
    core-libraries/caching
    core-libraries/internationalization-and-localization
    core-utility-libraries/set
    core-utility-libraries/string
    core-utility-libraries/xml
    core-utility-libraries/inflector
    core-utility-libraries/app
    core-utility-libraries/httpsocket
    core-utility-libraries/router
    core-utility-libraries/security
    core-utility-libraries/sanitize
    core-utility-libraries/email
