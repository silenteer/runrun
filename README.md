# runrun
Run run is a cli to quickly test a library, either in typescript or js. Most of libraries don't expose a executable method to test in cli, and `runrun` is here to solve

# getting started

- Add `runrun` to dev dependencies like - `yarn install @silenteer/runrun`
- Can use `yarn runrun -h` to see options

# Example

- `yarn runrun ./index.ts` to call default export function without any parameters
- `yarn runrun ./index.ts -m echo -a 'Hello world'` to call method `echo` of the export with `Hello world` as an argument. Argument can be added multiple times

# Argument data types
Argument employs a simple syntax to determine data type. These are supported data types for argument

- `s:<string value>` will be use as string value
- `n:<string value>` will be put to `Number`
- `b:<string value>` will be put to `Boolean`
- `j:<string value>` will be put to `JSON.parse`

# Promise
Promise will be handled accordingly so you don't have to write a file just to wrap the first level await async