//use "strict";

let people = [ 'Adam', 'Amanda', 'Boomer' ];

people.forEach((person, count) => {
  console.log("Person #" + (count + 1) + ": " + person);
});

// Test function
const babelTest = (moduleName) => {
  console.log("Environment: " + moduleName);
};
export default babelTest;
