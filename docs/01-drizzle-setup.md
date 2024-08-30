# Section 01: Drizzle Setup

In this section, we'll set up Drizzle ORM, which is similar to how you might use JPA in Spring Boot. We'll define our database schema for the Wordle clone, which is analogous to creating entity classes in Java.

## Understanding the Schema

If you're familiar with Spring Boot and JPA, you'll find some similarities in how we define our data model with Drizzle ORM. Let's break down the changes made in `src/server/db/schema.ts`:

1. Imports and Table Creator:

   ```typescript
   import { relations, sql } from "drizzle-orm";
   import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

   export const createTable = sqliteTableCreator(
     (name) => `nextjs-wordle-dev-day_${name}`,
   );
   ```

   This is similar to importing JPA annotations in Spring Boot. The `createTable` function is a utility that prefixes our table names, which you might achieve with a `@Table` annotation in JPA.

2. Games Table:

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

   This is equivalent to creating a `Game` entity in Spring Boot. The fields correspond to:

   - `@Id @GeneratedValue` for the `id`
   - `@Column(nullable = false, length = 5)` for the `word`
   - `@Enumerated(EnumType.STRING) @Column(nullable = false)` for the `status`
   - `@CreationTimestamp` for `createdAt`
   - `@UpdateTimestamp` for `updatedAt`

   The `status` field is particularly interesting as it uses an enum-like structure to represent the game's current state. This is similar to how you might use an enum in Java with JPA, but here it's implemented as a text field with predefined values.

3. Guesses Table:

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

   This is similar to a `Guess` entity in Spring Boot. The `gameId` field is analogous to using `@ManyToOne` to establish a relationship with the `Game` entity.

4. Relations:

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

   These relations are similar to how you'd use `@OneToMany` and `@ManyToOne` annotations in JPA to define relationships between entities.

## Pushing the Schema to the Database

To push your schema to the database, run the following command in your terminal:

```bash
yarn db:push
```

## Next Steps

With our database schema in place, we're ready to move on to implementing the game board UI in the next section. This schema will allow us to store and retrieve game data, similar to how you'd use repositories in Spring Boot.

In the frontend, instead of Angular, we'll be using React with Next.js, which provides a component-based architecture similar to Angular, but with a different syntax and lifecycle management.
