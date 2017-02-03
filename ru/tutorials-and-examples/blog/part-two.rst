Пример создания блога - Часть 2
###############################

Создание Модели статей
======================

Модели - это всё в CakePHP. Создавая Модель для работы с базой данных, мы
создаем фундамент для будущих операций просмотра, редактирования, удаления
данных.

Файлы классов Модели CakePHP подразделяются на объекты ``Таблица`` и
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

Создание Контроллера статей
===========================

Теперь мы создадим Контроллер для наших статей. Контроллер - это то место, где
происходит все взаимодействие со статьями. В двух словах - это место, где Вы
взаимодействуете с бизнес-логикой, содержащейся в моделях и получаете готовый
результат после обработки статей. Мы разместим этот новый контроллер в файле
**ArticlesController.php** внутри папки **src/Controller**. Вот какой должна
быть начальная структура контроллера::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }
    
Давайте добавим экшен в наш контроллер. Экшены часто представляют из себя
отдельные функции или интерфейсы в приложении. Например, когда пользователь
запрашивает адрес www.example.com/articles/index (то же самое, что и 
www.example.com/articles/), он ожидает увидеть список статей. Код этого
экшена должен выглядеть так::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
            $articles = $this->Articles->find('all');
            $this->set(compact('articles'));
        }
    }
    
Объявляя метод ``index()`` в нашем контроллере ``ArticlesController``,
мы даем возможность пользователям получить доступ к логике для
обработки запроса www.example.com/articles/index из адресной строки.
Схожим образом, если бы мы объявили метод ``foobar()``, пользователям
стал бы доступен адрес www.example.com/articles/foobar.

.. warning::

    Вы можете поддаться искушению называть Ваши контроллеры и экшены
    определенным образом, для получения определеных URL. Боритесь с
    этим искушением. Следуйте :doc:`/intro/conventions` (написание с
    заглавной буквы, форма множественного числа и т.д.) и создавайте
    читаемые, понятные имена экшенов. Вы можете назначить правила
    маршрутизации для Ваших адресов используя :doc:`/development/routing`
    рассматриваемый позже.
    
Единственная инструкция в экшене - ``set()`` передает данные от
Контроллера в Вид (который мы создадим позже). Эта строка назначает
переменную Вида, называемую 'articles' совпадающую по названию с
результатом, возвращаемым методом ``find('all')`` объекта ``ArticlesTable``.

.. note::

    Если Вы завершили работу с :doc:`Частью 1 данного руководства
    </tutorials-and-examples/blog/blog>` и создали таблицу ``articles`` в
    базе данных нашего блога для большего удобства Вы можете воспользоваться
    консолью bake CakePHP и ее возможностями генерации кода для создания
    класса контроллера ArticlesController::

        bin/cake bake controller Articles

Чтобы получить больше информации о консоли bake, пожалуйста ознакомьтесь с
:doc:`/bake/usage`.

Чтобы узнать больше о контроллерах CakePHP ознакомьтесь с главой
документации :doc:`/controllers`.

Создание Вида статей
====================

Теперь, когда унас есть наши данные, получаемые из модели и наша логика,
определенная в контроллере, давайте создадим вид для нашего экшена index,
созданного ранее.

Виды CakePHP это просто фрагменты, которые размещаются внутри лейаута нашего
приложения. Для большинства приложений, они представляют собой HTML код
с включениями PHP, но они могут быть оформлены и как XML, CSV, и даже двоичные
данные.

Лейаут это код который оборачивает собой Вид. В приложении может быть
определено множежство лейаутов и Вы можете переключаться между ними, но
пока что давайте использовать лейаут определенный по умолчанию.

Помните как в прошлом разделе мы передали в вид переменную 'articles'
используя метод ``set()``? Таким образом в вид передается коллекция
объекта запроса, которую можно обработать циклом ``foreach``.

Файлы шаблонов CakePHP хранятся в папке **src/Template** в подпапке
названной в соответствии с именем Контроллера (в нашем случае это
'Articles'). Чтобы оформить эти данные о статьях в милую таблицу, наш
код Вида может выглядеть как-то так:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Blog articles</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
    
