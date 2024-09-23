# 01: Drizzle Setup

Welcome to the first section of our tutorial! In this section, we'll set up **Drizzle ORM** to define the database schema for our Wordle clone. If you're familiar with **Java** and **Spring Boot**, you'll notice similarities between defining entities in Drizzle ORM and creating entity classes using **JPA (Java Persistence API)** in Spring Boot. We'll include short informative tidbits comparing the two frameworks as we proceed.

## Prerequisites

Before you begin, ensure you've completed the "Getting Started" steps or have cloned the repository and installed all dependencies.

**To get up to speed:**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/farmcreditca/nextjs-wordle-dev-day.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd nextjs-wordle-dev-day
   ```

3. **Install Dependencies:**

   ```bash
   yarn install
   ```

4. **Set Up Your Environment Variables:**

   ```bash
   cp .env.example .env
   ```

5. **Open the Project in Your Code Editor:**

   ```bash
   code .
   ```

   _Note: We're using **Visual Studio Code** in this tutorial for its excellent support of the technologies we'll be using._

---

## Setting Up Drizzle ORM

Drizzle ORM is a TypeScript ORM that allows us to define our database schema using TypeScript code. We'll use it to create the tables needed for our Wordle clone.

> **Spring Boot Comparison:** In Spring Boot, you might use **JPA annotations** to define entity classes and map them to database tables. Similarly, in Drizzle ORM, we define tables using TypeScript code, which serves the same purpose.

### Step 1: Import Necessary Modules and Create a Table Creator

First, we'll import key functions and types from Drizzle ORM and create a table creator function. This function will prefix our table names, which is a good practice to avoid naming conflicts, especially if you're working on multiple projects using the same database.

**Instructions:**

1. **Create the `schema.ts` File:**

   If it doesn't already exist, create a new file at `src/server/db/schema.ts`.

2. **Import Modules and Create the Table Creator:**

   Add the following code to your `schema.ts` file:

   ```typescript
   // src/server/db/schema.ts

   import { relations, sql } from "drizzle-orm";
   import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

   // Create a table creator function with a custom prefix
   export const createTable = sqliteTableCreator(
     (name) => `nextjs_wordle_dev_day_${name}`, // Prefixes table names with 'nextjs_wordle_dev_day_'
   );
   ```

   **Explanation:**

   - **Imports:**

     - `relations` and `sql` from `drizzle-orm` are used for defining relationships and SQL expressions.
     - `int`, `sqliteTableCreator`, and `text` from `drizzle-orm/sqlite-core` are used for defining column types and creating tables.

   - **`createTable` Function:**
     - This function prefixes all table names with `nextjs_wordle_dev_day_` to prevent naming conflicts.

   > **Spring Boot Comparison:** In Spring Boot, you might use the `@Table` annotation with a `name` parameter to specify the table name and apply a prefix if needed. The `sqliteTableCreator` function serves a similar purpose by customizing table names.

### Step 2: Defining the `games` Table

Next, we'll define the `games` table, which will store information about each Wordle game.

**Exercise 1:**

**Tasks:**

1. **Add the `word` Field:**

   - Define `word` as a non-null text field with a length of 5.

2. **Add the `status` Field:**

   - Define `status` as a non-null text field with an enum constraint allowing `"in_progress"`, `"won"`, or `"lost"`.

3. **Add the `createdAt` Field:**

   - Define `createdAt` as a non-null integer representing a timestamp, defaulting to the current time.

4. **Add the `updatedAt` Field:**
   - Define `updatedAt` as a non-null integer representing a timestamp, defaulting to the current time and updating automatically.

**Hints:**

- Use `sql` functions like `sql`(unixepoch())` for default timestamp values.
- Refer to the [Drizzle ORM Column Types](https://orm.drizzle.team/docs/column-types/sqlite) for syntax.
- For the `status` field, use the `enum` option to constrain acceptable values.

**Starting Point:**

```typescript
// src/server/db/schema.ts

export const games = createTable("game", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  // TODO: Add word field (text, length 5, not null)
  // TODO: Add status field (text, enum with values "in_progress", "won", "lost", not null)
  // TODO: Add createdAt field (int, mode: "timestamp", default to current timestamp, not null)
  // TODO: Add updatedAt field (int, mode: "timestamp", default to current timestamp, auto-update, not null)
});
```

**Solution:**

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/db/schema.ts

export const games = createTable("game", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  // Define 'word' as a non-null text field with length 5
  word: text("word", { length: 5 }).notNull(),

  // Define 'status' with enum constraint
  status: text("status", { enum: ["in_progress", "won", "lost"] }).notNull(),

  // Define 'createdAt' with default current timestamp
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`) // Default to current timestamp
    .notNull(),

  // Define 'updatedAt' with default current timestamp and auto-update
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdate(sql`(unixepoch())`) // Update to current timestamp on update
    .notNull(),
});
```

**Explanation:**

- **`id` Field:**
  - Primary key with auto-increment.
- **`word` Field:**
  - Non-null text field with a maximum length of 5 characters.
- **`status` Field:**
  - Non-null text field with an enum constraint to ensure only specific values are allowed.
- **`createdAt` and `updatedAt` Fields:**
  - Non-null integer fields representing timestamps.
  - Use `sql` functions to set default values to the current Unix epoch time.
  - `$onUpdate(sql`(unixepoch())`)` ensures `updatedAt` is updated automatically.

> **Spring Boot Comparison:** In Spring Boot, you would define an entity class `Game` with fields annotated using `@Column`. You might use `@Id` and `@GeneratedValue` for the `id` field, and `@Enumerated` for the `status` field. The timestamp fields could be annotated with `@CreationTimestamp` and `@UpdateTimestamp` from Hibernate.

</details>

---

### Step 3: Defining the `guesses` Table

We'll now define the `guesses` table, which stores each guess made during a game and its result.

**Exercise 2:**

**Tasks:**

1. **Add the `gameId` Field:**

   - Define `gameId` as an integer that references `games.id`.

2. **Add the `guess` Field:**

   - Define `guess` as a non-null text field with a length of 5.

3. **Add the `result` Field:**

   - Define `result` as a non-null text field with a length of 5.

4. **Add the `createdAt` Field:**

   - Define `createdAt` as a non-null integer representing a timestamp, defaulting to the current time.

5. **Add the `updatedAt` Field:**
   - Define `updatedAt` as a non-null integer representing a timestamp, defaulting to the current time and updating automatically.

**Hints:**

- Use the `references()` function to establish a foreign key relationship.
- Ensure that `gameId` correctly references `games.id`.
- The `result` field will store a string indicating the correctness of each letter (we'll define this logic later).

**Starting Point:**

```typescript
// src/server/db/schema.ts

export const guesses = createTable("guess", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  // TODO: Add gameId field (int, references games.id)
  // TODO: Add guess field (text, length 5, not null)
  // TODO: Add result field (text, length 5, not null)
  // TODO: Add createdAt field (int, mode: "timestamp", default to current timestamp, not null)
  // TODO: Add updatedAt field (int, mode: "timestamp", default to current timestamp, auto-update, not null)
});
```

**Solution:**

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/db/schema.ts

export const guesses = createTable("guess", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  // Define 'gameId' as a foreign key referencing 'games.id'
  gameId: int("game_id", { mode: "number" })
    .notNull()
    .references(() => games.id),

  // Define 'guess' as a non-null text field with length 5
  guess: text("guess", { length: 5 }).notNull(),

  // Define 'result' as a non-null text field with length 5
  result: text("result", { length: 5 }).notNull(),

  // Define 'createdAt' with default current timestamp
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),

  // Define 'updatedAt' with default current timestamp and auto-update
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdate(sql`(unixepoch())`)
    .notNull(),
});
```

**Explanation:**

- **`gameId` Field:**
  - Foreign key that references `games.id`.
- **`guess` and `result` Fields:**
  - Non-null text fields with a maximum length of 5 characters.
- **`createdAt` and `updatedAt` Fields:**
  - Same as in the `games` table.

> **Spring Boot Comparison:** In Spring Boot, you'd define a `Guess` entity with a `@ManyToOne` relationship to the `Game` entity, using `@JoinColumn` to specify the foreign key. The `createdAt` and `updatedAt` fields could use the same timestamp annotations as before.

</details>

---

### Step 4: Establishing Table Relationships

Now, we'll define the relationships between the `games` and `guesses` tables. In Drizzle ORM, we use the `relations` function to establish these relationships.

**Exercise 3:**

**Tasks:**

1. **In `gameRelations`:**

   - Use the `many()` function to express that a game has many guesses.

2. **In `guessRelations`:**
   - Use the `one()` function to express that a guess belongs to one game.
   - Specify the `fields` and `references` used for this relationship.

**Hints:**

- The `many()` function defines a one-to-many relationship.
- The `one()` function defines a many-to-one relationship.
- Ensure that the `fields` in `guessRelations` match the `gameId` field in the `guesses` table.
- Refer to the [Drizzle ORM Relations Documentation](https://orm.drizzle.team/docs/relation-definition) for guidance.

**Starting Point:**

```typescript
// src/server/db/schema.ts

// Define relationships for 'games'
export const gameRelations = relations(games, ({ many }) => ({
  // TODO: Define the relationship to 'guesses' (one game has many guesses)
}));

// Define relationships for 'guesses'
export const guessRelations = relations(guesses, ({ one }) => ({
  // TODO: Define the relationship to 'games' (one guess belongs to one game)
}));
```

**Solution:**

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/db/schema.ts

// Define relationships for 'games'
export const gameRelations = relations(games, ({ many }) => ({
  // A game has many guesses
  guesses: many(guesses),
}));

// Define relationships for 'guesses'
export const guessRelations = relations(guesses, ({ one }) => ({
  // A guess belongs to one game
  game: one(games, {
    fields: [guesses.gameId], // Foreign key in 'guesses'
    references: [games.id], // Primary key in 'games'
  }),
}));
```

**Explanation:**

- **`gameRelations`:**
  - Uses `many(guesses)` to indicate that a game has many guesses.
- **`guessRelations`:**
  - Uses `one(games, { ... })` to specify that a guess belongs to one game.
  - The `fields` array lists the foreign key in the `guesses` table (`gameId`).
  - The `references` array lists the primary key in the `games` table (`id`).

> **Spring Boot Comparison:** In Spring Boot, you would use `@OneToMany` in the `Game` entity to represent that a game has many guesses, and `@ManyToOne` in the `Guess` entity to represent that a guess belongs to one game. The `mappedBy` attribute in `@OneToMany` and the `@JoinColumn` annotation help establish this relationship.

</details>

---

### Step 5: Pushing the Schema to the Database

Now that we've defined our tables and relationships, we'll push the schema to the database.

**Instructions:**

1. **Run the Database Push Command:**

   In your terminal, execute:

   ```bash
   yarn db:push
   ```

   This command syncs your database schema with the definitions in your code.

2. **Verify the Tables:**

   - If you have the **SQLite Viewer** extension installed in **Visual Studio Code**, you can open the `sqlite.db` file in the root directory to verify that the `games` and `guesses` tables have been created with the correct columns.

**Helpful Resources:**

- [Drizzle ORM Push Command Documentation](https://orm.drizzle.team/kit-docs/commands#push)

---

## Summary

Congratulations! You've successfully:

- Set up **Drizzle ORM** in your project.
- Defined the `games` and `guesses` tables with appropriate fields and constraints.
- Established relationships between the tables.
- Pushed your schema to the database.

**Next Steps:**

In the next section, we'll implement the game board UI using **React** with **Next.js**. This will involve:

- Creating components for the game board.
- Implementing user input for guesses.
- Displaying previous guesses.

---

## Helpful Resources

To deepen your understanding of Drizzle ORM and database schema definitions, you might find the following resources helpful:

1. **Drizzle ORM Documentation:**

   - [Drizzle ORM Docs](https://orm.drizzle.team/)
     - Comprehensive guide on using Drizzle ORM for database operations.

2. **Drizzle ORM Column Types:**

   - [Column Types in Drizzle ORM](https://orm.drizzle.team/docs/column-types/sqlite)
     - Detailed information on column types and options.

3. **Drizzle ORM Relations:**

   - [Defining Relations in Drizzle ORM](https://orm.drizzle.team/docs/relation-definition)
     - Instructions on how to define relationships between tables.

---

By completing this section, you've laid the foundation for the backend of your Wordle clone. Understanding how to define tables and relationships is crucial for any database-driven application. Keep up the great work, and let's move on to bringing the game to life in the next section!

---
