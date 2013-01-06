Paginator
#########

O helper Paginator é usado para exibir controles de paginação tais como
número de página e links anterior/próximo.

Veja também `Tarefas comuns com o CakePHP -
Paginação </pt/view/164/Paginação>`_ para mais informações.

Métodos
=======

options($options = array())

-  mixed options() Opções padrão para os links de paginação. Se uma
   string for informada, ela será usada como id DOM do elemento a ser
   atualizado. Veja options() para a lista de índices possíveis.

options() define todas as opções para o helper Paginator. Opções
suportadas são:

**format**

Formata o contador. Os formatos suportados são 'range' e 'pages' além de
um formato personalizado que é o padrão. No modo padrão, a string
informada é analisada e os tokens são substituídos pelos valores atuais.
Os tokens disponíveis são:

-  %page% - a página atual exibida.
-  %pages% - o número total de páginas.
-  %current% - o número atual de registros sendo exibidos.
-  %count% - o total de registros no conjunto de resultados.
-  %start% - o número do primeiro registro sendo exibido.
-  %end% - o número do último registro sendo exibido.

Agora que você já conhece os tokens disponíveis, você pode usar o método
counter() para exibir todos os tipos de informação sobre os resultados
retornados, por exemplo:

::

    echo $paginator->counter(array(
            'format' => 'Página %page% de %pages%, 
                         mostrando %current% registros de um total de %count%, 
                         indo do registro %start% até o %end%'
    )); 

**separator**

O separador entre a página atual e o número de páginas. O padrão é ' of
'. Isto é usado em conjunto com format = 'pages'

**url**

A URL da action de paginação. O método url tem algumas poucas sub-opções

-  sort - o índice pelo qual os registros são ordenados
-  direction - o sentido de ordenação. O padrão é 'ASC'
-  page - o número de página a ser exibido

**model**

O nome do model sendo paginado.

**escape**

Define se o campo de título para os links deve ser escapado para HTML. O
padrão é true.

**update**

O id DOM do elemento a ser atualizado com os resultados de uma chamada
de paginação AJAX. Se não especificado, links regulares serão criados.

**indicator**

O id DOM do elemento que será mostrado como indicador de carregamento
durante as requisições AJAX.

link($title, $url = array(), $options = array())

-  string $title - o título para o link.
-  mixed $url - a url para a action. Veja Router::url()
-  array $options - opções para o link. Veja options() para uma lista de
   índices possíveis.

Cria um link ordinário ou AJAX com parâmetros de paginação

::

    echo $paginator->link('Ordena por título na página 5', 
            array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

Se criado na view para ``/posts/index``, deve criar um link apontando
para '/posts/index/page:5/sort:title/direction:desc'
