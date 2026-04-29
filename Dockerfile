# Etapa de Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração do npm e do banco
COPY package*.json ./
COPY prisma ./prisma

# Instala todas as dependências (incluindo devDependencies necessárias para o build)
RUN npm ci

# Copia o resto do código da aplicação
COPY . .

# Gera o build de produção
RUN npm run build

# Etapa de Produção
FROM node:20-alpine AS runner

WORKDIR /app

# Configurações de ambiente otimizadas para produção no Nuxt
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copia apenas os artefatos compilados da etapa anterior
COPY --from=builder /app/.output ./.output

# Nuxt 3 na porta 3000
EXPOSE 3000

# Comando para iniciar o servidor Node.js otimizado do Nitro
CMD ["node", ".output/server/index.mjs"]
