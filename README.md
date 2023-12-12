# Installing and Running the CO2 Simulator

## Setting up Environment

First clone or download the application, extract it and access it on IDE (I've  used VS Code, so you're probably safe with that).

run `npm install` before attempting any of the below scripts.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all required node dependencies, paramount that you start with this.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm install -g serve`

Use this if you haven't installed Serve globally yet, if you don't know what Serve is, you probably haven't.

Note: You may need elevated rights, try `npm install -g serve` if other command fails, and input user password if prompted.

### `serve -s build`

Once Serve is installed, you can run this to deploy the app optimally, you can view it from [http://localhost:3000].

## If build process fails, or you're lazy

Just run `npm start` and try it from there.