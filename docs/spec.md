**Contexto de Negocio**: Esto es un proyecto de gestión de gastos para las finanzas personales de diario, enfocado en jóvenes que quieren llevar un registro y evaluar su economía controlando como fluye su dinero.

**Modelos**:
1. Movement: Base de la aplicación. El usuario introduce movimientos para registrar gastos e ingresos y así controla el balance de su dinero.

   Campos: tipo=Income/Expense
   owner=FK a usuario autenticado (`auth.users` / `user_id` en PostgreSQL)
   category=FK a categoría del mismo usuario
   amount=Decimal siempre >0 (en UI y API se representa como número positivo; el signo lo determina el tipo)
   date=elección del usuario (en base de datos: `occurred_on` tipo `date`)
   description=opcional
   created_at=fecha/hora automática

   Valores de tipo en persistencia: `income` (ingreso) y `expense` (gasto). Los importes se almacenan como `numeric(14,2)` en EUR para la interfaz actual (formato `es-ES`).

2. Category: El usuario crea categorias y un agente de IA autocategoriza los movimientos de los que más adelante se va a sacar información.

    Campos: owner=FK al mismo usuario (`user_id`)
    title=Charfield
    Desc=Char opcional (`description` en BD)
    monthly_budget=Decimal opcional, presupuesto que va menguando con cada gasto

3. User: Modelo de Usuario en el que se centraliza la información, sirve para autenticación y en el frontend servirá para sacar el monto total sumando y restando movimientos:

   Campos: email=emailField for autentication
   passwd=NOT IN THE DATABASE, only hashed
    name=CharField name of the user to customize the UX.

**Balance total del usuario**: No se persiste como columna en el perfil. Se calcula como **suma de importes de ingresos menos suma de importes de gastos** sobre los movimientos del usuario (misma moneda, EUR en la implementación actual). Cualquier pantalla que muestre el balance debe derivarlo de esa regla o de una agregación SQL equivalente.

**Requerimientos Funcionales**:
- Registro e inicio de sesión de usuario.
- CRUD de Movimientos de tipo ingreso o gasto para el balance.
- CRUD de Categorias (sólo si es necesario) y categorización automática mediante la IA.

**Reglas de Negocio**:
- Un usuario no puede ver la información de otro aunque conozca la id
- Un usuario no puede crear/actualizar/borrar información que no sea suya

**Implementación de aislamiento (Supabase/PostgreSQL)**: Tablas `categories` y `movements` con Row Level Security (RLS) activa; políticas que restringen filas a `auth.uid() = user_id`. Los movimientos solo pueden referenciar categorías del mismo usuario (validado en políticas de inserción/actualización).
