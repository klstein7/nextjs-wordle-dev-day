# 07: Styling and Polish

Welcome to the final section of the tutorial! In this part, you'll add visual polish to your Wordle clone, enhancing the user experience with improved styling and engaging effects. We'll focus on:

- Enhancing the game board for better visibility.
- Creating an engaging game over dialog with animations.
- Refining the styling of the guess input and on-screen keyboard.

These changes will make your game more enjoyable and visually appealing, similar to refining UI components in Angular applications.

---

## Exercise Objectives

- **Enhance** the game board's appearance for better user engagement.
- **Improve** the guess input styling to match the game board.
- **Create** an engaging game over dialog with animations.
- **Refine** the on-screen keyboard's styling for consistency.
- **Add** celebratory effects using `react-confetti`.

---

## Prerequisites

Before you begin, ensure you've completed the previous section or are up to date with the `checkpoint-06-game-over` branch.

**To get up to speed:**

1. **Switch to the branch:**

   ```bash
   git checkout checkpoint-06-game-over
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn dev
   ```

Once you've completed these steps, you're ready to add the final polish to your Wordle clone.

---

## Exercise 1: Install `react-confetti`

To add celebratory effects, we will use the `react-confetti` package to show confetti when the player wins the game.

**Instructions:**

- Run the following command to install the dependency:

  ```bash
  yarn add react-confetti
  ```

---

## Exercise 2: Enhance the Game Board

You'll improve the appearance of your game board to make it more engaging for users.

### Changes:

- Increased the size of each slot in the game board for better visibility.
- Added vibrant colors to provide clear feedback when a guess is correct, partially correct, or incorrect.

```typescript
// src/components/guess-item.tsx

"use client";

import { cn } from "~/lib/utils"; // Helper function to conditionally combine class names
import { type api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessItemProps = {
  guess: Awaited<ReturnType<typeof api.guesses.findByGameId>>[number];
};

function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn(
        // Updated the size of the slots for better visibility
        "h-16 w-16 border-none text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none",
        {
          // Updated colors for incorrect (X), correct (C), and partially correct (~) letters
          "bg-red-500 text-red-50": result === "X", // Incorrect letter, red background
          "bg-green-500 text-green-50": result === "C", // Correct letter, green background
          "bg-yellow-500 text-yellow-50": result === "~", // Partially correct, yellow background
        }
      )}
    />
  );
}

// Updated the GuessItem component to reflect the styling of each guess
export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup className="gap-2">
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

---

## Exercise 3: Improve the Guess Input

In this exercise, you'll enhance the appearance of the guess input field to match the game board's updated styling.

### Changes:

- Reused the `GuessItemSlot` styling from the game board for consistency.
- Styled the guess input to ensure the size and appearance matches the game board.

```typescript
// src/components/guess-input.tsx

"use client";

import { REGEXP_ONLY_CHARS } from "input-otp";

import { useCreateGuess } from "~/lib/hooks/use-create-guess"; // Hook to handle submitting guesses
import { useGuess } from "~/lib/hooks/use-guess"; // Hook to track the current guess state

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

// Reused the styling of GuessItemSlot from the game board for consistent appearance
function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      className="h-16 w-16 border text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none"
    />
  );
}

