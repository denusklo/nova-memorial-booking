// server/api/test-package.js
import { v4 as uuidv4 } from 'uuid' // A simple, widely-used package

export default defineEventHandler(() => {
  try {
    const id = uuidv4()
    return {
      success: true,
      id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})