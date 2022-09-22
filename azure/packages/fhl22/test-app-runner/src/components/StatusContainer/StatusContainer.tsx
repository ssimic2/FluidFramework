import React, { useState, useEffect } from "react"
import StatusDisplay from '../StatusDisplay/StatusDisplay'
import SampleData from '../../api/sample-data/sample-data.json'

function StatusContainer() {
    useEffect(() => {
        console.log("running")
    }, []);

    let [testData, setTestData] = useState(SampleData)

    return (
        <div className="stock-container">
            {testData.map((data, key) => {
                return (
                <div key={key}>
                    <StatusDisplay data={data}/>
                </div>
                );
            })}
        </div>
    );
  }

  export default StatusContainer;
