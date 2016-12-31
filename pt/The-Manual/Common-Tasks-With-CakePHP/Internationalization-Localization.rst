Internacionalização & Localização
#################################

Um dos melhores caminhos para que suas aplicações atinjam a um
público-alvo maior é fazer com que sua aplicação funcione em diversos
idiomas. Isso pode representar uma tarefa árdua, mas os recursos de
internacionalização e localização do CakePHP tornam isto muito mais
fácil.

Primeiro, é importante que você entenda a terminologia.
*Internacionalização* refere-se à capacidade de uma aplicação ser
localizada. Já *Localização* refere-se à adaptação de uma aplicação para
atender as necessidades de um idioma específico (ou cultura), como, por
exemplo, um locale. Internacionalização e localização são abreviadas
como i18n e l10n, respectivamente; 18 e 10 representam a quantidade de
caracteres entre o primeiro e o último caractere.

Internacionalizando Sua Aplicação
=================================

Há alguns poucos passos a serem executados para transformar uma
aplicação mono-idioma para uma aplicação multi-idioma, sendo que o
primeiro passo é usar a função
`<code>\_\_() <https://api.cakephp.org/file/basics.php#function-__>`_ em
seu código. Abaixo segue um exemplo de algum código para uma aplicação
mono-idioma:

::

    <h2>Posts</h2>

Para internacionalizar seu código, tudo o que você precisa é demarcar as
strings com `a função de
tradução <https://api.cakephp.org/file/basics.php#function-__>`_ como
assim:

::

    <h2><?php __('Posts') ?></h2>

Se você não fizer mais nada, esses dois trechos de código são
funcionalmente idênticos - ambos irão enviar o mesmo conteúdo para o
navegador web. A `função
``__()`` <https://api.cakephp.org/file/basics.php#function-__>`_ vai
traduzir a string passada se houver uma tradução disponível, ou então
apenas retorná-la inalterada em caso contrário. Funciona de forma
semelhante a qualquer outra implementação de
`Gettext <https://en.wikipedia.org/wiki/Gettext>`_ (tal como outras
funções de tradução,
como\ ```__d()`` <https://api.cakephp.org/file/basics.php#function-__d>`_,
```__n()`` <https://api.cakephp.org/file/basics.php#function-__n>`_ etc).

Com seu código pronto para se tornar multi-idioma, o próximo passo é
criar seu `arquivo pot <https://en.wikipedia.org/wiki/Gettext>`_, que é o
modelo para todas as strings traduzíveis de sua aplicação. Para gerar
seu(s) arquivo(s) pot, apenas execute a tarefa `i18n
console <https://book.cakephp.org/view/620/Core-Console-Applications>`_,
que irá vasculhar todos os locais em que você utilizou a função de
traduçãoo em seu código e gerar o(s) arquivo(s) pot para você. Você
também pode re-executar esta tarefa de console a qualquer momento para
modificar as traduções em seu código.

O(s) arquivo(s) pot em si não são usados pelo CakePHP, eles são modelos
usados para criar ou atualizar seus `arquivos
po <https://en.wikipedia.org/wiki/Gettext>`_, que contém efetivamente as
traduções. O Cake irá procurar por seus arquivos po dados no seguinte
local:

::

    /app/locale/<locale>/LC_MESSAGES/<domain>.po

O domínio padrão chama-se 'default', já sua pasta locale deve ser algo
parecido com:

::

    /app/locale/eng/LC_MESSAGES/default.po (Inglês)
    /app/locale/fre/LC_MESSAGES/default.po (Francês)   
    /app/locale/por/LC_MESSAGES/default.po (Português) 

Para criar um editar seus arquivos po é recomendado que você *não*
utilize seu editor de texto. Para criar um arquivo po pela primeira vez
é possível copiar o arquivo pot para o local correto e apenas mudar a
extensão; *porém*, a menos que você esteja familiarizado com seu
formato, é muito fácil corromper o arquivo e torná-lo inválido ou mesmo
salvá-lo com o conjunto de caracteres incorreto (se você estiver
editando-o manualmente, utilize sempre UTF-8 para evitar problemas).
Existem ferramentas livres, como o `PoEdit <http://www.poedit.net>`_,
que tornam a edição e atualização de seus arquivos po uma tarefa mais
fácil; especialmente no caso da atualização de um arquivo po existente a
partir de um recém-atualizado arquivo pot.

