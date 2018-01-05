Аутентификация
##############

.. php:class:: AuthComponent(ComponentCollection $collection, array $config = [])

Идентификация, аутентификация и авторизация пользователей является обычной частью
почти каждого веб-приложения. В CakePHP AuthComponent предоставляет
подключаемый способ выполнения этих задач. AuthComponent позволяет комбинировать
объекты аутентификации и объекты авторизации для создания гибких
способов идентификации и проверки авторизации пользователя.

.. _authentication-objects:

Рекомендуется к прочтению
=========================

Настройка аутентификации требует нескольких шагов, включая определение
таблицы пользователей, создание модели, контроллера, видов и т. д.

Это все описывается по шагам в
:doc:`Руководстве по созданию CMS </tutorials-and-examples/cms/authentication>`.

Если вы ищете готовые решения по аутентификации и/или авторизации для
CakePHP, взгляните на раздел 
`Аутентификация и Авторизация <https://github.com/FriendsOfCake/awesome-cakephp/blob/master/README.md#authentication-and-authorization>`_ списка Awesome CakePHP.

Аутентификация
==============

Аутентификация - это процесс идентификации пользователей посредством
учетных данных и обеспечение того, чтобы пользователи были теми, за кого они
себя выдают. Как правило, это делается с помощью имени пользователя и пароля,
которые проверяются по списку известных  пользователей. В CakePHP есть
несколько встроенных способов аутентификации пользователей, имеющихся у вашего 
приложения.

* ``FormAuthenticate`` позволяет аутентификацию пользователей на основании 
  POST-данных, отправляемых с помощью форм. Как правило, это форма входа с
  с возможностью ввода учетных данных пользователем.
* ``BasicAuthenticate`` предоставляет возможности Базовой HTTP-аутентификации.
* ``DigestAuthenticate`` предоставляет возможности Дайджест-аутентификации.

По умолчанию ``AuthComponent`` использует ``FormAuthenticate``.

Выбор типа аутентификации
-------------------------

Как правило, вы захотите предложить аутентификацию на основе форм. Это самый
простой способ для пользователей веб-браузеров. Если вы создаете API или веб-сервис,
вы можете рассмотреть базовую аутентификацию или дайджест-аутентификацию. Основные
различия между дайджест- и базовой аутентификацией в основном связаны с тем, как
обрабатываются пароли. При базовой аутентификации имя пользователя и пароль
передаются в виде обычного текста на сервер. Это делает базовую аутентификацию 
непригодной для приложений без SSL, так как вы будете подвергать пароли уязвимости.
Дайджест-аутентификация передает в  хэшированном виде имя пользователя, пароль и
некоторые другие детали. Это делает дайджест-аутентификацию  более подходящей для
приложений без SSL-шифрования.

Вы также можете использовать такие системы аутентификации, как например OpenID,
но они уже не входят в состав ядра CakePHP.

Настройка обработчиков аутентификации
-------------------------------------

Вы настраиваете обработчики аутентификации, используя конфигурацию
``authenticate``. Вы можете настроить один или несколько обработчиков
для аутентификации. Использование нескольких обработчиков позволяет
вам поддерживать разные способы входа пользователей. Когда пользователи
авторизуются, обработчики аутентификации проверяются в том порядке,
в котором они были объявлены. Как только какой-либо обработчик сможет
идентифицировать пользователя, все оставшиеся обработчики уже не будут
использованы. И наоборот, вы можете прервать проверку подлинности,
выбросив исключение. Вам будет нужно перехватывать любые выбрасываемые
исключения и обрабатывать их должным образом.

Вы можете настроить обработчики аутентификации в методе 
``beforeFilter()`` либо ``initialize()``. Вы можете передавать
информацию о конфигурации в каждый объект аутентификации, используя
массив::

    // Простая настройка
    $this->Auth->config('authenticate', ['Form']);

    // Передача параметров
    $this->Auth->config('authenticate', [
        'Basic' => ['userModel' => 'Members'],
        'Form' => ['userModel' => 'Members']
    ]);

Во втором примере вы возможно обратили внимание, что ключ ``userModel``
был объявлен дважды. Чтобы ваш код соответствовал принципам DRY (не
повторяйся), вы можете использовать ключ ``all``. Этот специальный ключ
позволяет вам устанавливать параметры, которые вы передаете к каждому
прикрепленному объекту. Ключ ``all`` также доступен в качестве
статического свойства ``AuthComponent::ALL``::

    // Передача параметров с помощию 'all'
    $this->Auth->config('authenticate', [
        AuthComponent::ALL => ['userModel' => 'Members'],
        'Basic',
        'Form'
    ]);

В приведенном выше примере и ``Form`` и ``Basic`` будут получать настройки,
объявленные в ключе 'all'. Любые настройки, переданные конкретному объекту
аутентификации будут переопределять соответствующие ключи внутри ключа 'all'.
Объекты аутентификации ядра поддерживают следующие ключи конфигурации.

