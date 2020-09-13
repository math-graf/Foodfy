# Foodfy
O Foodfy é uma aplicação que possibilita aos chefs publicarem suas receitas e demonstrarem seus dotes culinários para o mundo. O site apresenta as receitas de maneira detalhada e explicativa, relacionando os ingredientes com o modo de preparo e informações adicionais pertinentes.

O Foodfy é o projeto de conclusão para o curso LaunchBase da Rocketseat.

## Instruções


### Banco de dados
O banco de dados da aplicação pode ser criado rodando as queries do arquivo **database.sql**. Foi utilizado o PostgreSQL para o desenvolvimento do projeto.

### Dependências
A aplicação possui algumas dependências que podem ser instaladas utilizando o comando **npm install**.

### Iniciando o servidor
Utilize o comando **node src/server.js** para iniciar o servidor no endereço **localhost:5000**. 

Originalmente o projeto deveria ser desenvolvido utilizando **nodemon** e **browser-sync** mas foi optado por não utilizar. Se o ambiente de desenvolvimento precisar, as dependências podem ser instaladas e a porta para o **nodemailer** deve ser atualizada com a porta de proxy do **browser-sync**.

### Criando um administrador
Para acessar todas as funções de cadastro e edição de receitas, chefs e usuários você precisa estar logado com uma conta de administrador. Para fins de teste, o aplicativo utiliza o **nodemailer** e o **https://mailtrap.io/** para autenticação dos usuários. Crie uma conta ou faça login em uma existente no mailtrap e copie as informações necessárias para fazer a integração com o nodemailer na pasta **src/lib/mailer**.

Utilize a rota **/admin/users/create** e cadastre um usuário como administrador, marcando a opção no formulário. Você receberá um e-mail pelo **mailtrap** com a senha da conta cadastrada que poderá ser alterada em "Esqueceu sua senha?" na tela de login.
