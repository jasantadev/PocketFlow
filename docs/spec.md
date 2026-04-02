**Contexto de Negocio**: Esto es un proyecto de gestión de gastos para las finanzas personales de diario, enfocado en jóvenes que quieren llevar un registro y evaluar su economía controlando como fluye su dinero.

**Modelos**: 
1. Movement: Base de la aplicación. El usuario introduce movimientos para registrar gastos e ingresos y así controla el balance de su dinero.

   Campos: tipo=Income/Expense
   owner=FK to User model
   category=FK to category model
   amount=Decimal always >0
   date=user choice
   description=Charfield optional
   created_at=DateTime auto added

2. Category: El usuario crea categorias y un agente de IA autocategoriza los movimientos de los que más adelante se va a sacar información.

    Campos: owner=FK to User model
    title=Charfield
    Desc=Char optional
    monthly_budget=Decimal optional, presupuesto que va menguando con cada gasto

3. User: Modelo de Usuario en el que se centraliza la información, sirve para autenticación y en el frontend servirá para sacar el monto total sumando y restando movimientos:
   
   Campos: email=emailField for autentication
   passwd=NOT IN THE DATABASE, only hashed
    name=CharField name of the user to customize the UX.

**Requerimientos Funcionales**: 
- Registro e inicio de sesión de usuario.
- CRUD de Movimientos de tipo ingreso o gasto para el balance.
- CRUD de Categorias (sólo si es necesario) y categorización automática mediante la IA.

**Reglas de Negocio**: 
- Un usuario no puede ver la información de otro aunque conozca la id
- Un usuario no puede crear/actualizar/borrar información que no sea suya