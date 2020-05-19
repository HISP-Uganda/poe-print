import React, {useRef, useState, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import {Link, useHistory, useParams} from 'react-router-dom'
import {Menu, Modal, Table} from "antd";
import QrCode from 'qrcode.react';
import {useConfig} from '@dhis2/app-runtime';
import {PrinterOutlined, EyeOutlined, HomeOutlined, FormOutlined} from '@ant-design/icons';
import {observer} from "mobx-react";
import {useStore} from "./context/context";
import {isEmpty} from "lodash";
import AES from 'crypto-js/aes';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const InstanceData = observer(() => {
    const store = useStore();
    const [imageUrl, setImageUrl] = useState('');
    const [verifier, setVerifier] = useState('');
    // const [finalVerifier, setFinalVerifier] = useState('');
    const {baseUrl} = useConfig();
    const params = useParams();
    const AESKey = "COVID-19R35P0N5E-2020";
    // const appCrypt = new SimpleCrypto(AESKey);
    const program = store.programId;
    const programStage = store.programStageID;
    const url = window.location.href;
    const qr_dhis2_url = url.split("/api/")[0];


    useEffect(() => {
        store.queryOneInstances(params.instance).then(() => {
            setImageUrl(`${baseUrl}/api/trackedEntityInstances/${store.currentInstance.instance}/AsnwhQvSeMy/image`);
            setVerifier(AES.encrypt(`Name: ${store.currentInstance.sB1IHYu2xQT} \nVehicle: ${store.currentInstance.h6aZFN4DLcR} \nPhone Number: ${store.currentInstance.E7u9XdW24SP} \nPoint of Entry: ${store.currentInstance.ouname} \nPOE ID: ${store.currentInstance.CLzIR1Ye97b} \nDHIS2: ${qr_dhis2_url} \nTEI: ${store.currentInstance.instance} \nPROGRAM: ${program} \nPROGRAMSTAGE: ${programStage} \nORGUNITID: ${store.currentInstance.ou} \nNationality: ${store.currentInstance.XvETY1aTxuB} \nDOB: ${store.currentInstance.g4LJbkM0R24} \nSex: ${store.currentInstance.FZzQbW8AWVd} \nIdentification: ${store.currentInstance.oUqWGeHjj5C}`, AESKey).toString());
        })
    }, [store, params])

    console.log(verifier);

    return (<div>
        {!isEmpty(store.currentInstance) ?
            <div style={{padding: 20, display: 'flex', flexDirection: 'column', fontSize: 'large'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row', marginTop: '2px'}}>
                        <div style={{display: 'flex', flexDirection: 'column', flexBasis: '5%'}}>
                            <img src="moh.png" style={{width: '64px', marginBottom: '5px'}}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', flexBasis: '100%', marginLeft: '20px'}}>
                            <h3 style={{marginTop: '5px'}}>MOH Disease Surveillance Department</h3>
                            <span style={{color: 'green', fontWeight: 'bold', marginTop: '-9px'}}>COVID-19 TravelPASS</span>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                        width: '100%',
                        background: '#d8dce0',
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingLeft: 20,
                        marginTop: 20
                    }}>
                        Demographic Information
                    </div>
                    <div style={{display: 'flex', padding: 10}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>
                                <span>Full Name:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.sB1IHYu2xQT}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Nationality:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>
                  {store.options['Countries'][store.currentInstance.XvETY1aTxuB]}
                </span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Sex:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.FZzQbW8AWVd}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Date of Birth (Age):</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.g4LJbkM0R24}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>National ID (NIN)/Passport No:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.oUqWGeHjj5C}</span>
                            </div>

                        </div>
                        <div style={{width: 120, overflow: 'hidden', marginLeft: 'auto', float: 'right'}}>
                            <img src={imageUrl} alt="Image"/>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                        width: '100%',
                        background: '#d8dce0',
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingLeft: 20
                    }}>
                        Travel Information
                    </div>

                    <div style={{display: 'flex', padding: 10}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '70%'}}>
                            <div>
                                <span>Point of Entry:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.ouname}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Country of Departure:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>
                 {store.options['Countries'][store.currentInstance.cW0UPEANS5t]}
                </span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Country of Transit:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder',textTransform: "uppercase"}}>
                  {store.options['Countries'][store.currentInstance.pxcXhmjJeMv]}
                </span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Vehicle registration number:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.h6aZFN4DLcR}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Date and Time of entry:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.UJiu0P8GvHt}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Planned duration of stay (in Days) while in Uganda:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.eH7YTWgoHgo}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Physical address while in Uganda (Hotel/village/town/district):</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.ooK7aSiAaGq}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Phone Contact or Next of Kin contact:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.E7u9XdW24SP}</span>
                            </div>
                        </div>
                        <div style={{width: '30%', marginLeft: 'auto', display: 'flex', flexDirection: 'column'}}>
                            <div>
                                <span>Point of Entry ID:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>{store.currentInstance.CLzIR1Ye97b}</span>
                            </div>

                            <div style={{border: 'solid black 1px', paddingLeft: 10}}>
                                <span>Countries visited in the last 14 days:</span>
                                <div style={{paddingLeft: 5, fontWeight: 'bolder', textTransform: "uppercase"}}>
                                    <p style={{padding: 0, margin: 0}}>{store.options['Countries'][store.currentInstance.wJpIzoGlb9j]}</p>
                                    <p style={{padding: 0, margin: 0}}>{store.options['Countries'][store.currentInstance.zhWTXIwd6U1]}</p>
                                    <p style={{padding: 0, margin: 0}}>{store.options['Countries'][store.currentInstance.x9YWFwwuQnG]}</p>
                                </div>
                            </div>
                            <div style={{marginTop: 20}}>
                                <QrCode value={verifier} style={{marginBottom: 20, width: 128, height: 128}} renderAs="svg"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                        width: '100%',
                        background: '#d8dce0',
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingLeft: 20
                    }}>
                        COVID-19 Surveillance Investigations
                    </div>
                    <div style={{display: 'flex', padding: 10}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <div>
                                <span>Measured temperature:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder'}}>{store.currentInstance.QUrkIanwcHD}</span>
                            </div>
                            <div style={{marginTop: 5, display: 'flex', flexDirection: 'row', flexBasis: '100%', width: '100%'}}>
                                <span>Has the specimen been taken?</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder'}}>{store.currentInstance.NuRldDwq0AJ}</span>
                            </div>
                            <div style={{marginTop: 5}}>
                                <span>Cleared to Travel:</span>
                                <span style={{paddingLeft: 5, fontWeight: 'bolder'}}>{store.currentInstance.EWWNozu6TVd}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}} className="approval">
                    <style type="text/css">
                        {`@media print {.approval { display: none; }}`}
                    </style>
                    <div style={{
                        width: '100%',
                        background: '#d8dce0',
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingLeft: 20
                    }}>
                        Approval
                    </div>
                    <div style={{display: 'flex', padding: 20}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1, width: '50%'}}>
                                    <span>Approved by:</span>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1}}>
                                    <span>Official Stamp: </span>
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{marginTop: 5}}>
                                    <span>Date: </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div style={{padding: 20, display: 'flex', flexDirection: 'column', fontSize: 'large'}}>

                <div style={{
                    width: '100%',
                    background: '#d8dce0',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    paddingLeft: 20
                }}>
                    NO DATA FOR AVAILABLE NOW FOR THE SPECIFIED INSTANCE. Please Reload by clicking the link below
                </div>
                <div style={{display: 'flex', padding: 20}}>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%',alignItems: 'center', alignContent: 'center' }}>
              <span style={{marginTop: 30}}>
              <Link to="/">
                  <HomeOutlined/> BACK TO LIST
                </Link>
            </span>
                    </div>
                </div>
            </div>}
    </div>)
})

