Безопасность
############

.. php:class:: SecurityComponent(ComponentCollection $collection, array $config = [])

Компонент ``Security`` создает простой способ интегрировать повышенную
безопасность в ваше приложение. Он предоставляет методы для различных задач,
таких как:

* Ограничение принимаемых вашим приложением HTTP-методов.
* Защита от несанкционированного доступа к формам
* Требование использования SSL.
* Ограничение межконтроллерного взаимодействия.

Как и все компоненты, он настраивается с помощью нескольких изменяемых
параметров. Все эти параметры могут быть установлены непосредственно, либо
с помощью методов-сеттеров, имеющих такие же названия, в методе
``beforeFilter()`` вашего контроллера.

Используя компонент ``Security``, вы автоматически получаете защиту от
несанкционированного доступа. Скрытые поля токена автоматически вставляются в
формы и проверяются компонентом Security.

Если вы используете возможности по защите форм компонента ``Security``, а
также другие компоненты, обрабатывающие данные формы внутри их методов
обратного вызова ``startup()``, убедитесь, что компонент ``Security``
располагается перед всеми остальными компонентами в вашем методе
``initialize()``.

.. note::

    При использовании компонента ``Security`` вы **должны** использовать
    FormHelper для создания ваших форм. Кроме того, вы **не** должны
    переопределять любые атрибуты "name" полей формы. Компонент ``Security``
    ищет определенные индикаторы, которые создаются и управляются ``FormHelper``
    (особенно те, которые создаются в
    :php:meth:`~Cake\\View\\Helper\\FormHelper::create()` и
    :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`). Динамическое изменение
    полей, отправленных в запросе POST (например, отключение, удаление или
    создание новых полей через JavaScript), скорее всего, приведет к отправке
    запроса на blackhole-коллбэк.
    
    Вы всегда должны проверять используемый HTTP-метод перед выполнением во
    избежание возможных побочных эффектов. Вы должны
    :ref:`проверять HTTP-метод <check-the-request>` либо использовать 
    :php:meth:`Cake\\Http\\ServerRequest::allowMethod()`, чтобы убедиться в том,
    что используется правильный HTTP-метод.

Обработка Blackhole-коллбэков
=============================

.. php:method:: blackHole(object $controller, string $error = '', SecurityException $exception = null)

Если запрос ограничен компонентом ``Security``, то он будет поглощен
('black-holed') как неверный запрос, который будет возвращать ошибку 400 по
умолчанию. Вы можете настроить это поведение установив в качестве значения
параметра ``blackHoleCallback`` имя коллбэк-функции в контроллере.

Вы можете управлять этим процессом поглощения, задав необходимую
коллбэк-функцию::

    public function beforeFilter(Event $event)
    {
        $this->Security->setConfig('blackHoleCallback', 'blackhole');
    }

    public function blackhole($type)
    {
        // Здесь обрабатываются ошибки.
    }

.. note::

    Используйте метод ``$this->Security->config()`` для версий CakePHP
    ниже 3.4

The ``$type`` parameter can have the following values:

* 'auth' Indicates a form validation error, or a controller/action mismatch
  error.
* 'secure' Indicates an SSL method restriction failure.

.. versionadded:: cakephp/cakephp 3.2.6

    As of v3.2.6 an additional parameter is included in the blackHole callback,
    an instance of the ``Cake\Controller\Exception\SecurityException`` is
    included as a second parameter.

Restrict Actions to SSL
=======================

.. php:method:: requireSecure()

    Sets the actions that require a SSL-secured request. Takes any
    number of arguments. Can be called with no arguments to force all
    actions to require a SSL-secured.

.. php:method:: requireAuth()

    Sets the actions that require a valid Security Component generated
    token. Takes any number of arguments. Can be called with no
    arguments to force all actions to require a valid authentication.

Restricting Cross Controller Communication
==========================================

allowedControllers
    A list of controllers which can send requests
    to this controller.
    This can be used to control cross controller requests.
allowedActions
    A list of actions which are allowed to send requests
    to this controller's actions.
    This can be used to control cross controller requests.

These configuration options allow you to restrict cross controller
communication. Set them with the ``setConfig()`` method, or
``config()`` if you are using a CakePHP version below 3.4.

Form Tampering Prevention
=========================

By default the ``SecurityComponent`` prevents users from tampering with forms in
specific ways. The ``SecurityComponent`` will prevent the following things:

* Unknown fields cannot be added to the form.
* Fields cannot be removed from the form.
* Values in hidden inputs cannot be modified.

Preventing these types of tampering is accomplished by working with the FormHelper
and tracking which fields are in a form. The values for hidden fields are
tracked as well. All of this data is combined and turned into a hash. When
a form is submitted, the ``SecurityComponent`` will use the POST data to build the same
structure and compare the hash.

.. note::

    The SecurityComponent will **not** prevent select options from being
    added/changed. Nor will it prevent radio options from being added/changed.

unlockedFields
    Set to a list of form fields to exclude from POST validation. Fields can be
    unlocked either in the Component, or with
    :php:meth:`FormHelper::unlockField()`. Fields that have been unlocked are
    not required to be part of the POST and hidden unlocked fields do not have
    their values checked.

validatePost
    Set to ``false`` to completely skip the validation of POST
    requests, essentially turning off form validation.

The above configuration options can be set with ``setConfig()`` or
``config()`` for CakePHP versions below 3.4.

Usage
=====

Using the security component is generally done in the controllers
``beforeFilter()``. You would specify the security restrictions you
want and the Security Component will enforce them on its startup::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }
    }

The above example would force all actions that had admin routing to
require secure SSL requests::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security', ['blackHoleCallback' => 'forceSSL']);
        }

        public function beforeFilter(Event $event)
        {
            if ($this->request->getParam('admin')) {
                $this->Security->requireSecure();
            }
        }

        public function forceSSL()
        {
            return $this->redirect('https://' . env('SERVER_NAME') . $this->request->getRequestTarget());
        }
    }

Note: use ``$this->request->here()`` for CakePHP versions prior to 3.4.0

This example would force all actions that had admin routing to require secure
SSL requests. When the request is black holed, it will call the nominated
``forceSSL()`` callback which will redirect non-secure requests to secure
requests automatically.

.. _security-csrf:

CSRF Protection
===============

CSRF or Cross Site Request Forgery is a common vulnerability in web
applications. It allows an attacker to capture and replay a previous request,
and sometimes submit data requests using image tags or resources on other
domains. To enable CSRF protection features use the
:doc:`/controllers/components/csrf`.

Disabling Security Component for Specific Actions
=================================================

There may be cases where you want to disable all security checks for an action
(ex. AJAX requests).  You may "unlock" these actions by listing them in
``$this->Security->unlockedActions`` in your ``beforeFilter()``. The
``unlockedActions`` property will **not** affect other features of
``SecurityComponent``::

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class WidgetController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Security');
        }

        public function beforeFilter(Event $event)
        {
             $this->Security->setConfig('unlockedActions', ['edit']);
        }
    }

Note: use ``$this->Security->config()`` for CakePHP versions prior to 3.4.0

This example would disable all security checks for the edit action.


.. meta::
    :title lang=ru: Безопасность
    :keywords lang=ru: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,ошибка 404,период неактивности,csrf,массив,submission,security class,disable security,unlockActions
