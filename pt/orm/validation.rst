Validando Dados
###############

Antes de :doc:`salvar seus dados</orm/saving-data>` você
provavelmente vai querer garantir que os dados estão corretos e consistentes. No CakePHP temos
duas etapas de validação:

1. Antes que os dados da requisição sejam convertidos em entidades, regras de validação sobre
   tipos de dados e formatação podem ser aplicadas.
2. Antes que os dados sejam salvos, regras de domínio ou aplicação podem ser aplicadas. Essas regras
   ajudam a garantir que os dados da sua aplicação permaneçam consistentes.

.. _validating-request-data:

Validando Dados Antes de Construir Entidades
=============================================

Ao fazer marshal de dados em entidades, você pode validar dados. Validar dados
permite verificar o tipo, forma e tamanho dos dados. Por padrão, os dados da requisição
serão validados antes de serem convertidos em entidades.
Se alguma regra de validação falhar, a entidade retornada conterá erros. Os
campos com erros não estarão presentes na entidade retornada::

    $article = $articles->newEntity($this->request->getData());
    if ($article->getErrors()) {
        // A entidade falhou na validação.
    }

Ao construir uma entidade com validação habilitada, o seguinte ocorre:

1. O objeto validador é criado.
2. Os provedores de validação ``table`` e ``default`` são anexados.
3. O método de validação nomeado é invocado. Por exemplo ``validationDefault``.
4. O evento ``Model.buildValidator`` será acionado.
5. Os dados da requisição serão validados.
6. Os dados da requisição serão convertidos para tipos que correspondem aos tipos de coluna.
7. Os erros serão definidos na entidade.
8. Os dados válidos serão definidos na entidade, enquanto os campos que falharam na validação
   serão excluídos.

Se você quiser desabilitar a validação ao converter dados de requisição, defina a
opção ``validate`` como false::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => false]
    );

O mesmo pode ser dito sobre o método ``patchEntity()``::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

Criando um Conjunto de Validação Padrão
========================================

As regras de validação são definidas nas classes Table por conveniência. Isso define
quais dados devem ser validados em conjunto com onde serão salvos.

Para criar um objeto de validação padrão em sua tabela, crie a
função ``validationDefault()``::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            $validator
                ->requirePresence('title', 'create')
                ->notEmptyString('title');

            $validator
                ->allowEmptyString('link')
                ->add('link', 'valid-url', ['rule' => 'url']);

            ...

            return $validator;
        }
    }

Os métodos e regras de validação disponíveis vêm da classe ``Validator`` e
estão documentados na seção :ref:`creating-validators`.

.. note::

    Objetos de validação destinam-se principalmente a validar entrada do usuário, ou seja,
    formulários e quaisquer outros dados de requisição postados.

Usando um Conjunto de Validação Diferente
==========================================

Além de desabilitar a validação, você pode escolher qual conjunto de regras de validação
deseja aplicar::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => 'update']
    );

O código acima chamará o método ``validationUpdate()`` na instância da tabela para
construir as regras necessárias. Por padrão, o método ``validationDefault()`` será
usado. Um exemplo de validador para nossa tabela de artigos seria::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->notEmptyString('title', __('Você precisa fornecer um título'))
                ->notEmptyString('body', __('Um corpo é necessário'));

            return $validator;
        }
    }

Você pode ter quantos conjuntos de validação forem necessários. Veja o :doc:`capítulo de validação
</core-libraries/validation>` para mais informações sobre construção de
conjuntos de regras de validação.

.. _using-different-validators-per-association:

Usando um Conjunto de Validação Diferente para Associações
-----------------------------------------------------------

