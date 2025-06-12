# Sistema de Gestão JB (Protótipo)

![image](https://github.com/user-attachments/assets/50b08e95-4aa6-4e0f-9040-304396f7a864)


## 📋 Sobre o Projeto

**Sistema de Gestão JB** é um protótipo de um sistema ERP (Enterprise Resource Planning) completo, desenvolvido para pequenos negócios do ramo alimentício, como restaurantes ou marmitarias. A aplicação foi construída utilizando React e Vite, com uma interface limpa e funcional estilizada com CSS puro.

O sistema permite um controle integrado das principais operações do negócio, com diferentes níveis de acesso para cada tipo de usuário (administrador, vendas, financeiro).

---

## ✨ Funcionalidades

O projeto é dividido nos seguintes módulos:

* **📊 Dashboard:** Tela inicial com um resumo geral, alertas de estoque baixo e contas a vencer.
* **📦 Gestão de Estoque:** Cadastro e controle de ingredientes, com gerenciamento de estoque mínimo, custo e fornecedores.
* **🍽️ Fichas Técnicas (Pratos):** Criação de pratos e suas receitas, com cálculo automático de custo, preço de venda sugerido e margem de lucro.
* **🛒 Ponto de Venda (PDV):** Uma interface simples para registrar vendas diárias, que atualiza automaticamente o estoque de ingredientes.
* **💰 Controle Financeiro:** Lançamento de receitas e despesas, com resumo de fluxo de caixa e controle de contas a pagar/receber.
* **👥 Gestão de Clientes:** Cadastro de clientes para controle de vendas a prazo.
* **🔐 Controle de Acesso:** Sistema de login com diferentes permissões baseadas no perfil do usuário.

---

## 🚀 Tecnologias Utilizadas

* **[React](https://react.dev/)**: Biblioteca principal para a construção da interface de usuário.
* **[Vite](https://vitejs.dev/)**: Ferramenta de build extremamente rápida para o desenvolvimento frontend.
* **CSS Puro**: Estilização feita do zero, sem frameworks, para controle total da aparência.
* **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones open-source, leve e personalizável.

---

## ⚙️ Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Crie e configure o projeto Vite**
    *Se você estiver começando do zero, como instruído originalmente:*
    ```bash
    # Cria um projeto React com Vite na pasta atual
    npm create vite@latest . -- --template react
    ```

3.  **Instale as dependências**
    *O projeto utiliza `npm` para gerenciamento de pacotes.*
    ```bash
    npm install
    ```

4.  **Instale os ícones**
    *A biblioteca `lucide-react` é usada para todos os ícones da interface.*
    ```bash
    npm install lucide-react
    ```
    *(Nota: Este passo já está incluso no `npm install` se o `lucide-react` estiver no `package.json`).*

5.  **Execute o servidor de desenvolvimento**
    *Este comando iniciará a aplicação em modo de desenvolvimento, geralmente em `http://localhost:5173`.*
    ```bash
    npm run dev
    ```

A aplicação deve abrir automaticamente em seu navegador.

---

## 🧑‍💻 Usuários de Teste

Para testar os diferentes níveis de acesso, utilize as seguintes credenciais:

| Perfil      | Usuário      | Senha         |
| :---------- | :----------- | :------------ |
| **Admin** | `admin`      | `admin123`    |
| **Vendas** | `vendas`     | `vendas123`   |
| **Financeiro**| `financeiro` | `financeiro123`|

---

## ⚠️ Atenção

Este é um projeto de prototipagem para fins de estudo e demonstração. **Os dados inseridos na aplicação são salvos apenas em memória (estado do React) e serão perdidos ao recarregar a página.** Não há integração com banco de dados.
