# 06: Game Over Implementation

Welcome to the sixth section of our tutorial! In this part, you'll implement game over logic in your Wordle clone. This includes handling game completion, displaying results, and allowing users to start a new game. If you're familiar with Angular/Spring Boot, you'll find parallels in how we manage state and user interactions in a Next.js/React environment.

## Exercise Objectives

- **Update** the game page to handle game status.
- **Modify** the `GameBoard` component to display game results.
- **Create** a `GameResults` component for win/lose messages.
- **Develop** a custom hook for creating new games.
- **Adjust** the home page to use the new game creation hook.
- **Enhance** the guess service to handle game completion logic.

---

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-05-word-validation` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-05-word-validation
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

Once you've completed these steps, you're ready to implement the game over logic.

---

## Tasks and Hints

### 1. Update the Game Page

**Task:** Modify the game page to fetch both the game status and guesses, and conditionally render the keyboard based on the game status.

**Why:** To determine when the game is over and to display or hide certain components accordingly, similar to conditionally displaying elements in Angular templates.

**Instructions:**

- **Fetch** both the game and guesses data.
- **Pass** the game status to the `GameBoard` component.
- **Conditionally render** the keyboard based on the game's status.

**Example:**

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";
import { GuessKeyboard } from "~/components/guess-keyboard";
import { GuessProvider } from "~/lib/store/guess-provider";
import { api } from "~/server/api";

// This is a server component; it does not have "use client" at the top
// We can fetch data directly from the server inside this component
export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // Fetch both game and guesses data from the server
  const game = await api.games.getById(gameId);
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    <GuessProvider>
      <div className="flex h-full flex-col items-center gap-6">
        <div className="flex flex-1 items-center justify-center">
          {/* Pass game status to GameBoard */}
          <GameBoard gameId={gameId} status={game.status} guesses={guesses} />
        </div>
        {/* Conditionally render the keyboard only if the game is in progress */}
        {game.status === "in_progress" && (
          <div className="flex w-full max-w-3xl items-center">
            <GuessKeyboard gameId={gameId} />
          </div>
        )}
      </div>
    </GuessProvider>
  );
}
```

**Comments:**

- **Data Fetching:**
  - Fetches the game details (`game`) and the list of guesses (`guesses`) using the `api`.
- **Passing Props:**
  - Passes `status` to the `GameBoard` component to inform it about the game's current state.
- **Conditional Rendering:**
  - Uses `{game.status === "in_progress" && ...}` to render the `GuessKeyboard` only when the game is not over.

---

### 2. Update the `GameBoard` Component

**Task:** Modify the `GameBoard` component to handle different game statuses and incorporate the new `GameResults` component.

**Why:** To display the appropriate content based on whether the game is in progress, won, or lost, similar to using `*ngIf` in Angular templates.

**Instructions:**

- **Adjust** the component to accept the `status` prop.
- **Display** the `GuessInput` only if the game is in progress.
- **Include** the `GameResults` component to show game outcomes.

**Example:**

```typescript
// src/components/game-board.tsx

import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GameResults } from "./game-results";
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  status: (typeof games.status.enumValues)[number];
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameBoard = ({ gameId, status, guesses }: GameBoardProps) => {
  return (
    <div className="flex grow flex-col items-center gap-6">
      {/* Always show the list of guesses */}
      <GuessList guesses={guesses} />
      {/* Only show GuessInput if the game is still in progress */}
      {status === "in_progress" && <GuessInput gameId={gameId} />}
      {/* Show game results when the game is over */}
      <GameResults status={status} />
    </div>
  );
};
```

**Comments:**

- **Props Update:**
  - Accepts `status` as a prop to determine the game's current state.
- **Conditional Rendering:**
  - Renders `GuessInput` only if `status` is `"in_progress"`.
  - Includes `GameResults` component to display messages when the game is over.

---

### 3. Create the `GameResults` Component

**Task:** Develop a `GameResults` component to display win or lose messages and provide a "Play Again" button.