Conjuntos de validação também podem ser definidos por associação. Ao usar os
métodos ``newEntity()`` ou ``patchEntity()``, você pode passar opções extras para cada
uma das associações a serem convertidas::

   $data = [
        'title' => 'Meu título',
        'body' => 'O texto',
        'user_id' => 1,
        'user' => [
            'username' => 'mark',
        ],
        'comments' => [
            ['body' => 'Primeiro comentário'],
            ['body' => 'Segundo comentário'],
        ],
    ];

    $article = $articles->patchEntity($article, $data, [
        'validate' => 'update',
        'associated' => [
            'Users' => ['validate' => 'signup'],
            'Comments' => ['validate' => 'custom'],
        ],
    ]);

Combinando Validadores
======================

Devido à forma como os objetos validadores são construídos, você pode decompor seu
processo de construção em várias etapas reutilizáveis::

    // UsersTable.php

    public function validationDefault(Validator $validator): Validator
    {
        $validator->notEmptyString('username');
        $validator->notEmptyString('password');
        $validator->add('email', 'valid-email', ['rule' => 'email']);
        ...

        return $validator;
    }

    public function validationHardened(Validator $validator): Validator
    {
        $validator = $this->validationDefault($validator);

        $validator->add('password', 'length', ['rule' => ['lengthBetween', 8, 100]]);

        return $validator;
    }

Dada a configuração acima, ao usar o conjunto de validação ``hardened``, ele também
conterá as regras de validação declaradas no conjunto ``default``.

Provedores de Validação
========================

Regras de validação podem usar funções definidas em qualquer provedor conhecido. Por padrão,
o CakePHP configura alguns provedores:

1. Métodos na classe de tabela ou seus behaviors estão disponíveis no provedor ``table``.
2. A classe principal :php:class:`~Cake\\Validation\\Validation` é configurada como o
   provedor ``default``.

Quando uma regra de validação é criada, você pode nomear o provedor dessa regra. Por
exemplo, se sua tabela tiver um método ``isValidRole``, você pode usá-lo como
uma regra de validação::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('Você precisa fornecer uma função válida'),
                    'provider' => 'table',
                ]);

            return $validator;
        }

        public function isValidRole($value, array $context): bool
        {
            return in_array($value, ['admin', 'editor', 'author'], true);
        }

    }

Você também pode usar closures para regras de validação::

    $validator->add('name', 'myRule', [
        'rule' => function ($value, array $context) {
            if ($value > 1) {
                return true;
            }

            return 'Não é um bom valor.';
        }
    ]);

Métodos de validação podem retornar mensagens de erro quando falharem. Esta é uma maneira simples
de tornar as mensagens de erro dinâmicas com base no valor fornecido.

Obtendo Validadores das Tabelas
================================

Depois de criar alguns conjuntos de validação em sua classe de tabela, você pode obter o
objeto resultante por nome::

    $defaultValidator = $usersTable->getValidator('default');

    $hardenedValidator = $usersTable->getValidator('hardened');

Classe de Validador Padrão
===========================

Conforme indicado acima, por padrão os métodos de validação recebem uma instância de
``Cake\Validation\Validator``. Em vez disso, se você quiser que a instância do seu validador customizado
seja usada cada vez, você pode usar a propriedade ``$_validatorClass`` da tabela::

    // Na sua classe de tabela
    public function initialize(array $config): void
    {
        $this->_validatorClass = \FullyNamespaced\Custom\Validator::class;
    }

.. _application-rules:

Aplicando Regras de Aplicação
==============================

Enquanto a validação básica de dados é feita quando :ref:`dados de requisição são convertidos em
entidades <validating-request-data>`, muitas aplicações também têm validação mais complexa
que só deve ser aplicada após a validação básica ter sido concluída.

Onde a validação garante que a forma ou sintaxe dos seus dados está correta, regras
focam em comparar dados com o estado existente da sua aplicação e/ou
rede.

Esses tipos de regras são frequentemente chamados de 'regras de domínio' ou 'regras de
aplicação'. O CakePHP expõe esse conceito através de 'RulesCheckers' que são aplicados
antes que as entidades sejam persistidas. Alguns exemplos de regras de aplicação são:

