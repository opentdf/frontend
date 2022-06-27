/* istanbul ignore file */
// this file only for test mode
import { Input } from "antd";
import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
// @ts-ignore
import { FileClient } from '@opentdf/client';

export const InputTDF = () => {
    const { keycloak, initialized } = useKeycloak();
    let fileClient : FileClient;

    useEffect(() => {
        (async () => {
            if (initialized) {
                fileClient = new FileClient({
                    clientId: keycloak.clientId,
                    organizationName: keycloak.realm,
                    exchange: 'refresh',
                    oidcOrigin: keycloak.authServerUrl,
                    oidcRefreshToken: keycloak.refreshToken,
                    kasEndpoint: 'http://localhost:65432/api/kas',
                });
            }
        })()
    }, [initialized, keycloak]);


    async function protect(files: FileList | null) {
        if (!files) return;
        const cipherStream = await fileClient.encrypt(await files[0].arrayBuffer());
        const decipherStream = await fileClient.decrypt(cipherStream);
        decipherStream.toFile('file.txt')
    }

    return (
      <Input.Group compact>
          <input onChange={(e) => protect(e.target.files)} multiple={false} type="file" /> File encrypt round trip
      </Input.Group>
    );
};
