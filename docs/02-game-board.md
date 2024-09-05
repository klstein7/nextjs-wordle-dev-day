# Section 02: Game Board Implementation

Welcome to the game board implementation section of our Wordle clone! Before we dive in, let's make sure you're all caught up.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-01-drizzle-setup` branch. This contains all the work we've done in setting up our database with Drizzle ORM.

To get up to speed:

1. Switch to the `checkpoint-01-drizzle-setup` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn db:push` to set up your database schema

Once you've completed these steps, you'll be ready to start building the game board UI.

## Introduction for Angular and Spring Boot Developers

If you're coming from an Angular and Spring Boot background, you'll find many familiar concepts here, just expressed in React and Next.js syntax. We'll be building components, managing state, and creating a user interface, much like you would in Angular. The main differences will be in syntax and some React-specific concepts, but don't worry - we'll explain these as we go along.

Now, let's dive in and build our game board step by step!

## Step 1: Set up the Game Page

First, we'll create our game page component. In Next.js, we use file-based routing, which might feel different from Angular's router setup.

Create a new file `src/app/game/[gameId]/page.tsx`:

```typescript
// src/app/game/[gameId]/page.tsx

import { GameBoard } from "~/components/game-board";

export default function GamePage() {
  return (
    // This div centers the GameBoard component both vertically and horizontally
    // 'h-full' makes the div take full height of its parent
    // 'flex', 'items-center', and 'justify-center' are Tailwind classes for centering
    <div className="flex h-full items-center justify-center">
      {/* The GameBoard component is rendered here */}
      {/* In Next.js, components are composed similar to Angular, but using JSX syntax */}
      <GameBoard />
    </div>
  );
}

// Note: In Next.js, this file automatically becomes a route due to file-based routing
// The [gameId] in the folder name allows for dynamic routing, similar to route parameters in Angular
```

Here, we're defining a page component that centers our `GameBoard`. If you're used to Angular, think of this as a component that automatically becomes a route based on its file location.

## Step 2: Create the GameBoard Component

Now, let's build our main `GameBoard` component.

Create a new file `src/components/game-board.tsx`:

```typescript
// src/components/game-board.tsx

import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

export const GameBoard = () => {
  // This array simulates the state of previous guesses
  // In a full implementation, this would likely come from a state management solution or props
  const guesses = ["HELLO", "WORLD"];

  return (
    // This div uses flexbox to stack child components vertically with some spacing
    <div className="flex flex-col gap-3">
      {/* The GuessList component receives the guesses as a prop */}
      {/* This is similar to property binding in Angular */}
      <GuessList guesses={guesses} />

      {/* The GuessInput component is where the user will enter their guess */}
      <GuessInput />
    </div>
  );
};

// Note: In React, we compose larger components from smaller ones, similar to Angular
// The main difference is the JSX syntax used here instead of Angular's template syntax
```

This component combines our `GuessList` and `GuessInput`. For Angular developers, you can think of this as composing smaller components to build a larger feature.

## Step 3: Implement the GuessInput Component

Let's create the `GuessInput` component to handle user input.

Create a new file `src/components/guess-input.tsx`:

```typescript
// src/components/guess-input.tsx

"use client"; // This directive is necessary for client-side interactivity in Next.js

import { REGEXP_ONLY_CHARS } from "input-otp";
import { useState } from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const GuessInput = () => {
  // useState is React's way of managing component-level state
  // It's similar to component properties in Angular, but with built-in update mechanisms
  const [guess, setGuess] = useState<string>("");

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS}
      value={guess}
      // onChange updates the state when the input changes
      // This is similar to Angular's ngModel, but more explicit
      onChange={(value) => setGuess(value)}
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          console.log(guess);
          setGuess(""); // Clear the input after submitting
        }
      }}
    >
     {/*
        We're using InputOTP here for several reasons:
        1. It provides a fixed-length input, perfect for Wordle's 5-letter format
        2. It offers individual character slots, mimicking Wordle's grid layout
        3. It handles focus management automatically, improving user experience
        4. It's easily customizable to match Wordle's visual style
        5. It often includes built-in validation, ensuring only valid characters are entered
      */}
      <InputOTPGroup>
        {/* We create 5 input slots for the 5-letter word */}
        {/* This is similar to using *ngFor in Angular templates */}
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
// Note: While InputOTP is typically used for one-time passwords,
// we're repurposing it here to create a Wordle-like input experience.
// This saves us time in implementing custom input logic and styling.
```

Here, we're using React's `useState` hook to manage the input state. For Angular developers, this is akin to using component properties and methods to handle form inputs.

## Step 4: Create the GuessList Component

Next, we'll create the `GuessList` component to display previous guesses.

Create a new file `src/components/guess-list.tsx`:

```typescript
// src/components/guess-list.tsx

"use client"; // This directive is necessary for client-side interactivity in Next.js

import { GuessItem } from "./guess-item";

// This type definition is similar to interface definitions in TypeScript for Angular
type GuessListProps = {
  guesses: string[];
};

// The component receives props, similar to @Input() in Angular
export const GuessList = ({ guesses }: GuessListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* We map over the guesses array to render a GuessItem for each guess */}
      {/* This is similar to using *ngFor in Angular templates */}
      {guesses.map((guess) => (
        <GuessItem key={guess} guess={guess} />
      ))}
    </div>
  );
};
```

This component takes an array of guesses and renders a `GuessItem` for each one. It's similar to using `*ngFor` in Angular templates, but with JSX syntax.

## Step 5: Implement the GuessItem Component

Finally, let's create the `GuessItem` component to display individual guesses.

Create a new file `src/components/guess-item.tsx`:

```typescript
// src/components/guess-item.tsx

"use client"; // This directive is necessary for client-side interactivity in Next.js

import { cn } from "~/lib/utils";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

// Type definition for the component's props
type GuessItemProps = {
  guess: string;
};

// This is a helper component to render each letter slot
function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn("h-12 w-12 text-2xl uppercase")}
    />
  );
}

// The main GuessItem component
export function GuessItem({ guess }: GuessItemProps) {
  return (
    <InputOTP readOnly maxLength={5} value={guess}>
      <InputOTPGroup>
        {/* We create 5 slots for the 5-letter word */}
        {/* This is similar to using *ngFor in Angular templates */}
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
```

This component displays a single guess using the same `InputOTP` component as our input field, but in a read-only state.

## Step 6: Update the Root Layout

Lastly, let's update our root layout to ensure proper styling.

Modify `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "~/styles/globals.css";

// Metadata for the application, similar to meta tags in Angular
export const metadata: Metadata = {
  title: "Wordle Clone",
  description: "A Wordle clone built with Next.js and Drizzle",
};

// This is the root layout component, similar to app.component.ts in Angular
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      {/* The 'h-screen' class ensures the body takes up the full viewport height */}
      <body className="h-screen">{children}</body>
    </html>
  );
}
```

This layout wraps all our pages and applies some global styles. It's somewhat analogous to the main app component in Angular.

## Conclusion

Great job! You've now set up the basic structure for your Wordle clone's game board. For those coming from Angular and Spring Boot, you'll notice that while the syntax is different, many concepts are similar:

- Components are the building blocks of your UI
- Props in React serve a similar purpose to inputs in Angular
- State management (like `useState`) is analogous to component properties and methods in Angular
- JSX allows you to write your template directly in your component file

In the next section, we'll dive into implementing the core game logic and state management. This will involve concepts similar to services and more complex component interactions in Angular.

Remember, while the syntax may be new, the core principles of component-based architecture and state management will feel familiar. Happy coding!
