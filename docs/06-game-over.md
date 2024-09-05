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

First, let's update our game page to fetch the game status and conditionally render the keyboard.

### Exercise 1:

Before looking at the solution, think about how you would implement this in Angular. How would you fetch the game status and conditionally render components?

Update `src/app/game/[gameId]/page.tsx`:

```typescript
import { GameBoard } from "~/components/game-board";
import { GuessKeyboard } from "~/components/guess-keyboard";
import { GuessProvider } from "~/lib/store/guess-provider";
import { api } from "~/server/api";

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
          <GameBoard gameId={gameId} status={game.status} guesses={guesses} />
        </div>
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

Here, we're fetching the game status and conditionally rendering the keyboard only if the game is in progress. This is similar to using `*ngIf` in Angular templates.

## Step 2: Update the GameBoard Component

Now, let's update our `GameBoard` component to handle different game states.

### Exercise 2:

Before implementing the changes, consider:

1. How will you display different content based on the game status?
2. How does this compare to using `ngSwitch` in Angular?

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
      <GuessList guesses={guesses} />
      {status === "in_progress" && <GuessInput gameId={gameId} />}
      <GameResults status={status} />
    </div>
  );
};
```

This component now conditionally renders the `GuessInput` and includes a new `GameResults` component based on the game status.

## Step 3: Create the GameResults Component

Let's create a new component to display the game results and a "Play Again" button.

### Exercise 3:

Before implementing the component, think about:

1. What different states does this component need to handle?
2. How will you trigger a new game?

Create a new file `src/components/game-results.tsx`:

```typescript
"use client";

import { useCreateGame } from "~/lib/hooks/use-create-game";
import { type games } from "~/server/db/schema";

import { Button } from "./ui/button";

type GameResultsProps = {
  status: (typeof games.status.enumValues)[number];
};

const PlayAgainButton = () => {
  const createGame = useCreateGame();

  return (
    <Button size="lg" onClick={createGame}>
      Play again!
    </Button>
  );
};

export const GameResults = ({ status }: GameResultsProps) => {
  switch (status) {
    case "in_progress":
      return null;
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

This component uses a switch statement to render different content based on the game status, similar to using `ngSwitch` in Angular. The `PlayAgainButton` uses a custom hook to create a new game.

## Step 4: Create a Custom Hook for Game Creation

Let's create a custom hook to handle game creation and navigation.

### Exercise 4:

Before implementing the hook, consider:

1. How will you handle navigation after creating a game?
2. How does this compare to using a service and router in Angular?

Create a new file `src/lib/hooks/use-create-game.ts`:

```typescript
import { useRouter } from "next/navigation";

import { api } from "~/server/api";

export const useCreateGame = (withRedirect = true) => {
  const router = useRouter();

  return async () => {
    const game = await api.games.create();

    if (withRedirect) {
      router.push(`/game/${game.id}`);
    }

    return game;
  };
};
```

This hook encapsulates the logic for creating a new game and optionally navigating to it. It's similar to combining a service method and navigation in Angular.

## Step 5: Update the Home Page

Now, let's update our home page to use the new `useCreateGame` hook.

### Exercise 5:

Before updating the component, think about how this simplifies the home page compared to the previous implementation.

Update `src/app/page.tsx`:

```typescript
"use client";

import { Button } from "~/components/ui/button";
import { useCreateGame } from "~/lib/hooks/use-create-game";

export default function HomePage() {
  const createGame = useCreateGame();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          await createGame();
        }}
      >
        New game
      </Button>
    </main>
  );
}
```

This update simplifies the home page by using the `useCreateGame` hook, which encapsulates the game creation and navigation logic.

## Step 6: Update the Guess Service

Finally, let's update our guess service to handle game completion logic.

### Exercise 6:

Before updating the service, consider:

1. How will you determine if a game is won or lost?
2. How does this compare to updating entity status in a Spring Boot service?

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
    await gameService.update(gameId, "lost");
  }

  if (createdGuess.result === "CCCCC") {
    await gameService.update(gameId, "won");
  }

  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

// ... (rest of the code remains the same)

const countByGameId = async (gameId: number) => {
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

This update adds logic to check for game over conditions after each guess. It's similar to updating an entity's status in a Spring Boot service.

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
