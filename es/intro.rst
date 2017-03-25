CakePHP de un vistazo
#####################

CakePHP está diseñado para hacer tareas habituales de desarrollo web simples y
fáciles. Proporciona una caja de herramientas todo-en-uno y para que puedas
empezar rápidamente, las diferentes partes de CakePHP trabajan correctamente de 
manera conjunta o separada.

El objetivo de esta artículo es el de introducirte en los conceptos generales de 
CakePHP y darte un rápido vistazo sobre como esos conceptos están implementados 
en CakePHP. Si estás deseando comenzar un proyecto puedes :doc:`empezar con el tutorial 
</tutorials-and-examples/bookmarks/intro>`, o :doc:`profundizar en la documentación
</topics>`.

Convenciones sobre configuración
================================

CakePHP proporciona una estructura organizativa básica que cubre los nombres de 
las clases, archivos, tablas de base de datos y otras convenciones más. Aunque
lleva algo de tiempo aprender las convenciones, siguiéndolas CakePHP evitará
que tengas que hacer configuraciones innecesarias y hará que la estructura de la
aplicación sea uniforme y que el trabajo con varios proyectos sea sencillo. El
capítulo de :doc:`convenciones </intro/conventions>` muestra las que son utilizadas 
en CakePHP.

La capa Modelo
==============

La capa Modelo representa la parte de tu aplicación que implementa la lógica de
negocio. Es la responsable de obtener datos y convertirlos en los conceptos que
utiliza tu aplicación. Esto incluye procesar, validar, asociar u otras tareas
relacionadas con el manejo de datos.

En el caso de una red social la capa modelo se encargaría de tareas como guardar
los datos del usuario, las asociaciones de amigos, almacenar y obtener fotos,
buscar sugerencias de amistad, etc. Los objetos modelo serían "Amigo", 
"Usuario", "Comentario" o "Foto". Si quisieramos obtener más datos de nuestra
tabla ``usuarios`` podríamos hacer lo siguiente::

    use Cake\ORM\TableRegistry;

    $usuarios = TableRegistry::get('Usuarios');
    $query = $usuarios->find();
    foreach ($query as $row) {
        echo $row->nombreusuario;
    }

Como te habrás dado cuenta no hemos necesitado escribir ningún código previo 
para empezar a trabajar con nuestros datos. Al utilizar las convenciones CakePHP
usará clases estándar para tablas y clases de entidad que no hayan sido definidas.

Si queremos crear un nuevo usuario y guardarlo (con validaciones) podríamos hacer
algo como::

    use Cake\ORM\TableRegistry;

    $usuarios = TableRegistry::get('Usuarios');
    $usuario = $usuarios->newEntity(['email' => 'mark@example.com']);
    $usuarios->save($usuario);

La capa Vista
=============

La capa Vista renderiza una presentación de datos modelados. Separada de los
objetos Modelo, es la responsable de usar la información disponible para producir
cualquier interfaz de presentación que pueda necesitar tu aplicación.

Por ejemplo, la vista podría usar datos del modelo para renderizar una plantilla
HTML que los contenga o un resultado en formato XML::

    // En un archivo de plantilla de vista renderizaremos un 'element' para cada usuario.
    <?php foreach ($usuarios as $usuario): ?>
        <li class="usuario">
            <?= $this->element('usuario', ['usuario' => $usuario]) ?>
        </li>
    <?php endforeach; ?>

La capa Vista proporciona varias extensiones como :ref:`view-templates`, 
:ref:`view-elements` y :doc:`/views/cells` que te permiten reutilizar tu lógica
de presentación.

Esta capa no se limita a representaciones HTML o texto de los datos. Puede utilizarse
para otros formatos habituales como JSON, XML y a través de una arquitectura
modular, cualquier otro formato que puedas necesitar como CSV.

La capa Controlador
===================

La capa Controlador maneja peticiones de usuarios. Es la responsable de elaborar
una respuesta con la ayuda de las capas Modelo y Vista.

Un controlador puede verse como un gestor que asegura que todos los recursos 
necesarios para completar una tarea son delegados a los trabajadores oportunos. 
Espera por las peticiones de los clientes, comprueba la validez de acuerdo con las
reglas de autenticación y autorización, delega la búsqueda o procesado de datos
al modelo, selecciona el tipo de presentación que el cliente acepta y finalmente
delega el proceso de renderizado a la capa Vista. Un ejemplo de controlador para
el registro de un usuario sería::

    public function add()
    {
        $usuario = $this->Usuarios->newEntity();
        if ($this->request->is('post')) {
            $usuario = $this->Usuarios->patchEntity($usuario, $this->request->getData());
            if ($this->Usuarios->save($usuario, ['validate' => 'registration'])) {
                $this->Flash->success(__('Ahora estás registrado.'));
            } else {
                $this->Flash->error(__('Hubo algunos problemas.'));
            }
        }
        $this->set('usuario', $usuario);
    }

Puedes fijarte en que nunca renderizamos una vista explícitamente. Las convenciones
de CakePHP se harán cargo de seleccionar la vista correcta y de renderizarla con
los datos que preparemos con ``set()``.

.. _request-cycle:

Ciclo de una petición CakePHP
=============================

Ahora que te has familiarizado con las diferentes capas en CakePHP, revisemos
como funciona el ciclo de una petición:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: Diagrama de flujo mostrando una petición tipica de CakePHP

El ciclo de petición típico de CakePHP comienza con un usuario solicitando una
página o recurso en tu aplicación. A un alto nivel cada petición sigue los
siguientes pasos:

#. Las reglas de rescritura del servidor web envían la petición a **webroot/index.php**. 
#. Tu aplicación es cargada y ligada a un ``HttpServer``.
#. Se inicializa el ``midleware`` de tu aplicación.
#. Una petición y respuesta son precesadas a través del ``Middleware PSR-7`` que tu aplicación utiliza. Normalmente esto incluye la captura de errores y enrutamiento.
#. Si no recibe ninguna respuesta del ``middleware`` y la petición contiene información de enrutamiento, se selecciona un controlador y una acción.
#. La acción del controlador es ejecutada y el controlador interactúa con los Modelos y Componentes necesarios.
#. El controlador delega la creación de la respuesta a la Vista para generar la salida a partir de los datos del modelo.
#. La vista utiliza ``Helpers`` y ``Cells`` para generar el cuerpo y las cabeceras de la respuesta.
#. La respuesta es devuelta a través del :doc:`/controllers/middleware`.
#. El ``HttpServer`` envía la respuesta al servidor web.

Esto es solo el comienzo
========================

Ojalá este repaso rápido haya despertado tu curiosidad. Otras funcionalidades
geniales de CakePHP son:

* Un :doc:`framework para caché </core-libraries/caching>` que se integra con
  Memcached, Redis y otros métodos de caché.
* Poderosas :doc:`herramientas de generación de código
  </bake/usage>` para que puedas comenzar inmediatamente.
* :doc:`Framework para la ejecución de pruebas integrado </development/testing>` para que puedas asegurarte de que tu código funciona perfectamente.

Los siguientes pasos obvios son :doc:`descargar CakePHP </installation>`
y leer el :doc:`tutorial y crear algo asombroso </tutorials-and-examples/bookmarks/intro>`.

Lecturas complementarias
========================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=es: Empezando
    :keywords lang=es: estructura de carpetas,nombres de tablas,petición inicial,tabla de base de datos,estructura orgaizativa,rst,nombres de archivo,convenciones,mvc,web página,sit
