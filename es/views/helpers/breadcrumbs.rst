Breadcrumbs
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

El Helper de Navegación por rastro proporciona una manera sencilla de gestionar la creación y representación de un rastro
de migas de pan para tu aplicación.

Creando un Rastro de Migas de Pan
====================================

Puedes agregar una miga a la lista utilizando el método "add()". Este método toma tres argumentos:

- **title** Un texto que se mostrará como el título de la miga.
- **url** Un textto o un arreglo de parámetros que se proporcionarán a la
  :doc:`/views/helpers/url`
- **options** Un arreglo de atributos para el ``item`` y ``itemWithoutLink``
  template. Ver la section acerca  :ref:`definir atributos para el registro
  <defining_attributes_item>` para más información.

Además de agregar al final del rastro, puedes realizar una variedad de operaciones::

    // Añade una miga al final.
    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Añade varias migas al final del rastro.
    $this->Breadcrumbs->add([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]],
    ]);

    // Añade una miga al principio.
    $this->Breadcrumbs->prepend(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Añade múltiple migas al final, en el orden dado
    $this->Breadcrumbs->prepend([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]],
    ]);

    // Inserta la miga en una posición específica. Si la posición está fuera de los
    // límites, se generará una excepción.
    $this->Breadcrumbs->insertAt(
        2,
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Inserta la miga antes de una miga específica, basado en el título.
    // Si no se puede encontrar el título de la miga nombrada,
    // se generará una excepción.
    $this->Breadcrumbs->insertBefore(
        'A product name', // el título de la miga para insertar antes
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Inserta la miga despues de una miga específica, basado en el título.
    // Si no se puede encontrar el título de la miga nombrada,
    // se generará una excepción.
    $this->Breadcrumbs->insertAfter(
        'A product name', // el título de la miga para insertar despues
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );



El uso de estos métodos te proporciona la capacidad de trabajar con el proceso de representación de dos pasos de CakePHP.
Dado que los ``templates`` y ``layouts`` se representan de adentro hacia afuera (es decir, los elementos incluidos se representan primero),
esto te permite definir con precisión dónde deseas agregar una miga de pan.


Renderización del Rastro de Migas de Pan
===========================================

Después de agregar migas al rastro, puedes representarlo fácilmente utilizando el método
``render()`` . Este método acepta dos argumentos en forma de arreglos:

- ``$attributes`` : Un arreglo de atributos que se aplicarán a la plantilla "wrapper".
   Esto te permite agregar atributos a la etiqueta HTML. Acepta la clave especial "templateVars"
   para permitir la inserción de variables de plantilla personalizadas en el ``template``.
- ``$separator`` : Un arreglo de atributos para el ``separator`` template.
   Las propiedades posibles son:

  - ``separator`` El texto que se mostrará como separador.
  - ``innerAttrs`` Para proporcionar atributos en caso de que tu separador esté dividido en dos elementos.
  - ``templateVars`` Permite la inserción de una variable de plantilla personalizada en el ``template``.

  Todas las demás propiedades se convertirán en atributos HTML y reemplazarán la clave "attrs" en la
  plantilla. Si utilizas el valor predeterminado para esta opción ``(empty)``,
  no se representará un separador.

Aquí tienes un ejemplo de cómo representar un rastro::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Personalizando el resultado
-----------------------------

El ``BreadcrumbsHelper`` internamente usa el ``StringTemplateTrait``, lo que proporciona
la capacidad de personalizar fácilmente la salida de varias cadenas HTML.
Incluye cuatro plantillas, con la siguiente declaración predeterminada::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{separator}}</span></li>'
    ]

Puedes personalizarlos fácilmente utilizando el método ``setTemplates()`` de
``StringTemplateTrait``::

    $this->Breadcrumbs->setTemplates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

Dado que tus ``templates`` serán renderizados, la opción ``templateVars``
te permite agregar tu propio template de variables a los diferentes templates ::

    $this->Breadcrumbs->setTemplates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

Para definir el parámetro ``{{icon}}``, simplemente especifícala al agregar la miga::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'templateVars' => [
                'icon' => '<i class="fa fa-money"></i>',
            ],
        ]
    );

.. _defining_attributes_item:

Definiendo Atributos
--------------------------------
Si deseas aplicar atributos HTML específicos tanto al elemento como a su subelemento,
puedes aprovechar la clave ``innerAttrs``, que proporciona el argumento ``$options``.
Todo excepto ``innerAttrs`` y ``templateVars`` se representará como atributos HTML.::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'class' => 'products-crumb',
            'data-foo' => 'bar',
            'innerAttrs' => [
                'class' => 'inner-products-crumb',
                'id' => 'the-products-crumb',
            ],
        ]
    );

    // Según la plantilla predeterminada, esto representará el siguiente HTML:
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Products</a>
    </li>

Borrando las Migas de Pan
============================

Puedes borrar las migas de pan utilizando el método ``reset()``.
Esto puede ser útil cuando deseas transformar las migas y sobrescribir la lista::

    $crumbs = $this->Breadcrumbs->getCrumbs();
    $crumbs = collection($crumbs)->map(function ($crumb) {
        $crumb['options']['class'] = 'breadcrumb-item';

        return $crumb;
    })->toArray();

    $this->Breadcrumbs->reset()->add($crumbs);

.. meta::
    :title lang=es: BreadcrumbsHelper
    :description lang=es: El papel del BreadcrumbsHelper en CakePHP es proporcionar una forma sencilla de gestionar las migas de pan.
    :keywords lang=en: breadcrumbs helper,cakephp migas de pan, migas

