# 03: Game Logic Implementation

Welcome to the third section of our tutorial! In this section, you'll add the core game mechanics, state management, and server-side logic to make your Wordle clone fully functional. This involves implementing the game logic on both the server and client sides, similar to how you'd manage services and state in an **Angular** application with **Spring Boot** for backend services.

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-02-game-board` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-02-game-board
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

Once you've completed these steps, you're ready to implement the game logic.

---

## Implementing Utility Functions

First, you'll implement the `getRandomWord` function to select a random word for each new game. This function is akin to a utility service in Angular that provides common functionalities across components.

### Exercise 1: Creating the getRandomWord Function

Your task is to implement the `getRandomWord` function in the utils file. In React applications, utility functions like this are often placed in separate files and imported where needed, similar to Angular's approach of using services for shared functionality, but as plain JavaScript functions rather than injectable services.

**Instructions:**

1. Open the file `src/lib/utils.ts`.
2. Import the `words` array from your word list.
3. Implement the `getRandomWord` function to select and return a random word from the array.

**Hints:**

- Use `Math.random()` and `Math.floor()` to generate a random index, similar to how you might create a random number generator in an Angular service.
- Remember to handle the case where no word is found, just as you would handle error cases in an Angular service method.
- Convert the selected word to uppercase for consistency, mimicking data normalization you might perform in a backend service.

Here's a starting point for your implementation:

```typescript
// src/lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// TODO: Import the words array

// Utility function for combining class names
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

// TODO: Implement the getRandomWord function
export function getRandomWord() {
  // Your code here
}
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import the words array
import { words } from "./words";

// Utility function for combining class names
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

// Function to get a random word from the words array
export function getRandomWord() {
  // Generate a random index based on the length of the words array
  const randomIndex = Math.floor(Math.random() * words.length);
  // Get the word at the random index
  const word = words[randomIndex];
  // If no word is found, throw an error
  if (!word) {
    throw new Error("Error retrieving random word");
  }
  // Return the word in uppercase for consistency
  return word.toUpperCase();
}
```

</details>

---

## Implementing Server-Side Logic

Next, you'll create server-side services to handle game creation, retrieval, updating, and guess management. This mirrors how you'd use services in Spring Boot to manage business logic and interact with the database.

### Exercise 2: Creating the Game Service

Your task is to implement the game service with functions for creating, retrieving, and updating games. This service will act similarly to a backend service in a Spring Boot application, encapsulating database operations and business logic.

**Instructions:**

1. Create a new file at `src/server/services/game.service.ts`.
2. Implement the following functions:
   - `getById`: Retrieve a game by its ID (similar to a findById method in a Spring Boot repository)
   - `create`: Create a new game with a random word (akin to a save method in a Spring Boot service)
   - `update`: Update the status of an existing game (similar to an update method in a Spring Boot service)

**Hints:**

- Use the `db` instance to interact with your database, much like you would use a repository in Spring Boot.
- Remember to import necessary dependencies and types, similar to importing Spring annotations and interfaces.
- Use the `getRandomWord` function you created earlier for new games, mimicking how you might use a utility service in a Spring Boot application.
- Handle cases where a game is not found or creation fails, just as you would handle exceptions in a Spring Boot service.

Here's a starting point for your game service:

```typescript
// src/server/services/game.service.ts

import { eq } from "drizzle-orm";
import { getRandomWord } from "~/lib/utils";
import { db } from "../db";
import { games } from "../db/schema";

// TODO: Implement getById function

// TODO: Implement create function

// TODO: Implement update function

// TODO: Export the gameService object
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/services/game.service.ts

import { eq } from "drizzle-orm";
import { getRandomWord } from "~/lib/utils";
import { db } from "../db";
import { games } from "../db/schema";

// Function to get a game by its ID
export const getById = async (id: number) => {
  // Query the database for the game with the specified ID
  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
  });

  // If the game doesn't exist, throw an error
  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

