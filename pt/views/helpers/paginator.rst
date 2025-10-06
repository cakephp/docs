Paginator
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: PaginatorHelper(View $view, array $config = [])

O PaginatorHelper é usado para gerar controles de paginação como números de página
e links de próximo/anterior.

Veja também :doc:`/controllers/pagination` para informações sobre como
criar datasets paginados e fazer consultas paginadas.

Definindo o conjunto de resultados paginado
--------------------------------------------

.. php:method:: setPaginated($paginated, $options)

Por padrão, o helper usa a primeira instância de ``Cake\Datasource\Paging\PaginatedInterface``
que ele encontra nas variáveis de view. (Geralmente o resultado de ``Controller::paginate()``).

Você pode usar ``PaginatorHelper::setPaginated()`` para definir explicitamente o conjunto
de resultados paginado que o helper deve usar.

.. _paginator-templates:

Templates do PaginatorHelper
============================

Internamente o PaginatorHelper usa uma série de templates HTML simples para gerar
marcação. Você pode modificar esses templates para personalizar o HTML gerado pelo
PaginatorHelper.

Os templates usam placeholders no estilo ``{{var}}``. É importante não adicionar
espaços ao redor de ``{{}}`` ou as substituições não funcionarão.

Carregando Templates de um Arquivo
-----------------------------------

Ao adicionar o PaginatorHelper em seu controller, você pode definir a
configuração 'templates' para definir um arquivo de template a ser carregado. Isso permite que você
personalize vários templates e mantenha seu código DRY::

    // No seu AppView.php
    public function initialize(): void
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'paginator-templates']);
    }

Isso carregará o arquivo localizado em **config/paginator-templates.php**. Veja o
exemplo abaixo de como o arquivo deve ser. Você também pode carregar templates
de um plugin usando :term:`sintaxe de plugin`::

    // No seu AppView.php
    public function initialize(): void
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'MyPlugin.paginator-templates']);
    }

Seja seus templates na aplicação principal ou em um plugin, seu
arquivo de templates deve se parecer com algo assim::

    return [
        'number' => '<a href="{{url}}">{{text}}</a>',
    ];

Alterando Templates em Tempo de Execução
-----------------------------------------

.. php:method:: setTemplates($templates)

Este método permite que você altere os templates usados pelo PaginatorHelper em
tempo de execução. Isso pode ser útil quando você quer personalizar templates para uma
chamada de método específica::

    // Lê o valor do template atual.
    $result = $this->Paginator->getTemplates('number');

    // Altera um template
    $this->Paginator->setTemplates([
        'number' => '<em><a href="{{url}}">{{text}}</a></em>'
    ]);

.. warning::

    Strings de template contendo um sinal de porcentagem (``%``) precisam de atenção
    especial, você deve prefixar este caractere com outra porcentagem para que
    pareça ``%%``. A razão é que internamente os templates são compilados para
    serem usados com ``sprintf()``.
    Exemplo: '<div style="width:{{size}}%%">{{content}}</div>'

Nomes de Template
-----------------

O PaginatorHelper usa os seguintes templates:

- ``nextActive`` O estado ativo para um link gerado por next().
- ``nextDisabled`` O estado desabilitado para next().
- ``prevActive`` O estado ativo para um link gerado por prev().
- ``prevDisabled`` O estado desabilitado para prev()
- ``counterRange`` O template que counter() usa quando format == range.
- ``counterPages`` O template que counter() usa quando format == pages.
- ``first`` O template usado para um link gerado por first().
- ``last`` O template usado para um link gerado por last()
- ``number`` O template usado para um link gerado por numbers().
- ``current`` O template usado para a página atual.
- ``ellipsis`` O template usado para reticências geradas por numbers().
- ``sort`` O template para um link de ordenação sem direção.
- ``sortAsc`` O template para um link de ordenação com direção ascendente.
- ``sortDesc`` O template para um link de ordenação com direção descendente.

Criando Links de Ordenação
===========================