* Garantir unicidade de email
* Transições de estado ou etapas de fluxo de trabalho, por exemplo, atualizar o status de uma fatura.
* Prevenir a modificação de itens excluídos logicamente.
* Impor limites de uso/taxa.

Regras de aplicação são verificadas ao chamar os métodos ``save()`` e ``delete()`` da Table.

.. _creating-a-rules-checker:

Criando um Verificador de Regras
---------------------------------

Classes de verificador de regras geralmente são definidas pelo método ``buildRules()`` em sua
classe de tabela. Behaviors e outros assinantes de eventos podem usar o
evento ``Model.buildRules`` para aumentar o verificador de regras para uma determinada classe Table::

    use Cake\ORM\RulesChecker;

    // Em uma classe de tabela
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        // Adiciona uma regra que é aplicada para operações de criação e atualização
        $rules->add(function ($entity, $options) {
            // Retorna um booleano para indicar sucesso/falha
        }, 'ruleName');

        // Adiciona uma regra para criação.
        $rules->addCreate(function ($entity, $options) {
            // Retorna um booleano para indicar sucesso/falha
        }, 'ruleName');

        // Adiciona uma regra para atualização
        $rules->addUpdate(function ($entity, $options) {
            // Retorna um booleano para indicar sucesso/falha
        }, 'ruleName');

        // Adiciona uma regra para exclusão.
        $rules->addDelete(function ($entity, $options) {
            // Retorna um booleano para indicar sucesso/falha
        }, 'ruleName');

        return $rules;
    }

Suas funções de regras podem esperar obter a Entity sendo verificada e um array de
opções. O array de opções conterá ``errorField``, ``message`` e
``repository``. A opção ``repository`` conterá a classe de tabela à qual as regras
estão anexadas. Como as regras aceitam qualquer ``callable``, você também pode usar
funções de instância::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

ou classes callable::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

Ao adicionar regras, você pode definir o campo para o qual a regra é e a mensagem de
erro como opções::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'Esta fatura não pode ser movida para esse status.'
    ]);

O erro ficará visível ao chamar o método ``getErrors()`` na entidade::

    $entity->getErrors(); // Contém as mensagens de erro das regras de domínio

Criando Regras de Campo Único
------------------------------

Como regras únicas são bastante comuns, o CakePHP inclui uma classe Rule simples que
permite definir conjuntos de campos únicos::

    use Cake\ORM\Rule\IsUnique;

    // Um único campo.
    $rules->add($rules->isUnique(['email']));

    // Uma lista de campos
    $rules->add($rules->isUnique(
        ['username', 'account_id'],
        'Esta combinação de nome de usuário e account_id já foi usada.'
    ));

Ao definir regras em campos de chave estrangeira, é importante lembrar que apenas
os campos listados são usados na regra. O conjunto único de regras será encontrado
com ``find('all')``. Isso significa que definir ``$user->account->id`` não
acionará a regra acima.

Muitos mecanismos de banco de dados permitem que NULLs sejam valores únicos em índices UNIQUE.
Para simular isso, defina a opção ``allowMultipleNulls`` como true::

    $rules->add($rules->isUnique(
        ['username', 'account_id'],
        ['allowMultipleNulls' => true]
    ));

Regras de Chave Estrangeira
----------------------------

Embora você possa confiar em erros de banco de dados para impor restrições, usar código de regras
pode ajudar a fornecer uma experiência de usuário mais agradável. Por isso, o CakePHP inclui uma
classe de regra ``ExistsIn``::

    // Um único campo.
    $rules->add($rules->existsIn('article_id', 'Articles'));

    // Múltiplas chaves, útil para chaves primárias compostas.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'Articles'));

Os campos para verificar a existência na tabela relacionada devem fazer parte da
chave primária.

