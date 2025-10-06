Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

O comportamento Translate permite criar e recuperar cópias traduzidas de suas
entidades em vários idiomas.

.. warning::

    O TranslateBehavior não suporta chaves primárias compostas neste momento.

Estratégias de Tradução
========================

O comportamento oferece duas estratégias para como as traduções são armazenadas.

1. Estratégia Shadow Table: Esta estratégia usa uma "tabela shadow" separada para cada
   objeto Table para armazenar a tradução de todos os campos traduzidos dessa tabela.
   Esta é a estratégia padrão.
2. Estratégia Eav: Esta estratégia usa uma tabela ``i18n`` onde armazena a
   tradução para cada um dos campos de qualquer objeto Table ao qual está vinculado.

Estratégia Shadow Table
========================

Vamos assumir que temos uma tabela ``articles`` e queremos que os campos ``title`` e ``body``
sejam traduzidos. Para isso, criamos uma tabela shadow ``articles_translations``:

.. code-block:: sql

    CREATE TABLE `articles_translations` (
        `id` int(11) NOT NULL,
        `locale` varchar(5) NOT NULL,
        `title` varchar(255),
        `body` text,
        PRIMARY KEY (`id`,`locale`)
    );

A tabela shadow precisa das colunas ``id`` e ``locale`` que juntas
formam a chave primária e outras colunas com o mesmo nome da tabela primária que
precisam ser traduzidas.

Uma observação sobre as abreviações de idioma: O comportamento Translate não impõe
restrições ao identificador de idioma; os valores possíveis são restritos apenas
pelo tipo/tamanho da coluna ``locale``. ``locale`` é definido como ``varchar(6)`` caso
você queira usar abreviações como ``es-419`` (espanhol para América Latina,
abreviação de idioma com código de área `UN M.49
<https://en.wikipedia.org/wiki/UN_M.49>`_).

.. tip::

    É aconselhável usar as mesmas abreviações de idioma necessárias para
    :doc:`Internacionalização e Localização
    </core-libraries/internationalization-and-localization>`. Assim, você é
    consistente e a alternância do idioma funciona de forma idêntica para
    ambos, o comportamento ``Translate`` e ``Internationalization and Localization``.

Portanto, é recomendável usar o código ISO de duas letras do idioma como
``en``, ``fr``, ``de`` ou o nome completo da localidade, como ``fr_FR``, ``es_AR``,
``da_DK``, que contém o idioma e o país em que é falado.

Estratégia Eav
==============

Para usar a estratégia Eav, você precisa criar uma tabela ``i18n`` com o
esquema correto. Atualmente, a única maneira de carregar a tabela ``i18n``
é executando manualmente o seguinte script SQL no seu banco de dados:

.. code-block:: sql

    CREATE TABLE i18n (
        id int NOT NULL auto_increment,
        locale varchar(6) NOT NULL,
        model varchar(255) NOT NULL,
        foreign_key int(10) NOT NULL,
        field varchar(255) NOT NULL,
        content text,
        PRIMARY KEY	(id),
        UNIQUE INDEX I18N_LOCALE_FIELD(locale, model, foreign_key, field),
        INDEX I18N_FIELD(model, foreign_key, field)
    );

O esquema também está disponível como arquivo sql em **/config/schema/i18n.sql**.

Anexando o Comportamento Translate às suas Tabelas
===================================================

Anexar o comportamento pode ser feito no método ``initialize()`` na sua classe Table::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            // Por padrão, ShadowTable será usado.
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

Para a estratégia shadow table, especificar a chave ``fields`` é opcional, pois o
comportamento pode inferir os campos a partir das colunas da tabela shadow.

Se você quiser usar a ``EavStrategy``, pode configurar o comportamento
assim::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', [
                'strategyClass' => \Cake\ORM\Behavior\Translate\EavStrategy::class,
                'fields' => ['title', 'body'],
            ]);
        }
    }

Para ``EavStrategy`` é necessário passar a chave ``fields`` no array de
configuração. Esta lista de campos é necessária para informar ao comportamento quais
colunas serão capazes de armazenar traduções.

Por padrão, a localidade especificada na configuração ``App.defaultLocale`` é usada como
localidade padrão para o ``TranslateBehavior``. Você pode substituir isso definindo a
configuração ``defaultLocale`` do comportamento::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', [
                'defaultLocale' => 'en_GB',
            ]);
        }
    }

Um Tour Rápido
==============

Independentemente da estratégia de estrutura de dados que você escolher, o comportamento fornece a
mesma API para gerenciar traduções.

Agora, selecione um idioma a ser usado para recuperar entidades alterando
o idioma do aplicativo, o que afetará todas as traduções::

    // No Controller Articles. Altere a localidade para espanhol, por exemplo
    I18n::setLocale('es');

Em seguida, obtenha uma entidade existente::

    $article = $this->Articles->get(12);
    echo $article->title; // Exibe 'A title', ainda não traduzido

