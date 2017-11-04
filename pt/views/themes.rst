Temas
#####

Temas no CakePHP são simplesmente plugins que focam em prover arquivos de template.
Veja a seção em :ref:`plugin-create-your-own`.
Você pode tirar vantagem de temas, deixando fácil a troca da aparência da dua página rapidamente. 
Além de arquivos de templates, eles também podem provers `helpers` e 'cells' 
se o seu tema assim requerer. Quando usado ``cells`` e ``helpes`` no seu tema, 
você precisará continuar usando a :term:`sintaxe plugin`.

Para usar temas, defina o tema na `action` do seu `controller` ou no método 
``beforeRender()``::

    class ExamplesController extends AppController
    {
        // Para o CakePHP antes da versão 3.1
        public $theme = 'Modern';

        public function beforeRender(\Cake\Event\Event $event)
        {
            $this->viewBuilder()->setTheme('Modern');
                        
            // Para o cakePHP antes da versão 3.5
            $this->viewBuilder()->theme('Modern');
        }
    }

Os arquivos de tempalte do tema precisam estar dentro de um plugin com o mesmo nome. Por exemplo,
o tema acima seria encontrado em **plugins/Modern/src/Template**.
É importante lembrar que o CakePHP espera o nome do plugin/tema em PascalCase. Além
de que, a estrutura da pasta dentro da pasta **plugins/Modern/src/Template** é
exatamente o mesmo que **src/Template/**.

Por exemplo, o arquivo de exibição para uma `action` de edição de um ``controller`` de posts residiria
em **plugins/Modern/src/Template/Posts/edit.ctp**. Os arquivos de layout residiriam em
**plugins/Modern/src/Template/Layout/**. Você pode fornecer modelos personalizados
para plugins com um tema também. Se você tiver um plugin chamado 'Cms', que
contenha um ``TagsController``, o tema moderno poderia fornecer
**plugins/Modern/src/Template/Plugin/Cms/Tags/edit.ctp** para substituir o template
da edição no plugin.

Se um arquivo de exibição não puder ser encontrado no tema, o CakePHP tentará localizar a visualização
arquivo na pasta **src/Template/**. Desta forma, você pode criar arquivos de `template` mestre
e simplesmente substituí-los caso a caso na pasta do seu tema.

`Assets` do Tema
================

Como os temas são plugins CakePHP padrão, eles podem incluir qualquer ``asset``
necessário em seu diretório webroot. Isso permite uma fácil embalagem e
distribuição de temas. Enquanto estiver em desenvolvimento, requisições de ``assets`` do tema serão
manipuladas por: php:class:`Cake\\Routing\\Dispatcher`. Para melhorar o desempenho 
para ambientes de produção, é recomendável que você :ref:`symlink-assets`.

Todos os ajudantes internos do CakePHP estão cientes de temas e criará o
Corrija os caminhos automaticamente. Como arquivos de template, se um arquivo não estiver 
na pasta do tema, será padrão para a pasta webroot principal::

    // Em um tema com o nome 'purple_cupcake'
    $this->Html->css('main.css');

    // crie os diretórios como
    /purple_cupcake/css/main.css

    // e crie o link como
    plugins/PurpleCupcake/webroot/css/main.css

.. meta::
    :title lang=pt: Temas
    :keywords lang=pt: ambientes de produção,pasta de tema,arquivos de layout,requisições de desenvolvimento,funções de callback,estrutura de pastas,view padrão,dispatcher,link simbólico,case basis,layouts,assets,cakephp,temas,vanta
