import { HeatMap } from "@nivo/heatmap";
import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

/**
 * Keys are used to help keep track of columns which have been
 * added to the tracker. These are probably redundant.
 */
var keys = []

/**
 * Takes an object containing properly formatted data, the highest
 * concentration, current window dimensions, and the current frame.
 * This is all in service of making a nivo heatmap.
 * @param {Object} props Object containing the aforementioned data
 * @returns the heatmap and the tracking system
 */
export function Columns(props) {
    const [refs, setRefs] = useState([]) 
    var highest = props.props.highest;
    
    /**
     * Creates a tracker, a (usually) one line reminder of a value 
     * at a specific column and time stamp.
     * @param {Object} data is an object containing a whole host of information regarding the cell clicked
     * @returns a new div that keeps note of the cell the user has clicked on
     */
    const createTracker = (data) => {
        if(keys.includes(data.id)) {
            return ;
        }
        keys.push(data.id);
        return (
            <div className="tracker" id={data.id} key={data.id} background-color={data.color}>
                <span onClick={() => deleteTracker(data.id)}><FontAwesomeIcon icon={faCircleXmark}/></span>
                <p> The amount of CO2 at node <span>{data.data.x}</span> at time <span>{data.serieId}</span> is <span>{data.data.y} % mol</span></p>  
            </div>
        );
    }

    /**
     * deletes a column tracker given by the id
     * @param {String} id is a string generated alongside the tracker
     */
    function deleteTracker(id) {
        var index = keys.indexOf(id);
        if (index > -1) {
            keys.splice(index, 1);
        }
        setRefs(prevRefs => {
            for(let i = 0; i<prevRefs.length; i++) {
                if(id === prevRefs[i].props.id) {
                    prevRefs.splice(i, 1);
                    break;
                }
            }
            return prevRefs;
        });
        setRefs(prevRefs => [...prevRefs])
    }

    var height = props.props.height;
    var width = props.props.width;

    return (
        <div id="heatmap">
            <div id="results">
                <h6>Tracked Points</h6>
                {refs}
            </div>
            <HeatMap 
                data = {
                    props.props.data[props.props.current]
                }
                margin={{ top: width*0.035+5, right: 12, bottom: width*0.03+12, left: 12 }}
                valueFormat=">-.6~c"
                width={width}
                height = {height}
                xInnerPadding={0.01}
                yInnerPadding={0.01}
                enableLabels={false}
                fontSize= {25}
                theme = {{
                    axis: {
                        ticks: {
                          text: {
                            fontSize: 0.016*width,
                          }
                        },
                        legend: {
                            text: {
                                fontSize: 0.02*width,
                                fill: "black"
                            }
                        }
                    },
                    legends: {
                        ticks: {
                          text: {
                            fontSize: 0.01*width+4,
                            strokeWidth: .8,
                          },
                        },
                        title: {
                            text: {
                              fontSize: 0.012*width+4,
                              fill: "black"
                            }
                        }
                    }
                }}
                axisTop={{
                    tickSize: width*0.003,
                    tickPadding: 2,
                    legend: 'Axial Length (i.e., Nodes/Finite Volumes)',
                    legendOffset: -width*0.03,
                    legendPosition: "start"
                }}
                axisLeft={null}
                colors={{
                    type: 'diverging',
                    scheme: 'spectral',
                    divergeAt: 0.50,
                    minValue: .12,
                    maxValue: highest
                }}
                emptyColor="#555555"
                legends={[
                    {
                        anchor: 'bottom-left',
                        enableLabels: false,
                        translateX: width*0.018,
                        translateY: width*0.021+4,
                        length: width*.7,
                        thickness: width*0.007,
                        direction: 'row',
                        tickPosition: 'before',
                        tickSize: width*0.001,
                        tickSpacing: 4,
                        tickOverlap: false,
                        tickFormat: '>-.3a',
                        title: 'CO2 Front (mol%)',
                        titleAlign: 'start',
                        titleOffset: 4
                    },
                ]}
                onClick={(data) => {
                    let temp = createTracker(data)
                    if(temp) {
                        setRefs(prevRefs => [...prevRefs, temp]);
                    }
                }}
                hoverTarget="cell"
                animate={false}
            />

        </div>
    );
}