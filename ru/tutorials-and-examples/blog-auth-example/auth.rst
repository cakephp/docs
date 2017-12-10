Пример создания блога - Часть 4 - Аутентификация и авторизация
##############################################################

Следуя нашему примеру :doc:`/tutorials-and-examples/blog/blog`, представьте,
что мы хотим обеспечить доступ к определенным URL-адресам на основе 
зарегистрированного входа пользователей. У нас также есть еще одно требование:
чтобы наш блог имел нескольких авторов, которые могут создавать, редактировать
и удалять свои собственные статьи, не допуская, чтобы другие авторы вносили 
изменения в их статьи, которые они не создавали.

Создание всего пользовательского кода
=====================================

Во-первых, давайте создадим новую таблицу в нашей базе данных блогов, чтобы
хранить данные наших пользователей::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

Мы придерживались для cakephp конвенций в таблицах имен, но мы также
воспользуемся другой конвенцией: с помощью имени пользователя и пароля
столбцы в таблице пользователей, cakephp будут иметь возможность автоматически 
настраивать большинство вещей для нас при осуществлении входа пользователя в 
систему. 

Следующим шагом является создание класса таблицы users, отвечающего за поиск, 
сохранение и проверку данных пользователя::

    // src/Model/Table/UsersTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            return $validator
                ->notEmpty('username', 'A username is required')
                ->notEmpty('password', 'A password is required')
                ->notEmpty('role', 'A role is required')
                ->add('role', 'inList', [
                    'rule' => ['inList', ['admin', 'author']],
                    'message' => 'Please enter a valid role'
                ]);
        }

    }

Давайте также создадим наш UsersController. Следующее содержание соответствует
основной части класса UsersController, сгенерированной с помощью утилиты 
генерации кода - bake, поставляемой в комплекте с cakephp::

    // src/Controller/UsersController.php

    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            $this->Auth->allow('add');
        }

         public function index()
         {
            $this->set('users', $this->Users->find('all'));
        }

        public function view($id)
        {
            $user = $this->Users->get($id);
            $this->set(compact('user'));
        }

        public function add()
        {
            $user = $this->Users->newEntity();
            if ($this->request->is('post')) {
                // Prior to 3.4.0 $this->request->data() was used.
                $user = $this->Users->patchEntity($user, $this->request->getData());
                if ($this->Users->save($user)) {
                    $this->Flash->success(__('The user has been saved.'));
                    return $this->redirect(['action' => 'add']);
                }
                $this->Flash->error(__('Unable to add the user.'));
            }
            $this->set('user', $user);
        }

    }


Тем же образом, которым мы создадим Вид для нашей статьи с помощью инструмента
генерации кода (bake), таким же образом мы можем сгенерировать Вид для каждого 
пользователя. Для целей настоящего учебника, мы будем показывать только 
готовый add.ctp:

.. code-block:: php

    <!-- src/Template/Users/add.ctp -->

    <div class="users form">
    <?= $this->Form->create($user) ?>
        <fieldset>
            <legend><?= __('Add User') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
            <?= $this->Form->control('role', [
                'options' => ['admin' => 'Admin', 'author' => 'Author']
            ]) ?>
       </fieldset>
    <?= $this->Form->button(__('Submit')); ?>
    <?= $this->Form->end() ?>
    </div>

Аутентификация (Вход и выход из системы)
========================================

Теперь мы готовы добавить наш уровень проверки подлинности. В cakephp это 
осуществляется в классе :php:class:`Cake\\Controller\\Component\\AuthComponent`, 
классе ответственном за то, чтобы требовать вход, в ответ на определенные 
действия, обращений пользователя "Войти" и "Выйти" из системы, и также разрешать 
пользователям, вошедшим в систему действия, которые им дозволены.

Чтобы добавить эту возможность в ваше приложение, откройте файл 
**src/Controller/AppController.php** и добавьте следующие строки::

    // src/Controller/AppController.php

    namespace App\Controller;

    use Cake\Controller\Controller;
    use Cake\Event\Event;

    class AppController extends Controller
    {
        //...

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'loginRedirect' => [
                    'controller' => 'Articles',
                    'action' => 'index'
                ],
                'logoutRedirect' => [
                    'controller' => 'Pages',
                    'action' => 'display',
                    'home'
                ]
            ]);
        }

        public function beforeFilter(Event $event)
        {
            $this->Auth->allow(['index', 'view', 'display']);
        }
        //...
    }

