import got from 'got'
import fetchData from '../fetch-data.js'
import fs from 'fs'
import config from '../config.js'

jest.mock('got')
jest.mock('../config.js', () => ({
  wallKeys: {
    'Wall 1': '123',
  },
  dataURL: 'https://example.com/{key}',
  maintenanceMode: false,
  maintenanceMessage: 'Fake',
  wallNameOverrides: {},
}))

afterEach(() => {
  jest.restoreAllMocks();
});

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

test('fetchData returns valid data with wall name override', async () => {
  const newName = 'Replaced Name'
  const overrideObj = { 'Wall 1': { 'AAA': newName } }
  jest.replaceProperty(config, 'wallNameOverrides', overrideObj)

  const body = fs.readFileSync('test/data.html')
  const resp = { body }

  got.mockResolvedValue(resp)
  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  expect(res[newName].count).toBe(248)
  expect(res[newName].capacity).toBe(348)
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

test('fetchData handles an empty response', async () => {
  got.mockResolvedValue()

  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  expect(res).toEqual({})
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

test('fetchData handles an empty wallKeys config', async () => {
  jest.replaceProperty(config, 'wallKeys', {})

  const res = await fetchData()
  expect(res).toEqual({})
})

test('fetchData handles a missing URL config', async () => {
  got.mockResolvedValue()
  jest.replaceProperty(config, 'dataURL', '')

  const res = await fetchData()

  const wall = Object.keys(config.wallKeys)[0]

  expect(res).toEqual({})
  expect(got).toHaveBeenCalledWith(config.dataURL.replace('{key}', config.wallKeys[wall]))
})

