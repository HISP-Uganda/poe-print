import React, {useEffect} from 'react';
import {Button, Card, Table} from "antd";
import {observer} from "mobx-react";
import {useStore} from "./context/context";

import {useHistory} from 'react-router-dom'

export const Templates = observer(() => {
  const store = useStore();
  const history = useHistory();

  useEffect(() => {
    store.fetchTemplates()
  })

  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }];

  const addTemplate = () => {
    store.addTemplate()
    history.push('/templates/add');
  }

  return <div style={{padding: 10, background: '#F7F7F7', 'minHeight': '95vh'}}>
    <Card
      title="Template used in printing"
      extra={<Button onClick={addTemplate}>ADD</Button>}
      bodyStyle={{overflow: "auto", textTransform: "uppercase"}}
    >
      <Table rowKey="id" dataSource={store.templates} columns={columns}/>
    </Card>
  </div>
});
