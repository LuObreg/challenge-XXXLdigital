export default class SwissService {
    static async checkCode(serviceURL: string, uid: string) {
        try {
            const response = await fetch(serviceURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': 'http://www.uid.admin.ch/xmlns/uid-wse/IPublicServices/ValidateUID',
                },
                body: `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Header />
                <soap:Body>
                <ValidateUID xmlns="http://www.uid.admin.ch/xmlns/uid-wse">
                <uid>${uid}</uid>
                </ValidateUID>
                </soap:Body>
                </soap:Envelope>`,
            });

            return await response.text();
        } catch (error) {
            console.log({error});
            throw new Error('service_error');
        }
    }
}

/**
 * Error response:
 * <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
 *  <s:Body>
 *  <s:Fault>
 *  <faultcode>s:Client</faultcode>
 * <faultstring xml:lang="de-CH">Data_validation_failed</faultstring>
 * <detail>
 *  <businessFault xmlns="http://www.uid.admin.ch/xmlns/uid-wse" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 * <operation xmlns="http://www.uid.admin.ch/xmlns/uid-wse-shared/2">Data validation</operation>  
 * <error xmlns="http://www.uid.admin.ch/xmlns/uid-wse-shared/2">Data_validation_failed</error>
 * <errorDetail xmlns="http://www.uid.admin.ch/xmlns/uid-wse-shared/2">CHE-123.456.789 is not a valid UID. Invalid checksum.
 * </errorDetail>
 * </businessFault>
 * </detail>
 * </s:Fault>
 * </s:Body>
 * </s:Envelope>
 */

/**True response
 * <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
        <ValidateUIDResponse xmlns="http://www.uid.admin.ch/xmlns/uid-wse">
            <ValidateUIDResult>true</ValidateUIDResult>
        </ValidateUIDResponse>
    </s:Body>
</s:Envelope>
 * 
 */