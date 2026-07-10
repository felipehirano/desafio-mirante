# Desafio Mirante

Aplicacao Angular com foco em:

- consulta e acoes de lotes
- listagem e manutencao de lancamentos
- inclusao de lancamento via modal com validacoes de formulario e buscas auxiliares (conta corrente e evento CSC)

## Resumo rapido

O projeto foi estruturado para separar regras de negocio, interface e reutilizacao de componentes. Atualmente a tela principal apresenta:

- cabecalho com breadcrumb e skip link para acessibilidade
- secao de lotes com filtro, tabela e barra de acoes
- secao de lancamentos com tabela, selecao de linha e acoes
- modal de inclusao de lancamento integrada a dados mockados

## Tecnologias utilizadas

- Angular 17 (standalone components)
- TypeScript 5
- Angular Material (dialog, table, form-field, input, select, button, checkbox, icon)
- Angular Signals (estado local reativo)
- RxJS (Subject, debounce, distinctUntilChanged)
- Reactive Forms e validadores customizados
- SCSS com tokens/variaveis de estilo

## Como executar

### Requisitos

- Node.js 18+
- npm 9+

### Instalacao

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm start
```

Aplicacao disponivel em http://localhost:4200.

## Estrutura do projeto

```text
src/app
	core
	features
		lotes
		lancamentos
	shared
		components
		models
		utils
```

## Decisoes tecnicas e motivos

### 1) Standalone Components em vez de NgModule
Motivo: reduzir boilerplate e facilitar composicao por feature, deixando cada tela/componente com imports explicitos.

### 2) Arquitetura por feature + camada shared
Motivo: manter cada dominio (lotes e lancamentos) isolado, enquanto componentes/utilitarios comuns ficam centralizados para evitar duplicacao.

### 3) Reactive Forms com utilitarios compartilhados
Motivo: padronizar validacao, mensagens de erro e tratamento de input (numerico/monetario), melhorando consistencia e manutencao.

### 4) Signals para estado local de UI
Motivo: simplificar estados pontuais (ex.: item selecionado, flags de validacao, labels dinâmicas) com leitura direta no template e menor sobrecarga.

### 5) RxJS com debounce na busca de conta corrente
Motivo: evitar validacoes a cada tecla e reduzir processamento desnecessario, entregando uma experiencia mais estavel para o usuario.

### 6) Componentes reutilizaveis de interface
Motivo: padronizar comportamento e estilo entre telas, como barra de acoes e paginacao simples, facilitando evolucao do layout.

### 7) Uso de dados mockados nesta fase
Motivo: desacoplar desenvolvimento de front-end da disponibilidade de backend, permitindo validar fluxo e regras de negocio mais cedo.

## Observacoes

- As rotas ainda nao estao sendo usadas como navegacao principal; a composicao atual ocorre diretamente no componente raiz.
- O projeto prioriza tipagem explicita e separacao de responsabilidades entre componentes, servicos/facades e utilitarios.
