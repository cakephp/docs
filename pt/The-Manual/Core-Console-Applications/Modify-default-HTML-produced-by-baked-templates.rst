Alterando o HTML produzido pelos templates "bakeados"
#####################################################

Se voce quer modificar o layout padrão de saída HTML produzido pelo
comando "bake", siga estes passos:

**Para views específicas:**

#. Abra a pasta: cake/console/libs/templates/views
#. Note os 4 arquivos presentes
#. Copie os arquivos para: app/vendors/shells/templates/views
#. Faça as alterações desejadas na saída HTML a ser gerada pelo "bake".

**Para projetos específicos:**

#. Abra a pasta: cake/console/libs/templates/skel
#. Note que os arquivos básicos da aplicação se encontram aqui
#. Copie os arquivos para: app/vendors/shells/templates/skel
#. Faça as alterações desejadas na saída HTML a ser gerada pelo "bake".
#. Inclua o parâmetro com o caminho dos arquivos de template (skel) para
   a tarefa "project" do bake

   ::

       cake bake project -skel vendors/shells/templates/skel

Notas

-  Você precisa executar a tarefa específica (no caso, "project")
   ``cake bake project`` para poder informar o parâmetro com o caminho
   dos arquivos.
-  O caminho dos templates é relativo ao diretório atual em que você
   estiver na linha de comando.
-  Uma vez é necessário informar o caminho completo para os arquivos de
   template, você pode especificar qualquer diretório que contenha tais
   arquivos, podendo até mesmo usar múltiplos templates. (Pelo menos
   enquanto o Cake ainda não sobrescreve uma pasta skel da aplicação, da
   mesma forma como faz para views)