.. php:method:: sort($key, $title = null, $options = [])

    :param string $key: O nome da coluna pela qual o conjunto de registros deve ser ordenado.
    :param string $title: Título para o link. Se $title for null, $key será
        usado convertido para o formato "Title Case" e usado como título.
    :param array $options: Opções para link de ordenação.

Gera um link de ordenação. Define parâmetros querystring para a ordenação e
direção. Os links serão padrão para ordenar por asc. Após o primeiro clique, links
gerados com ``sort()`` irão lidar com a troca de direção automaticamente. Se o
conjunto de resultados está ordenado 'asc' pela chave especificada, o link retornado irá ordenar por
'desc'. Usa os templates ``sort``, ``sortAsc``, ``sortDesc``, ``sortAscLocked`` e
``sortDescLocked``.

Chaves aceitas para ``$options``:

* ``escape`` Se você quer o conteúdo codificado como entidade HTML, padrão é
  ``true``.
* ``direction`` A direção padrão a usar quando este link não está ativo.
* ``lock`` Bloquear direção. Só usará a direção padrão então, padrão é ``false``.

Assumindo que você está paginando alguns posts, e está na página um::

    echo $this->Paginator->sort('user_id');

Saída:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User Id</a>

Você pode usar o parâmetro title para criar texto personalizado para seu link::

    echo $this->Paginator->sort('user_id', 'User account');

Saída:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User account</a>

Se você está usando HTML como imagens em seus links, lembre-se de desativar o escape::

    echo $this->Paginator->sort(
      'user_id',
      '<em>User account</em>',
      ['escape' => false]
    );

Saída:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc"><em>User account</em></a>

A opção direction pode ser usada para definir a direção padrão para um link. Uma vez que um
link está ativo, ele irá trocar de direção automaticamente como normal::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'desc']);

Saída:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=desc">User Id</a>

A opção lock pode ser usada para bloquear a ordenação na direção especificada::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'asc', 'lock' => true]);

.. php:method:: sortDir(string $model = null, mixed $options = [])

    Obtém a direção atual pela qual o conjunto de registros está ordenado.

.. php:method:: sortKey(string $model = null, mixed $options = [])

    Obtém a chave atual pela qual o conjunto de registros está ordenado.

Criando Links de Números de Página
===================================

.. php:method:: numbers($options = [])

Retorna um conjunto de números para o conjunto de resultados paginado. Usa um módulo para
decidir quantos números mostrar em cada lado da página atual. Por padrão,
8 links em cada lado da página atual serão criados se essas páginas existirem.
Links não serão gerados para páginas que não existem. A página atual também
não é um link. Os templates ``number``, ``current`` e ``ellipsis`` serão
usados.

Opções suportadas são:

* ``before`` Conteúdo a ser inserido antes dos números.
* ``after`` Conteúdo a ser inserido depois dos números.
* ``modulus`` quantos números incluir em cada lado da página atual,
  padrão é 8.
* ``first`` Se você quer links primeiro gerados, defina como um inteiro para
  definir o número de links 'primeiro' a gerar. Padrão é ``false``. Se uma
  string for definida, um link para a primeira página será gerado com o valor como
  título::

      echo $this->Paginator->numbers(['first' => 'First page']);

* ``last`` Se você quer links último gerados, defina como um inteiro para definir
  o número de links 'último' a gerar. Padrão é ``false``. Segue a mesma
  lógica que a opção ``first``. Há um
  método :php:meth:`~PaginatorHelper::last()` para ser usado separadamente também se
  você desejar.

Embora este método permita muita personalização para sua saída, também é
ok apenas chamar o método sem nenhum parâmetro. ::

    echo $this->Paginator->numbers();

Usando as opções first e last você pode criar links para o início
e fim do conjunto de páginas. O seguinte criaria um conjunto de links de página que
incluem links para as primeiras 2 e últimas 2 páginas nos resultados paginados::

    echo $this->Paginator->numbers(['first' => 2, 'last' => 2]);

