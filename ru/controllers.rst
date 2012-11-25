Контроллеры
###########

Контроллер - это буква 'С' в аббревиатуре MVC. После того, как отработал роутинг и 
был найден нужный контроллер, вызывается метод этого контроллера. Ваш контроллер
должен обрабатывать запрос к данным, проверя, что используются правильные модели,
пользователю оправляеися правильный ответ и отображается нужное представление. 
Контроллеры могут рассматриваться как посредники между моделью и представлением. 
Вам нужно стараться сохранять контроллеры "худыми"(избавленными от лишнего кода) 
и всю бизнес логику стараться реализовать в моделях. Это поможет вам с переносимостью 
кода и сделает ваш код более тестируемым.

Как правило, контроллеры используются для управления логикой вокруг одной модели.
Например, если вы создаете сайт какой ни будь онлайн пекарни, у вас наверняка будут контроллеры
RecipesController и/или IngredientsController, которые будут управлять рецептами(recipes) и их
ингредиентами(ingredients). В CakePHP, контроллерам дают название по названию первичной модели, за 
которую они отвечают. Но нет никаких проблем, если в контроллере используется более
одной модели.

Все ваши контроллеры в приложении расширяют класс ``AppController``, который, в свою
очередь, расширяет класс ядра :php:class:`Controller`. Класс AppController
может быть определен в ``/app/Controller/AppController.php`` и он может содержать методы,
доступные всем вашим контроллерам в приложении.

Контроллер содержит некоторые методы, которые называются *экшены(actions)*. Экшены - 
это методы контроллера которые обрабатывают запрос пользователя. По умолчанию все публичные 
методы контроллера это экшены и доступны по url.

.. _app-controller:

Контроллер приложения(App Controller)
=====================================
    
Как было сказано выше, класс AppController родительский класс для 
всех контроллеров приложения. AppController расширяет класс Controller, включенного
в ядро CakePHP. AppController который может быть определен в 
``/app/Controller/AppController.php``. Определение класса::

    class AppController extends Controller {
    }

Атрибуты и методы, созданные в AppController будкт доступны всем контроллерам
приложения. Это идеальное место, для создания кода, общего для всех контроллеров.
Компоненты (о них вы узнаете чуть позже) лучший пример архитектуры кода. Они могут 
использоваться только в определенных контроллерах.

Хотя и применяются нормальные объектно-ориентированные правила наследования, CakePHP
выполняет дополнительную работу, связанную со специальными атрибутами контроллера.
Список компонентов и хелперов, используемых в контроллере, рассматривается отдельно для каждого.
В этом случае, значения из AppController объединяются со значениями из дочерних контроллеров.
Значения в дочерних контроллерах всегда имеют больший приоритет и перезаписывают значения
в AppController.


.. note::
    
    Значения, которые CakePHP обеденяет из AppController с значениями
    в контроллерах приложения:

    -  $components
    -  $helpers
    -  $uses

Незабудьте добавить по умолчанию хелперы Html и Form, если вы переопределяете
переменную ``$helpers`` в вашем AppController.
 
Также, помните, не забудьте вызывать обратные вызовы(callbacks) AppController в обратном вызове в дочернем
контроллере для правильной работы сценария::

    function beforeFilter() {
        parent::beforeFilter();
    }
 
Параметры запроса(Request parameters)
=====================================

При запросе к CakePHP приложению, CakePHP классы :php:class:`Router` и :php:class:`Dispatcher`
используют :ref:`routes-configuration` для нахождения и вызова правильнго контроллера.
Все данные запроса инкапсулированны в объекте запроса. CakePHP складывает всю важную информацию
в свойство ``$this->request``. Больше информации о объекте запроса можно найти в части 
докуметации :doc:`/controllers/request-response`.

Экшены контроллера(Controller actions)
======================================

Вернемся к нашему примеру с онлайн пекарней. Наш RecipesController может содержать
``view()``, ``share()``, и ``search()`` экшены. Это выглядит так::

        
        # /app/Controller/RecipesController.php
        
        class RecipesController extends AppController {
            function view($id) {
                //action logic goes here..
            }
        
            function share($customer_id, $recipe_id) {
                //action logic goes here..
            }
        
            function search($query) {
                //action logic goes here..
            }
        }

