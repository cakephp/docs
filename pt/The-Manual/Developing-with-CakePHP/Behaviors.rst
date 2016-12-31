Behaviors
#########

Behaviors (ou comportamentos) de model são uma maneira de organizar
algumas das funcionalidades definidas para models no CakePHP. Behaviors
nos permitem separar lógica daquilo que não esteja diretamente
relacionado aos models, mas precisa estar neles. Com uma maneira simples
e poderosa de estender models, behaviors nos permitem anexar
funcionalidades aos models definindo uma simples variável de classe. É
assim que os behaviors permitem que os models se livrem de todo o peso
extra que pode não ser parte do contrato de negócio que estão modelando
ou que também seja necessário em diferentes models e podem ser
extrapolados.

Como um exemplo, considere um model que nos dá acesso a uma tabela na
base de dados que armazena informação estrutural sobre um árvore.
Excluir, adicionar e mover nós na árvore não é tão simples quanto
excluir, adicionar e modificar linhas na tabela. Muitos registros podem
precisar ser atualizados conforme as coisas sejam movidas. Ao invés de
criar estes métodos de manipulação de árvore na camada de model (para
cada model que precise dessa funcionalidade), nós poderíamos
simplesmente dizer para nosso model usar o TreeBehavior, ou em termos
mais formais, diríamos que nosso model se comporta como uma árvore. Isto
é conhecido como anexar um comportamento (behavior) a um model. Com
apenas uma linha de código, nosso model em CakePHP ganha todo um novo
conjunto de métodos que lhe permitem interagir com a estrutura de dados
em questão.

O CakePHP já inclui comportamentos para estruturas em árvore, para
conteúdos em diversos idiomas, para interação com listas de controle de
acesso, e isso sem mencionar os behaviors desenvolvidos pela comunidade
e que estão disponíveis no CakePHP Bakery (https://bakery.cakephp.org).
Nesta seção iremos cobrir o padrão básico de utilização para adicionar
comportamentos aos models, como usar os behaviors que já disponíveis por
padrão no CakePHP e como criar os nossos próprios behaviors.

Usando Behaviors
================

Behaviors são anexados ao modelos através da variável ``$actAs`` na
classe model

::

    <?php
    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree');
    }
    ?>

Este exemplo mostra como um modelo Categoria pode ser tratado em uma
estrutura de árvore usando o TreeBehavior. Uma vez um behavior ter sido
especificado, use os métodos adicionados pelo behavior como se eles
sempre existiram como parte do modelo original:

::

    // Define o ID
    $this->Category->id = 42;

    // Usa o método do behavior, children():
    $kids = $this->Category->children();

Alguns behaviors podem necessitar ou permitir ajustes para serem
definidos quando o behavior é anexado ao modelo. Aqui, dizemos ao nosso
TreeBehavior os nomes dos campos da "esquerda" e "direita" na tabela
subjacente do banco de dados:

::

    <?php
    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }
    ?>

Também podemos anexar diversos behaviors a um modelo. Não há razão
porque, por exemplo, nosso modelo Categoria apenas agir como uma árvore,
ele também pode precisar de suporte de internacionalização:

::

    <?php
    class Category extends AppModel {
        var $name   = 'Category';
        var $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }
    ?>

Até agora temos adicionado behaviors a modelos usando uma variável da
classe model. Isso significa que seus behavior serão anexados aos nossos
modelos por todo tempo de vida do modelo. Contudo, podemos precisar
"desanexar" behaviors de nossos modelos em seu tempo de execução. Vamos
dizar que em nosso modelo anterior Categoria, que está agindo como um
modelo Árvore e um Tradutor, precimaos por alguma razão forçá-lo a parar
de agir como um modelo Tradutor:

::

    // Desanexar um behavior de nosso modelo:
    $this->Category->Behaviors->detach('Translate');

