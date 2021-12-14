import React, { Component } from "react";
// import QrReader from "react-qr-scanner";
import QrReader from "modern-react-qr-reader";
import axios from "axios";
import { Item } from "../Data/SampleItem";
import { FieldData } from "../Data/FieldData";
import Accordion from "react-bootstrap/Accordion";
// import QrReader from "react-qr-reader";
// import QRScan from "qrscan";

class QRContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      scan: true,
      resultData: {},
      resultStatus: false,
      // result: "No result",
      error: false,
      errorMsg: "Item Not Found",
      formatter: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }),
      showIframe: false,
      pdfURL: "",
      // resultData: Item,
    };

    this.handleScan = this.handleScan.bind(this);
    this.handleImage = this.handleImage.bind(this);
  }

  handleImage(item) {
    // console.log(item);
    // console.log(item);
    if (
      (item.transformType === "JewelrySerial" || !item.transformType) &&
      item.WebImage1
    ) {
      let str = item.WebImage1.replace(".jpg", "-product@2x.jpg");
      let imageurl = "https://cdn.kwiat.com/source-images/web/product/" + str;
      return imageurl;
    } else if (
      item.transformType === "DiamondSerial" ||
      item.transformType === "GemstoneSerial" ||
      ((item.transformType === "JewelrySerial" || !item.transformType) &&
        item.Shape &&
        item.Shape !== null)
    ) {
      // console.log("In shape");
      let imageurl =
        "https://cdn.kwiat.com/apps/kwiat-elastic-search/dia-shapes/" +
        item.Shape +
        ".jpg";
      // console.log("imageurl: ", imageurl);
      return imageurl;
    } else if (item.LargeImageName) {
      // console.log("Inside Large Image Name");

      let searchimage;
      searchimage = item.LargeImageName;
      let str = searchimage.split("\\");
      searchimage = str[str.length - 1];
      let imageurl = "https://cdn.kwiat.com/source-images/large/" + searchimage;
      return imageurl;
    } else {
      let imageurl =
        "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Missing-Images-Final-100x75px-01.svg";
      return imageurl;
    }
  }

  async handleScan(data) {
    // console.log("data :", data);

    // if (data) {
    //   this.setState({
    //     result: data,
    //     scan: false,
    //   });
    //   // window.open(data, "_self");
    // }
    if (data && typeof data === "string") {
      let url = data;
      //     let url = "https://kwqr.me/98138FL41618/J";
      // let url = "https://kwqr.me/85303D62177"
      // let url = "https://kwqr.me/85303D62177/D"
      //         let url = "https://kwqr.me/98138FL41618";
      // let url = "https://kwqr.me/8530362177/D";
      //     let url = "https://kwqr.me/98138F41618";
      let query = url.substring(16);
      console.log("query: ", query);
      let res;
      if (query.includes("/")) {
        console.log("Query Includes /");
        res = await axios.get(`api/${query}`);
      } else {
        console.log("Query Doesn't Includes /");
        res = await axios.get(`api/${query}`);
      }
      console.log("res :", res);
      if (res.status === 200 && res.data && res.data.status === 200) {
        if (res.data.destinationURL) {
          this.setState({
            showIframe: true,
            pdfURL: res.data.destinationURL,
            scan: false,
            resultStatus: false,
            error: false,
          });
          window.open(res.data.destinationURL, "_self");
          return;
        }

        this.setState({
          resultData: res.data.results,
          scan: false,
          resultStatus: true,
          error: false,
          showIframe: false,
        });
      } else {
        this.setState({
          error: true,
          resultStatus: false,
          scan: false,
          showIframe: false,
        });
      }
    } else {
      this.setState({
        error: false,
        resultStatus: false,
        scan: true,
        showIframe: false,
      });
    }
  }
  handleError(err) {
    console.error(err);
  }
  render() {
    const previewStyle = {
      height: 200,
      width: 260,
      margin: "auto",
    };

    let {
      resultStatus,
      resultData,
      error,
      errorMsg,
      scan,
      formatter,
      delay,
      showIframe,
      pdfURL,
      sampleData,
    } = this.state;

    return (
      <div>
        {scan ? (
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={"environment"}
          />
        ) : (
          <></>
        )}
        {/* <p className={scan ? "result" : ""}>{result}</p> */}
        {resultStatus ? (
          <div className="item_container">
            <div className="item">
              <div className="logo">
                <img src="https://cdn4.kwiat.com/source-images/web/logos/kwiat.jpg"></img>
              </div>
              <div className="serial_no">
                <label>SERIAL NUMBER: </label>
                <label>{resultData.SerialNumber}</label>
              </div>
              <div className="style_no">
                <label>STYLE NUMBER: </label>
                <label>{resultData.StyleNumber}</label>
              </div>
              <div className="item_image">
                <img src={this.handleImage(resultData)} />
              </div>
              {/* <div> Serial Number: {resultData.SerialNumber} </div>
              <div> Inventory ID: {resultData.InventoryID} </div>
              <div>
                Retail Price: {formatter.format(resultData.RetailPrice)}
              </div> */}
              <div className="fields">
                <Accordion defaultActiveKey="0" flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>GENERAL INFORMATION</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.GeneralData).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>
                                {FieldData.GeneralData[key].label} :
                              </label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>DESCRIPTION</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.Description).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>
                                {FieldData.Description[key].label} :
                              </label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>RING DETAILS</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.RingDetail).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>{FieldData.RingDetail[key].label} :</label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>DIAMOND DETAIL</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.DiamondDetail).map(
                        (key, Index) => {
                          if (resultData[key]) {
                            return (
                              <div className="field_data" key={Index}>
                                <label>
                                  {FieldData.DiamondDetail[key].label} :
                                </label>
                                <label>{resultData[key]}</label>
                              </div>
                            );
                          } else return <></>;
                        }
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>COLOR DETAIL</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.ColorDetail).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>
                                {FieldData.ColorDetail[key].label} :
                              </label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="5">
                    <Accordion.Header>CENTER DIAMOND INFO</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.CenterInfo).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>{FieldData.CenterInfo[key].label} :</label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="6">
                    <Accordion.Header>DIMENSIONS</Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.Dimensions).map((key, Index) => {
                        if (resultData[key]) {
                          return (
                            <div className="field_data" key={Index}>
                              <label>{FieldData.Dimensions[key].label} :</label>
                              <label>{resultData[key]}</label>
                            </div>
                          );
                        } else return <></>;
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="7">
                    <Accordion.Header>
                      CERTIFIED DIAMOND REPORT
                    </Accordion.Header>
                    <Accordion.Body>
                      {Object.keys(FieldData.CertifiedDiamondReports).map(
                        (key, Index) => {
                          if (resultData[key]) {
                            return (
                              <div className="field_data" key={Index}>
                                <label>
                                  {FieldData.CertifiedDiamondReports[key].label}{" "}
                                  :
                                </label>
                                <label>{resultData[key]}</label>
                              </div>
                            );
                          } else return <></>;
                        }
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {error ? <p className={scan ? "result" : ""}> {errorMsg} </p> : <></>}
        {!scan ? (
          <button
            className="scan"
            onClick={() =>
              this.setState({
                scan: true,
              })
            }
          >
            Scan
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default QRContainer;
