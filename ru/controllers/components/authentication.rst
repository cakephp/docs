Аутентификация
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Идентификация, аутентификация и авторизация пользователей является обычной частью
почти каждого веб-приложения. В CakePHP AuthComponent предоставляет
подключаемый способ выполнения этих задач. AuthComponent позволяет комбинировать
объекты аутентификации и объекты авторизации для создания гибких
способов идентификации и проверки авторизации пользователя.

.. _authentication-objects:

Рекомендуется к прочтению
=========================

Настройка аутентификации требует нескольких шагов, включая определение
таблицы пользователей, создание модели, контроллера, видов и т. д.

Это все описывается по шагам в
:doc:`Руководстве по созданию CMS </tutorials-and-examples/cms/authentication>`.

If you are looking for existing authentication and/or authorization solutions
for CakePHP, have a look at the 
`Authentication and Authorization <https://github.com/FriendsOfCake/awesome-cakephp/blob/master/README.md#authentication-and-authorization>`_ section of the Awesome CakePHP list.

.. meta::
    :title lang=ru: Authentication
    :keywords lang=ru: authentication handlers,array php,basic authentication,web application,different ways,credentials,exceptions,cakephp,logging