Você pode forçar ``existsIn`` a passar quando partes anuláveis de sua chave estrangeira composta
são nulas::

    // Exemplo: Uma chave primária composta dentro de NodesTable é (parent_id, site_id).
    // Um Node pode referenciar um Node pai, mas não precisa. Neste último caso, parent_id é nulo.
    // Permite que esta regra passe, mesmo se campos que são anuláveis, como parent_id, sejam nulos:
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
        'ParentNodes',
        ['allowNullableNulls' => true]
    ));

    // Um Node, no entanto, deve sempre referenciar um Site.
    $rules->add($rules->existsIn(['site_id'], 'Sites'));

Na maioria dos bancos de dados SQL, índices ``UNIQUE`` multi-coluna permitem que múltiplos valores nulos
existam, pois ``NULL`` não é igual a si mesmo. Embora permitir múltiplos valores nulos
seja o comportamento padrão do CakePHP, você pode incluir valores nulos em suas
verificações únicas usando ``allowMultipleNulls``::

    // Apenas um valor nulo pode existir em `parent_id` e `site_id`
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'],
        'ParentNodes',
        ['allowMultipleNulls' => false]
    ));

Regras de Contagem de Associação
---------------------------------

Se você precisar validar que uma propriedade ou associação contém o número correto
de valores, você pode usar a regra ``validCount()``::

    // No arquivo ArticlesTable.php
    // Não mais que 5 tags em um artigo.
    $rules->add($rules->validCount('tags', 5, '<=', 'Você só pode ter 5 tags'));

Ao definir regras baseadas em contagem, o terceiro parâmetro permite definir o
operador de comparação a ser usado. ``==``, ``>=``, ``<=``, ``>``, ``<`` e ``!=``
são os operadores aceitos. Para garantir que a contagem de uma propriedade esteja dentro de um intervalo, use
duas regras::

    // No arquivo ArticlesTable.php
    // Entre 3 e 5 tags
    $rules->add($rules->validCount('tags', 3, '>=', 'Você deve ter pelo menos 3 tags'));
    $rules->add($rules->validCount('tags', 5, '<=', 'Você deve ter no máximo 5 tags'));

Note que ``validCount`` retorna ``false`` se a propriedade não for contável ou não existir::

    // A operação de salvamento falhará se tags for null.
    $rules->add($rules->validCount('tags', 0, '<=', 'Você não deve ter nenhuma tag'));

Regra de Restrição de Link de Associação
-----------------------------------------

O ``LinkConstraint`` permite emular restrições SQL em bancos de dados que não
suportam, ou quando você deseja fornecer mensagens de erro mais amigáveis quando
as restrições falhariam. Esta regra permite verificar se uma associação tem ou não
registros relacionados, dependendo do modo usado::

    // Garante que cada comentário esteja vinculado a um Article durante atualizações.
    $rules->addUpdate($rules->isLinkedTo(
        'Articles',
        'article',
        'Requer um artigo'
    ));

    // Garante que um artigo não tenha comentários vinculados durante a exclusão.
    $rules->addDelete($rules->isNotLinkedTo(
        'Comments',
        'comments',
        'Deve ter zero comentários antes da exclusão.'
    ));

Usando Métodos de Entidade como Regras
---------------------------------------

Você pode querer usar métodos de entidade como regras de domínio::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

Usando Regras Condicionais
---------------------------

Você pode querer aplicar regras condicionalmente com base nos dados da entidade::

    $rules->add(function ($entity, $options) use($rules) {
        if ($entity->role == 'admin') {
            $rule = $rules->existsIn('user_id', 'Admins');

            return $rule($entity, $options);
        }
        if ($entity->role == 'user') {
            $rule = $rules->existsIn('user_id', 'Users');

            return $rule($entity, $options);
        }

        return false;
    }, 'userExists');

Mensagens de Erro Condicionais/Dinâmicas
-----------------------------------------

Regras, sendo :ref:`callables personalizados <creating-a-rules-checker>`, ou
:ref:`objetos de regra <creating-custom-rule-objects>`, podem retornar um booleano, indicando
se passaram, ou podem retornar uma string, o que significa que a regra não passou,
e que a string retornada deve ser usada como mensagem de erro.