Isso fará com que nosso modelo Categoria pare de agir como um modelo
Tradutor depois disso. Podemos precisar, em vez de, apenas desabilitar o
behavior Trandutor de agir sobre nossas operções normal de modelo:
nossos finds, nossos saves, etc. De fato, estamos procurando desabilitar
o behavior de agir sobre nossos callback de modelo do CakePHP. Em vez de
desanexar o behavior, então dizemos ao nosso modelo para parar de
informar estes callbacks ao behavior Tradutor:

::

    // Para de deixar o behavior manipular nossos callbacks do modelo
    $this->Category->Behaviors->disable('Translate');

Também podemos precisar descobrir se nosso behavior está manipulando
aqueles callback do modelo, e se não então restauramos sua abilidade
para reagir a eles:

::

    // Se nosso behavior não está manipulando os callbacks do modelo
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Diz a ele para iniciar a fazê-lo
        $this->Category->Behaviors->enable('Translate');
    }

Assim como podemos desanexar completamente um behavior de um modelo em
tempo de execução, também podemos anexar novos behaviors. Digamos que
seu modelo Categoria precisa iniciar a agir como um modelo Natal
(Christmas), mas apenas no dia de Natal:

::

    // Se hoje é 25 de Dezembro
    if (date('m/d') == '12/25') {
        // Nosso modelo precisa agir como um modelo Natal
        $this->Category->Behaviors->attach('Christmas');
    }

Também podemos usar o método de anexar para substituir ajustes de
behavior:

::

    // Mudamos um ajuste de nosso behavior já anexado
    $this->Category->Behaviors->attach('Tree', array('left' => 'new_left_node'));

Também há um método de obter uma lista de behavior que um modelo tem
anexado. Se passarmos o nome de um behavior para o método, ele nos dirá
se aquele behavior está anexado ao modelo, caso contrário ele nos dará a
lista de behaviors anexados:

::

    // Se o behavior Tradutor não estiver anexado
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Pega a lista de todos os behaviors que o modelo tem anexado
        $behaviors = $this->Category->Behaviors->attached();
    }

Criando Behaviors
=================

Behaviors que são anexados a Modelos recebem suas chamadas callbacks
automaticamente. Os callbacks são similiar aqueles encontrados nos
Modelos: beforeFind, afterFind, beforeSave, afterSave, beforeDelete,
afterDelete e onError - veja `Métodos de
Callback </pt/view/76/Callback-Methods>`_.

Geralmente é útil usar um behavior de núcleo como um template ao criar
seu próprio behavior. Encontre-os em cake/libs/model/behaviors/.

Todo callback pega uma referência ao modelo, ele está sendo chamado como
primeiro parâmetro.

Além de implementar os callbacks, você pode adicionar ajuster por
behavior e/ou por anexo de behavior do modelo. Informação sobre
especificar ajustes podem ser encontrar nos capítulos sobre behaviors de
núcleo e suas configurações.

Um exemplo rápido que ilustra como ajustes de behavior podem ser
passados do modelo para o behavior:

::

    class Post extends AppModel {
        var $name = 'Post'
        var $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'));
    }

A partir de 1.2.8004, o CakePHP adiciona aqueles ajustes apenas uma vez
por modelo/alias. Para manter seus behavior atualizável você deve
respeitar os aliases (ou modelos).

Uma função de atualização amigável de instalação pode parecer algo como
isto:

::

    function setup(&$Model, $settings) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }

Creating behavior methods
=========================

Behavior methods are automatically available on any model acting as the
behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }

You would be able to call FlyingBehavior methods as if they were methods
on your Duck model. When creating behavior methods you automatically get
passed a reference of the calling model as the first parameter. All
other supplied parameters are shifted one place to the right. For
example

::

    $this->Category->fly('toronto', 'montreal');

Although this method takes two parameters, the method signature should
look like:

::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }

Keep in mind that methods called in a ``$this->doIt()`` fashion from
inside a behavior method will not get the $model parameter automatically
appended.
