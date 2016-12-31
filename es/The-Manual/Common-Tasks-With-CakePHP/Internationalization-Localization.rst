Internacionalización & Localización
###################################

Una de las mejores maneras para que tus aplicaciones lleguen a un
público más amplio es brindarlo en varios idiomas. Esto a menudo puede
resultar ser una tarea de enormes proporciones, pero las funciones de
internacionalización y localización en CakePHP lo hace mucho más fácil.

En primer lugar, es importante comprender algunos términos.
*Internacionalización* se refiere a la capacidad de una aplicación para
ser localiza. El término *localización* se refiere a la adaptación de
una aplicación para responder a los requerimientos de un lenguaje (o
cultura) específico (es decir, un "lugar"). La internacionalización y
localización son a menudo abreviados como i18n y l10n, respectivamente,
18 y 10 son el número de caracteres entre el primero y el último
carácter.

Internacionalizando su aplicación
=================================

Hay sólo unos pocos pasos para pasar de una aplicación de un solo idioma
a una aplicación multi-idioma, la primera de ellas es hacer uso de la
función ```__()`` <https://api.cakephp.org/file/basics.php#function-__>`_
en su código. A continuación se muestra un ejemplo de código para una
aplicación de un solo idioma:

::

    <h2>Posts</h2>

Para internacionalizar su código todo lo que necesitas hacer es envolver
las cadenas de texto en la función
`translate <https://api.cakephp.org/file/basics.php#function-__>`_ como
se muestra a continuación:

::

    <h2><?php __('Posts') ?></h2>

Si no hace nada más, estos dos ejemplos de código son funcionalmente
idénticos – ambos envían el mismo contenido al navegador. La `función
``__()`` <https://api.cakephp.org/file/basics.php#function-__>`_
traducirá la cadena de texto que se pasa si la traducción está
disponible, si no, devolverá la cadena sin modificar. Funciona de manera
similar a otras implementaciones de
`Gettext <https://en.wikipedia.org/wiki/Gettext>`_ (igual que otras
funciones de traducción como
```__d()`` <https://api.cakephp.org/file/basics.php#function-__d>`_,
```__n()`` <https://api.cakephp.org/file/basics.php#function-__n>`_ etc)

Con el código listo para ser multi-idioma, el siguiente paso es crear su
`archivo pot <https://en.wikipedia.org/wiki/Gettext>`_, que es el modelo
para todas las cadenas de texto traducibles en su aplicación. Para
generar archivos pot(s) todo lo que necesita es ejecutar la `tarea i18n
en la
consola <https://book.cakephp.org/view/620/Core-Console-Applications>`_,
que buscará las funciones translate utilizadas en su código y creará los
archivos por usted. Usted puede y debe volver a ejecutar esta tarea cada
vez que se produzca algún cambio de las traducciones en el código.

Los archivos pot(s) en si mismos no son utilizados por CakePHP, son las
plantillas utilizadas para crear o actualizar los `archivos
po <https://en.wikipedia.org/wiki/Gettext>`_, que contienen las
traducciones. Cake buscará los archivos po en la siguiente ubicación:

::

    /app/locale/<locale>/LC_MESSAGES/<domain>.po

El dominio por defecto es 'default', por lo tanto en su carpeta locale
se verá algo como esto:

::

    /app/locale/eng/LC_MESSAGES/default.po (English)   
    /app/locale/fre/LC_MESSAGES/default.po (French)   
    /app/locale/por/LC_MESSAGES/default.po (Portuguese) 

Para crear o editar su archivo po no se recomienda que utilice su editor
favorito. Para crear un archivo po por primera vez es recomendable
copiar el archivo pot a la ubicación correcta y cambiar la extensión, a
menos que usted esté familiarizado con su formato. Es muy fácil crear un
archivo po inválido o guardarlos con una codificación errónea (si está
editando manualmente el archivo po use UTF-8 para evitar problemas).
Existen herramientas gratuitas como `PoEdit <http://www.poedit.net>`_
que hacen de la edición y actualización de sus archivos po una tarea
fácil.

Los códigos de localización correctos son los de tres caracteres
conforme al estandar `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ aunque
si crea locales regionales (en\_US, en\_GB, etc.) Cake los utiliza si
procede.

hay un límite de 1.014 caracteres para cada valor msgstr.

Recuerde que los archivos po son útiles para mensajes cortos, si
necesita traducir párrafos largos, o incluso páginas completas, debe
considerar aplicar una solución diferente. Por ejemplo:

::

    // App Controller Code.
    function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(VIEWS . $locale . DS . $this->viewPath)) {
            // e.g. use /app/views/fre/pages/tos.ctp instead of /app/views/pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

o

::

    // View code
    echo $this->element(Configure::read('Config.language') . '/tos')

Localización en CakePHP
=======================

Para cambiar o definir el idioma para su aplicación sólo necesita hacer
lo siguiente:

::

    Configure::write('Config.language', 'fre');

Esto le dice a Cake qué localización debe usar (si usa una localización
regional como fr\_FR, como alternativa en caso que no exista, se
utilizará la localización de la norma `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_).
Puede cambiar el idioma en cualquier momento, por ejemplo en el
bootstrap si desea definir el idioma por defecto para su aplicación, en
el beforeFilter del controlador si el idioma es específico para una
petición o un usuario o en cualquier otro momento si desea mostrar un
mensaje en un idioma diferente.

Es una buena idea mostrar contenido disponible en varios idiomas a
partir de una URL diferente – esto hace que sea fácil para los usuarios
(y los motores de búsqueda) encontrar lo que están buscando en el idioma
esperado. Hay varias formas de hacer esto, puede ser utilizando
subdominios específicos para cada idioma, (en.example.com,
fra.example.com, etc), o usando un prefijo en la URL, como se hace en
esta aplicación. Usted también podría obtener la información del
navegador del usuario, entre otras cosas.

Como se menciona en la sección anterior, para mostrar el contenido
localizado se utiliza la función \_\_() o una de las funciones de
traducción disponibles a nivel mundial. El primer parámetro de la
función se utiliza como msgid definidos en los archivos .po.

Recuerde que debe usar el parámetro return de la función \_\_() si no
desea que se muestre la cadena de texto directamente. Por ejemplo:

::

    <?php
    echo $form->error(
        'Card.cardNumber',
        __("errorCardNumber", true),
        array('escape' => false)
    );
    ?>

Si a usted le gusta tener todos los mensajes de error de validación
traducidos por defecto, una solución simple sería añadir el siguiente
código en el app\_model.php:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }

La tarea i18n de la consola no será capaz de determinar el id del
mensaje del ejemplo anterior, lo que significa que tendrá que añadir las
entradas a su archivo po manualmente (o a través de su propio script).
Para evitar la necesidad de editar los archivos default.po cada vez que
ejecute la tarea i18n de la consola, puede utilizar un dominio
diferente, tal como:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __d('validation_errors', $value, true));
    }

Hay otro aspecto de la localización de su aplicación que no está
cubierto por el uso de las funciones de traducción, estos son los
formatos de fecha y moneda. No olvide que CakePHP es PHP :), por lo
tanto para establecer los formatos para este tipo de cosas deberá
utilizar ```setlocale`` <http://www.php.net/setlocale>`_.

Si pasa una localización que no existe en su computadora a
```setlocale`` <http://www.php.net/setlocale>`_, no tendrá ningún
efecto. Puede encontrar la lista de localizaciones disponibles
ejecutando el comando $locale -a
