Объекты запроса и ответа
########################

.. php:namespace:: Cake\Http

Объекты запроса и ответа предоставляют абстракцию вокруг HTTP-запросов и ответов.
Объект запроса в CakePHP позволяет вам инспектировать входящий запрос, в то время
как объект ответа позволяет легко создавать HTTP ответы от ваших контроллеров.

.. index:: $this->request
.. _cake-request:

Запрос
======

.. php:class:: ServerRequest

``ServerRequest`` является объектом запроса по умолчанию, используемым в CakePHP.
Он централизует ряд функций для опроса и взаимодействия с данными запроса.
По каждому запросу создаётся один Request, который затем передаётся по ссылке на
различные уровни приложения, использующего данные запроса. По умолчанию запрос
присваивается ``$this->request`` и доступен в контроллерах, ячейках,
представлениях и помощниках. Вы также можете получить доступ к нему в компонентах,
используя ссылку на контроллер. Некоторые из функций ``ServerRequest`` включают
в себя:

* Обработка массивов GET, POST и FILES в структурах данных, с которыми вы знакомы.
* Обеспечение интроспекции среды, относящейся к запросу. Информация, такая как:
  отправленные заголовки, IP-адрес клиента и субдомен/домен, на сервере, на
  котором запущено ваше приложение.
* Предоставление доступа к параметрам запроса как индексов массивов, так и свойств
  объекта.

Начиная с версии 3.4.0, объект запроса CakePHP реализует
`PSR-7 ServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_, что упрощает
использование библиотек вне CakePHP.

Параметры запроса
-----------------

Запрос предоставляет параметры маршрутизации с помощью метода ``getParam()``::

    $controllerName = $this->request->getParam('controller');

    // До 3.4.0
    $controllerName = $this->request->param('controller');

Все  :ref:`route-elements` доступны через этот интерфейс.

В дополнение к :ref:`route-elements`, вам также часто необходим доступ к
:ref:`passed-arguments`. Они доступны и для объекта запроса::

    // Переданные аргументы
    $passedArgs = $this->request->getParam('pass');

Все предоставят вам доступ к переданным аргументам. Существует несколько
важных/полезных параметров, которые CakePHP использует внутренне, все они также
находятся в параметрах маршрутизации:

* ``plugin`` Плагин обрабатывает запрос. Будет null, если нет плагина.
* ``controller`` Контроллер обрабатывает текущий запрос.
* ``action`` Действие, обрабатывающее текущий запрос.
* ``prefix`` Префикс для текущего действия. См. :ref:`prefix-routing` для
  получения дополнительной информации.

Параметры строки запроса
------------------------

.. php:method:: getQuery($name)

Параметры строки запроса можно прочитать с помощью метода ``getQuery()``::

    // URL является /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

    // До 3.4.0
    $page = $this->request->query('page');

Вы можете либо напрямую получить доступ к свойству запроса, либо
использовать метод ``getQuery()`` для беспроблемного чтения массива
URL запросов. Любые ключи, которые не существуют, вернут ``null``::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // Вы также можете указать значения по умолчанию
    $foo = $this->request->getQuery('does_not_exist', 'default val');

Если вы хотите получить доступ ко всем параметрам запроса, вы можете
использовать ``getQueryParams()``::

    $query = $this->request->getQueryParams();

.. versionadded:: 3.4.0
    ``getQueryParams()`` и ``getQuery()`` были добавлены в 3.4.0

Данные в теле запроса
---------------------

.. php:method:: getData($name, $default = null)

Доступ ко всем данным POST можно получить с помощью
:php:meth:`Cake\\Http\\ServerRequest::getData()`.
Любые данные формы, содержащие префикс ``data``, будут иметь префикс данных.
Например::

    // Input с атрибутом имени, равным 'MyModel[title]', доступен в
    $title = $this->request->getData('MyModel.title');

Любые ключи, которые не существуют, вернут ``null``::

    $foo = $this->request->getData('Value.that.does.not.exist');
    // $foo == null

PUT, PATCH или DELETE данные
----------------------------

.. php:method:: input($callback, [$options])

При создании REST служб вы часто принимаете данные запроса на запросы ``PUT``
и ``DELETE``. Любые данные тела запроса ``application/x-www-form-urlencoded``
автоматически анализируются и устанавливаются в ``$this->data`` для ``PUT``
и ``DELETE`` запросов. Если вы принимаете данные JSON или XML, см. ниже как
вы можете получить доступ к этим телам запросов.

При доступе к входным данным вы можете декодировать их с помощью дополнительной
функции. Это полезно при взаимодействии с содержимым тела запроса XML или JSON.
Дополнительные параметры для функции декодирования могут передаваться в качестве
аргументов в ``input()``::

    $jsonData = $this->request->input('json_decode');

Переменные среды (из $_SERVER и $_ENV)
------------------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` является оболочкой для ``env()`` глобальной функции и
действует как геттер/сеттер для переменных среды без необходимости изменять
глобальные значения ``$_SERVER`` и ``$_ENV``::

    // Получить хост
    $host = $this->request->env('HTTP_HOST');

    // Установите значение, обычно полезно при тестировании.
    $this->request->env('REQUEST_METHOD', 'POST');

