import {createServer} from "miragejs"
import {provider} from "../data/provider";


export default function () {
    createServer({
        routes() {
            this.get("/provider", () => {
                return provider
            })

            this.post("/provider/createProvider", (schema, request) => {
                const attrs = JSON.parse(request.requestBody);
                const newProvider = {
                    providerId: Math.max(...provider.map(p => p.providerId)) + 1,
                    providerName: attrs.providerName,
                    deletedAt: null,
                    totalCountries: attrs.totalCountries || 0,
                    totalNumbers: attrs.totalNumbers || 0,
                    totalAssignedNumbers: attrs.totalAssignedNumbers || 0,
                    totalMonthlyCost: attrs.totalMonthlyCost || 0,
                    countryStats: attrs.countryStats || []
                };

                provider.push(newProvider);
                return newProvider;
            });
        }
    })
}
