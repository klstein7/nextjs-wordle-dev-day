# 02: Game Board Implementation

Welcome to the second section of our tutorial! In this section, you'll build the game board UI for your Wordle clone using **React** and **Next.js**. This will help you understand component composition and state management in React, much like how you'd structure components in **Angular**.

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-01-drizzle-setup` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-01-drizzle-setup
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up your database schema:**

   ```bash
   yarn db:push
   ```

Once you've completed these steps, you're ready to implement the game board.

---

## Setting Up the Game Page

First, you'll set up the game page in Next.js. In Next.js, pages are created using the **File-Based Routing** system, similar to how routes are defined in Angular's routing module.

### Exercise 1: Creating the Game Page

Your task is to create a new file for the game page and implement a basic component that renders a placeholder for the game board. In Next.js, the file path determines the route, similar to how you might define routes in Angular's routing module.

**Instructions:**

1. Create a new file at `src/app/game/[gameId]/page.tsx`. The `[gameId]` in the file name creates a dynamic route segment, conceptually similar to route parameters in Angular's router.
2. Import a placeholder `GameBoard` component (we'll create this later).
3. Implement a `GamePage` component that renders the `GameBoard` component centered on the page.

**Hints:**

- Use the `export default function` syntax to create your `GamePage` component. This is similar to how you'd export a component class in Angular.
- To center the `GameBoard`, you can use Tailwind CSS classes. Consider using `flex`, `h-full`, `items-center`, and `justify-center` on a wrapping `div`. This is analogous to using flexbox in Angular's template styles.
- Remember, in Next.js 13+, pages in the `app` directory are server components by default, so you don't need to use "use client" here. This is different from Angular where all components run on the client.

Here's a starting point for your `GamePage` component:

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";

export default function GamePage() {
  return (
    // TODO: Add a div to center the GameBoard
    <GameBoard />
  );
}
```

When you're ready, check your implementation against the provided solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";

export default function GamePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <GameBoard />
    </div>
  );
}
```

</details>

---

## Creating the `GameBoard` Component

Next, you'll create the `GameBoard` component, which acts as the container for the game's UI elements—similar to a parent component in Angular.

### Exercise 2: Implementing the GameBoard Component

Your task is to create the `GameBoard` component that will contain the list of guesses and the input for new guesses. In React, components are similar to Angular components, but they're typically more focused on the UI and less on application logic.

**Instructions:**

1. Create a new file at `src/components/game-board.tsx`.
2. Import placeholder components for `GuessInput` and `GuessList` (we'll create these later).
3. Implement the `GameBoard` component that renders both `GuessList` and `GuessInput`.
4. Use a temporary hardcoded array of guesses for demonstration.

**Hints:**

- Use the `export const` syntax to create your `GameBoard` component as a named export. This is similar to exporting a component in Angular, but React components are typically function-based rather than class-based.
- Create a `guesses` array with some sample strings like `["HELLO", "WORLD"]`. This mimics component state, which you'd typically manage with hooks in React (we'll cover this later).
- Use Tailwind CSS classes to style your component. Consider using `flex` and `flex-col` to stack the `GuessList` and `GuessInput` vertically. This is similar to using flexbox in Angular templates.
- Pass the `guesses` array as a prop to the `GuessList` component. This demonstrates React's one-way data flow, which is different from Angular's two-way binding.

Here's a starting point for your `GameBoard` component:

```typescript
// src/components/game-board.tsx

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

export const GameBoard = () => {
  // TODO: Create a guesses array with some sample strings

  return (
    // TODO: Add a div with appropriate Tailwind classes
    <>
      {/* TODO: Add GuessList component */}
      {/* TODO: Add GuessInput component */}
    </>
  );
};
```

Try implementing this component before looking at the solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/game-board.tsx

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

export const GameBoard = () => {
  const guesses = ["HELLO", "WORLD"];

  return (
    <div className="flex flex-col gap-3">
      <GuessList guesses={guesses} />
      <GuessInput />
    </div>
  );
};
```

</details>

---

## Implementing the `GuessInput` Component

The `GuessInput` component captures the user's input, allowing them to submit guesses. This is similar to creating a form component in Angular that handles user input.

### Exercise 3: Creating the GuessInput Component

