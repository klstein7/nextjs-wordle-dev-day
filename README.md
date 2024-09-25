# Wordle Next.js Dev Day

Welcome to the **Wordle Next.js Dev Day**! This project was developed as part of the Technical Mentorship program to guide you through building a fully functional Wordle clone using **Next.js**, **Drizzle ORM**, **shadcn/ui**, and other modern web technologies. By the end of this tutorial, you'll have hands-on experience with full-stack development, understand how modern frameworks blur the line between client and server, and gain insights into state management, server actions, and UI components.

![Game Screenshot](docs/img/10.png)

![Game Won Screenshot](docs/img/8.png)

![Game Over Screenshot](docs/img/9.png)

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone this repository](#1-clone-this-repository)
  - [2. Open the project in your code editor](#2-open-the-project-in-your-code-editor)
    - [Recommended: Visual Studio Code](#recommended-visual-studio-code)
    - [Alternatively: IntelliJ IDEA](#alternatively-intellij-idea)
  - [3. Install the SQLite Viewer extension (Optional but recommended)](#3-install-the-sqlite-viewer-extension-optional-but-recommended)
    - [For Visual Studio Code](#for-visual-studio-code)
    - [For IntelliJ IDEA](#for-intellij-idea)
  - [4. Install dependencies](#4-install-dependencies)
  - [5. Set up your environment variables](#5-set-up-your-environment-variables)
  - [6. Run the development server](#6-run-the-development-server)
- [Tutorials and Documentation](#tutorials-and-documentation)
  - [Tutorial Sections](#tutorial-sections)
- [Tutorial Checkpoints](#tutorial-checkpoints)
- [Acknowledgements](#acknowledgements)

## Project Structure

```
wordle-clone/
│
├── src/
│   ├── app/                 # Next.js app directory (routes and pages)
│   │   ├── game/            # Game-related pages
│   │   │   └── [gameId]/    # Dynamic routes for individual games, handling game logic per session
│   │   └── page.tsx         # Home page component
│   ├── components/          # React components
│   │   ├── game-board.tsx       # Main game board component displaying the grid
│   │   ├── guess-input.tsx      # Input component for user guesses
│   │   ├── guess-keyboard.tsx   # On-screen keyboard component mimicking physical keyboard input
│   │   ├── game-results-dialog.tsx # Dialog component showing game results
│   │   └── ui/                  # Reusable UI components from shadcn/ui
│   ├── lib/                 # Utility functions and shared code
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Context and providers for state management
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

- **[Next.js 14+](https://nextjs.org/)**: A React framework for building server-rendered applications.
- **[Drizzle ORM](https://orm.drizzle.team/)**: A TypeScript ORM for interacting with the database.
- **[shadcn/ui](https://ui.shadcn.com/)**: A set of accessible and customizable UI components built with Radix UI and Tailwind CSS.
- **[TypeScript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.
- **[SQLite](https://www.sqlite.org/)**: A lightweight, file-based relational database.
- **[Yarn](https://yarnpkg.com/)**: A fast, reliable, and secure dependency management tool.

## Getting Started

I **highly recommend** using **Visual Studio Code (VS Code)** for this tutorial, as it provides excellent support for the technologies used and simplifies the development process. However, if you prefer **IntelliJ IDEA**, I've included instructions for that as well.

### Prerequisites

- **Node.js** (version 18 or higher): [Download Node.js](https://nodejs.org/en/download/)
- **Yarn** package manager: [Install Yarn](https://yarnpkg.com/getting-started/install)

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

If `code .` doesn't work (especially if you just installed VS Code), you may need to [add VS Code to your PATH](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) or restart your terminal.

If you don't have VS Code installed, you can download it from [https://code.visualstudio.com/](https://code.visualstudio.com/).

#### Alternatively: IntelliJ IDEA

If you prefer to use **IntelliJ IDEA**, follow these steps:

1. **Open IntelliJ IDEA**.
2. Click on **"Open"** from the welcome screen or go to **File > Open...** if you already have a project open.
3. Navigate to the cloned `nextjs-wordle-dev-day` directory and click **"Open"**.
4. IntelliJ IDEA may prompt you to import project settings. Choose **"Open as a new project"**.
5. Ensure that the IDE recognizes the project as a **Node.js** project. If prompted to install dependencies or configure Node.js settings, follow the on-screen instructions.

**Note**: While IntelliJ IDEA supports TypeScript and JavaScript development, some extensions and configurations may not be as straightforward as in VS Code. I recommend using VS Code for the best experience with this tutorial.

### 3. Install the SQLite Viewer extension (Optional but recommended)

This extension allows you to view and interact with your SQLite database directly within your code editor, which can be incredibly helpful for debugging and development.

#### For Visual Studio Code:

- Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
- Search for **"SQLite Viewer"**.
- Install the extension by **Florian Klampfer**.

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

## Tutorials and Documentation

In the `docs` folder of this project, you'll find detailed tutorials and additional resources guiding you through the development process. Each document corresponds to a specific section of the tutorial, providing step-by-step instructions, explanations of key concepts, and tips for building the Wordle clone.

### Tutorial Sections:

1. **[Section 01: Drizzle Setup](docs/01-drizzle-setup.md)**

   - Setting up Drizzle ORM for database interactions.
   - Configuring the database schema.

2. **[Section 02: Game Board Implementation](docs/02-game-board.md)**

   - Building the main game board UI.
   - Creating components for displaying guesses.

3. **[Section 03: Game Logic](docs/03-game-logic.md)**

   - Implementing core game logic and state management.
   - Handling guess submissions and game state.

4. **[Section 04: Keyboard Implementation](docs/04-keyboard.md)**

   - Creating an on-screen keyboard for user input.
   - Managing shared state between the keyboard and input field.

5. **[Section 05: Word Validation](docs/05-word-validation.md)**

   - Implementing word validation to ensure valid guesses.
   - Providing user feedback through toast notifications.

6. **[Section 06: Game Over Implementation](docs/06-game-over.md)**

   - Adding game over conditions and restart functionality.
   - Displaying game results and handling new game creation.

7. **[Section 07: Styling and Polish](docs/07-styling-polish.md)**
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

## Acknowledgements

- **David Lutzer and Matthew Ruttan** – Big thanks for testing the dev day and offering awesome feedback to make it better.
- **Tim Dodd** – Thanks for being a great mentor and always giving solid advice during the Technical Mentorship program.
