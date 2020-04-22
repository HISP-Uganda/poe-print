import React, {useRef, useState, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import {Link, useHistory, useParams} from 'react-router-dom'
import {Card, Menu, Modal, Select, Table} from "antd";
import QrCode from 'qrcode.react';
import {useConfig} from '@dhis2/app-runtime';
import {PrinterOutlined, EyeOutlined, HomeOutlined} from '@ant-design/icons';
import {observer} from "mobx-react";
import {useQuery, useStore} from "./context/context";
import {isEmpty} from "lodash";
import SimpleCrypto from "simple-crypto-js";
import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
const {Option} = Select
const InstanceData = observer(() => {
  const store = useStore();
  const [imageUrl, setImageUrl] = useState('');
  const [verifier, setVerifier] = useState('');
  const {baseUrl} = useConfig();
  const params = useParams();
  const AESKey = "COVID-19R35P0N5E-2020";
  const appCrypt = new SimpleCrypto(AESKey);

  const others = useQuery();

  const program = others.get('program');
  const type = others.get('type');
  const stage = others.get('stage');
  const isEvent = others.get('isEvent');
  const instance = params.instance;

  store.setParameters({program, type, stage, instance, isEvent})

  useEffect(() => {
    store.fetchTemplates().then(() => {
      store.searchValidTemplates(program);
    });
    // store.queryOneInstances(params.instance).then(() => {
    //   setImageUrl(`${baseUrl}/api/trackedEntityInstances/${store.currentInstance.instance}/AsnwhQvSeMy/image?dimension=small`);
    //   setVerifier(appCrypt.encrypt(`Name: ${store.currentInstance.sB1IHYu2xQT} \nVehicle : ${store.currentInstance.h6aZFN4DLcR} \nPhone Number: ${store.currentInstance.E7u9XdW24SP} \nPoint of Entry: ${store.currentInstance.ouname} \nPOE ID: ${store.currentInstance.CLzIR1Ye97b} \nDHIS2: ${baseUrl} \nTEI: ${store.currentInstance.instance} \nPROGRAM: ${program} \nPROGRAMSTAGE: ${programStage} \nORGUNITID: ${store.currentInstance.ou}`));
    // })
  }, [store, params]);

  const display = (item) => {
    switch (item.valueType) {
      case 'image':
        return <img src={item.value} alt="image"/>
      default:
        return <span>{item.value}</span>
    }
  }
  return (<div>
    <ResponsiveGridLayout
      className="layout"
      breakpoints={{
        xxl: 3400,
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0
      }}
      margin={[5, 5]}
      cols={{
        xxl: 24,
        lg: 24,
        md: 12,
        sm: 4,
        xs: 2,
        xxs: 2
      }}
      rowHeight={32}
    >
      {store.currentTemplate.items.map((item) =>
        <div key={item.i} className="bg-white" data-grid={{
          w: item.w,
          h: item.h,
          x: item.x,
          y: item.y,
          i: item.id,
          static: item.static
        }}>
          {display(item)}
        </div>
      )}
    </ResponsiveGridLayout>
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
      <div style={{display: 'flex'}}>
        <Select
          value={store.currentValidTemplate}
          size="large"
          style={{width: '40%', margin: 10}}
          onChange={store.setCurrentValidTemplate}>
          {store.validTemplates.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
        </Select>
        <Menu mode="horizontal" theme="light" defaultSelectedKeys={['print']} style={{marginLeft: 'auto', flex: 1}}>
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
      </div>

      <Instance ref={componentRef}/>
      <Modal
        title={"TRAVELLERS ON: " + store.currentInstance.h6aZFN4DLcR}
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
