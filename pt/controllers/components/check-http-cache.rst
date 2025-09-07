Checando o Cache HTTP
=====================

.. php:class:: CheckHttpCacheComponent(ComponentCollection $collection, array $config = [])

O modelo de validação de cache HTTP é um dos processos usados ​​por gateways de cache,
também conhecidos como proxies reversos, para determinar se eles podem fornecer uma cópia armazenada de
uma resposta ao cliente. Com esse modelo, você economiza principalmente largura de banda, mas, quando
usado corretamente, também pode economizar algum processamento de CPU, reduzindo
os tempos de resposta::

    // No Controller
    public function initialize(): void
    {
        parent::initialize();

        $this->addComponent('CheckHttpCache');
    }

Habilitar o ``CheckHttpCacheComponent`` no seu controlador ativa automaticamente uma verificação 
``beforeRender``. Essa verificação compara os cabeçalhos de cache definidos no objeto de resposta 
com os cabeçalhos de cache enviados na solicitação para determinar se a resposta não foi modificada 
desde a última vez que o cliente a solicitou. Os seguintes cabeçalhos de solicitação são usados:

* ``If-None-Match`` é comparado com o cabeçalho ``Etag`` da resposta.
* ``If-Modified-Since`` é comparado com o cabeçalho ``Last-Modified`` da resposta.

Se os cabeçalhos de resposta corresponderem aos critérios do cabeçalho da solicitação, a renderização da visualização será
ignorada. Isso evita que seu aplicativo gere uma visualização, economizando largura de banda e
tempo. Quando os cabeçalhos de resposta correspondem, uma resposta vazia é retornada com um código de status ``304
Not Modified``.
