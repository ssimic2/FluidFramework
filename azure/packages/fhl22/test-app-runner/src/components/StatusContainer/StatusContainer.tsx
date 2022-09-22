import React, { useState, useEffect } from "react"
import axios from 'axios';
import StatusDisplay from '../StatusDisplay/StatusDisplay'
import SampleData from '../../api/sample-data/sample-data.json'
import VersionPreview from '../VersionPreview/VersionPreview'

function StatusContainer() {

    let [testData, setTestData] = useState<{[key: string]: any}>([{}]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8080/configs')
            .then(res => {
                setTestData(res.data)
            })
    }, []);

    return (
        <div className="stock-container">
            {testData.map((data: any) => {
                return(
                    <VersionPreview data={data}/>
                )
            })}
        </div>
    );
  }

  export default StatusContainer;
