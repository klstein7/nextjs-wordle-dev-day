# 02: Game Board Implementation

Welcome to the second section of the tutorial! In this section, you'll build the game board UI for your Wordle clone using **React** and **Next.js**. This will help you understand component composition and state management in React, much like how you'd structure components in **Angular**.

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-01-drizzle-setup` branch.

**To get up to speed:**

1. **Switch to the Branch:**

   ```bash
   git checkout checkpoint-01-drizzle-setup
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

3. **Set Up Your Database Schema:**

   ```bash
   yarn db:push
   ```

Once you've completed these steps, you're ready to implement the game board.

---

## Setting Up the Game Page

First, you'll set up the game page in Next.js. In Next.js, pages are created using the **File-Based Routing** system.

### Exercise 1: Creating the Game Page

Your task is to create a new file for the game page and implement a basic component that renders a placeholder for the game board. In Next.js, the file path determines the route.

**Instructions:**

1. **Create the Game Page File:**

   - Create a new file at `src/app/game/[gameId]/page.tsx`.
   - The `[gameId]` in the file name creates a **dynamic route segment**, conceptually similar to route parameters in Angular's router (e.g., `/:gameId`).

2. **Import the `GameBoard` Component:**

   - We'll create this component in a later exercise.

3. **Implement the `GamePage` Component:**

   - Render the `GameBoard` component centered on the page.

**Hints:**

- Use the `export default function` syntax to create your `GamePage` component. This is similar to defining a component in Angular, but in React, we use functions instead of classes or decorators.

- To center the `GameBoard`, you can use Tailwind CSS classes. Consider using `flex`, `h-full`, `items-center`, and `justify-center` on a wrapping `div`.

- **Understanding Server Components:**
  - In Next.js 13, components inside the `app` directory are **server components** by default.
  - Server components are rendered on the server and sent as HTML to the client.
  - They cannot contain client-side interactivity (like state or event handlers).
  - Unlike Angular, which runs entirely on the client side, Next.js allows you to build both server-rendered and client-rendered components seamlessly.

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

**Try to implement this component before looking at the solution.**

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";

// The GamePage component is a server component by default
export default function GamePage() {
  return (
    // Center the GameBoard using Tailwind CSS classes
    <div className="flex h-full items-center justify-center">
      <GameBoard />
    </div>
  );
}
```

**Explanation:**

- **Tailwind CSS Classes:**

  - `flex`: Applies `display: flex`.
  - `h-full`: Sets the height to 100%.
  - `items-center`: Vertically centers the content.
  - `justify-center`: Horizontally centers the content.

- **Server Component:**
  - Since we're not using any state or lifecycle methods, this component remains a server component.
  - In Angular, all components run on the client side, but Next.js allows us to optimize rendering by splitting between server and client components.

</details>

---

## Creating the `GameBoard` Component

Next, you'll create the `GameBoard` component, which acts as the container for the game's UI elements—similar to a parent component in Angular.

### Exercise 2: Implementing the `GameBoard` Component

Your task is to create the `GameBoard` component that will contain the list of guesses and the input for new guesses.

**Instructions:**

1. **Create the File:**

   - Create a new file at `src/components/game-board.tsx`.

2. **Import Child Components:**

   - Import `GuessInput` and `GuessList` components (we'll create these later).

3. **Implement the `GameBoard` Component:**

   - Render both `GuessList` and `GuessInput` components.
   - Use a temporary hardcoded array of guesses for demonstration.

**Hints:**

- Use the `export const` syntax to create your `GameBoard` component as a named export. This is similar to exporting a component in Angular, but React components are typically functions.

- Create a `guesses` array with some sample strings like `["HELLO", "WORLD"]`. This mimics component state, which you'd typically manage with services or state management libraries in Angular.

- Use Tailwind CSS classes to style your component. Consider using `flex` and `flex-col` to stack the `GuessList` and `GuessInput` vertically.

- Pass the `guesses` array as a prop to the `GuessList` component. This demonstrates React's one-way data flow, which differs from Angular's two-way binding with `[(ngModel)]`.

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

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/game-board.tsx

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

// The GameBoard component acts as the main container for the game
export const GameBoard = () => {
  // Sample guesses array for demonstration
  const guesses = ["HELLO", "WORLD"];

  return (
    // Stack the components vertically with spacing
    <div className="flex flex-col gap-3">
      {/* Pass guesses to GuessList via props */}
      <GuessList guesses={guesses} />
      {/* Render the GuessInput component */}
      <GuessInput />
    </div>
  );
};
```

**Explanation:**

- **Guesses Array:**

  - We use a hardcoded array to simulate existing guesses.
  - In a real application, this data might come from a server or global state.

- **Tailwind CSS Classes:**

  - `flex flex-col`: Arranges child components vertically.
  - `gap-3`: Adds spacing between child components.

- **Props Passing:**
  - We pass the `guesses` array to the `GuessList` component as props.
  - In Angular, you might use `@Input()` to pass data to a child component.

