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
    ниже 3.4.

Параметр ``$type`` может иметь следующие значения:

* 'auth' Указывает на ошибку валидации формы, или на несоответствие
  контроллера/экшена.
* 'secure' Указывает на сбой SSL-ограничения метода.

.. versionadded:: cakephp/cakephp 3.2.6

    C версии 3.2.6 к коллбэку ``blackHole`` добавлен дополнительный параметр.
    В качестве второго параметра передается экземпляр класса
    ``Cake\Controller\Exception\SecurityException``.

Доступ к экшенам через SSL
==========================

.. php:method:: requireSecure()

    Устанавливает экшены, требующие запроса, защищенного SSL.
    Принимает любое количество аргументов. Может вызываться без
    аргументов, чтобы заставить все экшены требовать SSL-защиты.

.. php:method:: requireAuth()

    Sets the actions that require a valid Security Component generated
    token. Takes any number of arguments. Can be called with no
    arguments to force all actions to require a valid authentication.

Ограничение межконтроллерных взаимодействий
===========================================

allowedControllers
    Список контроллеров, которые могут отправлять запросы данному
    контроллеру. Это может быть использовано для контроля
    межконтроллерных запросов.
allowedActions
    Список экшенов, которым разрешается отправлять запросы к
    экшенам данного контроллера. Это также может быть использовано
    для контроля межконтроллерных запросов.

Эти параметры конфигурации позволяют вам ограничить коммуникацию
между контроллерами. Установите их с помощью метода ``setConfig()``,
либо ``config()`` если вы используете CakePHP версии ниже 3.4.

Предотвращение подделки форм
============================

По умолчанию ``SecurityComponent`` не  позволяет пользователям изменять формы
определенными способами. ``SecurityComponent`` будет предотвращать следующие вещи::

* Неизвестные поля не могут быть добавлены в форму.
* Поля не могут быть удалены из формы.
* Значения скрытых полей не могут быть изменены.

Предотвращение этих типов подделки выполняется путем работы с ``FormHelper`` и
отслеживания, какие поля находятся в форме. Также отслеживаются значения скрытых
полей. Все эти данные объединены и превращены в хэш. Когда форма отправляется,
``SecurityComponent`` будет использовать POST-данные для построения той же
структуры и сравнения хэша.

.. note::

    ``SecurityComponent`` **не** предотвратит добавление/изменение элементов
    в выпадающих списках. Также он не предотвратит добавление/изменение
    радио-кнопок.

unlockedFields
    Указываются поля формы, которые необходимо исключить из POST-валидации.
    Поля могут быть разблокированы (unlocked) как в Компоненте, так и в
    :php:meth:`FormHelper::unlockField()`. Разблокированные поля не обязаны
    быть частью POST, в то время как значения разблокированных скрытых полей
    не подвергаются проверке.
validatePost
    Установите в ``false`` для полной отмены валидации POST-запросов,
    по сути, отключает валидацию форм.

Указанные выше опции могут быть настроены с помощью метода ``setConfig()``,
или же ``config()``, если вы используете CakePHP версии ниже 3.4.

Использование
=============

Использование компонента Security обычно осуществляется в методе
``beforeFilter()`` контроллера. Вы должны указать желаемые ограничения
безопасности, и компонент Security будет обеспечивать их соблюдение
при запуске::

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


Приведенный выше пример, заставит все экшены внутри маршрута ``admin``
требовать безопасных SSL-запросов::

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

.. note::

    Use ``$this->request->here()`` for CakePHP версий ниже 3.4.0.

Данный пример заставит все экшены внутри маршрута ``admin`` требовать
безопасных SSL-запросов. Когда запрос поглощен (black holed), будет
вызван назначенный коллбэк ``forceSSL()``, который автоматически перенаправит
небезопасные запросы на безопасные.

.. _security-csrf:

CSRF Protection
===============

CSRF или Межсайтовая Подделка Запросов (Cross Site Request Forgery) -
распространенная уязвимость в веб-приложениях. Она позволяет злоумышленнику
захватывать и воспроизводить предыдущий запрос, а иногда и отправлять запросы
данных с использованием тегов изображений или ресурсов в других доменах.
Чтобы включить функции защиты CSRF, используйте :doc:`/controllers/components/csrf`.

Отключение компонента Security для определенных экшенов
=======================================================

Могут быть случаи, когда вы захотите отключить все проверки безопасности для экшена
(например, AJAX-запросы). Вы можете «разблокировать» эти действия, указав их в
``$this->Security->unlockedActions`` в ``beforeFilter()``. Свойство ``unlockedActions``
**не будет** влиять на другие функции ``SecurityComponent``::

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

.. note::

    Используйте ``$this->Security->config()`` для CakePHP версии ниже 3.4.0.

Данный пример отключит все проверки безопасности для экшена ``edit``.

.. meta::
    :title lang=ru: Безопасность
    :keywords lang=ru: configurable parameters,security component,configuration parameters,invalid request,protection features,tighter security,holing,php class,meth,ошибка 404,период неактивности,csrf,массив,submission,security class,disable security,unlockActions
