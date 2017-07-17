Entidades
####################

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Enquanto :doc:`/orm/table-objects` representam e fornecem acesso a uma coleção
de objetos, entidades representam linhas individuais ou objetos de domínio na
sua aplicação. Entidades contêm propriedades persistentes e métodos para
manipular e acessar os dados que elas contêm.

Entidades são criadas para você pelo CakePHP cada vez que utilizar o ``find()`` em um
objeto de Table.

Criando Classes de Entidade
============================

Você não precisa criar classes de entidade para iniciar com o ORM no CakePHP.
No entanto, se você deseja ter lógica personalizada nas suas entidades, você
precisará criar classes. Por convensão, classes de entidades ficam em 
**src/Model/Entity/**. Se a nossa aplicação tem um tabela ``articles``, poderiamos
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

    Se você não definir uma classe de entitdade o CakePHP usará a classe Entity básica.

Criando Entidade
=================

Entidades podem ser instanciadas diretamente::

    use App\Model\Entity\Article;

    $article = new Article();

Ao instanciar uma entidade, você pode passar as propriedades com os dados que deseja
armazenar nelas::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Outro maneira de obter novas entidades é usando o método ``newEntity()`` dos objetos
``Table``::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Acessando Dados de Entidade
===========================

Entidades fornecem algumas maneiras de acessar os dados que contêm. Normalmente, você
acessará os dados de uma entidade usando notação de objeto (object notation)::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

Você também pode usar os métodos ``get()`` e ``set()``::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

Ao usar ``set()``, você pode atualizar várias propriedades ao mesmo tempo usando
um array::

    $article->set([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. warning::
    
    Ao atualizar entidades com dados de requisição, você deve especificar com
    whitelist quais campos podem ser definidos com atribuição de massa.

Accessors & Mutators
====================

Além da simples interface get/set, as entidades permitem que você forneça
métodos acessadores e mutadores. Esses métodos deixam você personalizar
como as propriedades são lidas ou definidas.

Acessadores usam a convenção de ``_get`` seguido da versão CamelCased do nome
do campo.

.. php:method:: get($field)

Eles recebem o valor básico armazenado no array ``_properties`` como seu
único argumento. Acessadores serão usadas ao salvar entidades, então seja
cuidadoso ao definir métodos que formatam dados, já que os dados formatados
serão persistido. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

O acessador seria executado ao obter a propriedade através de qualquer uma dessas
duas formas::

    echo $user->title;
    echo $user->get('title');

Você pode personalizar como as propriedades são atribuidas definindo um mutador: 

.. php:method:: set($field = null, $value = null)

Os métodos mutadores sempre devem retornar o valor que deve ser armazenado na
propriedade. Como você pode ver acima, você também pode usar mutadores para
atribuir outras propriedades calculadas. Ao fazer isso, seja cuidadoso para não
introduzir nenhum loos, já que o CakePHP não impedirá os métodos mutadores de
looping infinitos.

Os mutadores permitem você converter as propriedades conforme são atribuidas, ou
criar dados calculados. Os mutadores e acessores são aplicados quando as
propriedades são lidas usando notação de objeto (object notation), ou usando os
métodos ``get()`` e ``set()``. Por exemplo::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            return Text::slug($title);
        }

    }

O mutador seria executado ao atribuir a propriedade através de qualquer uma
dessas duas formas::

    $user->title = 'foo'; // slug is set as well
    $user->set('title', 'foo'); // slug is set as well

.. _entities-virtual-properties:

Criando Propriedades Virtuais
-----------------------------

Ao definir acessadores, você pode fornecer acesso aos campos/propriedades que
não existem. Por exemplo, se sua tabela users tem ``first_name`` e
``last_name``, você poderia criar um método para o ``full_name``::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected function _getFullName()
        {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

Você pode acessar propriedades virtuais como se elas existissem na entidade.
O nome da propriedade será a versão lower case e underscored do método::

    echo $user->full_name;

Tenha em mente que as propriedades virtuais não podem ser usadas nos finds. Se
você deseja que as propriedades virtuais façam parte de representações JSON ou
array de suas entidades, consulte :ref:`exposing-virtual-properties`.

Verificando se uma Entidade Foi Modificada
==========================================

.. php:method:: dirty($field = null, $dirty = null)

Você pode querer fazer código condicional com base em se as propriedades foram
modificadas ou não em uma entidade. Por exemplo, você pode só querer validar 
campos quando eles mudarem::

    // See if the title has been modified.
    $article->dirty('title');

Você também pode marcar campos como sendo modificados. Isso é útil quando
adiciona item em propriedades do tipo array::

    // Adiciona um comentário e marca o campo como modificado
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

Além disso, você também pode basear o seu código condicional nos valores de
proprieades originais usando o método ``getOriginal()``. Esse método retornará
o valor original da propriedade se tiver sido modificado ou seu valor real.

Você também pode verificar se há mudanças em qualquer propriedade na entidade::

    // Verifica se a entidade foi modificada
    $article->dirty();

Para remover a marca de modificação (dirty flag) em um entidade, você pode usar
o método ``clean()``::

    $article->clean();

Ao criar uma nova entidade, você pode evitar que os campos sejam marcados como
modificados (dirty) passando uma opção extra::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

Para obter uma lista de todos as propriedades modificada (dirty) de uma ``Entity``,
você pode chamar::

    $dirtyFields = $entity->getDirty();

.. versionadded:: 3.4.3

    ``getDirty()`` foi adicionado.


Erros de Validação
==================

.. php:method:: errors($field = null, $errors = null)

Depois que você :ref:`salva uma entidade <saving-entities>`, quaisquer erros de
validação serão armazenados na própria entidade. Você pode acessar os erros
de validação usando os métodos ``getErrors()`` ou ``getError()``::

    // Obtem todos os errors
    $errors = $user->getErrors();
    // Antes da versão 3.4.0
    $errors = $user->errors();

    // Obtem os errors para um único campo.
    $errors = $user->getError('password');
    // Antes da versão 3.4.0
    $errors = $user->errors('password');

Os métodos ``setErrors()`` ou ``setError()`` podem também ser usados para definir
erros em uma entidade, tornando mais fácil testar código que trabalha com mensagens
de erro::

    $user->setError('password', ['Password is required']);
    $user->setErrors(['password' => ['Password is required'], 'username' => ['Username is required']]);
    // Antes da versão 3.4.0
    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

Atribuição em Massa
===================

Embora a definição de propriedades para entidades em massa seja simples e conveniente,
isso pode criar problemas de segurança significativos. Atribuindo em massa dados de
usuário apartir da requisição a uma entidade permite ao usuário modificar todas e
quaisquer colunas. Ao usar classes de entidade anônimas ou criar a classe de entidade
com :doc:`/bake`, o CakePHP não protege contra a atribuição em massa.

A propriedade ``_accessible`` permite que você forneça um mapa de propriedades
e se elas podem ou não ser atribuídas em massa. Os valores ``true`` e ``false``
indicam se um campo pode ou não ser atribuído em massa::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true
        ];
    }

Além dos campos concretos, existe um campo especial ``*`` que define o comportamento
de falbback se um campo não for especificamente nomeado::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

.. note:: Se a propriedade ``*`` não for definida, seu padrão será ``false``.

Evitando Proteção de Atribuição em Massa
----------------------------------------

Ao criar uma nova entidade usando a palavra-chave ``new``, você pode dizer para
não se proteger de atribuição em massa::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

Modificando os Campos Vigiados em Tempo de Execução
---------------------------------------------------

Você pode modificar a lista de campos vigiados em tempo de execução usando o
método ``accessible``::

    // Faz user_id ser acessível.
    $article->accessible('user_id', true);

    // Faz title ser vigiado.
    $article->accessible('title', false);

.. note::

    A modificação de campos afetam apenas a instância em que o método é
    chamado.

Ao usar os métodos ``newEntity()`` e ``patchEntity()`` nos objetos ``Table``,
você pode personalizar a proteção de atribuição em massa com opções, Por favor 
consulte a seção :ref:`changing-accessible-fields` para obter mais informações.

Ignorando Proteção de Campo
-----------------------------

Existem algumas situações em que você deseja permitir atribuição em massa
para campos vigiados (guarded)::

    $article->set($properties, ['guard' => false]);

Definindo a opção ``guard`` como ``false``, você pode ignorar a lista de
campos acessíveis para uma única chamado ao método ``set()``.


Verificando se uma Entidade foi Persistida
------------------------------------------

Frequentemente é necessário saber se uma entnidade representa uma linha que
já está no banco de dados. Nessas situações, use o método ``isNew()``::

    if (!$article->isNew()) {
        echo 'This article was saved already!';
    }

Se você está certo que uma entidade já foi persistida, você pode usar
``isNew()`` como um setter::

    $article->isNew(false);

    $article->isNew(true);

.. _lazy-load-associations:

Lazy Loading Associations
=========================

Embora que eager loading de associações é geralmente o modo mais eficiente de
acessar suas associações, pode exister momentos em que você precisa carregar
seus dados sobre demanda (lazy load). Antes de entrar em como carregar
associaçes sobre demanda, devemos discutir as diferenças entre eager loading e 
lazy loading de associações:

Eager loading
    Eager loading utiliza joins (onde possível) para buscar os dados do
    banco de dados em *poucas* consultas possível. Quando uma consulta separada
    é necessária, como no caso de uma associação HasMany, uma única consulta é
    emitida para buscar *todos* os dados associados para o conjunto atual de
    objetos.
Lazy loading
    Lazy loading difere o carregamento de associação até que seja absolutamente
    necessário. Embora isso posso economizar tempo de CPU, porque possivelmente
    dados não utilizados não são hidratados (hydrated) em objetos, isso pode
    resultar em muitas outras consultas sendo emitidas para o banco de dados.
    Por exemplo, fazer um loop sobre um conjunto de artigos e seus comentários
    frequentemente emitirão N consultas onde N é o número de artigos sendo
    iterados.

Embora lazy loading não esteja incluído no ORM do CakePHP, você pode usar um
dos plugins da comunidade para fazer isso. Nós recomendamos `o LazyLoad Plugin
<https://github.com/jeremyharris/cakephp-lazyload>`__

Depois de adicionar o plugin em sua entidade, você será capaz de fazer o seguinte::

    $article = $this->Articles->findById($id);

    // A propriedade comments foi carregado sobre demanda (lazy loaded)
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Criando Código Re-utilizável com Traits
=======================================

Você pode encontrar-se  precisando da mesma lógica em várias classes de entidades.
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
incluíndo-a::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

Convertendo para Arrays/JSON
============================

Ao construir APIs, você geralmente pode precisar converter entidades em arrays
ou dados JSON. CakePHP torna isso simples::

    // Obtem um array.
    // Associações serão convertida com toArray() também.
    $array = $user->toArray();

    // Converte para JSON
    // Associações serão convertida com jsonSerialize hook também.
    $json = json_encode($user);

Ao converter uma entidade para um JSON, as listas de campos virtuais e ocultos
são aplicadas. Entidades são recursivamente convertidas para JSON também. Isso
signinifica que, se você eager loaded entidades e suas associações, o CakePHP 
manipulará corretamente a conversão dos dados associados no formato correto.

.. _exposing-virtual-properties:

Expondo Propriedades Virtuais
-----------------------------

Por padrão, campos virtuais não são exportados ao converter entidades para arrays
ou JSON. Para expor propriedades virtuais, você precisa torna-las visíveis. Ao
definir sua classe de entidade, você pode fornecer uma lista de propriedades
virtuais que devem ser expostas::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

Esta lista pode ser modificada em tempo de execução usando o método
``virtualProperties``::

Ocultando Proprieddes
---------------------

Muitas vezes, há campos que você não deseja ser exportado em formatos
de array ou JSON. Por exemplo geralmente não é sensato expor hash de 
senha ou perguntas de recuperação de conta. Ao definir uma classe de
entidade, defina quais propriedades devem ser ocultadas::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_hidden = ['password'];

    }

Esta lista pode ser modificada em tempo de execução usando o método
``hiddenProperties``::

    $user->hiddenProperties(['password', 'recovery_question']);

Armazenando Tipos Complexos
===========================

Métodos Acessores & Mutadores em entidades não são destinados para conter
a lógica de serializar e deserializar dados complexos vindo do banco de dados.
Consulte a seção :ref:`saving-complex-types` para entender como sua aplicação
pode armazenar tipos de dado complexos, como arrays e objetos.

.. meta::
    :title lang=en: Entities
    :keywords lang=en: entity, entities, single row, individual record
