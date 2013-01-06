Manejo de Errores
#################

En caso de un error irrecuperable en tu aplicación, es común detener el
procesamiento y mostrar una página de error al usuario. Para ahorrarte
tener que codificar el manejo de esto en cada uno de tus controladores y
componentes, puedes usar el método:

::

    $this->cakeError(<string errorType>, [array parameters]);

Al llamar este método se mostrará una página de error al usuario y se
detendrá cualquier tipo de procesamiento en tu aplicacion.

CakePHP pre-define un conjunto de tipos de error, pero en estos momentos
(escritura de este manual), la mayoría son realmente útiles para el
mismo framework. Uno que es más útil para el desarrollador de
aplicaciones es el viejo y querido error 404. Puede ser llamado sin
ningún parámetro de la siguiente manera:

::

    $this->cakeError('error404');

De manera alternativa, puedes hacer que la página reporte que el error
fue en una URL específica pasando el parámetro ``url``:

::

    $this->cakeError('error404', array('url' => 'some/other.url'));

Todo esto comienza a ser mucho más útil al extender el administrador de
errores para que use tus propios tipos de error. Los administradores de
error customizados son principalmente como acciones de un controlador.
Típicamente vas a usar set() para dejar disponibles sus parámetros en la
vista y luego mostrar (render) un fichero tipo vista desde el directorio
``app/views/errors``.

Crea un fichero ``app/app_error.php`` con la siguiente definición.

::

    <?php
    class AppError extends ErrorHandler {
    }   
    ?>

Se pueden implementar administradores (handlers) para nuevos tipos de
error agregando métodos a esta clase. Simplemente crea un nuevo método
con el nombre que quieres usar como tu tipo de error.

Digamos que tenemos una aplicación que escribe cierta cantidad de
ficheros a disco y que es apropiado mostrale al usuario los errores de
escritura. No quieremos agregar código para esto en diferentas partes de
la aplicación, así que es un buen caso para usar un nuevo tipo de error.

Agrega un nuevo método a tu clase ``AppError``. Vamos a aceptar un
parámetro llamado ``file`` que será la ruta al fichero cuya escritura
fallo.

::

    function cannotWriteFile($params) {
      $this->controller->set('file', $params['file']);
      $this->__outputMessage('cannot_write_file');
    }

Crea la vista en ``app/views/errors/cannot_write_file.ctp``

::

    <h2>No fue posible escribir en el fichero</h2>
    <p>No se pudo escribir el fichero <?php echo $file ?> en el disco.</p>

y lanza el error en tu controllador/componente

::

    $this->cakeError('cannotWriteFile', array('file'=>'somefilename')); 

La implementación por defecto de ``$this->__outputMessage()`` sólo
mostrará la vista en ``views/errors/.ctp``. Si quieres cambiar este
comportamiento, puedes redefinir ``__outputMessage($template)`` en tu
clase AppError.
