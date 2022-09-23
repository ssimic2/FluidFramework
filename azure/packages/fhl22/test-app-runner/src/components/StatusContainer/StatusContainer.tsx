import React, { useState, useEffect } from "react"
import StageRunner from '../StageRunner/StageRunner'
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
                console.log("NEW DATA", data)
                return(
                    <StageRunner data={data} key={key}/>
                )
            })}
        </div>
    );
  }

  export default StatusContainer;
