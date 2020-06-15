import React, { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import { Link, useHistory, useParams } from "react-router-dom";
import { Menu, Modal, Table } from "antd";
import QrCode from "qrcode.react";
import { useConfig } from "@dhis2/app-runtime";
import { PrinterOutlined, EyeOutlined, HomeOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useStore } from "./context/context";
import { isEmpty } from "lodash";
import AES from "crypto-js/aes";

const InstanceData = observer(() => {
  const store = useStore();
  const [imageUrl, setImageUrl] = useState("");
  const [verifier, setVerifier] = useState("");
  const [results, setResults] = useState("MISSING");
  const { baseUrl } = useConfig();
  const { instance, orgUnit } = useParams();
  const AESKey = "COVID-19R35P0N5E-2020";
  const program = store.programId;
  const programStage = store.programStageID;
  const url = window.location.href;
  const qr_dhis2_url = url.split("/api/")[0];

  useEffect(() => {
    store.queryOneInstances(instance, orgUnit).then(() => {
      if (
        store.currentInstance.cjl37qfdEK5 &&
        store.currentInstance.cjl37qfdEK5.ovY6E8BSdto
      ) {
        setResults(store.currentInstance.cjl37qfdEK5.ovY6E8BSdto);
      }
      setImageUrl(
        `${baseUrl}/api/trackedEntityInstances/${store.currentInstance.trackedEntityInstance}/AsnwhQvSeMy/image?dimension=MEDIUM`
      );
      setVerifier(
        AES.encrypt(
          `Name: ${store.currentInstance.sB1IHYu2xQT} \nVehicle: ${store.currentInstance.h6aZFN4DLcR} \nPhone Number: ${store.currentInstance.E7u9XdW24SP} \nPoint of Entry: ${store.currentInstance.orgUnitName} \nPOE ID: ${store.currentInstance.CLzIR1Ye97b} \nDHIS2: ${qr_dhis2_url} \nTEI: ${store.currentInstance.trackedEntityInstance} \nPROGRAM: ${program} \nPROGRAMSTAGE: ${programStage} \nORGUNITID: ${store.currentInstance.orgUnit} \nNationality: ${store.currentInstance.XvETY1aTxuB} \nDOB: ${store.currentInstance.g4LJbkM0R24} \nSex: ${store.currentInstance.FZzQbW8AWVd} \nIdentification: ${store.currentInstance.oUqWGeHjj5C}\nResults: ${results}`,
          AESKey
        ).toString()
      );
    });
  }, [store, instance, orgUnit]);

  return (
    <div>
      {!isEmpty(store.currentInstance) ? (
        <div style={{ paddingLeft: 60, paddingRight: 60, marginBottom: 10 }}>
          <table width="100%">
            <tbody>
              <tr>
                <td width="32%">
                  <h2>MOH Disease Surveillance Department</h2>
                </td>
                <td width="34%" align="center">
                  <img
                    src="moh.png"
                    style={{
                      width: "120px",
                      marginBottom: "5px",
                      marginTop: "8px",
                    }}
                  />
                </td>
                <td width="32%"></td>
              </tr>

              <tr>
                <td colSpan={3} width="100%" align="center">
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      marginTop: "-9px",
                    }}
                  >
                    COVID-19 TravelPASS
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            className="MsoTableGrid"
            border={1}
            cellSpacing={0}
            cellPadding={0}
            width="100%"
            className="table"
          >
            <tbody>
              <tr>
                <td width="100%" colSpan={3} valign="middle" className="s5">
                  <p className="MsoListParagraph">
                    <b>
                      A.
                      <span className="test-font">
                        &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      </span>
                    </b>
                    <b>Demographic Information</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Full Names</p>
                </td>
                <td width="31%" valign="middle" className="s2" colSpan={2}>
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.sB1IHYu2xQT}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Nationality</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {
                        store.options["Countries"][
                        store.currentInstance.XvETY1aTxuB
                        ]
                      }
                    </span>
                  </p>
                </td>
                <td width="31%" rowSpan={7} valign="middle" className="s3">
                  <div
                    style={{ height: 254, overflow: "hidden", margin: "auto" }}
                  >
                    <img src={imageUrl} alt="Image" />
                  </div>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Date of Birth</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.g4LJbkM0R24}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Passport No / NIN</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.oUqWGeHjj5C}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Point of Entry No</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.PVXhTjVdB92}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Phone Number</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.E7u9XdW24SP}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Next of KIN (Name)</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.fik9qo8iHeo}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Next of KIN Phone No</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.j6sEr8EcULP}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="100%" colSpan={3} valign="middle" className="s4">
                  <p className="MsoListParagraph">
                    <b>
                      B.
                      <span className="test-font">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      </span>
                    </b>
                    <b>FirstTime Registration information</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Point of Entry</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.orgUnitName}
                    </span>
                  </p>
                </td>
                <td width="31%" valign="middle" className="s2" rowSpan={6}>
                  <QrCode
                    value={verifier}
                    style={{
                      width: 196,
                      height: 196,
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                    renderAs="svg"
                  />
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Country of Departure</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {
                        store.options["Countries"][
                        store.currentInstance.cW0UPEANS5t
                        ]
                      }
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Country of Destination</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {
                        store.options["Countries"][
                        store.currentInstance.pxcXhmjJeMv
                        ]
                      }
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Vehicle Registration Number</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.h6aZFN4DLcR}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Date and time of entry</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.UJiu0P8GvHt}
                    </span>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Physical address in Uganda</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span
                      style={{
                        paddingLeft: 5,
                        fontWeight: "bolder",
                        textTransform: "uppercase",
                      }}
                    >
                      {store.currentInstance.ooK7aSiAaGq}
                    </span>
                  </p>
                </td>
              </tr>
              {/* <tr>
						<td width="36%" valign="middle" className="s1">
							<p className="MsoNormal">Hotel/Village/Town/district</p>
						</td>
						<td width="31%" valign="middle" className="s2">
							<p className="MsoNormal">&nbsp;</p>
						</td>
					</tr> */}
              <tr>
                <td width="100%" colSpan={3} valign="middle" className="s4">
                  <p className="MsoListParagraph">
                    <b>
                      C.
                      <span className="test-font">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      </span>
                    </b>
                    <b>COVID-19 Surveillance Information</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Measured Temperature</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span style={{ paddingLeft: 5, fontWeight: "bolder" }}>
                      {store.currentInstance.QUrkIanwcHD}
                    </span>
                  </p>
                </td>
                <td
                  width="31%"
                  valign="middle"
                  className="s2"
                  rowSpan={2}
                  style={{
                    color:
                      results === "Positive"
                        ? "red"
                        : results === "MISSING"
                          ? "black"
                          : "green",
                  }}
                >
                  <p className="MsoNormal" style={{ margin: 0 }}>
                    COVID-19 TEST Results: &nbsp; {results}
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Specimen taken</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span style={{ paddingLeft: 5, fontWeight: "bolder" }}>
                      {store.currentInstance.NuRldDwq0AJ}
                    </span>
                  </p>
                </td>
              </tr>
              {/* <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Cleared to travel</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">
                    <span style={{ paddingLeft: 5, fontWeight: "bolder" }}>
                      {store.currentInstance.EWWNozu6TVd}
                    </span>
                  </p>
                </td>
              </tr> */}
              <tr>
                <td width="100%" colSpan={3} valign="middle" className="s4">
                  <p className="MsoListParagraph">
                    <b>
                      D.
                      <span className="test-font">
                        &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      </span>
                    </b>
                    <b>Approval</b>
                  </p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Approved by</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">Official Stamp</p>
                </td>
                <td width="31%" valign="middle" className="s2" rowSpan={12}>
                  <div className="MsoNormal">
                    <p style={{ margin: 0 }}>
                      {store.currentInstance.orgUnitName} Incharge
                    </p>
                    <p style={{ margin: 0 }}>
                      {store.currentInstance.contactPerson}
                    </p>
                    <p style={{ margin: 0 }}>
                      {store.currentInstance.phoneNumber}
                    </p>
                    <p style={{ margin: 0 }}>{store.currentInstance.email}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Date</p>
                </td>
                <td width="31%" valign="middle" className="s2" rowSpan={3}>
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Approved by</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">Official Stamp</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Date</p>
                </td>
                <td width="31%" valign="middle" className="s2" rowSpan={3}>
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Approved by</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">Official Stamp</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">Date</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
              <tr>
                <td width="36%" valign="middle" className="s1">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
                <td width="31%" valign="middle" className="s2">
                  <p className="MsoNormal">&nbsp;</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
          <div
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              fontSize: "large",
            }}
          >
            <div
              style={{
                width: "100%",
                background: "#d8dce0",
                height: 32,
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                paddingLeft: 20,
              }}
            >
              NO DATA FOR AVAILABLE NOW FOR THE SPECIFIED INSTANCE. Please Reload
              by clicking the link below
          </div>
            <div style={{ display: "flex", padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <span style={{ marginTop: 30 }}>
                  <Link to="/">
                    <HomeOutlined /> BACK TO LIST
                </Link>
                </span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
});