</details>

---

## Implementing the `GuessInput` Component

The `GuessInput` component captures the user's input, allowing them to submit guesses. This is similar to creating a form component in Angular that handles user input.

### Exercise 3: Creating the `GuessInput` Component

Your task is to implement the `GuessInput` component that allows users to enter their guesses. This component will use React's state management.

**Instructions:**

1. **Create the File:**

   - Create a new file at `src/components/guess-input.tsx`.

2. **Import Dependencies:**

   - Import `useState` from React.
   - Import the `InputOTP`, `InputOTPGroup`, and `InputOTPSlot` components from our installed shadcn components.

3. **Implement the `GuessInput` Component:**

   - Use state to manage the current guess input.
   - Render an input field that accepts exactly 5 characters.
   - Implement handlers for input changes and guess submission.

**Hints:**

- **Custom Component Notice:**

  - The `InputOTP` component is a shadcn/ui component provided in the source code at `src/components/ui/input-otp.tsx`.
  - It allows users to input a fixed number of characters, making it ideal for our 5-letter Wordle guesses.

- **State Management:**

  - Use the `useState` hook to create a state variable for the guess and a function to update it.
  - This is similar to managing form control values in Angular using `FormControl` or `ngModel`.

- **Event Handling:**

  - Use the `onChange` prop of `InputOTP` to update your state when the input changes.
  - Implement an `onKeyDown` handler to check for the Enter key press and handle guess submission.

- **Client Component Directive:**
  - Since this component uses state and event handlers, it needs to be a **client component**.
  - Add `"use client";` at the top of the file to indicate this.

**Understanding Server and Client Components:**

- **Server Components:**

  - Rendered on the server.
  - Cannot use state or effects.
  - Ideal for static content.

- **Client Components:**
  - Rendered on the client.
  - Can use state and effects.
  - Required for interactivity.

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
      <InputOTPGroup>{/* TODO: Add InputOTPSlot components */}</InputOTPGroup>
    </InputOTP>
  );
};
```

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-input.tsx

"use client"; // Indicates this is a client component

import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

// Regular expression to allow only letters
import { REGEXP_ONLY_CHARS } from "input-otp";

export const GuessInput = () => {
  // State variable for the current guess
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5} // Limit input to 5 characters
      pattern={REGEXP_ONLY_CHARS} // Allow only letters
      value={guess} // Bind the input value to state
      onChange={(value) => setGuess(value)} // Update state on input change
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log(guess); // Log the guess (we'll handle submission later)
          setGuess(""); // Clear the input field
        }
      }}
    >
      <InputOTPGroup>
        {/* Render 5 input slots */}
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

**Explanation:**

- **useState Hook:**

  - We use `useState` to manage the guess input.
  - In Angular, you might use `FormControl` or `ngModel` for this purpose.

- **InputOTP Component:**

  - `maxLength={5}`: Ensures only 5 characters can be entered.
  - `pattern={REGEXP_ONLY_CHARS}`: Restricts input to letters only.
  - `value` and `onChange`: Bind the input value to the component state.

- **Event Handling:**

  - `onKeyDown`: Checks if the Enter key is pressed to trigger submission.

- **Client Component Directive:**
  - The `"use client";` directive is necessary because we use state and event handlers.

</details>

---

## Creating the `GuessList` Component

The `GuessList` component displays a list of previous guesses, similar to how you'd use `*ngFor` in Angular to render a list of items.

### Exercise 4: Implementing the `GuessList` Component

Your task is to create the `GuessList` component that renders a list of previous guesses.

**Instructions:**

1. **Create the File:**

   - Create a new file at `src/components/guess-list.tsx`.

2. **Import the `GuessItem` Component:**

   - We'll create this component in the next exercise.

3. **Implement the `GuessList` Component:**

   - Accepts an array of guesses as a prop.
   - Renders a `GuessItem` for each guess in the array.

**Hints:**

- **Props Definition:**

  - Define a type for the component's props that includes a `guesses` property of type `string[]`.
  - In Angular, you'd use `@Input()` to receive data from a parent component.

- **List Rendering:**

  - Use the `map` function to iterate over the `guesses` array and render `GuessItem` components.
  - This is similar to using `*ngFor` in Angular templates.

- **Key Prop:**
  - Provide a unique `key` prop when rendering lists in React.
  - In Angular, you might use `trackBy` for performance optimization.

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
    <>{/* TODO: Map over guesses and render GuessItem components */}</>
  );
};
```

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-list.tsx

"use client";

import { GuessItem } from "./guess-item";

type GuessListProps = {
  guesses: string[]; // Define the props type
};

