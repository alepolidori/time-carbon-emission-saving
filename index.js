'use strict'
const fs = require('fs')
const { getEarthArcDistance } = require('./src/utils/gps-utils')
const cities1000 = require('cities-with-1000')

/**
 * The minimum number of arguments.
 * 
 * @constant MIN_ARGS
 * @type {number}
 */
const MIN_ARGS = 3

/**
 * The maximum number of arguments.
 * 
 * @constant MAX_ARGS
 * @type {number}
 */
const MAX_ARGS = 10

/**
 * The travel speed expressed in km/h.
 * 
 * @constant SPEED
 * @type {number}
 */
const SPEED = 60

/**
 * The CO2 emission per liter of gasoline.
 * 
 * @constant CO2_BY_LITER
 * @type {number}
 */
const CO2_BY_LITER = 2.3

/**
 * The consumption of a car expressed in l/100km.
 * 
 * @constant CAR_CONSUMPTION
 * @type {number}
 */
const CAR_CONSUMPTION = 5

/**
 * Returns the coordinates (latitude and longitude) of all the cities.
 * 
 * @method getCitiesCoordinates
 * @param {array} cities The list of the city names
 * @param {array} cities1000db The list of data of all the cities
 * @return {object} The object containing the city names as keys, and an object with
 *                  latitude and the longitude of the city as values
 */
function getCitiesCoordinates(cities, cities1000db) {
  const result = {}
  let tempArr, tempCityName
  for (const el of cities1000db) {
    tempArr = el.split('\t')
    tempCityName = tempArr[1]?.toLowerCase()
    if (cities.indexOf(tempCityName) !== -1) {
      result[tempCityName] = {
        lat: tempArr[4],
        lon: tempArr[5]
      }
    }
    if (Object.keys(result).length === cities.length) {
      break
    }
  }
  return result
}

/**
 * Return a unique identifier for a pair of cities.
 * 
 * @method getPathId
 * @param {string} city1 The name of a city
 * @param {string} city2 The name of a city
 */
function getPathId(city1, city2) {
  const str = city1 + city2
  return str.split('').sort().join('')
}

/**
 * Calculate the distances between each pair of cities.
 * 
 * @method getCitiesDistances
 * @param {Array} cities The list of the city names
 * @param {object} citiesCoordinates The coordinates of all the cities
 * @return {object} All the distances between cities: keys are identifiers based on the city names,
 *                  values are objects containing a more readable path and the distances expressed in km
 */
function getCitiesDistances(cities, citiesCoordinates) {
  let distance, pathId
  const result = {}
  for (let i = 0; i < cities.length - 1; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      distance = getEarthArcDistance(
        citiesCoordinates[cities[i]].lat,
        citiesCoordinates[cities[i]].lon,
        citiesCoordinates[cities[j]].lat,
        citiesCoordinates[cities[j]].lon,
      )
      pathId = getPathId(cities[i], cities[j])
      result[pathId] = {
        path: cities[i] + cities[j],
        distance: distance
      }
    }
  }
  return result
}

/**
 * Calculate the optimal location to be used for a physical meeting.
 * 
 * @method getOptimalLocation
 * @param {Array} cities The list of the city names
 * @param {object} distances All the distances between cities: keys are identifiers based on city names,
 *                           values are the distances expressed in km
 * @return {object} An object containing the optimal location ("optimalLocation" key)
 *                  and the sum of the distances ("distances" key)
 */
function getOptimalLocation(cities, distances) {
  let distSum, pathId, minDist, optimalLocation
  for (let i = 0; i < cities.length; i++) {
    distSum = 0
    for (let j = 0; j < cities.length; j++) {
      if (i === j) {
        continue
      }
      pathId = getPathId(cities[i], cities[j])
      distSum += distances[pathId].distance
    }
    if (!minDist || distSum < minDist) {
      minDist = distSum
      optimalLocation = cities[i]
    }
  }
  return {
    optimalLocation: optimalLocation.charAt(0).toUpperCase() + optimalLocation.slice(1),
    distances: minDist
  }
}

/**
 * Calculate the time needed to travel the specified distance traveling
 * at a speed of SPEED km/h.
 * 
 * @method calcTime
 * @param {number} space The space distance in km
 * @return {number} The time spent in hour
 */
function calcTime(space) {
  return (space / SPEED).toFixed(3);
}

/**
 * Calculate the CO2 emission in kg considering a car consumption
 * of CAR_CONSUMPTION liter and a co2 emission of CO2_BY_LITER.
 * 
 * @method getCo2
 * @param {number} distance The space distance in km
 * @return {number} The amount of CO2 generate for the specified distance
 */
function getCo2(distance) {
  const liters = CAR_CONSUMPTION / 100 * distance
  return (CO2_BY_LITER * liters).toFixed(3)
}

// console.time('app execution time')

/**
 * Check the input parameters on the command line. The number
 * of arguments have to be between 3 and 10, otherwise the
 * application exits
 * 
 * @method checkArgs
 */
;(function checkArgs() {
  if (process.argv.length < MIN_ARGS + 2 || process.argv.length > MAX_ARGS + 2) {
    console.log("Insert cities (min 3 to max 10)")
    process.exit(1)
  }
})()

// get command line parameters and elaborate them
const cities = process.argv
  .slice(2, 12)
  .map(el => el.toLowerCase())

// read the data about all the cities
const cities1000db = fs.readFileSync(cities1000.file, 'utf8').split('\n')

// get the coordinates of all the cities
const citiesCoordinates = getCitiesCoordinates(cities, cities1000db)

// get the distances between every pair of cities
const distances = getCitiesDistances(cities, citiesCoordinates)

// get the optimal location where to have a physical meeting
const optimalLocation = getOptimalLocation(cities, distances)
console.log(`optimal location: ${optimalLocation.optimalLocation}`);

// calculate the cumulative time spent by all the
// participants to go to the optimal location
const cumulativeTime = calcTime(optimalLocation.distances)
console.log(`cumulative time: ${cumulativeTime}h`);

// calculate the average time spent by each participant to go to the optimal location
const avgTime = (cumulativeTime / (cities.length - 1)).toFixed(3)
console.log(`average time: ${avgTime}h`);

// calculate the CO2 emission to travel all the distances by the participants
const co2emission = getCo2(optimalLocation.distances)
console.log(`CO2 emission saved: ${co2emission}kg`);

// console.timeEnd('app execution time')