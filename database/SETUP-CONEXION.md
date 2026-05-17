# Conectar Node.js con SQL Server (SSMS)

La API usa **ODBC + Windows Authentication** (`msnodesqlv8`) por defecto. Funciona igual que SSMS sin habilitar TCP.

Si usas login `sa` y puerto TCP, habilita TCP como se indica abajo.

---

## Opción A (recomendada): Windows Auth + ODBC

En `server.env`:

```env
DB_SERVER=.\SQLEXPRESS
DB_DATABASE=todo_api
DB_USE_WINDOWS_AUTH=true
DB_ODBC_DRIVER=ODBC Driver 17 for SQL Server
```

Reinicia `npm run dev` y prueba `http://localhost:3000/health/db`.

---

## Opción B: TCP (login sa o puerto fijo)

`sqlcmd` y SSMS pueden conectarse por memoria compartida, pero el driver TCP de Node necesita el protocolo habilitado.

## Paso 1: Habilitar TCP/IP

1. Abre **SQL Server Configuration Manager** (búscalo en el menú Inicio).
2. **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**.
3. Clic derecho en **TCP/IP** → **Enable**.
4. Doble clic en **TCP/IP** → pestaña **IP Addresses**.
5. Al final, en **IPAll**:
   - **TCP Dynamic Ports**: déjalo vacío (borra `0` si aparece).
   - **TCP Port**: `1433`
6. Aceptar.

## Paso 2: Reiniciar SQL Server

En **SQL Server Configuration Manager** → **SQL Server Services** → clic derecho en **SQL Server (SQLEXPRESS)** → **Restart**.

(O en PowerShell como administrador: `Restart-Service MSSQL$SQLEXPRESS`)

## Paso 3: Opcional — SQL Server Browser

Si usas `TEMPPC\SQLEXPRESS` sin puerto fijo, inicia el servicio **SQL Server Browser** (como administrador):

```powershell
Start-Service SQLBrowser
```

Con `DB_PORT=1433` en `server.env` normalmente no hace falta.

## Paso 4: Verificar `server.env`

```env
DB_SERVER=127.0.0.1
DB_PORT=1433
DB_DATABASE=todo_api
DB_USE_WINDOWS_AUTH=true
```

Reinicia la API: `npm run dev`

## Paso 5: Probar

- Navegador: `http://localhost:3000/health/db` → debe decir conexión OK.
- Si falla, revisa que ejecutaste `database/schema.sql` en SSMS.
