---
name: database
description: Create and manage Replit's built-in PostgreSQL databases, check status, execute SQL queries with safety checks, and run read-only queries against the production database.
---

# Database Skill

Manage PostgreSQL databases and execute SQL queries safely in your development and production environments.

## When to Use

Use this skill when:

- Creating a new PostgreSQL database for your project
- Checking if a database is provisioned and accessible
- Running SQL queries against the development or production database
- Querying data warehouses (BigQuery, Databricks, Snowflake)

## When NOT to Use

- Schema migrations in production environments
- Direct modifications to Stripe tables (use Stripe API instead)
- Converting a pre-existing database over to Replit, unless a user explicitly asks you to.

## Available Functions

### checkDatabase()

Check if the PostgreSQL database is provisioned and accessible.

**Parameters:** None

**Returns:** Dict with `provisioned` (bool) and `message` (str)

**Example:**

```javascript
const status = await checkDatabase();
if (status.provisioned) {
    console.log("Database is ready!");
} else {
    console.log(status.message);
    // Consider calling createDatabase()
}
```

### createDatabase()

Create or verify a PostgreSQL database exists for the project.

**Parameters:** None

**Returns:** Dict with:

- `success` (bool): Whether operation succeeded
- `message` (str): Status message
- `alreadyExisted` (bool): True if database already existed
- `secretKeys` (list): Environment variables set (DATABASE_URL, PGHOST, etc.)

**Example:**

```javascript
const result = await createDatabase();
if (result.success) {
    console.log(`Database ready! Environment variables: ${result.secretKeys}`);
    // Now you can use DATABASE_URL in your application
}
```

### executeSql()

Execute a SQL query with safety checks.

**Parameters:**

- `sqlQuery` (str, required): The SQL query to execute
- `target` (str, default "replit_database"): Target database: "replit_database", "bigquery", "databricks", or "snowflake"
- `environment` (str, default "development"): "development" runs against the development database (all SQL operations supported). "production" runs READ-ONLY queries against a replica of the production database (only SELECT queries allowed). Production is only supported for the "replit_database" target. "production" database, depending on when the user last deployed, may have outdated schemas.
- `sampleSize` (int, optional): Sample size for warehouse queries (only for bigquery/databricks/snowflake)

**Returns:** Dict with:

- `success` (bool): Whether query succeeded
- `output` (str): Query output/results
- `exitCode` (int): Exit code (0 = success)
- `exitReason` (str | None): Reason for exit if failed

**Example:**

```javascript
// Simple SELECT query
const result = await executeSql({ sqlQuery: "SELECT * FROM users LIMIT 5" });
if (result.success) {
    console.log(result.output);
}

// CREATE TABLE
const result2 = await executeSql({
    sqlQuery: `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2)
        )
    `
});

// INSERT data
const result3 = await executeSql({
    sqlQuery: `
        INSERT INTO products (name, price)
        VALUES ('Widget', 19.99)
    `
});

// Read-only production query
const result4 = await executeSql({
    sqlQuery: "SELECT * FROM users WHERE active = true",
    environment: "production"
});

// Data warehouse query with sampling
const result5 = await executeSql({
    sqlQuery: "SELECT * FROM sales_data WHERE year = 2024",
    target: "bigquery",
    sampleSize: 100
});
```

## Safety Features

1. **Environment Isolation**: Development queries run against the development database; production queries are READ-ONLY against a read replica
2. **Stripe Protection**: Mutations to Stripe schema tables (stripe.*) are blocked
3. **Discussion Mode**: Mutating queries are blocked in Planning/Discussion mode
4. **Destructive Query Protection**: DROP, TRUNCATE, etc. are blocked via the skill callback path (use the tool interface directly for destructive operations that require user confirmation)

## Best Practices

1. **Prefer the built-in database**: Replit's built-in PostgreSQL database is always preferred over external services like Supabase. It supports rollback and integrates directly with the Replit product. Only use external database services if the user has specific requirements. The `pg` package should be installed already.
2. **Check before creating**: Call `checkDatabase()` before `createDatabase()` to avoid unnecessary operations
3. **Use parameterized queries**: Avoid string interpolation for user input
4. **Test queries first**: Run SELECT queries before INSERT/UPDATE/DELETE
5. **Keep backups**: Important data should be backed up before destructive operations

## Environment Variables

After creating a database, these environment variables are available:

- `DATABASE_URL`: Full connection string
- `PGHOST`: Database host
- `PGPORT`: Database port (5432)
- `PGUSER`: Database username
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name

## Example Workflow

```javascript
// 1. Check if database exists
const status = await checkDatabase();

if (!status.provisioned) {
    // 2. Create database
    const createResult = await createDatabase();
    if (!createResult.success) {
        console.log(`Failed: ${createResult.message}`);
    }
}

// 3. Create schema
await executeSql({
    sqlQuery: `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `
});

// 4. Insert data
await executeSql({
    sqlQuery: `
        INSERT INTO users (email)
        VALUES ('user@example.com')
    `
});

// 5. Query data
const result = await executeSql({ sqlQuery: "SELECT * FROM users" });
console.log(result.output);
```

## Limitations

- Production queries are READ-ONLY (SELECT only) — INSERT, UPDATE, DELETE, and DDL statements will fail
- Production environment is only supported for the "replit_database" target (not data warehouses)
- Cannot modify Stripe schema tables (read-only)
- Destructive queries (DROP, TRUNCATE, etc.) are blocked via the skill callback path
- Mutating queries blocked in Planning mode

## Rollbacks

As stated in the diagnostic skills, the development database support rollbacks. Open that skill for more information.
