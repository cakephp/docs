Atualização do PHPUnit 10
#########################

Com o CakePHP 5, a versão mínima do PHPUnit mudou de ``^8.5 || ^9.3`` para ``^10.1``.
Isso introduz algumas mudanças significativas tanto no PHPUnit quanto no CakePHP.

ajustes de phpunit.xml
======================

É recomendável deixar o PHPUnit atualizar seu arquivo de configuração por meio do seguinte comando::

  vendor/bin/phpunit --migrate-configuration

.. note::

    Certifique-se de que você já está no PHPUnit 10 via ``vendor/bin/phpunit --version`` antes de executar este comando!

Com esse comando concluído, seu ``phpunit.xml`` já terá a maioria das alterações recomendadas presentes.

Novo sistema de eventos
-----------------------

O PHPUnit 10 removeu o antigo sistema de hooks e introduziu um novo `Sistema de eventos
<https://docs.phpunit.de/en/10.5/extending-phpunit.html#extending-the-test-runner>`_
que requer que o seguinte código no seu ``phpunit.xml`` seja ajustado de::

  <extensions>
    <extension class="Cake\TestSuite\Fixture\PHPUnitExtension"/>
  </extensions>

para::

  <extensions>
    <bootstrap class="Cake\TestSuite\Fixture\Extension\PHPUnitExtension"/>
  </extensions>

``->withConsecutive()`` foi removido
====================================

Você pode converter o método removido ``->withConsecutive()`` em uma
solução provisória funcional, como você pode ver aqui::

    ->withConsecutive(['firstCallArg'], ['secondCallArg'])

deve ser convertido para::

    ->with(
        ...self::withConsecutive(['firstCallArg'], ['secondCallArg'])
    )

O método estático ``self::withConsecutive()`` foi adicionado por meio de ``Cake\TestSuite\PHPUnitConsecutiveTrait``
à classe base ``Cake\TestSuite\TestCase`` para que você não precise adicionar manualmente essa característica às suas classes Testcase.

os provedores de dados precisam ser estáticos
=============================================

Se seus casos de teste utilizam o recurso de provedor de dados do PHPUnit,
você precisa ajustar seus provedores de dados para que sejam estáticos::

    public function myProvider(): array

deve ser convertido para::

    public static function myProvider(): array

