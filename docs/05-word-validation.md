# Section 05: Word Validation

Welcome to the word validation section of our Wordle clone! In this part, we'll implement word validation to ensure that users can only submit valid guesses. We'll also add error notifications to improve the user experience. If you're coming from a Spring Boot/Angular background, you'll find some familiar concepts here, implemented in a Next.js/React environment.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-04-keyboard` branch. This contains all the work we've done in implementing the on-screen keyboard.

To get up to speed:

1. Switch to the `checkpoint-04-keyboard` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to implement word validation.

## Step 1: Add Toast Notifications

First, let's add a toast notification system to our app. This will allow us to display error messages to the user.

### Exercise 1:

Before looking at the solution, think about how you would implement a notification system in Angular. How might this be different in React?

Update `src/app/layout.tsx`:

```typescript
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Wordle Clone",
  description: "Our awesome wordle clone",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body className="h-screen">{children}</body>
      <Toaster closeButton={true} expand={true} visibleToasts={4} />
    </html>
  );
}
```

Here, we're adding a `Toaster` component to our root layout. This is similar to adding a global notification service in Angular.

## Step 2: Implement Word Validation

Now, let's add a function to check if a word is valid. This is similar to implementing a validation service in Spring Boot.

### Exercise 2:

Before implementing the function, consider:

1. How will you determine if a word is valid?
2. Where should this function be placed in your project structure?

Update `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { words } from "./words";

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

export function isValidWord(word: string) {
  return words.includes(word.toLowerCase());
}
```

This `isValidWord` function checks if the given word exists in our list of valid words.

## Step 3: Create a Custom Hook for Guess Creation

Let's create a custom hook that will handle guess creation and validation. This is similar to creating a service in Angular that handles form submission and validation.

### Exercise 3:

Before implementing the hook, think about:

1. What validations should be performed on a guess?
2. How will you handle and display validation errors?

Create a new file `src/lib/hooks/use-create-guess.ts`:

```typescript
import { REGEXP_ONLY_CHARS } from "input-otp";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "~/server/api";

import { isValidWord } from "../utils";
import { useGuess } from "./use-guess";

// This schema is similar to creating a DTO (Data Transfer Object) in Spring Boot with validation annotations
const CreateGuessSchema = z.object({
  guess: z
    .string()
    .length(5, "Guess must be 5 characters long")
    .refine((value) => new RegExp(REGEXP_ONLY_CHARS).test(value), {
      message: "Guess must contain only letters",
    })
    .refine((value) => isValidWord(value), {
      message: "Guess must be a valid word",
    }),
  gameId: z.union([z.string(), z.number()]).transform((value) => Number(value)),
});

// This hook is similar to a service method in Angular that handles form submission
export const useCreateGuess = () => {
  const { setGuess } = useGuess();

  return async (guess: string, gameId: number) => {
    const result = CreateGuessSchema.safeParse({ guess, gameId });
    if (!result.success) {
      result.error.errors.forEach((error) => {
        // Displaying errors using toast notifications
        toast.error(error.message);
      });
      return;
    }
    // If validation passes, create the guess
    await api.guesses.create(guess, gameId);
    setGuess("");
  };
};
```

This hook encapsulates the logic for creating a guess, including validation and error handling.

## Step 4: Update GuessInput Component

Now, let's update our `GuessInput` component to use the new `useCreateGuess` hook.

### Exercise 4:

Before updating the component, consider:

1. How will this change affect the component's behavior?
2. How does this compare to form submission in Angular?

Update `src/components/guess-input.tsx`:

```typescript
"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useCreateGuess } from "~/lib/hooks/use-create-guess";
import { useGuess } from "~/lib/hooks/use-guess";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  // Using our new hook, similar to injecting a service in Angular
  const createGuess = useCreateGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // Using the createGuess function from our hook
          await createGuess(guess, gameId);
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

## Step 5: Update GuessKeyboard Component

Let's also update our `GuessKeyboard` component to use the new `useCreateGuess` hook.

### Exercise 5:

