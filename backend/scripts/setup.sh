#!/bin/bash

# Salir inmediatamente si un comando falla
set -e

# Definir colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para manejar errores
error_handler() {
    echo -e "${RED}Error en la línea $1: $2${NC}"
    exit 1
}

# Registrar el manejador de errores
trap 'error_handler ${LINENO} "$BASH_COMMAND"' ERR

echo -e "${GREEN}Iniciando el script de configuración...${NC}"

# 1. Instalación de dependencias
echo -e "${GREEN}Instalando dependencias...${NC}"
go mod tidy
npm install --prefix frontend

# 2. Configuración de variables de entorno
echo -e "${GREEN}Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}Archivo .env creado a partir de .env.example${NC}"
else
    echo -e "${GREEN}Archivo .env ya existe${NC}"
fi

# 3. Migración de la base de datos
echo -e "${GREEN}Migrando la base de datos...${NC}"
go run cmd/migrate.go

# 4. Inicialización de servicios
echo -e "${GREEN}Inicializando servicios...${NC}"
go run cmd/main.go &

echo -e "${GREEN}Configuración completada.${NC}"