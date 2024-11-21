import { jest } from '@jest/globals'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([])
  })
)
