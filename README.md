# Time and Carbon Emission Saving

## Description

Script to calculate the optimal location to save time and CO2 emission in case of physical meeting.

Made by [Alessandro Polidori.](http://alessandropolidori.com/)


## Requirements

[Node.js](https://nodejs.org/en/download/) v18.16.0 or later.

## Install

From the root path of the project install the dependencies with NPM:

```bash
npm install
```

Run the application:

```bash
npm start <city1> <city2> <city3> ... <city10>
```

example:

```bash
npm start urBiNo PesaRO fano bologna senigallia lucca pisa ancona macerata rimini
```

## Constraints

The script requires to pass at least three cities, otherwise the calculation is useless.

You can pass a maximum of ten cities.

## Test

To test the code:

```bash
npm test
```

## Notes

["Great-circle distance"](https://en.wikipedia.org/wiki/Great-circle_distance) formula has been used to calculate the distance between cities.