// Styled GuessInput component to align with the game board
export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  const createGuess = useCreateGuess();

  return (
    <InputOTP
      maxLength={5}
      pattern={REGEXP_ONLY_CHARS} // Ensures only valid characters are allowed
      value={guess}
      onChange={(value) => setGuess(value)} // Updates the guess state as user types
      onKeyDown={async (e) => {
        if (e.key === "Enter") {
          await createGuess(guess, gameId); // Submits the guess when Enter is pressed
        }
      }}
    >
      <InputOTPGroup className="gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

---

## Exercise 4: Create an Engaging Game Over Dialog

You’ll replace the simple game results display with a more engaging modal dialog, including confetti animations for a win.

### Changes:

- Added `react-confetti` for celebratory effects when the player wins.
- Created a modal dialog that displays the final game results (win/lose) along with all the guesses.
- Used the `Dialog` component for a clean and engaging interface.

```typescript
// src/components/game-results-dialog.tsx

"use client";

import { useCreateGame } from "~/lib/hooks/use-create-game"; // Hook to reset and create a new game
import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import Confetti from "react-confetti"; // Used for win celebration
import { Dialog, DialogContent } from "./ui/dialog"; // Modal dialog components
import { GuessItem } from "./guess-item"; // Reuse GuessItem component to display guesses
import { Button } from "./ui/button"; // Reusable button component

type GameResultsDialogProps = {
  status: (typeof games.status.enumValues)[number]; // The current game status
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>; // List of guesses for the current game
};

// Modal dialog to display game results with confetti on win
export const GameResultsDialog = ({
  status,
  guesses,
}: GameResultsDialogProps) => {
  const createGame = useCreateGame(); // Function to create a new game when user clicks "Play again"

  if (status === "in_progress") return null; // Don't show dialog if the game is still ongoing

  return (
    <Dialog open={true}>
      <DialogContent className="flex flex-col items-center gap-6 rounded-2xl p-12 md:max-w-fit">
        {status === "won" ? (
          <>
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <div className="text-7xl font-bold">you are</div>
                <div className="text-7xl font-bold text-green-500">
                  awesome!
                </div>
              </div>
              {/* Show the confetti animation when the player wins */}
              {guesses.map((guess) => (
                <GuessItem key={guess.id} guess={guess} />
              ))}
            </div>
            <Confetti
              className="h-full w-full"
              numberOfPieces={200} // Number of confetti pieces
              gravity={0.05} // Slow falling confetti effect
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <div className="text-7xl font-bold">better luck</div>
              <div className="text-7xl font-bold text-red-500">next time!</div>
            </div>
            {guesses.map((guess) => (
              <GuessItem key={guess.id} guess={guess} />
            ))}
          </div>
        )}
        <Button
          variant="outline"
          className="h-14 w-full rounded-xl text-xl font-semibold"
          size="lg"
          onClick={() => createGame()} // Allows the user to play again
        >
          Play again!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

---

## Exercise 5: Update the `GameBoard` Component

Now you'll modify the `GameBoard` component to use the new `GameResultsDialog` for displaying game over messages.

### Changes:

- Replaced the old `GameResults` component with the new `GameResultsDialog`.
- Passed the `status` and `guesses` props to the `GameResultsDialog`.

```typescript
// src/components/game-board.tsx

import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GameResultsDialog } from "./game-results-dialog"; // Import the new GameResultsDialog component
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  status: (typeof games.status.enumValues)[number]; // Game status (in progress, won, lost)
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>; // All guesses for the current game
};

// Updated the GameBoard component to include GameResultsDialog for game-over feedback
export const GameBoard = ({ gameId, status, guesses }: GameBoardProps) => {
  return (
    <div className="flex grow flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        {/* Display the list of guesses */}
        <GuessList guesses={guesses} />
        {/* Only show GuessInput if the game is still in progress */}
        {status === "in_progress" && <GuessInput gameId={gameId} />}
      </div>
      {/* Include the new GameResultsDialog to show results and confetti for wins */}
      <GameResultsDialog status={status} guesses={guesses} />
    </div>
  );
};
```

---

## Exercise 6: Refine the On-Screen Keyboard

Finally, you'll improve the styling of the on-screen keyboard for a more polished look.

### Changes:

- Updated the keyboard layout and button styling for better interaction.
- Adjusted the size and theme of the keys to be more responsive.

```typescript
// src/components/guess-keyboard.tsx

"use client";

import "react-simple-keyboard/build/css/index.css"; // Importing CSS for the virtual keyboard

import Keyboard from "react-simple-keyboard";