- ``fields`` Поля, используемые для аутентификации пользователя. Вы можете
  использовать ключи ``username`` и ``password``, чтобы указать поля для
  имени пользователя и пароля соответственно.
- ``userModel`` Имя модели для таблицы пользователей; По умолчанию - Users.
- ``finder`` Метод-файндер для получения записи из таблицы пользователей.
  По умолчанию устновлен в 'all'.
- ``passwordHasher`` Класс хешера паролей; По умолчанию ``Default``.
- Опции ``scope`` и ``contain`` являются устаревшими в версии 3.1. Используйте
  вместо них пользовательские файндеры для изменения запроса на выборку записи
  пользователя.
- Опция ``userFields`` является устаревшей в версии 3.1. Используйте метод 
  ``select()`` в вашем пользовательском файндере.
  
Чтобы настроить дополнительные поля для записи пользвателя в методе
``initialize()``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email', 'password' => 'passwd']
                ]
            ]
        ]);
    }

Не помещайте другие ключи конфигурации ``Auth``, такие как ``authError``, ``loginAction``,
и т.д. внутрь элементов ``authenticate`` или ``Form``. Они должны находиться на одном
с ними уровне. Приведенная выше настройка конфигурации компонента ``Auth`` с использованием
остальных параметров должна выглядеть так::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authError' => 'Вы правда думали, что вам можно видеть это?',
            'authenticate' => [
                'Form' => [
                    'fields' => ['username' => 'email']
                ]
            ],
            'storage' => 'Session'
        ]);
    }
    
В дополнение к стандартной конфигурации, Базовая аутентификация (Basic)
также поддерживает следующие ключи:

- ``realm`` Область, для которой предназначена аутентификация.
  По умолчанию ``env('SERVER_NAME')``.

В дополнение к стандартной конфигурации, Дайджест-аутентификация
также поддерживает следующие ключи:

- ``realm`` Область, для которой предназначена аутентификация.
  По умолчанию servername (имя сервера).
- ``nonce`` Значение nonce для аутентификации. По умолчанию ``uniqid()``.
- ``qop`` По умолчанию auth; другие значения пока не поддерживаются.
- ``opaque`` Строка, которая должна быть возвращена в неизменном виде
  клиентами. По умолчанию ``md5($config['realm'])``.

.. note::
    Чтобы найти запись пользователя, запрос к базе  данных происходит только
    с использованием имени пользователя. Проверка пароля производится в PHP.
    Это связано с тем, что алгоритмы хеширования, такие как bcrypt (алгоритм
    по умолчанию) генерируют новый хеш каждый раз, даже для неизменной строки,
    и в данном случае обычное сравнение строк в SQL становится неприменимым
    для проверки пароля.
    
Кастомизация поискового запроса
-------------------------------

Вы можете кастомизировать запрос на выборку записи пользователя с помощью
опции ``finder`` в группе параметров ``authenticate``::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'finder' => 'auth'
                ]
            ],
        ]);
    }

Это потребует наличия поискового метода ``findAuth()`` в вашем классе модели
``UsersTable``. В приведенном ниже примере запрос скорректирован для выборки
значений только из необходимых полей и добавлено условие выборки значений.
Вы должны убедиться, что происходит выборка значений из необходимых полей,
таких как ``username`` и ``password``::

    public function findAuth(\Cake\ORM\Query $query, array $options)
    {
        $query
            ->select(['id', 'username', 'password'])
            ->where(['Users.active' => 1]);

        return $query;
    }

.. note::
    Опция ``finder`` доступна только с версии 3.1. В более ранних версиях вы
    можете использовать опции ``scope`` и ``contain`` для изменения запроса.
    
Идентификация и вход пользователей
----------------------------------

.. php:method:: identify()

Вам необходимо вручную вызывать ``$this->Auth->identify()``, чтобы
идентифицировать пользователя, используя учетные данные предоставленные
в запросе. После этого вы должны использовать метод ``$this->Auth->setUser()``,
чтобы пользователь вошел в приложение, то есть данные о нем сохранились в
сессии.

При аутентификации пользователей прикрепленные объекты аутентификации
проверяются в том порядке, в котором они прикреплены. Как только один из
объектов сможет идентифицировать пользователя, другие объекты уже не проверяются.
Пример функции для работы с формой входа может выглядеть так::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            } else {
                $this->Flash->error(__('Username or password is incorrect'));
            }
        }
    }

Приведенный выше код сначала попробует идентифицировать пользователя, используя
POST-данные. В случае успеха данные о пользователе будут сохранены в сессии, благодаря
чему будут доступны между отправкой запросов, и после этого будет осуществляться
перенаправление на последнюю посещенную страницу, либо на URL, указанный в параметре
конфигурации ``loginRedirect``. В случае, если попытка входа окажется неудачной -
выведется флеш-сообщение об ошибке.

.. warning::

    Метод ``$this->Auth->setUser($data)`` авторизует пользователя, независимо от того,
    какие данные были ему переданы. Он не будет проверять пользовательские данные на
    соответствие классу аутентификации.
    
