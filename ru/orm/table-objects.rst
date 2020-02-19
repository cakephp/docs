Табличные объекты
#################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Табличные объекты получают доступ к коллекции сущностей, хранящихся в конкретной
таблице. Для взаимодействия с каждой таблицей, в вашем приложение, необходимо
использовать соответствующий класс ``Table``. Если вам не нужно настраивать
поведение данной таблицы, можно полностью положиться на CakePHP, который
сгенерирует необходимый класс.

Перед попыткой использовать табличные объекты и ORM, вы должны убедиться в
правильной конфигурации :ref:`соединения с базой данных <database-configuration>`.

Основное применение
===================

Для начала создайте класс ``Table``. Подобные классы располагаются в
**src/Model/Table**. Классы ``Table`` это коллекция типовых моделей реляционной
базы данных, представляющие основной интерфейс для взаимодействия с вашей базой
данных в CakePHP ORM. Самый простой класс таблицы будет выглядеть следующим
образом::

    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Обратите внимание, мы не сообщили ORM какую таблицу использует наш класс. При
соблюдение :ref:`соглашения о базе данных <model-and-database-conventions>` в
этом нет необходимости. В приведённом выше примере будет использоваться таблица
с именем ``articles``. Если, например, имя таблицы будет ``blog_posts``, то
класс, отвечающий за взаимодействие с ней, будет именоваться ``BlogPostsTable``.
Вы можете указать другое имя таблицы, воспользовавшись методом ``setTable()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->setTable('my_table');

            // До 3.4.0
            $this->table('my_table');
        }

    }

При явном указание таблицы, ORM будет продолжать следовать соглашениям, ожидая
первичного ключа с именем ``id``. Если вам нужно изменить и это, можете
воспользоваться методом ``setPrimaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setPrimaryKey('my_id');
            // До 3.4.0
            $this->primaryKey('my_id');
        }
    }

Настройка класса Entity для использования таблиц
------------------------------------------------

По умолчанию, табличные объекты используют класс ``Entity``, основываясь на
соглашение об именование моделей. Например, если ваш класс таблицы называется
``ArticlesTable``, то класс ``Entity`` должен называться ``Article``. Если класс
таблицы с именем ``PurchaseOrdersTable``, то ``Entity`` класс ``PurchaseOrder``.
Если, однако, вы хотите использовать имя класса ``Entity`` идущее вразрез с
соглашением, вы можете воспользоваться методом ``setEntityClass()`` для смены
имени::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setEntityClass('App\Model\Entity\PO');

            // До 3.4.0
            $this->entityClass('App\Model\Entity\PO');
        }
    }

Как видно из приведенных выше примеров, табличные объекты имеют метод
``initialize()``, который вызывается после метода конструктора. Рекомендуется
использовать этот метод для выполнения логики инициализации, вместо
переопределения конструктора.

Получение экземпляров класса таблицы
------------------------------------

Для взаимодействия с таблицами вашей базы данных, необходимо получить экземпляр
таблицы. Этого можно добиться, используя класс ``TableRegistry``::

    // В контроллере и методе.
    use Cake\ORM\TableRegistry;

    // Prior to 3.6 use TableRegistry::get('Articles')
    $articles = TableRegistry::getTableLocator()->get('Articles');

Класс ``TableRegistry`` предоставляет различные зависимости для построения
таблицы и ведёт реестр всех созданных экземпляров таблиц, что упрощает
построение отношений и настройку ORM. Смотрите раздел :ref:`Использование TableRegistry <table-registry-usage>`,
для получения дополнительной информации.

Если ваш класс таблицы находится в плагине, необходимо использовать корректное
имя класса. Не соблюдение этого правила может привезти к ошибкам. Чтобы этого не
допустить, следуйте следующим примерам::

    // Таблица плагина
    // Prior to 3.6 use TableRegistry::get('PluginName.Articles')
    $articlesTable = TableRegistry::getTableLocator()->get('PluginName.Articles');

    // Таблица плагина с префиксом vendor'а
    // Prior to 3.6 use TableRegistry::get('VendorName/PluginName.Articles')
    $articlesTable = TableRegistry::getTableLocator()->get('VendorName/PluginName.Articles');

.. _table-callbacks:

Обратные вызовы жизненного цикла
================================

Как можно видеть выше, табличные объекты запускают несколько событий. События
полезны, если вы хотите подключиться к ORM и добавить логику без подклассов или
методов переопределения. Слушатели событий могут быть определены в классах
таблиц и поведений. Вы также можете использовать диспетчер событий таблицы для
привязки прослушивателей.

При использовании методов обратного вызова в методе ``initialize()``, они будут
активированы слушателями **до** срабатывания методов обратного вызова таблицы.
Аналогичная ситуация с контроллерами и компонентами.

