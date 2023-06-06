'user strict';

const expect = require('chai').expect
const { degreesToRadians, getEarthArcDistance } = require('../../src/utils/gps-utils')

describe('degreesToRadians', () => {
  it('should return the radians value from a decimal degress value of an angle', () => {
    const value = degreesToRadians(180)
    expect(value).to.be.equal(Math.PI)
  })
})

describe('getEarthArcDistance', () => {
  it('should return the distance between two points', () => {
    const lat1 = 45.12345
    const lon1 = -12.00123
    const lat2 = 45.12345
    const lon2 = -12.00123
    const distance = getEarthArcDistance(lat1, lon1, lat2, lon2)
    expect(distance).to.be.equal(0.000)
  })
})