Перенаправление пользователей после входа
-----------------------------------------

.. php:method:: redirectUrl

После входа пользователя в систему вы, как правило, захотите перенаправить их
обратно туда, откуда они пришли. Передайте URL-адрес для установки целевой
страницы, на которую пользователь должен быть перенаправлен после входа в
систему.

Если параметр не будет передан, возвращаемый URL будет подчиняться следующим
правилам:

- Возвращается нормализованный URL из значения ``redirect`` строки запроса если
  он существует и находится в тод же домене, что и текущее приложение. До версии
  3.4.0  использовалось значение сессионной переменной ``Auth.redirect``.
- Если в строке запроса/сессии нужное значение отсутствует, но присвоено
  какое-либо значение параметру конфигурации ``loginRedirect``, то будет
  возвращено это значение.
- Если же и в параметре ``loginRedirect`` не окажется нужного значения, будет
  возвращен ``/``.
  
Создание системы аутентификации без сохранения состояния
--------------------------------------------------------

Базовая и Дайджест-аутентификация - это системы аутентификации не сохраняющие
состояние, и не требующие исходных POST-данных или формы. Если вы используете
только эти два способа аутентификации, вашему котроллеру необязательно наличие
экшена входа в систему (login). Cистема аутентификации без сохранения состояния
перепроверяет данные пользователя при каждом запросе. это создает небольшое
количество дополнительных накладных расходов, но позволяет клиентам
осуществлять вход без использования куки и делает AuthComponent более гибким
при создании API.

Для аутентификаторов без сохранения состояния параметр конфигурации ``storage``
следует установить в ``Memory``, чтобы ``AuthComponent`` не использовал сеccию
для хранения  записи пользователя. Вы также можете настроить параметр конфигурации
``unauthorizedRedirect`` в ``false``, чтобы ``AuthComponent`` выбрасывал
``ForbiddenException`` вместо поведения по умолчанию перенаправления на ссылающуюся
страницу.

Объекты аутентификации могут реализовывать метод ``getUser()``, который может
использоваться для поддержки систем входа пользователя, независящих от файлов
cookie. Типичный метод ``getUser()`` рассматривает запрос/среду и использует эту
информацию для подтверждения личности пользователя. Например, Базовая HTTP-аутентификация
использует ``$_SERVER['PHP_AUTH_USER']`` и ``$_SERVER['PHP_AUTH_PW']`` для полей
имени пользователя и пароля.

.. note::

    Если аутентификация не работает как ожидается, проверьте, выполняются ли
    вообще запросы (смотрите ``BaseAuthenticate::_query($username)``).
    Если запросы не выполняются, проверьте заполняются ли веб-сервером
    ключи ``$_SERVER['PHP_AUTH_USER']`` и ``$_SERVER['PHP_AUTH_PW']``.
    Если вы используете Apache с FastCGI-PHP, вам возможно потребуется
    добавить следующую строку в ваш корневой файл **.htaccess**::

        RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization},L]

При каждом запросе данные значения, ``PHP_AUTH_USER`` и ``PHP_AUTH_PW``, используются
повторной идентификации пользователя, чтобы убедиться в их подлинности. Как и в
случае с методом объекта аутентификации ``authenticate()``, метод ``getUser()``
должен возвращать массив с информацией о пользователе, либо ``false`` в случае
неудачи.::

    public function getUser(ServerRequest $request)
    {
        $username = env('PHP_AUTH_USER');
        $pass = env('PHP_AUTH_PW');

        if (empty($username) || empty($pass)) {
            return false;
        }
        return $this->_findUser($username, $pass);
    }

Пример выше показывает, как вы можете реализовать метод ``getUser()``
для Базовой HTTP-аутентификации. Метод ``_findUser()`` является частью
``BaseAuthenticate``, и идентифицирует пользователя на основе имени
пользователя и пароля.

.. _basic-authentication:

Использование базовой аутентификации
------------------------------------

Базовая аутентификация позволяет создать аутентификацию без сохранения состояния,
которая может использоваться в приложениях интрасети или для простых сценариев API.
Данные пользователя при базовой аутентификации будут перепроверяться при каждом
запросе.

.. warning::
    Базовая аутентификация передает пользовательские данные в виде открытого
    текста. Вы должны использовать протокол HTTPS при использовании Базовой
    аутентификации.

Чтобы использовать базовую аутентификацию, вам понадобится настроить
``AuthComponent``::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Basic' => [
                'fields' => ['username' => 'username', 'password' => 'api_key'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Здесь мы используем имя пользователя + ключ API в качестве наших полей, а
также используем модель Users.

Создание ключей API для Базовой аутентификации
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Так как базовый протокол HTTP передает пользовательские данные в виде открытого
текста, было бы неразумно, если бы пользователи передавали свои пароли. Вместо
этого обычно используется непрозрачный ключ API. Вы можете сгенерировать эти
API-токены произвольно, используя библиотеки входящие в состав CakePHP::

    namespace App\Model\Table;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\Utility\Text;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->getData('entity');

            if ($entity->isNew()) {
                $hasher = new DefaultPasswordHasher();

                // Генерируем 'токен' API
                $entity->api_key_plain = sha1(Text::uuid());

                // Хешируем токен с помощью Bcrypt, чтобы BasicAuthenticate
                // мог его проверить при входе.
                $entity->api_key = $hasher->hash($entity->api_key_plain);
            }
            return true;
        }
    }

