import React, { useState, useEffect } from "react"
import StatusDisplay from '../StatusDisplay/StatusDisplay'
import SampleData from '../../api/sample-data/sample-data.json'
import VersionPreview from '../VersionPreview/VersionPreview'
import TestApi from '../../api/api'

function StatusContainer() {
    const testApi = new TestApi();
    let [testData, setTestData] = useState<{[key: string]: any}>([{}]);

    useEffect(() => {
        const fetchData = async () => {
            await testApi.getConfigVersions().then((res) => { setTestData(res.data) })
        }

        fetchData()

    }, []);

    return (
        <div className="stock-container">
            {testData.map((data: any, key: any) => {
                return(
                    <VersionPreview data={data} key={key}/>
                )
            })}
        </div>
    );
  }

  export default StatusContainer;
