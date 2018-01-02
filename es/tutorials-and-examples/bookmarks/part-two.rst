Tutorial Bookmarker (Favoritos) - Parte 2
#########################################

Tras realizar :doc:`la primera parte de este tutorial </tutorials-and-examples/bookmarks/intro>`
deberías tener una aplicación muy básica para guardar favoritos.

En este capítulo añadiremos la autenticación y restringiremos los favoritos
(bookmarks) para que cada usuario pueda consultar o modificar solamente los suyos.

Añadir login
============

En CakePHP, la autenticación se maneja mediante :doc:`/controllers/components`.

Los componentes pueden verse como una forma de crear trozos reutilizables de
código de controlador para una finalidad o idea. Además pueden engancharse al
evento de ciclo de vida de los controladores e interactuar con tu aplicación
de ese modo.

Para empezar añadiremos el componente :doc:`AuthComponent </controllers/components/authentication>`
a nuestra aplicación.

Como queremos que todos nuestros métodos requieran de autenticación añadimos
*AuthComponent* en *AppController* del siguiente modo::

    // En src/Controller/AppController.php
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
                'unauthorizedRedirect' => $this->referer() // Si no está autorizado,
				//el usuario regresa a la página que estaba
            ]);

            // Permite ejecutar la acción display para que nuestros controladores de páginas
            // sigan funcionando.
            $this->Auth->allow(['display']);
        }
    }

Acabamos de decirle a CakePHP que queremos cargar los compomentes ``Flash`` y
``Auth``. Además hemos personalizado la configuración de *AuthComponent* indicando
que utilice como *username* el campo *email* de la tabla *Users* de la base de datos.

Ahora si vas a cualquier *URL* serás enviado a **/users/login**, que mostrará una
página de error ya que no hemos escrito el código de la función *login* todavía,
así que hagámoslo ahora::

    // En src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Tu usuario o contraseña es incorrecta.');
        }
    }

Y en **src/Template/Users/login.ctp** añade lo siguiente::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->input('email') ?>
    <?= $this->Form->input('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

Ahora que tenemos un formulario de *login* sencillo deberíamos poder loguearnos
con algún usuario que tenga contraseña encriptada.

.. note::

    Si ninguno de tus usuarios tiene contraseña encriptada comenta la línea
	``loadComponent('Auth')``, a continuación edita un usuario y modifica
	la contraseña.

Ahora deberías poder loguearte, si no es así asegúrate de que estás utilizando
un usuario con contraseña encriptada.

Añadir *logout*
===============

Ahora que la gente puede loguearse probablemente quieras añadir una forma de
desloguearse también.

Otra vez en ``UsersController``, añade el siguiente código::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('Ahora estás deslogueado.');
        return $this->redirect($this->Auth->logout());
    }

Este código añade la acción ``logout`` como una acción pública e implementa
la función.

Ahora puedes visitar ``/users/logout`` para desloguearte, deberías ser enviado
a la página de inicio.

Habilitar registros
===================

Si no estás logueado e intentas acceder a **/users/add** eres reenviado a la
página de login. Deberíamos arreglar esto si queremos permitir que la gente se
pueda registrar en nuestra aplicación.

En el controlador ``UsersController`` añade lo siguiente::

    public function initialize()
    {
        parent::initialize();
        // Añade logout a la lista de actiones permitidas.
        $this->Auth->allow(['logout', 'add']);
    }

El código anterior le dice a ``AuthComponent`` que la acción ``add()`` no
necesita autenticación ni autorización.

Tal vez quieras tomarte un tiempo para limpiar **Users/add.ctp** y eliminar los
enlaces erróneos o continuar con el siguiente apartado. No vamos a crear la
edición de usuarios, consulta o listado en este tutorial así que no funcionará
el control de ``AuthComponent`` para el acceso a esas acciones del controlador.

Restringiendo el acceso a favoritos
===================================

Ahora que los usuarios pueden loguearse queremos restringir los favoritos que
uno puede ver a los que creó. Esto lo haremos usando un adaptador de
'authorization'.

Ya que nuestro requisito es muy sencillo podremos escribir un código también muy
sencillo en nuestro ``BookmarksController``.

Pero antes necesitamos decirle al componente *AuthComponent* cómo va a autorizar
acciones nuestra aplicación. Para ello añade en ``AppController``::

    public function isAuthorized($user)
    {
        return false;
    }

Además añade la siguiente línea a la configuración de ``Auth`` en tu ``AppController``::

    'authorize' => 'Controller',

Tú método ``initialize()`` debería verse así::

        public function initialize()
        {
            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                'authorize'=> 'Controller',// línea añadida
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
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Permite ejecutar la acción display para que nuestros controladores
            // de páginas sigan funcionando.
            $this->Auth->allow(['display']);
        }

Por defecto denegaremos el acceso siempre y concederemos los accesos donde tenga
sentido.

Primero añadiremos la lógica de autorización para favoritos.

En tu ``BookmarksController`` añade lo siguiente::

    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');

        // Las acciones add e index están siempre permitidas.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // El resto de acciones requieren un id.
        if (!$this->request->getParam('pass.0')) {
            return false;
        }

        // Comprueba que el favorito pertenezca al usuario actual.
        $id = $this->request->getParam('pass.0');
        $bookmark = $this->Bookmarks->get($id);
        if ($bookmark->user_id == $user['id']) {
            return true;
        }
        return parent::isAuthorized($user);
    }

Ahora si intentas consultar, editar o borrar un favorito que no te pertenece
deberías ser redirigido a la página desde la que accediste.