Criando Links de Salto
=======================

Além de gerar links que vão diretamente para números de página específicos,
você frequentemente vai querer links que vão para os links anterior e próximo, primeira e última
páginas no conjunto de dados paginado.

.. php:method:: prev($title = '<< Previous', $options = [])

    :param string $title: Título para o link.
    :param mixed $options: Opções para link de paginação.

    Gera um link para a página anterior em um conjunto de registros paginados. Usa
    os templates ``prevActive`` e ``prevDisabled``.

    ``$options`` suporta as seguintes chaves:

    * ``escape`` Se você quer o conteúdo codificado como entidade HTML,
      padrão é ``true``.
    * ``disabledTitle`` O texto a usar quando o link está desabilitado. Padrão é
      o parâmetro ``$title``.

    Um exemplo simples seria::

        echo $this->Paginator->prev(' << ' . __('previous'));

    Se você estivesse atualmente na segunda página de posts, você obteria o seguinte:

    .. code-block:: html

        <li class="prev">
            <a rel="prev" href="/posts/index?page=1&amp;sort=title&amp;order=desc">
                &lt;&lt; previous
            </a>
        </li>

    Se não houver páginas anteriores, você obteria:

    .. code-block:: html

        <li class="prev disabled"><a href="" onclick="return false;">&lt;&lt; previous</a></li>

    Para alterar os templates usados por este método, veja :ref:`paginator-templates`.

.. php:method:: next($title = 'Next >>', $options = [])

    Este método é idêntico a :php:meth:`~PaginatorHelper::prev()` com algumas exceções. Ele
    cria links apontando para a próxima página em vez da anterior. Ele também
    usa ``next`` como o valor do atributo rel em vez de ``prev``. Usa os
    templates ``nextActive`` e ``nextDisabled``.

.. php:method:: first($first = '<< first', $options = [])

    Retorna um primeiro ou conjunto de números para as primeiras páginas. Se uma string for fornecida,
    então apenas um link para a primeira página com o texto fornecido será criado::

        echo $this->Paginator->first('< first');

    O código acima cria um único link para a primeira página. Não produzirá nada se você
    estiver na primeira página. Você também pode usar um inteiro para indicar quantos primeiros
    links de paginação você quer gerados::

        echo $this->Paginator->first(3);

    O código acima criará links para as primeiras 3 páginas, uma vez que você chegue à terceira ou
    página maior. Antes disso, nada será produzido. Usa o template ``first``.

    O parâmetro options aceita o seguinte:

    - ``escape`` Se o texto deve ou não ser escapado. Defina como ``false`` se seu
      conteúdo contém HTML.

.. php:method:: last($last = 'last >>', $options = [])

    Este método funciona muito como o método :php:meth:`~PaginatorHelper::first()`.
    Mas tem algumas diferenças. Ele não gerará nenhum link se você
    estiver na última página para valores string de ``$last``. Para um valor inteiro de
    ``$last``, nenhum link será gerado uma vez que o usuário esteja dentro do intervalo de últimas
    páginas. Usa o template ``last``.

Criando Tags de Link de Cabeçalho
==================================

O PaginatorHelper pode ser usado para criar tags de link de paginação em seus elementos
``<head>`` da página::

    // Cria links próximo/anterior para o model atual.
    echo $this->Paginator->meta();

    // Cria links próximo/anterior e primeiro/último para o model atual.
    echo $this->Paginator->meta(['first' => true, 'last' => true]);

Verificando o Estado da Paginação
==================================

.. php:method:: current()

    Obtém a página atual do conjunto de registros::

        // Nossa URL é: /comments?page=3
        echo $this->Paginator->current();
        // A saída é 3

    Usa o template ``current``.

.. php:method:: hasNext(string $model = null)

    Retorna ``true`` se o conjunto de resultados fornecido não estiver na última página.

.. php:method:: hasPrev()

    Retorna ``true`` se o conjunto de resultados fornecido não estiver na primeira página.

