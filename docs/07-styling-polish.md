# Section 07: Styling and Polish

Welcome to the final section of our Wordle clone tutorial! In this part, we'll add some visual polish and improve the overall user experience. We'll focus on enhancing the game board, creating a more engaging game over dialog, and refining the styling throughout the application.

## Getting Started

If you're just joining us or need to catch up, check out the `checkpoint-06-game-over` branch. This contains all the work we've done in implementing the game over logic.

To get up to speed:

1. Switch to the `checkpoint-06-game-over` branch
2. Run `yarn install` to ensure all dependencies are installed
3. Run `yarn dev` to start the development server

Once you've completed these steps, you'll be ready to add the final polish to your Wordle clone.

## Step 0: Install react-confetti

Before we start with the styling changes, let's install the react-confetti package. We'll use this to add a celebratory effect when the player wins the game.

Run the following command in your terminal:

```bash
yarn add react-confetti
```

This will add react-confetti to your project dependencies.

## Step 1: Enhance the Game Board

Let's start by improving the appearance of our game board.

### Exercise 1:

Update the `GuessItem` component in `src/components/guess-item.tsx`:

```typescript
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
        },
      )}
    />
  );
}

export const GuessItem = ({ guess }: GuessItemProps) => {
  return (
    <InputOTP readOnly maxLength={5} value={guess.guess}>
      <InputOTPGroup className="gap-2"> {/* Add gap between guess slots */}
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

## Step 2: Improve the Guess Input

Next, let's enhance the appearance of the guess input to match the styled guess items.

### Exercise 2:

Update the `GuessInput` component in `src/components/guess-input.tsx`:

```typescript
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
          await api.guesses.create(value, gameId);
          setGuess("");
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <InputOTPGroup className="gap-2"> {/* Add gap between input slots */}
        {[0, 1, 2, 3, 4].map((index) => (
          <GuessItemSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
```

## Step 3: Create an Engaging Game Over Dialog

Let's replace the simple game results display with a more engaging dialog.

### Exercise 3:

Create a new file `src/components/game-results-dialog.tsx`:

```typescript
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

## Step 4: Update the Game Board Component

Now, let's update the `GameBoard` component to use our new `GameResultsDialog`.

### Exercise 4:

Update `src/components/game-board.tsx`:

```typescript
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

## Step 5: Refine the On-Screen Keyboard

Let's improve the styling of our on-screen keyboard.

### Exercise 5:

Update the `GuessKeyboard` component in `src/components/guess-keyboard.tsx`:

```typescript
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
            "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M {delete} {enter}",
        },
      ]}
    />
  );
};
```

These changes enhance the keyboard's appearance and make it more consistent with the overall design.

## Conclusion

Congratulations! You've now added the final polish to your Wordle clone. The game now features:

1. An enhanced game board with improved visibility and styling
2. A refined guess input that matches the game board's aesthetic
3. An engaging game over dialog with celebratory effects for wins
4. A more polished on-screen keyboard

These improvements significantly enhance the user experience and make your Wordle clone more visually appealing and enjoyable to play.

In this section, we focused on:

- Consistent styling across components
- Using vibrant colors for better feedback
- Creating an engaging game over experience
- Refining the overall user interface

Remember, great design is iterative. Feel free to continue tweaking and improving the game's appearance and functionality based on user feedback and your own ideas!
