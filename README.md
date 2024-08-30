# Wordle Clone Tutorial

Welcome to the Wordle Clone Tutorial! This project guides you through building a Wordle clone using Next.js, Drizzle ORM, and shadcn/ui in just one day.

## Project Structure

```
wordle-clone/
│
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and shared code
│   ├── server/              # Server-side code
│   └── styles/              # CSS files
├── public/                  # Static files
├── .env.example             # Example environment variables
├── drizzle.config.ts        # Drizzle ORM configuration
├── next.config.js           # Next.js configuration
├── package.json
├── README.md
├── tailwind.config.ts       # Tailwind CSS configuration
└── yarn.lock                # Yarn lock file
```

## Technologies Used

- Next.js 14+
- Drizzle ORM
- shadcn/ui
- TypeScript
- Tailwind CSS
- Yarn (package manager)

## Getting Started

1. Clone this repository:

   ```
   git clone https://github.com/your-username/wordle-clone-tutorial.git
   ```

2. Install dependencies:

   ```
   cd wordle-clone-tutorial
   yarn install
   ```

3. Set up your environment variables:

   - Copy `.env.example` to `.env.local`

   ```
   cp .env.example .env.local
   ```

   - The database credentials are pre-configured in the .env.example file, so you don't need to change anything for this tutorial.

4. Run the development server:

   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Tutorial Checkpoints

The tutorial is divided into the following key stages, each represented by a checkpoint branch:

1. `main` - Initial setup
2. `checkpoint-01-game-board` - Implementing the game board UI
3. `checkpoint-02-game-logic` - Adding core game logic and state management
4. `checkpoint-03-keyboard` - Creating the on-screen keyboard
5. `checkpoint-04-word-validation` - Implementing word validation and feedback
6. `checkpoint-05-game-over` - Adding game over conditions and restart functionality
7. `checkpoint-06-styling-polish` - Final styling and UI polish

These checkpoints allow you to verify your progress or jump to a specific point in the tutorial if needed.

To switch to a checkpoint branch, use:

```
git checkout <checkpoint-branch-name>
```

## Tutorial Steps

1. Start with the `main` branch for initial setup.
2. Progress through each checkpoint, implementing the features described.
3. After completing each section, you can compare your work with the corresponding checkpoint branch.
4. If you get stuck, you can use the checkpoint branches as a reference or starting point.
5. By the time you reach the `checkpoint-06-styling-polish` branch, you'll have a fully functional Wordle clone.

Remember, these checkpoints are here to help you, but the real learning comes from working through the implementation yourself!

## Contributing

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
