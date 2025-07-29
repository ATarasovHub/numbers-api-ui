import {createServer} from "miragejs"
import {provider} from "../data/provider";
import {customer} from "../data/customer";

export default function makeFakeApiServer() {
    let customerRequests = [];
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
                    const updatedProvider = provider.find(p => p.countryStats.some(cs => cs.countryId === countryId));
                    return updatedProvider;
                } else {
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
                    return updatedProvider;
                } else {
                    return new Response(404, {}, { message: 'Provider not found' });
                }
            });

            this.put("/customer/:customerName/change", (schema, request) => {
                const customerName = request.params.customerName;
                const customerDTO = JSON.parse(request.requestBody);
                let updatedCustomer = null;

                for (let i = 0; i < customer.length; i++) {
                    if (customer[i].customerName === customerName) {
                        customer[i] = { ...customer[i], ...customerDTO };
                        updatedCustomer = customer[i];
                        break;
                    }
                }

                if (updatedCustomer) {
                    return updatedCustomer;
                } else {
                    return new Response(404, {}, { message: 'Customer not found' });
                }
            });

            this.get("/customer/overview", (schema, request) => {
               return customer;
            });

            this.get("/customer/overview/:customerName", (_, request) => {
                const customerName = request.params.customerName;
                return customer.filter(c => c.customerName === customerName);
            });

            this.get("/provider/short", () => {
                return provider.map(p => ({
                    numberProviderId: p.providerId,
                    numberProviderName: p.providerName,
                    deletedAt: p.deletedAt || null
                }));
            });

            this.get("/provider/:providerId", (schema, request) => {
                const providerId = Number(request.params.providerId);
                const found = provider.find(p => p.providerId === providerId);
                return found || {};
            });

            this.get("/provider/:providerId/numbers", (schema, request) => {
                const providerId = Number(request.params.providerId);
                const found = provider.find(p => p.providerId === providerId);
                if (!found) return [];
                let numbers = [];
                found.countryStats.forEach(cs => {
                    if (cs.numbers) {
                        numbers = numbers.concat(cs.numbers.map(n => n.number));
                    }
                });
                return numbers;
            });

            this.get("/numbers", () => {
                let numbers = [];
                provider.forEach(p => p.countryStats.forEach(cs => {
                    if (cs.numbers) {
                        numbers = numbers.concat(cs.numbers);
                    }
                }));
                return numbers;
            });

            this.get("/numbers/:number", (schema, request) => {
                const number = request.params.number;
                let foundNumber = null;
                provider.forEach(p => p.countryStats.forEach(cs => {
                    if (cs.numbers) {
                        cs.numbers.forEach(n => {
                            if (String(n.number) === String(number)) {
                                foundNumber = n;
                            }
                        });
                    }
                }));
                return foundNumber || {};
            });

            this.post("/numbers", (schema, request) => {
                const newNumbers = JSON.parse(request.requestBody);
                newNumbers.forEach(numObj => {
                    const country = provider
                        .flatMap(p => p.countryStats)
                        .find(cs => cs.countryId === numObj.countryId);
                    if (country) {
                        if (!country.numbers) country.numbers = [];
                        if (!country.numbers.some(n => n.number === numObj.number)) {
                            country.numbers.push(numObj);
                        }
                    }
                });
                return newNumbers;
            });

            this.put("/numbers/:number", (schema, request) => {
                const number = request.params.number;
                const numberInfos = JSON.parse(request.requestBody);
                let updatedNumber = null;
                provider.forEach(p => p.countryStats.forEach(cs => {
                    if (cs.numbers) {
                        cs.numbers = cs.numbers.map(n => {
                            if (String(n.number) === String(number)) {
                                updatedNumber = { ...n, ...numberInfos };
                                return updatedNumber;
                            }
                            return n;
                        });
                    }
                }));
                return updatedNumber || numberInfos;
            });

            this.get("/countries", () => {
                const all = [];
                provider.forEach(p => p.countryStats.forEach(cs => {
                    if (!all.find(c => c.countryId === cs.countryId)) {
                        all.push({ countryId: cs.countryId, countryName: cs.countryName, countryCode: cs.countryCode });
                    }
                }));
                return all;
            });
            this.get("/provisioning-types", () => {
                return [
                    { id: 1, name: "Auto" },
                    { id: 2, name: "Manual" }
                ];
            });
            this.get("/connection-types", () => {
                return [
                    { id: 1, name: "SMPP" },
                    { id: 2, name: "HTTP" },
                    { id: 3, name: "SIP" }
                ];
            });
            this.get("/number-types", () => {
                return [
                    { id: 1, name: "Mobile" },
                    { id: 2, name: "Landline" },
                    { id: 3, name: "Toll-Free" }
                ];
            });
            this.post('/customer-request', (schema, request) => {
                const req = JSON.parse(request.requestBody);
                req.id = customerRequests.length + 1;
                customerRequests.push(req);
                return req;
            });
            this.get('/customer-request', (schema, request) => {
                const { providerId, bp, requestedNumbers, requestDate } = request.queryParams;
                let filtered = customerRequests;
                if (providerId) filtered = filtered.filter(r => String(r.providerId) === String(providerId));
                if (bp) filtered = filtered.filter(r => String(r.bp) === String(bp));
                if (requestedNumbers) filtered = filtered.filter(r => String(r.requestedNumbers) === String(requestedNumbers));
                if (requestDate) filtered = filtered.filter(r => String(r.requestDate) === String(requestDate));
                return filtered;
            });
            this.passthrough('http://localhost:8080/**');
        }
    })
}