Possíveis mensagens de erro existentes definidas via opção ``message`` serão sobrescritas
pelas retornadas da regra::

    $rules->add(
        function ($entity, $options) {
            if (!$entity->length) {
                return false;
            }

            if ($entity->length < 10) {
                return 'Mensagem de erro quando o valor é menor que 10';
            }

            if ($entity->length > 20) {
                return 'Mensagem de erro quando o valor é maior que 20';
            }

            return true;
        },
        'ruleName',
        [
            'errorField' => 'length',
            'message' => 'Mensagem de erro genérica usada quando `false` é retornado',
        ]
     );

A partir da versão 5.2.0, você também pode fornecer um ``Closure`` para a chave ``message``. Quando
a regra de validação falha, você pode criar mensagens de erro dinâmicas com base na
entidade e opções::

    $rules->add(
        $rules->existsIn('article_id', 'Articles'),
        'article_exists',
        [
            'message' => function ($entity, $options) {
                return sprintf(
                    'Artigo com ID %s não existe',
                    $entity->article_id
                );
            }
        ]
    );

.. note::

    Note que para que a mensagem retornada seja realmente usada, você *deve* também fornecer a
    opção ``errorField``, caso contrário a regra apenas falhará silenciosamente, ou seja, sem uma
    mensagem de erro sendo definida na entidade.

Criando Regras Personalizadas Reutilizáveis
-------------------------------------------

Você pode querer reutilizar regras de domínio personalizadas. Você pode fazer isso criando sua própria regra invocável::

    // Usando uma regra personalizada da aplicação
    use App\ORM\Rule\IsUniqueWithNulls;
    // ...
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add(new IsUniqueWithNulls(['parent_id', 'instance_id', 'name']), 'uniqueNamePerParent', [
            'errorField' => 'name',
            'message' => 'O nome deve ser único por pai.',
        ]);

        return $rules;
    }

Veja as regras principais para exemplos de como criar tais regras.

.. _creating-custom-rule-objects:

Criando Objetos de Regra Personalizados
----------------------------------------

Se sua aplicação tem regras que são comumente reutilizadas, é útil empacotar
essas regras em classes reutilizáveis::

    // em src/Model/Rule/CustomRule.php
    namespace App\Model\Rule;

    use Cake\Datasource\EntityInterface;

    class CustomRule
    {
        public function __invoke(EntityInterface $entity, array $options)
        {
            // Faça o trabalho
            return false;
        }
    }

    // Adiciona a regra personalizada
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(/* ... */), 'ruleName');

Ao criar classes de regras personalizadas, você pode manter seu código DRY e testar suas regras de domínio
isoladamente.

Desabilitando Regras
--------------------

Ao salvar uma entidade, você pode desabilitar as regras se necessário::

    $articles->save($article, ['checkRules' => false]);

Validação vs. Regras de Aplicação
==================================

O ORM do CakePHP é único, pois usa uma abordagem de duas camadas para validação.

A primeira camada é a validação. Regras de validação destinam-se a operar de
maneira stateless. Elas são melhor aproveitadas para garantir que a forma, tipos de dados
e formato dos dados estejam corretos.

A segunda camada são as regras de aplicação. Regras de aplicação são melhor aproveitadas para
verificar propriedades stateful de suas entidades. Por exemplo, regras de validação poderiam
garantir que um endereço de email seja válido, enquanto uma regra de aplicação poderia garantir
que o endereço de email seja único.

Como você já descobriu, a primeira camada é feita através dos objetos ``Validator``
ao chamar ``newEntity()`` ou ``patchEntity()``::

    $validatedEntity = $articlesTable->newEntity(
        $unsafeData,
        ['validate' => 'customName']
    );
    $validatedEntity = $articlesTable->patchEntity(
        $entity,
        $unsafeData,
        ['validate' => 'customName']
    );

