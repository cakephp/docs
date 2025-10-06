Views JSON e XML
################

A integração de ``JsonView`` e ``XmlView`` com os recursos de
:ref:`controller-viewclasses` do CakePHP permitem que você crie respostas JSON e XML.

Essas classes de view são mais comumente usadas com :php:meth:`Cake\\Controller\\Controller::viewClasses()`.

Existem duas maneiras de gerar views de dados. A primeira é usando a
opção ``serialize`` e a segunda é criando arquivos de template normais.

Definindo Classes de View para Negociar
========================================

No seu ``AppController`` ou em um controller individual, você pode implementar o
método ``viewClasses()`` e fornecer todas as views que deseja suportar::

    use Cake\View\JsonView;
    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [JsonView::class, XmlView::class];
    }

Você pode opcionalmente habilitar as extensões json e/ou xml com
:ref:`file-extensions`. Isso permitirá que você acesse as views ``JSON``, ``XML`` ou
qualquer outro formato especial usando uma URL personalizada terminando com o nome do
tipo de resposta como uma extensão de arquivo, como ``http://example.com/articles.json``.

Por padrão, quando não estiver habilitando :ref:`file-extensions`, o cabeçalho ``Accept``
na requisição é usado para selecionar qual tipo de formato deve ser renderizado para o
usuário. Um exemplo de formato ``Accept`` usado para renderizar respostas ``JSON`` é
``application/json``.

Usando Views de Dados com a Chave Serialize
============================================

A opção ``serialize`` indica qual(is) variável(is) de view deve(m) ser
serializada(s) ao usar uma view de dados. Isso permite que você pule a definição de arquivos de template
para as ações do seu controller se não precisar fazer nenhuma formatação personalizada antes
de seus dados serem convertidos em json/xml.

Se você precisar fazer qualquer formatação ou manipulação de suas variáveis de view antes
de gerar a resposta, deve usar arquivos de template. O valor de
``serialize`` pode ser tanto uma string quanto um array de variáveis de view para
serializar::


    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Define as variáveis de view
            $this->set('articles', $this->paginate());
            // Especifica quais variáveis de view o JsonView deve serializar.
            $this->viewBuilder()->setOption('serialize', 'articles');
        }
    }

Você também pode definir ``serialize`` como um array de variáveis de view para combinar::

    namespace App\Controller;

    use Cake\View\JsonView;

    class ArticlesController extends AppController
    {
        public function viewClasses(): array
        {
            return [JsonView::class];
        }

        public function index()
        {
            // Algum código que criou $articles e $comments

            // Define as variáveis de view
            $this->set(compact('articles', 'comments'));

            // Especifica quais variáveis de view o JsonView deve serializar.
            $this->viewBuilder()->setOption('serialize', ['articles', 'comments']);
        }
    }

Definir ``serialize`` como um array tem o benefício adicional de anexar automaticamente
um elemento ``<response>`` de nível superior ao usar :php:class:`XmlView`.
Se você usar um valor string para ``serialize`` e XmlView, certifique-se de que sua
variável de view tenha um único elemento de nível superior. Sem um único elemento de nível
superior, o Xml falhará ao gerar.

Usando uma View de Dados com Arquivos de Template
==================================================

Você deve usar arquivos de template se precisar manipular o conteúdo de sua view
antes de criar a saída final. Por exemplo, se tivéssemos articles com um campo contendo HTML gerado, provavelmente gostaríamos de omitir isso de uma
resposta JSON. Esta é uma situação onde um arquivo de view seria útil::

    // Código do Controller
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // Código da View - templates/Articles/json/index.php
    foreach ($articles as $article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

Você pode fazer manipulações mais complexas, ou usar helpers para formatação também.
As classes de view de dados não suportam layouts. Elas assumem que o arquivo de view irá
gerar o conteúdo serializado.

Criando Views XML
=================

.. php:class:: XmlView

Por padrão, ao usar ``serialize``, o XmlView envolverá suas variáveis
de view serializadas com um nó ``<response>``. Você pode definir um nome personalizado para
este nó usando a opção ``rootNode``.

A classe XmlView suporta a opção ``xmlOptions`` que permite personalizar
as opções, como ``tags`` ou ``attributes``, usadas para gerar XML.

Um exemplo de uso de ``XmlView`` seria gerar um `sitemap.xml
<https://www.sitemaps.org/protocol.html>`_. Este tipo de documento requer que você
altere ``rootNode`` e defina atributos. Atributos são definidos usando o prefixo ``@``::

    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [XmlView::class];
    }

    public function sitemap()
    {
        $pages = $this->Pages->find()->all();
        $urls = [];
        foreach ($pages as $page) {
            $urls[] = [
                'loc' => Router::url(['controller' => 'Pages', 'action' => 'view', $page->slug, '_full' => true]),
                'lastmod' => $page->modified->format('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => '0.5',
            ];
        }

        // Define um nó raiz personalizado no documento gerado.
        $this->viewBuilder()
            ->setOption('rootNode', 'urlset')
            ->setOption('serialize', ['@xmlns', 'url']);
        $this->set([
            // Define um atributo no nó raiz.
            '@xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'url' => $urls,
        ]);
    }

Criando Views JSON
==================

.. php:class:: JsonView

A classe JsonView suporta a opção ``jsonOptions`` que permite personalizar
a máscara de bits usada para gerar JSON. Veja a documentação do
`json_encode <https://php.net/json_encode>`_ para os valores
válidos desta opção.

Por exemplo, para serializar a saída de erros de validação de entidades CakePHP em uma forma consistente de JSON faça::

    // Na action do seu controller quando o salvamento falhou
    $this->set('errors', $articles->errors());
    $this->viewBuilder()
        ->setOption('serialize', ['errors'])
        ->setOption('jsonOptions', JSON_FORCE_OBJECT);

Respostas JSONP
---------------

Ao usar ``JsonView`` você pode usar a variável de view especial ``jsonp`` para
habilitar o retorno de uma resposta JSONP. Defini-la como ``true`` faz com que a classe de view
verifique se o parâmetro de query string chamado "callback" está definido e, se estiver, envolve a
resposta json no nome da função fornecida. Se você quiser usar um nome de parâmetro de query string
personalizado em vez de "callback", defina ``jsonp`` para o nome requerido em vez de
``true``.

Escolhendo uma Classe de View
==============================

Embora você possa usar o método hook ``viewClasses`` na maioria das vezes, se você quiser
controle total sobre a seleção da classe de view, pode escolher diretamente a classe de view::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Http\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // Mapeamento de formato para view
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // Erro em tipo desconhecido
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // Define a View do Formato de Saída
            $this->viewBuilder()->setClassName($formats[$format]);

            // Obtém dados
            $videos = $this->Videos->find('latest')->all();

            // Define a View de Dados
            $this->set(compact('videos'));
            $this->viewBuilder()->setOption('serialize', ['videos']);

            // Define Download Forçado
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }

.. meta::
    :title lang=pt: Views JSON e XML
    :keywords lang=pt: json,xml,presentation layer,view,ajax,logic,syntax,templates,cakephp
