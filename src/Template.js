import React, {useState, useEffect} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {useStore} from "./context/context";
import {Button, Modal, Select, Input, Card, Drawer, List, Checkbox, Upload, Collapse} from "antd";
import {observer} from "mobx-react";
import {useHistory} from 'react-router-dom';
import {UploadOutlined} from '@ant-design/icons';


const {TextArea} = Input
const {Option} = Select

const ResponsiveGridLayout = WidthProvider(Responsive);
const {Panel} = Collapse;

export const Template = observer(() => {
  const store = useStore();
  const [dialogs, setDialogs] = useState({text: false, attributes: false, dataElements: false});

  const history = useHistory();


  useEffect(() => {
    store.initiate();
  }, [store])

  const showModal = (type) => () => {
    store.currentTemplate.createItem();
    setDialogs({...dialogs, [type]: true})
  };

  const handleOk = (type) => e => {
    setDialogs({...dialogs, [type]: false});
    store.currentTemplate.addItem();
  };

  const addAttribute = (value) => () => {
    store.currentTemplate.currentItem.changeValue1(`{${value.trackedEntityAttribute.id}}`, 'attribute', value.valueType);
    handleOk('attributes')();
  }

  const addDataElement = (value, stage) => () => {
    store.currentTemplate.currentItem.changeValue1(`{${value.dataElement.id}.${stage}`, 'dataElement', value.valueType);
    handleOk('dataElements')();
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
      default:
        return <span>{item.value}</span>
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
        <Button onClick={showModal('attributes')} disabled={!store.currentProgram}>Attributes</Button>
        <Button onClick={showModal('dataElements')} disabled={!store.currentProgram}>Data Elements</Button>
        <Button onClick={showModal('text')}>Text</Button>
        <Upload customRequest={dummyRequest} showUploadList={false}>
          <Button>
            <UploadOutlined/> Upload
          </Button>
        </Upload>
        <Button onClick={saveTemplate}>Save</Button>
      </div>
    </div>

    <Card>
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
    </Card>
    <Modal
      title="Text Dialog"
      visible={dialogs.text}
      onOk={handleOk('text')}
      onCancel={handleCancel('text')}
    >
      <TextArea rows={4} value={store.currentTemplate.currentItem.value} onChange={store.currentTemplate.currentItem.changeValue}/>
    </Modal>
    <Drawer
      title="Columns"
      placement="right"
      closable={false}
      onClose={handleCancel('attributes')}
      visible={dialogs.attributes}
      width={512}
    >
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
              // avatar={<Checkbox checked={item.selected} onChange={store.includeColumns(item.id)}/>}
              title={item.trackedEntityAttribute.name}
            />
          </List.Item>
        )}
      />
    </Drawer>

    <Drawer
      title="Columns"
      placement="right"
      closable={false}
      onClose={handleCancel('dataElements')}
      visible={dialogs.dataElements}
      width={512}
    >
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
                    // avatar={<Checkbox checked={item.selected} onChange={store.includeColumns(item.id)}/>}
                    title={item.dataElement.name}
                  />
                </List.Item>
              )}
            />
          </Panel>) : null}
      </Collapse>
    </Drawer>
  </div>
});