Чтобы получить доступ ко всем переменным среды в запросе, используйте ``getServerParams()``::

    $env = $this->request->getServerParams();

.. versionadded:: 3.4.0
    ``getServerParams()`` был добавлен в 3.4.0

XML или JSON данные
-------------------

Приложения, использующие :doc:`/development/rest`, часто обмениваются данными,
не используя URL-кодирование. Вы можете читать входные данные в любом формате,
используя :php:meth:`~Cake\\Http\\ServerRequest::input()`. Используя функцию
декодирования, вы можете получить контент в десериализованном формате::

    // Получить JSON-кодированные данные, представленные в экшене PUT/POST
    $jsonData = $this->request->input('json_decode');

Некоторые методы десериализации требуют дополнительных параметров при вызове,
таких как параметр 'array' для ``json_decode``. Если вы хотите преобразовать
XML в объект DOMDocument, то :php:meth:`~Cake\\Http\\ServerRequest::input()`
также поддерживает передачу дополнительных параметров::

    //Получить XML-кодированные данные, представленные в экшене PUT/POST
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Информация о пути
-----------------

Объект запроса также предоставляет полезную информацию о путях в вашем приложении.
Атрибуты ``base`` и ``webroot`` полезны для создания URL-адресов и определения того,
находится ли ваше приложение в подкаталоге. Атрибутами, которые вы можете пользоваться,
являются::

    // Предположим, что текущий URL-адрес запроса /subdir/articles/edit/1?page=1

    // Получаем /subdir/articles/edit/1?page=1
    $here = $request->getRequestTarget();

    // Получаем /subdir
    $base = $request->getAttribute('base');

    // Получаем /subdir/
    $base = $request->getAttribute('webroot');

    // До 3.4.0
    $webroot = $request->webroot;
    $base = $request->base;
    $here = $request->here();

.. _check-the-request:

Проверка условий запроса
------------------------

.. php:method:: is($type, $args...)

Объект запроса обеспечивает простой способ проверки определённых условий в заданном
запросе. Используя метод ``is()``, вы можете проверить ряд общих условий, а также
проверить другие критерии запроса конкретного приложения::

    $isPost = $this->request->is('post');

Вы также можете расширить доступные детекторы запросов, используя
:php:meth:`Cake\\Http\\ServerRequest::addDetector()` для создания новых типов
детекторов. Существует четыре разных типа детекторов, которые вы можете создать:

* Сравнение значений среды - сравнивает значение, полученное из :php:func:`env()`
  для равенства с предоставленным значением.
* Сравнение значений шаблонов - Сравнение значений шаблонов позволяет сравнить
  значение, полученное из :php:func:`env()` c регулярным выражением.