Приведенный выше код генерирует случайный хеш для каждого пользователя по мере
их сохранения. В приведенном выше коде предполагается, что у вас есть два поля
``api_key`` - для хранения хэшированного API-ключа и ``api_key_plain`` - для
открытой текстовой версии ключа API, чтобы мы могли позже отобразить его
пользователю. Использование ключа вместо пароля означает, что даже через
простой протокол HTTP пользователи могут использовать непрозрачный токен вместо
исходного пароля. Также разумно включить логику, позволяющую восстанавливать
ключи API по запросу пользователя.

Использование Дайджест-аутентификации
-------------------------------------

Дайджест-аутентификация предлагает улучшенную модель безопасности по сравнению с
базовой аутентификацией, так как пользовательские данные никогда не передаются
в заголовке запроса. Вместо этого перается хеш.

Чтобы использовать дайджест-аутентификацию, вам понадобится настроить
``AuthComponent``::

    $this->loadComponent('Auth', [
        'authenticate' => [
            'Digest' => [
                'fields' => ['username' => 'username', 'password' => 'digest_hash'],
                'userModel' => 'Users'
            ],
        ],
        'storage' => 'Memory',
        'unauthorizedRedirect' => false
    ]);

Здесь мы используем имя пользователя + digest_hash в качестве наших полей и используем
модель Users.

Хеширование паролей для дайджест-аутентификации
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Поскольку для Дайджест-аутентификации требуется пароль, хэшированный
в формате, определенном RFC, для правильного хэширования пароля
для использования с Дайджест-аутентификацией вам следует использовать
специальную функцию хэширования пароля из ``DigestAuthenticate``. Если
вы собираетесь комбинировать дайджест-аутентификацию с любыми другими
стратегиями аутентификации, рекомендуется также сохранить
дайджест-пароль в отдельном поле,отличном от обычного хеша пароля::

    namespace App\Model\Table;

    use Cake\Auth\DigestAuthenticate;
    use Cake\Event\Event;
    use Cake\ORM\Table;

    class UsersTable extends Table
    {
        public function beforeSave(Event $event)
        {
            $entity = $event->getData('entity');

            // Создание пароля для дайджест-аутентификации.
            $entity->digest_hash = DigestAuthenticate::password(
                $entity->username,
                $entity->plain_password,
                env('SERVER_NAME')
            );
            return true;
        }
    }

Пароли для дайджест-аутентификации нуждаются в несколько большем количестве
информации, чем другие хеши паролей для дайджест-аутентификации, основанные
на RFC.

.. note::

    Третий параметр метода DigestAuthenticate::password() должен совпадать
    со значением параметра конфигурации 'realm', объявленным, когда
    DigestAuthentication настраивалось в AuthComponent::$authenticate.
    По умолчанию его значение - это ``env('SCRIPT_NAME')``. Возможно вам
    захочется изменить это значение на какую-нибудь статичную строку, если
    вы например хотите иметь согласованные хеши в различных окружениях.
    
Создание кастомных объектов аутентификации
------------------------------------------

Поскольку объекты аутентификации являются подключаемыми, вы можете
создавать собственные объекты аутентификации в своем приложении или плагинах.
Например, если вы хотите создать объект аутентификации OpenID.
В **src/Auth/OpenidAuthenticate.php** вы можете указать следующее::

    namespace App\Auth;

    use Cake\Auth\BaseAuthenticate;
    use Cake\Http\ServerRequest;
    use Cake\Http\Response;

    class OpenidAuthenticate extends BaseAuthenticate
    {
        public function authenticate(ServerRequest $request, Response $response)
        {
            // Делаем здесь необходимые действия для OpenID.
            // Возвращаем здесь массив с данным о пользователе,
            // либо возвращаем false в случае неудачи.
        }
    }

Объекты аутентификации должны возвращать ``false``, если идентификация
пользователя не удалась, либо массив с информацией о пользователе в
противном случае. Необязательно наследоваться от класса ``BaseAuthenticate``,
вы можете просто реализовать интерфейс ``Cake\Event\EventListenerInterface``.
Класс ``BaseAuthenticate`` предоставляет несколько полезных методов, которые
часто используются. Также вы можете реализовать метод ``getUser()``, если
ваш объект аутентификации поддерживает аутентификацию без сохранения
состояния или же без использования куки-файлов. Смотрите разделы по
базовой и дайджест-аутентификации ниже для более полной информации.

