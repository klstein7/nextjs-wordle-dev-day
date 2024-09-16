# 03: Game Logic Implementation

Welcome to the third section of our tutorial! In this part, you'll add the core game mechanics, state management, and server-side logic to make our Wordle clone fully functional. This involves implementing the game logic on both the server and client sides, similar to how you'd manage services and state in an Angular application.

## Exercise Objectives

- **Implement** utility functions for random word selection.
- **Develop** server-side logic for game and guess management.
- **Create** an API layer to interact with the server-side logic.
- **Update** the home page to start new games.
- **Modify** the game page to fetch and display game data.
- **Enhance** components to handle real game data.
- **Verify** the functionality by running the application.

---

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

## Tasks and Hints

### 1. Update Utility Functions

**Task:** Implement the `getRandomWord` function in `src/lib/utils.ts` to select a random word for each new game.

**Why:** The game requires a random word to be guessed. This function will provide that word when a new game is created.

**Hints:**

- **Importing Words:**
  - You'll need an array of words to select from. Assume you have a `words` array in `src/lib/words.ts`.
- **Random Selection:**
  - Use `Math.random()` and `Math.floor()` to select a random index within the bounds of the words array.
- **Error Handling:**
  - Check if the selected word exists and handle potential errors gracefully.

**Example:**

```typescript
// src/lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import the words array
import { words } from "./words";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

export function getRandomWord() {
  // TODO: Implement the function to return a random word from the words array
}
```

**Helpful Links:**