* Сравнение на основе опций -  Сравнение на основе опций использует список
  вариантов для создания регулярного выражения. Последующие вызовы для добавления
  уже определённого опционного детектора объединяют параметры.
* Детекторы обратного вызова - Детекторы обратного вызова позволяют вам выдавать
  'callback' тип для обработки проверки. Обратный вызов получит объект запроса в
  качестве единственного параметра.

.. php:method:: addDetector($name, $options)

Некоторые примеры::

    // Добавьте детектор среды.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Добавить детектор значений шаблона.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Добавьте детектор параметров.
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // Добавить детектор обратного вызова. Должно быть допустимым.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Добавьте детектор, который использует дополнительные
    // аргументы. Для 3.3.0
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->getParam('controller') === $name;
        }
    );

``Request`` также включает такие методы, как
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` и
:php:meth:`Cake\\Http\\ServerRequest::host()` чтобы помочь приложениям
с субдоменами и немного облегчить жизнь.

Есть несколько встроенных детекторов, которые вы можете использовать:

* ``is('get')`` Проверьте, является ли текущий запрос GET.
* ``is('put')`` Проверьте, является ли текущий запрос PUT.
* ``is('patch')`` Проверьте, является ли текущий запрос PATCH.
* ``is('post')`` Проверьте, является ли текущий запрос POST.
* ``is('delete')`` Проверьте, является ли текущий запрос DELETE.
* ``is('head')`` Проверьте, является ли текущий запрос HEAD.
* ``is('options')`` Проверьте, является ли текущий запрос OPTIONS.
* ``is('ajax')`` Проверьте, пришел ли текущий запрос с помощью
  X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Проверьте, выполняется ли запрос через SSL.
* ``is('flash')`` Проверьте, имеет ли запрос User-Agent - Flash.
* ``is('requested')`` Проверьте, имеет ли запрос - параметр запроса
  'requested' со значением 1.
* ``is('json')`` Проверьте, имеет ли запрос расширение json и принимает
  ли 'application/json' mimetype.
* ``is('xml')`` роверьте, есть ли запрос с расширением 'xml' и принимающий
  'application/xml' или 'text/xml' mimetype.

.. versionadded:: 3.3.0
    Детекторы могут принимать дополнительные параметры начиная с 3.3.0.

Данные сеанса(сессии)
---------------------

Для доступа к сессии данного запроса используйте метод ``session()``::

    $userName = $this->request->session()->read('Auth.User.name');

Для использования объекта сеанса и получения дополнительной информации см. документацию
:doc:`/development/sessions`.

Хост и доменное имя
-------------------

.. php:method:: domain($tldLength = 1)

Возвращает имя домена, на котором запущено ваше приложение::

    // Напечатает 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Возвращает субдомены, в которых работает ваше приложение, в виде массива::

    // Вернёт ['my', 'dev'] для 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Возвращает хост, на котором установлено ваше приложение::

    // Напечатает 'my.dev.example.org'
    echo $request->host();

Чтение HTTP-метода
------------------

.. php:method:: getMethod()

Возвращает HTTP-метод, с которым был выполнен запрос с помощью::

    // Вернёт POST
    echo $request->getMethod();

    // До 3.4.0
    echo $request->method();

Ограничение того, какой HTTP метод принимает экшен
--------------------------------------------------

.. php:method:: allowMethod($methods)

Установите допустимые методы HTTP. Если не согласовано, будет выбрасываться
``MethodNotAllowedException``. Ответ 405 будет включать в себя необходимый
``Allow`` заголовок с переданными методами::

    public function delete()
    {
        // Принимать только запросы POST и DELETE
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Чтение HTTP заголовков
----------------------

Позволяет получить доступ к любому из ``HTTP_*`` заголовков, которые были
использованы для запроса. Например::

    // Получить заголовок как строку
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Получить массив всех значений.
    $acceptHeader = $this->request->getHeader('Accept');

    // Проверьте, существует ли заголовок
    $hasAcceptHeader = $this->request->hasHeader('Accept');

    // До 3.4.0
    $userAgent = $this->request->header('User-Agent');

Хотя некоторые установки Apache делают заголовок ``Authorization`` не доступным,
CakePHP сделает его доступным с помощью специальных методов apache по мере необходимости.

.. php:method:: referer($local = false)

Возвращает ссылочный адрес для запроса.

.. php:method:: clientIp()

Возвращает IP-адрес текущего посетителя.

Доверенные прокси-заголовки
---------------------------

Если ваше приложение находится за балансировщиком нагрузки или работает в облачном сервисе,
вы часто получаете хост, порт и схему балансировки нагрузки в своих запросах.
Часто балансировщики нагрузки также отправляют ``HTTP-X-Forwarded-*`` заголовки с исходными
значениями. Пересылаемые заголовки не будут использоваться CakePHP из коробки.
Чтобы объект запроса использовал эти заголовки, установите свойство ``trustProxy``
в ``true``::

    $this->request->trustProxy = true;

    // Эти методы теперь будут использовать проксированные заголовки.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Проверка принятия заголовков
----------------------------

.. php:method:: accepts($type = null)

Узнайте, какие типы контента принимает клиент, или проверьте, принимает ли он
конкретный тип контента.

Получить все типы::

    $accepts = $this->request->accepts();

Проверить наличие одного типа::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Получите все языки, принятые клиентом, или проверьте, принят
ли конкретный язык.

Получить список принятых языков::

    $acceptsLanguages = $this->request->acceptLanguage();

Проверьте, принят ли конкретный язык::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. _request-cookies:

Cookies
-------

Запрошенные файлы cookie можно прочитать несколькими способами::

    // Получить значение cookie или null, если файл cookie отсутствует.
    $rememberMe = $this->request->getCookie('remember_me');

    // Прочтите значение или получите значение по умолчанию 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Получить все куки как хэш
    $cookies = $this->request->getCookieParams();

    // Получить экземпляр CookieCollection (начиная с 3.5.0)
    $cookies = $this->request->getCookieCollection()

См. документацию :php:class:`Cake\\Http\\Cookie\\CookieCollection` для работы с
коллекцией файлов cookie.

.. versionadded:: 3.5.0
    ``ServerRequest::getCookieCollection()`` был добавлен в 3.5.0

.. index:: $this->response

Ответ
=====

.. php:class:: Response

:php:class:`Cake\\Http\\Response` - класс ответа по умолчанию в CakePHP.
Он инкапсулирует ряд функций и функциональности для генерации HTTP ответов
в вашем приложении. Он также помогает в тестировании, поскольку его можно
обмануть/пропустить, чтобы вы могли проверять заголовки, которые будут отправлены.

Например :php:class:`Cake\\Http\\ServerRequest` и :php:class:`Cake\\Http\\Response`
объединяет ряд ранее найденных методов :php:class:`Controller`,
:php:class:`RequestHandlerComponent` и :php:class:`Dispatcher`.
Старые методы устарели в пользу использования :php:class:`Cake\\Http\\Response`.

``Response`` предоставляет интерфейс для обёртывания общих задач, связанных с ответом,
таких как:

* Отправка заголовков для перенаправления.
* Отправка типа заголовков контента.
* Отправка любого заголовка.
* Отправка тела ответа.

Работа с типами контента
------------------------

.. php:method:: withType($contentType = null)

Вы можете управлять типом Content-Type вашего приложения с помощью
:php:meth:`Cake\\Http\\Response::withType()`. Если вашему приложению необходимо
иметь дело с типами контента, которые не встроены в Response, вы также можете
сопоставить их с ``type()``::

    // Добавить тип vCard
    $this->response->type(['vcf' => 'text/v-card']);

    // Установите ответ Content-Type на vCard.
    $this->response = $this->response->withType('vcf');

    // До 3.4.0
    $this->response->type('vcf');

Обычно вам нужно отображать дополнительные типы контента в вашем callback-контроллере
:php:meth:`~Controller::beforeFilter()`, поэтому вы можете использовать функции
автоматического переключения вида :php:class:`RequestHandlerComponent`, если вы его
используете.

.. _cake-response-file:

Отправка файлов
---------------

.. php:method:: withFile($path, $options = [])

Бывают случаи, когда вы хотите отправлять файлы в качестве ответов на запросы.
Вы можете это сделать, используя :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Верните ответ, чтобы предотвратить попытку контроллера
        // отобразить представление.
        return $response;
    }

    // До 3.4.0
    $file = $this->Attachments->getFile($id);
    $this->response->file($file['path']);
    // Верните ответ, чтобы предотвратить попытку контроллера
    // отобразить представление.
    return $this->response;

Как показано в приведённом выше примере, вы должны передать путь к методу.
CakePHP отправит соответствующий заголовок типа контента, если это известный тип файла,
указанный в `Cake\\Http\\Reponse::$_mimeTypes`. Вы можете добавлять новые типы до вызова
:php:meth:`Cake\\Http\\Response::withFile()`  с помощью метода
:php:meth:`Cake\\Http\\Response::withType()`.

Если вы хотите, вы также можете принудительно загрузить файл вместо отображения в браузере,
указав параметры::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

    // До 3.4.0
    $this->response->file(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

Поддерживаемые параметры:

name
    Имя - позволяет указать альтернативное имя файла для отправки пользователю.
download
    Логическое значение, указывающее, следует ли устанавливать заголовки для
    принудительной загрузки.

Отправка строки в виде файла
----------------------------

Вы можете ответить файлом, который не существует на диске, например, pdf или ics,
сгенерированным «на лету» из строки::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;
        $response->body($icsString);

        $response = $response->withType('ics');

        // Необязательно принудительно загружать файл
        $response = $response->withDownload('filename_for_download.ics');

        // Возвратить объект ответа, чтобы предотвратить попытку
        // контроллера отобразить представление.
        return $response;
    }

Обратные вызовы также могут возвращать тело в виде строки::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Настройка заголовков
--------------------

.. php:method:: withHeader($header, $value)

Настройка заголовков выполняется с помощью метода
:php:meth:`Cake\\Http\\Response::withHeader()`. Как и все методы интерфейса PSR-7,
этот метод возвращает экземпляр *new* с новым заголовком::

    // Добавить/заменить заголовок
    $response = $response->withHeader('X-Extra', 'My header');

    // Установка нескольких заголовков
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Добавить значение в существующий заголовок
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

    // До 3.4.0 - Установить заголовок
    $this->response->header('Location', 'http://example.com');

Заголовки не отправляются при установке. Вместо этого они сохраняются до тех пор,
пока не будет получен ответ ``Cake\Http\Server``.

Теперь вы можете использовать удобный метод
:php:meth:`Cake\\Http\\Response::withLocation()`, чтобы напрямую установить или
получить заголовок местоположения перенаправления.

Настройка body
--------------

.. php:method:: withStringBody($string)

Чтобы установить строку в качестве тела ответа, выполните следующие действия::

    // Установите строку в тело
    $response = $response->withStringBody('My Body');

    // Если вам нужен json-ответ
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. versionadded:: 3.4.3
    ``withStringBody()`` был добавлен в 3.4.3

.. php:method:: withBody($body)

Чтобы установить тело ответа, используйте метод ``withBody()``,
который предоставляется :php:class:`Zend\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

    // До 3.4.0 - Установите тело
    $this->response->body('My Body');

