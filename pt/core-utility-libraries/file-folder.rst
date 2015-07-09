Folder & File
#############


Os utilitários de Folder(Pasta) e File(Arquivo) são classes convenientes para
ajudar você a escrever/inserir mudanças em arquivos; listar arquivos em uma
pasta e outro diretório comum em tarefas relacionadas.

Usabilidade básica
===========

Garanta que as classes estão sendo carregadas usando :php:meth:`App::uses()`::

    <?php
    App::uses('Folder', 'Utility');
    App::uses('File', 'Utility');

Aqui criamos uma nova instancia de pasta ::

    <?php
    $dir = new Folder('/path/to/folder');

e uma busca por todos arquivos *.ctp* nesta pasta usando regex::

    <?php
    $files = $dir->find('.*\.ctp');


Agora nós podemos percorrer os arquivos e ler ou escrever/adicionar a o conteudo
ou simplesmente deleter o arquivo::

    <?php
    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('I am overwriting the contents of this file');
        // $file->append('I am adding to the bottom of this file.');
        // $file->delete(); // I am deleting this file
        $file->close(); // Be sure to close the file when you're done
    }

Folder API
==========

.. php:class:: Folder(string $path = false, boolean $create = false, string|boolean $mode = false)

::

    <?php
    // Cria uma nova pasta com permissão 0755
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    Caminho para a pasta atual. :php:meth:`Folder::pwd()` irá retornar a mesma
    informação.

.. php:attr:: sort

    Quer ou não os resultados da lista devem ser classificados por nome.

.. php:attr:: mode

    Mode para ser usado quando criar a pasta. Padrão ``0755``. Isto não vale
    para ambientes Windows.

.. php:staticmethod:: addPathElement(string $path, string $element)

    :rtype: string

    Retorna $path com $element adicionado, com a barra correta::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path igual /a/path/for/testing

    $element também pode ser um array::

        $path = Folder::addPathElement('/a/path/for', array('testing', 'another'));
        // $path igual /a/path/for/testing/another

    .. versionadded:: 2.5
        $element aceita um array como parâmetro


.. php:method:: cd(string $path)

    :rtype: string

    Muda o diretório para $path. Retorna falso a o falhar::

        <?php
        $folder = new Folder('/foo');
        echo $folder->path; // Prints /foo
        $folder->cd('/bar');
        echo $folder->path; // Prints /bar
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = array())

    :rtype: boolean
    Muda o mode(Permissão) de uma estrutura de diretórios recursivamente. Isso
    inclui mudança no mode(Permissão) dos arquivos também::

        <?php
        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, array('skip_me.php'));

.. php:method:: copy(array|string $options = array())

    :rtype: boolean

    Copia um diretório recursivamente. O unico parâmetro $options pode ser um
    caminho para copiar ou um array de opções::

        <?php
        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Irá colocar a folder1 e seu conteudo dentro da folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // Realizara um cd() para fazer
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git'),
            'scheme' => Folder::SKIP,  // Ignora diretórios/arquivos que existam.
            'recursive' => true
        ));

    Existem 3 tipos schemes suportados:

    * ``Folder::SKIP`` ignora copiando/movendo arquivos e diretórios caso exista
      na pasta de destino.

    * ``Folder::MERGE`` mescla os diretórios destinatario/destino. Arquivos do
      diretório de origem irá substituir os arquivos no diretório de destino. Os
      conteudos serão mesclados.

    * ``Folder::OVERWRITE``sobreescreve arquivos existentes e diretórios no
      diretório de destino com os arquivos de origem. Se ambos os diretórios
      possuem um mesmo sub-diretório o sub-diretório de origem sera removido
      e o de destino entrara no lugar dele.

    .. versionchanged:: 2.3
        O merge, skip e overwrite schemes foram adicionados para o ``copy()``

.. php:staticmethod:: correctSlashFor(string $path)

    :rtype: string

    Retorna o tipo de barras correto $path ('\\' para Windows e
    '/' para outros).

.. php:method:: create(string $pathname, integer $mode = false)

    :rtype: boolean

   Cria uma estrutura de diretorios recursivamente. Pode ser usado para criar
   dentro de estruturas como `/foo/bar/baz/shoe/horn`::

        <?php
        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // Pastas criadas com sucesso.
        }

