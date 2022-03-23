// @ts-ignore
import {RefreshTokenCredentials} from "@opentdf/client/dist/types/src/nanotdf/types/OIDCCredentials";
// @ts-ignore
import {AuthProviders, NanoTDFClient} from "@opentdf/client";
import {useEffect, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {Button, Layout, Modal, Popconfirm, Upload} from "antd";
import {Content} from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import {InfoCircleTwoTone} from "@ant-design/icons";
import {ENV_REALMS} from "../config";

const {access, clientId, authority} = window.SERVER_DATA;

export default function Addon() {
    const {keycloak, initialized} = useKeycloak();
    // 0 welcome
    const [welcome, setWelcome] = useState(true);
    // 1 create TDF
    const [createTdf, setCreateTdf] = useState(false);
    const [createTdfPop, setCreateTdfPop] = useState(true);
    const createTdfText = 'This message is not sensitive.  However, it should be protected from the world to see.';
    const createTdfMessage = 'Click here.  This will create your first TDF';
    // 2 view TDF file
    const [viewFileTdf, setFileViewTdf] = useState(false);
    const [viewFileTdfPop, setFileViewTdfPop] = useState(false);
    const viewFileTdfMessage = 'Click here.  This will show what your message has become.  This is known as ciphertext';
    // 3 view TDF ciphertext
    const [viewCipherTdf, setCipherViewTdf] = useState(false);
    const [viewCipherTdfPop, setCipherViewTdfPop] = useState(false);
    const viewCipherTdfMessage = 'Excellent. Close this and we will continue to share the TDF';
    // 4 login

    // messaging
    function handleCreateTdf() {
        // console.log(client);
        // client.addAttribute("https://opentdf.us/attr/IntellectualProperty/value/Open");
        // cipherText = await client.encrypt(createTdfText);
        // console.log(cipherText);
        // const clearText = await client.decrypt(cipherText);
        // console.log(clearText);
    }

    useEffect(() => {
        (async () => {
            keycloak.onAuthError = console.log;
            sessionStorage.setItem("keycloak", keycloak.token || "");
            // @ts-ignore
            const {refreshToken} = keycloak;
            let client;
            if (!client && refreshToken) {
                const oidcCredentials: RefreshTokenCredentials = {
                    clientId: clientId,
                    exchange: 'refresh',
                    oidcRefreshToken: refreshToken,
                    // remove /auth/
                    oidcOrigin: authority.replace('/auth/', ''),
                    organizationName: ENV_REALMS[0]
                }
                const authProvider = await AuthProviders.refreshAuthProvider(oidcCredentials);
                console.log(authProvider);
                client = new NanoTDFClient(authProvider, access);
                await client.fetchOIDCToken();
            }
        })()
    }, [initialized, keycloak]);

    let encryptStatus;
    const fileList = [
        {
            uid: '1',
            name: 'TDF',
            status: encryptStatus,
        },
    ];
    return (
        <Layout style={{margin: '20%'}}>
            {initialized && <Modal
                centered
                closable={false}
                visible={welcome}
                onOk={() => setWelcome(false)}
                onCancel={() => setWelcome(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={() => {
                        setWelcome(false);
                        setCreateTdf(true);
                    }}>
                        Begin
                    </Button>,
                ]}
            >
                <h1>Welcome to the <b>openTDF</b> tutorial</h1>
            </Modal>}
            <Content style={{padding: 64,}}>
                {createTdf && <div>
                    <TextArea rows={4} value={createTdfText}/>
                    <Popconfirm
                        visible={createTdfPop}
                        showCancel={false}
                        placement="bottom"
                        title={createTdfMessage}
                        icon={<InfoCircleTwoTone/>}
                        onConfirm={() => setCreateTdfPop(false)}
                        okType={"ghost"}
                    >
                        <Button type="primary" onClick={() => {
                            handleCreateTdf();
                            setCreateTdf(false);
                            setCreateTdfPop(false);
                            setFileViewTdf(true);
                            setFileViewTdfPop(true)
                        }}>Create TDF</Button>
                    </Popconfirm></div>}
                {viewFileTdf &&
                    <Popconfirm
                        visible={viewFileTdfPop}
                        showCancel={false}
                        placement="bottom"
                        title={viewFileTdfMessage}
                        icon={<InfoCircleTwoTone/>}
                        onConfirm={() => setFileViewTdfPop(false)}
                        okType={"ghost"}
                    >
                        <Upload
                            listType="text"
                            fileList={fileList}
                            onPreview={() => {
                                setFileViewTdf(false);
                                setFileViewTdfPop(false);
                                setCipherViewTdf(true);
                                setCipherViewTdfPop(true);
                            }}
                        />
                    </Popconfirm>}
                {viewCipherTdf &&
                    <Popconfirm
                        visible={viewCipherTdfPop}
                        showCancel={false}
                        placement="bottom"
                        title={viewCipherTdfMessage}
                        icon={<InfoCircleTwoTone/>}
                        onConfirm={() => setCipherViewTdfPop(false)}
                        okType={"ghost"}
                    >
                        <Modal
                            title="TDF ciphertext"
                            visible={viewCipherTdf}
                            footer={null}
                            onCancel={() => {
                                setCipherViewTdf(false)
                            }}
                        >
                            <p>LJKLKLKJLKJLKJLJLKJ</p>
                        </Modal>
                        <Upload
                            listType="text"
                            fileList={fileList}
                            onPreview={() => {
                                setCipherViewTdf(false);
                                setCipherViewTdfPop(false);
                            }}
                        />
                    </Popconfirm>}
            </Content>
        </Layout>);
}