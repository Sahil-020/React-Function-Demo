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

import React, { Component } from "react";
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
      result: "No result",
    };

    this.handleScan = this.handleScan.bind(this);
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
    let url = "https://kwqr.me/98138FL41618/J";
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

    return (
      <div>
        {this.state.scan ? (
          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
            facingMode={"environment"}
          />
        ) : (
          <></>
        )}
        <p className={this.state.scan ? "result" : ""}>{this.state.result}</p>
        {!this.state.scan ? (
          <button
            className="scan"
            onClick={() => this.setState({ scan: true })}
          >
            Scan
          </button>
        ) : (
          <></>
        )}
      </div>
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
