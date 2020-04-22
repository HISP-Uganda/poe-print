import React, {useState, useEffect} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {useStore} from "./context/context";
import {
  Button,
  Modal,
  Select,
  Input,
  Card,
  Drawer,
  Checkbox,
  List,
  InputNumber,
  Upload,
  Collapse,
  Tabs,
  Radio
} from "antd";
import {observer} from "mobx-react";
import {useHistory} from 'react-router-dom';
import {UploadOutlined} from '@ant-design/icons';
import QrCode from 'qrcode.react';
import Barcode from 'react-barcode';


const {TextArea} = Input
const {Option} = Select
const {TabPane} = Tabs;
const ResponsiveGridLayout = WidthProvider(Responsive);
const {Panel} = Collapse;


const others = [
  'OU_CODE',
  'OU_NAME',
  'TRACKED_ENTITY_INSTANCE',
  'EVENT',
  'EVENT_DATE',
  'ENROLLMENT_DATE',
  'INCIDENT_DATE',
];

export const Template = observer(() => {
  const store = useStore();
  const [dialogs, setDialogs] = useState({
    text: false,
    attributes: false,
    dataElements: false,
    qr: false,
    bar: false
  });

  const [qrItems, setQrItems] = useState([]);
  const [barItems, setBarItems] = useState([]);

  const addQrItem = val => e => {
    if (e.target.checked && qrItems.indexOf(val) === -1) {
      setQrItems([...qrItems, val])
    } else if (!e.target.check && qrItems.indexOf(val) === -1) {
      setQrItems(qrItems.filter(item => item !== val));
    }
  }

  const addBarItem = val => e => {
    if (e.target.checked && barItems.indexOf(val) === -1) {
      setBarItems([...barItems, val])
    } else if (!e.target.check && barItems.indexOf(val) === -1) {
      setBarItems(barItems.filter(item => item !== val));
    }
  }

  const history = useHistory();

  useEffect(() => {
    store.initiate();
  }, [store])

  const showModal = (type) => () => {
    store.currentTemplate.createItem();
    setDialogs({...dialogs, [type]: true})
  };


  const addText = () => {
    store.currentTemplate.currentItem.setLabel(store.currentTemplate.currentItem.value);
    store.currentTemplate.addItem();
    setDialogs({...dialogs, text: false});
    store.currentTemplate.createItem();
  }

  const addHtmlItem = (html) => {
    store.currentTemplate.currentItem.changeValue1(html, html, html, html);
    store.currentTemplate.addItem();
    store.currentTemplate.createItem();
  }

  const addQR = () => {
    store.currentTemplate.currentItem.changeValue1(qrItems.join(','), 'qr', 'QR', qrItems.join(','));
    store.currentTemplate.addItem();
    store.currentTemplate.createItem();
    setQrItems([]);
    setDialogs({...dialogs, qr: false});
  }

  const addBarcode = () => {
    store.currentTemplate.currentItem.changeValue1(barItems.join(','), 'barcode', 'BARCODE', barItems.join(','));
    store.currentTemplate.addItem();
    store.currentTemplate.createItem();
    setBarItems([])
    setDialogs({...dialogs, bar: false});

  }

  const addAttribute = (value) => () => {
    store.currentTemplate.currentItem.changeValue1(`{${value.trackedEntityAttribute.id}}`, 'attribute', value.valueType, value.trackedEntityAttribute.name);
    store.currentTemplate.addItem();
    store.currentTemplate.createItem();
  }

  const addDataElement = (value, stage) => () => {
    store.currentTemplate.currentItem.changeValue1(`{${value.dataElement.id}.${stage}`, 'dataElement', value.valueType, value.dataElement.name);
    store.currentTemplate.addItem();
    store.currentTemplate.createItem()
  }

  const addOther = (value) => () => {
    store.currentTemplate.currentItem.changeValue1(`OU{${value}}`, 'OTHER', value, `OU{${value}}`);
    store.currentTemplate.addItem();
    store.currentTemplate.createItem()
  }

  const handleCancel = (type) => e => {
    setDialogs({...dialogs, [type]: false})
  };

  const saveTemplate = async () => {
    await store.saveTemplate();
    history.push('/templates/list')
  }

  const dummyRequest = async ({file, onSuccess}) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      store.currentTemplate.createImage(data);
      onSuccess('ok');
      file = null;
    };
    reader.onerror = error => console.log(error);
  };

  const onLayoutChange = (layout) => {
    store.currentTemplate.items.forEach(item => {
      const itemLayout = layout.find(l => l.i === item.i);
      if (itemLayout) {
        const {w, h, x, y} = itemLayout;
        item.changeSize(w, h, x, y);
      }
    });
  };

  const display = (item) => {
    switch (item.valueType) {
      case 'image':
        return <img src={item.value} alt="image"/>
      case 'qr':
        return <QrCode value={item.value} renderAs="svg"/>
      case 'barcode':
        return <Barcode value={item.value}/>
      case 'TEXTBOX':
        return <Input/>
      case 'RADIO':
        return <Radio/>
      case 'CHECKBOX':
        return <Checkbox/>
      default:
        return <span>{item.label}</span>
    }
  }

  return <div style={{display: 'flex', background: '#F7F7F7', flexDirection: 'column', padding: 10, minHeight: '95vh'}}>
    <div style={{display: 'flex', marginBottom: 10}}>
      <div style={{width: '50%'}}>
        <Select
          size="large"
          value={store.selectedProgram}
          style={{width: '40%'}}
          onChange={store.onChange}>
          {store.programs.map(program => <Option key={program.id} value={program.id}>{program.name}</Option>)}
        </Select>
        &nbsp;&nbsp;&nbsp;
        <Input style={{width: '40%'}} size="large" value={store.currentTemplate.name}
               onChange={store.currentTemplate.changeName} placeholder="Template Name"/>
      </div>
      <div style={{marginLeft: 'auto'}}>

        <Button size="large" onClick={saveTemplate}>Save</Button>
      </div>
    </div>

    <Card
      title={<div>
        <Button size="large" onClick={showModal('dataElements')} disabled={!store.currentProgram}>DHIS2</Button>
        <Button size="large" onClick={showModal('text')}>Text</Button>
        <Button size="large" onClick={() => addHtmlItem('TEXTBOX')}>TEXT BOX</Button>
        <Button size="large" onClick={() => addHtmlItem('RADIO')}>RADIO</Button>
        <Button size="large" onClick={() => addHtmlItem('CHECKBOX')}>CHECKBOX</Button>
        <Button size="large" onClick={showModal('bar')}>BARCODE</Button>
        <Button size="large" onClick={showModal('qr')}>QRCODE</Button>
        <Upload customRequest={dummyRequest} showUploadList={false}>
          <Button size="large">
            <UploadOutlined/> Image
          </Button>
        </Upload>
        <InputNumber size="large" min={8} max={72} defaultValue={12}
                     onChange={(value) => store.currentTemplate.currentItem.addStyle('fontSize', value)}/>
        <Button size="large"
                onClick={() => store.currentTemplate.currentItem.hasStyle('fontWeight') ? store.currentTemplate.currentItem.removeStyle('fontWeight') : store.currentTemplate.currentItem.addStyle('fontWeight', 'bold')}>BOLD</Button>
        <Button size="large" onClick={() => store.currentTemplate.currentItem.hasStyle('fontStyle') ? store.currentTemplate.currentItem.removeStyle('fontStyle') : store.currentTemplate.currentItem.addStyle('fontStyle', 'italic')}>ITALIC</Button>
      </div>}
      bodyStyle={{background: '#F7F7F7'}}
    >
      <ResponsiveGridLayout
        className="layout"
        onLayoutChange={onLayoutChange}
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
          xxl: 48,
          lg: 48,
          md: 24,
          sm: 8,
          xs: 4,
          xxs: 4
        }}
        rowHeight={32}
      >
        {store.currentTemplate.items.map((item) =>
          <div style={{cursor: 'pointer', background: 'white', ...item.style}} key={item.i} data-grid={{
            w: item.w,
            h: item.h,
            x: item.x,
            y: item.y,
            i: item.id,
            static: item.static
          }} onClick={() => store.currentTemplate.setCurrentItem(item)}>
            {display(item)}
          </div>
        )}
      </ResponsiveGridLayout>
    </Card>
    <Modal
      title="Text Dialog"
      visible={dialogs.text}
      onOk={addText}
      onCancel={handleCancel('text')}
    >
      <TextArea rows={4} value={store.currentTemplate.currentItem.value}
                onChange={store.currentTemplate.currentItem.changeValue}/>
    </Modal>

    <Modal
      title="QR CODE"
      visible={dialogs.qr}
      onOk={addQR}
      onCancel={handleCancel('qr')}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Miscellaneous" key="1">
          <List
            itemLayout="horizontal"
            dataSource={others}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Checkbox onChange={addQrItem(item)} checked={qrItems.indexOf(item) !== -1}/>}
                  title={item}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Attributes" key="2">
          <List
            itemLayout="horizontal"
            dataSource={store.currentProgram ? store.currentProgram.programTrackedEntityAttributes : []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Checkbox onChange={addQrItem(item.trackedEntityAttribute.id)}
                                    checked={qrItems.indexOf(item.trackedEntityAttribute.id) !== -1}/>}
                  title={item.trackedEntityAttribute.name}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Data Elements" key="3">
          <Collapse>
            {store.currentProgram ? store.currentProgram.programStages.map(stage =>
              <Panel key={stage.id} header={stage.name}>
                <List
                  itemLayout="horizontal"
                  dataSource={stage.programStageDataElements}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Checkbox onChange={addQrItem(`${stage.id}.${item.dataElement.id}`)}
                                          checked={qrItems.indexOf(`${stage.id}.${item.dataElement.id}`) !== -1}/>}
                        title={item.dataElement.name}
                      />
                    </List.Item>
                  )}
                />
              </Panel>) : null}
          </Collapse>
        </TabPane>
      </Tabs>
    </Modal>
    <Modal
      title="BARCODE"
      visible={dialogs.bar}
      onOk={addBarcode}
      onCancel={handleCancel('bar')}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Miscellaneous" key="1">
          <List
            itemLayout="horizontal"
            dataSource={others}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Checkbox onChange={addBarItem(item)} checked={barItems.indexOf(item) !== -1}/>}
                  title={item}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Attributes" key="2">
          <List
            itemLayout="horizontal"
            dataSource={store.currentProgram ? store.currentProgram.programTrackedEntityAttributes : []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Checkbox onChange={addBarItem(item.trackedEntityAttribute.id)}
                                    checked={barItems.indexOf(item.trackedEntityAttribute.id) !== -1}/>}
                  title={item.trackedEntityAttribute.name}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Data Elements" key="3">
          <Collapse>
            {store.currentProgram ? store.currentProgram.programStages.map(stage =>
              <Panel key={stage.id} header={stage.name}>
                <List
                  itemLayout="horizontal"
                  dataSource={stage.programStageDataElements}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Checkbox onChange={addBarItem(`${stage.id}.${item.dataElement.id}`)}
                                          checked={barItems.indexOf(`${stage.id}.${item.dataElement.id}`) !== -1}/>}
                        title={item.dataElement.name}
                      />
                    </List.Item>
                  )}
                />
              </Panel>) : null}
          </Collapse>
        </TabPane>
      </Tabs>
    </Modal>
    <Drawer
      title="Columns"
      placement="right"
      closable={false}
      onClose={handleCancel('dataElements')}
      visible={dialogs.dataElements}
      width={512}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Miscellaneous" key="1">
          <List
            itemLayout="horizontal"
            dataSource={others}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="add"
                    onClick={addOther(item)}>
                    ADD
                  </Button>
                ]}>
                <List.Item.Meta
                  title={item}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Attributes" key="2">
          <List
            itemLayout="horizontal"
            dataSource={store.currentProgram ? store.currentProgram.programTrackedEntityAttributes : []}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="add"
                    onClick={addAttribute(item)}>
                    ADD
                  </Button>
                ]}>
                <List.Item.Meta
                  title={item.trackedEntityAttribute.name}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Program Stages & Data Elements" key="3">
          <Collapse>
            {store.currentProgram ? store.currentProgram.programStages.map(stage =>
              <Panel key={stage.id} header={stage.name}>
                <List
                  itemLayout="horizontal"
                  dataSource={stage.programStageDataElements}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          key="add"
                          onClick={addDataElement(item, stage.id)}>
                          ADD
                        </Button>
                      ]}>
                      <List.Item.Meta
                        title={item.dataElement.name}
                      />
                    </List.Item>
                  )}
                />
              </Panel>) : null}
          </Collapse>
        </TabPane>

      </Tabs>

    </Drawer>
  </div>
});