Убедитесь, что ``$stream`` - это :php:class:`Psr\\Http\\Message\\StreamInterface` объект.
Ниже описано, как создать новый поток.

Вы также можете передавать ответы из файлов с помощью потоков
:php:class:`Zend\\Diactoros\\Stream`::

    // Поток из файла
    use Zend\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

Вы также можете передавать ответы от обратного вызова с помощью ``CallbackStream``.
Это полезно, когда у вас есть ресурсы, такие как изображения, файлы CSV или PDF-файлы,
которые необходимо передать клиенту::

    // Потоковая передача с обратного вызова
    use Cake\Http\CallbackStream;

    // Создайте изображение.
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

    // До 3.4.0 вы можете использовать следующие для создания потоковых ответов.
    $file = fopen('/some/file.png', 'r');
    $this->response->body(function () use ($file) {
        rewind($file);
        fpassthru($file);
        fclose($file);
    });

Установка кодировки символов
----------------------------

.. php:method:: withCharset($charset)

Устанавливает кодировку, которая будет использоваться в ответе::

    $this->response = $this->response->withCharset('UTF-8');

    // До 3.4.0
    $this->response->charset('UTF-8');

Взаимодействие с кэшированием браузера
--------------------------------------

.. php:method:: withDisabledCache()

Иногда вам необходимо заставить браузеры не кэшировать результаты экшена контроллера.
:php:meth:`Cake\\Http\\Response::withDisabledCache()` предназначен именно для этого::

    public function index()
    {
        // Отключить кеширование
        $this->response = $this->response->withDisabledCache();

        // До 3.4.0
        $this->response->disableCache();
    }