``AuthComponent`` запускает два события, ``Auth.afterIdentify`` и ``Auth.logout``,
после того, как пользователь был идентифицирован и перед его выходом из приложения
соответственно. Вы можете назначить коллбэк-функции для этих событий, задав их
в качестве значений в ассоциативном массиве внутри метода ``implementedEvents()``
вашего класса аутентификации::

    public function implementedEvents()
    {
        return [
            'Auth.afterIdentify' => 'afterIdentify',
            'Auth.logout' => 'logout'
        ];
    }
    
Использование кастомных объектов аутентификации
-----------------------------------------------

После того как вы создали свои собственные объекты аутентификации, вы
можете использовать ихвключая их в массив ``authenticate`` компонента
``AuthComponent``::

    $this->Auth->config('authenticate', [
        'Openid', // объект аутентификации приложения.
        'AuthBag.Openid', // объект аутентификации плагина.
    ]);

.. note::
    Обратите внимание, что при использовании простых обозначений
    при инициализации объекта аутентификации нет слова 'Authenticate'.
    Если вы все же используете пространства имен, вам нужно будет установить
    полное пространство имен класса, включая слово 'Authenticate'.
    
Обработка неаутентифицированных запросов
----------------------------------------

Когда пользователь, не прошедший проверку подлинности, пытается получить доступ
к защищенным страницам, прежде всего вызывается метод ``unauthenticated()``
последнего вызванного в цепочке аутентификатора. Объект аутентификации может
обрабатывать отправку ответа или перенаправление, возвращая объект ответа,
чтобы указать, что никаких дополнительных действий не требуется. В связи с этим,
порядок, в котором вы указываете провайдера аутентификации в параметре конфигурации
``authenticate``, имеет значение.

Если аутентификатор возвращает ``null``, то ``AuthComponent`` перенаправляет
пользователя на экшен входа(login). Если же это AJAX-запрос, и параметр
конфигурации ``ajaxLogin`` указывает, что элемент визуализируется иначе, то
будет возвращен код состояния HTTP 403.

Вывод флэш-сообщений компонента Auth
------------------------------------

Чтобы отображать сообщения об ошибках сессии, генерируемые ``Auth``, вам нужно
добавить следующий код в свой макет (``layout``). Добавьте следующие две
строки в файл **src/Template/Layout/default.ctp** в разделе ``body``::

    // Все, что необходимо для версий начиная с 3.4.0
    echo $this->Flash->render();

    // Для версий, предшествующих 3.4.0, потребуется следующее
    echo $this->Flash->render('auth');

Вы можете настроить сообщения об ошибках и параметры флэш-сообщений,
используемые ``AuthComponent``. Используя параметр конфигурации ``flash``, вы
можете настроить параметры, используемые AuthComponent для установки
флэш-сообщений. Доступные ключи:

- ``key`` - Используемый ключ, по умолчанию 'default'. В версиях ниже 3.4.0,
  по умолчанию использовалось значение 'auth'.
- ``element`` - Имя элемента использовать для визуализации, по
  умолчанию ``null``.
- ``params`` - Массив дополнительных используемых параметров, по
  умолчанию ``[]``.

В дополнение к настройкам флэш-сообщений, вы можете настраивать также и
другие сообщения об ошибках, используемые в ``AuthComponent``. В методе
``beforeFilter()`` или в настройках компонента вы можете использовать
``authError`` для кастомизации ошибок использующихся при неудачной
авторизации::

    $this->Auth->config('authError', "Упс, вы не авторизованы для получения доступа в этой области.");

Иногда вы хотите отобразить ошибку авторизации только после того, как
пользователь уже выполнил вход в систему. Вы можете подавить это сообщение,
установив его значение в булево ``false``.

В методе ``beforeFilter()`` вашего контроллера или в настройках компонента::

    if (!$this->Auth->user()) {
        $this->Auth->config('authError', false);
    }
    
.. _hashing-passwords:

Хеширование паролей
-------------------

Вы несете ответственность за хэширование паролей, перед тем, как они будут
сохранены в базе данных, самый простой способ - использовать функцию-сеттер
в вашей сущности ``User``::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
              return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

По умолчанию ``AuthComponent`` настроен на использование ``DefaultPasswordHasher``
при проверке учетных данных пользователя, поэтому при аутентификации
пользователей дополнительной настройки не требуется .

``DefaultPasswordHasher`` использует встроенный алгоритм хэширования ``bcrypt``,
который является одним из самых сильных решений хэширования паролей, используемых
в отрасли. Хотя рекомендуется использовать этот класс хэширования пароля, дело
может заключаться в том, что вы управляете базой данных пользователей, чей пароль
был захэширован иным способом.

Создание пользовательских классов хеширования паролей
-----------------------------------------------------