Для того, чтобы эффективно использовать контроллеры  в своих приложениях, рассмотрим
некоторые основные атрибуты и методы, предоставляемые базовой архитектурой контроллеров
CakePHP.

.. _controller-life-cycle:

Жизненый цикл запроса и колбеков(Request Life-cycle callbacks)
==============================================================

.. php:class:: Controller

Контроллеры в CakePHP содержат некоторые колбеки, которые позволяют
встроить логику вокруг жизненного цикла запроса:

.. php:method:: beforeFilter()

    Эта функция выполняется до выполнения любого экшена в контроллере.
    Это самое лучшее место для проверки активной сессиии или проверки 
    прав пользователя.

    .. note::
        
        Метод beforeFilter() может быть вызван для несуществующих
        экшенов и scaffolded экшенов.

.. php:method:: beforeRender()
    
    Выполняется после выполнения логики экшена, но до того, как будет рендерится
    представление. Этот колбек не используется очень часто, но очень удобен,
    если вы вызываете метод render() до окончания выполнения всей логики
    экшена.

.. php:method:: afterFilter()
    
    Вызывается после того  как выполнится экшен и после того,
    как рендер выполнится. Этот метод контроллера выполняется самым последним.

В дополнению к жизненому циклу колбеков контролера, :doc:`/controllers/components`
также предоставляют схожий набор колбеков. 

.. _controller-methods:

Методы Контроллера(Controller Methods)
======================================