// Function to create a new game
const create = async () => {
  // Get a random word for the new game
  const randomWord = getRandomWord();

  // Insert a new game into the database with the random word
  const [newGame] = await db
    .insert(games)
    .values({ word: randomWord, status: "in_progress" })
    .returning();

  // If the game wasn't created, throw an error
  if (!newGame) {
    throw new Error("Failed to create game");
  }

  return newGame;
};

// Function to update the status of a game
export const update = async (
  id: number,
  status: (typeof games.status.enumValues)[number],
) => {
  // Update the game status in the database
  const [updatedGame] = await db
    .update(games)
    .set({ status })
    .where(eq(games.id, id))
    .returning();

  // If the game wasn't found, throw an error
  if (!updatedGame) {
    throw new Error("Game not found");
  }

  return updatedGame;
};

// Export the gameService with the methods
export const gameService = {
  create,
  getById,
  update,
};
```

</details>

---

### Exercise 3: Creating the Guess Service

Now, you'll implement the guess service to handle guess-related operations. This service will function similarly to a service layer in a Spring Boot application, managing business logic related to guesses.

**Instructions:**

1. Create a new file at `src/server/services/guess.service.ts`.
2. Implement the following functions:
   - `checkGuess`: Compare a guess against the actual word (similar to a validation method in a Spring Boot service)
   - `create`: Create a new guess and save it to the database (akin to a save method in a Spring Boot service)
   - `findByGameId`: Retrieve all guesses for a specific game (similar to a findAll method with a filter in Spring Boot)

**Hints:**

- The `checkGuess` function should return a string representing the correctness of each letter, similar to how you might implement game logic in a backend service.
- Use 'C' for correct position, '~' for correct letter in wrong position, and 'X' for incorrect letters, mimicking an enum you might use in Java.
- Remember to revalidate the game page after creating a new guess. This is similar to triggering a refresh in an Angular application after a state change, but handled server-side in Next.js.

Here's a starting point for your guess service:

```typescript
// src/server/services/guess.service.ts

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { games, guesses } from "../db/schema";

// TODO: Implement checkGuess function

// TODO: Implement create function

// TODO: Implement findByGameId function

// TODO: Export the guessService object
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/services/guess.service.ts

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { games, guesses } from "../db/schema";

// Function to check the guess against the actual word
const checkGuess = async (guess: string, gameId: number) => {
  // Retrieve the game from the database
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  // If the game doesn't exist, throw an error
  if (!game) {
    throw new Error("Game not found");
  }

  const actualWord = game.word.toUpperCase();
  const upperGuess = guess.toUpperCase();
  const result = new Array(5).fill("X");
  const charCount = new Map<string, number>();

  // Count character occurrences in the actual word
  for (const char of actualWord) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Check for correct letters in correct positions
  for (let i = 0; i < 5; i++) {
    if (upperGuess[i] === actualWord[i]) {
      result[i] = "C"; // Correct position
      charCount.set(upperGuess[i], charCount.get(upperGuess[i])! - 1);
    }
  }

  // Check for correct letters in wrong positions
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "C" && charCount.get(upperGuess[i])! > 0) {
      result[i] = "~"; // Wrong position
      charCount.set(upperGuess[i], charCount.get(upperGuess[i])! - 1);
    }
  }

  return result.join("");
};

