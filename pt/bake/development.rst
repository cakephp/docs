Extendendo o Bake
#################

Bake fornece uma extenssiva arquitetura que permite a sua aplicação ou plugin ser modificado ou adicionar funcionalidades as bases. Bake faz uso de uma classe view dedicada que usa o `Twig <https://twig.symfony.com/>`_ engine de templates.

Eventos do Bake
===============

Como uma class view , ``BakeView`` emite o mesmo evento como qualquer outra classe view,
mais uma extra que inicializa eventos. No entanto, onde classe view padrão usa o prefixo "View.", ``BakeView`` usa o prefixo "Bake.".

O inicializador de eventos pode ser usado para fazer mudanças  quando aplicadoa toda a saida do bake
,  por exemplo ao adicionar outro helper ao bake view class este evebti oide ser usado::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.initialize', function (Event $event) {
        $view = $event->getSubject();

        // No meu bake de templates, permite uso de MuSpecial helper
        $view->loadHelper('MySpecial', ['some' => 'config']);

        // E adicionar uma variável $author então este estará sempre disponível
        $view->set('author', 'Andy');

    });

Se você quer modificar o seu bake apartir de outro pugin, coloque o bake do seu plugin dentro do arquivo do seu próprio plugin ``config/bootstrap.php``  será uma boa ideia.

Os eventos do Bake  podem ser úteis para fazer pequenas alterações nos modelos existentes.
Por exemplo, para alterar os nomes das variáveis usados quando o controlador / modelo de baking
arquivos podem usar uma função ouvindo ``Bake.beforeRender`` para modificar as variaveis usadas no bake templates::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;

    EventManager::instance()->on('Bake.beforeRender', function (Event $event) {
        $view = $event->getSubject();

        // Use $ rows para a variável de dados principal em índices
        if ($view->get('pluralName')) {
            $view->set('pluralName', 'rows');
        }
        if ($view->get('pluralVar')) {
            $view->set('pluralVar', 'rows');
        }

        // Use $ theOne para a variável de dados principal em exibição / edição
        if ($view->get('singularName')) {
            $view->set('singularName', 'theOne');
        }
        if ($view->get('singularVar')) {
            $view->set('singularVar', 'theOne');
        }

    });

Você também pode abranger o ``Bake.beforeRender`` e ``Bake.afterRender`` eventos para um arquivo gerado específico. Por exemplo, se você quiser adicionar ações específicas para seu UsersController ao gerar a partir de um arquivo **Controller/controller.twig**,
você pode usar o seguinte evento::

    <?php
    // config/bootstrap_cli.php

    use Cake\Event\Event;
    use Cake\Event\EventManager;
    use Cake\Utility\Hash;

    EventManager::instance()->on(
        'Bake.beforeRender.Controller.controller',
        function (Event $event) {
            $view = $event->getSubject();
            if ($view->viewVars['name'] == 'Users') {
                // adicionar ações de login e logout ao Users controller
                $view->viewVars['actions'] = [
                    'login',
                    'logout',
                    'index',
                    'view',
                    'add',
                    'edit',
                    'delete'
                ];
            }
        }
    );

Ao adicionar eventos que escutam o seu bake de templates, você pode simplesmente relacionar a sua logica de eventos com o bake e fornecer callbacks que são facilmente testáveis.

Sintaxe de Templates do Bake
============================

Bake arquivos de template usa a sintaxe `Twig <https://twig.symfony.com/doc/2.x/>`__ de templates .

Uma forma de ver/entender como o bake de templates funciona, especialmente quando tentamos modificar os arquivos de templates, é executar o bake de uma classe que compara o template usado com o template pré processado deixado anteriormente pela aplicação

**tmp/bake** folder.

Então, por exemplo, quando baking a shell é como?

.. code-block:: bash

    bin/cake bake shell Foo

O template usado (**vendor/cakephp/bake/src/Template/Bake/Shell/shell.twig**)
parece com algo assim::

    <?php
    namespace {{ namespace }}\Shell;

    use Cake\Console\Shell;

    /**
     * {{ name }} shell command.
     */
    class {{ name }}Shell extends Shell
    {
        /**
         * main() method.
         *
         * @return bool|int Success or error code.
         */
        public function main()
        {
        }

    }

E o resultado baked é uma classe (**src/Shell/FooShell.php**) que parece algo assim::

    <?php
    namespace App\Shell;

    use Cake\Console\Shell;

    /**
     * Foo shell command.
     */
    class FooShell extends Shell
    {
        /**
         * main() method.
         *
         * @return bool|int Success or error code.
         */
        public function main()
        {
        }

    }

.. note::

    A priori a versão 1.5.0 bake usava um erb style tag dentro dos arquivos .ctp

    * ``<%`` Um template bake php abre a tag
    * ``%>`` Um template bake php fecha a tag
    * ``<%=`` Um template bake php short-echo tag
    * ``<%-`` Um template bake php abre a tag, revirando qualquer espaço em branco antes da tag
    * ``-%>`` Um template bake php fecha a tag, revirando qualqualquer espaço em branco após a tag

