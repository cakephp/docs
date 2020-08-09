Pasta & Arquivo
###############

.. php:namespace:: Cake\Filesystem

Os utilitários de pasta e arquivo são classes convenientes para ajudá-lo a ler 
e gravar/anexar arquivos, listar arquivos dentro de uma pasta e outras tarefas 
comuns relacionadas ao diretório.

.. deprecated:: 4.0
    As classes ``File`` e ``Folder`` serão removidas na 5.0. 
    Use classes SPL como ``SplFileInfo`` ou ``SplFileObject`` e classes iterator 
    como ``RecursiveDirectoryIterator``, ``RecursiveRegexIterator`` etc.

Uso Básico
==========

Certifique-se de que as classes estejam carregadas::

    use Cake\Filesystem\Folder;
    use Cake\Filesystem\File;

Com isso podemos configurar uma nova instância da pasta::

    $dir = new Folder('/path/to/folder');

e então pesquise todos os arquivos *.php* dentro dessa pasta usando regex::

    $files = $dir->find('.*\.php');

Agora podemos percorrer os arquivos e ler ou escrever/anexar ao 
conteúdo ou simplesmente excluir o arquivo::

    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('Estou substituindo o conteúdo deste arquivo');
        // $file->append('Estou adicionando ao final deste arquivo.');
        // $file->delete(); // Estou excluindo este arquivo
        $file->close(); // Certifique-se de fechar o arquivo quando terminar
    }

API Pastas
==========

.. php:class:: Folder(string $path = false, boolean $create = false, string|boolean $mode = false)

::

    // Cria uma nova pasta com as permissões 0755
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    Caminho da pasta atual. :php:meth:`Folder::pwd()` retornará a mesma informação.

.. php:attr:: sort

    Se os resultados da lista devem ou não ser classificados por nome.

.. php:attr:: mode

    Modo a ser usado ao criar pastas. O padrão é ``0755``. Não faz nada em máquinas Windows.

.. php:staticmethod:: addPathElement(string $path, string $element)

    Retorna $path com $elemento adicionado, com a barra correta::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path é igual a /a/path/for/testing

    $element também pode ser um array::

        $path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
        // $path é igual a /a/path/for/testing/another

.. php:method:: cd( $path )

    Mude o diretório para $path. Retorna ``false`` em caso de falha::

        $folder = new Folder('/foo');
        echo $folder->path; // Exibe /foo
        $folder->cd('/bar');
        echo $folder->path; // Exibe /bar
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

    Altere o modo em uma estrutura de diretório recursivamente. Isso inclui 
    alterar o modo dos arquivos também::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, ['skip_me.php']);

.. php:method:: copy(array|string $options = [])

    Copie recursivamente um diretório. O único parâmetro $options pode ser 
    um caminho para a cópia ou um conjunto de opções::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Colocará a pasta1 e todo o seu conteúdo na pasta2

        $folder = new Folder('/path/to/folder');
        $folder->copy([
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // Irá causar a ocorrência de um cd()
            'mode' => 0755,
            'skip' => ['skip-me.php', '.git'],
            'scheme' => Folder::SKIP  // Pule diretórios/arquivos que já existem.
        ]);

    Existem 3 esquemas suportados:

    * ``Folder::SKIP`` pule a cópia/movimentação de arquivos e diretórios 
      que existem no diretório de destino.
    * ``Folder::MERGE`` mescla os diretórios de origem/destino. Os arquivos no diretório de origem 
      substituirão os arquivos no diretório de destino. O conteúdo do diretório será mesclado.
    * ``Folder::OVERWRITE`` sobrescreve os arquivos e diretórios existentes no diretório de destino pelos do 
      diretório de origem. Se ambos contiverem o mesmo subdiretório, o conteúdo do diretório 
      de destino será removido e substituído pelo de origem.

.. php:staticmethod:: correctSlashFor(string $path)

    Retorna um conjunto correto de barras para o $path 
    fornecido ('\\' para caminhos do Windows e '/' para outros caminhos).

.. php:method:: create(string $pathname, integer $mode = false)

    Crie uma estrutura de diretório recursivamente. Pode ser usado para 
    criar estruturas de caminho mais profundo como `/foo/bar/baz/shoe/horn`::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // As pastas aninhadas foram criadas com sucesso
        }

.. php:method:: delete(string $path = null)

    Remova diretórios recursivamente se o sistema permitir::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Foo foi excluído com sucesso e também suas pastas aninhadas
        }

.. php:method:: dirsize()

    Retorna o tamanho em bytes desta pasta e seu conteúdo.

.. php:method:: errors()

    Obtenha o erro do método mais recente.

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    Retorna uma matriz de todos os arquivos correspondentes no diretório atual::

        // Encontre todos os .png em sua pasta webroot/img/ e classifique os resultados
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

    Os métodos find e findRecursive da pasta só encontrarão arquivos. Se você 
    gostaria de obter pastas e arquivos, consulte :php:meth:`Folder::read()` ou
    :php:meth:`Folder::tree()`

.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    Retorna uma matriz de todos os arquivos correspondentes dentro e abaixo do diretório atual::

        // Encontre arquivos recursivamente começando com teste ou índice
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/webroot/index.php
            [1] => /var/www/cake/webroot/test.php
            [2] => /var/www/cake/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/webroot/img/test-error-icon.png
            [5] => /var/www/cake/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    Retorna ``true`` se o arquivo está em um determinado CakePath.

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    Retorna ``true`` se o arquivo está no caminho fornecido::

        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = false, /var/www/example/src/ não está em /var/www/example/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/webroot/img/ está em /var/www/example/webroot/