Os códigos de três letras do locale estão de acordo com o padrão `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_,
apesar de que se você for criar locales regionais (en\_US, en\_GB, etc.)
o Cake vai usá-los apropriadamente.

Há um limite de 1041 caracteres para cada valor de msgstr (favor citar a
fonte desta informação).

Lembre-se que os arquivos po são úteis para mensagens curtas, se você
vir que terá que traduzir parágrafos longos ou mesmo páginas inteiras -
você deveria considerar implementar uma solução diferente, p.ex.:

::

    // Código em AppController.
    function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(VIEWS . $locale . DS . $this->viewPath)) {
            // p.ex. usa /app/views/fre/pages/tos.ctp ao invés de /app/views/pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

ou

::

    // Código na view.
    echo $this->element(Configure::read('Config.language') . '/tos')

Localização no CakePHP
======================

Para modificar ou definir o idioma de sua aplicação, tudo o que você
precisa fazer é o seguinte:

::

    Configure::write('Config.language', 'fre');

Isso diz ao Cake que locale usar (se você usar um locale regional, como
fr\_FR, ele irá usar o código do locale do padrão `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ como
segunda opção caso o locale regional principal não exista), você pode
modificar o idioma a qualquer momento, p.ex., em seu bootstrap, se você
estiver definindo o idioma padrão da aplicação, ou no beforeFilter de
seu (App) Controller se o idioma estiver especificado na requisição do
usuário, ou de fato em qualquer momento antes de você querer exibir uma
mensagem num idioma diferente.

É uma boa ideia disponibilizar conteúdo público em múltiplos idiomas a
partir de uma url única - isso torna mais fácil para seus usuários (e
para os mecanismos de busca) encontrar o que elees estão procurando no
idioma que eles esperam. Há diversas maneira de se fazer isso, pode ser
com subdomínios específicos de idioma (como http://en.example.com,
http://fra.example.com, etc.) ou usando-se prefixos para a url, como é o
caso deste manual do Cookbook. Você também pode querer pegar a
informação de idioma a partir do user-agent do navegador, entre outras
coisas.

Como mencionado na seção anterior, a exibição de conteúdo localizado é
feita usando-se a função de conveniência \_\_() ou uma das outras
funções de tradução que estão disponíveis globalmente, e provavelmente
elas serão melhor utilizadas em suas views. O primeiro parâmetro da
função é usado como o msgid definido nos arquivos po.

Lembre-se de usar o parêmtro de retorno para os vários métodos ``__*``
se você não quiser que a string seja exibida diretamente (echo interno).
Por exemplo:

::

    <?php
    echo $form->error(
        'Card.cardNumber',
        __("errorCardNumber", true),
        array('escape' => false)
    );
    ?>

Se você gostaria de ter todas as suas mensagens de erro de validação
traduzidas por padrão, uma solução simples poderia ser adicionar o
seguinte código a seu app\_model.php:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }

O tarefa de console i18n não é capaz de determinar o id da mensagem para
o código do trecho acima, o que significa que você vai precisar
adicionar manualmente as entradas para seu arquivo pot (ou através de
seu próprio script). Para previnir a necessidade de editar seu arquivo
default.po(t) a cada vez que a tarefa de console i18n for executada,
você pode usar um domínio diferente como em:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __d('validation_errors', $value, true));
    }

Este trecho irá procurar uma entrada para ``$value`` no arquivo
validation\_errors.po.

Há um outro aspecto sobre localização de sua aplicação que não foi
abordado pelo uso das funções de tradução, que são os formatos de data e
moeda. Não se esqueça de que o CakePHP é PHP :), sendo assim, para
definir o formato para tais coisas você vai precisar usar o
```setlocale`` <http://www.php.net/setlocale>`_.

Se você passar um locale que não exista em seu computador para a função
```setlocale`` <http://www.php.net/setlocale>`_, sua chamada não terá
efeito. Você pode obter a lista de locales disponíveis executando o
comando $ locale -a em um terminal.
