Glossary
########

.. glossary::

    routing array
        (Enrutamiento de array)
        Un array de atributos que son pasados a :php:meth:`Router::url()`.
        Usualmente se tipean de la siguiente manera::

            array('controller' => 'posts', 'action' => 'view', 5)

    HTML attributes
        (Atributos HTML)
        Un array de llaves => valores que se compone en HTML attributes(atributos HTML). Por ejemplo::

            // Dado
            array('class' => 'my-class', 'target' => '_blank')

            // Generara
            class="my-class" target="_blank"

        Si un atributo acepta su nombre(de atributo) como valor, se puede usar ``true``::

            // Dado
            array('checked' => true)

            // Generara
            checked="checked"

    plugin syntax
        (Sintaxis de plugin)
        Plugin syntax(Sintaxis de plugin) se refiere al punto separador del nombre de la clase
        indicación que la clase es parte de un plugin. Por ej.``DebugKit.Toolbar``.
        El plugin es DebugKit y el nombre de la clase es Toolbar.

    dot notation
        (Notación por puntos)
        Dot notation(notación por puntos) define la ruta dentro un array, separando valores anidados con ``.``
        Por ejemplo::

            Asset.filter.css

        Apuntara al siguiente valor::

            array(
                'Asset' => array(
                    'filter' => array(
                        'css' => 'got me'
                    )
                )
            )

    CSRF
        Cross Site Request Forgery(falsificación de petición en sitios cruzados).
        Previene ataques de reproducción,doble envío y peticiones falsas de otros dominios.

    routes.php
        Un archivo en APP/Config que contiene configuración de enrutamiento.
        Este archivo es incluido antes de que cualquier petición se procese.
        Debe conectar todas las rutas que tu aplicación necesita para que las peticiones puedan ser
        enrutadas al controlador + acción que corresponda.

    DRY
        Don't repeat yourself(No te repitas a ti mismo). Es un principio del desarrollo de software
        apuntado a reducir la repetición de información de cualquier tipo.
        En CakePHP DRY es usado para permitirte programar to código una vez, y re-usarlo en
        distintas partes de tu aplicación.


.. meta::
    :title lang=es: Glosario
    :keywords lang=es: atributos html,csrf,dry,repetir,array class,array controller,routing array,glosario,target blank,dot notation,notación de puntos,configuración de enrutamiento,forgery,replay,enrutador,sintaxis,configuración,envios