.. warning::
    Отключение кэширования SSL-доменов, при попытке отправить
    файлы в Internet Explorer, может привести к ошибкам.

.. php:method:: withCache($since, $time = '+1 day')

Вы также можете сообщить клиентам, что вы хотите, чтобы они кэшировали ответы.
Используя :php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Включить кеширование
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

Вышеизложенное, надеясь ускорить работу ваших посетителей, сообщит клиентам о
кешировании полученного ответа в течение 5 дней.
Метод ``withCache()`` устанавливает значение ``Last-Modified`` для первого аргумента.
Заголовок ``Expires`` и директива ``max-age`` устанавливаются на основе второго
параметра. Также будет задана директива ``public`` Cache-Control.

.. _cake-response-caching:

Точная настройка HTTP-кэша
--------------------------

Одним из лучших и простых способов ускорения вашего приложения является использование
кэша HTTP. В рамках этой модели кэширования вы должны только помочь клиентам решить,
следует ли им использовать кэшированную копию ответа, установив несколько заголовков,
таких как изменённое время и тег объекта ответа.

Вместо того, чтобы заставлять вас кодировать логику кэширования и обновлять кэш после
изменения данных, HTTP использует две модели, срок действия и проверку, которые обычно
намного проще использовать.

Помимо использования :php:meth:`Cake\\Http\\Response::withCache()`, вы также можете
использовать многие другие методы для тонкой настройки заголовков кэша HTTP, чтобы
использовать преимущества кэширования браузера или обратного прокси.

