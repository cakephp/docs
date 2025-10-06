Entidades
##########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Enquanto :doc:`/orm/table-objects` representam e fornecem acesso a uma coleção
de objetos, entidades representam linhas individuais ou objetos de domínio na
sua aplicação. Entidades contêm métodos para manipular e
acessar os dados que elas contêm. Os campos também podem ser acessados como propriedades no objeto.

Entidades são criadas para você cada vez que você itera a instância de query retornada
por ``find()`` de um objeto de table ou quando você chama o método ``all()`` ou ``first()``
da instância de query.

Criando Classes de Entidade
============================

Você não precisa criar classes de entidade para iniciar com o ORM no CakePHP.
No entanto, se você deseja ter lógica personalizada nas suas entidades, você
precisará criar classes. Por convensão, classes de entidades ficam em
**src/Model/Entity/**. Se a nossa aplicação tem uma tabela ``articles``, podemos
criar a seguinte entidade::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Neste momento, essa entidade não faz muita coisa. No entanto, quando carregarmos dados
da nossa tabela articles, obteremos instâncias dessa classe.

.. note::

    Se você não definir uma classe de entidade, o CakePHP usará a classe Entity básica.

Criando Entidades
=================

Entidades podem ser instanciadas diretamente::

    use App\Model\Entity\Article;

    $article = new Article();

Ao instanciar uma entidade, você pode passar os campos com os dados que deseja
armazenar neles::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

A maneira preferida de obter novas entidades é usando o método ``newEmptyEntity()`` dos objetos
``Table``::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $article = $this->fetchTable('Articles')->newEmptyEntity();

    $article = $this->fetchTable('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

``$article`` será uma instância de ``App\Model\Entity\Article`` ou retornará para
``Cake\ORM\Entity`` se você não tiver criado a classe ``Article``.

.. note::

    Antes do CakePHP 4.3 você precisa usar ``$this->getTableLocator->get('Articles')``
    para obter a instância da table.

Acessando Dados de Entidade
============================

Entidades fornecem algumas maneiras de acessar os dados que contêm. Mais comumente, você
acessará os dados de uma entidade usando notação de objeto::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

Você também pode usar os métodos ``get()`` e ``set()``.

.. php:method:: set($field, $value = null, array $options = [])

.. php:method:: get($field)

Por exemplo::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

.. php:method:: patch(array $fields, array $options = [])

Usando ``patch()`` você pode atribuir vários campos de uma vez::

    $article->patch([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. note::

    ``patch()`` está disponível desde o CakePHP 5.2.0. Antes disso você deve usar
    ``set()`` em vez disso.

.. warning::

    Ao atualizar entidades com dados de requisição, você deve configurar quais campos
    podem ser definidos com atribuição em massa.

Você pode verificar se os campos estão definidos nas suas entidades com ``has()``::

    $article = new Article([
        'title' => 'First post',
        'user_id' => null
    ]);
    $article->has('title'); // true
    $article->has('user_id'); // true
    $article->has('undefined'); // false

O método ``has()`` retornará ``true`` se um campo estiver definido. Você pode usar
``isEmpty()`` e ``hasValue()`` para verificar se um campo contém um valor 'não vazio'::

    $article = new Article([
        'title' => 'First post',
        'user_id' => null,
        'text' => '',
        'links' => [],
    ]);
    $article->has('title'); // true
    $article->isEmpty('title');  // false
    $article->hasValue('title'); // true

    $article->has('user_id'); // true
    $article->isEmpty('user_id');  // true
    $article->hasValue('user_id'); // false

    $article->has('text'); // true
    $article->isEmpty('text');  // true
    $article->hasValue('text'); // false

    $article->has('links'); // true
    $article->isEmpty('links');  // true
    $article->hasValue('links'); // false

Se você frequentemente carrega entidades parcialmente, você deve habilitar o comportamento de acesso
estrito de propriedade para garantir que você não esteja usando propriedades que não foram carregadas. Em
uma base por entidade, você pode habilitar este comportamento::

    $article->requireFieldPresence();

Uma vez habilitado, acessar propriedades que não estão definidas levantará
uma :php:exc:`Cake\ORM\MissingPropertyException`.

Accessors & Mutators
====================

Além da simples interface get/set, as entidades permitem que você forneça
métodos acessadores e mutadores. Esses métodos deixam você personalizar
como os campos são lidos ou definidos.

Acessadores
-----------

Acessadores permitem que você personalize como os campos são lidos. Eles usam a convenção de
``_get(FieldName)`` com ``(FieldName)`` sendo a versão CamelCased (múltiplas
palavras são unidas em uma única palavra com a primeira letra de cada palavra
capitalizada) do nome do campo.

Eles recebem o valor básico armazenado no array ``_fields`` como seu
único argumento. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return strtoupper($title);
        }
    }

O exemplo acima converte o valor do campo ``title`` para uma versão
maiúscula cada vez que é lido. Ele seria executado ao obter o campo através de qualquer
uma dessas duas formas::

    echo $article->title; // retorna FOO em vez de foo
    echo $article->get('title'); // retorna FOO em vez de foo

.. note::

    O código nos seus acessadores é executado cada vez que você referencia o campo. Você pode
    usar uma variável local para armazená-lo em cache se estiver realizando uma operação que consome recursos
    intensivos no seu acessador como: `$myEntityProp = $entity->my_property`.

.. warning::

    Acessadores serão usados ao salvar entidades, então tenha cuidado ao definir métodos
    que formatam dados, pois os dados formatados serão persistidos.

Mutadores
---------

Você pode personalizar como os campos são definidos definindo um mutador. Eles usam a
convenção de ``_set(FieldName)`` com ``(FieldName)`` sendo a versão CamelCased
do nome do campo.

Mutadores devem sempre retornar o valor que deve ser armazenado no campo.
Você também pode usar mutadores para definir outros campos. Ao fazer isso,
tenha cuidado para não introduzir loops, pois o CakePHP não impedirá
métodos mutadores infinitamente em loop. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {
        protected function _setTitle($title)
        {
            $this->slug = Text::slug($title);

            return strtoupper($title);
        }
    }

O exemplo acima está fazendo duas coisas: Ele armazena uma versão modificada do
valor fornecido no campo ``slug`` e armazena uma versão maiúscula no
campo ``title``. Ele seria executado ao definir o campo através de
qualquer uma dessas duas formas::

    $user->title = 'foo'; // define o campo slug e armazena FOO em vez de foo
    $user->set('title', 'foo'); // define o campo slug e armazena FOO em vez de foo

.. warning::

  Acessadores também são executados antes das entidades serem persistidas no banco de dados.
  Se você quiser transformar campos mas não persistir essa transformação,
  recomendamos usar campos virtuais, pois eles não são persistidos.

.. _entities-virtual-fields:

Criando Campos Virtuais
------------------------

Ao definir acessadores, você pode fornecer acesso a campos que não
existem realmente. Por exemplo, se sua tabela users tem ``first_name`` e
``last_name``, você poderia criar um método para o nome completo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected function _getFullName()
        {
            return $this->first_name . '  ' . $this->last_name;
        }
    }

Você pode acessar campos virtuais como se eles existissem na entidade. O nome da
propriedade será a versão minúscula e com underline do método (``full_name``)::

    echo $user->full_name;
    echo $user->get('full_name');

Tenha em mente que campos virtuais não podem ser usados em finds. Se você quiser
que eles façam parte de representações JSON ou array das suas entidades,
veja :ref:`exposing-virtual-fields`.

Verificando se uma Entidade Foi Modificada
===========================================

.. php:method:: dirty($field = null, $dirty = null)

Você pode querer fazer código condicional com base em se os campos foram
alterados ou não em uma entidade. Por exemplo, você pode só querer validar
campos quando eles mudarem::

    // Veja se o título foi modificado.
    $article->isDirty('title');

Você também pode marcar campos como sendo modificados. Isso é útil quando
adiciona item em campos de array, pois isso não marcaria automaticamente o campo como modificado, apenas
trocar completamente marcaria.::

    // Adiciona um comentário e marca o campo como modificado.
    $article->comments[] = $newComment;
    $article->setDirty('comments', true);

Além disso, você também pode basear o seu código condicional nos valores de
campo originais usando o método ``getOriginal()``. Esse método retornará
o valor original do campo se tiver sido modificado ou seu valor real.

Você também pode verificar se há mudanças em qualquer campo na entidade::

    // Veja se a entidade foi modificada
    $article->isDirty();

Para remover a marca de modificação dos campos em uma entidade, você pode usar
o método ``clean()``::

    $article->clean();

Ao criar uma nova entidade, você pode evitar que os campos sejam marcados como modificados
passando uma opção extra::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

Para obter uma lista de todos os campos modificados de uma ``Entity``, você pode chamar::

    $dirtyFields = $entity->getDirty();

Erros de Validação
==================

Depois que você :ref:`salva uma entidade <saving-entities>`, quaisquer erros de
validação serão armazenados na própria entidade. Você pode acessar os erros
de validação usando os métodos ``getErrors()``, ``getError()`` ou ``hasErrors()``::

    // Obtem todos os erros
    $errors = $user->getErrors();

    // Obtem os erros para um único campo.
    $errors = $user->getError('password');

    // A entidade ou qualquer entidade aninhada tem um erro.
    $user->hasErrors();

    // Somente a entidade raiz tem um erro
    $user->hasErrors(false);

Os métodos ``setErrors()`` ou ``setError()`` também podem ser usados para definir
erros em uma entidade, tornando mais fácil testar código que trabalha com mensagens
de erro::

    $user->setError('password', ['Password is required']);
    $user->setErrors([
        'password' => ['Password is required'],
        'username' => ['Username is required']
    ]);

.. _entities-mass-assignment:

Atribuição em Massa
===================

Embora a definição de campos para entidades em massa seja simples e conveniente,
isso pode criar problemas de segurança significativos. Atribuindo em massa dados de
usuário da requisição em uma entidade permite ao usuário modificar todas e
quaisquer colunas. Ao usar classes de entidade anônimas ou criar a classe de entidade
com :doc:`/bake`, o CakePHP não protege contra a atribuição em massa.

A propriedade ``_accessible`` permite que você forneça um mapa de campos e
se eles podem ou não ser atribuídos em massa. Os valores ``true`` e ``false``
indicam se um campo pode ou não ser atribuído em massa::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected array $_accessible = [
            'title' => true,
            'body' => true
        ];
    }

Além dos campos concretos, existe um campo especial ``*`` que define o comportamento
de fallback se um campo não for especificamente nomeado::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected array $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

.. note:: Se o campo ``*`` não for definido, seu padrão será ``false``.

Evitando Proteção de Atribuição em Massa
-----------------------------------------

Ao criar uma nova entidade usando a palavra-chave ``new``, você pode dizer para
não se proteger de atribuição em massa::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

Modificando os Campos Vigiados em Tempo de Execução
----------------------------------------------------

Você pode modificar a lista de campos vigiados em tempo de execução usando o
método ``setAccess()``::

    // Faz user_id ser acessível.
    $article->setAccess('user_id', true);

    // Faz title ser vigiado.
    $article->setAccess('title', false);

.. note::

    A modificação de campos acessíveis afeta apenas a instância em que o método é
    chamado.

Ao usar os métodos ``newEntity()`` e ``patchEntity()`` nos objetos ``Table``,
você pode personalizar a proteção de atribuição em massa com opções. Por favor
consulte a seção :ref:`changing-accessible-fields` para obter mais informações.

Ignorando Proteção de Campo
----------------------------

Existem algumas situações em que você deseja permitir atribuição em massa
para campos vigiados (guarded)::

    $article->patch($fields, ['guard' => false]);

Definindo a opção ``guard`` como ``false``, você pode ignorar a lista de
campos acessíveis para uma única chamada ao método ``patch()``.

Verificando se uma Entidade foi Persistida
-------------------------------------------

Frequentemente é necessário saber se uma entidade representa uma linha que
já está no banco de dados. Nessas situações, use o método ``isNew()``::

    if (!$article->isNew()) {
        echo 'This article was saved already!';
    }

Se você está certo que uma entidade já foi persistida, você pode usar
``setNew()``::

    $article->setNew(false);

    $article->setNew(true);

.. _lazy-load-associations:

Lazy Loading Associations
==========================

Embora que eager loading de associações é geralmente o modo mais eficiente de
acessar suas associações, pode existir momentos em que você precisa carregar
dados associados de forma lazy. Antes de entrar em como carregar associações de forma lazy,
devemos discutir as diferenças entre eager loading e lazy loading de associações:

Eager loading
    Eager loading utiliza joins (onde possível) para buscar os dados do
    banco de dados em *poucas* consultas possível. Quando uma consulta separada
    é necessária, como no caso de uma associação HasMany, uma única consulta é
    emitida para buscar *todos* os dados associados para o conjunto atual de
    objetos.
Lazy loading
    Lazy loading difere o carregamento de dados de associação até que seja absolutamente
    necessário. Embora isso possa economizar tempo de CPU porque possivelmente
    dados não utilizados não são hidratados em objetos, isso pode
    resultar em muitas outras consultas sendo emitidas. Por exemplo, fazer um loop sobre um conjunto de artigos
    e seus comentários frequentemente emitirá N consultas onde N é o número de artigos sendo
    iterados.

Embora lazy loading não esteja incluído no ORM do CakePHP, você pode usar um
dos plugins da comunidade para fazer isso. Nós recomendamos `o LazyLoad Plugin
<https://github.com/jeremyharris/cakephp-lazyload>`__

Depois de adicionar o plugin em sua entidade, você será capaz de fazer o seguinte::

    $article = $this->Articles->findById($id);

    // A propriedade comments foi carregada de forma lazy
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Criando Código Re-utilizável com Traits
========================================

Você pode encontrar-se precisando da mesma lógica em várias classes de entidades.
As Traits do PHP são perfeitas para isso. Você pode colocar as traits da sua
aplicação em **src/Model/Entity**. Por convensão traits no CakePHP são sufixadas
com ``Trait`` para que elas possam ser discerníveis de classes ou interfaces.
Traits são geralmente um bom complemento para os behaviors, permitindo que você
forneça funcionalidade para objetos de tabela e entidade.

Por exemplo, se tivéssemos plugin SoftDeletable, isso poderia fornecer uma trait.
Essa trait poderia fornecer métodos para marcar entidades como 'deleted', o método
``softDelete`` poderia ser fornecido por uma trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait
    {
        public function softDelete()
        {
            $this->set('deleted', true);
        }
    }

Você poderia então usar essa trait na sua classe de entidade importando-a e
incluindo-a::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

Convertendo para Arrays/JSON
=============================

Ao construir APIs, você geralmente pode precisar converter entidades em arrays
ou dados JSON. CakePHP torna isso simples::

    // Obtem um array.
    // Associações serão convertidas com toArray() também.
    $array = $user->toArray();

    // Converte para JSON
    // Associações serão convertidas com jsonSerialize hook também.
    $json = json_encode($user);

Ao converter uma entidade para JSON, as listas de campos virtuais e ocultos
são aplicadas. Entidades são recursivamente convertidas para JSON também. Isso
significa que, se você eager loaded entidades e suas associações, o CakePHP
manipulará corretamente a conversão dos dados associados no formato correto.

.. _exposing-virtual-fields:

Expondo Campos Virtuais
------------------------

Por padrão, campos virtuais não são exportados ao converter entidades para arrays
ou JSON. Para expor campos virtuais, você precisa torná-los visíveis. Ao
definir sua classe de entidade, você pode fornecer uma lista de campos
virtuais que devem ser expostos::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected array $_virtual = ['full_name'];
    }

Esta lista pode ser modificada em tempo de execução usando o método
``setVirtual()``::

    $user->setVirtual(['full_name', 'is_admin']);

Ocultando Campos
----------------

Muitas vezes, há campos que você não deseja ser exportado em formatos
de array ou JSON. Por exemplo, geralmente não é sensato expor hashes de
senha ou perguntas de recuperação de conta. Ao definir uma classe de
entidade, defina quais campos devem ser ocultados::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected $_hidden = ['password'];
    }

Esta lista pode ser modificada em tempo de execução usando o método
``setHidden()``::

    $user->setHidden(['password', 'recovery_question']);

Armazenando Tipos Complexos
============================

Métodos Acessadores & Mutadores em entidades não são destinados para conter
a lógica de serializar e deserializar dados complexos vindo do banco de dados.
Consulte a seção :ref:`saving-complex-types` para entender como sua aplicação
pode armazenar tipos de dados mais complexos, como arrays e objetos.

.. meta::
    :title lang=en: Entities
    :keywords lang=en: entity, entities, single row, individual record