- [JavaScript Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
- [Error Handling in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **Imports:**
  - We import `clsx` and `twMerge` for class name utilities.
  - Import `words` array containing possible words for the game.
- **`cn` Function:**
  - Combines class names using `clsx` and `twMerge`.
- **`getRandomWord` Function:**
  - Uses `Math.random()` and `Math.floor()` to select a random index.
  - Retrieves the word at the random index from the `words` array.
  - Checks if the word exists and throws an error if it doesn't.
  - Returns the word converted to uppercase.

</details>

---

### 2. Implement Server-Side Logic

**Task:** Create server-side services to handle game creation, retrieval, and updating, as well as guess management.

**Why:** The server-side logic handles the core game mechanics, including storing game state and processing guesses, similar to backend services in Angular.

**Hints:**

- **Game Service:**
  - Implement functions to create a new game, get a game by ID, and update a game's status.
- **Guess Service:**
  - Implement functions to create a new guess and find guesses by game ID.
- **Database Operations:**
  - Use your ORM (e.g., Drizzle ORM) to interact with the database.
  - Handle errors and edge cases appropriately.

**Example for `game.service.ts`:**

```typescript
// src/server/services/game.service.ts

import { db } from "../db";
import { games } from "../db/schema";
import { getRandomWord } from "~/lib/utils";

export const gameService = {
  create: async () => {
    // TODO: Implement game creation logic
  },
  getById: async (id: number) => {
    // TODO: Implement logic to retrieve a game by ID
  },
  update: async (id: number, status: string) => {
    // TODO: Implement logic to update a game's status
  },
};
```

**Helpful Links:**

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Error Handling in Async Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

**Solution Code for `game.service.ts`:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **Imports:**
  - `eq` from `drizzle-orm` for query conditions.
  - `getRandomWord` to get a random word for new games.
  - `db` and `games` schema for database operations.
- **`getById` Function:**
  - Queries the database for a game with the given ID.
  - Throws an error if no game is found.
- **`create` Function:**
  - Uses `getRandomWord` to get a word.
  - Inserts a new game into the `games` table with the random word and status `in_progress`.
  - Returns the created game.
- **`update` Function:**
  - Updates the status of a game with the given ID.
  - Throws an error if the game is not found.
- **Exported Service:**
  - Exports the `gameService` object containing the methods.

</details>

**Example for `guess.service.ts`:**

```typescript
// src/server/services/guess.service.ts

import { db } from "../db";
import { guesses } from "../db/schema";

export const guessService = {
  create: async (guess: string, gameId: number) => {
    // TODO: Implement logic to create a new guess
  },
  findByGameId: async (gameId: number) => {
    // TODO: Implement logic to retrieve guesses by game ID
  },
};
```

**Solution Code for `guess.service.ts`:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **Imports:**
  - `asc`, `eq` from `drizzle-orm` for query conditions.
  - `revalidatePath` from `next/cache` to revalidate static paths.
  - `db`, `games`, and `guesses` schemas for database operations.
- **`checkGuess` Function:**
  - Retrieves the game to get the actual word.
  - Compares the user's guess to the actual word.
  - Marks letters as correct (`C`), present but wrong position (`~`), or incorrect (`X`).
- **`create` Function:**
  - Calls `checkGuess` to get the result string.
  - Inserts the new guess into the `guesses` table.
  - Revalidates the game page to update the UI.
- **`findByGameId` Function:**
  - Retrieves all guesses associated with a specific game, ordered by creation time.
- **Exported Service:**
  - Exports the `guessService` object containing the methods.

</details>

---

### 3. Create Server API

**Task:** Create an API layer that exposes the services to the components, facilitating interaction between the client and server logic.

**Why:** An API layer organizes your server functions, making them accessible to your React components, similar to how you'd use services and controllers in Angular.

**Hints:**

- **Controllers:**
  - Create controllers that call the service functions.
  - Ensure they handle any necessary request/response transformations.
- **API Export:**
  - Organize the controllers under an `api` object for easy import and use in components.

**Example for `game.controller.ts`:**

```typescript
// src/server/controllers/game.controller.ts

"use server";

import { gameService } from "../services/game.service";

export const create = async () => {
  // TODO: Call the service function to create a new game
};

export const getById = async (id: number) => {
  // TODO: Call the service function to get a game by ID
};
```

**Solution Code for `game.controller.ts`:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **"use server":**
  - Indicates that these functions are server-side only.
- **Imports:**
  - Imports `gameService` to use its methods.
- **Controller Functions:**
  - `create`: Exposes the `create` method from `gameService`.
  - `getById`: Exposes the `getById` method from `gameService`.

</details>

Similarly, create `guess.controller.ts` and `api.ts`.

**Solution Code for `guess.controller.ts`:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **"use server":**
  - Indicates that these functions are server-side only.
- **Imports:**
  - Imports `guessService` to use its methods.
- **Controller Functions:**
  - `create`: Exposes the `create` method from `guessService`.
  - `findByGameId`: Exposes the `findByGameId` method from `guessService`.

</details>

**Solution Code for `api.ts`:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **Imports:**
  - Imports all exports from `game.controller` and `guess.controller` as `games` and `guesses`.
- **API Object:**
  - Organizes the controllers under the `api` object for easy access.

</details>

---

### 4. Update the Home Page

**Task:** Modify the home page to allow users to start a new game by creating a "New Game" button.

**Why:** Users need a way to initiate a new game session, similar to navigating to a new route in Angular when starting a new game.

**Hints:**

- **Client-Side Interactivity:**
  - Use `"use client";` at the top since the component will handle events.
- **Router Navigation:**
  - Use Next.js' `useRouter` hook to navigate programmatically.
- **Event Handling:**
  - On button click, call the API to create a new game and navigate to the game page.

**Example:**

```typescript
// src/app/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { api } from "~/server/api";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          // TODO: Create a new game and navigate to the game page
        }}
      >
        New Game
      </Button>
    </main>
  );
}
```

**Helpful Links:**

- [Next.js useRouter Hook](https://nextjs.org/docs/api-reference/next/router#userouter)
- [Handling Events in React](https://reactjs.org/docs/handling-events.html)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **"use client":**
  - Enables client-side rendering for event handling.
- **Imports:**
  - `useRouter` for navigation.
  - `Button` component for UI.
  - `api` to access the game creation method.
- **Event Handling:**
  - On button click, calls `api.games.create()` to create a new game.
  - Uses `router.push()` to navigate to the new game's page.
- **Styling:**
  - Centers the button using Tailwind CSS classes.

</details>

---

### 5. Update the Game Page

**Task:** Modify the game page to fetch and display the game's data, including previous guesses.

**Why:** The game page needs to reflect the current state of the game, similar to fetching and displaying data in an Angular component.

**Hints:**

- **Data Fetching:**
  - Use server-side functions to fetch game data.
- **Props Passing:**
  - Pass the game ID and guesses to the `GameBoard` component.
- **Type Definitions:**
  - Ensure the component's props are correctly typed.

**Example:**

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";
import { api } from "~/server/api";

export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // TODO: Fetch the guesses for the current game
  // TODO: Pass the game ID and guesses to the GameBoard component

  return (
    <div className="flex h-full items-center justify-center">
      {/* Render the GameBoard component with appropriate props */}
    </div>
  );
}
```

**Helpful Links:**

- [Next.js Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
- [Passing Props in React](https://reactjs.org/docs/components-and-props.html)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

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

_Comments:_

- **Imports:**
  - `GameBoard` component to display the game board.
  - `api` to fetch game data.
- **Async Function:**
  - The component is an async function to allow data fetching.
- **Data Fetching:**
  - Calls `api.guesses.findByGameId(gameId)` to get the guesses.
- **Rendering:**
  - Passes `gameId` and `guesses` to `GameBoard` as props.
- **Styling:**
  - Centers the game board using Tailwind CSS classes.

</details>

---

### 6. Update the `GameBoard` Component

**Task:** Modify the `GameBoard` component to accept and use the new props: `gameId` and `guesses`.

**Why:** The component needs to display real game data and handle user interactions accordingly, similar to data-bound components in Angular.

**Hints:**

- **Props Interface:**
  - Define a TypeScript type or interface for the component's props.
- **Component Update:**
  - Use the `guesses` prop to render the `GuessList`.
  - Pass `gameId` to `GuessInput` for submitting new guesses.

**Example:**

```typescript
// src/components/game-board.tsx

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  // TODO: Define the type for guesses
};

export const GameBoard = ({ gameId, guesses }: GameBoardProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Render GuessList and GuessInput with appropriate props */}
    </div>
  );
};
```

**Helpful Links:**

- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [React Props](https://reactjs.org/docs/components-and-props.html)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
// src/components/game-board.tsx

import { type api } from "~/server/api";
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

// Define the props type for GameBoard
type GameBoardProps = {
  gameId: number;
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

// GameBoard component that displays the game board
export const GameBoard = ({ gameId, guesses }: GameBoardProps) => {
  return (
    // Use flex layout to stack components vertically with spacing
    <div className="flex flex-col gap-3">
      {/* Render the list of previous guesses */}
      <GuessList guesses={guesses} />
      {/* Render the input component for new guesses */}
      <GuessInput gameId={gameId} />
    </div>
  );
};
```

