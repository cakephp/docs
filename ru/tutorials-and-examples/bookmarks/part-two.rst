Пример Менеджер Закладок Часть 2
################################

После завершения :doc:`первой части данного руководства
</tutorials-and-examples/bookmarks/intro>` у вас должно быть очень простое
приложение для закладок. В этой главе мы добавим аутентификацию и ограничения
доступа к закладкам, чтобы каждый пользователь мог видеть/изменять только те
закладки, которые создавал непосредственно он.

Вход пользователя
=================

В CakePHP аутентификация обрабатывается :doc:`/controllers/components`.
Компоненты можно представить как повторно используемые куски кода Контроллера
для реализации какой-либо функциональности. Компоненты также могут цепляться
к жизненному циклу событий Контроллера и взаимодействовать с вашим 
приложением таким способом. Для начала мы добавим :doc:`Компонент Auth
</controllers/components/authentication>` в наше приложение. Мы в достаточной
степени хотим, чтобы каждый метод требовал аутентификацию, так что, мы 
добавим AuthComponent в наш AppController::

    // В src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                'unauthorizedRedirect' => $this->referer() // Если не авторизованы, то возвращаем на страницу, где только что были
            ]);

            // Разрешение экшена display, чтобы наш контроллер pages
            // продолжал работать.
            $this->Auth->allow(['display']);
        }
    }

Мы только что сообщили CakePHP, что мы хотим загрузить компоненты ``Flash`` и
``Auth``. В дополнение мы кастомизировали конфигурацию компонента Auth, таким
образом, что наша таблица users использует ``email`` в качестве имени
пользователя. Теперь, если вы попробуете перейти по любому URL, то будете
переброшены наURL **/users/login**, который покажет ошибку, так как мы еще не
написали необходимый код. Давайте создадим экшен login::

    // В src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Ваше имя пользователя или пароль не верны.');
        }
    }
    
И в **src/Template/Users/login.ctp** добавьте следующее::

    <h1>Вход</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->input('email') ?>
    <?= $this->Form->input('password') ?>
    <?= $this->Form->button('Войти') ?>
    <?= $this->Form->end() ?>

Теперь, когда у нас есть простая форма авторизации, мы должны иметь
возможность авторизоваться одним из существующих пользователей, у которого
есть хешированный пароль.

.. note::

    Если ни у одного из ваших пользователей нет хешированного пароля,
    закомментируйте строку ``loadComponent('Auth')``. Затем отредактируйте
    пользователя, сохранив новый пароль для них.
    
Теперь у вас должна появиться возможность войти в приложение под своим именем.
В противном случае, убедитесь, что вы используете учетную запись, у которой
есть хешированный пароль.

Выход пользователя
==================

Теперь, когда люди могут входить под своей учетной записью, вы вероятно
захотите также предоставить им возможность выходить из нее. Опять, в
``UsersController`` добавьте следующий код::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('Вы вышли из своей учетной записи.');
        return $this->redirect($this->Auth->logout());
    }
    
Этот код делает доступным экшен ``logout`` в качестве публичного и реализует
метод logout. Теперь вы можете перейти по адресу ``/users/logout``, чтобы
разавторизоваться. После этого вы должны быть перенаправлены на страницу
входа.

Добавление регистрации пользователей
====================================



.. note::
    The documentation is not currently supported in Russian language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the english version in the select top menu to have
    information about this page's topic.