.. php:staticmethod:: isAbsolute(string $path)

    Retorna ``true`` se o $path fornecido for um caminho absoluto.

.. php:staticmethod:: isSlashTerm(string $path)

    Retorna ``true`` se o $path termina em uma barra (ou seja, termina com uma barra)::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    Retorna ``true`` se o $path fornecido for um caminho do Windows.

.. php:method:: messages()

    Obtenha as mensagens do método mais recente.

.. php:method:: move(array $options)

    Move recursivamente o diretório.

.. php:staticmethod:: normalizeFullPath(string $path)

    Retorna um caminho com barras normalizadas para o sistema operacional.

.. php:method:: pwd()

    Retorna o caminho atual

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    Retorna uma matriz do conteúdo do diretório atual. A matriz retornada contém 
    duas submatrizes e uma de diretórios e uma de arquivos::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, ['files', 'index.php']);
        /*
        Array
        (
            [0] => Array // Folders
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // Files
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */

.. php:method:: realpath(string $path)

    Pegue o caminho real (levando ".." em consideração).

.. php:staticmethod:: slashTerm(string $path)

    Retorna $path com barra de terminação adicionada (corrigido para 
    Windows ou outro sistema operacional).

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    Retorna uma matriz de diretórios e arquivos aninhados em cada diretório.

API de Arquivos
===============

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    // Cria um novo arquivo com as permissões 0644
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    O objeto Folder do arquivo.

.. php:attr:: name

    O nome do arquivo com a extensão. É diferente de :php:meth:`File::name()` que retorna o nome sem a extensão.

.. php:attr:: info

    Uma matriz de informações do arquivo. Ao invés disso use :php:meth:`File::info()`.

.. php:attr:: handle

    Contém o recurso de manipulador de arquivo se o arquivo for aberto.

.. php:attr:: lock

    Habilite o bloqueio para leitura e gravação de arquivos.

.. php:attr:: path

    O caminho absoluto do arquivo atual.

.. php:method:: append(string $data, boolean $force = false)

    Anexe a string de dados fornecida ao arquivo atual.

.. php:method:: close()

    Fecha o arquivo atual se estiver aberto.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    Copie o arquivo para o caminho absoluto ``$dest``.

.. php:method:: create()

    Cria o arquivo.

.. php:method:: delete()

    Apaga o arquivo;

.. php:method:: executable()

    Returna ``true`` se o arquivo for executável

.. php:method:: exists()

    Retorna ``true`` se o arquivo existe.

.. php:method:: ext()

    Retorna a extensão do arquivo.

.. php:method:: Folder()

    Retorna a pasta atual.

.. php:method:: group()

    Retorna o grupo do arquivo, ou ``false`` em caso de erro.

.. php:method:: info()

    Retorna as informações do arquivo.

.. php:method:: lastAccess( )

    Retorna a hora do último acesso.

.. php:method:: lastChange()

    Retorna a hora da última modificação ou ``false`` em caso de erro.

.. php:method:: md5(integer|boolean $maxsize = 5)

    Obtenha o MD5 Checksum do arquivo com a verificação anterior do 
    tamanho do arquivo, ou ``false`` no caso de um erro.

.. php:method:: name()

    Retorna o nome do arquivo sem extensão.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    Define ou obtém o deslocamento do arquivo aberto no momento.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    Abre o arquivo atual com o $mode fornecido.

.. php:method:: owner()

    Retorna o proprietário do arquivo.

.. php:method:: perms()

    Retorna o "chmod" (permissões) do arquivo.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    Prepara uma string ascii para escrita. Converte as terminações de linha no terminador 
    correto para a plataforma atual. Para Windows, será usado "\\r\\n", 
    para todas as outras plataformas "\\ n".

.. php:method:: pwd()

    Retorna o caminho completo do arquivo.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    Retorne o conteúdo do arquivo atual como uma string ou retorne ``false`` em caso de falha.

.. php:method:: readable()

    Retorna ``true`` se o arquivo é legível.

.. php:method:: safe(string $name = null, string $ext = null)

    Torna o nome do arquivo seguro para salvar.

.. php:method:: size()

    Retorna o tamanho do arquivo em bytes.

.. php:method:: writable()

    Retorna ``true`` se o arquivo for gravável.

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    Grave os dados fornecidos no arquivo atual.

.. php:method:: mime()

    Pega o tipo MIME do arquivo, retorna ``false`` em caso de falha.

.. php:method:: replaceText( $search, $replace )

    Substitui o texto em um arquivo. Retorna ``false`` em caso de falha e ``true`` em caso de sucesso.

.. todo::

    Explique melhor como usar cada método com ambas as classes.

.. meta::
    :title lang=pt: Pasta & Arquivo
    :description lang=pt: Os utilitários de pasta e arquivo são classes convenientes para ajudá-lo a ler, escrever e anexar a arquivos; listar arquivos dentro de uma pasta e outras tarefas comuns relacionadas ao diretório.
    :keywords lang=pt: arquivo,pasta,utilitario cakephp,ler arquivo,escrever arquivo,anexar arquivo,copia recursiva,opcoes de copia,caminho de pasta,classe de pasta,arquivo php,mudar de diretorio,utilitario de arquivo,nova pasta,estrutura de diretorio,apagar arquivo
