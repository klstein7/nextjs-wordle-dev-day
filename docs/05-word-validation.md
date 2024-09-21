# 05: Word Validation

Welcome to the fifth section of our tutorial! In this section, you'll enhance your Wordle clone by implementing **word validation** and improving user feedback. This will ensure that users can only submit valid guesses, enhancing the game's integrity and providing a better user experience. Additionally, you'll add error notifications to inform users when their guesses are invalid, similar to form validation feedback in Angular applications.

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-04-keyboard` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-04-keyboard
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

Once you've completed these steps, you're ready to implement word validation.

---

## Implementing Word Validation

In this section, you'll add functionality to validate user guesses against a predefined word list. This ensures that only legitimate words are accepted, preventing users from entering random letters or gibberish. Just like form validation in Angular, this step is crucial for maintaining the integrity of the application's data and providing meaningful feedback to the user.

### Exercise 1: Adding Toast Notifications

Your first task is to integrate a toast notification system into your application. This will allow you to display error messages in a non-intrusive way, similar to how you might use Angular's snackbar or toast components.

**Instructions:**

1. Open `src/app/layout.tsx`.
2. Import the `Toaster` component from `"~/components/ui/sonner"`.
3. Add the `Toaster` component to your layout, placing it outside the `<body>` tag but inside the `<html>` tag.

**Hints:**

- The `Toaster` component acts as a global notification system, similar to how you might set up a global error handler in Angular.
- Placing it outside the `<body>` ensures it's available throughout your application, akin to adding a service to the root module in Angular.

Here's a starting point for your updated layout:

```typescript
// src/app/layout.tsx

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

// TODO: Import the Toaster component from "~/components/ui/sonner"

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
      {/* TODO: Add the Toaster component here with the following props:
          closeButton={true}
          expand={true}
          visibleToasts={4}
      */}
    </html>
  );
}
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/app/layout.tsx

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

// Import the Toaster component for notifications
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
      {/* Add the Toaster component to display toast notifications */}
      <Toaster closeButton={true} expand={true} visibleToasts={4} />
    </html>
  );
}
```

</details>

---

### Exercise 2: Implementing Word Validation Function

Next, you'll create a function to check if a given word is valid according to your word list. This is similar to creating a validator function in Angular forms.

**Instructions:**

1. Open `src/lib/utils.ts`.
2. Import the `words` array from your word list.
3. Implement an `isValidWord` function that checks if a given word is in the `words` array.

**Hints:**

- Convert the input word to lowercase before checking, to ensure case-insensitive validation.
- This function acts like a custom validator in Angular reactive forms, providing a reusable piece of validation logic.

Here's a starting point for your `isValidWord` function:

```typescript
// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// TODO: Import the words array from "./words"

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

// TODO: Implement the isValidWord function
// This function should:
// 1. Accept a string parameter
// 2. Convert the input to lowercase
// 3. Check if the lowercase word is included in the words array
// 4. Return a boolean indicating whether the word is valid
export function isValidWord(word: string): boolean {
  // Your implementation here
}
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Import your list of valid words
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

// Function to check if a word is valid
export function isValidWord(word: string): boolean {
  return words.includes(word.toLowerCase());
}
```

</details>

---

### Exercise 3: Creating a Custom Hook for Guess Creation

Now, you'll develop a custom hook called `useCreateGuess` to handle guess creation with validation and error handling. This is similar to creating a service in Angular that encapsulates form submission logic.

**Instructions:**

1. Create a new file at `src/lib/hooks/use-create-guess.ts`.
2. Implement the `useCreateGuess` hook with the following features:
   - Use `zod` for input validation.
   - Display toast notifications for validation errors.
   - Submit the guess if validation passes.

**Hints:**

- The `zod` library is used for schema validation, similar to how you might use Angular's built-in validators or a library like `ngx-validate`.
- Use the `toast` function from `sonner` to display error messages, mimicking Angular's approach to displaying form validation errors.
- This custom hook centralizes logic, much like an Angular service would for form submission and validation.

Here's a starting point for your `useCreateGuess` hook:

```typescript
// src/lib/hooks/use-create-guess.ts

import { REGEXP_ONLY_CHARS } from "input-otp";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "~/server/api";

import { isValidWord } from "../utils";
import { useGuess } from "./use-guess";

