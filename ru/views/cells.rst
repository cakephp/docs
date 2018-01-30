Ячейки Представления
####################

Ячейки Представления - это небольшие мини-контроллеры, которые могут вызывать
логику представления и выводить результат в шаблоны. Данная идея позаимствована
от `ячеек в Ruby <https://github.com/apotonick/cells>`_, где они играют схожую
роль и приследуют схожие цели.

Когда использовать ячейки
=========================

Ячейки идеально подходят для создания повторно используемых компонентов
страницы, которые требуют взаимодействия с моделями, логикой представления и
логикой визуализации. Простым примером может служить корзина в 
интернет-магазине или навигационное меню, зависящее от данных в CMS.

Создание ячеек
==============

Чтобы создать ячейку, определите класс в **src/View/Cell** и шаблон в
**src/Template/Cell/**. В этом примере мы создадим ячейку для отображения
количества сообщений в почтовом ящике уведомлений пользователя. Сначала
создайте файл класса. Его содержимое должно выглядеть так::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
        }

    }

Сохраните этот файл как **src/View/Cell/InboxCell.php**. Как вы можете заметить,
подобно другим классам в CakePHP, Ячейки имеют несколько соглашений:

* Ячейки располагаются в пространстве имен ``App\View\Cell``. Если вы создаете
  ячейку в плагине, пространство имен должно быть вида ``PluginName\View\Cell``.
* Имена классов должны оканчиваться на ``Cell``.
* Классы должны наследоваться от ``Cake\View\Cell``.

Мы добавили пустой метод ``display()`` в нашу ячейку; это традиционный метод
по умолчанию при рендеринге ячейки. Мы рассмотрим, как использовать другие методы
позже в документации. Теперь создайте файл **src/Template/Cell/Inbox/display.ctp**.
Это будет наш шаблон для нашей новой ячейки.

Мы можем быстро сгенерировать эту заготовку кода, используя ``bake``::

    bin/cake bake cell Inbox

Это создаст код, аналогичный тому, что мы описали выше.

Реализация Ячеек
================

Предположим, что мы работаем над приложением, которое позволяет пользователям
отправлять сообщения друг другу. У нас есть модель ``Messages``, и мы хотим
показать количество непрочитанных сообщений, не засоряя AppController. Это
идеальный вариант использования для ячейки. В классе, который мы только что
создали, добавьте следующее::

    namespace App\View\Cell;

    use Cake\View\Cell;

    class InboxCell extends Cell
    {

        public function display()
        {
            $this->loadModel('Messages');
            $unread = $this->Messages->find('unread');
            $this->set('unread_count', $unread->count());
        }

    }

Поскольку ячейки используют ``ModelAwareTrait`` и ``ViewVarsTrait``, их поведение
очень схоже с поведением контроллера. Мы можем использовать методы
``loadModel()`` и ``set()`` точно так же, как в контроллере. В нашем файле шаблона
добавьте следующее::

    <!-- src/Template/Cell/Inbox/display.ctp -->
    <div class="notification-icon">
        У вас <?= $unread_count ?> непрочитанных сообщений.
    </div>

.. note::

    Шаблоны ячеек имеют изолированную область видимости
    
    Cell templates have an isolated scope that does not share the same View
    instance as the one used to render template and layout for the current
    controller action or other cells. Hence they are unaware of any helper calls
    made or blocks set in the action's template / layout and vice versa.

Загрузка ячеек
==============

Cells can be loaded from views using the ``cell()`` method and works the same in
both contexts::

    // Load an application cell
    $cell = $this->cell('Inbox');

    // Load a plugin cell
    $cell = $this->cell('Messaging.Inbox');

The above will load the named cell class and execute the ``display()`` method.
You can execute other methods using the following::

    // Run the expanded() method on the Inbox cell
    $cell = $this->cell('Inbox::expanded');

If you need controller logic to decide which cells to load in a request, you can
use the ``CellTrait`` in your controller to enable the ``cell()`` method there::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\View\CellTrait;

    class DashboardsController extends AppController
    {
        use CellTrait;

        // More code.
    }

Passing Arguments to a Cell
===========================

You will often want to parameterize cell methods to make cells more flexible.
By using the second and third arguments of ``cell()``, you can pass action
parameters and additional options to your cell classes, as an indexed array::

    $cell = $this->cell('Inbox::recent', ['-3 days']);

The above would match the following function signature::

    public function recent($since)
    {
    }

Rendering a Cell
================

Once a cell has been loaded and executed, you'll probably want to render it. The
easiest way to render a cell is to echo it::

    <?= $cell ?>

This will render the template matching the lowercased and underscored version of
our action name, e.g. **display.ctp**.

Because cells use ``View`` to render templates, you can load additional cells
within a cell template if required.

.. note::

    Echoing a cell uses the PHP ``__toString()`` magic method which prevents PHP
    from showing the filename and line number for any fatal errors raised. To
    obtain a meanful error message, it is recommended to use the
    ``Cell::render()`` method, for example ``<?= $cell->render() ?>``.

Rendering Alternate Templates
-----------------------------

By convention cells render templates that match the action they are executing.
If you need to render a different view template, you can specify the template
to use when rendering the cell::

    // Calling render() explicitly
    echo $this->cell('Inbox::recent', ['-3 days'])->render('messages');

    // Set template before echoing the cell.
    $cell = $this->cell('Inbox');
    $cell->viewBuilder()->setTemplate('messages');
    // Before 3.4
    $cell->viewBuilder()->template('messages');
    // Before 3.1
    $cell->template = 'messages';
    echo $cell;

Caching Cell Output
-------------------

When rendering a cell you may want to cache the rendered output if the contents
don't change often or to help improve performance of your application. You can
define the ``cache`` option when creating a cell to enable & configure caching::

    // Cache using the default config and a generated key
    $cell = $this->cell('Inbox', [], ['cache' => true]);

    // Cache to a specific cache config and a generated key
    $cell = $this->cell('Inbox', [], ['cache' => ['config' => 'cell_cache']]);

    // Specify the key and config to use.
    $cell = $this->cell('Inbox', [], [
        'cache' => ['config' => 'cell_cache', 'key' => 'inbox_' . $user->id]
    ]);

If a key is generated the underscored version of the cell class and template
name will be used.

.. note::

    A new ``View`` instance is used to render each cell and these new objects
    do not share context with the main template / layout. Each cell is
    self-contained and only has access to variables passed as arguments to the
    ``View::cell()`` call.

Paginating Data inside a Cell
=============================

Creating a cell that renders a paginated result set can be done by leveraging
the ``Paginator`` class of the ORM. An example of paginating a user's favorite
messages could look like::

    namespace App\View\Cell;

    use Cake\View\Cell;
    use Cake\Datasource\Paginator;

    class FavoritesCell extends Cell
    {
        public function display($user)
        {
            $this->loadModel('Messages');

            // Create a paginator
            $paginator = new Paginator();

            // Paginate the model
            $results = $paginator->paginate(
                $this->Messages,
                $this->request->getQueryParams(),
                [
                    // Use a parameterized custom finder.
                    'finder' => ['favorites' => [$user]],

                    // Use scoped query string parameters.
                    'scope' => 'favorites',
                ]
            );

            $paging = $paginator->getPagingParams() + (array)$request->getParam('paging');
            $this->request = $this->request->withParam('paging', $paging));

            $this->set('favorites', $results);
        }
    }

The above cell would paginate the ``Messages`` model using :ref:`scoped
pagination parameters <paginating-multiple-queries>`.

.. versionadded:: 3.5.0
    ``Cake\Datasource\Paginator`` was added in 3.5.0.

Cell Options
============

Cells can declare constructor options that are converted into properties when
creating a cell object::

    namespace App\View\Cell;

    use Cake\View\Cell;
    use Cake\Datasource\Paginator;

    class FavoritesCell extends Cell
    {
        protected $_validCellOptions = ['limit'];

        protected $limit = 3;

        public function display($userId)
        {
            $this->loadModel('Users');
            $result = $this->Users->find('friends', ['for' => $userId]);
            $this->set('favorites', $result);
        }
    }

Here we have defined a ``$limit`` property and add ``limit`` as a cell option.
This will allow us to define the option when creating the cell::

    $cell = $this->cell('Favorites', [$user->id], ['limit' => 10])

Cell options are handy when you want data available as properties allowing you
to override default values.
