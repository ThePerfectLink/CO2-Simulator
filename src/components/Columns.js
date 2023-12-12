import { HeatMap } from "@nivo/heatmap";
import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

var keys = []

export function Columns(props) {
    const [refs, setRefs] = useState([]) 
    var highest = props.props.highest;

    const createTracker = (data) => {
        if(keys.includes(data.id)) {
            return ;
        }
        keys.push(data.id);
        return (
            <div className="tracker" id={data.id} key={data.id} background-color={data.color}>
                <span onClick={() => deleteTracker(data.id)}><FontAwesomeIcon icon={faCircleXmark}/></span>
                <p> Concentration at column <span>{data.data.x}</span> at time <span>{data.serieId}</span> is equal to <span>{data.data.y}</span></p>  
            </div>
        );
    }

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
                <h6>Tracked Columns</h6>
                {refs}
            </div>
            <HeatMap 
                data = {
                    props.props.data[props.props.current]
                }
                margin={{ top: width*0.035, right: 12, bottom: width*0.035, left: 12 }}
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
                                fontSize: 0.016*width,
                                fill: "black"
                            }
                        }
                    },
                    legends: {
                        ticks: {
                          text: {
                            fontSize: 0.014*width,
                            strokeWidth: .8,
                          },
                        },
                        title: {
                            text: {
                              fontSize: 0.012*width,
                              fill: "black"
                            }
                        }
                    }
                }}
                axisTop={{
                    tickSize: width*0.003,
                    tickPadding: 1,
                    legend: 'Axial Length (i.e., Nodes/Finite Volumes)',
                    legendOffset: -width*0.026,
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
                        translateX: 20,
                        translateY: width*0.023,
                        length: width*.6,
                        thickness: width*0.007,
                        direction: 'row',
                        tickPosition: 'before',
                        tickSize: width*0.002,
                        tickSpacing: 4,
                        tickOverlap: false,
                        tickFormat: '>-.3a',
                        title: 'Concentration',
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