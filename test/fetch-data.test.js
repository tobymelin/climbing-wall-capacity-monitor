import got from 'got'
import fetchData from '../fetch-data.js'
import fs from 'fs'
import * as config from '../config.js'

jest.mock('got')
jest.mock('../config.js')

test('fetchData returns valid data', async () => {
  const body = fs.readFileSync('test/data.html')
  const resp = { body }

  got.mockResolvedValue(resp)
  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  expect(res[wall].count).toBe(248)
  expect(res[wall].capacity).toBe(348)
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

test.failing('fetchData handles an empty response', async () => {
  got.mockResolvedValue()
  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  console.log(res)

  expect(res[wall].count).toBe(248)
  expect(res[wall].capacity).toBe(348)
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

test.failing('fetchData handles an empty config', async () => {
  got.mockResolvedValue()
  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  console.log(res)

  expect(res[wall].count).toBe(248)
  expect(res[wall].capacity).toBe(348)
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

