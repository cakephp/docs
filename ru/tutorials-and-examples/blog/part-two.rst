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

    <!-- Файл: src/Template/Articles/index.ctp -->

    <h1>Статьи блога</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Заголовок</th>
            <th>Дата создания</th>
        </tr>

        <!-- Здесь мы проходимся в цикле по объекту запроса $articles, выводя данные статьи -->

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
которую мы хотим просмотреть. Этот параметр передается в экшен из
запрашиваемого URL. Если пользователь запрашивает адрес ``/articles/view/3``,
то значение '3' передается как ``$id``.

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

Каждый  запрос CakePHP включает в себя объект ``Request`` доступный с использованием
``$this->request``. Объект запроса содержит полезную информацию, касающуюся того
запроса, который был только что получен, и мoжет быть использован для контроля потока
приложения.  В данном случае, мы используем метод :php:meth:`Cake\\Network\\Request::is()`
для проверки того, что запрос является HTTP POST-запросом.

Когда пользователь отправляет данные через форму методом POST, эта информация
становится доступна в свойстве ``$this->request->data``. Вы можете использовать
функцию :php:func:`pr()` или :php:func:`debug()` для распечатки содержимого
этого свойства.

Мы используем методы ``success()`` и ``error()`` Компонента Flash для записи
сообщения в сессионную переменную. Эти методы предоставлены с использованием
возможностей `магических методов PHP
<http://php.net/manual/en/language.oop5.overloading.php#object.call>`_.
Флеш-сообщения будут отображены на странице после редиректа. В лейауте у
нас вызывается метод ``<?= $this->Flash->render() ?>``, который отображает
сообщение и очищает соответствующую сессионную переменную. Метод Контроллера
:php:meth:`Cake\\Controller\\Controller::redirect` выполняет перенаправление
на другой URL. Параметр ``['action' => 'index']`` преобразуется в URL
/articles т.е. к экшену 'index' Контроллера ``ArticlesController``. Вы
можете обратиться к описанию метода :php:func:`Cake\\Routing\\Router::url()`
в `API <https://api.cakephp.org>`_, чтобы просмотреть форматы, в которых
Вы можете определять URL для различных функций CakePHP.

Вызов метода ``save()`` произведет валидацию данных и отменит сохранение,
если выявит при ее выполнении ошибки. Мы обсудим обработку этих ошибок в
следующих разделах.

Валидация данных
================

CakePHP преодолевает огромный путь относительно валидации вводимых в формы
данны. Все ненавидят создание кода для форм и написание бесконечных проверок
для вводимых в них данных.CakePHP делает все это более простым и быстрым.

Чтобы воспользоваться возможностями валидации CakePHP, Вы должны
использовать хелпер по созданию форм в своих Видах :doc:`/views/helpers/form`.
:php:class:`Cake\\View\\Helper\\FormHelper` доступен по умолчанию во всех Видах
как ``$this->Form``.

Вот наш Вид add:

.. code-block:: php

    <!-- Файл: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->input('title');
        echo $this->Form->input('body', ['rows' => '3']);
        echo $this->Form->button(__('Сохранить статью'));
        echo $this->Form->end();
    ?>

Мы используем хелпер форм для создания открывающего тега формы. Вот что
генерирует метод хелпера ``$this->Form->create()``:

.. code-block:: html

    <form method="post" action="/articles/add">

Если ``create()`` вызывается без дополнительных параметров, то
предполагается, что Вы создаете форму, отправляющую данные методом POST
к экшену ``add()`` текущего Контроллера (или же к экшену ``edit()``, если
с данными передается параметр ``id``).

Метод ``$this->Form->input()`` используется для создания полей ввода формы
с соответствующими именами. Первый параметр говорит CakePHP какому полю он
соответствует, второй параметр позволяет вам определять дополнительные настройки
- в данном случае количесво строк для элемента textarea. Здесь также
присутствует немного магии - метод ``input()`` автоматически определяет
нужный тип поля ввода в зависимости от типа данных в поле таблицы.

``$this->Form->end()`` закрывает форму. Создает скрытые поля ввода, если
включена защита от поддельных запросов (CSRF).

Теперь давайте вернемся назад и обновим наш шаблон
**src/Template/Articles/index.ctp**, добавив ссылку "Добавить статью".
Перед тегом ``<table>`` добавим следующую строку::

    <?= $this->Html->link('Добавить статью', ['action' => 'add']) ?>

Вы можете быть удивлены: как CakePHP узнает о нужных нам правилах валидации?
Правила валидации объявляются в Модели. Давайте вернемся к нашей модели
Articles, и внесем некоторые изменения::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }

        public function validationDefault(Validator $validator)
        {
            $validator
                ->notEmpty('title')
                ->requirePresence('title')
                ->notEmpty('body')
                ->requirePresence('body');

            return $validator;
        }
    }