_Comments:_

- **Imports:**
  - `api` type for typing the `guesses` prop.
  - `GuessInput` and `GuessList` components.
- **Props Type Definition:**
  - `gameId`: The ID of the current game.
  - `guesses`: The list of guesses fetched from the API.
- **Component Structure:**
  - Renders `GuessList` with the `guesses` prop.
  - Renders `GuessInput` with the `gameId` prop.
- **Styling:**
  - Arranges components vertically with gaps using Tailwind CSS classes.

</details>

---

### 7. Update the `GuessInput` Component

**Task:** Modify the `GuessInput` component to submit guesses to the server when the user presses Enter.

**Why:** The component needs to interact with the server to store guesses, similar to submitting form data in Angular.

**Hints:**

- **Props Interface:**
  - Accept `gameId` as a prop.
- **Event Handling:**
  - On Enter key press, call the API to submit the guess.
- **State Management:**
  - Maintain the input state and clear it after submission.

**Example:**

```typescript
// src/components/guess-input.tsx

"use client";

import { useState } from "react";
import { InputOTP } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // TODO: Submit the guess to the server
          // Clear the input after submission
        }
      }}
    >
      {/* Render the input slots */}
    </InputOTP>
  );
};
```

**Helpful Links:**

- [React useState Hook](https://reactjs.org/docs/hooks-state.html)
- [Handling Events in React](https://reactjs.org/docs/handling-events.html)

**Solution Code:**

<details>
<summary>Click to reveal solution</summary>

```typescript
// src/components/guess-input.tsx

"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useState } from "react";

import { api } from "~/server/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

// Define the props type for GuessInput
type GuessInputProps = {
  gameId: number;
};

// GuessInput component for entering guesses
export const GuessInput = ({ gameId }: GuessInputProps) => {
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5} // Limit input to 5 characters
      pattern={REGEXP_ONLY_CHARS} // Allow only alphabetic characters
      value={guess} // Bind the input value to the state
      onChange={(value) => setGuess(value)} // Update state on change
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // Submit the guess to the server
          await api.guesses.create(guess, gameId);
          // Clear the input field after submission
          setGuess("");
        }
      }}
    >
      <InputOTPGroup>
        {/* Create 5 input slots for each character in the guess */}
        {[...Array(5)].map((_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-12 w-12 text-2xl uppercase"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

_Comments:_

- **"use client":**
  - Enables client-side rendering for interactivity.
- **Imports:**
  - `useState` for state management.
  - `api` to submit the guess.
  - `InputOTP` components for the input UI.
- **Props:**
  - `gameId` to associate the guess with the correct game.
- **Event Handling:**
  - On Enter key press, calls `api.guesses.create()` to submit the guess.
  - Clears the input field after submission.
- **State Management:**
  - Uses `guess` state to track the current input.
- **Input Component:**
  - Renders 5 input slots for the guess letters.

</details>

---

### 8. Update the `GuessList` and `GuessItem` Components

**Task:** Modify these components to work with the new guess data structure returned from the server.

**Why:** They need to display actual guess data, including results, similar to rendering server data in Angular components.

**Hints:**

- **Type Adjustments:**
  - Update the props to reflect the data structure of the guesses.
- **Data Rendering:**
  - Use the guess data to render each guess item.

**Example for `GuessList`:**

```typescript
// src/components/guess-list.tsx

import { GuessItem } from "./guess-item";

type GuessListProps = {
  // TODO: Define the type for guesses
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Map over the guesses and render GuessItem components */}
    </div>
  );
};
```

**Solution Code for `GuessList`:**

<details>
<summary>Click to reveal solution</summary>

```typescript
// src/components/guess-list.tsx