// TODO: Define the CreateGuessSchema using zod
// The schema should validate:
// 1. The guess is exactly 5 characters long
// 2. The guess contains only letters
// 3. The guess is a valid word (use the isValidWord function)
// 4. The gameId is a number
const CreateGuessSchema = z.object({
  // Your schema definition here
});

// Custom hook for creating a guess with validation
export const useCreateGuess = () => {
  const { setGuess } = useGuess();

  return async (guess: string, gameId: number) => {
    // TODO: Implement the following logic:
    // 1. Validate the input data against the schema
    // 2. If validation fails, display error messages using toast notifications
    // 3. If validation passes, create the guess using the API
    // 4. Clear the current guess after submission
    // Your implementation here
  };
};
```

Helpful resource:

- [Zod Documentation](https://zod.dev/)

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/lib/hooks/use-create-guess.ts

import { REGEXP_ONLY_CHARS } from "input-otp";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "~/server/api";

import { isValidWord } from "../utils";
import { useGuess } from "./use-guess";

// Define the validation schema using zod
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

// Custom hook for creating a guess with validation
export const useCreateGuess = () => {
  const { setGuess } = useGuess();

  return async (guess: string, gameId: number) => {
    // Validate the input data against the schema
    const result = CreateGuessSchema.safeParse({ guess, gameId });
    if (!result.success) {
      // If validation fails, display error messages using toast notifications
      result.error.errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }
    // If validation passes, create the guess using the API
    await api.guesses.create(guess, gameId);
    // Clear the current guess after submission
    setGuess("");
  };
};
```

</details>

---

### Exercise 4: Updating the GuessInput Component

Now, you'll modify the `GuessInput` component to use the `useCreateGuess` hook for submitting guesses. This ensures that all guesses entered via the input field are validated and handled consistently.

**Instructions:**

1. Open `src/components/guess-input.tsx`.
2. Import the `useCreateGuess` hook.
3. Replace the direct API call with the `createGuess` function from the hook.

**Hints:**

- This update is similar to how you might inject a form submission service into an Angular component and use it to handle form submission.
- The `useCreateGuess` hook encapsulates the validation and submission logic, keeping your component focused on rendering and user interaction.

Here's a starting point for your updated `GuessInput` component:

```typescript
// src/components/guess-input.tsx

"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useCreateGuess } from "~/lib/hooks/use-create-guess";  // TODO: Uncomment this line
import { useGuess } from "~/lib/hooks/use-guess";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();
  // TODO: Use the useCreateGuess hook
  // const createGuess = useCreateGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          // TODO: Replace the following line with a call to createGuess
          // await api.guesses.create(guess, gameId);
          // TODO: Remove this line after implementing createGuess
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

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-input.tsx

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
  const createGuess = useCreateGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
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

</details>

---

### Exercise 5: Updating the GuessKeyboard Component

Similarly, update the `GuessKeyboard` component to use the `useCreateGuess` hook when submitting guesses via the on-screen keyboard.

**Instructions:**

1. Open `src/components/guess-keyboard.tsx`.
2. Import the `useCreateGuess` hook.
3. Replace the direct API call with the `createGuess` function from the hook.

**Hints:**

- This update ensures consistent validation and error handling between the keyboard and input field, similar to how you'd want consistent form handling across different input methods in an Angular application.
- The `useCreateGuess` hook provides a centralized point for guess submission logic, akin to a shared service in Angular.

Here's a starting point for your updated `GuessKeyboard` component:

```typescript
// src/components/guess-keyboard.tsx

"use client";

import "react-simple-keyboard/build/css/index.css";

import Keyboard from "react-simple-keyboard";

import { useCreateGuess } from "~/lib/hooks/use-create-guess";  // TODO: Uncomment this line
import { useGuess } from "~/lib/hooks/use-guess";

type GuessKeyboardProps = {
  gameId: number;
};

