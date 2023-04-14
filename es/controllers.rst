Controllers
###########

.. php:namespace:: Cake\Controller

.. php:class:: Controller

Los controladores son la 'C' en MVC. Después de aplicar el enrutamiento y 
que el controlador
ha sido encontrado, la acción de tu controlador es llamado. Tu controlador
debe manejar la interpretación de los datos de la solicitud, 
asegurándose de que se llamen
a los modelos correctos y se muestre la respuesta o vista correcta. 
Los controladores se pueden
considerar como una capa intermedia entre el Modelo y la Vista. Quieres mantener
tus controladores delgados, y tus modelos gruesos. 
Esto te ayudará a reutilizar tu código
y más fácil de probar.

Comúnmente, un controlador se usa para administrar la lógica en torno 
a un solo modelo. Por
ejemplo, si estuvieras construyendo un sitio online para una panadería, 
podrías tener un
RecetasController que gestiona tus recetas y un IngredientesController 
que gestiona tus
ingredientes. Sin embargo, es posible hacer que los controladores trabajen 
con más de 
un modelo. En CakePHP, un controlador es nombrado a raíz del modelo que maneja.

Los controladores de tu aplicación extienden de la clase ``AppController``,
que a su vez extiende de la clase principal :php:class:`Controller`.
La clase ``AppController`` puede ser definida en **src/Controller/AppController.php**
y debería contener los métodos que se comparten entre todos los controladores 
de tu aplicación.

Los controladores proveen una serie de métodos que manejan las peticiones. Estos
son llamadas *acciones*. Por defecto, cada método público en un controlador es
una acción, y es accesible mediante una URL. Una acción es responsable de 
interpretar la petición y crear la respuesta. Por lo general, las respuestas
son de la forma de una vista renderizada, pero también, hay otras maneras de crear 
respuestas.

.. _app-controller:

The App Controller
==================

Como se indicó en la introducción, la clase ``AppController`` es clase padre de 
todos los controladores de tu aplicación.  ``AppController`` extiende de la clase
:php:class:`Cake\\Controller\\Controller` que está incluida en CakePHP.
``AppController`` se define en **src/Controller/AppController.php** como se 
muestra a continuación::

    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
    }

Los atributos y métodos del controlador creados en tu ``AppController`` van a 
estar disponibles en todos los controladores que extiendan de este. Los
componentes (que aprenderás más adelante) son mejor usados para código que se
encuentra en muchos (pero no necesariamente en todos) los componentes.

Puedes usar tu ``AppController`` para cargar componentes que van a ser utilizados
en cada controlador de tu aplicación. CakePHP proporciona un método ``initialize()``
que es llamado al final del constructor de un controlador para este tipo de uso::
    
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize(): void
        {
            // Always enable the CSRF component.
            $this->loadComponent('Csrf');
        }
    }

Request Flow
============



.. toctree::
    :maxdepth: 1

    controllers/pages-controller
    controllers/components

.. meta::
    :title lang=es: Controllers
    :keywords lang=es: correct models,controller class,controller controller,core library,single model,request data,middle man,bakery,mvc,attributes,logic,recipes
