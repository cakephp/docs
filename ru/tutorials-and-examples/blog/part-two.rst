Пример создания блога - Часть 2
###############################

Создание модели статьи
======================

Модели - это всё в CakePHP. Создавая модель для работы с базой данных, мы
создаем фундамент для будущих операций просмотра, редактирования, удаления
данных.

Файлы классов модели CakePHP подразделяются на объекты ``Таблица`` и
``Сущность`` (Entity).
Объекты ``Таблица`` предоставляют доступ к коллекции сущностей размещенных в
определенной таблице. Они находятся в папке **src/Model/Table**. Класс,
который мы создадим, будет храниться в файле **src/Model/Table/ArticlesTable.php**.
Окончательный его вариант будет иметь следующий вид::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }
    
Соглашения об именовании очень важны в CakePHP. В случае, если мы называем наш
объект таблицы ``ArticlesTable``, CakePHP может автоматически предположить, что
этот объект будет использоваться контроллером ``ArticlesController``, и будет
связан с таблицей базы данных ``articles``.

.. note::

    CakePHP динамически создаст объект модели для Вас если не сможет
    найти нужный файл в  **src/Model/Table**. Это также означает, что
    если Вы случайно неправильно назовете файл (например articlestable.php или
    ArticleTable.php), CakePHP не распознает их и будет использовать вместо
    этого сгенерированную модель.
    
Для более подробной информации о моделях (например валидация данных) ознакомьтесь
с главой руководства :doc:`/orm`.

.. note::

    Если Вы завершили работу с :doc:`Частью 1 данного руководства
    </tutorials-and-examples/blog/blog>` и создали таблицу ``articles`` в
    базе данных нашего блога для большего удобства Вы можете воспользоваться
    консолью bake CakePHP и ее возможностями генерации кода для создания
    модели ``ArticlesTable``::
    
        bin/cake bake model Articles
        
Чтобы получить больше информации о консоли bake, пожалуйста ознакомьтесь с
:doc:`/bake/usage`.

.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.

Рекомендуется к прочтению
-------------------------

These are common tasks people learning CakePHP usually want to study next:

1. :ref:`view-layouts`: Customizing your website layout
2. :ref:`view-elements`: Including and reusing view snippets
3. :doc:`/bake/usage`: Generating basic CRUD code
4. :doc:`/tutorials-and-examples/blog-auth-example/auth`: User authentication
   and authorization tutorial


.. meta::
    :title lang=ru: Blog Tutorial Adding a Layer
    :keywords lang=ru: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
