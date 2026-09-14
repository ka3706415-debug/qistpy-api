FROM node:20-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl python3 make g++ libaio1 wget unzip

# ---------- Oracle Instant Client (Linux, Thick mode) ----------
RUN mkdir -p /opt/oracle && \
    wget -q https://download.oracle.com/otn_software/linux/instantclient/1923000/instantclient-basiclite-linux.x64-19.23.0.0.0dbru.zip -O /opt/oracle/ic.zip && \
    unzip -q /opt/oracle/ic.zip -d /opt/oracle && \
    rm /opt/oracle/ic.zip

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_23:$LD_LIBRARY_PATH
ENV ORACLE_CLIENT_LIB_DIR=/opt/oracle/instantclient_19_23

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

RUN pnpm install --no-frozen-lockfile --ignore-scripts

COPY apps/api/ ./apps/api/

RUN cd apps/api && npx prisma generate --schema=./prisma/schema.prisma

RUN cd node_modules/.pnpm/bcrypt@5.1.1_encoding@0.1.13/node_modules/bcrypt && npm rebuild bcrypt --build-from-source 2>/dev/null || npx node-pre-gyp install --fallback-to-build

WORKDIR /app/apps/api

RUN npx nest build

EXPOSE 3000

CMD ["node", "dist/main.js"]