# Next.js Dev Day - Wordle Clone

Welcome to the **Wordle Clone Tutorial**! This project guides you through building a fully functional Wordle clone using **Next.js**, **Drizzle ORM**, **shadcn/ui**, and other modern web technologies. By the end of this tutorial, you'll have a deeper understanding of building interactive web applications with a robust backend and a polished frontend.

![Game Screenshot](docs/img/1.png)

![Game Won Screenshot](docs/img/2.png)

![Game Over Screenshot](docs/img/3.png)

## Project Structure

```
wordle-clone/
│
├── src/
│   ├── app/                 # Next.js app directory (routes and pages)
│   │   ├── game/            # Game-related pages
│   │   │   └── [gameId]/    # Dynamic routes for individual games
│   │   └── page.tsx         # Home page component
│   ├── components/          # React components
│   │   ├── game-board.tsx       # Main game board component
│   │   ├── guess-input.tsx      # Input component for guesses
│   │   ├── guess-keyboard.tsx   # On-screen keyboard component
│   │   ├── game-results-dialog.tsx # Game over dialog component
│   │   └── ui/                  # UI components from shadcn/ui
│   ├── lib/                 # Utility functions and shared code
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Context and providers
│   │   ├── utils.ts             # Utility functions
│   │   └── words.ts             # Word list for the game
│   ├── server/              # Server-side code
│   │   ├── api.ts               # API functions for server actions
│   │   ├── db/                  # Database schema and configuration
│   │   └── services/            # Server-side logic (game and guess services)
│   ├── styles/              # CSS files
│   │   └── globals.css          # Global styles
│   └── pages/               # (If using pages directory)
├── docs/                    # Tutorial documents and additional resources
├── public/                  # Static files
├── .env.example             # Example environment variables
├── drizzle.config.ts        # Drizzle ORM configuration
├── next.config.js           # Next.js configuration
├── package.json
├── README.md
├── tailwind.config.js       # Tailwind CSS configuration
└── yarn.lock                # Yarn lock file
```

## Technologies Used

- **Next.js 14+**: A React framework for building server-rendered applications.
- **Drizzle ORM**: A TypeScript ORM for interacting with the database.
- **shadcn/ui**: A set of accessible and customizable UI components built with Radix UI and Tailwind CSS.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **SQLite**: A lightweight, file-based relational database.
- **Yarn**: A fast, reliable, and secure dependency management tool.

## Getting Started

We **highly recommend** using **Visual Studio Code (VS Code)** for this tutorial, as it provides excellent support for the technologies used and simplifies the development process. However, if you prefer **IntelliJ IDEA**, we've included instructions for that as well.

### Prerequisites

- **Node.js** (version 14 or higher)
- **Yarn** package manager

### 1. Clone this repository

Open your terminal and run:

```bash
git clone https://github.com/farmcreditca/nextjs-wordle-dev-day.git
```

### 2. Open the project in your code editor

#### Recommended: Visual Studio Code

Open the project in **Visual Studio Code**:

```bash
cd nextjs-wordle-dev-day
code .
```

If you don't have VS Code installed, you can download it from [https://code.visualstudio.com/](https://code.visualstudio.com/).

#### Alternatively: IntelliJ IDEA

If you prefer to use **IntelliJ IDEA**, follow these steps:

1. **Open IntelliJ IDEA**.
2. Click on **"Open"** from the welcome screen or go to **File > Open...** if you already have a project open.
3. Navigate to the cloned `nextjs-wordle-dev-day` directory and click **"Open"**.
4. IntelliJ IDEA may prompt you to import project settings. Choose **"Open as a new project"**.
5. Ensure that the IDE recognizes the project as a **Node.js** project. If prompted to install dependencies or configure Node.js settings, follow the on-screen instructions.

**Note**: While IntelliJ IDEA supports TypeScript and JavaScript development, some extensions and configurations may not be as straightforward as in VS Code. We recommend using VS Code for the best experience with this tutorial.

### 3. Install the SQLite Viewer extension (Optional but recommended)

#### For Visual Studio Code:

- Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
- Search for **"SQLite Viewer"**.
- Install the extension by **Florian Klampfer**.

This extension allows you to view your SQLite database directly in VS Code.

#### For IntelliJ IDEA:

- IntelliJ IDEA does not have a built-in SQLite viewer, but you can use the **Database** tool window to connect to the SQLite database.
- Go to **View > Tool Windows > Database**.
- Click the **"+"** icon to add a new data source.
- Select **"SQLite"** from the list.
- In the **Database files** field, navigate to your project's database file (e.g., `./sqlite.db`).
- Click **"OK"** to connect.

### 4. Install dependencies

In your terminal, navigate to the project directory (if not already there) and run:

```bash
cd nextjs-wordle-dev-day
yarn install
```

### 5. Set up your environment variables

Copy the example `.env` file to create your own `.env` file:

```bash
cp .env.example .env
```

The database credentials are pre-configured in the `.env.example` file, so you don't need to change anything for this tutorial.

### 6. Run the development server

Start the development server by running:

```bash
yarn dev
```

### 7. Open the application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the Wordle clone in action.

## Tutorials and Documentation

In the `docs` folder of this project, you'll find detailed tutorials and additional resources guiding you through the development process. Each document corresponds to a specific section of the tutorial, providing step-by-step instructions, explanations of key concepts, and tips for building the Wordle clone.

### Tutorial Sections:

1. **Section 01: Drizzle Setup**

   - Setting up Drizzle ORM for database interactions.
   - Configuring the database schema.

2. **Section 02: Game Board Implementation**

   - Building the main game board UI.
   - Creating components for displaying guesses.

3. **Section 03: Game Logic**

   - Implementing core game logic and state management.
   - Handling guess submissions and game state.

4. **Section 04: Keyboard Implementation**

   - Creating an on-screen keyboard for user input.
   - Managing shared state between the keyboard and input field.

5. **Section 05: Word Validation**

   - Implementing word validation to ensure valid guesses.
   - Providing user feedback through toast notifications.

6. **Section 06: Game Over Implementation**

   - Adding game over conditions and restart functionality.
   - Displaying game results and handling new game creation.

7. **Section 07: Styling and Polish**

   - Enhancing the UI with improved styling and animations.
   - Adding visual effects for a more engaging experience.

Each section builds upon the previous ones, so it's recommended to follow them in order. The tutorials are designed to complement the code in each checkpoint and provide a deeper understanding of the technologies and techniques used.

## Tutorial Checkpoints

The tutorial is divided into key stages, each represented by a checkpoint branch in the Git repository. These checkpoints allow you to verify your progress or jump to a specific point in the tutorial if needed.

### Checkpoints:

1. **`main`** - Initial project setup.
2. **`checkpoint-01-drizzle-setup`** - Setting up Drizzle ORM and the database schema.
3. **`checkpoint-02-game-board`** - Implementing the game board UI and guess components.
4. **`checkpoint-03-game-logic`** - Adding core game logic and state management.
5. **`checkpoint-04-keyboard`** - Creating the on-screen keyboard and shared state.
6. **`checkpoint-05-word-validation`** - Implementing word validation and error handling.
7. **`checkpoint-06-game-over`** - Adding game over conditions and restart options.
8. **`checkpoint-07-styling-polish`** - Final styling enhancements and UI polish.

To switch to a checkpoint branch, use:

```bash
git checkout <checkpoint-branch-name>
```

For example:

```bash
git checkout checkpoint-03-game-logic
```
