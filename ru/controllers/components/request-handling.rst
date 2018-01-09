Обработка запроса
#################

.. php:class:: RequestHandlerComponent(ComponentCollection $collection, array $config = [])

Компонент обработчика запросов используется в CakePHP для получения
дополнительной информации о HTTP-запросах, которые были сделаны в вашем
приложении. Вы можете использовать его, чтобы увидеть, какие типы контента
предпочитают клиенты, осуществлять автоматический парсинг входных данных
запроса, определять способов отображения типов контента для классов вида
или путей шаблонов.

По умолчанию ``RequestHandler`` будет автоматически определять AJAX-запросы,
основываясь на HTTP-заголовке ``X-Requested-With``, используемый многими
JavaScript-бибилиотеками. При использовании в сочетании с 
:php:meth:`Cake\\Routing\\Router::extensions()`, ``RequestHandler`` будет
автоматически переключать макеты и шаблоны на те, которые соответствуют типам
файлов, отличным от HTML. Кроме того, если существует хелпер с тем же именем,
что и запрашиваемое расширение, он будет добавлен в массив хелперов контроллера.
Наконец, если XML/JSON-данные переданы методом POST вашим Контроллерам, они
будут разобраны в массив, который присвоится методу
``$this->request->getData()``, и к нему можно будет получить доступ, как и к
стандартным POST-данным. Для того, чтобы сделать возможным использование
компонента ``RequestHandler``, вы должны добавить его в ваш метод
``initialize()``::

    class WidgetsController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        // Остальное содержимое контроллера
    }

Получение информации о запросе
==============================

Обработчик запросов имеет несколько методов, предоставляющих информацию
о клиенте и его запросе.

.. php:method:: accepts($type = null)

    ``$type`` может быть строкой, либо массивом, либо ``null``. Если
    будет строка, ``accepts()`` вернет ``true``, если клиент примет
    тип содержимого. Если указан массив, ``accepts()`` вернет
    ``true``, если один любой из типов содержимого будет принят
    клиентом. Если будет ``null``, будет возвращен массив типов
    содержимого, принимаемых клиентом. Например::

        class ArticlesController extends AppController
        {

            public function initialize()
            {
                parent::initialize();
                $this->loadComponent('RequestHandler');
            }

            public function beforeFilter(Event $event)
            {
                if ($this->RequestHandler->accepts('html')) {
                    // Выполнить код только если клиент принимает HTML (text/html)
                    // в качестве ответа.
                } elseif ($this->RequestHandler->accepts('xml')) {
                    // Выполняет только XML-код
                }
                if ($this->RequestHandler->accepts(['xml', 'rss', 'atom'])) {
                    // Выполнить код, если клиент принимает любой из типов: XML, RSS
                    // или Atom.
                }
            }
        }

Другие методы определения 'типа' запроса включают в том числе:

.. php:method:: isXml()

    Возвращает ``true`` если текущий запрос принимает XML в качестве ответа.

.. php:method:: isRss()

    Возвращает ``true`` если текущий запрос принимает RSS в качестве ответа.

.. php:method:: isAtom()

    Возвращает ``true`` если текущий запрос принимает Atom в качестве ответа,
    в противном случае возвращает ``false``.

.. php:method:: isMobile()

    Возвращает ``true``, если строка user agent совпадает с мобильным
    веб-браузером или если клиент принимает WAP-контент. Поддерживаемые
    строки мобильных User Agent:

    -  Android
    -  AvantGo
    -  BlackBerry
    -  DoCoMo
    -  Fennec
    -  iPad
    -  iPhone
    -  iPod
    -  J2ME
    -  MIDP
    -  NetFront
    -  Nokia
    -  Opera Mini
    -  Opera Mobi
    -  PalmOS
    -  PalmSource
    -  portalmmm
    -  Plucker
    -  ReqwirelessWeb
    -  SonyEricsson
    -  Symbian
    -  UP.Browser
    -  webOS
    -  Windows CE
    -  Windows Phone OS
    -  Xiino

.. php:method:: isWap()

    Возвращает ``true`` если клиент принимает WAP-контент.

Все описанные выше методы распознавания запроса могут быть
использованы аналогичным образом для фильтрации функциональных
возможностей, предназначенных для конкретных типов содержимого.
Например, при ответе на AJAX-запросы у вас часто будет возникать
желание отключить кеширование браузера и изменить уровень отладки.
В то же время, для запросов, отличных от AJAX, вы вероятно
захотите разрешить кэширование. Выполнить это можно так::

        if ($this->request->is('ajax')) {
            $this->response->disableCache();
        }
        // Остальной код экшена Контроллера

