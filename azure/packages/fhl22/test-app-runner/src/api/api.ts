import axios from 'axios';
import resolve from './resolver';


export default class TestApi {

    public async getConfigVersions() {
        return await resolve(
            axios.get('http://127.0.0.1:8080/configs')
                .then(res => {
                    return res.data
                })
        );
    }

    public async startStageTest(version: string) {
        const configVersion = version;
        return await resolve(
            axios.post('http://127.0.0.1:8080/run', null, { params: {
                    configVersion
                }})
                .then(res => {
                    return res.data
                })
        );
    }

    public async pollTestStatus(id: string) {
        return await resolve(
            axios.get('http://127.0.0.1:8080/run', { params: {
                id
            }})
            .then(res => {
                return res.data
            })
        );
    }
}

