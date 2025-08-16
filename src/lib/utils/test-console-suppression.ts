/**
 * Test file to verify console suppression is working
 * Run this in development and production to verify behavior
 */

export function testConsoleSuppression() {
  console.log("=== Console Suppression Test ===");
  console.log("This is a log message");
  console.warn("This is a warn message");
  console.error("This is an error message");
  console.debug("This is a debug message");
  console.info("This is an info message");
  
  console.log("Current NODE_ENV:", process.env.NODE_ENV);
  console.log("=== End Test ===");
}