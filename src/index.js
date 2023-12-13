import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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
  Papa.parse("./data/time.csv", {
    download: true,
    step: row => {
      timeData.push(row.data)
    },
    complete: re => {
      Papa.parse("./data/concentration.csv", {
        download: true,
        step: row => {
          conData.push(row.data)
        },
        complete: () => {
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
    data: data,
    highest: 0,
    lowish: 0.14
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
      if(parseFloat(data[i][j]) < props.lowish && parseFloat(data[i][j]) > 0.06) { props.lowish = parseFloat(data[i][j]) }
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