Чтобы добавить прослушиватель события в класс ``Table`` или ``Behavior``, просто
реализуйте сигнатуры метода как описано ниже. Для ознакомления с дополнительной
информацией, по использованию подсистемы событий, см. :doc:`Система событий </core-libraries/events>`.

Список событий
--------------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.beforeFind``
* ``Model.buildValidator``
* ``Model.buildRules``
* ``Model.beforeRules``
* ``Model.afterRules``
* ``Model.beforeSave``
* ``Model.afterSave``
* ``Model.afterSaveCommit``
* ``Model.beforeDelete``
* ``Model.afterDelete``
* ``Model.afterDeleteCommit``

initialize
----------

.. php:method:: initialize(Event $event, ArrayObject $data, ArrayObject $options)

Событие ``Model.initialize`` запускается после вызова методов конструктора и
инициализации. Классы ``Table``, по умолчанию, не слушают это событие, используя
вместо этого метод ``initialize``.

Для прослушивания и ответа на событие ``Model.initialize``, вы можете
создать класс слушателя, реализующий интерфейс ``EventListenerInterface``::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return array(
                'Model.initialize' => 'initializeEvent',
            );
        }
        public function initializeEvent($event)
        {
            $table = $event->getSubject();
            // сделаем что-нибудь здесь
        }
    }

и присоединить слушателя к глобальному диспетчеру ``EventManager``::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

Это вызовет вызов ``initializeEvent`` любого класса ``Table``.

beforeMarshal
-------------

.. php:method:: beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)

Событие ``Model.beforeMarshal`` запускается до преобразования данных запроса в
объекты. Дополнительная информация, об :ref:`модификации данных запроса перед преобразованием в объекты <before-marshal>`,
доступна в документации.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, $primary)

Событие ``Model.beforeFind`` запускается перед каждой операцией поиска.

Событие ``Model.beforeFind`` вызывается перед каждой операцией поиска.
Остановив событие и снабдив запрос настраиваемым набором результатов, вы
можете полностью обойти операцию поиска::

    public function beforeFind(EventInterface $event, Query $query, ArrayObject $options, $primary)
    {
        if (/* ... */) {
            $event->stopPropagation();
            $query->setResult(new \Cake\Datasource\ResultSetDecorator([]));

            return;
        }
        // ...
    }

В этом примере никакие дальнейшие события ``beforeFind`` не будут инициированы
в связанной таблице или связанных с ней поведениях (хотя события поведения
обычно вызываются раньше, учитывая их приоритеты по умолчанию), и запрос
возвратит пустой набор результатов, который был передан через
``Query::setResult()``.

Остановив событие и предоставив возвращаемое значение, вы можете полностью обойти
операцию поиска. Любые изменения, сделанные для экземпляра ``$query``, будут
сохранены для остальной части поиска. Параметр ``$primary`` служит признаком
корневого запроса, либо связанного с ним запроса. Все ассоциации, участвующие в
запросе, будут запускать событие ``Model.beforeFind``. Для ассоциаций, которые
используют объединения, будет предоставлен mock-запрос. В вашем слушателе событий
вы можете установить дополнительные поля, условия, или объединения. Эти
параметры/функции будут скопированы в корневой запрос.

В предыдущих версиях CakePHP присутствовало событие ``afterFind``, заменённое с
помощью :ref:`изменения результатов с помощью Map/Reduce<map-reduce>` и
конструкторов объекта.

buildValidator
--------------

.. php:method:: buildValidator(Event $event, Validator $validator, $name)

Событие ``Model.buildValidator`` срабатывает после вызова именованных правил
проверки ``$name``, например, ``validationDefault``. Можно использовать эту
функцию для добавления методов проверки.

buildRules
----------

.. php:method:: buildRules(Event $event, RulesChecker $rules)

Событие ``Model.buildRules`` срабатывает после создания экземпляра правил
проверки и после вызова табличного метода ``buildRules()``.

beforeRules
-----------

.. php:method:: beforeRules(Event $event, EntityInterface $entity, ArrayObject $options, $operation)

Событие ``Model.beforeRules`` вызывается до применения правил проверки.
Остановив событие, вы можете завершить проверку и вернуть результат применения
правил.

afterRules
----------

.. php:method:: afterRules(Event $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

Событие ``Model.afterRules`` вызывается после применения правил проверки.
Остановив это событие, вы можете вернуть итоговый результат проверки правил.

beforeSave
----------

.. php:method:: beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)

Событие ``Model.beforeSave`` вызывается перед каждым сохранением объекта.
Остановка данной функции прервёт операцию сохранения, вернув результат события.
:ref:`Остановка событий <stopping-events>` описано в соответствующем разделе
книги.

