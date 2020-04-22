import React, {useEffect, useState} from 'react';
import {Card, Input, Table, Drawer, List, Checkbox, Select} from "antd";
import {SettingOutlined} from '@ant-design/icons'
import {useStore} from "./context/context";
import {observer} from "mobx-react";
import {useHistory} from 'react-router-dom';

const {Search} = Input;
const {Option} = Select;

export const Home = observer(() => {
  const store = useStore();
  const history = useHistory();

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    store.initiate();
  }, [store]);

  return <div style={{padding: 10, background: '#F7F7F7', 'minHeight': '95vh'}}>
    <Select
      size="large"
      value={store.selectedProgram}
      style={{width: '100%', marginBottom: 10}}
      onChange={store.onChange}>
      {store.programs.map(program => <Option key={program.id} value={program.id}>{program.name}</Option>)}
    </Select>
    <Card
      title="Registered and allowed travellers into Uganda - COVID19 Response"
      extra={<SettingOutlined style={{fontSize: '24px'}} onClick={showDrawer}/>}
      bodyStyle={{overflow: "auto", textTransform: "uppercase"}}
    >
      <Search
        size="large"
        placeholder="input search text"
        allowClear={true}
        onChange={store.onSearch}
        style={{width: '100%', marginBottom: 20}}
      />
      <Table
        rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              history.push(`/${record[store.rowKey]}?type=${store.rowKey}&program=${store.selectedProgram}&stage=${store.currentProgramStage}&isEvent=${store.currentProgram.programType === 'WITHOUT_REGISTRATION'}`);
            },
          };
        }}
        columns={store.columns}
        dataSource={store.data}
        rowKey={store.rowKey}
        size="middle"
        onChange={store.handleChange}
        style={{textTransform: "uppercase", fontSize: 12}}
        pagination={{
          showSizeChanger: true,
          total: store.total,
          pageSize: store.pageSize,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
        }}
      />
    </Card>
    <Drawer
      title="Columns"
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      width={512}
    >
      <List
        itemLayout="horizontal"
        dataSource={store.availableAttributes}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Checkbox checked={item.selected} onChange={store.includeColumns(item.id)}/>}
              title={item.name}
            />
          </List.Item>
        )}
      />
    </Drawer>
  </div>
});
