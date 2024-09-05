# Section 03: Game Logic Implementation

Welcome to the game logic implementation section of our Wordle clone! In this part, we'll add the core game mechanics, state management, and server-side logic to make our game functional.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-02-game-board` branch. This contains all the work we've done in setting up our game board UI.

To get up to speed:

1. Switch to the `checkpoint-02-game-board` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to implement the game logic.

## Step 1: Update Utility Functions

First, let's add the `getRandomWord` function to our utility file. This function will be used to select a random word for each new game.

### Exercise 1:

Before looking at the solution, try to implement the `getRandomWord` function yourself. Consider how you would:

1. Import an array of words
2. Select a random word from the array
3. Handle potential errors

Update `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { words } from "./words"; // Import the words array

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  if (!word) {
    throw new Error("Error retrieving random word");
  }
  return word;
}
```

## Step 2: Implement Server-Side Logic

Now, let's add the necessary server-side logic to handle game creation, guesses, and game state.

### Exercise 2:

Before implementing the full service, try to outline the methods you think we'll need for our game service. Consider:

1. Creating a new game
2. Retrieving a game by ID
3. Updating a game's status

Create `src/server/services/game.service.ts`:

```typescript
import { eq } from "drizzle-orm";

import { getRandomWord } from "~/lib/utils";

import { db } from "../db";
import { games } from "../db/schema";

export const getById = async (id: number) => {
  // Find a game by its ID
  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
  });

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

const create = async () => {
  // Get a random word for the new game
  const randomWord = getRandomWord();

  // Insert a new game into the database
  const [word] = await db
    .insert(games)
    .values({ word: randomWord.toUpperCase(), status: "in_progress" })
    .returning();

  if (!word) {
    throw new Error("Failed to create game");
  }

  return word;
};

export const update = async (
  id: number,
  status: (typeof games.status.enumValues)[number]
) => {
  // Update the game status
  const [game] = await db
    .update(games)
    .set({ status })
    .where(eq(games.id, id))
    .returning();

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

export const gameService = {
  create,
  getById,
  update,
};
```

Create `src/server/services/guess.service.ts`:

```typescript
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "../db";
import { games, guesses } from "../db/schema";

const checkGuess = async (guess: string, gameId: number) => {
  // Retrieve the game from the database
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (!game) {
    throw new Error("Game not found");
  }

  const actualWord = game.word.toUpperCase();
  const upperGuess = guess.toUpperCase();
  const result = new Array(5).fill("X");
  const charCount = new Map();

  // Count character occurrences in the actual word
  for (const char of actualWord) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Check for correct positions
  for (let i = 0; i < 5; i++) {
    if (upperGuess[i] === actualWord[i]) {
      result[i] = "C";
      charCount.set(upperGuess[i], charCount.get(upperGuess[i]) - 1);
    }
  }

  // Check for correct letters in wrong positions
  for (let i = 0; i < 5; i++) {
    if (result[i] !== "C" && charCount.get(upperGuess[i]) > 0) {
      result[i] = "~";
      charCount.set(upperGuess[i], charCount.get(upperGuess[i]) - 1);
    }
  }

  return result.join("");
};

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

  if (!createdGuess) {
    throw new Error("Failed to create guess");
  }

  // Trigger a revalidation of the game page
  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

const findByGameId = async (gameId: number) => {
  // Retrieve all guesses for a specific game
  return db.query.guesses.findMany({
    where: eq(guesses.gameId, gameId),
    orderBy: [asc(guesses.createdAt)],
  });
};

export const guessService = {
  create,
  findByGameId,
};
```

## Step 3: Create Server API

Now that we have our services, let's create an API layer to use them in our components.

### Exercise 3:

Before implementing the controllers, think about how you would structure them. Consider:

1. What endpoints do we need?
2. How will these controllers use the services we just created?

Create `src/server/controllers/game.controller.ts`:

```typescript
"use server";

import { gameService } from "../services/game.service";

export const create = async () => {
  // Create a new game
  return gameService.create();
};

export const getById = async (id: number) => {
  // Retrieve a game by ID
  return gameService.getById(id);
};
```

Create `src/server/controllers/guess.controller.ts`:

```typescript
"use server";

import { guessService } from "../services/guess.service";

export const create = async (guess: string, gameId: number) => {
  // Create a new guess
  return guessService.create(guess, gameId);
};

export const findByGameId = async (gameId: number) => {
  // Retrieve all guesses for a specific game
  return guessService.findByGameId(gameId);
};
```

Create `src/server/api.ts`:

```typescript
import * as games from "./controllers/game.controller";
import * as guesses from "./controllers/guess.controller";

// Export the API controllers
export const api = {
  games,
  guesses,
};
```

## Step 4: Update the Home Page