.. php:method:: delete(string $path = null)

    :rtype: boolean

    Remove diretórios recursivamente se o sistema permitir::

        <?php
        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Pastas removidas com sucesso.
        }

.. php:method:: dirsize()

    :rtype: integer

    Retorna o tamanho em bytes dessa pasta e seu conteudo.

.. php:method:: errors()

    :rtype: array


    Pega o erro do ultimo método.

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    :rtype: array
   Retorna um array de todos os arquivos correspondentes no diretório atual::

        <?php
        // Busca todos .png na sua app/webroot/img/ pasta e ordena todos os resultados.
        $dir = new Folder(WWW_ROOT . 'img');
        $files = $dir->find('.*\.png', true);
        /*
        Array
        (
            [0] => cake.icon.png
            [1] => test-error-icon.png
            [2] => test-fail-icon.png
            [3] => test-pass-icon.png
            [4] => test-skip-icon.png
        )
        */

.. note::
    Os métodos find e findRecursive irão buscar somente arquivos. Se você deve
    buscar pastas e arquivos veja o método :php:meth:`Folder::read()` ou
    :php:meth:`Folder::tree()`


.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    :rtype: array

    Retorna um array de todos os arquivos correspondentes dentro e abaixo do diretório atual::

        <?php
        // Busca arquivos recursivamente começando pelos arquivos test ou index
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/app/webroot/index.php
            [1] => /var/www/cake/app/webroot/test.php
            [2] => /var/www/cake/app/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/app/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/app/webroot/img/test-error-icon.png
            [5] => /var/www/cake/app/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    :rtype: boolean


    Retorna true se o arquivo está em um CakePath.

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    :rtype: boolean

    Retorna true se o arquivo estiver no caminho::

        <?php
        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/app/ esta em /var/www/example/app/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/app/webroot/ esta em /var/www/example/app/webroot/img/

.. php:staticmethod:: isAbsolute(string $path)

    :rtype: boolean

    Retorna true se o $path e um caminho absoluto.

.. php:staticmethod:: isSlashTerm(string $path)

    :rtype: boolean

    Retorna true se o $path termina com barra::
        <?php
        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    :rtype: boolean


    Retorna true se o $path é um caminho do Windows.

.. php:method:: messages()

    :rtype: array


    Pega as mensagens do ultimo método.

.. php:method:: move(array $options)

    :rtype: boolean

    Move um diretório recursivamente.

.. php:staticmethod:: normalizePath(string $path)

    :rtype: string

    Retorna um conjunto correto de barras para determinado $path ('\\' para
    caminhos Windows e  '/' para outros caminhos).

.. php:method:: pwd()

    :rtype: string


    Retorna o caminho atual.

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    :rtype: mixed

    :param boolean $sort: Se true vai ordenar os resultados.
    :param mixed $exceptions: Um array de nomes de arquivos e pastas para ignorar. Se true ou '.' este metodo vai ignorar arquivos escondidos ou pontos.
    :param boolean $fullPath: Se true vai retornar os resultados usando o caminho absoluto.

    Retorna um array de conteudos do diretório atual.O array retornado possui dois sub arrays: Um com diretórios e um com arquivos::

        <?php
        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, array('files', 'index.php'));
        /*
        Array
        (
            [0] => Array // pastas
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // files
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */

.. php:method:: realpath(string $path)

    :rtype: string

    Pega o caminho real(colocando ".." em uma conta).

.. php:staticmethod:: slashTerm(string $path)

    :rtype: string

    Retorna $path com a barra adicionada para terminação(Correto para Windows ou
    outro OS).

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    :rtype: mixed

    Retorna um array dos diretórios próximos e arquivos em cada diretório.

File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    <?php
    //Cria um arquivos com permissões 0644
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    O objeto Folder do arquivo.

.. php:attr:: name

    O nome do arquivo com a extensão. Difere do
    :php:meth:`File::name()` o qual retorna o nome sem extensão.

.. php:attr:: info

    Um array das informações do arquivo. User :php:meth:`File::info()`.

