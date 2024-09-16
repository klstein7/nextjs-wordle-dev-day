# 07: Styling and Polish

Welcome to the final section of our tutorial! In this part, you'll add visual polish to your Wordle clone, enhancing the user experience with improved styling and engaging effects. We'll focus on:

- Enhancing the game board for better visibility.
- Creating an engaging game over dialog with animations.
- Refining the styling of the guess input and on-screen keyboard.

These changes will make your game more enjoyable and visually appealing, similar to refining UI components in Angular applications.

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

## Tasks and Hints

### 0. Install `react-confetti`

**Task:** Install the `react-confetti` library to add a celebratory effect when the player wins the game.

**Why:** Visual effects enhance user experience, making the game more engaging and rewarding upon winning.

**Instructions:**

- Run the following command to install the dependency:

  ```bash
  yarn add react-confetti
  ```

---

### 1. Enhance the Game Board

**Task:** Improve the appearance of your game board for better visibility and user engagement.

**Why:** A well-designed game board enhances user experience, making the game more enjoyable and accessible.

**Instructions:**

- **Update** the `GuessItem` component in `src/components/guess-item.tsx`.
- **Adjust** the styling to increase the size and improve the color scheme.

**Example:**

```typescript
// src/components/guess-item.tsx

function GuessItemSlot({ index, result }: { index: number; result: string }) {
  return (
    <InputOTPSlot
      index={index}
      className={cn(
        // Increase size and adjust styling for better visibility
        "h-16 w-16 border-none text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none",
        {
          // Update color scheme for more vibrant feedback
          "bg-red-500 text-red-50": result === "X",
          "bg-green-500 text-green-50": result === "C",
          "bg-yellow-500 text-yellow-50": result === "~",
        }
      )}
    />
  );
}

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup className="gap-2">
        {/* Add gap between guess slots */}
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot
            key={index}
            index={index}
            result={guess.result[index]}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

**Comments:**

- **Increased Size:**
  - Updated `h-12 w-12` to `h-16 w-16` for larger slots.
  - Changed `text-2xl` to `text-3xl` for bigger letters.
- **Styling Adjustments:**
  - Added `font-medium` for bolder text.
  - Used `border-none` to remove borders for a cleaner look.
  - Adjusted `first:rounded-l-none` and `last:rounded-r-none` to customize corner rounding.
- **Color Scheme:**
  - Used more vibrant colors (`bg-red-500`, `bg-green-500`, `bg-yellow-500`) for better feedback.
- **Spacing:**
  - Added `gap-2` in `InputOTPGroup` to create space between slots.

---

### 2. Improve the Guess Input

**Task:** Enhance the appearance of the guess input to match the styled guess items.

**Why:** Consistent styling across components provides a cohesive user experience.

**Instructions:**

- **Update** the `GuessInput` component in `src/components/guess-input.tsx`.
- **Create** a separate `GuessItemSlot` component for consistent styling.

**Example:**

```typescript
// src/components/guess-input.tsx

"use client";

import { useGuess } from "~/lib/hooks/use-guess";
import { api } from "~/server/api";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

type GuessInputProps = {
  gameId: number;
};

// Create a separate component for consistent styling
function GuessItemSlot({ index }: { index: number }) {
  return (
    <InputOTPSlot
      index={index}
      // Match styling with guess items
      className="h-16 w-16 border text-3xl font-medium uppercase first:rounded-l-none last:rounded-r-none"
    />
  );
}

