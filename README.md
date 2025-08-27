Documentação do CakePHP 5.x
=====================

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgreen.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Build Status](https://github.com/cakephp/docs/actions/workflows/ci.yml/badge.svg?branch=4.x)](https://github.com/cakephp/docs/actions/workflows/ci.yml)

---

## Objetivo

- Traduzir para português e atualizar os exemplos de código da documentação oficial do CakePHP 5.x
- Enviar os arquivos atualizados para o repositório oficial

## Metodologia

### Execução

**Docker**

> Build da imagem

```
docker build -t cakephp/docs .
```

> Atualização da documentação

```
docker run -it --rm -v $(pwd):/data cakephp/docs make html
```

**PHP**

> Servidor para validação

```
php -S localhost:8020
```

**GIT**

> Padrão de commit

```
[refact]: translated (pt/index) + cakephp and PHP versions

# ou

[refact]: translated (pt/controllers/components)
```

---

### Validação

- Verificar em todos os idiomas os exemplos de código
- Verificar a tradução com a versão oficial
- Verificar a tradução com a versão 4.x

---

## Status

Arquivo | Status | Finalizado
-- | -- | --
pt/index | concluído | 27/08/2025
pt/intro | em andamento | 