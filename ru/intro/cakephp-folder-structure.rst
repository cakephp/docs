Структура папок CakePHP
#######################

После того, как Вы скачали и распаковали приложение CakePHP, Вы должны увидеть
следующие папки и файлы:

- bin
- config
- logs
- plugins
- src
- tests
- tmp
- vendor
- webroot
- .htaccess
- composer.json
- index.php
- README.md

Вы заметите несколько папок верхнего уровня:

- Папка *bin* содержит приложения консоли Cake.
- Папка *config* содержит (некоторые) файлы :doc:`/development/configuration` 
  используемые CakePHP. Настройки подключения к БД, автоконфигурацию, файлы
  настроек ядра и многое другое.
- Папка *plugins* содержит :doc:`/plugins` Вашего приложения.
- Папка *logs* содержит Ваши файлы журналов, в зависимости от настроек
  журналирования.
- Папка *src* - это место, в котором будет происходить вся Ваша магия: здесь 
  будут размещаться все файлы Вашего приложения.
- Папка *tests* будет содержать систему тестирования Вашего приложения.
- Папка *tmp* содержит временные файлы. Хранимые данные зависят от настроек 
  CakePHP, но обычно там хранятся например данные сессий.
- Папка *vendor* хранит данные о зависимостях приложения, используется при 
  установке различных библиотек. Убедительная просьба **не** трогать файлы в 
  этой папке. Мы не сможем Вам помочь если Вы нарушите работу ядра фреймворка.
- Папка *webroot* это публичная папка Вашего приложения. Она содержит в себе
  все стили, картинки, скрипты и тому подобное.


  Убедитесь что папки *tmp* и *logs* существуют и доступны для записи, в
  противном случае производительность Вашего приложения может пострадать.
  В режиме отладки, CakePHP предупредит Вас, если с этими папками есть какие-то
  проблемы.
  
.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.

.. meta::
    :title lang=ru: Структура папок CakePHP
    :keywords lang=ru: internal libraries,конфигурация ядра,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
