ORM Cache Shell
###############

O OrmCacheShell fornece uma ferramenta CLI simples para gerenciar caches de metadados da sua aplicação. Em situações de
implantação, é útil reconstruir o cache de metadados no local sem limpar os dados de cache existentes. Você pode fazer isso
executando::

    bin/cake orm_cache build --connection default
     
Isso irá reconstruir o cache de metadados para todas as tabelas na conexão ``default``. Se você só precisa reconstruir uma
única tabela, você pode fazer isso fornecendo seu nome::
 
    bin/cake orm_cache build --connection default <<Nome>>
     
Além de criar dados em cache, você pode usar o OrmCacheShell para remover metadados em cache também::

    # Limpar todos os metadados
    bin/cake orm_cache clear

    # Limpar uma única tabela de metadados
    bin/cake orm_cache clear <<Nome>>