Для получения информации о всех методах контроллера и их описание посетите 
CakePHP API - `http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

Взфаимодействие с представлениями(Interacting with Views)
---------------------------------------------------------

Существует сного вариантов взаимдействия контроллера с представлением.
Для начала, нужно установить переменные, используя ``set()``. Также, можно выбрать
какой класс представления использовать и какой файл представления должен
быть отображен.

.. php:method:: set(string $var, mixed $value)

    Метод ``set()`` это основной метод для передачи данных от контроллера
    в представление. Когда вы используете ``set()``, то появляется возможность
    использовать эту переменную в представлении::

        // Для начала, передадим данные из контроллера:

        $this->set('color', 'pink');

        // Тепрь вы можете в представлении использовать эти данные:
        ?>

        You have selected <?php echo $color; ?> icing for the cake.
    
    Метод ``set()`` может принимать ассоциативный массив в качестве первого параметра.
    Это быстпый способ передачи больших объемов данных от контроллера к представлению.
    
    .. versionchanged:: 1.3
        Ключи массива не могут быть изменены до их передачи в представление(
        'underscored\_key' больше не становится 'underscoredKey' и т.д.)
        
    ::

        $data = array(
            'color' => 'pink',
            'type' => 'sugar',
            'base_price' => 23.95
        );

        // делаем переменные $color, $type и $base_price 
        // доступными в представлении:

        $this->set($data);  
    
    Аттрибут ``$pageTitle`` больше не существует. Используйте ``set()`` to set
    the title::

        $this->set('title_for_layout', 'Это заголовок страницы');


.. php:method:: render(string $action, string $layout, string $file)
    
    Метод ``render()`` автоматически вызывается при завершении 
    запроса к любому экшену контроллера. Этот метод выполняет всю логику
    представления (используя данные, которые вы передали через метод ``set()``)
    находящуюся внутри представлений и предоставляет ее как ответ на 
    запрос пользователя.

    Дефолтный файл представления определяется по соглашению.
    Для экшена ``search()`` контроллера RecipesController будет отоьражен фаил передставления::

        // /app/View/Recipes/search.ctp
        class RecipesController extends AppController {
        // ...
            function search() {
                // Отображается файл представления /View/Recipes/search.ctp
                $this->render();
            }
        // ...
        }

	 Хотя CakePHP будет автоматически его вызывать (этим вы можете управлять,
	 используя переменную ``$this->autoRender``, которая по умолчанию установленна
	 в true) после того, как отработает вся логика экшена, вы можете указать 
	 специальное представление задав параметр ``$action``.

	 Если параметр ``$action`` начинается с '/' это означает, что файл элемента или
	 представления следует искать в папке ``/app/View``. Это позваляет напрямую указывать
	 какие файлы следует отобразить, что очень удобно, например, при работе с Ajax запросами.
 	 ::

        // Отображается элемент /View/Elements/ajaxreturn.ctp
        $this->render('/Elements/ajaxreturn');

	 Также, можно указывать конкретный файл. который нужно отобразить. Для этого 
	 нужно использовать третий параметр ``$file``. Параметр ``$layout`` позволяет 
	 указывать лаяут в котором будет отображатся представление. 

Отображение конкретных представлений(Rendering a specific view)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

В своем контроллере вам возможно понадобится отоббразить свои представления, отличающиеся
от представлений по умолчанию. Вы можете сделать это вызвав ``render()`` в ручную.
После вызова ``render()`` CakePHP не будет пытаться сделать повторный вызов ``render()`` ::

    class PostsController extends AppController {
        function my_action() {
            $this->render('custom_file');
        }
    }

Этот код отобразит ``app/View/Posts/custom_file.ctp`` вместо 
``app/View/Posts/my_action.ctp``

Управление Потоком(Flow Control)
--------------------------------

.. php:method:: redirect(mixed $url, integer $status, boolean $exit)

    The flow control method you’ll use most often is ``redirect()``.
    This method takes its first parameter in the form of a
    CakePHP-relative URL. When a user has successfully placed an order,
    you might wish to redirect them to a receipt screen.::

        function placeOrder() {
            // Logic for finalizing order goes here
            if ($success) {
                $this->redirect(array('controller' => 'orders', 'action' => 'thanks'));
            } else {
                $this->redirect(array('controller' => 'orders', 'action' => 'confirm'));
            }
        }

	 

    You can also use a relative or absolute URL as the $url argument::

        $this->redirect('/orders/thanks'));
        $this->redirect('http://www.example.com');

    You can also pass data to the action::

        $this->redirect(array('action' => 'edit', $id));

    The second parameter of ``redirect()`` allows you to define an HTTP
    status code to accompany the redirect. You may want to use 301
    (moved permanently) or 303 (see other), depending on the nature of
    the redirect.

    The method will issue an ``exit()`` after the redirect unless you
    set the third parameter to ``false``.

    If you need to redirect to the referer page you can use::

        $this->redirect($this->referer());

.. php:method:: flash(string $message, string $url, integer $pause, string $layout)

    Like ``redirect()``, the ``flash()`` method is used to direct a
    user to a new page after an operation. The ``flash()`` method is
    different in that it shows a message before passing the user on to
    another URL.

    The first parameter should hold the message to be displayed, and
    the second parameter is a CakePHP-relative URL. CakePHP will
    display the ``$message`` for ``$pause`` seconds before forwarding
    the user on.

    If there's a particular template you'd like your flashed message to
    use, you may specify the name of that layout in the ``$layout``
    parameter.

    For in-page flash messages, be sure to check out SessionComponent’s
    setFlash() method.

Callbacks
---------

In addition to the :ref:`controller-life-cycle`.
CakePHP also supports callbacks related to scaffolding.

.. php:method:: beforeScaffold($method)

    $method name of method called example index, edit, etc.

.. php:method:: afterScaffoldSave($method)

    $method name of method called either edit or update.

.. php:method:: afterScaffoldSaveError($method)

    $method name of method called either edit or update.

.. php:method:: scaffoldError($method)

    $method name of method called example index, edit, etc.

Other Useful Methods
--------------------

.. php:method:: constructClasses

    This method loads the models required by the controller. This
    loading process is done by CakePHP normally, but this method is
    handy to have when accessing controllers from a different
    perspective. If you need CakePHP in a command-line script or some
    other outside use, constructClasses() may come in handy.

.. php:method:: referer(mixed $default = null, boolean $local = false)

    Returns the referring URL for the current request. Parameter
    ``$default`` can be used to supply a default URL to use if
    HTTP\_REFERER cannot be read from headers. So, instead of doing
    this::

        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                if ($this->referer() != '/') {
                    $this->redirect($this->referer());
                } else {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }

    you can do this::

        class UserController extends AppController {
            function delete($id) {
                // delete code goes here, and then...
                $this->redirect($this->referer(array('action' => 'index')));
            }
        }

    If ``$default`` is not set, the function defaults to the root of
    your domain - '/'.

    Parameter ``$local`` if set to ``true``, restricts referring URLs
    to local server.

.. php:method:: disableCache

    Used to tell the user’s **browser** not to cache the results of the
    current request. This is different than view caching, covered in a
    later chapter.

    The headers sent to this effect are::

        Expires: Mon, 26 Jul 1997 05:00:00 GMT
        Last-Modified: [current datetime] GMT
        Cache-Control: no-store, no-cache, must-revalidate
        Cache-Control: post-check=0, pre-check=0
        Pragma: no-cache

.. php:method:: postConditions(array $data, mixed $op, string $bool, boolean $exclusive)

    Use this method to turn a set of POSTed model data (from
    HtmlHelper-compatible inputs) into a set of find conditions for a
    model. This function offers a quick shortcut on building search
    logic. For example, an administrative user may want to be able to
    search orders in order to know which items need to be shipped. You
    can use CakePHP's :php:class:`FormHelper` and :php:class:`HtmlHelper`
    to create a quick form based on the Order model. Then a controller action
    can use the data posted from that form to craft find conditions::

        function index() {
            $conditions = $this->postConditions($this->request->data);
            $orders = $this->Order->find('all', compact('conditions'));
            $this->set('orders', $orders);
        }

    If ``$this->request->data['Order']['destination']`` equals "Old Towne Bakery",
    postConditions converts that condition to an array compatible for
    use in a Model->find() method. In this case,
    ``array('Order.destination' => 'Old Towne Bakery')``.

    If you want to use a different SQL operator between terms, supply them
    using the second parameter::

        /*
        Contents of $this->request->data
        array(
            'Order' => array(
                'num_items' => '4',
                'referrer' => 'Ye Olde'
            )
        )
        */

        // Let's get orders that have at least 4 items and contain 'Ye Olde'
        $conditions = $this->postConditions(
            $this->request->data,
            array(
                'num_items' => '>=', 
                'referrer' => 'LIKE'
            )
        );
        $orders = $this->Order->find('all', compact('conditions'));

    The third parameter allows you to tell CakePHP what SQL boolean
    operator to use between the find conditions. Strings like ‘AND’,
    ‘OR’ and ‘XOR’ are all valid values.

    Finally, if the last parameter is set to true, and the $op
    parameter is an array, fields not included in $op will not be
    included in the returned conditions.

.. php:method:: paginate()

    This method is used for paginating results fetched by your models.
    You can specify page sizes, model find conditions and more. See the
    :doc:`pagination <core-libraries/components/pagination>` section for more details on
    how to use paginate.

.. php:method:: requestAction(string $url, array $options)

    This function calls a controller's action from any location and
    returns data from the action. The ``$url`` passed is a
    CakePHP-relative URL (/controllername/actionname/params). To pass
    extra data to the receiving controller action add to the $options
    array.

    .. note::

        You can use ``requestAction()`` to retrieve a fully rendered view
        by passing 'return' in the options:
        ``requestAction($url, array('return'));``. It is important to note
        that making a requestAction using 'return' from a controller method
        can cause script and css tags to not work correctly.

    .. warning::

        If used without caching ``requestAction`` can lead to poor
        performance. It is rarely appropriate to use in a controller or
        model.

    ``requestAction`` is best used in conjunction with (cached)
    elements – as a way to fetch data for an element before rendering.
    Let's use the example of putting a "latest comments" element in the
    layout. First we need to create a controller function that will
    return the data::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            function latest() {
                return $this->Comment->find('all', array('order' => 'Comment.created DESC', 'limit' => 10));
            }
        }

    If we now create a simple element to call that function::

        // View/Elements/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment['Comment']['title'];
        }

    We can then place that element anywhere to get the output
    using::

        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request
    will be made to the controller to get the data, the data will be
    processed, and returned. However in accordance with the warning
    above it's best to make use of element caching to prevent needless
    processing. By modifying the call to element to look like this::

        echo $this->element('latest_comments', array('cache' => '+1 hour'));

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction now takes array based cake style urls::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('return')
        );

    This allows the requestAction call to bypass the usage of
    Router::url which can increase performance. The url based arrays
    are the same as the ones that :php:meth:`HtmlHelper::link()` uses with one
    difference - if you are using named or passed parameters, you must put them
    in a second array and wrap them with the correct key. This is because
    requestAction merges the named args array (requestAction's 2nd parameter)
    with the Controller::params member array and does not explicitly place the
    named args array into the key 'named'; Additional members in the ``$option``
    array will also be made available in the requested action's
    Controller::params array::
        
        echo $this->requestAction('/articles/featured/limit:3');
        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'featured'),
            array('named' => array('limit' => 3))
        );

        echo $this->requestAction(
            array('controller' => 'articles', 'action' => 'view'),
            array('pass' => array(5))
        );

    .. note::

        Unlike other places where array urls are analogous to string urls,
        requestAction treats them differently.

    When using an array url in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, named and pass parameters must be done
    in the second array as seen above.


.. php:method:: loadModel(string $modelClass, mixed $id)

    The ``loadModel`` function comes handy when you need to use a model
    which is not the controller's default model or its associated
    model::
    
        $this->loadModel('Article');
        $recentArticles = $this->Article->find('all', array('limit' => 5, 'order' => 'Article.created DESC'));

        $this->loadModel('User', 2);
        $user = $this->User->read();


Controller Attributes
=====================

For a complete list of controller attributes and their descriptions
visit the CakePHP API. Check out
`http://api20.cakephp.org/class/controller <http://api20.cakephp.org/class/controller>`_.