Автоматическое декодирование данных запроса
===========================================

Добавьте декодер данных запроса. Обработчик должен содержать метод
обратного вызова и любые дополнительные аргументы для него. Метод
обратного вызова должен возвращать массив данных, содержащихся в запросе.
Например, добавление обработчика CSV может выглядеть так::

    class ArticlesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $parser = function ($data) {
                $rows = str_getcsv($data, "\n");
                foreach ($rows as &$row) {
                    $row = str_getcsv($row, ',');
                }
                return $rows;
            };
            $this->loadComponent('RequestHandler', [
                'inputTypeMap' => [
                    'csv' => [$parser]
                ]
            ]);
        }
    }

You can use any `callable <http://php.net/callback>`_ for the handling function.
You can also pass additional arguments to the callback, this is useful for
callbacks like ``json_decode``::

    $this->RequestHandler->addInputType('json', ['json_decode', true]);

    // After 3.1.0 you should use
    $this->RequestHandler->config('inputTypeMap.json', ['json_decode', true]);

The above will make ``$this->request->getData()`` an array of the JSON input data,
without the additional ``true`` you'd get a set of ``stdClass`` objects.

.. deprecated:: 3.1.0
    As of 3.1.0 the ``addInputType()`` method is deprecated. You should use
    ``config()`` to add input types at runtime.

Checking Content-Type Preferences
=================================

.. php:method:: prefers($type = null)

Determines which content-types the client prefers. If no parameter
is given the most likely content type is returned. If $type is an
array the first type the client accepts will be returned.
Preference is determined primarily by the file extension parsed by
Router if one has been provided, and secondly by the list of
content-types in ``HTTP_ACCEPT``::

    $this->RequestHandler->prefers('json');

Ответ на запросы
================

.. php:method:: renderAs($controller, $type)

Change the render mode of a controller to the specified type. Will
also append the appropriate helper to the controller's helper array
if available and not already in the array::

    // Force the controller to render an xml response.
    $this->RequestHandler->renderAs($this, 'xml');

This method will also attempt to add a helper that matches your current content
type. For example if you render as ``rss``, the ``RssHelper`` will be added.

.. php:method:: respondAs($type, $options)

Sets the response header based on content-type map names. This method lets you
set a number of response properties at once::

    $this->RequestHandler->respondAs('xml', [
        // Force download
        'attachment' => true,
        'charset' => 'UTF-8'
    ]);

.. php:method:: responseType()

Returns the current response type Content-type header or null if one has yet to
be set.

Taking Advantage of HTTP Cache Validation
=========================================

The HTTP cache validation model is one of the processes used for cache
gateways, also known as reverse proxies, to determine if they can serve a
stored copy of a response to the client. Under this model, you mostly save
bandwidth, but when used correctly you can also save some CPU processing,
reducing this way response times.

Enabling the RequestHandlerComponent in your controller automatically activates
a check done before rendering the view. This check compares the response object
against the original request to determine whether the response was not modified
since the last time the client asked for it.

If response is evaluated as not modified, then the view rendering process is
stopped, saving processing time, saving bandwidth and no content is returned to
the client. The response status code is then set to ``304 Not Modified``.

You can opt-out this automatic checking by setting the ``checkHttpCache``
setting to ``false``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'checkHttpCache' => false
        ]);
    }

Using Custom ViewClasses
========================

When using JsonView/XmlView you might want to override the default serialization
with a custom View class, or add View classes for other types.

You can map existing and new types to your custom classes. You can also set this
automatically by using the ``viewClassMap`` setting::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler', [
            'viewClassMap' => [
                'json' => 'ApiKit.MyJson',
                'xml' => 'ApiKit.MyXml',
                'csv' => 'ApiKit.Csv'
            ]
        ]);
    }

.. deprecated:: 3.1.0
    As of 3.1.0 the ``viewClassMap()`` method is deprecated. You should use
    ``config()`` to change the viewClassMap at runtime.

.. meta::
    :title lang=ru: Обработка запроса
    :keywords lang=ru: handler component,библиотеки javascript,public components,null returns,model data,данные запроса,content types,расширения файлов,ajax,meth,content type,массив,conjunction,cakephp,insight,php
