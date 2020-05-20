import React, { useEffect, useState } from "react";
import { Card, Input, Table, Drawer, List, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useStore } from "./context/context";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

const { Search } = Input;

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
    store.queryData();
  }, [store]);

  return (
    <div style={{ padding: 10, background: "#F7F7F7", minHeight: "95vh" }}>
      <Card
        title="Registered and allowed travellers into Uganda - COVID19 Response"
        extra={
          <SettingOutlined style={{ fontSize: "24px" }} onClick={showDrawer} />
        }
        bodyStyle={{ overflow: "auto", textTransform: "uppercase" }}
      >
        <Search
          size="large"
          placeholder="input search text"
          allowClear={true}
          onChange={store.onSearch}
          style={{ width: "100%", marginBottom: 20 }}
        />
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                history.push(`/${record["instance"]}/${record["ou"]}`);
              },
            };
          }}
          columns={store.columns}
          dataSource={store.trackedEntityInstances}
          rowKey="instance"
          size="middle"
          onChange={store.handleChange}
          style={{ textTransform: "uppercase", fontSize: 12 }}
          loading={store.loading}
          pagination={{
            showSizeChanger: true,
            total: store.total,
            pageSize: store.pageSize,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "15", "20", "25", "50", "100"],
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
                avatar={
                  <Checkbox
                    checked={item.selected}
                    onChange={store.includeColumns(item.id)}
                  />
                }
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
});
