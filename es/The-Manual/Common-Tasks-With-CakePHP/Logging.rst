Logging
#######

Aunque los ajustes de Configuración de la clase desde el corazón de
CakePHP realmente puede ayudarle a ver qué pasa en el fondo, usted
necesitará algún tiempo para grabar datos en el disco para saber lo que
pasa. En un mundo cada vez más dependientes de tecnologías como SOAP y
AJAX, la depuración puede ser difíícil. .

La grabación (registro) puede ser también una manera de descubrir es que
ocurrió en su solicitud en cualquier momento. ¿Qué términos de búsqueda
se utilizaron? ¿Qué tipo de errores de mis usuarios que han visto? ¿Con
qué frecuencia se ejecuta una consulta?

En CakePHP la grabación (registro) es fácil - la función log () es un
elemento de la clase Object, que es el ancestro común de la mayoría de
las clases CakePHP. Si el contexto es una clase CakePHP (Modelo,
Controlador, Componente ... lo que sea), puede guardar sus datos.

Uso de la función log
=====================

La función log() toma dos parámetros. El primero es el mensaje que se
desea escribir en el archivo de log. Por defecto, este mensaje de error
es escrito en el log de errores ubicado en app/tmp/logs/error.log.

::

    //Ejecutando esto dentro de una clase CakePHP:
     
    $this->log("Algo que no hace nada!");
     
    //El resultado de esto se agrega a app/tmp/logs/error.log
     
    2007-11-02 10:22:02 Error: Algo que no hace nada!

El segundo parámetro es usado para definir el tipo de log con el se
quiere escribir el mensaje. Si no se suministra, el valor por defecto es
LOG\_ERROR, el cual escribe en el log de errores previamente mensionado.
Como alternativa, Se puede establecer este segundo parámetro a
LOG\_DEBUG, para escribir su mensaje en el log de depuración ubicado en
app/tmp/logs/debug.log:

::

    ///Ejecutando esto dentro de una clase CakePHP:
     
    $this->log('Un mensaje de depuración.', LOG_DEBUG);
     
    //El resultado de esto se agrega a app/tmp/logs/debug.log (en lugar de error.log)
     
    2007-11-02 10:22:02 Error: Un mensaje de depuración.

El usuario del servidor web debe poder escribir en el directorio app/tmp
para que el log pueda funcionar correctamente.