**Why:** To enhance user experience by giving immediate feedback upon game completion, similar to showing alerts or modals in Angular.

**Instructions:**

- **Create** a new file `src/components/game-results.tsx`.
- **Handle** different game statuses (`won`, `lost`, `in_progress`).
- **Implement** a "Play Again" button using a custom hook.

**Example:**

```typescript
// src/components/game-results.tsx

"use client";

import { useCreateGame } from "~/lib/hooks/use-create-game";
import { type games } from "~/server/db/schema";

import { Button } from "./ui/button";

type GameResultsProps = {
  status: (typeof games.status.enumValues)[number];
};

// Separate component for the "Play Again" button
const PlayAgainButton = () => {
  const createGame = useCreateGame();

  return (
    <Button size="lg" onClick={createGame}>
      Play again!
    </Button>
  );
};

export const GameResults = ({ status }: GameResultsProps) => {
  // Use a switch statement to handle different game statuses
  switch (status) {
    case "in_progress":
      return null; // Don't show anything if the game is still in progress
    case "won":
      return (
        <div className="flex flex-col gap-6">
          <div className="text-3xl font-bold text-green-400">
            Bam! You won! 🎉
          </div>
          <PlayAgainButton />
        </div>
      );
    case "lost":
      return (
        <div className="flex flex-col gap-6">
          <div className="text-3xl font-bold text-red-400">You lost! 😭</div>
          <PlayAgainButton />
        </div>
      );
  }
};
```

**Comments:**

- **"use client":**
  - Indicates that this component is client-side because it uses hooks.
- **PlayAgainButton Component:**
  - Uses `useCreateGame` hook to start a new game when clicked.
- **GameResults Component:**
  - Uses a `switch` statement to render different content based on `status`.
  - Displays appropriate messages and the `PlayAgainButton` when the game is over.

---

### 4. Create a Custom Hook for Game Creation

**Task:** Develop a `useCreateGame` hook that handles creating a new game and navigating to it.

**Why:** To encapsulate the game creation logic, making it reusable and keeping components clean, similar to services in Angular.

**Instructions:**

- **Create** a new file `src/lib/hooks/use-create-game.ts`.
- **Use** Next.js's `useRouter` for navigation.
- **Implement** the game creation logic using the API.

**Example:**

```typescript
// src/lib/hooks/use-create-game.ts

import { useRouter } from "next/navigation";

import { api } from "~/server/api";

export const useCreateGame = (withRedirect = true) => {
  const router = useRouter();

  return async () => {
    // Create a new game using the API
    const game = await api.games.create();

    if (withRedirect) {
      // Redirect to the new game page if withRedirect is true
      router.push(`/game/${game.id}`);
    }

    return game;
  };
};
```

**Comments:**

- **Parameters:**
  - `withRedirect`: Determines whether to navigate to the new game after creation.
- **Functionality:**
  - Creates a new game by calling `api.games.create()`.
  - Uses `router.push` to navigate to the new game's page.
- **Reusability:**
  - Can be used in multiple components where game creation is needed.

---

### 5. Update the Home Page

**Task:** Modify the home page to use the `useCreateGame` hook, simplifying the code.

**Why:** To utilize the custom hook for cleaner code and centralized logic, similar to using services in Angular components.

**Instructions:**

- **Update** `src/app/page.tsx`.
- **Replace** existing game creation logic with the `useCreateGame` hook.

**Example:**

```typescript
// src/app/page.tsx

"use client";

import { Button } from "~/components/ui/button";
import { useCreateGame } from "~/lib/hooks/use-create-game";

export default function HomePage() {
  // Use the custom hook to create a new game
  const createGame = useCreateGame();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          await createGame();
          // No need to handle navigation here; it's done in the hook
        }}
      >
        New game
      </Button>
    </main>
  );
}
```

**Comments:**

- **Imports:**
  - Imports `useCreateGame` to handle game creation.