Before updating the component, think about:

1. How will this change improve the consistency of guess creation across different input methods?
2. How does this relate to the DRY (Don't Repeat Yourself) principle?

Update `src/components/guess-keyboard.tsx`:

```typescript
"use client";

import "react-simple-keyboard/build/css/index.css";

import Keyboard from "react-simple-keyboard";

import { useCreateGuess } from "~/lib/hooks/use-create-guess";
import { useGuess } from "~/lib/hooks/use-guess";

type GuessKeyboardProps = {
  gameId: number;
};

export const GuessKeyboard = ({ gameId }: GuessKeyboardProps) => {
  const { guess, setGuess } = useGuess();

  // Using our new hook, similar to injecting a service in Angular
  const createGuess = useCreateGuess();

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
          setGuess(guess.slice(0, -1));
          return;
        }

        if (input === "{enter}") {
          // Using the createGuess function from our hook
          await createGuess(guess, gameId);
          return;
        }

        if (guess.length === 5) return;

        setGuess(guess + input);
      }}
    />
  );
};
```

## Step 6: Update GuessItem Component

Finally, let's update our `GuessItem` component to display the result of each guess with appropriate colors.

### Exercise 6:

Before updating the component, consider:

1. How will you map the guess result to appropriate colors?
2. How does this compare to using ngClass in Angular for conditional styling?

Update `src/components/guess-item.tsx`:

```typescript
"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase", {
        "bg-red-500 text-red-50": result === "X",
        "bg-green-500 text-green-50": result === "C",
        "bg-yellow-500 text-yellow-50": result === "~",
      })}
    />
  );
}

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot
            key={index}
            index={index}
            result={guess.result[index] ?? ""}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

This update adds color-coding to the guess results, making it easier for users to understand the outcome of their guesses.

## Checking Your Progress

After implementing word validation and error handling, you can verify your progress by running the application and checking the following:

1. **Start the development server**:
   Run `yarn dev` to start the development server.

2. **Navigate to a game**:

   - Open your browser and go to `http://localhost:3000`.
   - Start a new game or continue an existing one.

3. **Prepare for toast notifications**:

   - The Toaster container is invisible by default and will only appear when a notification is triggered.
   - Keep an eye on the bottom of the screen where toast notifications will appear.

4. **Verify input constraints**:

   - Try typing letters into the input field. You should only be able to enter uppercase letters.
   - Attempt to enter more than 5 letters. The input should stop accepting letters after the 5th character.
   - Try entering numbers or special characters. These should not appear in the input field.

5. **Verify word validation**:

   - Enter a 5-letter word that's not in the word list (e.g., "XYXYX").
     - When you press Enter or click the submit button, a toast error message should appear saying "Guess must be a valid word".
   - Enter a valid 5-letter word (e.g., "HELLO").
     - When you submit, it should be accepted without any error toast, and appear on the game board.

6. **Check guess visualization**:
   - After submitting a valid guess, verify that the letters are color-coded correctly:
     - Green for correct letters in the correct position
     - Yellow for correct letters in the wrong position
     - Red (or gray) for incorrect letters

## Conclusion

Great job! You've now implemented word validation and improved the user feedback in your Wordle clone. This enhancement includes:

1. A word validation function to ensure only valid words are submitted
2. A custom hook for creating guesses with validation and error handling
3. Integration of toast notifications for displaying error messages
4. Updated components that use the new validation logic
5. Improved visual feedback for guess results

Key differences from Angular/Spring Boot you may have noticed:

- Instead of form validators and services, we use custom hooks and the Zod library for validation.
- Error messages are displayed using a toast notification system instead of form validation messages.
- Styling is applied using utility classes and the `cn` function, as opposed to ngClass in Angular.

In the next section, we'll focus on implementing game over conditions and adding a feature to start a new game after completion.

Remember to test your implementation thoroughly. Try submitting invalid words, words that are too short or long, and ensure that the color-coding for guesses is working correctly. If you encounter any issues, review the code and make sure all the pieces are connected properly.

Happy coding!