.. php:method:: hasPage(int $page = 1)

    Retorna ``true`` se o conjunto de resultados fornecido tiver o número de página fornecido por ``$page``.

.. php:method:: total()

    Retorna o número total de páginas para o model fornecido.

Criando um Contador de Página
==============================

.. php:method:: counter(string $format = 'pages', array $options = [])

Retorna uma string de contador para o conjunto de resultados paginado. Usando uma string de formato
fornecida e várias opções, você pode criar indicadores localizados e específicos da aplicação
de onde um usuário está no conjunto de dados paginado. Usa os
templates ``counterRange`` e ``counterPages``.

Formatos suportados são 'range', 'pages' e custom. O padrão é pages, que
geraria uma saída como '1 of 10'. No modo custom, a string fornecida é analisada e
tokens são substituídos por valores reais. Os tokens disponíveis são:

-  ``{{page}}`` - a página atual exibida.
-  ``{{pages}}`` - número total de páginas.
-  ``{{current}}`` - número atual de registros sendo mostrados.
-  ``{{count}}`` - o número total de registros no conjunto de resultados.
-  ``{{start}}`` - número do primeiro registro sendo exibido.
-  ``{{end}}`` - número do último registro sendo exibido.
-  ``{{model}}`` - A forma humana pluralizada do nome do model.
   Se seu model fosse 'RecipePage', ``{{model}}`` seria 'recipe pages'.

Você também pode fornecer apenas uma string para o método counter usando os tokens
disponíveis. Por exemplo::

    echo $this->Paginator->counter(
        'Page {{page}} of {{pages}}, showing {{current}} records out of
         {{count}} total, starting on record {{start}}, ending on {{end}}'
    );

Definir 'format' para range geraria uma saída como '1 - 3 of 13'::

    echo $this->Paginator->counter('range');

Gerando URLs de Paginação
==========================

.. php:method:: generateUrl(array $options = [], ?string $model = null, array $url = [], array $urlOptions = [])

Por padrão, retorna uma string de URL de paginação completa para uso em contextos não-padrão
(ou seja, JavaScript). ::

    // Gera uma URL similar a: /articles?sort=title&page=2
    echo $this->Paginator->generateUrl(['sort' => 'title']);

    // Gera uma URL para um model diferente
    echo $this->Paginator->generateUrl(['sort' => 'title'], 'Comments');

    // Gera uma URL para um controller diferente.
    echo $this->Paginator->generateUrl(
        ['sort' => 'title'],
        null,
        ['controller' => 'Comments']
    );

Criando um Controle Selectbox de Limite
========================================

.. php:method:: limitControl(array $limits = [], $default = null, array $options = [])

Cria um controle dropdown que altera o parâmetro de consulta ``limit``::

    // Usa os padrões.
    echo $this->Paginator->limitControl();

    // Define quais opções de limite você quer.
    echo $this->Paginator->limitControl([25 => 25, 50 => 50]);

    // Limites personalizados e define a opção selecionada
    echo $this->Paginator->limitControl([25 => 25, 50 => 50], $user->perPage);

O formulário e controle gerados serão enviados automaticamente ao mudar.

Configurando Opções de Paginação
=================================

.. php:method:: options($options = [])

Define todas as opções para o PaginatorHelper. Opções suportadas são:

* ``url`` A URL da action de paginação.

  A opção permite que você defina/sobrescreva qualquer elemento para URLs geradas pelo
  helper::

    $this->Paginator->options([
        'url' => [
            'lang' => 'en',
            '?' => [
                'sort' => 'email',
                'direction' => 'desc',
                'page' => 6,
            ],
        ]
    ]);

  O exemplo acima adiciona o parâmetro de rota ``en`` a todos os links que o helper irá
  gerar. Ele também criará links com valores específicos de sort, direction e page.
  Por padrão, ``PaginatorHelper`` irá mesclar todos os argumentos passados
  atualmente e parâmetros de query string.

