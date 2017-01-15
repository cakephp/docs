Соглашения CakePHP
##################

Мы являемся большими поклонниками принципа "соглашения превыше конфигурации".
Несмотря на то, что изучение соглашений CakePHP занимает какое-то врем, их знание
сэкономит Вам огромное количество времени в будущем. Следуя соглашениям, Вы 
получаете готовую функциональность без необходимости написания дополнительных
настрооек. Также соглашения упрощают процесс совместной разработки, позволяя без
особых проблем другим разработчикам присоединиться к Вашему проекту, не вникая во
все тонкости его реализации.

Соглашения контроллера
======================

Имена классов контроллера обычно пишутся во множественном числе, c использованием
ВерблюжьегоСинтаксиса и оканчиваются на слово ``Controller``. К примеру такие имена,
как ``UsersController`` и ``ArticleCategoriesController`` хорошо соответствуют
соглашениям.

Публичные методы Контроллеров часто становятся так называемыми 'экшенами',
доступными через веб-браузер. К примеру такая часть URL-адреса ``/users/view``
по умолчанию соответствует методу ``view()`` контроллера ``UsersController``.
Защищенные (protected) или закрытые (private) методы не доступны системе роутинга.

.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.

.. _model-and-database-conventions:

Соглашения модели и базы данных
===============================

.. meta::
    :title lang=ru: CakePHP Conventions
    :keywords lang=ru: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,articles,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