.. _creating-a-bake-theme:

Criando um Tema Bake
=====================

Se você deseja modificar a saída  produzida com o comando bake, você pode criar o seu próprio  tema para o bake, aos quais permitirá a você subsituir algum ou todos os tempaltes que o bake usa. o mmelhor jeito de fazer isto é:

#. Bake um novo plugin. O nome do plugin é o bake 'nome do tema'
#. Crie uma nova pasta em **plugins/[name]/src/Template/Bake/Template/**.
#. Copie qualquer template que você queira para sobrescrer de
   **vendor/cakephp/bake/src/Template/Bake/Template** que feche com os arquivos no seu plugin.
#. Quando executando o bake use a opção  ``--theme`` para especificar qual o tema que o bake deve usar
   . Para evitar problemas com esta opção, em cada chamada, você tambem pode definir o seu template customizado para ser usado como o template padrão::

    <?php
    // no config/bootstrap.php ou no config/bootstrap_cli.php
    Configure::write('Bake.theme', 'MyTheme');

Customizando templates do bake
==============================

Se você deseja modificar a saida produzida pelo comando "bake", você pode
criar o seu próprio tema na sua aplicação. Esta forma não usa a opção
``--theme``  no na linha de comando quando baking.  A melhor forma de fazer isto é:

#. Criar um novo diretório **/src/Template/Bake/**.
#. Copiar qualquer arquivo que você queira sobrescrever de
   **vendor/cakephp/bake/src/Template/Bake/** para fechar com os arquivos da sua aplicação.

Criando novos comando bake
=================================

É possivel adicionar novas opções de comandos, ou sobrescrever alguns providos pelo
CakePHP, criando tarefas na sua aplicação ou no seu plugin. Extendendo
``Bake\Shell\Task\BakeTask``, bake encontrará a nova tarefa e incluirá isto como parte de sí mesmo.

Como um exemplo, nós vamos criar uma tarefa que cria uma classe foo. Primeiro, crie um arquivo de tarefa
 **src/Shell/Task/FooTask.php**. Vamos extender de
``SimpleBakeTask`` por agora como nossa nova shell task  será simples. ``SimpleBakeTask``
é abstrata e requer que nós definirmos 3 metodos, que conta ao nosso bake que a tarefa é chamada,
 onde os arquivos são deverão ser gerados, e o qual template usar. Nosso arquivo 
FooTask.php deve parecer com ::

    <?php
    namespace App\Shell\Task;

    use Bake\Shell\Task\SimpleBakeTask;

    class FooTask extends SimpleBakeTask
    {
        public $pathFragment = 'Foo/';

        public function name()
        {
            return 'foo';
        }

        public function fileName($name)
        {
            return $name . 'Foo.php';
        }

        public function template()
        {
            return 'foo';
        }

    }

Uma vez que o arquivo foi criado, nós precisamos criar um templarte que o bake pdoe usar quando gerar código. Crie **src/Template/Bake/foo.twig**. e neste arquivo nós vamos adicionar o seguinte conteúdo::

    <?php
    namespace {{ namespace }}\Foo;

    /**
     * {{ $name }} foo
     */
    class {{ name }}Foo
    {
        // Adicione código.
    }

Você deve agora poder ver esta nova tarefa na saida de ``bin/cake bake``. Você pode executar a sua nova tarefa executando ``bin/cake bake foo Example``.
Isto gerará uma nova classe ``ExampleFoo`` em **src/Foo/ExampleFoo.php**
for your application to use.

Se você quer ``bake`` chame para também criar um arquivo de teste para o sua classe ``ExampleFoo``, você rpecisará sobrescrever o metodo ``bakeTest()`` na classe ``FooTask`` para registrar a classe sufixo e namespace para o seu comando customizado ::

    public function bakeTest($className)
    {
        if (!isset($this->Test->classSuffixes[$this->name()])) {
          $this->Test->classSuffixes[$this->name()] = 'Foo';
        }

        $name = ucfirst($this->name());
        if (!isset($this->Test->classTypes[$name])) {
          $this->Test->classTypes[$name] = 'Foo';
        }

        return parent::bakeTest($className);
    }

* A **class suffix** vai se indexado ao mesmo nome providenciado por você na sua chamada de ``bake``
  . No exemplo anterior, isto criaria o arquivo ``ExampleFooTest.php`` .
* O **class type** vai ser o sub namespace usado para o seu arquivo (relativo ao aplicativo ou plugin que vocês está baking). No exemplo anterior, isto poderia criar o seu teste com o namespace ``App\Test\TestCase\Foo``

.. meta::
    :title lang=en: Extending Bake
    :keywords lang=en: command line interface,development,bake view, bake template syntax,twig,erb tags,percent tags