Чтобы использовать другой хешер пароля, вам необходимо создать класс в
**src/Auth/LegacyPasswordHasher.php** и реализовать методы ``hash()``
и ``check()``. Этот класс должен наследоваться от класса
``AbstractPasswordHasher``::

    namespace App\Auth;

    use Cake\Auth\AbstractPasswordHasher;

    class LegacyPasswordHasher extends AbstractPasswordHasher
    {

        public function hash($password)
        {
            return sha1($password);
        }

        public function check($password, $hashedPassword)
        {
            return sha1($password) === $hashedPassword;
        }
    }

После чего вам необходимо настроить AuthComponent для использования вашего
собственного хешера паролей::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Legacy',
                    ]
                ]
            ]
        ]);
    }

Поддержка устаревших систем - хорошая идея, но еще лучше сохранить базу
данных с последними достижениями в области безопасности. В следующем
разделе объясняется, как осуществить миграцию с одного алгоритма хеширования
на алгоритм, используемый в CakePHP по умолчанию.

Изменение алгоритмов хэширования
--------------------------------

CakePHP предоставляет чистый способ переноса паролей пользователей с одного алгоритма на
другой, это достигается с помощью класса ``FallbackPasswordHasher``.
Предполагая, что вы переносите приложение с CakePHP 2.x, который использует хэши паролей
``sha1``, вы можете настроить ``AuthComponent`` следующим образом::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form' => [
                    'passwordHasher' => [
                        'className' => 'Fallback',
                        'hashers' => [
                            'Default',
                            'Weak' => ['hashType' => 'sha1']
                        ]
                    ]
                ]
            ]
        ]);
    }

Первое имя, появляющееся в ключе ``hashers`, указывает, какой из классов
является предпочтительным, но будет возвращаться к остальным в списке, если
проверка была неудачной.

При использовании ``WeakPasswordHasher` вам нужно будет установить значение
``Security.salt``, чтобы гарантироватьнадежность паролей засчет использования
так называемой "соли".

Чтобы обновить пароли старых пользователей на лету, вы можете изменить функцию
входа соответствующим образом::

    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                if ($this->Auth->authenticationProvider()->needsPasswordRehash()) {
                    $user = $this->Users->get($this->Auth->user('id'));
                    $user->password = $this->request->getData('password');
                    $this->Users->save($user);
                }
                return $this->redirect($this->Auth->redirectUrl());
            }
            ...
        }
    }

Как вы можете заметить, мы просто устанавливаем простой пароль, так что
функция-сеттер в сущности будет хешировать пароль, как показано в предыдущем
примере, а затем сохранит сущность (entity).

Вход пользователей вручную
--------------------------

.. php:method:: setUser(array $user)

Иногда возникает необходимость, когда вам нужно вручную осуществлять вход
пользователя, например, сразу после регистрации в вашем приложении. Вы
можете сделать это вызвав метод ``$this->Auth->setUser()`` с данными того
пользователя, вход которого ('login') вы хотите осуществить::

    public function register()
    {
        $user = $this->Users->newEntity($this->request->getData());
        if ($this->Users->save($user)) {
            $this->Auth->setUser($user->toArray());
            return $this->redirect([
                'controller' => 'Users',
                'action' => 'home'
            ]);
        }
    }

.. warning::

    Убедитесь в том, что вы добавляете вручную id новому пользователю (``User``)
    в массиве, передаваемом методу ``setUser()``. В противном случае у вас будет
    отсутствовать идентификатор пользователя.

Получение доступа к вошедшим пользователям
------------------------------------------

.. php:method:: user($key = null)

Как только пользователь войдет в систему, вам часто потребуется какая-то
конкретная информация о текущем пользователе. Вы можете получить доступ
к вошедшему в приложение пользователю с помощью метода
``AuthComponent::user()``::

    // Вызов из контроллера или другого компонента
    $this->Auth->user('id');

Если текущий пользователь не вошел в приложение, или же если ключ не
существует, будет возвращено значение ``null``.

Выход пользователей
-------------------

.. php:method:: logout()

В конце концов вам понадобится быстрый способ разавторизовать кого-то
и перенаправить их туда, куда нужно. Этот метод также полезен, если
вы хотите предоставить ссылку «Выйти из системы» внутри области
вашего приложения для авторизованных пользователей::

    public function logout()
    {
        return $this->redirect($this->Auth->logout());
    }

Выход из приложения пользователей, вошедших в него с помощью Дайджест
или Базовой аутентификации, трудно выполнить для всех клиентов.
Большинство браузеров сохраняют учетные данные на протяжении всего
времени их работы. Некоторые клиенты могут быть принудительно выброшены
из приложения, отправкой кода состояния 401. Изменение области
аутентификации - это еще одно возможное решение, которое работает для
некоторых клиентов.

Когда выполнять аутентификацию
------------------------------

В некоторых случаях вы можете захотеть вызвать метод ``$this->Auth->user()``
внутри метода ``beforeFilter(Event $event)``. Это осуществимо при
использовании ключа конфигурации ``checkAuthIn``. Для этого внесите
следующие изменения для сопоставления, в каких событиях какие проверки
аутентификации должны быть осуществлены::

    //Настройка AuthComponent для аутентификации в методе initialize()
    $this->Auth->config('checkAuthIn', 'Controller.initialize');

