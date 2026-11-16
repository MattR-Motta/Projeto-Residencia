# Assistente IA local

## Configuração
1. Instale as dependências do projeto: `npm install`.
2. Copie `.env.example` para `.env.local`.
3. Informe sua chave em `GEMINI_API_KEY` no `.env.local`.
4. Execute `npm run dev:ia`.
5. Acesse o endereço local exibido pelo Vite (normalmente http://localhost:5173).

O comando inicia o servidor Node.js na porta 3001 e o Vite na porta 5173. O Vite encaminha `/api/chatbot` ao servidor local. A chave Gemini fica somente no servidor e não deve receber prefixo `VITE_` nem ser enviada ao Git.

## Observação importante
Esta integração é uma primeira versão de demonstração. O perfil é informado pelo frontend e ainda não existe autenticação/autorização confiável no servidor. Portanto, não utilize dados reais ou sensíveis: a validação efetiva de permissões exige autenticação e regras aplicadas no backend.
