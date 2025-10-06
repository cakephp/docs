Breadcrumbs
###########

.. php:namespace:: Cake\View\Helper

.. php:class:: BreadcrumbsHelper(View $view, array $config = [])

O BreadcrumbsHelper fornece uma maneira de lidar facilmente com a criação e renderização
de trilhas de navegação estrutural (breadcrumbs) para sua aplicação.

Criando uma Trilha de Breadcrumbs
==================================

Você pode adicionar um item à lista usando o método ``add()``. Ele aceita três
argumentos:

- **title** A string a ser exibida como título do item
- **url** Uma string ou um array de parâmetros que será passado para o
  :doc:`/views/helpers/url`
- **options** Um array de atributos para os templates ``item`` e ``itemWithoutLink``
  templates. Veja a seção sobre :ref:`definição de atributos para o item
  <defining_attributes_item>` para mais informações.

Além de adicionar ao final da trilha, você pode fazer uma variedade de operações::

    // Adiciona ao final da trilha
    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Adiciona múltiplos itens ao final da trilha
    $this->Breadcrumbs->add([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]],
    ]);

    // Itens adicionados com prepend serão colocados no topo da lista
    $this->Breadcrumbs->prepend(
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Adiciona múltiplos itens no topo da trilha, na ordem fornecida
    $this->Breadcrumbs->prepend([
        ['title' => 'Products', 'url' => ['controller' => 'products', 'action' => 'index']],
        ['title' => 'Product name', 'url' => ['controller' => 'products', 'action' => 'view', 1234]],
    ]);

    // Insere em uma posição específica. Se a posição estiver fora
    // dos limites, uma exceção será lançada.
    $this->Breadcrumbs->insertAt(
        2,
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insere antes de outro item, baseado no título.
    // Se o título do item não for encontrado,
    // uma exceção será lançada.
    $this->Breadcrumbs->insertBefore(
        'A product name', // o título do item antes do qual inserir
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

    // Insere depois de outro item, baseado no título.
    // Se o título do item não for encontrado,
    // uma exceção será lançada.
    $this->Breadcrumbs->insertAfter(
        'A product name', // o título do item depois do qual inserir
        'Products',
        ['controller' => 'products', 'action' => 'index']
    );

Usar esses métodos oferece a capacidade de trabalhar com o processo de renderização em 2 etapas
do CakePHP. Como templates e layouts são renderizados de dentro para fora
(ou seja, elementos incluídos são renderizados primeiro), isso permite que você defina
precisamente onde deseja adicionar um breadcrumb.

Renderizando a Trilha de Breadcrumbs
=====================================

Depois de adicionar itens à trilha, você pode renderizá-la facilmente usando o
método ``render()``. Este método aceita dois argumentos de array:

- ``$attributes`` : Um array de atributos que serão aplicados ao template ``wrapper``
  template. Isso dá a você a capacidade de adicionar atributos à tag HTML. Aceita
  a chave especial ``templateVars`` para permitir a inserção de variáveis de
  template personalizadas no template.
- ``$separator`` : Um array de atributos para o template ``separator``.
  Propriedades possíveis são:

  - ``separator`` A string a ser exibida como separador
  - ``innerAttrs`` Para fornecer atributos caso seu separador seja dividido
    em dois elementos
  - ``templateVars`` Permite a inserção de variáveis de template personalizadas no
    template

  Todas as outras propriedades serão convertidas como atributos HTML e substituirão
  a chave ``attrs`` no template. Se você usar o padrão para esta opção
  (vazio), não renderizará um separador.

Aqui está um exemplo de como renderizar uma trilha::

    echo $this->Breadcrumbs->render(
        ['class' => 'breadcrumbs-trail'],
        ['separator' => '<i class="fa fa-angle-right"></i>']
    );

Personalizando a Saída
----------------------

O BreadcrumbsHelper internamente usa o ``StringTemplateTrait``, que fornece
a capacidade de personalizar facilmente a saída de várias strings HTML.
Ele inclui quatro templates, com a seguinte declaração padrão::

    [
        'wrapper' => '<ul{{attrs}}>{{content}}</ul>',
        'item' => '<li{{attrs}}><a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}',
        'itemWithoutLink' => '<li{{attrs}}><span{{innerAttrs}}>{{title}}</span></li>{{separator}}',
        'separator' => '<li{{attrs}}><span{{innerAttrs}}>{{separator}}</span></li>'
    ]

Você pode personalizá-los facilmente usando o método ``setTemplates()`` do
``StringTemplateTrait``::

    $this->Breadcrumbs->setTemplates([
        'wrapper' => '<nav class="breadcrumbs"><ul{{attrs}}>{{content}}</ul></nav>',
    ]);

Como seus templates serão renderizados, a opção ``templateVars``
permite que você adicione suas próprias variáveis de template nos vários templates::

    $this->Breadcrumbs->setTemplates([
        'item' => '<li{{attrs}}>{{icon}}<a href="{{url}}"{{innerAttrs}}>{{title}}</a></li>{{separator}}'
    ]);

E para definir o parâmetro ``{{icon}}``, basta especificá-lo ao adicionar o
item à trilha::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'templateVars' => [
                'icon' => '<i class="fa fa-money"></i>',
            ],
        ]
    );

.. _defining_attributes_item:

Definindo Atributos para o Item
--------------------------------

Se você deseja aplicar atributos HTML específicos tanto para o item quanto para seu sub-item,
você pode aproveitar a chave ``innerAttrs``, que o argumento ``$options``
fornece. Tudo exceto ``innerAttrs`` e ``templateVars`` será
renderizado como atributos HTML::

    $this->Breadcrumbs->add(
        'Products',
        ['controller' => 'products', 'action' => 'index'],
        [
            'class' => 'products-crumb',
            'data-foo' => 'bar',
            'innerAttrs' => [
                'class' => 'inner-products-crumb',
                'id' => 'the-products-crumb',
            ],
        ]
    );

    // Baseado no template padrão, isso renderizará o seguinte HTML:
    <li class="products-crumb" data-foo="bar">
        <a href="/products/index" class="inner-products-crumb" id="the-products-crumb">Products</a>
    </li>

Limpando os Breadcrumbs
========================

Você pode limpar os breadcrumbs usando o método ``reset()``. Isso pode ser útil
quando você deseja transformar os itens e sobrescrever a lista::

    $crumbs = $this->Breadcrumbs->getCrumbs();
    $crumbs = collection($crumbs)->map(function ($crumb) {
        $crumb['options']['class'] = 'breadcrumb-item';

        return $crumb;
    })->toArray();

    $this->Breadcrumbs->reset()->add($crumbs);

.. meta::
    :title lang=pt: BreadcrumbsHelper
    :description lang=pt: O papel do BreadcrumbsHelper no CakePHP é fornecer uma maneira de gerenciar facilmente breadcrumbs.
    :keywords lang=pt: breadcrumbs helper,cakephp crumbs