class Instance extends React.Component {
  render() {
    return <InstanceData />;
  }
}

export const TrackedEntityInstance = observer(() => {
  const componentRef = useRef();
  const store = useStore();
  const history = useHistory();
  return (
    <div>
      <Menu mode="horizontal" theme="light" defaultSelectedKeys={["print"]}>
        <Menu.Item key="print" style={{ marginLeft: 20 }}>
          <ReactToPrint
            trigger={() => (
              <span>
                <PrinterOutlined /> PRINT PASS
              </span>
            )}
            content={() => componentRef.current}
          />
        </Menu.Item>
        <Menu.Item
          key="group"
          onClick={store.openDialog}
          style={{ textTransform: "uppercase" }}
        >
          <EyeOutlined />
          TRAVELERS ON {store.currentInstance.h6aZFN4DLcR}
        </Menu.Item>

        <Menu.Item key="home">
          <Link to="/">
            <HomeOutlined />
            BACK TO LIST
          </Link>
        </Menu.Item>
      </Menu>

      <Instance ref={componentRef} />

      <Modal
        title={"TRAVELLERS ON: " + store.currentInstance.h6aZFN4DLcR}
        visible={store.visible}
        onOk={store.closeDialog}
        onCancel={store.closeDialog}
        width="95%"
        style={{ overflow: "auto", textTransform: "uppercase" }}
        bodyStyle={{ overflow: "auto" }}
      >
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                store.closeDialog();
                history.push(`/${record["instance"]}`);
              },
            };
          }}
          columns={store.columns}
          dataSource={store.otherInstances}
          rowKey="instance"
          pagination={false}
          style={{ width: "100%" }}
          size="small"
        />
      </Modal>
    </div>
  );
});
