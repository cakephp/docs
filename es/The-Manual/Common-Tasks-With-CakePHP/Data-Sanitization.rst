Limpieza de Datos
#################

La clase Sanitize de CakePHP puede ser usada para eliminar datos
maliciosos y otra información no deseada desde los datos enviados por un
usuario. Sanitize es una librería del núcleo, por lo que puede ser usada
en cualquier parte de tu código, pero probablemente será mejor usada en
los controladores y modelos.

CakePHP te protege automáticamente contra Inyección SQL **si** usas los
métodos ORM de CakePHP (como find() y save()) y la notación de arrays
apropiada (ejemplo array('campo' => $valor)) en lugar de sentencias SQL
incrustadas en el código. Para la limpieza de datos contra XSS
generalmente es mejor guardar el HTML sin tratar en la base de datos y
posteriormente limpiar los datos en el momento de mostrarlos.

Todo lo que necesitas hacer es incluír la librería del núcleo Sanitize
(p.ej. antes de la definición de la clase controlador):

::

    App::import('Sanitize');

    class MiController extends AppController {
        ...
        ...
    }

Una vez hecho eso, puedes hacer llamadas estáticas a Sanitize.

paranoid
========

paranoid(string $string, array $allowedChars);

Esta función elimina cualquier cosa desde $string que no sean caracteres
alfanuméricos. Esta función no eliminará ciertos caracteres al pasarlos
en el arreglo $allowedChars.

::

    $badString = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($badString);
    // salida: scripthtml
    echo Sanitize::paranoid($badString, array(' ', '@'));
    // salida: scripthtml    @@

html
====

html(string $string, boolean $remove = false)

Este método prepara los datos enviados por un usuario para desplegarlos
dentro de HTML. Esto es especialmente útil si no quieres que los
usuarios quiebren tus layouts o inserten imágenes o scripts dentro de
las páginas HTML. Si la opción $remove se deja en true, el contenido
HTML detectado es eliminado en vez de mostrado como entidades HTML.

::

    $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
    echo Sanitize::html($badString);
    // salida: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
    echo Sanitize::html($badString, true);
    // salida: HEY...

escape
======

escape(string $string, string $connection)

Usado para escapar sentencias SQL agregándole barras invertidas,
dependiendo de la configuración de magic\_quotes\_gpc del sistema.
$connection es el nombre de la base de datos para la cual escapar el
string, según el nombre definido en app/config/database.php.

clean
=====

``Sanitize::clean(mixed $data, mixed $options)``

Esta función es un limpiador multi-propósito y de potencia industrial, y
sirve para ser usado en arreglos (como $this->data, por ejemplo). La
función recibe un arreglo (o string) y retorna su versión limpia. Las
siguientes operaciones de limpieza son realizadas en cada elemento del
arreglo (recursivamente):

-  Los espacios raros (incluyendo 0xCA) son reemplazados con espacios
   regulares.
-  Verificación doble de caracteres especiales y remoción de retornos de
   carro para una mayor seguridad SQL.
-  Se agregan barras para SQL (sólo llama a la función sql explicada
   anteriormente).
-  Se reemplazan las barras invertidas ingresadas por el usuario por
   barras invertidas confiables.

