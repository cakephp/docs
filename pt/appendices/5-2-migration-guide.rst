5.2 Migration Guide
###################

A versão 5.2.0 é compatível com a versão 5.0. Ela adiciona novas funcionalidades
e introduz novas descontinuações. Qualquer funcionalidade descontinuada na versão 5.x será
removida na versão 6.0.0.

Behavior Changes
================

- ``ValidationSet::add()`` agora gerará erros quando uma regra for adicionada com
  um nome já definido. Essa alteração visa evitar que as regras sejam
  sobrescritas acidentalmente.
- ``Http\Session`` agora gerará uma exceção quando uma predefinição de sessão inválida for usada.
- ``FormProtectionComponent`` agora gera ``Cake\Controller\Exception\FormProtectionException``. Esta
  classe é uma subclasse de ``BadRequestException`` e oferece o benefício de
  ser filtrável a partir de registros.
- ``NumericPaginator::paginate()`` agora usa a opção ``finder`` mesmo quando uma instância de ``SelectQuery`` é passada a ela.

Deprecations
============

Console
-------

- ``Arguments::getMultipleOption()`` está obsoleto. Use ``getArrayOption()`` em seu lugar.

Datasource
----------

- A capacidade de converter uma instância de ``EntityInterface`` para uma string foi descontinuada.
  Em vez disso, você deve usar ``json_encode()`` para a entidade.

- A atribuição em massa de múltiplos campos de entidade usando ``EntityInterface::set()`` foi descontinuada.
  Em vez disso, use ``EntityInterface::patch()``. Por exemplo, altere o uso de
  ``$entity->set(['field1' => 'value1', 'field2' => 'value2'])`` para
  ``$entity->patch(['field1' => 'value1', 'field2' => 'value2'])``.

Event
-----

- Retornar valores de ouvintes de eventos/retornos de chamada está obsoleto. Use ``$event->setResult()``
  em vez disso ou ``$event->stopPropogation()`` para simplesmente interromper a propagação do evento.

View
----

- A opção ``errorClass`` de ``FormHelper`` foi descontinuada em favor do uso de
  uma string de modelo. Para atualizar, mova sua definição de ``errorClass`` para
  um conjunto de modelos. Consulte :ref:`customizing-templates`.


New Features
============

Console
-------

- O comando ``cake counter_cache`` foi adicionado. Este comando pode ser usado para
  regenerar contadores para modelos que usam ``CounterCacheBehavior``.
- ``ConsoleIntegrationTestTrait::debugOutput()`` facilita a depuração
  de testes de integração para comandos de console.
- ``ConsoleInputArgument`` agora suporta a opção ``separator``. Esta opção
  permite que argumentos posicionais sejam delimitados com uma sequência de caracteres como
  ``,``. O CakePHP dividirá o argumento posicional em um array quando os argumentos
  forem analisados.
- ``Arguments::getArrayArgumentAt()`` e ``Arguments::getArrayArgument()``
  foram adicionados. Esses métodos permitem que você leia argumentos posicionais delimitados 
  por ``separator`` como arrays.
- ``ConsoleInputOption`` agora suporta a opção ``separator``. Esta opção
  permite que valores de opção sejam delimitados com uma sequência de caracteres como
  ``,``. O CakePHP dividirá o valor da opção em um array quando os argumentos
  forem analisados.
- ``Arguments::getArrayArgumentAt()``, ``Arguments::getArrayArgument()`` e ``Arguments::getArrayOption()``
  foram adicionados. Esses métodos permitem que você leia argumentos posicionais delimitados 
  por ``separator`` como arrays.

Database
--------

- O tipo ``nativeuuid`` foi adicionado. Este tipo permite que colunas ``uuid`` sejam
  usadas em conexões MySQL com MariaDB. Em todos os outros drivers, ``nativeuuid``
  é um alias para ``uuid``.
- ``Cake\Database\Type\JsonType::setDecodingOptions()`` foi adicionado. Este método
  permite definir o valor para o argumento ``$flags`` de ``json_decode()``.
- ``CounterCacheBehavior::updateCounterCache()`` foi adicionado. Este método permite
  atualizar os valores do cache do contador para todos os registros das associações
  configuradas. ``CounterCacheCommand`` também foi adicionado para fazer o mesmo através do
  console.
- ``Cake\Database\Driver::quote()`` foi adicionado. Este método fornece uma maneira de
  citar valores a serem usados ​​em consultas SQL onde instruções preparadas não podem
  ser usadas.

Datasource
----------

- As regras de aplicação agora podem usar ``Closure`` para definir a mensagem de validação.
  Isso permite criar mensagens de validação dinâmicas com base no estado da entidade
  e nas opções da regra de validação.

Error
-----

- Exceções personalizadas podem ter lógica específica de tratamento de erros definida em
  ``ErrorController``.

ORM
---

- ``CounterCacheBehavior::updateCounterCache()`` foi adicionado. Este método
  permite atualizar os valores do cache do contador para todos os registros das associações
  configuradas.
- ``BelongsToMany::setJunctionProperty()`` e ``getJunctionProperty()`` foram
  adicionados. Esses métodos permitem personalizar a propriedade ``_joinData`` que é
  usada para hidratar os registros da tabela de junção.
- ``Table::findOrCreate()`` agora aceita um array como segundo argumento para passar dados diretamente.

TestSuite
---------

- ``TestFixture::$strictFields`` foi adicionado. Habilitar esta propriedade fará com que
  os fixtures gerem um erro se a lista de registros de um fixture contiver campos que não
  existam no esquema.

View
----

- ``FormHelper::deleteLink()`` foi adicionado como um wrapper conveniente para links de exclusão em
  modelos usando o método ``DELETE``.
- ``HtmlHelper::importmap()`` foi adicionado. Este método permite definir
  mapas de importação para seus arquivos JavaScript.
- ``FormHelper`` agora usa o modelo ``containerClass`` para aplicar uma classe
  à div de controle do formulário. O valor padrão é ``input``.
