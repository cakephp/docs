Actualización a PHPUnit 10
##########################

Con CakePHP 5 la version mínima de PHPUnit ha cambiado de ``^8.5 || ^9.3`` a ``^10.1``.
Esto introduce algunos cambios importantes tanto por parte de PHPUnit como por parte de CakePHP.

Ajustes de phpunit.xml
======================

Se recomienda dejar que PHPUnit actualice su archivo de configuración a través del siguiente comando::

  vendor/bin/phpunit --migrate-configuration

.. note::

    ¡Asegúrese de que ya está en PHPUnit 10 a través de ``vendor/bin/phpunit --version`` antes de ejecutar este comando!

Una vez hayas ejecutado este comando, tu ``phpunit.xml`` tendrá mayoría de los cambios recomendados.

Nuevo sistema de eventos
------------------------

PHPUnit 10 eliminó el antiguo sistema de hook e introdujo un nuevo `Sistema de eventos
<https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner>`_
Lo que requiere que se ajuste el siguiente código en su ``phpunit.xml`` desde::

  <extensions>
    <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
  </extensions>

a::

  <extensions>
    <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
  </extensions>

``->withConsecutive()`` ha sido eliminado
=========================================

Puedes convertir el metodo ``->withConsecutive()`` eliminado
en una solución provisional que funcione como puede ver aquí::

    ->withConsecutive(['firstCallArg'], ['secondCallArg'])

debe convertirse a::

    ->with(
        ...self::withConsecutive(['firstCallArg'], ['secondCallArg'])
    )

se ha añadido el método estático ``self::withConsecutive()`` a través del método ``Cake\TestSuite\PHPUnitConsecutiveTrait``
a la clase base ``Cake\TestSuite\TestCase`` para que no tenga que agregar manualmente este trait a tus clases de TestCase.

Los proveedores de datos tienen que ser estáticos
=================================================

Si tus testcases aprovechan la función de proveedor de datos de PHPUnit entonces
tienes que ajustar tus proveedores de datos para que sean estáticos::

    public function myProvider(): array

debe convertirse en::

    public static function myProvider(): array


.. meta::
    :title lang=es: Actualización a PHPUnit 10
    :keywords lang=es: maintenance branch,community interaction,community feature,necessary feature,stable release,ticket system,advanced feature,power users,feature set,chat irc,leading edge,router,new features,members,attempt,development branches,branch development