export const GuessInput = ({ gameId }: GuessInputProps) => {
  const { guess, setGuess } = useGuess();

  return (
    <InputOTP
      maxLength={5}
      value={guess}
      onChange={(value) => setGuess(value)}
      onComplete={async (value) => {
        try {
          // Submit the guess when input is complete
          await api.guesses.create(value, gameId);
          setGuess("");
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <InputOTPGroup className="gap-2">
        {/* Add gap between input slots */}
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

**Comments:**

- **Separate Component:**
  - Created `GuessItemSlot` to reuse styling between `GuessItem` and `GuessInput`.
- **Styling Adjustments:**
  - Matched `h-16 w-16`, `text-3xl`, and `font-medium` to align with `GuessItem`.
  - Added `border` to distinguish the input slots.
- **Consistency:**
  - Ensured the input slots have the same look and feel as the displayed guesses.
- **Functionality:**
  - Used `onComplete` to submit the guess automatically when the user finishes typing.
- **Error Handling:**
  - Wrapped API call in a `try-catch` block to handle potential errors gracefully.

---

### 3. Create an Engaging Game Over Dialog

**Task:** Replace the simple game results display with a more engaging dialog, including animations.

**Why:** Providing a celebratory effect upon winning enhances user satisfaction and game enjoyment.

**Instructions:**

- **Create** a new file `src/components/game-results-dialog.tsx`.
- **Use** `react-confetti` for the win animation.
- **Display** all guesses in the dialog.

**Example:**

```typescript
// src/components/game-results-dialog.tsx

"use client";

import { useMemo } from "react";
import Confetti from "react-confetti";

import { useCreateGame } from "~/lib/hooks/use-create-game";
import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GuessItem } from "./guess-item";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

type GameResultsDialogProps = {
  status: (typeof games.status.enumValues)[number];
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameResultsDialog = ({
  status,
  guesses,
}: GameResultsDialogProps) => {
  const createGame = useCreateGame();

  if (status === "in_progress") return null;

  return (
    <Dialog open={true}>
      <DialogContent
        // Style the dialog for a more engaging appearance
        className="flex flex-col items-center gap-6 rounded-2xl p-12 md:max-w-fit"
        withClose={false}
      >
        {status === "won" ? (
          <>
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                {/* Large, bold text for win message */}
                <div className="text-7xl font-bold">you are</div>
                <div className="text-7xl font-bold text-green-500">
                  awesome!
                </div>
              </div>
              {/* Display all guesses */}
              {guesses.map((guess) => (
                <GuessItem key={guess.id} guess={guess} />
              ))}
            </div>
            {/* Add confetti effect for wins */}
            <Confetti
              className="h-full w-full"
              numberOfPieces={200}
              gravity={0.05}
            />
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              {/* Large, bold text for lose message */}
              <div className="text-7xl font-bold">better luck</div>
              <div className="text-7xl font-bold text-red-500">next time!</div>
            </div>
            {/* Display all guesses */}
            {guesses.map((guess) => (
              <GuessItem key={guess.id} guess={guess} />
            ))}
          </div>
        )}
        {/* Play again button */}
        <Button
          variant="outline"
          className="h-14 w-full rounded-xl text-xl font-semibold"
          size="lg"
          onClick={() => createGame()}
        >
          Play again!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

**Comments:**

- **Dialog Component:**
  - Uses `Dialog` and `DialogContent` to create a modal dialog.
  - `open={true}` keeps the dialog visible when the game is over.
- **Styling Enhancements:**
  - Applied `flex`, `gap`, `rounded-2xl`, and `p-12` for improved layout and appearance.
- **Win Scenario:**
  - Displays a congratulatory message with large, bold text.
  - Shows all guesses using the `GuessItem` component.
  - Includes a confetti effect using `Confetti` component from `react-confetti`.
- **Lose Scenario:**
  - Displays an encouraging message with large, bold text.
  - Shows all guesses.
- **Play Again Button:**
  - Styled with `h-14`, `w-full`, `rounded-xl`, `text-xl`, and `font-semibold`.
  - Calls `createGame()` to start a new game when clicked.
- **Conditional Rendering:**
  - Uses a ternary operator to switch between win and lose scenarios.

---

### 4. Update the `GameBoard` Component

**Task:** Modify the `GameBoard` component to use the new `GameResultsDialog` for displaying game over messages.

**Why:** Integrating the new dialog provides a more engaging user experience upon game completion.

**Instructions:**

- **Update** `src/components/game-board.tsx`.
- **Replace** the old `GameResults` component with `GameResultsDialog`.

**Example:**

```typescript
// src/components/game-board.tsx

import { type api } from "~/server/api";
import { type games } from "~/server/db/schema";

import { GameResultsDialog } from "./game-results-dialog";
import { GuessInput } from "./guess-input";
import { GuessList } from "./guess-list";

type GameBoardProps = {
  gameId: number;
  status: (typeof games.status.enumValues)[number];
  guesses: Awaited<ReturnType<typeof api.guesses.findByGameId>>;
};

export const GameBoard = ({ gameId, status, guesses }: GameBoardProps) => {
  return (
    <div className="flex grow flex-col items-center gap-6">
      <div className="flex flex-col gap-2">
        {/* Display the list of guesses */}
        <GuessList guesses={guesses} />
        {/* Only show GuessInput if the game is still in progress */}
        {status === "in_progress" && <GuessInput gameId={gameId} />}
      </div>
      {/* Add the new GameResultsDialog component */}
      <GameResultsDialog status={status} guesses={guesses} />
    </div>
  );
};
```

**Comments:**

- **Imports:**
  - Imported `GameResultsDialog` instead of the old `GameResults` component.
- **Component Structure:**
  - Wrapped `GuessList` and `GuessInput` inside a `div` with `flex-col` and `gap-2` for better spacing.
- **Integration:**
  - Added `<GameResultsDialog status={status} guesses={guesses} />` to display the game over dialog when appropriate.
- **Clean-up:**
  - Removed the old `GameResults` component to avoid redundancy.

---

### 5. Refine the On-Screen Keyboard

**Task:** Improve the styling of the on-screen keyboard for a more polished look.

**Why:** Consistent and refined styling enhances the overall user experience.

**Instructions:**

- **Update** the `GuessKeyboard` component in `src/components/guess-keyboard.tsx`.
- **Adjust** the keyboard layout and button styling.

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
      layout={{
        default: [
          "Q W E R T Y U I O P",
          "A S D F G H J K L",
          "{enter} Z X C V B N M {bksp}",
        ],
      }}
      display={{
        "{enter}": "enter",
        "{bksp}": "⌫",
      }}
      maxLength={5}
      value={guess}
      onChange={(value) => setGuess(value)}
      onKeyPress={async (button) => {
        if (button === "{enter}" && guess.length === 5) {
          try {
            // Submit the guess when Enter is pressed
            await api.guesses.create(guess, gameId);
            setGuess("");
          } catch (error) {
            console.error(error);
          }
        }
      }}
      buttonTheme={[
        {
          // Improve button styling for a more polished look
          class:
            "!bg-background !text-foreground !border-none !shadow-none hover:!bg-secondary/50 active:!bg-white/25 !h-16",
          buttons:
            "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M {bksp} {enter}",
        },
      ]}
    />
  );
};
```

**Comments:**

- **Layout Adjustments:**
  - Modified the keyboard layout for better ergonomics.
  - Moved `{enter}` and `{bksp}` keys to more intuitive positions.
- **Display Customization:**
  - Customized key labels: `{enter}` displays as "enter", `{bksp}` displays as "⌫".
- **Styling Enhancements:**
  - Increased button height with `!h-16` for larger keys.
  - Refined button classes for consistent appearance with the rest of the app.
- **Functionality:**
  - Added `maxLength={5}` to prevent input beyond five characters.
  - Ensured that pressing "Enter" only submits when the guess length is 5.
- **Error Handling:**
  - Wrapped the API call in a `try-catch` block to handle errors.

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
     - Win the game to see the confetti animation.
     - The dialog should display a congratulatory message in large, bold text.
   - **Losing:**
     - Lose the game to see the encouraging message.
   - **Common Elements:**
     - The dialog should display all your guesses.
     - A "Play again!" button should be present and functional.

8. **Monitor for Errors:**

   - Check the browser console and terminal for any error messages.
   - Ensure all components are interacting correctly.

If everything works as expected, congratulations! You've successfully polished your Wordle clone.

---

## Conclusion

Great job! In this final section, you've:

- **Enhanced** the game board for better visibility and user engagement.
- **Improved** the guess input to match the game board's styling.
- **Created** an engaging game over dialog with animations using `react-confetti`.
- **Refined** the on-screen keyboard for a more polished look.
- **Consistently styled** components for a cohesive user experience.

These improvements significantly enhance the user experience, making your Wordle clone more visually appealing and enjoyable to play.

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

By continuing to build on your application, you'll further refine your skills in React and Next.js and create an even more engaging user experience.

---

By following this structured approach and incorporating insightful comments in your code, you've enhanced your Wordle clone in a manner similar to refining UI components in Angular applications.

Congratulations on completing the tutorial! 🎉

---
