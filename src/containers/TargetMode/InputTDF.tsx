import { Button, Input } from "antd";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { toast } from "react-toastify";
import { AUTHORITY, CLIENT_ID, REALM } from "../../config";
const virtru = require("@opentdf/client");

// @ts-ignore
const authority = AUTHORITY;
const clientId= CLIENT_ID;
// KAS endpoint
const access = 'http://localhost:8000';
const realm = REALM;

export const InputTDF = () => {
    const plainText = 'Hello, World!';
    const { keycloak, initialized } = useKeycloak();
    // @ts-ignore
    let client;

    // messaging
    async function handleClick() {
        const encryptParams = new virtru.Client.EncryptParamsBuilder()
            .withStringSource("Hello world")
            .withOffline()
            .build();
        // @ts-ignore
        const ct = await client.encrypt(encryptParams);
        const ciphertext = await ct.toString();
        console.log(`ciphered text :${ciphertext}`);

        const decryptParams = new virtru.Client.DecryptParamsBuilder()
            .withStringSource(ciphertext)
            .build();
        // @ts-ignore
        const plaintextStream = await client.decrypt(decryptParams);
        const plaintext = await plaintextStream.toString();
        toast.success("Text deciphered!");
        console.log(`deciphered text :${plaintext}`);
    }

    useEffect(() => {
        (async () => {
            if (initialized) {
                const { refreshToken } = keycloak;
                // @ts-ignore
                if (!client && refreshToken) {
                    const token = typeof refreshToken === 'boolean' ? keycloak.token : refreshToken;

                    client = new virtru.Client.Client({
                        clientId,
                        organizationName: realm,
                        oidcRefreshToken: token,
                        kasEndpoint: access,
                        virtruOIDCEndpoint: authority.replace('/auth/', ''),
                    });
                }
            }
        })()
    }, [initialized, keycloak]);

    return (
        <Input.Group compact>
            <Input style={{ width: '50%' }} defaultValue={plainText}/>
            <Button type="primary" onClick={() => handleClick()}>Secure Submit</Button>
        </Input.Group>
    );
};