Em seguida, traduza sua entidade::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

Agora você pode tentar obter sua entidade novamente::

    $article = $this->Articles->get(12);
    echo $article->title; // Exibe 'Un Artículo', yay piece of cake!

O trabalho com várias traduções pode ser feito usando uma trait especial
na sua classe Entity::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Agora você pode encontrar todas as traduções para uma única entidade::

    $article = $this->Articles->find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

E salvar várias traduções ao mesmo tempo::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

Se você quiser se aprofundar em como ele funciona ou como ajustar o
comportamento às suas necessidades, continue lendo o restante deste capítulo.


Usando uma Tabela de Traduções Separada para a Estratégia Eav
--------------------------------------------------------------

Se você deseja usar uma tabela diferente de ``i18n`` para traduzir um repositório específico,
pode especificar o nome da classe da tabela para sua tabela personalizada
na configuração do comportamento. Isso é comum quando você tem várias
tabelas para traduzir e deseja uma separação mais limpa dos dados armazenados
para cada tabela diferente::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'translationTable' => 'ArticlesI18n',
            ]);
        }
    }

Você precisa ter certeza de que qualquer tabela personalizada usada tenha as colunas ``field``,
``foreign_key``, ``locale`` e ``model``.

Lendo Conteúdo Traduzido
=========================

Como mostrado acima, você pode usar o método ``setLocale()`` para escolher a tradução
ativa para entidades que são carregadas::

    // Carregue as funções principais do I18n no início do seu Controller Articles:
    use Cake\I18n\I18n;

    // Depois, você pode alterar o idioma em sua ação:
    I18n::setLocale('es');

    // Todas as entidades nos resultados conterão tradução para o espanhol
    $results = $this->Articles->find()->all();

Este método funciona com qualquer localizador em suas tabelas. Por exemplo, você
pode usar o TranslateBehavior com ``find('list')``::

    I18n::setLocale('es');
    $data = $this->Articles->find('list')->toArray();

    // Os dados conterão
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

    // Alterar a localidade para francês para uma única chamada find
    $data = $this->Articles->find('list', locale: 'fr')->toArray();

Recuperar Todas as Traduções para uma Entidade
-----------------------------------------------

Ao criar interfaces para atualizar o conteúdo traduzido, geralmente é útil
mostrar uma ou mais traduções ao mesmo tempo. Você pode usar o
localizador ``translations`` para isso::

    // Encontre o primeiro artigo com todas as traduções correspondentes
    $article = $this->Articles->find('translations')->first();

No exemplo acima, você receberá uma lista de entidades que possuem um conjunto de
propriedades ``_translations``. Esta propriedade conterá uma lista de entidades
de dados de tradução. Por exemplo, as seguintes propriedades estariam acessíveis::

    // Exibe 'en'
    echo $article->_translations['en']->locale;

    // Exibe 'title'
    echo $article->_translations['en']->field;

    // Exibe 'My awesome post!'
    echo $article->_translations['en']->body;

Uma maneira mais elegante de lidar com esses dados é adicionando uma trait
à classe de entidade usada para sua tabela::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Essa trait contém um único método chamado ``translation``, que permite acessar
ou criar novas entidades de tradução em tempo real::

    // Exibe 'title'
    echo $article->translation('en')->title;

    // Adiciona uma nova entidade de dados de tradução ao artigo
    $article->translation('de')->title = 'Wunderbar';

Limitando as Traduções a serem Recuperadas
-------------------------------------------

Você pode limitar os idiomas buscados no banco de dados para um conjunto específico
de registros::

    $results = $this->Articles->find('translations', locales: ['en', 'es']);
    $article = $results->first();
    $spanishTranslation = $article->translation('es');
    $englishTranslation = $article->translation('en');

Impedindo a Recuperação de Traduções Vazias
--------------------------------------------

Os registros de tradução podem conter qualquer string; se um registro tiver sido traduzido
e armazenado como uma string vazia (''), o comportamento de tradução usará isso
para substituir o valor do campo original.

Se isso for indesejável, você pode ignorar as traduções vazias usando a
chave de configuração ``allowEmptyTranslations``::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'allowEmptyTranslations' => false
            ]);
        }
    }

O exemplo acima carregaria apenas os dados traduzidos que tenham conteúdo.

Recuperando Todas as Traduções para Associações
------------------------------------------------

Também é possível encontrar traduções para qualquer associação em uma única
operação de localização::

    $article = $this->Articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // Exibe 'Programación'
    echo $article->categories[0]->translation('es')->name;

Isso pressupõe que ``Categories`` tem o TranslateBehavior associado. Simplesmente
use a função de construtor de consultas para a cláusula ``contain`` para usar o
localizador personalizado ``translations`` na associação.

.. _retrieving-one-language-without-using-i18n-locale:

Recuperando um Idioma Sem Usar I18n::setLocale
-----------------------------------------------

