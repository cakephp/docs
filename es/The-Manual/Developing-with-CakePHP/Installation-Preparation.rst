Preparándose para Instalar
##########################

CakePHP es rápido y fácil de instalar.Los requisitos mínimos son un
servidor web y una copia de Cake, ¡solo eso! Aunque este manual se
enfoca primariamente en la configuración sobre Apache (por que es el
usado comúnmente), Tu puedes configurar Cake para correr sobre la
mayoría de servidores web, tales como, LightHTTPD o bien Microsoft IIS.
Preparar la instalación consta de los siguientes pasos:

-  Descargue CakePHP
-  Configure su servidor para manejar php si es necesario
-  Chequee los permisos de los archivos

Obteniendo CakePHP
==================

Hay dos principales maneras de obtener una copia limpia de CakePHP.
Puedes descargar una copia comprimida (zip/tar.gz/tar.bz2) de la página
web principal, o puedes obtener el código desde el repositorio git.

Para descargar la última *release* principal de CakePHP, dirígete a la
página web `https://cakephp.org <https://cakephp.org>`_ y haz clic
en el enlace “Download Now”.

Todas las *releases* actuales están alojadas en CakeForge. Este *site*
también contiene enlaces a muchos otros proyectos en CakePHP, incluyendo
*plugins* y aplicaciones para CakePHP. Las *releases* de CakePHP estásn
disponibles en
`http://cakeforge.org/projects/cakephp <http://cakeforge.org/projects/cakephp>`_.

Se crean *nightly builds* alternativas que incluyen parches y mejoras al
minuto (bueno, al día). Estas pueden ser accedidas desde la página
principal de descargas aquí:
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
Para actualizaciones realmente al minuto, puedes obtener el código
directamente de la rama de desarrollo del repositorio git aquí:
`http://code.cakephp.org/source <http://code.cakephp.org/source>`_.

Permisos
========

CakePHP usa el directorio /app/tmp para diferentes operaciones, como
almacenar descripciones de los modelos, vistas en cache, información de
sesiones, entre otros.

Por ello, asegúrate que el directorio /app/tmp de tu instalación de Cake
tenga permisos de escritura por el usuario del servidor web