Заголовок управления кэшем
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Используемый под моделью истечения срока действия, этот заголовок содержит несколько
индикаторов, которые могут изменить способ использования браузерами или прокси-серверами
кэшированного содержимого. Заголовок ``Cache-Control`` может выглядеть так::

    Cache-Control: private, max-age=3600, must-revalidate

Класс ``Response`` позволяет вам установить этот заголовок с помощью некоторых методов
утилиты. Эти методы будут создавать окончательный допустимый заголовок ``Cache-Control``.
Во-первых, это ``withSharable()`` - метод, который указывает, должен ли ответ рассматриваться
как доступный для разных пользователей или клиентов. Этот метод фактически управляет частью
``public`` или ``private`` этого заголовка. Установка ответа как приватный(закрытый) означает, что
он весь или часть его предназначена для одного пользователя.
Чтобы использовать общие кеши, директива управления должна быть установлена как публичный(общедоступный).

Второй параметр этого метода используется для указания ``max-age`` для кеша, который представляет
собой количество секунд, после которых ответ больше не считается новым::

    public function view()
    {
        // ...
        // Установите Cache-Control как общедоступный на 3600 секунд
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Установите Cache-Control как приватный на 3600 секунд
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` предоставляет отдельные методы для установки каждой из директив в
заголовке ``Cache-Control``.

Заголовок срока действия
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

Вы можете установить заголовок ``Expires`` на дату и время, после которых ответ
больше не считается свежим. Этот заголовок можно установить с помощью метода
``withExpires()``::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

Этот метод также принимает экземпляр :php:class:`DateTime` или любую строку,
которая может быть проанализирована классом :php:class:`DateTime`.

Заголовок Etag
~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

В HTTP часто используется проверка подлинности кэша, когда контент постоянно изменяется,
и просит приложение только генерировать содержимое ответа, если кеш уже не свежий.
В рамках этой модели клиент продолжает хранить страницы в кеше, но он запрашивает
приложение каждый раз на пледмет измененияли ресурса, вместо того, чтобы использовать
его напрямую. Это обычно используется со статическими ресурсами, такими как изображения
и другие активы.

Метод ``withEtag()`` (называемый тегом сущности) представляет собой строку, которая уникально
идентифицирует запрашиваемый ресурс, как контрольная сумма для файла, чтобы определить,
соответствует ли он кэшированному ресурсу.

Чтобы воспользоваться этим заголовком, вы должны либо вызвать метод ``checkNotModified()``
вручную, либо включить в свой контроллер компонент :doc:`/controllers/components/request-handling`::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::
    Большинство пользователей-прокси должны, вероятно, рассмотреть возможность
    использования последнего изменённого заголовка вместо Etags для обеспечения
    производительности и совместимости.

Заголовок Last-Modified
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

В рамках модели проверки кэша HTTP вы можете установить заголовок
``Last-Modified``, чтобы указать дату и время, последнего изменения ресурса.
Настройка этого заголовка помогает CakePHP сообщать клиентам кэширования, основываясь
на их кэше, был ли изменён ответ.

Чтобы воспользоваться этим заголовком, вы должны либо вызвать метод ``checkNotModified()``
вручную, либо включить в свой контроллер компонент :doc:`/controllers/components/request-handling`::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

Заголовок Vary
~~~~~~~~~~~~~~

.. php:method:: withVary($header)

В некоторых случаях вы можете использовать другой контент, используя тот же URL.
Это часто бывает, если у вас есть многоязычная страница или вы отвечаете на разные
HTML-файлы в зависимости от браузера. В таких обстоятельствах вы можете использовать
заголовок ``Vary``::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Отправка ответов 304 Not Modified
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

Сравнивает заголовки кэша для объекта запроса с заголовком кэша от ответа и определяет,
может ли он всё еще считаться свежим. Если это так, удаляет контент ответа и
отправляет заголовок `304 Not Modified`::

    // В экшене контроллера
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Настройка файлов cookie
=======================

Сookie-файлы могут быть добавлены в ответ, используя либо массив, либо объект
:php:class:`Cake\\Http\\Cookie\\Cookie`::

    // Добавление файла cookie в виде массива с использованием неизменяемого API (начиная с 3.4.0+)
    $this->response = $this->response->withCookie('remember_me', [
        'value' => 'yes',
        'path' => '/',
        'httpOnly' => true,
        'secure' => false,
        'expire' => strtotime('+1 year')
    ]);

    // До 3.4.0
    $this->response->cookie('remember', [
        'value' => 'yes',
        'path' => '/',
        'httpOnly' => true,
        'secure' => false,
        'expire' => strtotime('+1 year')
    ]);

См. раздел :ref:`creating-cookies` для использования объекта cookie.
Вы можете использовать ``withExpiredCookie()`` для отправки истёкшего файла cookie в ответе.
Это заставит браузер удалить локальный файл cookie::

    // Начиная с 3.5.0
    $this->response = $this->response->withExpiredCookie('remember_me');

.. _cors-headers:

Настройка Cross Origin Request Headers (CORS)
=============================================

Начиная с 3.2 вы можете использовать метод ``cors()``, для определения связанных заголовков
`HTTP Access Control <https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__,
со свободным интерфейсом::

    $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

Связанные заголовки CORS будут применяться только к ответу, если будут выполнены следующие
критерии:

#. В запросе есть заголовок ``Origin``.
#. Значение ``Origin`` запроса соответствует одному из допустимых значений Origin.

.. versionadded:: 3.2
    ``CorsBuilder`` был добавлен в 3.2

Общие ошибки с неизменяемыми ответами
=====================================

Начиная с CakePHP 3.4.0, объекты ответа предлагают ряд методов, которые обрабатывают
ответы как неизменяемые объекты. Неизменяемые объекты помогают предотвратить трудное
отслеживание случайных побочных эффектов и уменьшить ошибки, вызванные вызовами методов или
рефакторингом, которые меняют порядок. Хотя они предлагают ряд преимуществ, неизменяемые
объекты могут 'вызвать привыкание'. Любой метод, начинающийся с ``with``, неизменно действует
на ответ, и **всегда** возвращает **новый** экземпляр.
Забыть сохранить изменённый экземпляр - является наиболее частой ошибкой, которую люди совершают
при работе с неизменяемыми объектами::

    $this->response->withHeader('X-CakePHP', 'yes!');

В приведённом выше коде в ответе будет отсутствовать заголовок ``X-CakePHP``, поскольку
возвращаемое значение метода ``withHeader()`` не было сохранено. Чтобы исправить вышеуказанный код,
вы должны написать::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. php:namespace:: Cake\Http\Cookie

Коллекции файлов cookie
=======================

.. php:class:: CookieCollection

Объекты ``CookieCollection`` доступны из объектов запроса и ответа.
Они позволяют взаимодействовать с группами cookie с использованием неизменяемых шаблонов,
которые позволяют сохранить неизменность запроса и ответа.

.. _creating-cookies:

Создание файлов cookie
----------------------

.. php:class:: Cookie

Объекты ``Cookie`` могут быть определены через объекты-конструкторы или с использованием
свободного интерфейса, который следует за неизменными шаблонами::

    use Cake\Http\Cookie\Cookie;

    // Все аргументы в конструкторе
    $cookie = new Cookie(
        'remember_me', // имя
        1, // значение
        new DateTime('+1 year'), // срок действия, если применимо
        '/', // путь, если применимо
        'example.com', // domain, если применимо
        false, // безопасно?
        true // только http?
    );

    // Использование методов построителя
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Когда вы создали файл cookie, вы можете добавить его в новый или существующий
``CookieCollection``::

    use Cake\Http\Cookie\CookieCollection;

    // Создать новую коллекцию
    $cookies = new CookieCollection([$cookie]);

    // Добавить в существующую коллекцию
    $cookies = $cookies->add($cookie);

    // Удалить файл cookie по имени
    $cookies = $cookies->remove('remember_me');

.. note::

    Помните, что коллекции неизменяемы и добавляют файлы cookie или удаляются их из коллекции,
    создают *new* объект коллекции.

Вы должны использовать метод ``withCookie()`` для добавления файлов cookie к объектам ``Response``,
поскольку их проще использовать::

    $response = $this->response->withCookie($cookie);

Куки-файлы, настроенные на ответы, могут быть зашифрованы с помощью
:ref:`encrypted-cookie-middleware`.

Чтение файлов cookie
--------------------

Когда у вас есть экземпляр ``CookieCollection``, вы можете получить доступ к куки-файлам, которые
он содержит::

    // Проверьте, существует ли файл cookie
    $cookies->has('remember_me');

    // Получить количество файлов cookie в коллекции
    count($cookies);

    // Получить экземпляр cookie
    $cookie = $cookies->get('remember_me');

Когда у вас есть объект ``Cookie``, вы можете взаимодействовать с его состоянием и изменять его.
Имейте в виду, что файлы cookie неизменяемы, поэтому вам нужно обновить коллекцию, если вы измените
файл cookie::

    // Получить значение
    $value = $cookie->getValue()

    // Доступ к данным внутри значения JSON
    $id = $cookie->read('User.id');

    // Проверить состояние
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. versionadded:: 3.5.0
    ``CookieCollection`` и ``Cookie`` были добавлены в 3.5.0.

.. meta::
    :title lang=ru: Объекты запроса и ответа
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