Chamar ``I18n::setLocale('es');`` altera a localidade padrão para todas as
localizações traduzidas; pode haver momentos em que você deseja recuperar o conteúdo traduzido sem
modificar o estado do aplicativo. Para esses cenários, use o método ``setLocale()``
do comportamento::

    I18n::setLocale('en'); // redefinir para ilustração

    // localidade específica.
    $this->Articles->setLocale('es');

    $article = $this->Articles->get(12);
    echo $article->title; // Exibe 'Un Artículo', yay piece of cake!

Observe que isso altera apenas a localidade da tabela Articles; isso não afetaria o idioma dos
dados associados. Para afetar os dados associados, é necessário chamar o método em cada
tabela, por exemplo::

    I18n::setLocale('en'); // redefinir para ilustração

    $this->Articles->setLocale('es');
    $this->Articles->Categories->setLocale('es');

    $data = $this->Articles->find('all', contain: ['Categories']);

Este exemplo também pressupõe que ``Categories`` tem o TranslateBehavior associado.

Consultando Campos Traduzidos
------------------------------

O TranslateBehavior não substitui as condições de localização por padrão. Você
precisa usar o método ``translationField()`` para compor as condições de localização nos
campos traduzidos::

    $this->Articles->setLocale('es');
    $query = $this->Articles->find()->where([
        $this->Articles->translationField('title') => 'Otro Título'
    ]);

Salvando em Outro Idioma
=========================

A filosofia por trás do TranslateBehavior é que você tem uma entidade que representa o
idioma padrão e várias traduções que podem substituir determinados campos nessa entidade.
Tendo isso em mente, você pode salvar intuitivamente traduções para qualquer entidade.
Por exemplo, dada a seguinte configuração::

    // Em src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    // Em src/Model/Entity/Article.php
    class Article extends Entity
    {
        use TranslateTrait;
    }

    // No Controller Articles
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $this->Articles->save($article);

Portanto, depois de salvar seu primeiro artigo, você pode salvar uma tradução para ele;
existem algumas maneiras de fazê-lo. A primeira é definir o idioma diretamente
na entidade::

    $article->_locale = 'es';
    $article->title = 'Mi primer Artículo';

    $this->Articles->save($article);

Depois que a entidade tiver sido salva, o campo traduzido também será mantido. Um valor
a ser observado é que os valores do idioma padrão que não foram substituídos serão
preservados::

    // Exibe 'This is the content'
    echo $article->body;

    // Exibe 'Mi primer Artículo'
    echo $article->title;

Depois de substituir o valor, a tradução para esse campo será salva e poderá ser recuperada
como de costume::

    $article->body = 'El contendio';
    $this->Articles->save($article);

A segunda maneira de usar para salvar entidades em outro idioma é definir o idioma padrão
diretamente para a tabela::

    $article->title = 'Mi Primer Artículo';

    $this->Articles->setLocale('es');
    $this->Articles->save($article);

Definir o idioma diretamente na tabela é útil quando você precisa recuperar e salvar entidades
para o mesmo idioma ou quando você precisa salvar várias entidades ao mesmo tempo.

.. _saving-multiple-translations:

Salvando Várias Traduções
==========================

É um requisito comum poder adicionar ou editar várias traduções em qualquer registro do
banco de dados ao mesmo tempo. Isso pode ser feito usando o ``TranslateTrait``::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Agora, você pode preencher as traduções antes de salvá-las::

    $translations = [
        'fr' => ['title' => "Un article"],
        'es' => ['title' => 'Un artículo'],
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $this->Articles->save($article);

E criar controles de formulário para seus campos traduzidos::

    // Em um template de view.
    <?= $this->Form->create($article); ?>
    <fieldset>
        <legend>French</legend>
        <?= $this->Form->control('_translations.fr.title'); ?>
        <?= $this->Form->control('_translations.fr.body'); ?>
    </fieldset>
    <fieldset>
        <legend>Spanish</legend>
        <?= $this->Form->control('_translations.es.title'); ?>
        <?= $this->Form->control('_translations.es.body'); ?>
    </fieldset>

No seu controller, você pode organizar os dados normalmente::

    $article = $this->Articles->newEntity($this->request->getData());
    $this->Articles->save($article);

Isso resultará no seu artigo, com as traduções em francês e espanhol sendo mantidas.
Você precisará se lembrar de adicionar ``_translations`` aos campos ``$_accessible``
da sua entidade também.

Validando Entidades Traduzidas
-------------------------------

Ao anexar ``TranslateBehavior`` a um modelo, você pode definir o validador que deve ser
usado quando os registros de tradução são criados/modificados pelo comportamento durante
``newEntity()`` ou ``patchEntity()``::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Translate', [
                'fields' => ['title'],
                'validator' => 'translated',
            ]);
        }
    }

O texto acima usará o validador criado por ``validationTranslated`` para validar
entidades traduzidas.
