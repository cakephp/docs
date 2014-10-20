Библиотеки ядра
###############

В CakePHP есть множество встроенных функций и классов, с помощью которых
можно решить большинство типичных задач, необходимых в веб приложениях.

Общее назначения
================

Библиотеки общего назначения доступны и неоднократно используются во 
многих частях CakePHP.

.. toctree::
    :maxdepth: 2

    core-libraries/global-constants-and-functions
    core-libraries/collections

.. _core-components:

Компоненты
==========

CakePHP обладает набором компонентов, с помощью которых вы можете решать простые
задачи в контроллерах. Смотрите раздел :doc:`/controllers/components`, в котором
описаны настройка и использование компонентов.

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

Помощники
=========

В CakePHP входит ряд помощников, которые упрощают создание представления.
Они помогают в создании праильной разметки (включая формы), позволяют легко
форматировать текст, время и числа, и даже могут интегрироваться с 
популярными javascript-библиотеками. Ниже представлен список встроенных
помощников.

Прочтите :doc:`/views/helpers` чтобы узнать подробнее о помощниках, их api
и о том, как создавать и использовать новые помощники.

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

Поведения
=========

Поведения добавляют дополнительный функционал в модели. CakePHP
имеет набор встроенных поведений, таких как: :php:class:`TreeBehavior`
и :php:class:`ContainableBehavior`.

Узнать более подробную информацию о создании и использовании 
поведений вы можете в разделе :doc:`/models/behaviors`.

.. toctree::
    :maxdepth: 2

    core-libraries/behaviors/acl
    core-libraries/behaviors/translate
    core-libraries/behaviors/tree

Библиотеки ядра
===============

Помимо основных компонентов MVC, CakePHP включает в себя большой выбор
классов-утилит, которые помогут сделать все, от запросов на веб-сервис
до кеширования, логирования, интернационализации и многое другое.

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
    core-utility-libraries/file-folder
