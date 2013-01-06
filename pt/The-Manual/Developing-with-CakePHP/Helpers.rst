Helpers
#######

Helpers são componentes para uma apresentação em camadas de sua
aplicação. Eles contém apresentações lógicas que podem ser
compartilhadas entre views, elements, ou layouts. Neste capítulo
mostraremos para você como criar seu próprio helper e o básico do core
helpers do CakePHP. Para mais informações do core helpers, veja em:
`Built-in Helpers </pt/view/181/built-in-helpers>`_.

Usando Helpers
==============

Você usa helpers no CakePHP criando-os dentro do controller. Cada
controller tem uma propriedade $helpers que lista os helpers que estarão
disponíveis na view. Para habilitar um helper na sua view, coloque o
nome do helper dentro do array $helpers.

::

    <?php
    class BakeriesController extends AppController {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

Você pode adicionar um helper também dentro de sua action, então ele só
estará disponível para essa determinada action e não estará disponível
para as outras actions. Isso ajuda no processamento de potência para as
outras ações que não usam o helper e a manter o controller melhor
organizado.

::

    <?php
    class BakeriesController extends AppController {
        function bake {
            $this->helpers[] = 'Time';
        }
        function mix {
            // O helper Time não está disponivel para esta action.
        }
    }
    ?>

Criando Helpers
===============

Se os helpers já disponíveis por padrão no CakePHP (ou alguns dos outros
disponíveis no Cakeforge ou no Bakery) não atenderem às suas
necessidades, saiba que os helpers são fáceis de se criar.

Digamos, p.ex., que você queira criar um helper que possa ser usado para
exibir um link especificamente estilizado com CSS e que você precisa
exibir em vários locais de sua aplicação. Para fazer com que sua lógica
corresponda a estrurura existente para helpers do CakePHP você vai
precisar criar uma nova classe em /app/views/helpers. Vamos chamar nosso
novo helper de LinkHelper. O arquivo autal da classe PHP deve ser algo
parecido com isto:

::

    <?php
    /* /app/views/helpers/link.php */

    class LinkHelper extends AppHelper {
        function makeEdit($title, $url) {
            // A lógica para criar um link especialmente formatado vai aqui...
        }
    }

    ?>

Há uns poucos métodos incluídos na classe Helper do CakePHP e que você
eventualmente possa querer utilizar:

``output(string $string)``

Utilize este método para manipular quaisquer dados de volta para sua
view.

::

    <?php
    function makeEdit($title, $url) {
        // Usa o método de saída dos helpers para manipular
        // os dados formatados de volta para a view:
        return $this->output(
            "<div class=\"editOuter\">
             <a href=\"$url\" class=\"edit\">$title</a>
             </div>"
        );
    }
    ?>

Incluindo outros Helpers
------------------------

Você pode querer usar alguma funcionalidade que já esteja presente em
algum outro helper. Para isso, você pode especificar os helpers que
deseja usar com o array $helpers, tal como você especificaria em um
controller.

::

    <?php
    /* /app/views/helpers/link.php (using other helpers) */
    class LinkHelper extends AppHelper {
        var $helpers = array('Html');

        function makeEdit($title, $url) {
            // Usa o HtmlHelper para exibir
            // dados formatados:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return $this->output("<div class=\"editOuter\">$link</div>");
        }
    }
    ?>

Callback method
---------------

Helpers feature a callback used by the parent controller class.

``beforeRender()``

The beforeRender method is called after the controller's beforeRender
method but before the controller's renders views and layout.

Usando seu Helper
-----------------

Tendo vocÊ criado seu helper e colocado-o em /app/views/helpers/, você
será capaz de incluí-lo em seus controllers usando a variável especial
$helpers.

Uma vez que seu controller tenha conhecimento desta nova classe, você
pode usá-la em suas views acessando uma variável declarada depois do
helper:

::

    <!-- faz um link utilizando o novo helper -->
    <?php echo $link->makeEdit('Modifique esta Receita', '/recipes/edit/5') ?>

Os helpers Html, Form e Session (este último, se as sessões estiverem
habilitadas) já ficam sempre disponíveis.

Criando Funcioanlidade para Todos os Helpers
============================================

Todos os helpers herdam de uma classe especial, AppHelper (tal como os
models herdam de AppModel e os controllers de AppController). Para
incluir uma nova funcionalidade que deva estar disponível para todos os
helpers, crie o arquivo /app/app\_helper.php.

::

    <?php
    class AppHelper extends Helper {
        function customMethod () {
        }
    }
    ?>

Helpers Disponíveis por Padrão
==============================

O CakePHP já inclui alguns helpers que ajudam na criação de suas visões.
Eles facilitam na criação de marcações bem-formadas (incluindo
formulários), facilitam a formatação de textos, horários e números e
ainda agilizam o desenvolvimento de funcionalidades com Ajax. Abaixo
segue um resumo dos helpers já disponíveis no CakePHP por padrão. Para
mais informações, não deixe de ler sobre os `Core
Helpers </pt/view/181/Core-Helpers>`_.

+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Helper do CakePHP                         | Descrição                                                                                                                                                                                                     |
+===========================================+===============================================================================================================================================================================================================+
| `Ajax </pt/view/208/AJAX>`_               | Usado em conjunto com a biblioteca Javascript Prototype para criar funcionalidade Ajax nas views. Contém métodos de atalho para recursos de arrastar/soltar, formulários & links ajax, observadores e mais.   |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Cache </pt/view/213/Cache>`_             | Usado pelo núcleo do CakePHP para fazer cache de conteúdo das views.                                                                                                                                          |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Form </pt/view/182/Form>`_               | Cria formulários HTML e elementos de formulário autopreenchíveis e que manipulam problemas de validação.                                                                                                      |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Html </pt/view/205/HTML>`_               | Métodos de conveniência para criação de marcações bem-formadas em HTML. Imagens, links, tabelas, tags de cabeçalho e mais.                                                                                    |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Javascript </pt/view/207/Javascript>`_   | Usado para escapar valores para uso em scripts JavaScript, escrever dados para objetos JSON e formatar blocos de código.                                                                                      |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Number </pt/view/215/Number>`_           | Formatação de números e moedas.                                                                                                                                                                               |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Paginator </pt/view/496/Paginator>`_     | Paginação de dados do model e ordenação.                                                                                                                                                                      |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Rss </pt/view/494/RSS>`_                 | Métodos de conveniência para exibição de dados XML para criação de feeds RSS.                                                                                                                                 |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Session </pt/view/484/Session>`_         | Acesso a escrita de variáveis de sessão nas views.                                                                                                                                                            |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Text </pt/view/216/Text>`_               | Criação automática de links (smart linking), coloração de sintaxe, truncagem de palavras.                                                                                                                     |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Time </pt/view/217/Time>`_               | Deteção de proximidade (este valor dados será o próximo ano?), formatação para strings(Today, 10:30 am) e conversão de fusos horários.                                                                        |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Xml </pt/view/380/XML>`_                 | Métodos de conveniência para criação de cabeçalhos e elementos XML.                                                                                                                                           |
+-------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