По умолчанию значение ``checkAuthIn`` - ``'Controller.startup'`` - но при
использовании ``'Controller.initialize'`` первоначальная аутентификация
осуществляется перед методом ``beforeFilter()``.

Авторизация
===========

Авторизация - это процесс подтверждения того, что пользователь, прошедший
идентификацию/аутентифицикацию имееет права доступа к ресурсам, которые
он запрашивает. Если активный `` AuthComponent`` может автоматически
проверить обработчики авторизации и гарантировать, что зарегистрированным
пользователям разрешен доступ к ресурсам, которые они запрашивают.
Существует несколько встроенных обработчиков авторизации, и вы можете
создавать собственные для своего приложения или вкачестве части плагина.

- ``ControllerAuthorize`` Calls ``isAuthorized()`` on the active controller,
  and uses the return of that to authorize a user. This is often the most
  simple way to authorize users.

.. note::

    The ``ActionsAuthorize`` & ``CrudAuthorize`` adapter available in CakePHP
    2.x have now been moved to a separate plugin `cakephp/acl <https://github.com/cakephp/acl>`_.

Настройка обработчиков авторизации
----------------------------------

You configure authorization handlers using the ``authorize`` config key.
You can configure one or many handlers for authorization. Using
multiple handlers allows you to support different ways of checking
authorization. When authorization handlers are checked, they will be
called in the order they are declared. Handlers should return ``false``, if
they are unable to check authorization, or the check has failed.
Handlers should return ``true`` if they were able to check authorization
successfully. Handlers will be called in sequence until one passes. If
all checks fail, the user will be redirected to the page they came from.
Additionally, you can halt all authorization by throwing an exception.
You will need to catch any thrown exceptions and handle them.

You can configure authorization handlers in your controller's
``beforeFilter()`` or ``initialize()`` methods. You can pass
configuration information into each authorization object, using an
array::

    // Простейшая настройка
    $this->Auth->config('authorize', ['Controller']);

    // Передача параметров
    $this->Auth->config('authorize', [
        'Actions' => ['actionPath' => 'controllers/'],
        'Controller'
    ]);

Much like ``authenticate``, ``authorize``, helps you
keep your code DRY, by using the ``all`` key. This special key allows you
to set settings that are passed to every attached object. The ``all`` key
is also exposed as ``AuthComponent::ALL``::

    // Pass settings in using 'all'
    $this->Auth->config('authorize', [
        AuthComponent::ALL => ['actionPath' => 'controllers/'],
        'Actions',
        'Controller'
    ]);

In the above example, both the ``Actions`` and ``Controller`` will get the
settings defined for the 'all' key. Any settings passed to a specific
authorization object will override the matching key in the 'all' key.

If an authenticated user tries to go to a URL he's not authorized to access,
he's redirected back to the referrer. If you do not want such redirection
(mostly needed when using stateless authentication adapter) you can set config
option ``unauthorizedRedirect`` to ``false``. This causes ``AuthComponent``
to throw a ``ForbiddenException`` instead of redirecting.

Creating Custom Authorize Objects
---------------------------------

Because authorize objects are pluggable, you can create custom authorize
objects in your application or plugins. If for example, you wanted to
create an LDAP authorize object. In
**src/Auth/LdapAuthorize.php** you could put the
following::

    namespace App\Auth;

    use Cake\Auth\BaseAuthorize;
    use Cake\Http\ServerRequest;

    class LdapAuthorize extends BaseAuthorize
    {
        public function authorize($user, ServerRequest $request)
        {
            // Do things for ldap here.
        }
    }

Authorize objects should return ``false`` if the user is denied access, or
if the object is unable to perform a check. If the object is able to
verify the user's access, ``true`` should be returned. It's not required
that you extend ``BaseAuthorize``, only that your authorize object
implements an ``authorize()`` method. The ``BaseAuthorize`` class provides
a number of helpful methods that are commonly used.

Using Custom Authorize Objects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Once you've created your custom authorize object, you can use them by
including them in your ``AuthComponent``'s authorize array::

    $this->Auth->config('authorize', [
        'Ldap', // app authorize object.
        'AuthBag.Combo', // plugin authorize object.
    ]);

Using No Authorization
----------------------

If you'd like to not use any of the built-in authorization objects and
want to handle things entirely outside of ``AuthComponent``, you can set
``$this->Auth->config('authorize', false);``. By default ``AuthComponent``
starts off with ``authorize`` set to ``false``. If you don't use an
authorization scheme, make sure to check authorization yourself in your
controller's ``beforeFilter()`` or with another component.

Making Actions Public
---------------------

.. php:method:: allow($actions = null)

There are often times controller actions that you wish to remain
entirely public or that don't require users to be logged in.
``AuthComponent`` is pessimistic and defaults to denying access. You can
mark actions as public actions by using ``AuthComponent::allow()``. By
marking actions as public, ``AuthComponent`` will not check for a logged in
user nor will authorize objects to be checked::

    // Allow all actions
    $this->Auth->allow();

    // Allow only the index action.
    $this->Auth->allow('index');

    // Allow only the view and index actions.
    $this->Auth->allow(['view', 'index']);