* ``escape`` Define se o campo de título para links deve ser escapado em HTML.
  Padrão é ``true``.

Exemplo de Uso
==============

Cabe a você decidir como mostrar registros ao usuário, mas na maioria das vezes isso
será feito dentro de tabelas HTML. Os exemplos abaixo assumem um layout tabular, mas
o PaginatorHelper disponível em views nem sempre precisa ser restrito
assim.

Veja os detalhes sobre
`PaginatorHelper <https://api.cakephp.org/5.x/class-Cake.View.Helper.PaginatorHelper.html>`_ na
API. Como mencionado, o PaginatorHelper também oferece recursos de ordenação que
podem ser integrados aos cabeçalhos das colunas da sua tabela:

.. code-block:: php

    <!-- templates/Posts/index.php -->
    <table>
        <tr>
            <th><?= $this->Paginator->sort('id', 'ID') ?></th>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= $recipe->id ?> </td>
            <td><?= h($recipe->title) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

Os links gerados pelo método ``sort()`` do ``PaginatorHelper`` permitem que
usuários cliquem nos cabeçalhos da tabela para alternar a ordenação dos dados por um
campo específico.

Também é possível ordenar uma coluna com base em associações:

.. code-block:: php

    <table>
        <tr>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
            <th><?= $this->Paginator->sort('Authors.name', 'Author') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= h($recipe->title) ?> </td>
            <td><?= h($recipe->name) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

.. note::

    Ordenar por colunas em models associados requer definir estas na
    propriedade ``PaginationComponent::paginate``. Usando o exemplo acima, o
    controller que lida com a paginação precisaria definir sua chave ``sortableFields``
    da seguinte forma:

    .. code-block:: php

        $this->paginate = [
            'sortableFields' => [
                'Posts.title',
                'Authors.name',
            ],
        ];

    Para mais informações sobre o uso da opção ``sortableFields``, por favor veja
    :ref:`control-which-fields-used-for-ordering`.

O ingrediente final para exibição de paginação em views é a adição de
navegação de página, também fornecida pelo PaginationHelper::

    // Mostra os números de página
    <?= $this->Paginator->numbers() ?>

    // Mostra os links próximo e anterior
    <?= $this->Paginator->prev('« Previous') ?>
    <?= $this->Paginator->next('Next »') ?>

    // Imprime X de Y, onde X é a página atual e Y é o número de páginas
    <?= $this->Paginator->counter() ?>

A redação da saída do método counter() também pode ser personalizada usando
marcadores especiais::

    <?= $this->Paginator->counter([
        'format' => 'Page {{page}} of {{pages}}, showing {{current}} records out of
                 {{count}} total, starting on record {{start}}, ending on {{end}}'
    ]) ?>

.. _paginator-helper-multiple:

Paginando Múltiplos Resultados
===============================

Se você está :ref:`paginando múltiplas consultas <paginating-multiple-queries>`
você precisará usar ``PaginatorHelper::setPaginated()`` primeiro antes de chamar
outros métodos do helper, para que eles gerem a saída esperada.

``PaginatorHelper`` usará automaticamente o ``scope`` definido quando a
consulta foi paginada. Para definir parâmetros de URL adicionais para paginação múltipla
você pode incluir os nomes de scope em ``options()``::

    $this->Paginator->options([
        'url' => [
            // Parâmetros de URL adicionais para o scope 'articles'
            'articles' => [
                '?' => ['articles' => 'yes']
            ],
            // Parâmetros de URL adicionais para o scope 'comments'
            'comments' => [
                'articleId' => 1234,
            ],
        ],
    ]);

.. meta::
    :title lang=pt: PaginatorHelper
    :description lang=pt: O PaginatorHelper é usado para gerar controles de paginação como números de página e links de próximo/anterior.
    :keywords lang=pt: helper paginator,paginação,ordenar,links de número de página,paginação em views,link anterior,link próximo,link último,link primeiro,contador de página
