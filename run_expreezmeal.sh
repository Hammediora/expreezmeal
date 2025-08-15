#!/bin/bash

# Usage: MODE=dev ./run_expreezmeal.sh
# or:    MODE=prod ./run_expreezmeal.sh

MODE=${MODE:-dev}

if [ "$MODE" = "prod" ]; then
    echo "Running production containers..."
    docker compose -f docker-compose.yml up -d
else
    echo "Running development containers..."
    docker compose down
    docker compose -f docker-compose.dev.yml up -d
fi
