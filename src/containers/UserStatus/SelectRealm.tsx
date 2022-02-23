import {Select} from "antd";
import {useCallback, useState} from "react";
import {useKeycloak} from "@react-keycloak/web";
import {keycloakConfig} from "../../config";
const  {Option} = Select;

const {realms} = window.SERVER_DATA;
export const SelectRealm = ()=> {
    const {keycloak} = useKeycloak();
    const [currentRealm, setRealm] = useState(keycloakConfig.realm);
    const handleChange = useCallback((value) => {
        setRealm(value);
        if (keycloak.authenticated) {
            localStorage.setItem('realm-tmp', value);
            keycloak.logout();
        } else {
            localStorage.setItem('realm', value);
            window.document.location.href = "/";
        }
    }, []);
    const optionList = realms.map(realm => (<Option value={realm}>{realm}</Option>))

    return (
        <>
            {'Realm : '}
            <Select defaultValue={currentRealm} style={{width: 150}} onChange={handleChange}>
                {optionList}
            </Select>
        </>
    )
};