Your task is to implement the `GuessInput` component that allows users to enter their guesses. This component will use React's state management, which is similar to but distinct from how you'd manage state in Angular.

**Instructions:**

1. Create a new file at `src/components/guess-input.tsx`.
2. Import necessary dependencies, including React hooks and UI components.
3. Implement the `GuessInput` component with the following features:
   - Use state to manage the current guess input.
   - Render an input field that accepts exactly 5 characters.
   - Implement handlers for input changes and guess submission.

**Hints:**

- Start by importing `useState` from 'react'. This hook is React's way of adding state to function components, similar to how you'd define properties in an Angular component class.
- Use the `useState` hook to create a state variable for the guess and a function to update it. This is more explicit than Angular's two-way binding.
- The `InputOTP` component from shadcn/ui can be used to create the 5-character input field. This is a third-party component, similar to how you might use Angular Material components. Refer to the [InputOTP documentation](https://ui.shadcn.com/docs/components/input-otp) for details on its props and usage.
- Use the `onChange` prop of `InputOTP` to update your state when the input changes. This is similar to using `(ngModelChange)` in Angular.
- Implement an `onKeyDown` handler to check for the Enter key press and handle guess submission. This is similar to using `(keydown.enter)` in Angular templates.

Here's a starting point for your `GuessInput` component:

```typescript
// src/components/guess-input.tsx

"use client";

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const GuessInput = () => {
  // TODO: Add state for the current guess

  return (
    <InputOTP
      // TODO: Add necessary props (maxLength, value, onChange, etc.)
    >
      <InputOTPGroup>
        {/* TODO: Add InputOTPSlot components */}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

Try creating this component before checking the solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-input.tsx

"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const GuessInput = () => {
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log(guess);
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

</details>

---

## Creating the `GuessList` Component

The `GuessList` component displays a list of previous guesses, similar to how you'd use `*ngFor` in Angular to render a list of items.

### Exercise 4: Implementing the GuessList Component

Your task is to create the `GuessList` component that renders a list of previous guesses. This will demonstrate how React handles list rendering, which is conceptually similar to but syntactically different from Angular's approach.

**Instructions:**

1. Create a new file at `src/components/guess-list.tsx`.
2. Import the `GuessItem` component (we'll create this next).
3. Implement the `GuessList` component that accepts an array of guesses as a prop.
4. Render a `GuessItem` for each guess in the array.

**Hints:**

- Define a type for the component's props that includes a `guesses` property of type `string[]`. This is similar to how you'd define input properties in an Angular component.
- Use the `map` function to iterate over the `guesses` array and render a `GuessItem` for each guess. This is React's equivalent of Angular's `*ngFor` directive.
- Remember to provide a unique `key` prop when rendering lists in React. This is similar to Angular's `trackBy` function, but it's a required concept in React when rendering lists.
- Use Tailwind CSS classes to add some spacing between the guess items, similar to how you'd style components in Angular.

Here's a starting point for your `GuessList` component:

```typescript
// src/components/guess-list.tsx

"use client";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  // TODO: Define the props type
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    // TODO: Add a div with appropriate Tailwind classes
    <>
      {/* TODO: Map over guesses and render GuessItem components */}
    </>
  );
};
```

Try implementing this component before looking at the solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-list.tsx

"use client";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  guesses: string[];
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {guesses.map((guess) => (
        <GuessItem key={guess} guess={guess} />
      ))}
    </div>
  );
};
```

</details>

---

## Implementing the `GuessItem` Component

The `GuessItem` component displays individual guesses, similar to how you might create a reusable component in Angular.

### Exercise 5: Creating the GuessItem Component

Your final task is to implement the `GuessItem` component that displays a single guess. This demonstrates how to create a reusable component in React, which is conceptually similar to creating a reusable component in Angular.

**Instructions:**

1. Create a new file at `src/components/guess-item.tsx`.
2. Import necessary UI components.
3. Implement the `GuessItem` component that accepts a single guess as a prop.
4. Render the guess using the `InputOTP` component in read-only mode.

**Hints:**