export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    // Stack the GuessItem components vertically with spacing
    <div className="flex flex-col gap-3">
      {guesses.map((guess) => (
        <GuessItem key={guess} guess={guess} />
      ))}
    </div>
  );
};
```

**Explanation:**

- **Props Definition:**

  - We define the type `GuessListProps` to specify that `guesses` is an array of strings.

- **List Rendering:**

  - We use `guesses.map()` to iterate over the guesses and render a `GuessItem` for each.
  - The `key` prop helps React identify which items have changed.

- **Tailwind CSS Classes:**
  - `flex flex-col`: Arranges items vertically.
  - `gap-3`: Adds spacing between items.

</details>

---

## Implementing the `GuessItem` Component

The `GuessItem` component displays individual guesses.

### Exercise 5: Creating the `GuessItem` Component

Your final task is to implement the `GuessItem` component that displays a single guess.

**Instructions:**

1. **Create the File:**

   - Create a new file at `src/components/guess-item.tsx`.

2. **Import UI Components:**

   - Import `InputOTP`, `InputOTPGroup`, and `InputOTPSlot` from our custom UI library.

3. **Implement the `GuessItem` Component:**

   - Accepts a single guess as a prop.
   - Renders the guess using the `InputOTP` component in read-only mode.

**Hints:**

- **Props Definition:**

  - Define a type for the component's props that includes a `guess` property of type `string`.

- **Read-Only Input:**

  - Use the `readOnly` prop on `InputOTP` to prevent editing.

- **Rendering Each Character:**
  - Create a separate `GuessItemSlot` component to render each character.
  - Use an array of indices `[0, 1, 2, 3, 4]` to map over and create the slots.

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

---

<details>
<summary>👉 Click here to see the solution 👈</summary>

```typescript
// src/components/guess-item.tsx

"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: string; // Define the props type
};

// A helper component for rendering each slot
function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot index={index} className="h-12 w-12 text-2xl uppercase" />
  );
}

export function GuessItem({ guess }: GuessItemProps) {
  return (
    <InputOTP readOnly maxLength={5} value={guess}>
      <InputOTPGroup>
        {/* Render a slot for each character in the guess */}
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
```

**Explanation:**

- **Props Definition:**

  - We define `GuessItemProps` with a `guess` property.

- **Read-Only InputOTP:**

  - Setting `readOnly` to `true` displays the input without allowing edits.

- **Rendering Slots:**

  - We map over an array of indices to render each character slot.
  - The `GuessItemSlot` component renders each slot with consistent styling.

- **Client Component Directive:**
  - We include `"use client";` because we might add interactivity later.

</details>

---

## Updating the Root Layout

Ensure that your root layout is properly set up to provide consistent styling and metadata across your application, similar to configuring the main module in Angular.

**Modify your `src/app/layout.tsx` file to include the following:**

```typescript
// src/app/layout.tsx

import type { Metadata } from "next";
import "~/styles/globals.css"; // Import global styles

// Define metadata for the application
export const metadata: Metadata = {
  title: "Wordle Clone", // Title displayed in the browser tab
  description: "A Wordle clone built with Next.js and Drizzle", // Meta description
};

// The RootLayout component wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

**Explanation:**

- **Metadata:**

  - Similar to setting meta tags in `index.html` in Angular.

- **Global Styles:**

  - We import global CSS styles, akin to including styles in `styles.css` in Angular.

- **Layout Structure:**
  - The `RootLayout` component provides a consistent structure across all pages.

---

## Checking Your Progress

![Section 1 Checkpoint](img/1.png)

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
     - Each letter should appear in its own box, mimicking the Wordle style.

   - **Submitting a Guess:**

     - Press **Enter** after typing your guess.
     - The guess should be logged in the console (for now).
     - The input field should clear after submission.

**Expected Result:**

- The game board displays correctly with the sample guesses.
- The input field functions as expected, logging guesses to the console.

---

## Next Steps

In the next section, we'll go into implementing the core game logic and state management. This will involve:

- **Managing Global State:**

  - We'll explore state management solutions to share data between components.

- **Implementing Game Logic:**

  - You'll write functions to check user guesses against the target word.
  - Provide feedback by updating the UI based on whether letters are correct, present, or absent.

---

## Helpful Resources

To deepen your understanding of Next.js and its App Router, you might find the following resources helpful:

1. **Next.js Routing Fundamentals:**

   - [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
     - Learn how Next.js handles routing using the App Router, including file-based routing and nested layouts.

2. **Dynamic Routes in Next.js:**

   - [Dynamic Routes in Next.js](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
     - Understand how to create dynamic routes that capture parameters, similar to the `[gameId]` route we've used.

3. **Server and Client Components:**

   - [Understanding Server and Client Components](https://nextjs.org/docs/getting-started/react-essentials)
     - Explore the differences between server and client components in Next.js and how to use them effectively.

4. **Shadcn UI:**

   - [Shadcn UI](https://ui.shadcn.com/)
     - Shadcn UI is a component library that provides a set of reusable UI components for your Next.js application.

5. **React Hooks Documentation:**

   - [React Hooks](https://reactjs.org/docs/hooks-intro.html)
     - Learn more about using hooks like `useState` in React components.