- **Event Handling:**
  - On button click, calls `createGame()` without worrying about navigation logic.
- **Simplification:**
  - Reduces the code in the component by offloading logic to the custom hook.

---

### 6. Update the Guess Service

**Task:** Enhance the guess service to determine when the game is won or lost and update the game status accordingly.

**Why:** To implement server-side logic for game completion, similar to business logic in a Spring Boot application.

**Instructions:**

- **Update** `src/server/services/guess.service.ts`.
- **Check** for win or loss conditions after each guess.
- **Update** the game's status in the database.
- **Trigger** revalidation of the game page to reflect changes.

**Example:**

```typescript
// src/server/services/guess.service.ts

import { asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { games, guesses } from "../db/schema";
import { gameService } from "./game.service";

// ... (previous code remains the same)

const create = async (guess: string, gameId: number) => {
  const result = await checkGuess(guess, gameId);

  const [createdGuess] = await db
    .insert(guesses)
    .values({
      gameId,
      guess: guess.toUpperCase(),
      result,
    })
    .returning();

  if (!createdGuess) {
    throw new Error("Failed to create guess");
  }

  const count = await countByGameId(gameId);

  // Check for game over conditions
  if (count === 6 && createdGuess.result.includes("X")) {
    // If it's the 6th guess and not all correct, the game is lost
    await gameService.update(gameId, "lost");
  }

  if (createdGuess.result === "CCCCC") {
    // If all letters are correct, the game is won
    await gameService.update(gameId, "won");
  }

  // Trigger a revalidation of the game page to reflect the new state
  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

// ... (rest of the code remains the same)

const countByGameId = async (gameId: number) => {
  // Count the number of guesses for a specific game
  const [gameCount] = await db
    .select({ count: count() })
    .from(guesses)
    .where(eq(guesses.gameId, gameId));

  if (!gameCount) {
    throw new Error("Error counting guesses");
  }

  return gameCount.count;
};

export const guessService = {
  create,
  findByGameId,
};
```

**Comments:**

- **Game Over Logic:**
  - Checks if the player has made 6 guesses and hasn't guessed the word correctly to determine a loss.
  - Checks if the guess result is `"CCCCC"` (all letters correct) to determine a win.
- **Updating Game Status:**
  - Calls `gameService.update` to update the game's status in the database.
- **Revalidation:**
  - Uses `revalidatePath` to refresh the game page so that the client sees the updated game status.
- **Helper Function `countByGameId`:**
  - Counts the number of guesses made in the game to check against the maximum allowed guesses.

---

## Checking Your Progress

Now that you've implemented the game over logic and new game creation, it's time to test your application.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Start a New Game:**

   - Navigate to `http://localhost:3000`.
   - Click the "New game" button on the home page.
   - You should be redirected to a new game page (e.g., `http://localhost:3000/game/1`).

3. **Play Through a Game:**

   - **Win Scenario:**
     ![Game Won Screenshot](img/10.png)
     - Guess the correct word within six attempts.
     - The keyboard should disappear upon winning.
     - A victory message ("Bam! You won! 🎉") should be displayed.
     - A "Play again!" button should appear.
   - **Lose Scenario:**
     ![Game Over Screenshot](img/9.png)
     - Make six incorrect guesses.
     - The keyboard should disappear upon losing.
     - A losing message ("You lost! 😭") should be displayed.
     - A "Play again!" button should appear.

4. **Check Game Status Persistence:**

   - Refresh the page after winning or losing.
   - The game over state should persist, showing the same message and not resetting the game.

5. **Start a New Game from Game Over State:**

   - Click the "Play again!" button.
   - You should be redirected to a new game page with a fresh board and keyboard.

If everything works as expected, congratulations! You've successfully implemented game over logic in your Wordle clone.

---

## Next Steps

In the next section, we'll focus on adding final touches to our game, such as:

- **UI Enhancements:**

  - Adding animations for guess submissions.
  - Improving the overall styling and responsiveness.

---
