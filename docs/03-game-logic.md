# Section 03: Game Logic Implementation

Welcome to the game logic implementation section of our Wordle clone! In this part, we'll add the core game mechanics, state management, and server-side logic to make our game functional. If you're coming from a Spring Boot/Angular background, you'll find some familiar concepts here, implemented in a Next.js/React environment.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-02-game-board` branch. This contains all the work we've done in setting up our game board UI.

To get up to speed:

1. Switch to the `checkpoint-02-game-board` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to implement the game logic.

## Step 1: Update Utility Functions

First, let's add the `getRandomWord` function to our utility file. This function will be used to select a random word for each new game, similar to how you might use a utility service in Spring Boot.

### Exercise 1:

Before looking at the solution, try to implement the `getRandomWord` function yourself. Consider how you would:

1. Import an array of words
2. Select a random word from the array
3. Handle potential errors

Update `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { words } from "./words"; // Similar to importing a constant or enum in Angular

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function acts like a utility method in a Spring Boot service
export function getRandomWord() {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * words.length);

  // Get the word at the random index
  const word = words[randomIndex];

  // Error handling, similar to throwing exceptions in Java
  if (!word) {
    throw new Error("Error retrieving random word");
  }

  return word;
}
```

Make sure you have a `words.ts` file in the same directory with an array of words to choose from.

## Step 2: Implement Server-Side Logic

Now, let's add the necessary server-side logic to handle game creation, guesses, and game state. This is similar to creating service classes in Spring Boot.

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

// This service is similar to a @Service class in Spring Boot
export const getById = async (id: number) => {
  // Using Drizzle ORM, similar to using JPA in Spring Boot
  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
  });

  // Error handling, similar to throwing a NotFoundException in Spring Boot
  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

const create = async () => {
  // Get a random word for the new game
  const randomWord = getRandomWord();

  // Insert a new game into the database
  // This is similar to using a repository in Spring Boot to create an entity
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
  status: (typeof games.status.enumValues)[number],
) => {
  // Update the game status
  // This is similar to using a repository method to update an entity in Spring Boot
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

// Exporting as an object, similar to how you might export a service class in Angular
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

// This function is similar to a private method in a Spring Boot service
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
  // This is similar to using Java streams in Spring Boot
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
  // This is similar to using a repository method to create an entity in Spring Boot
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

  // This is similar to triggering a view update in Angular
  revalidatePath(`/game/${gameId}`);

  return createdGuess;
};

const findByGameId = async (gameId: number) => {
  // Retrieve all guesses for a specific game
  // This is similar to a findAll method in a Spring Boot repository
  return db.query.guesses.findMany({
    where: eq(guesses.gameId, gameId),
    orderBy: [asc(guesses.createdAt)],
  });
};

// Exporting as an object, similar to how you might export a service class in Angular
export const guessService = {
  create,
  findByGameId,
};
```

## Step 3: Create Server API

Now that we have our services, let's create an API layer to use them in our components. This is similar to creating controllers in Spring Boot.

### Exercise 3:

Before implementing the controllers, think about how you would structure them. Consider:

1. What endpoints do we need?
2. How will these controllers use the services we just created?

Create `src/server/controllers/game.controller.ts`:

```typescript
"use server";

import { gameService } from "../services/game.service";

// These functions are similar to controller methods in Spring Boot
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

// These functions are similar to controller methods in Spring Boot
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

// This api object is similar to how you might organize your API in Angular services
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

// This component is similar to a component in Angular
export default function HomePage() {
  // useRouter is similar to Angular's Router service
  const router = useRouter();

  return (
    <main className="flex h-full items-center justify-center">
      <Button
        onClick={async () => {
          // Create a new game
          // This is similar to calling an API service in Angular
          const game = await api.games.create();
          // Navigate to the game page
          // This is similar to navigating in Angular
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

// This is similar to a component in Angular that fetches data and passes it to child components
export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // Fetch guesses for the current game
  // This is similar to using a service to fetch data in Angular
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

// This type definition is similar to defining an interface for component props in Angular
type GameBoardProps = {
  gameId: number;
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

// This component is similar to a presentational component in Angular
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

// This type definition is similar to defining an interface for component props in Angular
type GuessInputProps = {
  gameId: number;
};

// This component is similar to a form component in Angular
export const GuessInput = ({ gameId }: GuessInputProps) => {
  // This state is similar to using component state in Angular
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
          // This is similar to calling an API service in Angular
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

// This type definition is similar to defining an interface for component props in Angular
type GuessListProps = {
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

// This component is similar to a list component in Angular
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

// This type definition is similar to defining an interface for component props in Angular
type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

// This component is similar to a presentational component in Angular
const GuessItemSlot = ({ index, result }: { index: number; result: string }) => {
  return (
    <InputOTPSlot
      index={index}
      className={cn(
        "h-12 w-12 text-2xl uppercase",
        result === "C" && "bg-green-500 text-white",
        result === "~" && "bg-yellow-500 text-white",
        result === "X" && "bg-gray-500 text-white"
      )}
    />
  );
};

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} result={guess.result[index]} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

In this component:

- We define a `GuessItemSlot` component that renders each letter of the guess with appropriate styling based on the result.
- The `GuessItem` component uses the `InputOTP` component to display the guess, mapping over each letter and applying the appropriate styling.

## Conclusion

Great job! You've now implemented the core game logic for your Wordle clone. This includes:

1. Creating new games
2. Submitting and validating guesses
3. Storing and retrieving game state
4. Updating the UI based on game state

Here's a summary of what we've accomplished:

1. We created utility functions to handle random word selection.
2. We implemented server-side logic with services for games and guesses, similar to how you might structure a Spring Boot application.
3. We set up an API layer to interface between our server-side logic and our React components.
4. We updated our React components to use the new game logic, managing state and user interactions.

Some key differences you might have noticed if you're coming from a Spring Boot/Angular background:

- Instead of using dependency injection, we're importing our services and API functions directly.
- React's component model is similar to Angular's, but with some differences in how props are passed and state is managed.
- Next.js provides both server-side and client-side rendering capabilities, which we've utilized in different components.

In the next section, we'll focus on improving the user experience by:

1. Adding visual feedback for correct and incorrect guesses
2. Implementing game over conditions
3. Adding a feature to start a new game after completion

Happy coding!
