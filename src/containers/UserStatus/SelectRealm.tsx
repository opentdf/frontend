import {Select} from "antd";
import {useCallback, useState} from "react";
import {ENV_REALMS, REALM} from "../../config";
const  {Option} = Select;

export const SelectRealm = ()=> {
    const [currentRealm] = useState(REALM);
    const handleChange = useCallback(() => {
    }, []);
    const optionList = ENV_REALMS.map(realm => (<Option key={realm.toString()} value={realm}>{realm}</Option>));

    return (
        <>
            {'Realm : '}
            <Select defaultValue={currentRealm} style={{ width: 150 }} onChange={handleChange}>
                {optionList}
            </Select>
        </>
    )
};
