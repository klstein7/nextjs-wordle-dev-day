# 01: Drizzle Setup

Welcome to the first section of our tutorial! We're going to set up Drizzle ORM to define the database schema for our Wordle clone. If you're familiar with Java and Spring Boot, this process is similar to creating entity classes using JPA. Don't worry if you're not though - we'll walk through it step by step.

Let's start by importing the necessary modules from Drizzle ORM and creating a table creator function. This function will prefix our table names, which is a neat way to organize our database tables. It's kind of like using @Table(name = "custom_name") in JPA, if you're familiar with that.

Add the following code to your src/server/db/schema.ts file:

```typescript
// src/server/db/schema.ts

import { relations, sql } from "drizzle-orm";
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator(
  (name) => `nextjs-wordle-dev-day_${name}`,
);
```

Here, we're importing some key functions and types from Drizzle ORM. The `relations` and `sql` imports will come in handy later when we're setting up relationships between our tables. The `int`, `sqliteTableCreator`, and `text` imports are for defining our table structures.

The `createTable` function we've defined will add the prefix "nextjs-wordle-dev-day\_" to all our table names. This is a good practice to avoid naming conflicts, especially if you're working on multiple projects using the same database.

Now, let's move on to defining our first table: the games table. This is where we'll store information about each Wordle game. In Spring Boot terms, think of this as creating an entity class with fields and annotations.

## Exercise 1: Defining the games Table

Your task is to create the 'games' table using the `createTable` function we just defined. You'll need to include fields for id (as an auto-incrementing primary key), word, status, and timestamp fields for when the game was created and last updated.

Here's the starting code:

```typescript
export const games = createTable("game", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  // TODO: Add word field (text, length 5, not null)
  // TODO: Add status field (text, enum with values "in_progress", "won", "lost", not null)
  // TODO: Add createdAt field (int, mode: "timestamp", default to current timestamp, not null)
  // TODO: Add updatedAt field (int, mode: "timestamp", default to current timestamp, auto-update, not null)
});
```

Your tasks:

1. Add the `word` field as a non-null text field with a length of 5.
2. Add the `status` field as a non-null text field with an enum constraint.
3. Add the `createdAt` field as a non-null int with a default value of the current timestamp.
4. Add the `updatedAt` field as a non-null int with a default value of the current timestamp and auto-update functionality.

Remember, for the timestamp fields, you can use `sql`(unixepoch())` as the default value.

Helpful resources:

- [Drizzle ORM Column Types](https://orm.drizzle.team/docs/column-types/sqlite)

When you're ready, check your solution against one possible implementation below.

---

<details>
<summary>👉 Click here to see a possible solution 👈</summary>

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

Note: This is one correct implementation, but there might be slight variations that are equally valid.

</details>

---

Great job! The `id` field is our primary key, set to auto-increment. We've made `word` a non-null text field with a length of 5, perfect for Wordle words. The `status` field is a non-null text field with an enum constraint, allowing only "in_progress", "won", or "lost" as valid values. The `createdAt` and `updatedAt` fields are set up to automatically handle creation and update times using the Unix epoch.

Now that we have our games table, let's create a table for storing guesses. This table will have a relationship with the games table, as each guess belongs to a specific game.

## Exercise 2: Defining the guesses Table

Your next task is to create the 'guesses' table. This table should include fields for id (as an auto-incrementing primary key), gameId (as a foreign key referencing games.id), guess, result, and the same timestamp fields we used in the games table.

Here's your starting point:

```typescript
export const guesses = createTable("guess", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  // TODO: Add gameId field (int, references games.id)
  // TODO: Add guess field (text, length 5, not null)
  // TODO: Add result field (text, length 5, not null)
  // TODO: Add createdAt field (int, mode: "timestamp", default to current timestamp, not null)
  // TODO: Add updatedAt field (int, mode: "timestamp", default to current timestamp, auto-update, not null)
});
```

Your tasks:

1. Add the `gameId` field as an int that references the `id` field in the `games` table.
2. Add the `guess` field as a non-null text field with a length of 5.
3. Add the `result` field as a non-null text field with a length of 5.
4. Add the `createdAt` field as a non-null int with a default value of the current timestamp.
5. Add the `updatedAt` field as a non-null int with a default value of the current timestamp and auto-update functionality.

Remember to use the `references()` function to establish the foreign key relationship for the `gameId` field.

Helpful resource:

- [Drizzle Foreign Keys](https://orm.drizzle.team/docs/indexes-constraints#foreign-key)

When you're done, check your solution against one possible implementation.

---

<details>
<summary>👉 Click here to see a possible solution 👈</summary>

```typescript
export const guesses = createTable("guess", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  gameId: int("game_id", { mode: "number" }).references(() => games.id),
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

Note: While this is a correct implementation, there might be slight variations that are equally valid.

</details>

---

Excellent work! The `gameId` field is set up as a foreign key referencing the `id` field in the `games` table. This establishes the relationship between our two tables - each guess belongs to a specific game. The `guess` and `result` fields are non-null text fields with a length of 5, perfect for storing Wordle guesses and their results. The timestamp fields are set up similarly to those in the games table.

We're in the home stretch now! The last step is to explicitly define the relationships between our `games` and `guesses` tables. This is similar to setting up `@OneToMany` and `@ManyToOne` relationships in JPA.

## Exercise 3: Establishing Table Relationships

Your final challenge is to use Drizzle's `relations` function to establish these relationships. Remember, a game can have many guesses, but each guess belongs to only one game.

Here's your starting point:

```typescript
export const gameRelations = relations(games, ({ many }) => ({
  // TODO: Define the relationship to guesses (one game has many guesses)
}));

export const guessRelations = relations(guesses, ({ one }) => ({
  // TODO: Define the relationship to games (one guess belongs to one game)
}));
```

Your tasks:

1. In `gameRelations`, use the `many()` function to express that a game has many guesses.
2. In `guessRelations`, use the `one()` function to express that a guess belongs to one game. You'll need to specify which fields are used for this relationship.

Helpful resource:

- [Drizzle ORM TypeScript Relations](https://orm.drizzle.team/docs/rqb#declaring-relations)

When you're finished, compare your solution to one possible implementation.

---

<details>
<summary>👉 Click here to see a possible solution 👈</summary>

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

Note: This implementation matches the expected output exactly, but there might be slight variations that are equally valid.

</details>

---

Fantastic job! You've successfully set up the relationships between our tables. The `gameRelations` specifies that a game has many guesses, and the `guessRelations` specifies that a guess belongs to one game. The `fields` and `references` arrays in the guess relation define exactly how these tables are linked.

Now that we've defined our tables and established their relationships, it's time to push our schema to the database. Here's how you do it:

1. Open your terminal and navigate to your project's root directory.
2. Run the following command:

```bash
yarn db:push
```

Make sure all your dependencies are installed (run `yarn install` if you haven't already) and your database configuration is correct before running this command.

Helpful resource:

- [Drizzle ORM Push](https://orm.drizzle.team/kit-docs/commands#push)

## Summary

Congratulations! You've successfully:

- Set up Drizzle ORM in your project
- Defined the games and guesses tables with appropriate fields and constraints
- Established relationships between the tables
- Prepared your schema for use in the database

You're now ready to move on to implementing the game board UI in the next section. We'll be using React with Next.js, which provides a component-based architecture similar to Angular but with different syntax and lifecycle methods.

If you want to dive deeper into Drizzle ORM, check out their documentation at [Drizzle ORM Docs](https://orm.drizzle.team/). Happy coding!