export const GuessKeyboard = ({ gameId }: GuessKeyboardProps) => {
  const { guess, setGuess } = useGuess();
  // TODO: Use the useCreateGuess hook
  // const createGuess = useCreateGuess();

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
          // TODO: Replace the following comment with a call to createGuess
          // Implement guess submission logic here
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

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-keyboard.tsx

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
          await createGuess(guess, gameId);
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

</details>

---

### Exercise 6: Updating the GuessItem Component

To enhance the user experience further, you'll modify the `GuessItem` component to display the result of each guess with appropriate color coding. Visual feedback helps users understand which letters are correct or incorrect, similar to the original Wordle game.

**Instructions:**

1. Open `src/components/guess-item.tsx`.
2. Modify the `GuessItemSlot` component to apply different background colors based on the guess result.
3. Update the `GuessItem` component to use the new `GuessItemSlot`.

**Hints:**

- Use Tailwind CSS classes to apply different background colors.
- The `cn` function from `~/lib/utils` can be used to conditionally apply classes.
- This color-coding is similar to how you might use `ngClass` in Angular to conditionally apply CSS classes based on component state.

Here's a starting point for your updated `GuessItem` component:

```typescript
// src/components/guess-item.tsx

"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

// TODO: Update this component to apply different background colors based on the result
function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase"
        // TODO: Add conditional classes based on the result
        // Hint: Use the following classes:
        // "bg-red-500 text-red-50" for incorrect letters
        // "bg-green-500 text-green-50" for correct letters in correct position
        // "bg-yellow-500 text-yellow-50" for correct letters in wrong position
      )}
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

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-item.tsx

"use client";

import { cn } from "~/lib/utils";
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

// Helper component to render each slot with the correct color
function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase", {
        "bg-red-500 text-red-50": result === "X", // Incorrect letter
        "bg-green-500 text-green-50": result === "C", // Correct letter in correct position
        "bg-yellow-500 text-yellow-50": result === "~", // Correct letter in wrong position
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

</details>

---

## Checking Your Progress

Now that you've implemented word validation and enhanced user feedback, it's time to test your application. Testing ensures that all components work together seamlessly and that the user experience is as intended.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Navigate to a Game:**

   - Open your browser and go to `http://localhost:3000`.
   - Start a new game or continue an existing one.

3. **Test Input Constraints:**

   ![Word Validation](img/8.png)

   - **Invalid Characters:**
     - Try entering numbers or special characters.
     - The input should reject these characters, preventing invalid data from being submitted.
   - **Exceed Character Limit:**
     - Attempt to enter more than 5 letters.
     - The input should stop accepting letters after the fifth character, enforcing the game's rules.

4. **Test Word Validation:**

   - **Invalid Word:**
     - Enter a 5-letter word that's not in the word list (e.g., "ABCDE").
     - Upon submission, a toast notification should display an error message like "Guess must be a valid word."
     - This feedback helps users understand that their guess was not accepted due to invalidity.
   - **Valid Word:**
     - Enter a valid 5-letter word (e.g., "APPLE").
     - The guess should be accepted and appear on the game board without errors.

5. **Verify Toast Notifications:**

   - Ensure that error messages appear as toast notifications at the bottom of the screen.
   - Test various invalid inputs to see different error messages.
   - This immediate feedback enhances the user experience by providing clear guidance.

6. **Check Guess Visualization:**

   - After submitting a valid guess, verify that the letters are color-coded correctly:
     - **Green:** Correct letter in the correct position.
     - **Yellow:** Correct letter in the wrong position.
     - **Red:** Incorrect letter.
   - This visual representation helps users strategize their next guesses based on the feedback.

If everything works as expected, congratulations! You've successfully enhanced your Wordle clone with word validation and improved user feedback.

---

## Next Steps

In the next section, we'll focus on implementing game-over conditions and adding a feature to start a new game after completion. This will involve:

- **Game Logic Enhancements:**
  - Determining when the game is won or lost.
  - Handling scenarios where the player runs out of guesses.
- **User Interface Updates:**
  - Displaying game-over messages.
  - Providing options to start a new game.

By continuing to build on your application, you'll deepen your understanding of state management, validation, and user feedback in React, paralleling advanced techniques in Angular applications.

---

## Helpful Resources

To further enhance your understanding, you might find the following resources helpful:

1. **Zod Schema Validation:**

   - [Zod Official Documentation](https://zod.dev/)
     - Learn more about schema declaration and validation with Zod.

2. **React Context API:**
   - [React Context Documentation](https://react.dev/learn/passing-data-deeply-with-context)
     - Understand how to share state across components without prop drilling.

---