Метод ``validationDefault()`` сообщает CakePHP как проводить валидацию ваших
данных, когда вызывается метод ``save()``. В данном случае мы указываем, что
оба поля (body и title) не должны быть пустыми для всех операций (создания и
обновления). Движок валидации CakePHP является очень мощным, с множеством
встроенных правил(номера кредитных карт, адреса e-mail и т.д.) и гибкостью при
добавлении новых правил. Для более подробной информации смотрите раздел
:doc:`/core-libraries/validation`.

Теперь так как вы указали необходимые правила, попробуйте добавить статью,
оставив пустым поле title, либо поле  body, и посмотрите на них в действии.
Поскольку мы использовали метод
:php:meth:`Cake\\View\\Helper\\FormHelper::input()`, хелпера форм для
создания наших элементов формы, сообщения об ошибках валидации будут
отображаться автоматически.

Редактирование статей
=====================

Редактирование статей - наконец-то мы дошли до этого момента. Теперь вы
уже являетесь профессионалом в CakePHP и можете без проблем догадаться
об общем алгоритме действий. Создайте экшен, затем Вид. Вот на что должен
быть похож экшен ``edit()`` Контроллера ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function edit($id = null)
    {
        $article = $this->Articles->get($id);
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->data);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Ваша статья была обновлена.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Ошибка обновления вашей статьи.'));
        }

        $this->set('article', $article);
    }
    
Данный экшен в первую очередь проверяет, что пользователь пытается получить
доступ к существующей записи. Если параметр ``$id`` не будет передан или
статья окажется несуществующей, мы выбросим исключение ``NotFoundException``
обработчику ошибок CakePHP (ErrorHandler), чтобы он занялся этой проблемой.

Далее экшен проверяет был ли отправленный запрос типа POST или PUT. Если это
так, то мы используем данные POST-запроса для обновления записи с помощью
метода ``patchEntity()``. И наконец мы используем объект таблицы для
сохранения записи, либо же для вывода сообщения об ошибках валидации, если
такие имеются.

Вид edit может выглядеть примерно так:

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Редактирование статьи</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->input('title');
        echo $this->Form->input('body', ['rows' => '3']);
        echo $this->Form->button(__('Сохранить статью'));
        echo $this->Form->end();
    ?>

Этот Вид выводит форму редактирования статьи (с полями заполненными текущими
значениями) наряду с необходимыми об ошибках валидации.

CakePHP определит когда метод ``save()`` генерирует запрос на обновление,
а когда на добавление записи.

Теперь вы можете обновить Вид index, добавив ссылки для редактирования
статей:

.. code-block:: php

    <!-- Файл: src/Template/Articles/index.ctp  (добавлены ссылки редактирования) -->

    <h1>Статьи блога</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- Здесь мы проходимся в цикле по объекту запроса $articles, выводя данные статьи -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Изменить', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>
    
Удаление статей
===============

Теперь давайте дадим пользователям возможность удалять статьи. Начнем с экшена
``delete()`` в Контроллере ``ArticlesController``::

    // src/Controller/ArticlesController.php

    public function delete($id)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->get($id);
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('Статья с id: {0} была удалена.', h($id)));
            return $this->redirect(['action' => 'index']);
        }
    }
    
Здесь мы удаляем статью, определенную параметром ``$id``, и используем
метод ``$this->Flash->success()``, чтобы показать пользователю подтверждение
удаления статьи, после чего перенаправляем его на ``/articles``. Если
пользователь попытается произвести удаление через GET-запрос, метод
``allowMethod()`` выбросит исключение. Неперехваченные исключения захватываются
обработчиком исключений CakePHP, и милое сообщение об ошибке выводится
пользователю. Существует множество встроенных
:doc:`исключений </development/errors>`, которые могут использоваться для
обработки различных ошибок HTTP.

Так как мы просто реализуем некоторую логику в этом экшене, то он не
предусматривает создание какого-либо Вида, а просто выполняет перенаправление.
Как обычно вы можете обновить ваш Вид index, добавив ссылки для удаления статей:

.. code-block:: php

    <!-- Файл: src/Template/Articles/index.ctp (Добавлены ссылки для удаления) -->

    <h1>Статьи блога</h1>
    <p><?= $this->Html->link('Add Article', ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Заголовок</th>
            <th>Дата создания</th>
            <th>Действия</th>
        </tr>

    <!-- Здесь мы проходимся в цикле по объекту запроса $articles, выводя данные статьи -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td><?= $article->id ?></td>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->id]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Form->postLink(
                    'Удалить',
                    ['action' => 'delete', $article->id],
                    ['confirm' => 'Вы уверены?'])
                ?>
                <?= $this->Html->link('Изменить', ['action' => 'edit', $article->id]) ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

Использование метода :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()`
создаст ссылку, которая использует JavaScript для отправки POST-запроса для
удаления нашей статьи.

.. warning::

    Разрешая удаление контента через GET-запросы, вы подвергаете свое 
    приложение риску удаления всех данных злоумышленниками.

.. note::

    Этот код Вида также использует хелпер ``FormHelper`` для запроса
    пользователю с использованием окна подтверждения JavaScript 
    при попытке удаления статьи.

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