.. php:attr:: handle

    Detém o recurso manipulador de arquivo, se o arquivo é aberto.

.. php:attr:: lock

    Ativa bloqueio para leitura e escrita de arquivos.
     
.. php:attr:: path

    O caminho absoluto dos arquivos atuais.

.. php:method:: append(string $data, boolean $force = false)

    :rtype: boolean

    Adiciona a seqüência de dados dada ao arquivo atual

.. php:method:: close()

    :rtype: boolean

    Fecha o arquivo atual se estiver aberto.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    :rtype: boolean

    Copia o arquivo para o destino $dest.

.. php:method:: create()

    :rtype: boolean

    Cria um arquivo.

.. php:method:: delete()

    :rtype: boolean

    Deleta um arquivo.

.. php:method:: executable()

    :rtype: boolean

    Retorna true se o arquivo é um executavel.

.. php:method:: exists()

    :rtype: boolean

    Retorna true se o arquivo existir.

.. php:method:: ext()

    :rtype: string

    Retorna a extensão do arquivo.

.. php:method:: Folder()

    :rtype: Folder

    Retorna a pasta atual.

.. php:method:: group()

    :rtype: integer|false

    Retorna o grupo de arquivos, ou falso em caso de erro.

.. php:method:: info()

    :rtype: array

    Retorna as informações do arquivo.

    .. versionchanged:: 2.1
        ``File::info()`` Agora inclui informações de filesize e mimetype.

.. php:method:: lastAccess()

    :rtype: integer|false

    Retorna o ultimo acesso, ou falso em caso de erro.

.. php:method:: lastChange()

    :rtype: integer|false

    Retorna a ultima modificação, ou falso em caso de erro.
    
.. php:method:: md5(integer|boolean $maxsize = 5)

    :rtype: string

    Pega o MD5 Checksum do arquivo com um teste anterior do filesize,ou falso em caso de erro.

.. php:method:: name()

    :rtype: string

    Retorna o nome do arquivo sem extensão.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    :rtype: mixed

    Adiciona ou pega o descolamento do arquivo aberto.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    :rtype: boolean

    Abre o arquivo atual com seu $mode.

.. php:method:: owner()

    :rtype: integer

    Retorna o proprietário do arquivo.

.. php:method:: perms()

    :rtype: string

    Retorna o "chmod" (permissões) do arquivo.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    :rtype: string

    
    Prepara uma string ascii para escrever. Converte o final da linha para
    o terminador correto para a plataforma atual. Para Windows "\r\n" vai
    ser usado, "\n" para todas as plataformas.

.. php:method:: pwd()

    :rtype: string

    Rertorna o caminho completo do arquivo.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    :rtype: string|boolean

    Retorna os conteudos do arquivo atual como string ou retorna falso se falhar.
    
.. php:method:: readable()

    :rtype: boolean

    Retorna true se o arquivo pode ser lido.

.. php:method:: safe(string $name = null, string $ext = null)

    :rtype: string

    Faz o filename ser serguro para ser salvo.

.. php:method:: size()

    :rtype: integer

    Retorna o filesize.

.. php:method:: writable()

    :rtype: boolean

    Retorna true se o arquivo e writable(pode ser escrito).

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    :rtype: boolean

    Escreve os dados no arquivo atual.

.. versionadded:: 2.1 ``File::mime()``

.. php:method:: mime()

    :rtype: mixed

    Pega o mimetype do arquivo, retorna false se falhar.

.. php:method:: replaceText( $search, $replace )

    :rtype: boolean

    Sobrescreve o texto no arquivo. Retorna falso se falhar ou true se
    funcionar.

    .. versionadded::
        2.5 ``File::replaceText()``

.. a ser feito::

    Melhores explicações sobre como usar os metodos de ambas as classes.


.. meta::
    :title lang=en: Folder & File
    :description lang=pt: Os utilitários de Folder(Pasta) e File(Arquivo) são classes convenientes para ajudar você a escrever/inserir mudanças em arquivos; listar arquivos em uma pasta e outro diretório comum em tarefas relacionada.
    :keywords lang=pt: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file,cakephp classe folder, classe file