class Instance extends React.Component {
    render() {
        return <InstanceData/>;
    }
}

export const TrackedEntityInstance = observer(() => {
    const componentRef = useRef();
    const store = useStore();
    const history = useHistory();
    return (
        <div>
            <Menu mode="horizontal" theme="light" defaultSelectedKeys={['print']}>
                <Menu.Item key="print" style={{marginLeft: 20}}>
                    <ReactToPrint
                        trigger={() => <span>
                 <PrinterOutlined/> PRINT PASS
                </span>}
                        content={() => componentRef.current}
                    />
                </Menu.Item>
                <Menu.Item key="group" onClick={store.openDialog} style={{textTransform: "uppercase"}}>
                    <EyeOutlined/>
                    TRAVELERS ON {store.currentInstance.h6aZFN4DLcR}
                </Menu.Item>

                <Menu.Item key="home">
                    <Link to="/">
                        <HomeOutlined/>
                        BACK TO LIST
                    </Link>
                </Menu.Item>
            </Menu>

            <Instance ref={componentRef}/>

            <Modal
                title= {"TRAVELLERS ON: " + store.currentInstance.h6aZFN4DLcR}
                visible={store.visible}
                onOk={store.closeDialog}
                onCancel={store.closeDialog}
                width="95%"
                style={{overflow: "auto", textTransform: "uppercase"}}
                bodyStyle={{overflow: "auto"}}
            >
                <Table
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                store.closeDialog();
                                history.push(`/${record['CLzIR1Ye97b']}`);
                            },
                        };
                    }}
                    columns={store.columns}
                    dataSource={store.otherInstances}
                    rowKey="instance"
                    pagination={false}
                    style={{width: '100%'}}
                    size="small"
                />
            </Modal>
        </div>
    );
})