.. php:attr:: name

    The ``$name`` attribute should be set to the
    name of the controller. Usually this is just the plural form of the
    primary model the controller uses. This property is not required,
    but saves CakePHP from inflecting it::

        // $name controller attribute usage example
        class RecipesController extends AppController {
           public $name = 'Recipes';
        }
        

$components, $helpers and $uses
-------------------------------

The next most often used controller attributes tell CakePHP what
helpers, components, and models you’ll be using in conjunction with
the current controller. Using these attributes make MVC classes
given by ``$components`` and ``$uses`` available to the controller
as class variables (``$this->ModelName``, for example) and those
given by ``$helpers`` to the view as an object reference variable
(``$this->{$helpername}``).

.. note::

    Each controller has some of these classes available by default, so
    you may not need to configure your controller at all.

.. php:attr:: uses

    Controllers have access to their primary model available by
    default. Our RecipesController will have the Recipe model class
    available at ``$this->Recipe``, and our ProductsController also
    features the Product model at ``$this->Product``. However, when
    allowing a controller to access additional models through the
    ``$uses`` variable, the name of the current controller's model must
    also be included. This is illustrated in the example below.

    If you do not wish to use a Model in your controller, set
    ``public $uses = array()``. This will allow you to use a controller
    without a need for a corresponding Model file.

