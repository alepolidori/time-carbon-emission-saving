'use strict'

/**
 * The radius of the earth expressed in km.
 * 
 * @property EARTH_RADIUS
 * @type {number}
 * @constant
 */
const EARTH_RADIUS = 6371

/**
 * Converts angle degrees in radians.
 * 
 * @method degreesToRadians
 * @param {number} degrees The degrees value
 * @return {number} The radians value
 */
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

/**
 * Calculate the length of the arc between two points
 * on the earth surface using GPS coordinates.
 * This is the "Great-circle distance" formula:
 * https://en.wikipedia.org/wiki/Great-circle_distance
 * 
 * @method getEarthArcDistance
 * @param {number} lat1 The latitude of the first point
 * @param {number} lon1 The longitude of the first point
 * @param {number} lat2 The latitude of the second point
 * @param {number} lon2 The longitude of the second point
 * @return {number} The length of the arc between two points on the earth surface
 */
function getEarthArcDistance(lat1, lon1, lat2, lon2) {
  lat1 = degreesToRadians(lat1)
  lat2 = degreesToRadians(lat2)
  lon1 = degreesToRadians(lon1)
  lon2 = degreesToRadians(lon2)
  const deltaL = Math.abs(lon1 - lon2)
  const deltaD = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaL)
  )
  return parseFloat((EARTH_RADIUS * deltaD).toFixed(3))
}

exports.getEarthArcDistance = getEarthArcDistance
exports.degreesToRadians = degreesToRadians