- Import the necessary components from './ui/input-otp'. This is similar to importing Angular Material components.
- Define a type for the component's props that includes a `guess` property of type `string`. This is akin to defining input properties in an Angular component.
- Use the `InputOTP` component with the `readOnly` prop set to `true`. Props in React are similar to input properties in Angular. Refer to the [InputOTP documentation](https://ui.shadcn.com/docs/components/input-otp) for details on available props.
- Create a separate `GuessItemSlot` component to render each character of the guess. This demonstrates how React encourages breaking UIs into small, reusable pieces.
- Use an array of indices `[0, 1, 2, 3, 4]` to map over and create the slots. This is another example of list rendering in React, similar to using `*ngFor` in Angular.

Here's a starting point for your `GuessItem` component:

```typescript
// src/components/guess-item.tsx

"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  // TODO: Define the props type
};

export function GuessItem({ guess }: GuessItemProps) {
  return (
    <InputOTP
      // TODO: Add necessary props (readOnly, value, etc.)
    >
      <InputOTPGroup>
        {/* TODO: Add InputOTPSlot components for each character */}
      </InputOTPGroup>
    </InputOTP>
  );
}
```

Try creating this component before checking the solution.

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-item.tsx

"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: string;
};

function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      className="h-12 w-12 text-2xl uppercase"
    />
  );
}

export function GuessItem({ guess }: GuessItemProps) {
  return (
    <InputOTP readOnly maxLength={5} value={guess}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
```

</details>

---

## Updating the Root Layout

Ensure that your root layout is properly set up to provide consistent styling and metadata across your application, similar to configuring the main module in Angular.

**Modify your `src/app/layout.tsx` file to include the following:**

```typescript
// src/app/layout.tsx

import type { Metadata } from "next";
import "~/styles/globals.css";

// Define metadata for the application
export const metadata: Metadata = {
  title: "Wordle Clone", // Title displayed in the browser tab
  description: "A Wordle clone built with Next.js and Drizzle", // Meta description
};

// RootLayout component wraps all pages
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Set the language and apply dark mode
    <html lang="en" className="dark">
      {/* Body with full height to enable centering */}
      <body className="h-screen">
        {/* Render the page content */}
        {children}
      </body>
    </html>
  );
}
```

In this file, you define the `metadata` for SEO purposes and set up the basic structure of your application, importing global styles and applying classes for dark mode and full-height layout.

---

## Checking Your Progress

Now that you've implemented all the components, it's time to check your work.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Open the Application:**

   - Navigate to `http://localhost:3000/game/1` in your web browser.

3. **Visual Inspection:**

   - **Game Board Display:**
     - The game board should be centered on the page.
     - You should see the list of previous guesses ("HELLO" and "WORLD").
     - An input field should be available for entering new guesses.

4. **Functional Testing:**

   - **Guess Input:**

     - Enter a 5-letter word in the input field.
     - Each letter should appear in its own box, reflecting the Wordle style.

   - **Submitting a Guess:**
     - Press **Enter** after typing your guess.
     - The guess should be logged in the console (for now).
     - The input field should clear after submission.

If everything works as expected, congratulations! You've successfully built the game board for your Wordle clone.

---

## Next Steps

In the next section, we'll delve into implementing the core game logic and state management. This will involve:

- **Managing Global State:**

  - We'll explore state management solutions to share data between components.

- **Implementing Game Logic:**
  - You'll write functions to check user guesses against the target word.
  - Provide feedback by updating the UI based on whether letters are correct, present, or absent.

By continuing to build on your application, you'll deepen your understanding of state management and component interaction in React, similar to advanced techniques in Angular applications.

---

## Helpful Resources

To deepen your understanding of Next.js and its App Router, you might find the following resources helpful:

1. **Next.js Routing Fundamentals:**

   - [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
     - Learn how Next.js handles routing using the App Router, including file-based routing and nested layouts.

2. **Dynamic Routes in Next.js:**

   - [Dynamic Routes in Next.js](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
     - Understand how to create dynamic routes that capture parameters, similar to the `[gameId]` route we've used.

3. **Client and Server Components:**

   - [React Components in Next.js](https://nextjs.org/docs/getting-started/react-essentials)
     - Explore the differences between client and server components in Next.js and how to use them effectively.

4. **Shadcn UI:**
   - [Shadcn UI](https://ui.shadcn.com/)
     - Shadcn UI is a component library that provides a set of reusable UI components for your Next.js application.

---

This concludes the Game Board Implementation section of our tutorial. You've successfully created the basic structure and UI components for your Wordle clone. In the next section, we'll build upon this foundation to add game logic and state management.
