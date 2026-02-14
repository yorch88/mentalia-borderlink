# ===============================
# Config
# ===============================

COMPOSE=docker compose

# ===============================
# Docker lifecycle
# ===============================

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) down -v
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

restart:
	$(COMPOSE) restart

ps:
	$(COMPOSE) ps

# ===============================
# Logs
# ===============================

logs:
	$(COMPOSE) logs -f

logs-api:
	$(COMPOSE) logs -f api

logs-web:
	$(COMPOSE) logs -f web

# ===============================
# Shell access
# ===============================

api:
	$(COMPOSE) exec api sh

web:
	$(COMPOSE) exec web sh

mongo:
	$(COMPOSE) exec mongo mongosh

redis:
	$(COMPOSE) exec redis redis-cli

# ===============================
# Backend helpers
# ===============================

api-shell:
	$(COMPOSE) exec api python

api-migrate:
	$(COMPOSE) exec api alembic upgrade head

api-test:
	$(COMPOSE) exec api pytest

# ===============================
# Cleanup
# ===============================

clean:
	$(COMPOSE) down -v
	docker system prune -f