"use client";

import { type api } from "~/server/api";
import { GuessItem } from "./guess-item";

// Define the props type for GuessList
type GuessListProps = {
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

// GuessList component to display the list of guesses
export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Iterate over the guesses array */}
      {guesses.map((guess) => (
        // Render a GuessItem for each guess
        <GuessItem key={guess.id} guess={guess} />
      ))}
    </div>
  );
};
```

_Comments:_

- **Imports:**
  - `api` type for typing the `guesses` prop.
  - `GuessItem` component.
- **Props Type Definition:**
  - `guesses`: An array of guess objects from the API.
- **Rendering:**
  - Maps over `guesses` and renders a `GuessItem` for each.
  - Uses `guess.id` as the `key` prop.

</details>

**Solution Code for `GuessItem`:**

<details>
<summary>Click to reveal solution</summary>

```typescript
// src/components/guess-item.tsx

"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

// Define the props type for GuessItem
type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

// GuessItem component to display an individual guess
export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup>
        {/* Create an input slot for each character in the guess */}
        {[0, 1, 2, 3, 4].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className={cn("h-12 w-12 text-2xl uppercase")}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

_Comments:_

- **Imports:**
  - `api` type for typing the `guess` prop.
  - `cn` utility function for class names.
  - `InputOTP` components.
- **Props Type Definition:**
  - `guess`: An individual guess object from the API.
- **Rendering:**
  - Uses `InputOTP` in `readOnly` mode to display the guess.
  - Renders input slots for each character.
- **Styling:**
  - Applies consistent styling to the input slots.

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

   ![New Game Screenshot](img/5.png)

   - Navigate to `http://localhost:3000` in your web browser.
   - You should see a "New Game" button on the home page.
   - Click the button to create a new game.
   - You should be redirected to a game page with a unique game ID (e.g., `http://localhost:3000/game/1`).

3. **Interact with the Game Board:**

   ![Game Board Screenshot](img/6.png)

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

**If everything works correctly, congratulations!** You've successfully implemented the core game logic for your Wordle clone.

---

## Next Steps

In the next section, we'll focus on creating an on-screen keyboard component and integrating it with the game logic to enhance the user experience. This will involve:

- **Building the Keyboard Component:**
  - We'll create an interactive on-screen keyboard.
- **State Management:**
  - Update the game state based on user interactions with the keyboard.
- **UI Feedback:**
  - Provide visual feedback for correct, incorrect, and partially correct letters.

---
