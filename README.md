# Whist Wizard

Whist Wizard is a digital scoreboard application for the card game Contract Whist. This React-based web app allows players to track scores during gameplay without the need for pen and paper.

## Features

- Create games with multiple players
- Drag and drop to arrange player seating order
- Track bids and tricks for each round
- Automatic score calculation
- Persistent storage of game state
- Responsive design for mobile and desktop
- Round-by-round score history
- End-game summary with rankings

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

```
npm install
```

3. Start the development server

```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the app for production:

```
npm run build
```

## Game Rules

Contract Whist is a trick-taking card game where:

1. Players bid on how many tricks they think they can win in each round
2. The number of cards dealt changes each round (decreasing then increasing)
3. Players earn points based on successful bids and tricks won
4. The player with the most points at the end wins

For detailed rules, consult a Contract Whist rulebook.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
