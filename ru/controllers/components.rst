Компоненты
##########

Компоненты представляют собой пакеты логики, которые совместно используются контроллерами.
CakePHP поставляется с фантастическим набором основных компонентов, которые вы можете использовать для
различных общих задач. Вы также можете создавать свои собственные компоненты. 
Если у вас есть одинаковые участки кода, которые нужно скопировать и вставить в разные контроллеры, то, вы должны
подумать над созданием своего собственного компонента для обеспечения этой функциональности. Создание
компонента сохраняет код контроллера чистым и позволяет повторно использовать код в
разных контроллерами.

Для получения дополнительной информации о компонентах, включенных в CakePHP, посмотрите
главы для каждого компонента:

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/cookie
    /controllers/components/csrf
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling

.. _configuring-components:

Настройка компонентов
=====================

Многие из основных компонентов требуют конфигурации. Вот некоторые примеры компонентов
требующие конфигурации :doc:`/controllers/components/authentication` и
:doc:`/controllers/components/cookie`. Конфигурация для этих компонентов,
и для компонентов в целом обычно выполняется с помощью ``loadComponent()`` в
методе ``initialize()`` вашего контроллера или в массиве ``$components``::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
                'loginAction' => ['controller' => 'Users', 'action' => 'login']
            ]);
            $this->loadComponent('Cookie', ['expires' => '1 day']);
        }

    }

Вы можете настроить компоненты во время выполнения с помощью метода ``config()``. Часто,
это делается в методе ``beforeFilter()`` вашего контроллера. Вышеизложенное может
выражаться так::

    public function beforeFilter(Event $event)
    {
        $this->Auth->config('authorize', ['controller']);
        $this->Auth->config('loginAction', ['controller' => 'Users', 'action' => 'login']);

        $this->Cookie->config('name', 'CookieMonster');
    }

Как и помощники(хелперы), компоненты реализуют метод ``config()``, который используется для установики и 
получения любых данных конфигурации для компонента::

    // Чтение данных конфигурации.
    $this->Auth->config('loginAction');

    // Установка конфигурации
    $this->Csrf->config('cookieName', 'token');

Как и с помощниками, компоненты автоматически объединяют своё свойство ``$_defaultConfig``
с конфигурацией конструктора для создания свойства ``$_config``,
которое доступно с помощью метода ``config()``.

Псевдонимы компонентов
----------------------

Одной из общих настроек для использования является опция ``className``, которая позволяет вам
использовать псевдонимы. Эта функция полезна, если вы хотите заменить ``$this->Auth`` или другую общую ссылку
на компонент - своей пользовательской реализацией::

    // src/Controller/PostsController.php
    class PostsController extends AppController
    {
        public function initialize()
        {
            $this->loadComponent('Auth', [
                'className' => 'MyAuth'
            ]);
        }
    }

    // src/Controller/Component/MyAuthComponent.php
    use Cake\Controller\Component\AuthComponent;

    class MyAuthComponent extends AuthComponent
    {
        // Добавьте сюда свой код для переопределения ядра AuthComponent
    }

Вышеупомянутый *псевдоним* ``MyAuthComponent`` для ``$this->Auth`` бедет доступен во всех ваших
контроллерах.

.. note::

    Псевдоним компонента заменяет этот экземпляр в любом месте этого компонента,
    включая другие компоненты.

Загрузка компонентов на лету
----------------------------

Возможно, вам не нужно, чтобы все ваши компоненты, были доступны во всех методах(экшенах) 
контроллера. В таких ситуациях вы можете загрузить компонент во время выполнения, используя
метод ``loadComponent()`` в вашем контроллере::

    // В определённом методе контроллера
    $this->loadComponent('OneTimer');
    $time = $this->OneTimer->getTime();

.. note::

	Имейте в виду, что компоненты, загруженные «на лету», не будут пропущены через обратные вызовы. Если вы нуждаетесь в обратных вызовах (колбэках) ``beforeFilter`` или ``startup``, вам может потребоваться вызвать их вручную, в зависимости от того, когда вы загружаете свой компонент.
Использование компонентов
=========================

