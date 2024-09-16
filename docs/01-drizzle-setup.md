# 01: Drizzle Setup

Welcome to the first section of our tutorial! In this exercise, you'll set up Drizzle ORM to define your database schema for the Wordle clone. This process is similar to creating entity classes in Java using JPA in Spring Boot.

## Exercise Objectives

- **Set up** Drizzle ORM in your project.
- **Define** the `games` and `guesses` tables in `src/server/db/schema.ts`.
- **Establish** relationships between tables using Drizzle's relation functions.
- **Prepare** your schema for use in the database.

---

## Tasks and Hints

### 1. Set Up Imports and Create a Table Creator Function

**Task:** In `src/server/db/schema.ts`, import the necessary modules from Drizzle ORM and create a table creator function to prefix your table names.

**Hints:**

- **Imports:**

  - Import `relations` and `sql` from `"drizzle-orm"`.
  - Import column types like `int` and `text` from `"drizzle-orm/sqlite-core"`.

- **Table Creator:**
  - Use `sqliteTableCreator` to create a function that prefixes your table names.
  - This is similar to specifying a custom table name in JPA using `@Table(name = "custom_name")`.

**Example:**

```typescript
// src/server/db/schema.ts

// Import necessary functions and types
import { relations, sql } from "drizzle-orm";
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

// Create a table creator function that adds a prefix to table names
export const createTable = sqliteTableCreator((name) => `your_prefix_${name}`);
```

_Replace `"your_prefix_"` with your desired table name prefix.\_

**Helpful Links:**