Now that we have our server-side logic in place, let's update our home page to allow users to start a new game.

### Exercise 4:

Before looking at the solution, try to implement the home page yourself. Consider:

1. How to create a new game when a button is clicked
2. How to navigate to the game page after creation

Update `src/app/page.tsx`:

```typescript
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
          // Create a new game
          const game = await api.games.create();
          // Navigate to the game page
          router.push(`/game/${game.id}`);
        }}
      >
        New game
      </Button>
    </main>
  );
}
```

## Step 5: Update the Game Page

Now, let's modify our game page to fetch and pass game data to the `GameBoard` component.

### Exercise 5:

Before implementing the game page, think about:

1. How to fetch the guesses for a specific game
2. How to pass this data to child components

Update `src/app/game/[gameId]/page.tsx`:

```typescript
import { GameBoard } from "~/components/game-board";
import { api } from "~/server/api";

export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // Fetch guesses for the current game
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    <div className="flex h-full items-center justify-center">
      <GameBoard gameId={gameId} guesses={guesses} />
    </div>
  );
}
```

## Step 6: Update the GameBoard Component

Modify the `GameBoard` component to accept and use the new props.

### Exercise 6:

Before updating the GameBoard component, consider:

1. What props does this component need?
2. How will you type these props?

Update `src/components/game-board.tsx`:

```typescript
import { type api } from "~/server/api";

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameBoard = ({ gameId, guesses }: GameBoardProps) => {
  return (
    <div className="flex flex-col gap-3">
      <GuessList guesses={guesses} />
      <GuessInput gameId={gameId} />
    </div>
  );
};
```

## Step 7: Update the GuessInput Component

Modify the `GuessInput` component to submit guesses to the server.

### Exercise 7:

Before updating the GuessInput component, think about:

1. How to manage the state of the input
2. How to submit a guess when the user presses Enter

Update `src/components/guess-input.tsx`:

```typescript
"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useState } from "react";

import { api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // Submit the guess when Enter is pressed
          await api.guesses.create(guess, gameId);
          // Clear the input after submitting
          setGuess("");
        }
      }}
    >
      <InputOTPGroup>
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

## Step 8: Update the GuessList and GuessItem Components

Modify these components to work with the new guess data structure.

### Exercise 8:

Before updating these components, consider:

1. How to iterate over the guesses and display them
2. How to style each guess based on its result

Update `src/components/guess-list.tsx`:

```typescript
"use client";

import { type api } from "~/server/api";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {guesses.map((guess) => (
        <GuessItem key={guess.id} guess={guess} />
      ))}
    </div>
  );
};
```

Update `src/components/guess-item.tsx`:

```typescript
"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

const GuessItemSlot = ({ index }: { index: number }) => {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase")}
    />
  );
};

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

## Checking Your Progress

After implementing the game logic, you can verify your progress by running the application and checking the following:

1. **Start the development server**:
   Run `yarn dev` to start the development server.

2. **Create a new game**:

   - Open your browser and navigate to `http://localhost:3000`.
   - You should see a "New game" button on the home page.
   - Click the button. You should be redirected to a game page (e.g., `http://localhost:3000/game/1`).

3. **Check the game board**:

   - On the game page, you should see an empty game board with an input field for guesses.

4. **Make guesses**:

   - Enter a 5-letter word in the input field and press Enter.
   - Your guess should appear on the game board above the input field.
   - You should be able to make multiple guesses, with each new guess appearing above the previous ones.

5. **Verify data persistence**:

   - After making a few guesses, refresh the game page.
   - Your previous guesses should still be visible on the game board.
   - This confirms that your guesses are being stored in the database.

6. **Start a new game**:

   - Navigate back to the home page and click "New game" again.
   - You should be taken to a new game page with a fresh, empty game board.

7. **Check for errors**:
   - Throughout this process, check your browser's console (F12 > Console tab).
   - There should be no error messages related to your game logic.

If you can complete all these steps without issues, congratulations! You've successfully implemented the core game logic for your Wordle clone. If you encounter any problems, review the code snippets provided in this chapter and make sure all components, services, and API routes are correctly implemented.

Remember, the key functionalities you've added in this section include:

- Creating new games
- Submitting and storing guesses
- Retrieving and displaying game state
- Persisting game data between page refreshes

In the next section, we'll build upon this foundation to create an on-screen keyboard, further enhancing the user experience of our Wordle clone. Keep up the great work!

## Conclusion

Great job! You've now implemented the core game logic for your Wordle clone. This includes:

1. Creating new games
2. Submitting and validating guesses
3. Storing and retrieving game state
4. Updating the UI based on game state

In the next section (Section 04: Keyboard), we'll focus on creating the on-screen keyboard component and integrating it with the game logic.
