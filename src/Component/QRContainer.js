// import React, { Component } from "react";
// // import QrReader from "react-qr-scanner";
// // import QrReader from "modern-react-qr-reader";
// import QrReader from "react-qr-reader";

// import QRScan from "qrscan";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";

// class QRContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       delay: 100,
//       result: "No result",
//     };

//     this.handleScan = this.handleScan.bind(this);
//   }
//   handleScan(data) {
//     console.log("data :", data);
//     if (data) {
//       this.setState({
//         result: data,
//       });
//     }
//   }
//   handleError(err) {
//     console.error(err);
//   }
//   render() {
//     const previewStyle = {
//       height: 240,
//       width: 320,
//     };

//     return (
//       <div>
//         <QrReader
//           delay={this.state.delay}
//           style={previewStyle}
//           onError={this.handleError}
//           onScan={this.handleScan}
//           facingMode={"environment"}
//         />
//         <p>{this.state.result}</p>
//       </div>
//     );
//   }

//   // constructor(props) {
//   //   super(props);
//   //   this.state = { value: "", watching: false };
//   //   this.onFind = this.onFind.bind(this);
//   // }

//   // onFind(value) {
//   //   this.setState({ value, watching: false });
//   // }

//   // render() {
//   //   return (
//   //     <>
//   //       <h1>QRScan Demo</h1>
//   //       {this.state.watching ? (
//   //         <QRScan onFind={this.onFind} />
//   //       ) : (
//   //         <>
//   //           <button onClick={() => this.setState({ watching: true })}>
//   //             Scan
//   //           </button>
//   //           <h4>value: {this.state.value}</h4>
//   //         </>
//   //       )}
//   //     </>
//   //   );
//   // }
// }

// export default QRContainer;

// // import React from "react";
// // // import BarcodeScannerComponent from "react-qr-barcode-scanner";
// // import ReactiveQR from "reactive-qr";

// // export default function QRContainer() {
// //   const [data, setData] = React.useState("Not Found");

// //   return (
// //     <>
// //       {/* <BarcodeScannerComponent
// //         width={500}
// //         height={500}
// //         onUpdate={(err, result) => {
// //           if (result) setData(result.text);
// //           else setData("Not Found");
// //         }}
// //       /> */}
// //       <ReactiveQR
// //         onCode={(code) => {
// //           console.log(code);
// //           setData(code.toString());
// //         }}
// //       />
// //       <p>{data}</p>
// //     </>
// //   );
// // }
import React, {
    Component
} from "react";
// import QrReader from "react-qr-scanner";
import QrReader from "modern-react-qr-reader";
import axios from "axios";
// import QrReader from "react-qr-reader";
// import QRScan from "qrscan";

class QRContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 100,
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
        if (data) {
            this.setState({
                result: data,
                scan: false,
            });
            // window.open(data, "_self");
        }
        //     let url = "https://kwqr.me/98138FL41618/J";
        // let url = "https://kwqr.me/85303D62177"
        // let url = "https://kwqr.me/85303D62177/D"
        let url = "https://kwqr.me/98138FL41618";
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
        if (res.status === 200 && res.data) {
            this.setState({
                resultData: res.data,
                scan: false,
                resultStatus: true,
                error: false,
            });
        } else {
            this.setState({
                error: true,
                resultStatus: false,
                scan: false
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
            delay
        } =
        this.state;

        return ( <
            div > {
                scan ? ( <
                    QrReader delay = {
                        delay
                    }
                    style = {
                        previewStyle
                    }
                    onError = {
                        this.handleError
                    }
                    onScan = {
                        this.handleScan
                    }
                    facingMode = {
                        "environment"
                    }
                    />
                ) : ( <
                    > < />
                )
            } {
                /* <p className={scan ? "result" : ""}>{result}</p> */ } {
                resultStatus ? ( <
                    div className = "item_container" >
                    <
                    div className = "item" >
                    <
                    div className = "item_image" >
                    <
                    img src = {
                        this.handleImage(resultData)
                    }
                    /> <
                    /div> <
                    div > Serial Number: {
                        resultData.SerialNumber
                    } < /div> <
                    div > Inventory ID: {
                        resultData.InventoryID
                    } < /div> <
                    div >
                    Retail Price: {
                        formatter.format(resultData.RetailPrice)
                    } <
                    /div> <
                    /div> <
                    /div>
                ) : ( <
                    > < />
                )
            } {
                error ? < p className = {
                    scan ? "result" : ""
                } > {
                    errorMsg
                } < /p> : <></ >
            } {
                !scan ? ( <
                    button className = "scan"
                    onClick = {
                        () => this.setState({
                            scan: true
                        })
                    } >
                    Scan <
                    /button>
                ) : ( <
                    > < />
                )
            } <
            /div>
        );
    }

    //   constructor(props) {
    //     super(props);
    //     this.state = { value: "", watching: false };
    //     this.onFind = this.onFind.bind(this);
    //   }

    //   onFind(value) {
    //     this.setState({ value, watching: false });
    //   }

    //   render() {
    //     return (
    //       <>
    //         <h1>QRScan Demo</h1>
    //         {this.state.watching ? (
    //           <QRScan onFind={this.onFind} />
    //         ) : (
    //           <>
    //             <button onClick={() => this.setState({ watching: true })}>
    //               Scan
    //             </button>
    //             <h4>value: {this.state.value}</h4>
    //           </>
    //         )}
    //       </>
    //     );
    //   }
}

export default QRContainer;
