FROM node:26-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_GMAIL_OAUTH_CLIENT_ID

ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_GMAIL_OAUTH_CLIENT_ID=$NEXT_PUBLIC_GMAIL_OAUTH_CLIENT_ID

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npx tsc -p tsconfig.scripts.json

FROM node:26-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/integrations/supabase/migrations ./supabase/migrations
COPY --from=builder /app/dist-scripts ./deployment

EXPOSE 3000

CMD ["npm", "start"]