No exemplo acima, usaremos um validador 'custom', que é definido usando o
método ``validationCustomName()``::

    public function validationCustomName($validator)
    {
        $validator->add(
            // ...
        );

        return $validator;
    }

A validação assume que strings ou arrays são passados, já que é isso que é recebido
de qualquer requisição::

    // Em src/Model/Table/UsersTable.php
    public function validatePasswords($validator)
    {
        $validator->add('confirm_password', 'no-misspelling', [
            'rule' => ['compareWith', 'password'],
            'message' => 'As senhas não são iguais',
        ]);

        // ...

        return $validator;
    }

A validação **não** é acionada ao definir propriedades diretamente em suas
entidades::

    $userEntity->email = 'not an email!!';
    $usersTable->save($userEntity);

No exemplo acima, a entidade será salva, pois a validação é apenas
acionada para os métodos ``newEntity()`` e ``patchEntity()``. O segundo
nível de validação destina-se a lidar com essa situação.

Regras de aplicação, conforme explicado acima, serão verificadas sempre que ``save()`` ou
``delete()`` forem chamados::

    // Em src/Model/Table/UsersTable.php
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->isUnique(['email']));

        return $rules;
    }

    // Em outro lugar no código da sua aplicação
    $userEntity->email = 'a@duplicated.email';
    $usersTable->save($userEntity); // Retorna false

Enquanto a Validação é destinada a entrada direta do usuário, as regras de aplicação são específicas
para transições de dados geradas dentro da sua aplicação::

    // Em src/Model/Table/OrdersTable.php
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $check = function($order) {
            if ($order->shipping_mode !== 'free') {
                return true;
            }

            return $order->price >= 100;
        };
        $rules->add($check, [
            'errorField' => 'shipping_mode',
            'message' => 'Sem frete grátis para pedidos abaixo de 100!',
        ]);

        return $rules;
    }

    // Em outro lugar no código da aplicação
    $order->price = 50;
    $order->shipping_mode = 'free';
    $ordersTable->save($order); // Retorna false

Usando Validação como Regras de Aplicação
------------------------------------------

Em certas situações, você pode querer executar as mesmas rotinas de validação de dados para
dados que foram gerados tanto por usuários quanto dentro de sua aplicação. Isso poderia
surgir ao executar um script CLI que define propriedades diretamente em entidades::

    // Em src/Model/Table/UsersTable.php
    public function validationDefault(Validator $validator): Validator
    {
        $validator->add('email', 'valid_email', [
            'rule' => 'email',
            'message' => 'Email inválido',
        ]);

        // ...

        return $validator;
    }

    public function buildRules(RulesChecker $rules): RulesChecker
    {
        // Adiciona regras de validação
        $rules->add(function($entity) {
            $data = $entity->extract($this->getSchema()->columns(), true);
            if (!$entity->isNew() && !empty($data)) {
                $data += $entity->extract((array)$this->getPrimaryKey());
            }
            $validator = $this->getValidator('default');
            $errors = $validator->validate($data, $entity->isNew());
            $entity->setErrors($errors);

            return empty($errors);
        });

        // ...

        return $rules;
    }

Quando executado, o salvamento falhará graças à nova regra de aplicação que
foi adicionada::

    $userEntity->email = 'not an email!!!';
    $usersTable->save($userEntity);
    $userEntity->getError('email'); // Email inválido

O mesmo resultado pode ser esperado ao usar ``newEntity()`` ou
``patchEntity()``::

    $userEntity = $usersTable->newEntity(['email' => 'not an email!!']);
    $userEntity->getError('email'); // Email inválido

Removendo Regras
----------------

Se você precisar remover regras de um ``RulesChecker``, use um método remove::

    // Remove uma regra geral por nome
    $rules->remove('ruleName');

    // Remove uma regra de criação
    $rules->removeCreate('ruleName');

    // Remove uma regra de atualização
    $rules->removeUpdate('ruleName');

    // Remove uma regra de exclusão
    $rules->removeDelete('ruleName');

.. versionadded:: 5.1.0
