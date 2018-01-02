Glosario
########

.. glossary::

    array de rutas
        Un array de atributos que son pasados a :php:meth:`Router::url()`.
        Típicamente se ve algo así::

            ['controller' => 'Posts', 'action' => 'view', 5]

    Atributos HTML
        Un array con claves => valores que son colocados en los atributos HTML. Por ejemplo::

            // Dado
            ['class' => 'mi-clase', 'target' => '_blank']

            // Generará
            class="mi-clase" target="_blank"

        Si una opción puede usar su nombre como valor, entonces puede ser usado ``true``::

            // Dado
            ['checked' => true]

            // Generará
            checked="checked"

    Sintaxis de plugin
        La sintáxis de plugin se refiere a el punto que separa los nombres de clases indicando
        que la clase es parte de un plugin::

            // El plugin es "DebugKit", y el nombre de la clase es "Toolbar".
            'DebugKit.Toolbar'

            // El plugin es "AcmeCorp/Tools", y el nombre de clase es "Toolbar".
            'AcmeCorp/Tools.Toolbar'

    Notación de punto
        La notación de punto define un array de rutas, separando los niveles anidados con ``.``
        Por ejemplo::

            Cache.default.engine

        Apuntará al siguiente valor::

            [
                'Cache' => [
                    'default' => [
                        'engine' => 'File'
                    ]
                ]
            ]

    CSRF
        *Cross Site Request Forgery*. Previene los ataques de replay o playback, peticiones
        duplicadas y peticiones falsificadas desde otros dominios.

    CDN
        *Content Delivery Network*. Le puedes pagar a un proveedor para que ayude a distribuir
        el contenido a centros de datos alrededor del mundo. Esto ayuda a poner elementos
        estáticos más cerca de tus usuarios geográficamente.

    routes.php
        Un archivo en el directorio ``config`` que contiene las configuraciones de enrutamiento.
        Este archivo se incluye antes de que cada petición sea procesada.
        Se deben conectar todas las rutas que necesita tu aplicación para que cada petición sea enrutada
        correctamente al controlador + acción.

    DRY
        *Don't repeat yourself*. Es un principio de desarrollo de software orientado a
        reducir la repetición de la información de todo tipo. En CakePHP, DRY
        se utiliza para que se pueda escribir las cosas una vez y reutilizarlos
        a través de su aplicación.

    PaaS
        *Platform as a Service*. La plataforma como servicio
        proporcionará recursos de hosting, bases de datos y almacenamiento
        en caché basado en la nube. Algunos proveedores populares incluyen
        Heroku, EngineYard y PagodaBox.

    DSN
        *Data Source Name*. Una cadena de conexión formateada para que sea como una URI.
        CakePHP soporta conexiones DSN para Caché, Base de datos, Registro y de E-mail.

.. meta::
    :title lang=es: Glosario
    :keywords lang=en: html attributes,array class,array controller,glossary glossary,target blank,dot notation,routing configuration,forgery,replay,router,syntax,config,submissions