By calling it empty you allow all actions to be public.
For a single action, you can provide the action name as a string. Otherwise, use an array.

.. note::

    You should not add the "login" action of your ``UsersController`` to allow list.
    Doing so would cause problems with the normal functioning of ``AuthComponent``.

Making Actions Require Authorization
------------------------------------

.. php:method:: deny($actions = null)

By default all actions require authorization. However, after making actions
public you want to revoke the public access. You can do so using
``AuthComponent::deny()``::

    // Deny all actions.
    $this->Auth->deny();

    // Deny one action
    $this->Auth->deny('add');

    // Deny a group of actions.
    $this->Auth->deny(['add', 'edit']);

By calling it empty you deny all actions.
For a single action, you can provide the action name as a string. Otherwise, use an array.

Using ControllerAuthorize
-------------------------

ControllerAuthorize allows you to handle authorization checks in a
controller callback. This is ideal when you have very simple
authorization or you need to use a combination of models and components
to do your authorization and don't want to create a custom authorize
object.

The callback is always called ``isAuthorized()`` and it should return a
boolean as to whether or not the user is allowed to access resources in
the request. The callback is passed the active user so it can be
checked::

    class AppController extends Controller
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth', [
                'authorize' => 'Controller',
            ]);
        }

        public function isAuthorized($user = null)
        {
            // Any registered user can access public functions
            if (!$this->request->getParam('prefix')) {
                return true;
            }

            // Only admins can access admin functions
            if ($this->request->getParam('prefix') === 'admin') {
                return (bool)($user['role'] === 'admin');
            }

            // Default deny
            return false;
        }
    }

The above callback would provide a very simple authorization system
where only users with role = admin could access actions that were in
the admin prefix.

Configuration options
=====================

The following settings can all be defined either in your controller's
``initialize()`` method or using ``$this->Auth->config()`` in your ``beforeFilter()``:

ajaxLogin
    The name of an optional view element to render when an AJAX request is made
    with an invalid or expired session.
allowedActions
    Controller actions for which user validation is not required.
authenticate
    Set to an array of Authentication objects you want to use when
    logging users in. There are several core authentication objects;
    see the section on :ref:`authentication-objects`.
authError
    Error to display when user attempts to access an object or action to which
    they do not have access.

    You can suppress authError message from being displayed by setting this
    value to boolean ``false``.
authorize
    Set to an array of Authorization objects you want to use when
    authorizing users on each request; see the section on
    :ref:`authorization-objects`.
flash
    Settings to use when Auth needs to do a flash message with
    ``FlashComponent::set()``.
    Available keys are:

    - ``element`` - The element to use; defaults to 'default'.
    - ``key`` - The key to use; defaults to 'auth'.
    - ``params`` - The array of additional params to use; defaults to '[]'.

loginAction
    A URL (defined as a string or array) to the controller action that handles
    logins. Defaults to ``/users/login``.
loginRedirect
    The URL (defined as a string or array) to the controller action users
    should be redirected to after logging in. This value will be ignored if the
    user has an ``Auth.redirect`` value in their session.
logoutRedirect
    The default action to redirect to after the user is logged out. While
    ``AuthComponent`` does not handle post-logout redirection, a redirect URL will
    be returned from :php:meth:`AuthComponent::logout()`. Defaults to
    ``loginAction``.
unauthorizedRedirect
    Controls handling of unauthorized access. By default unauthorized user is
    redirected to the referrer URL or ``loginAction`` or '/'.
    If set to ``false``, a ForbiddenException exception is thrown instead of
    redirecting.
storage
    Storage class to use for persisting user record. When using stateless
    authenticator you should set this to ``Memory``. Defaults to ``Session``.
    You can pass config options to storage class using array format. For e.g. to
    use a custom session key you can set ``storage`` to ``['className' => 'Session', 'key' => 'Auth.Admin']``.
checkAuthIn
    Name of the event in which initial auth checks should be done. Defaults
    to ``Controller.startup``. You can set it to ``Controller.initialize``
    if you want the check to be done before controller's ``beforeFilter()``
    method is run.

You can get current configuration values by calling ``$this->Auth->config()``::
only the configuration option::

    $this->Auth->config('loginAction');

    $this->redirect($this->Auth->config('loginAction'));

This is useful if you want to redirect a user to the ``login`` route for example.
Without a parameter, the full configuration will be returned.

Testing Actions Protected By AuthComponent
==========================================

See the :ref:`testing-authentication` section for tips on how to test controller
actions that are protected by ``AuthComponent``.



.. meta::
    :title lang=ru: Аутентификация
    :keywords lang=ru: обработчики аутентификации,массив php,базовая аутентификация,веб-приложение,различные способы,учетные данные,исключения,cakephp,logging