Это не трудно настроить, так, как мы использовали конвенции для таблицы 
пользователей. Мы просто настраиваем URL-адреса, которые будут загружены после
входа и выхода пользователя, в нашем случае это ``/articles/`` и ``/``.

Так как мы хотим, чтобы наши посетители читали список записей без необходимости
предварительной регистрации в системе, то мы должны отфильтровать с помощью 
метода ``beforeFilter()`` компонента AuthComponent, все контроллеры не 
предназначенные для входа, т.е. все ``index()`` и ``view()``.

Теперь, мы уже в состоянии регистрировать новых пользователей, сохранять 
свое имя пользователя и пароль, и что еще более важно, хеш своего пароля, 
поэтому он не хранится в виде простого текста в нашей базе данных.
Давайте скажем AuthComponent, чтобы он добавил функцию проверки авторизации
пользователей, чтобы, после авторизации, они смогли входить в систему, и 
выходить из неё.::

    // src/Controller/UsersController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Event\Event;

    class UsersController extends AppController
    {
        // Другие методы..

        public function beforeFilter(Event $event)
        {
            parent::beforeFilter($event);
            // Разрешить пользователям регистрироваться и выходить из системы.
            // Вы не должны добавлять действие «login», чтобы разрешить список.
            // Это может привести к проблемам с нормальным функционированием 
            $this->Auth->allow(['add', 'logout']);
        }

        public function login()
        {
            if ($this->request->is('post')) {
                $user = $this->Auth->identify();
                if ($user) {
                    $this->Auth->setUser($user);
                    return $this->redirect($this->Auth->redirectUrl());
                }
                $this->Flash->error(__('Invalid username or password, try again'));
            }
        }

        public function logout()
        {
            return $this->redirect($this->Auth->logout());
        }
    }

Мы ещё не создали хеширование для паролей, поэтому нам нужен класс Entity,
у которого своя специфическая логика. Создадим файл **src/Model/Entity/User.php**
и добавим в него следующее::

    // src/Model/Entity/User.php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher;
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Make all fields mass assignable except for primary key field "id".
        protected $_accessible = [
            '*' => true,
            'id' => false
        ];

        // ...

        protected function _setPassword($password)
        {
            if (strlen($password) > 0) {
                return (new DefaultPasswordHasher)->hash($password);
            }
        }

        // ...
    }

Теперь каждый раз пароль, назначенный пользователю, будет хешироваться
с помощью класса `DefaultPasswordHasher`. Теперь создайте простой шаблон
файла Вида для функции входа: **src/Template/Users/login.ctp**
и добавьте следующие строки:

.. code-block:: php

    <!-- File: src/Template/Users/login.ctp -->

    <div class="users form">
    <?= $this->Flash->render() ?>
    <?= $this->Form->create() ?>
        <fieldset>
            <legend><?= __('Please enter your username and password') ?></legend>
            <?= $this->Form->control('username') ?>
            <?= $this->Form->control('password') ?>
        </fieldset>
    <?= $this->Form->button(__('Login')); ?>
    <?= $this->Form->end() ?>
    </div>

Теперь вы можете зарегистрировать нового пользователя, перейдя по URL-адресу
``/users/add`` и войти под учётной записью созданного пользователя. 
Для этого нужно зайти по URL-адресу ``/users/login``.
Кроме того, при попытке получить доступ к любому другому URL-адресу, который 
не был явно разрешен, например ``/articles/add``,  приложение автоматически 
перенаправит вас на страницу входа.

Функция ``beforeFilter()`` говорит AuthComponent что для действия ``add()``
требуется логин, а для ``index()`` и ``view()``, которые уже были добавлены
- он не нужен.

Метод ``login()`` вызывает ``$this->Auth->identify()`` из AuthComponent, и он 
работает без каких-либо дальнейших конфигураций, потому что мы следуем конвенции,
как упоминалось ранее. То есть, имея таблицу пользователей с именем пользователя 
и со столбцом пароля и при использовании формы, размещенной на контроллере с 
данными пользователя. Эта функция возвращает результат, был ли вход успешным или 
нет, а в случае если вход был успешен, то мы перенаправляем пользователя на 
заданный URL перенаправления, который мы указали при добавлении AuthComponent в 
наше приложение.

Выход работает, просто: перейдя по URL ``/users/logout``, пользователь 
перенаправляется на страницы входа, настроенную в logoutUrl.
Этот URL является результатом успешной работы метода ``AuthComponent::logout()``.

Авторизация (кому и к чему разрешен доступ)
============================================

