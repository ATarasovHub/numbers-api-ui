import {createServer} from "miragejs"
import {provider} from "../data/provider";
import {customer} from "../data/customer";

export default function makeFakeApiServer() {
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

            this.put("/number/:number", (schema, request) => {
                const number = request.params.number;
                const numberInfos = JSON.parse(request.requestBody);
                let updatedNumber = null;
                let found = false;
                provider.forEach(p => p.countryStats.forEach(cs => {
                    if (cs.numbers) {
                        cs.numbers = cs.numbers.map(n => {
                            if (String(n.number) === String(number)) {
                                found = true;
                                updatedNumber = { ...n, ...numberInfos };
                                return updatedNumber;
                            }
                            return n;
                        });
                    }
                }));
                console.log(`---------- updateNumberForProvider for ${number} ------------`, found ? 'UPDATED' : 'NOT FOUND');
                return updatedNumber || numberInfos;
            });

            this.put("/country-stats/:countryId", (schema, request) => {
                const countryId = Number(request.params.countryId);
                const updateData = JSON.parse(request.requestBody);
                let found = false;

                for (let p of provider) {
                    if (p.countryStats) {
                        for (let i = 0; i < p.countryStats.length; i++) {
                            if (p.countryStats[i].countryId === countryId) {
                                p.countryStats[i] = { ...p.countryStats[i], ...updateData };
                                found = true;
                                break;
                            }
                        }
                    }
                    if(found) break;
                }

                if (found) {
                    console.log(`---------- updateCountryStat for id=${countryId} ------------ UPDATED`);
            
                    const updatedProvider = provider.find(p => p.countryStats.some(cs => cs.countryId === countryId));
                    return updatedProvider;
                } else {
                    console.log(`---------- updateCountryStat for id=${countryId} ------------ NOT FOUND`);
                    return new Response(404, {}, { message: 'CountryStat not found' });
                }
            });
    
            this.put("/provider/:providerId", (schema, request) => {
                const providerId = Number(request.params.providerId);
                const updateData = JSON.parse(request.requestBody);
                let updatedProvider = null;
                for (let i = 0; i < provider.length; i++) {
                    if (provider[i].providerId === providerId) {
                        provider[i] = { ...provider[i], ...updateData };
                        updatedProvider = provider[i];
                        break;
                    }
                }
                if (updatedProvider) {
                    console.log(`---------- updateProvider for id=${providerId} ------------ UPDATED`);
                    return updatedProvider;
                } else {
                    console.log(`---------- updateProvider for id=${providerId} ------------ NOT FOUND`);
                    return new Response(404, {}, { message: 'Provider not found' });
                }
            });

            this.get("/customer/overview", (schema, request) => {
               return customer;
            });
        }
    })
}