// Function to create a new guess
const create = async (guess: string, gameId: number) => {
  // Check the guess against the actual word
  const result = await checkGuess(guess, gameId);

  // Insert the new guess into the database
  const [createdGuess] = await db
    .insert(guesses)
    .values({
      gameId,
      guess: guess.toUpperCase(),
      result,
    })
    .returning();

  // If the guess wasn't created, throw an error
  if (!createdGuess) {
    throw new Error("Failed to create guess");
  }

  // Revalidate the game page to update the UI
  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

// Function to retrieve guesses by game ID
const findByGameId = async (gameId: number) => {
  // Query the database for guesses associated with the game ID
  return db.query.guesses.findMany({
    where: eq(guesses.gameId, gameId),
    orderBy: [asc(guesses.createdAt)],
  });
};

// Export the guessService with the methods
export const guessService = {
  create,
  findByGameId,
};
```

</details>

---

## Creating the API Layer

You'll now create an API layer that exposes these services to your components, facilitating interaction between the client and server logic. This is similar to defining controllers in a Spring Boot application.

### Exercise 4: Creating the Game Controller

Your task is to create a game controller that will handle game-related API calls. This controller will act as an intermediary between your React components and the game service, similar to how a controller in Spring Boot would handle HTTP requests.

**Instructions:**

1. Create a new file at `src/server/controllers/game.controller.ts`.
2. Import the `gameService` you created earlier.
3. Implement and export the following functions:
   - `create`: Create a new game
   - `getById`: Retrieve a game by its ID

**Hints:**

- Use the `"use server"` directive at the top of the file to indicate that these functions run on the server.
- These controller functions should simply call the corresponding service methods, similar to how a Spring Boot controller would delegate to a service.

Here's a starting point for your game controller:

```typescript
// src/server/controllers/game.controller.ts

"use server";

import { gameService } from "../services/game.service";

// TODO: Implement and export create function

// TODO: Implement and export getById function
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/controllers/game.controller.ts

"use server";

import { gameService } from "../services/game.service";

// Controller function to create a new game
export const create = async () => {
  // Call the create function from the game service
  return gameService.create();
};

// Controller function to get a game by ID
export const getById = async (id: number) => {
  // Call the getById function from the game service
  return gameService.getById(id);
};
```

</details>

---

### Exercise 5: Creating the Guess Controller

Now, you'll create a guess controller to handle guess-related API calls. This controller will work similarly to the game controller, acting as an intermediary for guess-related operations.

**Instructions:**

1. Create a new file at `src/server/controllers/guess.controller.ts`.
2. Import the `guessService` you created earlier.
3. Implement and export the following functions:
   - `create`: Create a new guess
   - `findByGameId`: Retrieve all guesses for a specific game

**Hints:**

- Remember to use the `"use server"` directive at the top of the file.
- These functions should directly call the corresponding service methods, just like in the game controller.

Here's a starting point for your guess controller:

```typescript
// src/server/controllers/guess.controller.ts

"use server";

import { guessService } from "../services/guess.service";

// TODO: Implement and export create function

// TODO: Implement and export findByGameId function
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/controllers/guess.controller.ts

"use server";

import { guessService } from "../services/guess.service";

// Controller function to create a new guess
export const create = async (guess: string, gameId: number) => {
  // Call the create function from the guess service
  return guessService.create(guess, gameId);
};

// Controller function to find guesses by game ID
export const findByGameId = async (gameId: number) => {
  // Call the findByGameId function from the guess service
  return guessService.findByGameId(gameId);
};
```

</details>

---

### Exercise 6: Consolidating the API

To organize your API controllers, you'll create an `api.ts` file. This approach is similar to creating a centralized API gateway in a microservices architecture, providing a single point of access for all your API functions.

**Instructions:**

1. Create a new file at `src/server/api.ts`.
2. Import all the controllers you've created (game and guess controllers).
3. Create and export an `api` object that includes all the imported controllers.

**Hints:**

- This file acts as a centralized access point for all your API functions, similar to how you might structure a main API module in an Angular application.
- Grouping your controllers under a single `api` object makes it easier to import and use them in your components.

Here's a starting point for your API consolidation:

```typescript
// src/server/api.ts

// TODO: Import game and guess controllers

// TODO: Create and export the api object
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/server/api.ts

import * as games from "./controllers/game.controller";
import * as guesses from "./controllers/guess.controller";

// Export the API controllers
export const api = {
  games,
  guesses,
};
```

</details>

---

## Updating the Home Page

Now, you'll modify the home page to allow users to start a new game. This is similar to having a component in Angular that navigates to a new route when starting a game, but with the added step of creating a new game via an API call.

### Exercise 7: Implementing the New Game Button

Your task is to update the home page to include a "New Game" button that creates a new game and navigates to the game page.

**Instructions:**

1. Open `src/app/page.tsx`.
2. Import the necessary dependencies, including the `api` object you just created.
3. Implement a `HomePage` component with a button that creates a new game and navigates to it.

**Hints:**

- Use the `useRouter` hook from Next.js for navigation. This is similar to using the Router service in Angular for programmatic navigation.
- The `onClick` handler of the button should be an async function that creates a new game and then navigates to its page.
- Remember to use the `"use client"` directive at the top of the file, as you're using client-side hooks and event handlers.

Here's a starting point for your home page:

```typescript
// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/server/api";

// TODO: Implement the HomePage component with a New Game button
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/server/api";

// Home page component
export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          // Call the API to create a new game
          const game = await api.games.create();
          // Navigate to the game page using the new game's ID
          router.push(`/game/${game.id}`);
        }}
      >
        New Game
      </Button>
    </main>
  );
}
```

</details>

---

## Updating the Game Page

Finally, you'll modify the game page to fetch and display the game's data, including previous guesses. This is similar to fetching data in a component's lifecycle method in Angular, but leveraging Next.js's server-side rendering capabilities.

### Exercise 8: Implementing the Game Page

Your task is to update the game page to fetch the game's guesses and pass them to the `GameBoard` component.

**Instructions:**

1. Open `src/app/game/[gameId]/page.tsx`.
2. Import the `api` object and use it to fetch the guesses for the current game.
3. Pass the fetched guesses to the `GameBoard` component as a prop.

**Hints:**

- This is a server component, so you can directly use async/await without the need for useEffect or useState hooks.
- Use the `params` object to access the `gameId` from the URL, similar to how you might access route parameters in Angular.
- Remember that in Next.js, the file name `[gameId]` creates a dynamic route segment.

Here's a starting point for your game page:

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";
import { api } from "~/server/api";

// TODO: Implement the GamePage component
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";
import { api } from "~/server/api";

// Game page component for a specific game ID
export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // Fetch the guesses for the current game using the game ID
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    <div className="flex h-full items-center justify-center">
      {/* Render the GameBoard component, passing gameId and guesses as props */}
      <GameBoard gameId={gameId} guesses={guesses} />
    </div>
  );
}
```

