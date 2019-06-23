Middleware
##########

Los objetos del middleware le dan la posibilidad de "envolver" su aplicación en
capas compuestas y reutilizables de la lógica de manejo de la solicitud
o respuesta. Visualmente, su aplicación termina en el centro y el middleware se
envuelve en la aplicación como una cebolla. Aquí podemos ver una aplicación con
enrutamiento, activos, manejo de excepciones y middleware de encabezado CORS.

.. image:: /_static/img/middleware-setup.png


Cuando una solicitud es manejada por su aplicación, ésta ingresa desde el
extremo del middleware. Cada middleware puede delegar la solicitud / respuesta
a la siguiente capa, o devolver una respuesta. Devolver una respuesta evita que
las capas inferiores siempre vean la solicitud. Un ejemplo de eso es el
AssetMiddleware que maneja una solicitud de una imagen de un plugin durante el
desarrollo.

.. image:: /_static/img/middleware-request.png

Si ningún middleware toma medidas para manejar la solicitud, se ubicará un
controlador y se invocará su acción, o se generará una excepción generando una
página de error.

El middleware es parte de la nueva pila HTTP en CakePHP que aprovecha las
interfaces de solicitud y respuesta del PSR-7.  Debido a que CakePHP está
aprovechando el estándar PSR-7, puede usar cualquier middleware compatible con
PSR-7 disponible en The `Packagist <https://packagist.org>`__.

Middleware en CakePHP
=====================

CakePHP proporciona varios middleware para manejar tareas comunes en aplicaciones web:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` atrapa las excepciones del middleware envuelto
    y presenta una página de error usando el controlador de 
    :doc:`/development/errors` excepciones de manejo de errores y excepciones.
* ``Cake\Routing\AssetMiddleware`` comprueba si la solicitud se refiere a un archivo 
    de tema o complemento, como un archivo CSS, JavaScript o de imagen almacenado en 
    la carpeta webroot de un complemento o la correspondiente para un Tema.
* ``Cake\Routing\Middleware\RoutingMiddleware`` utiliza ``Router`` para analizar la URL entrante 
    y asignar parámetros de enrutamiento a la solicitud.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` permite el cambio automático de idioma desde 
    el ``Accept-Languageencabezado`` enviado por el navegador.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` facilita la adición de encabezados relacionados
    con la seguridad ``X-Frame-Options`` a las respuestas.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` le brinda la capacidad de manipular cookies 
    encriptadas en caso de que necesite manipular las cookies con datos confusos.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` agrega protección CSRF a su aplicación.
* ``Cake\Http\Middleware\BodyParserMiddleware`` le permite decodificar JSON, XML y otros cuerpos 
    de solicitud codificados basados ​​en ``Content-Type`` del encabezado.


.. note::
    La documentación no es compatible actualmente con el idioma español en esta página.

    Por favor, siéntase libre de enviarnos un pull request en
    `Github <https://github.com/cakephp/docs>`_ o utilizar el botón **Improve this Doc** para proponer directamente los cambios.

    Usted puede hacer referencia a la versión en Inglés en el menú de selección superior
    para obtener información sobre el tema de esta página.

.. meta::
    :title lang=es: Http Middleware
    :keywords lang=es: http, middleware, psr-7, request, response, wsgi, application, baseapplication
