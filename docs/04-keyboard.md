# Section 04: Keyboard Implementation

Welcome to the keyboard implementation section of our Wordle clone! In this part, we'll add an on-screen keyboard to enhance the user experience and provide an alternative input method. If you're coming from a Spring Boot/Angular background, you'll find some familiar concepts here, implemented in a Next.js/React environment.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-03-game-logic` branch. This contains all the work we've done in implementing the game logic.

To get up to speed:

1. Switch to the `checkpoint-03-game-logic` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to implement the on-screen keyboard.

## Step 1: Install Required Dependencies

First, let's install the necessary dependency for our keyboard component:

```bash
yarn add react-simple-keyboard
```

This library will provide us with a customizable on-screen keyboard component. In an Angular project, you might use a similar third-party library or create a custom component.

## Step 2: Create the GuessKeyboard Component

Now, let's create our keyboard component. This is similar to creating a new component in Angular.

### Exercise 1:

Before looking at the solution, try to outline the GuessKeyboard component yourself. Consider:

1. What props will it need?
2. How will it handle key presses?
3. How will it integrate with our existing guess state?

Create a new file `src/components/guess-keyboard.tsx`:

```typescript
"use client";

import "react-simple-keyboard/build/css/index.css";

import Keyboard from "react-simple-keyboard";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

// This type definition is similar to defining an interface for component inputs in Angular
type GuessKeyboardProps = {
  gameId: number;
};

// This component is similar to a custom form control in Angular
export const GuessKeyboard = ({ gameId }: GuessKeyboardProps) => {
  // useGuess is similar to using a shared service in Angular for state management
  const { guess, setGuess } = useGuess();

  return (
    <Keyboard
      theme="hg-theme-default !bg-secondary/75"
      buttonTheme={[
        {
          class:
            "!bg-background !text-foreground !border-none !shadow-none hover:!bg-secondary/50 active:!bg-white/25",
          buttons:
            "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M {delete} {enter}",
        },
      ]}
      layout={{
        default: [
          "Q W E R T Y U I O P {delete}",
          "A S D F G H J K L {enter}",
          "Z X C V B N M",
        ],
      }}
      // This onKeyPress function is similar to an event handler in Angular
      onKeyPress={async (input) => {
        if (input === "{delete}") {
          setGuess(guess.slice(0, -1));
          return;
        }

        if (input === "{enter}") {
          // This is similar to calling an API service in Angular
          await api.guesses.create(guess, gameId);
          setGuess("");
          return;
        }

        if (guess.length === 5) return;

        setGuess(guess + input);
      }}
    />
  );
};
```

In this component:

- We're using the `react-simple-keyboard` library to create an on-screen keyboard.
- We're using a custom hook `useGuess` to manage the current guess state (we'll create this hook later).
- The `onKeyPress` function handles key presses, updating the guess or submitting it when appropriate.

## Step 3: Create a Guess Context

To manage the current guess state across components, we'll create a context. This is similar to creating a shared service in Angular for state management.

### Exercise 2:

Before implementing the context, think about:

1. What data needs to be shared between components?
2. How will components interact with this shared state?

Create a new file `src/lib/store/guess-context.ts`:

```typescript
import { createContext } from "react";

// This type definition is similar to defining an interface for a service in Angular
export type GuessContext = {
  guess: string;
  setGuess: (guess: string) => void;
};

// This context is similar to a shared service in Angular
export const GuessContext = createContext<GuessContext>({
  guess: "",
  setGuess: () => undefined,
});
```

This context will provide the current guess and a function to update it to any component that needs it.

## Step 4: Create a Guess Provider

Now, let's create a provider component that will wrap our game components and provide the guess state to them. This is similar to providing a service at a component level in Angular.

### Exercise 3:

Before implementing the provider, consider:

1. How will you manage the guess state?
2. How will you provide this state to child components?

Create a new file `src/lib/store/guess-provider.tsx`:

```typescript
"use client";

import { useState } from "react";

import { GuessContext } from "./guess-context";

// This component is similar to a component that provides a service in Angular
export const GuessProvider = ({ children }: { children: React.ReactNode }) => {
  // This state is similar to a property in an Angular service
  const [guess, setGuess] = useState<string>("");

  return (
    <GuessContext.Provider value={{ guess, setGuess }}>
      {children}
    </GuessContext.Provider>
  );
};
```

This provider component manages the guess state and provides it to all child components via the `GuessContext`.

## Step 5: Create a useGuess Hook

To make it easy for components to access the guess state, let's create a custom hook. This is similar to how you might use a service in Angular.

### Exercise 4:

Before implementing the hook, think about:

1. How will components use this hook?
2. What will it return?

Create a new file `src/lib/hooks/use-guess.ts`:

```typescript
import { useContext } from "react";

import { GuessContext } from "../store/guess-context";

// This hook is similar to injecting a service in Angular
export const useGuess = () => {
  return useContext(GuessContext);
};
```

This hook provides a convenient way for components to access the guess state and update function.

## Step 6: Update the Game Page

Now, let's update our game page to use the `GuessProvider` and include our new `GuessKeyboard` component.

### Exercise 5:

Before updating the game page, consider:

1. Where should the `GuessProvider` be placed in the component tree?
2. How will you position the keyboard in the layout?

Update `src/app/game/[gameId]/page.tsx`:

```typescript
import { GameBoard } from "~/components/game-board";
import { GuessKeyboard } from "~/components/guess-keyboard";
import { GuessProvider } from "~/lib/store/guess-provider";
import { api } from "~/server/api";

// This component is similar to a page component in Angular
export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  // This is similar to calling a service method in Angular
  const guesses = await api.guesses.findByGameId(gameId);

  return (
    // GuessProvider is similar to providing a service at the component level in Angular
    <GuessProvider>
      <div className="flex h-full flex-col items-center gap-6">
        <div className="flex flex-1 items-center justify-center">
          <GameBoard gameId={gameId} guesses={guesses} />
        </div>
        <div className="flex w-full max-w-3xl items-center">
          <GuessKeyboard gameId={gameId} />
        </div>
      </div>
    </GuessProvider>
  );
}
```

This update wraps our game components with the `GuessProvider` and adds the `GuessKeyboard` component to the page.

## Step 7: Update the GameBoard Component

Let's make a small update to the `GameBoard` component to improve its layout.

### Exercise 6:

Before updating the component, think about:

1. How should the game board be positioned in relation to the new keyboard?
2. What CSS classes might you need to adjust?

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
    // Updated CSS classes for better layout
    <div className="flex grow flex-col items-center gap-3">
      <GuessList guesses={guesses} />
      <GuessInput gameId={gameId} />
    </div>
  );
};
```

## Step 8: Update the GuessInput Component

Finally, let's update the `GuessInput` component to use our new `useGuess` hook.

### Exercise 7:

Before updating the component, consider:

1. How will you replace the local state with the shared guess state?
2. How will this change the component's behavior?

Update `src/components/guess-input.tsx`:

```typescript
"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  // Using the useGuess hook instead of local state
  // This is similar to injecting a shared service in Angular
  const { guess, setGuess } = useGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          await api.guesses.create(guess, gameId);
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

This update replaces the local state with the shared guess state from our `GuessContext`.

## Checking Your Progress

As you implement the on-screen keyboard and related features, it's important to regularly check your progress. Here are some steps to verify that you've correctly implemented the functionality:

1. **Run the development server**:
   After implementing the keyboard component and related changes, run `yarn dev` to start the development server.

2. **Create a new game**:

   - Navigate to the home page (`http://localhost:3000`).
   - Click the "New game" button to start a new game.

3. **Verify the keyboard presence**:

   - On the game page, you should see an on-screen keyboard below the game board.
   - The keyboard should have a layout similar to a standard QWERTY keyboard.

4. **Test keyboard functionality**:

   - Click on letter keys on the on-screen keyboard. The letters should appear in the guess input field.
   - Click the "Delete" key (usually represented by a backspace icon). It should remove the last entered letter.
   - Click the "Enter" key after entering a 5-letter word. The guess should be submitted and appear on the game board.

5. **Test guess synchronization**:

   - Enter some letters using your physical keyboard. The on-screen keyboard input should update accordingly.
   - Enter some letters using the on-screen keyboard. The input field should update to reflect these letters.

6. **Verify guess submission**:
   - Submit a guess using the on-screen keyboard's "Enter" key.
   - Submit another guess using your physical keyboard's Enter key.
   - Both methods should work and update the game board correctly.

## Conclusion

Great job! You've now implemented an on-screen keyboard for your Wordle clone. This enhancement includes:

1. A new `GuessKeyboard` component using `react-simple-keyboard`
2. A context-based state management system for the current guess, similar to using services for state management in Angular
3. Integration of the keyboard with the existing game logic

These changes provide users with an alternative input method and improve the overall user experience of your game.

Key differences from Angular/Spring Boot you may have noticed:

- Instead of services and dependency injection, we use React contexts and hooks for state management.
- Components are more self-contained, often managing their own state or using hooks to access shared state.
- The `use client` directive is used to denote client-side components, as opposed to Angular where all components are client-side by default.

In the next section, we'll focus on adding visual feedback for guesses and implementing game over conditions.

Remember to test your implementation thoroughly. Try using both the on-screen keyboard and physical keyboard to make guesses, and verify that the game state updates correctly. If you encounter any issues, review the code and make sure all the pieces are connected properly.

Happy coding!