afterSave
---------

.. php:method:: afterSave(Event $event, EntityInterface $entity, ArrayObject $options)

Событие ``Model.afterSave`` запускается после сохранения объекта.

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)

Событие ``Model.afterSaveCommit`` запускается после транзакции, в которой прошла
операция сохранения. Оно также срабатывает для неатомарных сохранений, где
операции с базой данных неявно совершены. Событие запускается только для
первичной таблицы, для которой непосредственно вызывается метод ``save()``.
Событие не запускается, если транзакция началась до вызова сохранения.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, EntityInterface $entity, ArrayObject $options)

Событие запускается перед удалением объекта. Остановка этого события прервёт
операцию удаления. Когда событие остановлено, возвратится её результат
выполнения. :ref:`Остановка событий <stopping-events>` описано в соответствующем
разделе книги.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, EntityInterface $entity, ArrayObject $options)

Событие ``Model.afterDelete`` запускается после удаления объекта.

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(Event $event, EntityInterface $entity, ArrayObject $options)

Событие ``Model.afterDeleteCommit`` запускается после транзакции, в которой прошла
операция удаления. Оно также срабатывает для неатомарных удаления, где операции с
базой данных неявно совершены. Событие запускается только для первичной таблицы,
для которой непосредственно вызывается метод ``delete()``. Событие не
запускается, если транзакция началась до вызова удаления.

Поведения
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Поведения обеспечивают простой способ использования повторяемых фрагментов кода,
связанных с табличными классами. Возможно, вам интересно почему поведения это
обычные классы, а не трейты. Основная причина в прослушивателях событий. Хотя
трейты позволяют использовать повторно фрагменты логики, они усложнят связанные
события.

Для добавления поведения в таблицу, необходимо вызвать метод ``addBehavior()``.
Как правило, наилучшим местом для этого является метод ``initialize()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Как и в случае с ассоциациями, вы можете использовать :term:`синтаксис плагина <plugin syntax>`
для указания дополнительных параметров конфигурации::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

Вы можете узнать больше о поведениях, включая тех, что входят в ядро CakePHP,
из соответствующего раздела о :doc:`поведениях </orm/behaviors>`.

.. _configuring-table-connections:

Настройка соединений
====================

По умолчанию, все экземпляры таблицы используют ``default`` соединение с базой
данных. Если ваше приложение использует несколько подключений к базе данных, вам
необходимо указать соответствующее соединение, воспользовавшись методом
``defaultConnectionName()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName() {
            return 'replica_db';
        }
    }

.. note::

    Метод ``defaultConnectionName()`` **должен** быть статическим.

.. _table-registry-usage:

Использование TableRegistry
===========================

.. php:class:: TableRegistry

Как мы видели ранее, класс ``TableRegistry`` предоставляет простой способ
использования реестра для доступа к экземплярам таблиц ваших приложений. Он
также предоставляет несколько других полезных функций.

Настройка объектов таблицы
--------------------------

.. php:staticmethod:: get($alias, $config)

При загрузке таблиц из реестра, вы можете изменить их зависимости или
использовать mock-объекты, предоставляя массив ``$options``::

    $articles = TableRegistry::getTableLocator()->get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

Обратите внимание на параметры конфигурации ``connection`` и ``schema``. Они
принимают не строковые значения, а объекты. Соединение будет принимать объект
``Cake\Database\Connection`` и схему ``Cake\Database\Schema\Collection``.

.. note::

    Если ваша таблица также выполняет дополнительные настройки, в своём методе
    ``initialize()``, то эти значения будут перезаписывать те, что были внесены
    в реестр.

Вы также можете предварительно настроить реестр с помощью метода ``config()``.
Данные конфигурации сохраняются для *каждого псевдонима* и могут быть
переопределены методом объекта ``initialize()``::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    Настройка таблицы возможна только до или во время **первого** доступа к
    псевдониму. Выполнение этого после заполнения реестра не приведёт к
    желаемому результату.

.. note::

    Статический API `Cake\ORM\TableRegistry` устарел в CakePHP 3.6.0.
    Вместо этого используйте локатор таблицы.

Очистка реестра
---------------

.. php:staticmethod:: clear()

Во время тестов вам может понадобиться очистить реестр. Это часто полезно, когда
вы используете mock-объекты или изменяете зависимости таблиц::

    TableRegistry::clear();

Настройка пространства имён для расположения ORM классов
--------------------------------------------------------

Если вы не соблюдали соглашения, вероятней всего CakePHP не сможет найти ваши
классы ``Table`` и ``Entity``. Чтобы исправить это, вы можете установить
пространство имён с помощью метода ``Cake\Core\Configure::write``. Например::

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

Для схемы выше будет следующая настройка::

    Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');

