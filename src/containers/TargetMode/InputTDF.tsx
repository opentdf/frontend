/* istanbul ignore file */
// this file only for test mode
import { Button, Input } from "antd";
import { toast } from "react-toastify";
// @ts-ignore
import { Client } from "@opentdf/client";

export const InputTDF = () => {
    const plainText = 'Hello, World!';
    // @ts-ignore
    let client;

    // messaging
    async function handleClick() {
        const encryptParams = new Client.EncryptParamsBuilder()
            .withStringSource(plainText)
            .withOffline()
            .build();
        // @ts-ignore
        const ct = await client.encrypt(encryptParams);
        const ciphertext = ct.toString();
        console.log(`ciphered text :${ciphertext}`);

        const decryptParams = new Client.DecryptParamsBuilder()
            .withStringSource(ciphertext)
            .build();
        // @ts-ignore
        const plaintextStream = await client.decrypt(decryptParams);
        const plaintext = plaintextStream.toString();
        toast.success(`Text deciphered: ${plainText}`);
        console.log(`deciphered text :${plaintext}`);
    }

    return (
        <Input.Group compact>
            <Input style={{ width: '50%' }} defaultValue={plainText}/>
            <Button type="primary" id={'encrypt-button'} onClick={() => handleClick()}>Secure Submit</Button>
        </Input.Group>
    );
};
