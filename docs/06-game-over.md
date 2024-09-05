# Section 06: Game Over Implementation

Welcome to the game over implementation section of our Wordle clone! In this part, we'll add logic to handle game completion, display results, and allow users to start a new game. If you're coming from a Spring Boot/Angular background, you'll find some familiar concepts here, implemented in a Next.js/React environment.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-05-word-validation` branch. This contains all the work we've done in implementing word validation.

To get up to speed:

1. Switch to the `checkpoint-05-word-validation` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to implement the game over logic.

## Step 1: Update the Game Page

### Exercise 1:

Before looking at the solution, try to update the game page yourself. Consider:

1. How would you fetch both the game status and guesses?
2. How would you conditionally render the keyboard based on the game status?
3. What props would you need to pass to the `GameBoard` component?

Update `src/app/game/[gameId]/page.tsx`:

```typescript
import { GameBoard } from "~/components/game-board";
import { GuessKeyboard } from "~/components/guess-keyboard";
import { GuessProvider } from "~/lib/store/guess-provider";
import { api } from "~/server/api";

// This is a server component it does not have "use client" at the top
// This means we can fetch data directly from the server inside this component
export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // Fetch both game and guesses data
  const game = await api.games.getById(gameId);
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    <GuessProvider>
      <div className="flex h-full flex-col items-center gap-6">
        <div className="flex flex-1 items-center justify-center">
          {/* Pass game status to GameBoard */}
          <GameBoard gameId={gameId} status={game.status} guesses={guesses} />
        </div>
        {/* Conditionally render keyboard only if game is in progress */}
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

## Step 2: Update the GameBoard Component

### Exercise 2:

Before implementing the changes, try to update the `GameBoard` component yourself. Consider:

1. How will you handle different game statuses?
2. When should the `GuessInput` be displayed?
3. How will you incorporate the new `GameResults` component?

Update `src/components/game-board.tsx`:

```typescript
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
      {/* Show game results (will be null if game is in progress) */}
      <GameResults status={status} />
    </div>
  );
};
```

## Step 3: Create the GameResults Component

### Exercise 3:

Before implementing the component, try to create the `GameResults` component yourself. Consider:

1. What different game statuses do you need to handle?
2. How will you design the UI for win and lose scenarios?
3. How will you implement the "Play Again" functionality?

Create a new file `src/components/game-results.tsx`:

```typescript
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

## Step 4: Create a Custom Hook for Game Creation

### Exercise 4:

Before implementing the hook, try to create the `useCreateGame` hook yourself. Consider:

1. How will you handle game creation?
2. How will you manage navigation after creating a game?
3. How can you make the hook flexible for different use cases?

Create a new file `src/lib/hooks/use-create-game.ts`:

```typescript
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

## Step 5: Update the Home Page

### Exercise 5:

Before updating the component, try to modify the home page yourself. Consider:

1. How will you use the new `useCreateGame` hook?
2. How does this simplify the home page compared to the previous implementation?

Update `src/app/page.tsx`:

```typescript
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
          // No need to handle navigation here, it's done in the hook
        }}
      >
        New game
      </Button>
    </main>
  );
}
```

## Step 6: Update the Guess Service

### Exercise 6:

Before updating the service, try to modify the guess service yourself. Consider:

1. How will you determine if a game is won or lost?
2. At what point should you update the game status?
3. How will you ensure the UI is updated after a game status change?

Update `src/server/services/guess.service.ts`:

```typescript
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

## Checking Your Progress

After implementing the game over logic and new game creation, you can verify your progress by running the application and checking the following:

1. **Start the development server**:
   Run `yarn dev` to start the development server.

2. **Start a new game**:

   - Open your browser and go to `http://localhost:3000`.
   - Click the "New game" button on the home page.
   - You should be redirected to a new game page (e.g., `http://localhost:3000/game/1`).

3. **Play through a game**:

   - Make guesses until you either win or lose the game.
   - If you win (guess the correct word):
     - The keyboard should disappear.
     - You should see a victory message ("Bam! You won! 🎉").
     - A "Play again!" button should appear.
   - If you lose (make 6 incorrect guesses):
     - The keyboard should disappear.
     - You should see a losing message ("You lost! 😭").
     - A "Play again!" button should appear.

4. **Check game status persistence**:

   - After winning or losing a game, refresh the page.
   - The game over state (won or lost) should still be displayed, not a new game.

5. **Start a new game from game over state**:
   - Click the "Play again!" button.
   - You should be redirected to a new game page with a fresh board and keyboard.

## Conclusion

Great job! You've now implemented game over logic for your Wordle clone. This enhancement includes:

1. Updating the game page to fetch and use the game status
2. Creating a `GameResults` component to display win/lose messages
3. Implementing a custom hook for creating new games
4. Updating the guess service to handle game completion logic

Key differences from Angular/Spring Boot you may have noticed:

- Instead of using `*ngIf` and `ngSwitch`, we use JavaScript conditionals and switch statements directly in our JSX.
- Custom hooks in React serve a similar purpose to services in Angular, encapsulating reusable logic.
- The `useRouter` hook in Next.js is similar to Angular's Router service for handling navigation.
- Server-side logic in Next.js (like our `guessService`) is more integrated with the frontend compared to a separate Spring Boot backend.

In the next section, we'll focus on adding some final polish to our game, such as animations and improved styling.

Happy coding!
