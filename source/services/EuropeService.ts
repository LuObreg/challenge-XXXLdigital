export default class EuropeService{
    static async checkCode(serviceURL: string, uid: string, code: string){
        try {
            const response = await fetch(serviceURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    countryCode: code,
                    vatNumber: uid
                })
            });
        
            return await response.json();
        } catch (error) {
            console.log({error});
            throw new Error('service_error');
        }
    }
}