import {createServer} from "miragejs"
import {provider} from "../data/provider";


export default function () {
    createServer(
        {
            routes() {
                this.get("/provider", () => {
                    return provider
                })
            }
        }
    )
}