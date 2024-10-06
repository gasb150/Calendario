# Salir inmediatamente si un comando falla
$ErrorActionPreference = "Stop"

# Definir colores para la salida
$GREEN = "`e[32m"
$RED = "`e[31m"
$NC = "`e[0m" # No Color

# Función para manejar errores
function ErrorHandler {
    param (
        [string]$LineNumber,
        [string]$Command
    )
    Write-Host "${RED}Error en la línea $LineNumber: $Command${NC}"
    exit 1
}

# Registrar el manejador de errores
trap {
    ErrorHandler $_.InvocationInfo.ScriptLineNumber $_.InvocationInfo.MyCommand
}

Write-Host "${GREEN}Iniciando el script de configuración...${NC}"

# 1. Instalación de dependencias
Write-Host "${GREEN}Instalando dependencias...${NC}"
go mod tidy
npm install --prefix frontend

# 2. Configuración de variables de entorno
Write-Host "${GREEN}Configurando variables de entorno...${NC}"
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "${GREEN}Archivo .env creado a partir de .env.example${NC}"
} else {
    Write-Host "${GREEN}Archivo .env ya existe${NC}"
}

# 3. Migración de la base de datos
Write-Host "${GREEN}Migrando la base de datos...${NC}"
go run cmd/migrate.go

# 4. Inicialización de servicios
Write-Host "${GREEN}Inicializando servicios...${NC}"
Start-Process -NoNewWindow -FilePath "go" -ArgumentList "run cmd/main.go"

Write-Host "${GREEN}Configuración completada.${NC}"