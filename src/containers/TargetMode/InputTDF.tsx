/* istanbul ignore file */
// this file only for test mode
import { Input } from "antd";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
// @ts-ignore
import { FileClient } from '@opentdf/client';

export const InputTDF = () => {
    const { keycloak, initialized } = useKeycloak();
    const [fileClient, setFileClient] = useState();

    useEffect(() => {
        (async () => {
            if (initialized) {
                setFileClient(new FileClient({
                    clientId: keycloak.clientId,
                    organizationName: keycloak.realm,
                    exchange: 'refresh',
                    oidcOrigin: new URL(keycloak.authServerUrl || '').origin,
                    oidcRefreshToken: keycloak.refreshToken,
                    kasEndpoint: 'http://localhost:65432/api/kas',
                }));
            }
        })()
    }, [initialized, keycloak, setFileClient]);


    async function protect(files: FileList | null) {
        if (!files?.length || !fileClient) return;
        const arrayBuff = await files[0].arrayBuffer();
        // @ts-ignore
        const { stream: cipherStream} = await fileClient.encrypt(arrayBuff);
        // @ts-ignore
        const decipherStream = await fileClient.decrypt(cipherStream);
        decipherStream.toFile('file-decrypted.txt')
    }

    if (!fileClient) return null;

    return (
      <Input.Group compact>
          <input data-test-id="file-input" onChange={(e) => protect(e.target.files)} multiple={false} type="file" /> File encrypt round trip
      </Input.Group>
    );
};
