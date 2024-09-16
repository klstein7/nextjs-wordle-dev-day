# 04: Keyboard Implementation

Welcome to the fourth section of our tutorial! In this part, you'll enhance your Wordle clone by adding an on-screen keyboard. This keyboard will improve the user experience by providing an alternative input method and visual feedback, similar to how you might enhance an Angular application with additional UI components.

## Exercise Objectives

- **Install** the required dependencies for the keyboard component.
- **Create** the `GuessKeyboard` component.
- **Implement** a context for managing the guess state.
- **Create** a `GuessProvider` to supply the context to components.
- **Develop** a custom `useGuess` hook for easy access to the guess state.
- **Update** the game page to include the keyboard and provider.
- **Adjust** the `GameBoard` and `GuessInput` components to use the new context.
- **Verify** the functionality by running the application.

---

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-03-game-logic` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-03-game-logic
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

Once you've completed these steps, you're ready to implement the on-screen keyboard.

---

## Tasks and Hints

### 1. Install Required Dependencies

**Task:** Install the `react-simple-keyboard` library to provide an on-screen keyboard component.

**Why:** This library will help us create a customizable keyboard, enhancing user experience without building one from scratch.

**Instructions:**

- Run the following command to install the dependency:

  ```bash
  yarn add react-simple-keyboard
  ```

**Helpful Links:**

- [react-simple-keyboard Documentation](https://hodgef.com/simple-keyboard/)

---

### 2. Create the `GuessKeyboard` Component

**Task:** In `src/components/guess-keyboard.tsx`, create the `GuessKeyboard` component that renders the on-screen keyboard.

**Why:** This component will allow users to input guesses using an on-screen keyboard, similar to mobile-friendly interfaces.

**Hints:**

- **Client-Side Component:**
  - Include `"use client";` at the top since the component handles user interactions.
- **Imports:**
  - Import the `Keyboard` component from `react-simple-keyboard`.
  - Import necessary styles.
- **Props Definition:**
  - Define `GuessKeyboardProps` to accept `gameId`.
- **State Management:**
  - Use a custom hook (we'll create it later) to manage the guess state.
- **Event Handling:**
  - Implement the `onKeyPress` function to handle key presses.

**Example:**

```typescript
// src/components/guess-keyboard.tsx

"use client";

import "react-simple-keyboard/build/css/index.css";
import Keyboard from "react-simple-keyboard";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

type GuessKeyboardProps = {
  gameId: number;
};

export const GuessKeyboard = ({ gameId }: GuessKeyboardProps) => {
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
      onKeyPress={async (input) => {
        if (input === "{delete}") {
          // Remove the last character from the guess
          setGuess(guess.slice(0, -1));
          return;
        }

        if (input === "{enter}") {
          // Submit the guess to the server
          await api.guesses.create(guess, gameId);
          // Clear the guess after submission
          setGuess("");
          return;
        }

        if (guess.length === 5) {
          // Prevent adding more than 5 characters
          return;
        }

        // Append the input character to the guess
        setGuess(guess + input);
      }}
    />
  );
};
```

---

### 3. Create a Guess Context

**Task:** In `src/lib/store/guess-context.ts`, create a context to manage the guess state across components.

**Why:** Context provides a way to pass data through the component tree without having to pass props down manually, similar to shared services in Angular.

**Hints:**

- **Context Creation:**
  - Use `createContext` from React.
- **Type Definition:**
  - Define a `GuessContextType` with `guess` and `setGuess`.
- **Default Values:**
  - Provide default values for the context.

**Example:**

```typescript
// src/lib/store/guess-context.ts

import { createContext } from "react";

// Define the context type
export type GuessContextType = {
  guess: string;
  setGuess: (guess: string) => void;
};

// Create the GuessContext with default values
export const GuessContext = createContext<GuessContextType>({
  guess: "",
  setGuess: () => undefined,
});
```

---

### 4. Create a `GuessProvider`

**Task:** In `src/lib/store/guess-provider.tsx`, create a provider component that supplies the `GuessContext` to its child components.

**Why:** The provider allows any child component to access the guess state, similar to providing a service in Angular at a component level.

**Hints:**

- **Client-Side Component:**
  - Include `"use client";` at the top.
- **State Management:**
  - Use `useState` to manage the `guess` state.
- **Context Provider:**
  - Wrap `children` with `GuessContext.Provider`.

**Example:**

```typescript
// src/lib/store/guess-provider.tsx

"use client";

import { useState } from "react";
import { GuessContext } from "./guess-context";

