Manipulação de Erros
####################

No caso de um erro irrecuperável em sua aplicação, é comum para o
processamento e mostrar uma página de erro ao usuário. Para poupar-lhe o
trabalho de ter código de manipulação de erros para isto em cada um de
seus controllers e componentes, você pode usar o método disponível no
CakePHP:

``$this->cakeError(string $errorType [, array $parameters]);``

Chamar este método irá exibir uma página de erro ao usuário e
interromper qualquer processamento subsequente em sua aplicação.

``parameters`` deve ser um array de strings. Se este array contiver
objetos (incluindo objetos do tipo Exception), eles serão convertidos em
strings.

O CakePHP predefine um conjunto de tipos de erro, mas no momento em que
este manual era escrito, a maioria é utilizada apenas pelo próprio
framework. Um dos mais úteis para o programador em geral pode ser o bom
e velho erro 404. Este erro pode ser disparado chamando-se o método
desta forma:

::

    $this->cakeError('error404');

Ou, alternativamente, você pode fazer com que a página que reporte o
erro esteja em uma URL específica passando o parâmetro ``url``:

::

    $this->cakeError('error404', array('url' => 'alguma/outra.url'));

Pode ser um pouco mais útil ao estender o manipulador de erros para
incluir tratamento para tipos de erros definidos pelo programador.
Manipuladores de erro de aplicação são semelhantes a ações em um
controller; você normamente passa parâmetros com o método set() que
estarão disponível na view e então renderiza o arquivo da view a partir
do diretório ``app/views/errors``.

Crie um arquivo ``app/app_error.php`` com o seguinte conteúdo.

::

    <?php
    class AppError extends ErrorHandler {
    }   
    ?>

Manipuladores para novos tipos de erro podem ser implementados
adicionando-se métodos nesta classe. Simplesmente crie um novo método
com o nome que você quiser usar como seu tipo de erro.

Digamos que temos uma aplicação que escreve alguns arquivos para o disco
e que seja adequado reportar erros de gravação para o usuário. Não
queremos incluir o código para fazer isto em todas as diversas partes de
nossa aplicação, então é uma boa oportunidade de usar um novo tipo de
erro.

Adicione um novo método em sua classe ``AppError``. Vamos incluir um
parâmetro chamado ``file`` que será o caminho do arquivo cuja escrita
teve problemas.

::

    function cannotWriteFile($params) {
      $this->controller->set('file', $params['file']);
      $this->_outputMessage('cannot_write_file');
    }

Crie a view em ``app/views/errors/cannot_write_file.ctp``

::

    <h2>Erro ao gravar no arquivo</h2>
    <p>Não foi possível gravar o arquivo <?php echo $file ?> para o disco.</p>

...e lance o erro em seu controller/componente

::

    $this->cakeError('cannotWriteFile', array('file'=>'somefilename')); 

A implementação padrão de ``$this->_outputMessage(<view-filename>)`` irá
apenas mostrar a view em ``views/errors/<view-filename>.ctp``. Se você
quiser sobrescrever este comportamento, você também pode redefinir o
método ``_outputMessage($template)`` em sua classe AppError.