Si no se muestra ningún mensaje de error añade lo siguiente a tu layout::

    // En src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

Deberías poder ver ahora los mensajes de error de autorización.

Arreglar lista de consulta y formularios
========================================

Mientras que *view* y *delete* están funcionando, *edit*, *add* e *index* presentan un
par de problemas:

#. Cuando añades un favorito puedes elegir el usuario.
#. Cuando editas un favorito puedes elegir un usuario.
#. La página con el listado muestra favoritos de otros usuarios.

Abordemos el formulario de añadir favorito primero.

Para empezar elimina ``input('user_id')`` de **src/Template/Bookmarks/add.ctp**.

Con esa parte eliminada actualizaremos la acción ``add()`` de
**src/Controller/BookmarksController.php** para que luzca así::

    public function add()
    {
        $bookmark = $this->Bookmarks->newEntity();
        if ($this->request->is('post')) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('El favorito se ha guardado.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('El favorito podría no haberse guardado. Por favor, inténtalo de nuevo.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

Completando la propiedad de la entidad con datos de la sesión eliminaremos
cualquier posibilidad de que el usuario modifique el usuario al que pertenece
el favorito. Haremos lo mismo para el formulario de edición.

Tu acción ``edit()`` de **src/Controller/BookmarksController.php** debería ser
así::

    public function edit($id = null)
    {
        $bookmark = $this->Bookmarks->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $bookmark = $this->Bookmarks->patchEntity($bookmark, $this->request->getData());
            $bookmark->user_id = $this->Auth->user('id');
            if ($this->Bookmarks->save($bookmark)) {
                $this->Flash->success('El favorito se ha guardado.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('El favorito podría no haberse guardado. Por favor, inténtalo de nuevo.');
        }
        $tags = $this->Bookmarks->Tags->find('list');
        $this->set(compact('bookmark', 'tags'));
        $this->set('_serialize', ['bookmark']);
    }

Listado consulta
----------------

Ahora solo necesitamos mostrar los favoritos del usuario actualmente logueado.

Podemos hacer eso actualizando la llamada a ``paginate()``. Haz que tu método
``index()`` de **src/Controller/BookmarksController.php** se vea así::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Bookmarks.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('bookmarks', $this->paginate($this->Bookmarks));
        $this->set('_serialize', ['bookmarks']);
    }

Deberíamos actualizar también el método ``tags()`` y el método finder relacionado,
pero lo dejaremos como un ejercicio para que lo hagas por tu cuenta.

Mejorar la experiencia de etiquetado
====================================

Ahora mismo añadir nuevos tags es un proceso complicado desde que
``TagsController`` desautorizó todos los accesos.

En vez de permitirlos podemos mejorar la *UI* para la selección de tags
utilizando un campo de texto separado por comas. Esto proporcionará una mejor
experiencia para nuestros usuarios y usa algunas de las mejores características de *ORM*.

Añadir un campo calculado
-------------------------

Para acceder de forma sencilla a las etiquetas formateadas podemos añadir un
campo virtual/calculado a la entidad.

En **src/Model/Entity/Bookmark.php** añade lo siguiente::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

Esto nos dará acceso a la propiedad calculada ``$bookmark->tag_string`` que
utilizaremos más adelante.

Recuerda añadir la propiedad ``tag_string`` a la lista ``_accessible`` en tu
entidad para poder 'guardarla' más adelante.

En **src/Model/Entity/Bookmark.php** añade ``tag_string`` a ``$_accessible`` de
este modo::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];

Actualizar las vistas
---------------------

Con la entidad actualizada podemos añadir un nuevo campo de entrada para nuestros
tags. En **src/Template/Bookmarks/add.ctp** y **src/Template/Bookmarks/edit.ctp**,
cambia el campo ``tags._ids`` por el siguiente::

    echo $this->Form->input('tag_string', ['type' => 'text']);

Guardar el string de tags
-------------------------

Ahora que podemos ver los tags existentes como un string querremos guardar
también esa información.

Al haber marcado ``tag_string`` como accesible el ORM copiará esa información
del request a nuestra entidad. Podemos usar un método de gancho ``beforeSave()``
para parsear el *string* de etiquetas y encontrar/crear las entidades relacionadas.

Añade el siguiente código a **src/Model/Table/BookmarksTable.php**::

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // Hace trim a las etiquetas
        $newTags = array_map('trim', explode(',', $tagString));
        // Elimina las etiquetas vacías
        $newTags = array_filter($newTags);
        // Elimina las etiquetas duplicadas
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // Elimina las etiquetas existentes de la lista de nuevas etiquetas.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Añade las etiquetas existentes.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Añade las etiquetas nuevas.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

Aunque este código sea algo más complicado de lo que hemos hecho hasta ahora, nos
ayudará a ver lo potente que es el *ORM* en CakePHP.

Puedes manipular los resultados de la consulta usando los métodos
:doc:`/core-libraries/collections` y manejar escenearios en los que estás
creando entidades *on the fly* con facilidad.

Para finalizar
==============

Hemos mejorado nuestra aplicación de favoritos para manejar escenarios de
autenticación y de autorización/control de acceso básicos.

Además hemos añadido algunas mejoras interesantes de experiencia de usuario
sacándole provecho a *FormHelper* y al potencial de *ORM*.

Gracias por tomarte tu tiempo para explorar CakePHP. Ahora puedes realizar
el tutorial :doc:`/tutorials-and-examples/blog/blog`, aprender más sobre :doc:`/orm`,
o puedes leer detenidamente los :doc:`/topics`.

.. meta::
    :title lang=es: Tutorial Bookmarker (Favoritos) - Parte 2