После того, как вы включили некоторые компоненты в свой контроллер, использование их довольно
просто. Каждый компонент, который вы используете, отображается как свойство в вашем контроллере. Если
вы загрузили :php:class:`Cake\\Controller\\Component\\FlashComponent`
в вашем контроллере вы можете получить доступ к нему следующим образом::

    class PostsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Flash');
        }

        public function delete()
        {
            if ($this->Post->delete($this->request->getData('Post.id')) {
                $this->Flash->success('Post deleted.');
                return $this->redirect(['action' => 'index']);
            }
        }

.. note::

	Поскольку как модель, так и компонент добавляются к контроллерам как свойства и имеют одно и то же 'namespace' (пространство имён), важно не дать компоненту и модели одинаковое имя.

.. _creating-a-component:

Создание компонента
===================

Предположим, что нашему приложению необходимо выполнить сложную и одинаковую математическую
операцию во многих разных частях приложения. Мы можем создать компонент для размещения
этой общей логики для использования во многих разных контроллерах.

Первый шаг - создать новый компонентный файл и класс. Создайте файл в
**src/Controller/Component/MathComponent.php**. Основная структура
компонента будет выглядеть примерно так::

    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class MathComponent extends Component
    {
        public function doComplexOperation($amount1, $amount2)
        {
            return $amount1 + $amount2;
        }
    }

.. note::

	Все компоненты должны размещаться в :php:class:`Cake\\Controller\\Component`.
	Ошибка размещения компонента вызовет исключение.

Подключение вашего компонента в контроллеры
-------------------------------------------

Как только ваш компонент будет закончен, вы сможем использовать его в
контроллерах, загрузив его в методе ``initialize()``.
После загрузки контроллеру будет присвоен новый атрибут, названный в честь
компонента, через который мы можем получить доступ к его экземпляру::

	// В контроллере
    // Создаем новый компонент в $this->Math,
    // а также стандартный $this->Csrf
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Math');
        $this->loadComponent('Csrf');
    }

При включении компонентов в контроллер, вы также можете объявить
набор параметров, которые будут переданы компоненту
конструктором. Эти параметры затем могут обрабатываться
компонентом::

    // В вашем контроллере
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Math', [
            'precision' => 2,
            'randomGenerator' => 'srand'
        ]);
        $this->loadComponent('Csrf');
    }

Вышеизложенное передало бы массив, содержащий точность и randomGenerator в
метод ``MathComponent::initialize()``, в параметре ``$config``.

Использование других компонентов в вашем компоненте
---------------------------------------------------

Иногда, одному из ваших компонентов может понадобиться использование другого компонента.
В этом случае вы можете включить другие компоненты в свой компонент точно так же, как
вы включаете их в контроллеры - с помощью переменной ``$components``::

    // src/Controller/Component/CustomComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class CustomComponent extends Component
    {
        // Другой компонент, используемый вашим компонентом
        public $components = ['Existing'];

        // Выполните любую другую дополнительную настройку для своего компонента.
        public function initialize(array $config)
        {
            $this->Existing->foo();
        }

        public function bar()
        {
            // ...
        }
    }

    // src/Controller/Component/ExistingComponent.php
    namespace App\Controller\Component;

    use Cake\Controller\Component;

    class ExistingComponent extends Component
    {

        public function foo()
        {
            // ...
        }
    }

.. note::

	В отличие от компонента, включенного в контроллер, никакие обратные вызовы не будут инициированы на компоненте компонента.


Доступ к компонентам контроллера
--------------------------------

Внутри компонента вы можете получить доступ к текущему контроллеру через
'реестр'::

    $controller = $this->_registry->getController();

Вы можете получить доступ к контроллеру в любом методе обратного вызова из события
объекта::

    $controller = $event->getSubject();

Обратные вызовы компонента
==========================

Компоненты также предлагают несколько обратных вызовов жизненного цикла запроса, которые позволяют им
увеличить цикл запроса.

.. php:method:: beforeFilter(Event $event)

    Вызывается перед методом beforeFilter() контроллеров,
    но *после* метода initialize().

.. php:method:: startup(Event $event)

    Вызывается после метода beforeFilter() контроллеров,
    но до того, как контроллер выполнит текущее действие обработчика.

.. php:method:: beforeRender(Event $event)

    Вызывается после того, как контроллер выполняет логику запрошенного действия,
    но до того, как контроллер отобразит представления и макет.

.. php:method:: shutdown(Event $event)

    Вызывается до вывода в браузер.

.. php:method:: beforeRedirect(Event $event, $url, Response $response)

    Вызывается когда методом контроллера осуществляет перенаправление, но перед любым
    дальнейшим действием. Если этот метод возвращает ``false``, контроллер не будет 
    продолжать перенаправлять запрос. Параметры $url и $response позволяют вам проверять
    и изменять местоположение или любые другие заголовки в ответе.

.. meta::
    :title lang=ru: Components
    :keywords lang=ru: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
