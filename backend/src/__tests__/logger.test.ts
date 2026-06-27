import { describe, it, expect } from 'vitest'
import logger from '../utils/logger'

describe('logger', () => {
  it('is a pino logger instance with expected methods', () => {
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('has a configured log level', () => {
    expect(logger.level).toBeDefined()
    expect(typeof logger.level).toBe('string')
  })
})
