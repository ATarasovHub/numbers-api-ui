import {createServer} from "miragejs"

export default function makeFakeApiServer() {
    createServer({
        routes() {
            this.passthrough('http://localhost:8080/**');
        }
    })
}