import React from 'react';
import * as timeFormat from 'd3-time-format';


/**
 * Creates table with data provided
 */
const Table = React.memo((data) => {
    var key = 0
    return(
        <table id="data">
            <tbody>
                {   
                    data.data.map((i, deez) => {
                        key++;
                        return (
                            <tr key={key}>
                                {
                                    i.map((j, suck) => {
                                        key++;
                                        if( suck === 0 && deez === 0) {
                                            return (
                                                <th key={key}>
                                                    Time/Nodes
                                                </th>
                                            )
                                        } else if (suck === 0){
                                            return (
                                                <th key={key}>
                                                    {timeFormat.timeFormat('%M:%S')( new Date(0).setSeconds( parseFloat(j)))}
                                                </th>
                                            )
                                        } else if (deez === 0) {
                                            return (
                                                <th key={key}>
                                                    {j}
                                                </th>
                                            )
                                        } else {
                                            return (
                                                <td key={key}>
                                                    {parseFloat(j).toFixed(3)}
                                                </td>
                                            )
                                        }
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )

})

/**
 * Processes and outputs data to table
 * @param {Object} data is an object that contains data to be displayed on table
 * @returns component of table that has csv data
 */
export function Datatable(data) {
    return (
        <Table
            data = {data.props}
        />
    )

}