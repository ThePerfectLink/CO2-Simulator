import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as timeFormat from 'd3-time-format';
import * as Papa from 'papaparse';

const root = ReactDOM.createRoot(document.getElementById('root'));

var timeData = [];
var conData = [];

/**
 * Creates usable data from a time and concentration csv
 *located in the data folder in public
 */
async function makeFile() {
  Papa.parse("http://localhost:3000/data/time.csv", {
    download: true,
    step: row => {
      timeData.push(row.data)
    },
    complete: re => {
      Papa.parse("http://localhost:3000/data/concentration.csv", {
        download: true,
        step: row => {
          conData.push(row.data)
        },
        complete: result => {
          for(let i = 0; i < timeData.length; i++) {
            conData[i].unshift(timeData[i][0]);
          }
          let columns = conData[0].length
          conData.unshift([]);
          conData[0].unshift(...Array(columns).keys())
          conData.pop()
          formatArray(conData);
        }
      });
    }
  });

}

/**
 * Takes data gathered from CSVs and formats them in 
 * object from so that it's readable by nivo heatmap.
 * Also finds the highest concentration in data set.
 * @param {Array} data 2d array of data
 */
function formatArray(data) {
  let props = {
    arr: [],
    highest: 0,
  };
  for(let i = 1; i<data.length; i++) {
    props.arr.push([]);
    props.arr[i-1].push({})
    props.arr[i-1][0].id = timeFormat.timeFormat('%M:%S')( new Date(0).setSeconds( parseFloat(data[i][0])))
    props.arr[i-1][0].data = [];
    for(let j = 1; j<data[i].length; j++) {
      props.arr[i-1][0].data.push({});
      props.arr[i-1][0].data[j-1].x = data[0][j].toString();
      props.arr[i-1][0].data[j-1].y = parseFloat(data[i][j]);
      if(parseFloat(data[i][j]) > props.highest) { props.highest = parseFloat(data[i][j]) }
    }
  }
  start(props)
}

makeFile();

/**
 * Starts main React Component, takes data required
 * for the heatmap
 * @param {Object} data Object with array of data and highest concentration in data set
 */
function start(data) {
  root.render(
    <React.StrictMode>
      <App 
        props = {data}
      />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
