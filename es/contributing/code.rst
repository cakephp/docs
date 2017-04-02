Código
######

Parches y *pull requests* son una manera genial de contribuir con código a CakePHP. 
Los *Pull requests* pueden ser creados en Github, preferiblemente a los archivos de
parches en los comentarios de tickets.

Configuración inicial
=====================

Antes de trabajar en parches para CakePHP es una buena idea configurar tu entorno
de trabajo.

Necesitarás los siguientes programas:

* Git
* PHP |minphpversion| o mayor
* PHPUnit 5.7.0 o mayor

Configura tu información de usuario con tu nombre/alias y correo electrónico 
de trabajo::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Si eres nuevo en Git, te recomendamos encarecidamente que leas el maravilloso
    y gratuito libro `ProGit <http://git-scm.com/book/>`_

Clona el código fuente de CakePHP desde GitHub:

* Si no tienes una cuenta de `GitHub <http://github.com>`_  créate una.
* Haz un *fork* del `repositorio CakePHP <http://github.com/cakephp/cakephp>`_ 
  haciendo click en el botón **Fork**.

Después de haber hecho el fork, clónalo en tu equipo local::

    git clone git@github.com:TUNOMBRE/cakephp.git

Añade el repositorio original de CakePHP como respositorio remoto, lo usarás más
adelante para buscar cambios en el repositorio de CakePHP. Esto te mantendrá
actualizado con CakePHP::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Ahora que tienes configurado CakePHP deberías poder definir un ``$test`` de 
:ref:`conexión de base de datos <database-configuration>` y
:ref:`ejecutar todos los tests <running-tests>`.

Trabajar en un parche
=====================

Cada vez que quieras trabajar en un bug, una funcionalidad o en una mejora,
crea una rama específica.

Tu rama debería ser creada a partir de la versión que quieras arreglar/mejorar.
Por ejemplo, si estás arreglando un error en la versión ``3.x`` deberías utilizar
la rama ``master`` como rama origen. Si tu cambio es para un error de la serie 2.x
deberías usar la rama ``2.x``. Esto hará más adelante tus *merges* más sencillos
al no permitirte Github editar la rama destino::

    # arreglando un error en 3.x
    git fetch upstream
    git checkout -b ticket-1234 upstream/master

    # arreglando un error en 2.x
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.x

.. tip::

    Usa un nombre descriptivo para tu rama, referenciar el ticket o nombre de la
    característica es una buena convención. P.ej. ticket-1234, nueva-funcionalidad

Lo anterior creará una rama local basada en la rama *upstream* 2.x (CakePHP)

Trabaja en tu correción y haz tantos *commits* como necesites, pero ten siempre en mente
lo siguiente:

* Sigue las :doc:`/contributing/cakephp-coding-conventions`.
* Añade un caso de prueba para mostrar el error arreglado o que la nueva funcionalidad
  funciona.
* Mantén lógicos tus commits y escribe comentarios de *commit* bien claros 
  y concisos.

Enviar un *Pull Request*
========================

Una vez estén hechos tus cambios y estés preparado para hacer el *merge* con CakePHP
tendrás que actualizar tu rama::

    # Hacer rebase de la corrección en el top de master
    git checkout master
    git fetch upstream
    git merge upstream/master
    git checkout <nombre_rama>
    git rebase master

Esto buscará y hará *merge* de cualquier cambio que haya sucedido en CakePHP desde que
empezaste. Entonces ejecutará *rebase* o replicará tus cambios en el *top* del
actual código. 

Puede que encuentres algún conflicto durante el *rebase*. Si este finaliza 
precipitadamente puedes ver qué archivos son conflictivos/*un-merged* con 
``git status``.
Resuelve cada conflicto y continúa con el *rebase*::

    git add <nombre_archivo> # haz esto con cada archivo conflictivo.
    git rebase --continue

Comprueba que todas tus pruebas continúan pasando. Entonces sube tu rama a tu *fork*::

    git push origin <nombre-rama>

Si has vuelto a hacer *rebase* después de hacer el *push* de tu rama necesitarás
forzar el *push*::

    git push --force origin <nombre-rama>

Una vez tu rama esté en GitHub puedes enviar un *pull request* en GitHub.

Seleccionar donde harán el *merge* tus cambios
----------------------------------------------

Cuando hagas *pull requests* deberás asegurarte de seleccionar la rama correcta
como base ya que no podrás editarla una vez creada.

* Si tus cambios son un *bugfix* (corrección de error) y no introduce ninguna
  funcionalidad nueva entonces selecciona **master** como destino del merge.
* Si tu cambio es una *new feature* (nueva funcionalidad) o un añadido al framework
  entonces deberías seleccionar la rama con el número de la siguiente versión. Por
  ejemplo si la versión estable actualmente es la ``3.2.10``, la rama que estará
  aceptando nuevas funcionalidades será la ``3.next``.
* Si tu cambio cesa una funcionalidad existente o de la *API* entonces tendrás
  que escojer la versión mayor siguiente. Por ejemplo, si la actual versión estable
  es la ``3.2.2`` entonces la siguiente versión en la que se puede cesar es la ``4.x``
  por lo que deberás seleccionar esa rama.

.. note::

    Recuerda que todo código que contribuyas a CakePHP será licenciado bajo la
    Licencia MIT, y la `Cake Software Foundation <http://cakefoundation.org/pages/about>`_ 
    será la propietaria de cualquier código contribuido. Los contribuidores deberán seguir las 
    `Guías de la comunidad CakePHP <http://community.cakephp.org/guidelines>`_.

Todos los *merge* de corrección de errores que se hagan a una rama de mantenimiento
se harán también periódicamente sobre futuros lanzamientos por el equipo central.

.. meta::
    :title lang=es: Código
    :keywords lang=es: código fuente cakephp,parches de código,test ref,nombre descriptivo,bob barker,configuración incial,usuario global,conexión a base de datos,clonar,repositorio,información de usuario,mejora,back patches,checkout