Как было сказано выше, мы превращаем этот блог в многопользовательский инструмент
разработки, и для того чтобы сделать это, нам нужно внести немного изменений в 
таблицу статей и добавить ссылку на таблицу users::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Кроме того, небольшое изменение в ArticlesController необходимо для 
хранения данных пользователя, вошедшего в систему, в качестве эталона
для созданной статьи::

    // src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            // Prior to 3.4.0 $this->request->data() was used.
            $article = $this->Articles->patchEntity($article, $this->request->getData());
            // Added this line
            $article->user_id = $this->Auth->user('id');
            // You could also do the following
            //$newData = ['user_id' => $this->Auth->user('id')];
            //$article = $this->Articles->patchEntity($article, $newData);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);

        // Just added the categories list to be able to choose
        // one category for an article
        $categories = $this->Articles->Categories->find('treeList');
        $this->set(compact('categories'));
    }

Функция ``user()`` предоставляемая компонентом, возвращает из БД один столбец,
того пользователя который вошёл в систему. Мы использовали этот метод для 
добавления и сохранения данных запроса.

Давайте защитим наше приложение, чтобы запретить одним авторам редактировать
или удалять статьи других авторов. Основное правило для нашего приложения 
является таковым, что администратор может открыть любой URL-адрес, в то время 
как обычные пользователи (имеющие роль авторов) могут получить доступ только к
разрешенным действиям.

Снова откройте AppController класс и добавте еще несколько вариантов
конфигурации авторизации::

    // src/Controller/AppController.php

    public function initialize()
    {
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize' => ['Controller'], // Добавили эту строку
            'loginRedirect' => [
                'controller' => 'Articles',
                'action' => 'index'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ]
        ]);
    }

    public function isAuthorized($user)
    {
        // Администратор может получить доступ к каждому действию
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Иначе, запрещаем по умолчанию
        return false;
    }

Мы создали простой механизм авторизации. Пользователь с правами `admin`
сможет получить доступ к любому URL при входе в систему. Все остальные
пользователи - те, что с ролью `автора` - будут иметь такой же доступ как
пользователи, которые не вошли в систему.

Это не совсем то, что мы хотели. Нам нужно предоставить больше правил для
метода ``isAuthorized()``. Однако вместо того, чтобы сделать это в 
AppController, мы будем делегировать эти дополнительные правила для 
каждого отдельного контроллера. Правила, которые мы собираемся 
добавить в ArticlesController должны позволять авторам созданние 
статей, но запрещать авторам редактирование не своих статей. 
Добавьте следующее содержимое в ваш **ArticlesController.php**::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        // Все зарегистрированные пользователи могут добавлять статьи
        // До 3.4.0 $this->request->param('action') делали так.
        if ($this->request->getParam('action') === 'add') {
            return true;
        }

        // Владелец статьи может редактировать и удалять ее
        // До 3.4.0 $this->request->param('action') делали так.
        if (in_array($this->request->getParam('action'), ['edit', 'delete'])) {
            // До 3.4.0 $this->request->params('pass.0') делали так.
            $articleId = (int)$this->request->getParam('pass.0'); 
            if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

Мы сейчас реализовали вызов и готовность родительского класса проверки аторизации
пользователя ``isAuthorized()`` в контроллере AppController. Если же его нет, то
просто позволим пользователю получить доступ к действию добавления, редактироавния
и удаления. Сказать имеет ли право пользователь редактировать статьи, мы можем 
вызвав ``isOwnedBy()``. Давайте реализуем эту функцию::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

На этом наш простой учебник по проверке подлинности и авторизации окончен. 
Для обеспечения безопасности UserController вы можете следовать той же методике,
которой мы следовали для ArticlesController. Вы также можете быть более креативными
и кодировать что-то более общее в AppController, основвываясь на ваших собственных
правилах.

Если вам нужно больше контроля, мы предлагаем вам ознакомиться с полным руководством
Auth в :doc:`/controllers/components/authentication`, где вы найдете больше сведений
о настройке компонента, создании пользовательских классов авторизации и многом другом.

Рекомендуем к прочению
----------------------

#. :doc:`/bake/usage` Создание базового кода CRUD
#. :doc:`/controllers/components/authentication`: Регистрация пользователя и выход из системы

.. meta::
    :title lang=en: Simple Authentication and Authorization Application
    :keywords lang=ru: автоинкремент, приложение авторизации, пользователь модели, массив, соглашения, аутентификация, URL-адреса, cakephp, удаление, документ, колонки