Надеемся это является не слишком сложным для Вас.

Вы могли заметить использование объекта ``$this->Html``. Это экземпляр класса
CakePHP  :php:class:`Cake\\View\\Helper\\HtmlHelper`. CakePHP содержит в себе
набор хелперов Вида, который значительно упрощает вставку в код страницы таких
элементов, как ссылки, формы и др. Вы можете узнать больше об их использовании
в :doc:`/views/helpers`, но важно отметить, что здесь метод  ``link()``
сгенерирует HTML-ссылку с нужным заголовком (первый параметр) и URL (второй
параметр).

Когда Вы прописываете URL-адреса в CakePHP, желательно использовать формат
массива. Это более детально объясняется в разделе о маршрутизации. Использование
массива для передачи URL позволяет использовать преимущества обратной
маршрутизации CakePHP. Вы можете также определять URL относительно корня вашего
приложения в форме ``/controller/action/param1/param2`` либо использовать
:ref:`именованные маршруты <named-routes>`.

На данный момент вы должны быть способны направить ваш браузер к адресу
http://www.example.com/articles/index. Вы должны видеть ваш вид, корректно
отформатированный с заголовком и таблицей, отображающей список статей.

Если Вам случалось переходить по любой из ссылок, созданных в этом Виде
(которые связывают заголовок статьи с URL ``/articles/view/какой-либо\_id``)
Вы возможно были уведомлены, что экшен еще не был определен. Если же такого
сообщения не было, то это значит, что либо что-то пошло не так, либо Вы
схитрили и уже указали данный экшен. Как бы там ни было, мы создадим данный
экшен в нашем Контроллере ``ArticlesController`` сейчас::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {

        public function index()
        {
             $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id = null)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }
    }

Вызов метода ``set()`` должен быть уже хорошо знаком Вам. Заметьте, мы
используем ``get()`` вместо ``find('all')``, потому что нам на самом деле
нужна информация только об одной конкретной статье.

Обратите внимание, наш экшен 'view' принимает один параметр - ID статьи,
которую мы хотим просмотреть. Этот параметр передается в экшен из запрашиваемого
URL. Если пользователь запрашивает адрес ``/articles/view/3``, то значение
'3' передается как ``$id``.

Мы также осуществляем некоторую обработку ошибок, чтобы удостовериться, что
пользователь на самом деле обращается к существующей записи. Используя метод
``get()`` в таблице Articles, мы можем быть уверены, что пользователь
получит существующую запись. В случае если запрошенной статьи не окажется в
таблице, или id окажется не верным - метод ``get()`` выбросит исключение
``NotFoundException``.

Теперь давайте создадим Вид для нашего нового экшена 'view' и поместим его в
файл **src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>

Проверьте теперь, что все работает попробовав перейти по ссылкам в
``/articles/index`` или вручную запросив статью введя ``/articles/view/{id}``
заменяя ``{id}`` на 'id' статьи.

Добавление статьи
=================

Чтение из Базы данных и отображение статей это неплохое начало, но давайте
добавим возможность создания новых статей.

Во-первых создадим экшен ``add()`` в Контроллере ``ArticlesController``::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Flash'); // Include the FlashComponent
        }

        public function index()
        {
            $this->set('articles', $this->Articles->find('all'));
        }

        public function view($id)
        {
            $article = $this->Articles->get($id);
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->data);
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }
    
.. note::

    Вам понадобится включить компонент :doc:`/controllers/components/flash` в любой
    Контроллер, где Вы собираетесь воспользоваться им. Если это необходимо, включите
    его в Ваш ``AppController``.
    
Вот что делает экшен ``add()``: если методом HTTP-запроса является POST, попытаться
сохранить данные использовав Модель Articles. Если по какой-то причине данные не могут
быть сохранены, просто передать Вид. Это дает нам возможность показать пользователю
ошибки валидации и другие предупреждения.

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
