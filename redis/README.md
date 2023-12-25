# Redis database

## Start

build

```bash
docker build -t deno-scraper-db .
```

run

```bash
docker run -p 6379:6379 deno-scraper-db
```

connect to redis with cli

```bash
redis-cli -h localhost -p 6379
```

Exec into container

```bash
docker exec -it containerId redis-cli
```
