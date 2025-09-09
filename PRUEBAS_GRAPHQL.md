# PRUEBAS COMPLETAS DEL SISTEMA DE SECURITY
# Copia estas consultas en GraphQL Playground: http://localhost:3001/graphql

## 1. VERIFICAR SCHEMA - Buscar tipos Security
query IntrospectionSecurity {
  __schema {
    types {
      name
      description
    }
  }
}

## 2. VERIFICAR MUTATIONS DISPONIBLES
query AvailableMutations {
  __schema {
    mutationType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}

## 3. VERIFICAR QUERIES DISPONIBLES  
query AvailableQueries {
  __schema {
    queryType {
      fields {
        name
        description
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}

## 4. REGISTRAR USUARIO (PRIMER PASO)
mutation Register {
  register(input: {
    email: "test@security-test.com"
    password: "password123"
    firstName: "Test"
    lastName: "Security"
  }) {
    success
    message
    user {
      id
      email
      firstName
      lastName
    }
    token
  }
}

## 5. LOGIN (OBTENER TOKEN)
mutation Login {
  login(input: {
    email: "test@security-test.com"
    password: "password123"
  }) {
    success
    message
    user {
      id
      email
      firstName
      lastName
    }
    token
  }
}

## 6. CREAR EMPRESA (REQUERIDO PARA SECURITY)
# Nota: Usar el token del login en Headers: {"Authorization": "Bearer TOKEN_AQUI"}
mutation CreateCompany {
  createCompany(input: {
    name: "Security Test Corp"
    domain: "security-test.com"
  }) {
    success
    message
    company {
      id
      name
      domain
    }
  }
}

## 7. CREAR ASSET (DOMINIO PARA ESCANEAR)
mutation CreateAsset {
  createAsset(input: {
    domain: "google.com"
    companyId: "COMPANY_ID_AQUI"
  }) {
    success
    message
    asset {
      id
      domain
      isActive
    }
  }
}

## 8. INICIAR ESCANEO DE SECURITY ⭐ (PRUEBA PRINCIPAL)
mutation StartSecurityScan {
  startSecurityScan(input: {
    assetId: "ASSET_ID_AQUI"
  }) {
    success
    message
    scanId
    healthScore
    findings {
      id
      category
      severity
      title
      description
      recommendation
      status
    }
  }
}

## 9. OBTENER ÚLTIMO ESCANEO
query GetLatestScan {
  getLatestSecurityScan(assetId: 1) {
    success
    message
    scanId
    healthScore
    findings {
      id
      category
      severity
      title
      description
      recommendation
      status
    }
  }
}

## 10. OBTENER HISTORIAL DE ESCANEOS
query GetScanHistory {
  getSecurityScanHistory(assetId: 1, limit: 5) {
    id
    assetId
    healthScore
    findingsCount
    criticalFindings
    highFindings
    mediumFindings
    lowFindings
    status
    createdAt
  }
}

## 11. ACTUALIZAR ESTADO DE FINDING
mutation UpdateFindingStatus {
  updateFindingStatus(
    findingId: "FINDING_ID_AQUI"
    status: "IN_PROGRESS"
  )
}

# INSTRUCCIONES:
# 1. Abrir GraphQL Playground: http://localhost:3001/graphql
# 2. Ejecutar consultas 1-3 para verificar schema
# 3. Ejecutar mutación 4 (Register) 
# 4. Ejecutar mutación 5 (Login) y copiar el token
# 5. En Headers agregar: {"Authorization": "Bearer TOKEN_COPIADO"}
# 6. Ejecutar mutaciones 6-7 (Company y Asset)
# 7. Ejecutar mutación 8 ⭐ (StartSecurityScan) - PRUEBA PRINCIPAL
# 8. Ejecutar queries 9-11 para ver resultados