.. php:attr:: helpers

    The Html, Form, and Session Helpers are available by
    default, as is the SessionComponent. But if you choose to define
    your own ``$helpers`` array in AppController, make sure to include
    ``Html`` and ``Form`` if you want them still available by default
    in your Controllers. To learn more about these classes, be sure
    to check out their respective sections later in this manual.

    Let’s look at how to tell a CakePHP controller that you plan to use
    additional MVC classes::

        class RecipesController extends AppController {
            public $uses = array('Recipe', 'User');
            public $helpers = array('Js');
            public $components = array('RequestHandler');
        }

    Each of these variables are merged with their inherited values,
    therefore it is not necessary (for example) to redeclare the Form
    helper, or anything that is declared in your App controller.

.. php:attr:: components

    The components array allows you to set which :doc:`/controllers/components`
    a controller will use.  Like ``$helpers`` and ``$uses`` components in your 
    controllers are merged with those in ``AppController``.  As with
    ``$helpers`` you can pass settings into components.  See :ref:`configuring-components`
    for more information.

Other Attributes
----------------

While you can check out the details for all controller attributes
in the API, there are other controller attributes that merit their
own sections in the manual.

.. php:attr: cacheAction

    The cacheAction attribute is used to define the duration and other
    information about full page caching.  You can read more about
    full page caching in the :php:class:`CacheHelper` documentation.

.. php:attr: paginate

    The paginate attribute is a deprecated compatibility property.  Using it
    loads and configures the :php:class:`PaginatorComponent`.  It is recommended
    that you update your code to use normal component settings::

        class ArticlesController extends AppController {
            public $components = array(
                'Paginator' => array(
                    'Article' => array(
                        'conditions' => array('published' => 1)
                    )
                )
            );
        }

.. todo::

    This chapter should be less about the controller api and more about
    examples, the controller attributes section is overwhelming and difficult to
    understand at first. The chapter should start with some example controllers
    and what they do.

More on controllers
===================

.. toctree::

    controllers/request-response
    controllers/scaffolding
    controllers/pages-controller
    controllers/components


.. meta::
    :title lang=en: Controllers
    :keywords lang=en: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