</details>

---

## Checking Your Progress

Now that you've implemented the game logic, it's time to verify that everything works as expected.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Create a New Game:**

   - Navigate to `http://localhost:3000` in your web browser.
   - You should see a "New Game" button on the home page.
   - Click the button to create a new game.
   - You should be redirected to a game page with a unique game ID (e.g., `http://localhost:3000/game/1`).

3. **Interact with the Game Board:**

   - On the game page, you should see an empty game board and an input field for entering guesses.
   - Enter a 5-letter word and press **Enter**.
   - Your guess should appear on the game board.
   - Repeat the process to make additional guesses.

4. **Data Persistence:**

   - Refresh the page to ensure that your previous guesses persist.
   - This confirms that the guesses are being stored in the database.

5. **Start Another Game:**

   - Return to the home page and create another new game.
   - Verify that each game maintains its own state and guesses.

**Expected Behavior:**

- The game board updates with each guess.
- Guesses persist after refreshing the page.
- Multiple games can be played independently.

If everything works correctly, congratulations! You've successfully implemented the core game logic for your Wordle clone.

---

## Next Steps

In the next section, we'll focus on creating an on-screen keyboard component and integrating it with the game logic to enhance the user experience. This will involve:

- **Building the Keyboard Component:**
  - Creating an interactive on-screen keyboard.
- **State Management:**
  - Updating the game state based on user interactions with the keyboard.
- **UI Feedback:**
  - Providing visual feedback for correct, incorrect, and partially correct letters.

By continuing to build on your application, you'll deepen your understanding of state management and component interaction in React, paralleling advanced techniques in Angular applications.

---

## Helpful Resources

To further enhance your understanding, you might find the following resources helpful:

1. **Drizzle ORM Documentation:**

   - [Drizzle ORM Docs](https://orm.drizzle.team/)
     - Comprehensive guide on using Drizzle ORM for database operations.

2. **Next.js Data Fetching:**

   - [Data Fetching in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching)
     - Learn how to fetch data on the server side in Next.js.

3. **TypeScript Handbook:**

   - [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/intro.html)
     - Deepen your understanding of TypeScript for type safety.

---