export const GuessProvider = ({ children }: { children: React.ReactNode }) => {
  const [guess, setGuess] = useState<string>("");

  return (
    <GuessContext.Provider value={{ guess, setGuess }}>
      {children}
    </GuessContext.Provider>
  );
};
```

---

### 5. Create a `useGuess` Hook

**Task:** In `src/lib/hooks/use-guess.ts`, create a custom hook to access the `GuessContext`.

**Why:** Custom hooks provide a convenient way to reuse logic across components, similar to Angular services.

**Hints:**

- **Imports:**
  - Import `useContext` from React.
  - Import `GuessContext`.
- **Hook Definition:**
  - Create a function `useGuess` that returns `useContext(GuessContext)`.

**Example:**

```typescript
// src/lib/hooks/use-guess.ts

import { useContext } from "react";
import { GuessContext } from "../store/guess-context";

export const useGuess = () => {
  return useContext(GuessContext);
};
```

---

### 6. Update the Game Page

**Task:** In `src/app/game/[gameId]/page.tsx`, wrap the content with `GuessProvider` and include the `GuessKeyboard` component.

**Why:** The `GuessProvider` needs to wrap components that consume the `GuessContext`, and the `GuessKeyboard` adds the on-screen keyboard to the page.

**Hints:**

- **Imports:**
  - Import `GuessProvider` and `GuessKeyboard`.
- **Component Hierarchy:**
  - Wrap the content with `<GuessProvider>`.
  - Place `GuessKeyboard` appropriately in the layout.
- **Styling Adjustments:**
  - Modify the layout to accommodate the keyboard.

**Example:**

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";
import { GuessKeyboard } from "~/components/guess-keyboard";
import { GuessProvider } from "~/lib/store/guess-provider";
import { api } from "~/server/api";

export default async function GamePage({
  params: { gameId },
}: {
  params: { gameId: number };
}) {
  const guesses = await api.guesses.findByGameId(gameId);

  return (
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

---

### 7. Update the `GameBoard` Component

**Task:** In `src/components/game-board.tsx`, adjust the component to improve its layout within the new page structure.

**Why:** Adjustments may be needed to ensure the `GameBoard` aligns properly with the keyboard and other elements.

**Hints:**

- **Styling Adjustments:**
  - Modify CSS classes to adjust alignment and spacing.
- **Flex Properties:**
  - Use `flex-grow` or other flex properties as needed.

**Example:**

```typescript
// src/components/game-board.tsx

import { type api } from "~/server/api";
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameBoard = ({ gameId, guesses }: GameBoardProps) => {
  return (
    <div className="flex grow flex-col items-center gap-3">
      <GuessList guesses={guesses} />
      <GuessInput gameId={gameId} />
    </div>
  );
};
```

---

### 8. Update the `GuessInput` Component

**Task:** In `src/components/guess-input.tsx`, modify the component to use the `useGuess` hook instead of local state.

**Why:** Centralizing the guess state allows for synchronization between the input field and the on-screen keyboard.

**Hints:**

- **Remove Local State:**
  - Remove `useState` and the local `guess` state.
- **Use Custom Hook:**
  - Import and use `useGuess` to get `guess` and `setGuess`.
- **Event Handling:**
  - Update event handlers to use the new `guess` state.

**Example:**

```typescript
// src/components/guess-input.tsx

"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // Submit the guess to the server
          await api.guesses.create(guess, gameId);
          // Clear the guess after submission
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

---

## Checking Your Progress

Now that you've implemented the on-screen keyboard and related components, it's time to test your application.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Create a New Game:**

   - Navigate to `http://localhost:3000`.
   - Click the "New Game" button to start a new game.

3. **Verify the Keyboard Presence:**

   ![Keyboard](img/7.png)

   - On the game page, you should see the on-screen keyboard below the game board.
   - The keyboard should display the correct layout.

4. **Test Keyboard Functionality:**

   - Click on letter keys; the letters should appear in the input field.
   - Use the "{delete}" key to remove letters.
   - Use the "{enter}" key to submit a guess.

5. **Check Guess Synchronization:**

   - Ensure that typing with your physical keyboard also updates the on-screen input.
   - The input field should reflect input from both physical and on-screen keyboards.

6. **Verify Guess Submission:**

   - After submitting a guess, it should appear on the game board.
   - The guess should be stored and persist after page refresh.

If everything works as expected, congratulations! You've successfully added an on-screen keyboard to your Wordle clone.

---

## Next Steps

In the next section, we'll focus on adding visual feedback for guesses and implementing game-over conditions. This will involve:

- **Enhancing the UI:**
  - Providing color-coded feedback for correct and incorrect letters.
- **Game Logic:**
  - Determining when the game is won or lost.
  - Handling game-over scenarios.

---
