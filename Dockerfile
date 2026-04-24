FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl unzip && \
    curl -fsSL https://bun.sh/install | bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.bun/bin:$PATH"

COPY package.json bun.lock* ./
COPY shims/ ./shims/

RUN bun install

COPY tsconfig.json ./
COPY src/ ./src/
COPY data/ ./data/

CMD ["bun", "run", "dev"]