import { useCreateGuess } from "~/lib/hooks/use-create-guess"; // Hook to handle creating guesses
import { useGuess } from "~/lib/hooks/use-guess"; // Hook to track the user's current guess

type GuessKeyboardProps = {
  gameId: number;
};

// Updated styling for a more user-friendly and polished keyboard
export const GuessKeyboard = ({ gameId }: GuessKeyboardProps) => {
  const { guess, setGuess } = useGuess();

  const createGuess = useCreateGuess();

  return (
    <Keyboard
      theme="hg-theme-default !bg-secondary/75" // Applied custom theme to the keyboard
      buttonTheme={[
        {
          class:
            "!bg-background !text-foreground !border-none !shadow-none hover:!bg-secondary/50 active:!bg-white/25 !h-16",
          buttons:
            "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M {delete} {enter}",
        },
      ]}
      layout={{
        default: [
          "Q W E R T Y U I O P {delete}", // Added a row for the delete key
          "A S D F G H J K L {enter}", // Added a row for the enter key
          "Z X C V B N M", // Arranged the bottom row for letters
        ],
      }}
      onKeyPress={async (input) => {
        if (input === "{delete}") {
          setGuess(guess.slice(0, -1)); // Remove the last letter on delete press
          return;
        }

        if (input === "{enter}") {
          await createGuess(guess, gameId); // Submit the guess when enter is pressed
          return;
        }

        if (guess.length === 5) return; // Prevent further input after 5 characters

        setGuess(guess + input); // Add the pressed key to the guess
      }}
    />
  );
};
```

---

## Checking Your Progress

Now that you've implemented these styling and polish improvements, it's time to test your application.

**Instructions:**

1. **Start the Development Server:**

   ```bash
   yarn dev
   ```

2. **Navigate to a Game:**

   - Open your browser and go to `http://localhost:3000`.
   - Start a new game by clicking the "New game" button.

3. **Check the Game Board Appearance:**

![Section 7 Checkpoint - New appearance](img/10.png)

- **Game Board:**
  - The guess slots should be larger (`h-16 w-16`) with bigger letters (`text-3xl`).
  - There should be a gap between each letter due to `gap-2`.
  - The color-coding for guesses should be more vibrant.

4. **Test the Guess Input:**

   - **Consistency:**
     - The input slots should match the styling of the guess slots.
   - **Functionality:**
     - Typing letters should fill the slots.
     - The input should automatically submit when all slots are filled.

5. **Test the On-Screen Keyboard:**

   - **Appearance:**
     - The keyboard should have larger keys (`!h-16`).
     - Keys should have consistent styling with the rest of the app.
   - **Functionality:**
     - Pressing keys should update the guess input.
     - The "enter" key should submit the guess when appropriate.

6. **Play Through a Game:**

   - **Make Guesses:**
     - Observe the enhanced feedback with the updated color scheme.
     - Ensure the guess input clears after each submission.

7. **Check the Game Over Dialog:**

   - **Winning:**
     ![Section 7 Checkpoint - Win Scenario](img/8.png)
     - Win the game to see the confetti animation.
     - The dialog should display a congratulatory message in large, bold text.
   - **Losing:**
     ![Section 7 Checkpoint - Lose Scenario](img/9.png)
     - Lose the game to see the encouraging message.
   - **Common Elements:**
     - The dialog should display all your guesses.
     - A "Play again!" button should be present and functional.

If everything works as expected, congratulations! You've successfully polished your Wordle clone.

---

## Next Steps

Now that you've completed the tutorial, consider exploring additional enhancements:

- **Animations:**
  - Add flip or bounce animations to the guess slots when submitting guesses.
- **Accessibility:**
  - Ensure the game is accessible by adding ARIA labels and keyboard navigation.
- **Mobile Responsiveness:**
  - Optimize the layout and components for mobile devices.
- **Leaderboard Feature:**
  - Implement a leaderboard to track high scores or fastest wins.
- **Social Sharing:**
  - Allow users to share their results on social media platforms.