- [Drizzle ORM Documentation - SQLite Table Creator](https://orm.drizzle.team/docs/sqlite-core#sqlitetablecreator)
- [Drizzle ORM Documentation - Column Types](https://orm.drizzle.team/docs/sqlite-core#column-types)
- [Understanding Table Naming Conventions](https://www.sqlshack.com/sql-table-naming-conventions/)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
import { relations, sql } from "drizzle-orm";
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator(
  (name) => `nextjs-wordle-dev-day_${name}`,
);
```

</details>

---

### 2. Define the `games` Table

**Task:** In `src/server/db/schema.ts`, define the `games` table with appropriate fields and constraints.

**Hints:**

- **Fields to Include:**

  - `id`: Auto-incrementing primary key.
  - `word`: Non-null text field with a length of 5.
  - `status`: Non-null text field that only allows specific values (e.g., "in_progress", "won", "lost").
  - `createdAt` and `updatedAt`: Timestamp fields that automatically handle creation and update times.

- **Drizzle ORM Functions:**

  - Use `int` and `text` to define column types.
  - Use methods like `.primaryKey({ autoIncrement: true })`, `.notNull()`, and `.default()` to set constraints and defaults.
  - For `status`, consider how to restrict values to a specific set, similar to an enum.

- **Analogous JPA Annotations:**
  - `@Id` and `@GeneratedValue` for the primary key.
  - `@Column(nullable = false, length = 5)` for text fields.
  - `@Enumerated(EnumType.STRING)` for the `status` field.
  - `@CreationTimestamp` and `@UpdateTimestamp` for timestamp fields.

**Example:**

```typescript
// src/server/db/schema.ts

// Define the 'games' table structure
export const games = createTable("game", {
  // Define the 'id' field as an auto-incrementing primary key
  id: /* ... */,

  // Define the 'word' field as a non-null text field with length 5
  word: /* ... */,

  // Define the 'status' field with specific allowed values
  status: /* ... */,

  // Define 'createdAt' and 'updatedAt' fields for timestamps
  createdAt: /* ... */,
  updatedAt: /* ... */,
});
```

**Helpful Links:**

- [Drizzle ORM Documentation - Column Definitions](https://orm.drizzle.team/docs/sqlite-core#column-types)
- [Defining Enums in Drizzle ORM](https://orm.drizzle.team/docs/enums)
- [Drizzle ORM Documentation - Default Values and Constraints](https://orm.drizzle.team/docs/default-values)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
export const games = createTable("game", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  word: text("word", { length: 5 }).notNull(),
  status: text("status", { enum: ["in_progress", "won", "lost"] }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date())
    .notNull(),
});
```

</details>

---

### 3. Define the `guesses` Table

**Task:** In `src/server/db/schema.ts`, define the `guesses` table and set up a foreign key relationship with the `games` table.

**Hints:**

- **Fields to Include:**

  - `id`: Auto-incrementing primary key.
  - `gameId`: Foreign key referencing the `id` field in the `games` table.
  - `guess` and `result`: Non-null text fields with a length of 5.
  - `createdAt` and `updatedAt`: Timestamp fields similar to those in the `games` table.

- **Establishing Relationships:**
  - Use `.references(() => games.id)` to set up the foreign key constraint on `gameId`.
  - This is analogous to using `@ManyToOne` and `@JoinColumn` in JPA.

**Example:**

```typescript
// src/server/db/schema.ts

// Define the 'guesses' table structure
export const guesses = createTable("guess", {
  // Define the 'id' field as an auto-incrementing primary key
  id: /* ... */,

  // Define the 'gameId' field as a foreign key referencing 'games.id'
  gameId: /* ... */,

  // Define the 'guess' and 'result' fields
  guess: /* ... */,
  result: /* ... */,

  // Define 'createdAt' and 'updatedAt' fields for timestamps
  createdAt: /* ... */,
  updatedAt: /* ... */,
});
```

**Helpful Links:**

- [Drizzle ORM Documentation - Foreign Keys](https://orm.drizzle.team/docs/foreign-keys)
- [Understanding Relationships in SQL](https://www.w3schools.com/sql/sql_foreignkey.asp)
- [Drizzle ORM Documentation - Column Definitions](https://orm.drizzle.team/docs/sqlite-core#column-types)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
export const guesses = createTable("guess", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  gameId: int("game_id", { mode: "number" })
    .references(() => games.id)
    .notNull(),
  guess: text("guess", { length: 5 }).notNull(),
  result: text("result", { length: 5 }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date())
    .notNull(),
});
```

</details>

---

### 4. Establish Relationships Between Tables

**Task:** In `src/server/db/schema.ts`, define the relationships between the `games` and `guesses` tables using Drizzle's relation functions.

**Hints:**

- **Using `relations` Function:**

  - For the `games` table, use `many()` to indicate that one game has many guesses.
  - For the `guesses` table, use `one()` to indicate that each guess belongs to one game.

- **Field Mappings:**

  - In the `guesses` table, specify which field is the foreign key and which field it references in the `games` table.

- **Analogous JPA Annotations:**
  - `@OneToMany(mappedBy = "game")` in the `Game` entity.
  - `@ManyToOne` and `@JoinColumn(name = "game_id")` in the `Guess` entity.

**Example:**

```typescript
// src/server/db/schema.ts

// Establish relationships for the 'games' table
export const gameRelations = relations(games, ({ many }) => ({
  // A game has many guesses
  guesses: many(/* ... */),
}));

// Establish relationships for the 'guesses' table
export const guessRelations = relations(guesses, ({ one }) => ({
  // A guess belongs to one game
  game: one(/* ... */, {
    fields: [/* ... */],       // Foreign key in 'guesses' table
    references: [/* ... */],   // Primary key in 'games' table
  }),
}));
```

**Helpful Links:**

- [Drizzle ORM Documentation - Relations](https://orm.drizzle.team/docs/relations)
- [Defining One-to-Many Relationships](https://www.sqlservertutorial.net/sql-server-basics/sql-server-one-to-many-relationship/)
- [Understanding Foreign Key Constraints](https://www.geeksforgeeks.org/sql-foreign-key/)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
export const gameRelations = relations(games, ({ many }) => ({
  guesses: many(guesses),
}));

export const guessRelations = relations(guesses, ({ one }) => ({
  game: one(games, {
    fields: [guesses.gameId],
    references: [games.id],
  }),
}));
```

</details>

---

## Pushing the Schema to the Database

Now that you've defined your tables and established their relationships, it's time to push your schema to the database.

**Instructions:**

- **Run the Database Push Command:**

  - Open your terminal and navigate to your project's root directory.
  - Execute the following command to apply your schema definitions:

    ```bash
    yarn db:push
    ```

- **Prerequisites:**
  - Ensure all dependencies are installed (run `yarn install` if necessary).
  - Verify that your database configuration (e.g., connection string) is correct.

**Helpful Links:**

- [Drizzle ORM Documentation - Migrations](https://orm.drizzle.team/docs/migrations)
- [Setting Up SQLite with Drizzle ORM](https://orm.drizzle.team/docs/sqlite-core)
- [Troubleshooting Database Connections](https://www.sqlshack.com/troubleshooting-sql-server-database-connection-problems/)

---

## Summary

By completing these steps, you've:

- **Set up** Drizzle ORM in your project.
- **Defined** the `games` and `guesses` tables with appropriate fields and constraints.
- **Established** relationships between the tables.
- **Prepared** your schema for use in the database.

---

## Next Steps

With your database schema in place, you're ready to move on to implementing the game board UI in the next section. This will involve using React with Next.js, providing a component-based architecture similar to Angular but with different syntax and lifecycle methods.
