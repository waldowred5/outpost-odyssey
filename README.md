# Outpost Odyssey

Outpost Odyssey: A real-time strategy game where you manage an outpost

Hosted [here](https://outpost-odyssey-web.web.app/) on Firebase

## Tips and Tricks

There is a user already setup for manual testing:
- Username: `emu@test.com`
- Password: `123456`

To run emulators for local development:
- Open a terminal window, navigate to `/functions` directory and run `yarn build:watch`
- Open a second terminal window in the project root and run:
  - First Time OR After the `./seed` directory has been updated in a PR:
    - `yarn serve:reseed` (this will reseed your local emulator with the static seed data checked into the repo)
  - After first reseed:
    - `yarn serve` (this will run the emulator with the current state of your local seed data)

To update the static seed data checked into the repo:
- BE CAREFUL: This will overwrite the static seed data that everyone uses when you merge to main 
- Navigate to the `/functions` directory and run:
  - `yarn seed:export`
