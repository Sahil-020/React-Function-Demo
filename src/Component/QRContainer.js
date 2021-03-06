import React, { Component } from "react";
// import QrReader from "react-qr-scanner";
import QrReader from "modern-react-qr-reader";
import axios from "axios";
import { Item } from "../Data/SampleItem";
import {
  FieldData,
  DiamondFieldData,
  GemStoneFieldData,
} from "../Data/FieldData";
import Accordion from "react-bootstrap/Accordion";
import ImageGallery from "react-image-gallery";
import currencyFormatter from "currency-formatter";
import { withRouter } from "react-router-dom";
import Kwiat from "../Logo/kwiat-logo-removebg-preview.png";
import Fred from "../Logo/fredleighton-logo-removebg-preview.png";
import { toast } from "react-toastify";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import $ from "jquery";
import moment from "moment";
// import QrReader from "react-qr-reader";
// import QRScan from "qrscan";

// const id = useParams();

// const Error = () => {
//   toast.error(" Item not found ", {
//     position: toast.POSITION.TOP_RIGHT,
//     autoClose: 2000,
//     pauseOnHover: false,
//     theme: "colored",
//   });
// };

// const scrollToTop = useAccordionButton(
//   eventKey,
//   () => callback && callback(eventKey)
// );
function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );

  return (
    <button
      type="button"
      style={{ backgroundColor: "pink" }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

class QRContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 600,
      search: ![undefined, null, ""].includes(
        props.location.pathname.replace("/", "")
      )
        ? false
        : true,
      // search: true,
      scan: ![undefined, null, ""].includes(
        props.location.pathname.replace("/", "")
      )
        ? false
        : true,
      // scan: true,
      searchValue: "",
      resultData: {},
      // resultData: Item,
      resultStatus: ![undefined, null, ""].includes(
        props.location.pathname.replace("/", "")
      )
        ? true
        : false,
      // resultStatus: true,
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
      resultData: Item,
      // imgArr: [],
      reportJPG: [],
      reportPDF: [],
      id: props.location.pathname.replace("/", ""),
    };

    this.handleScan = this.handleScan.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleImageGallery = this.handleImageGallery.bind(this);
    this.handleReports = this.handleReports.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  async componentDidMount() {
    setInterval(this.handleFocus, 1000);
    // this.handleFocus();
    if (this.state.id) {
      // console.log("id : ", this.state.id);
      this.setState({
        scan: false,
        resultStatus: false,
        error: false,
        search: false,
      });
      await this.handleGetData(this.state.id);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (
      ![undefined, null, ""].includes(
        nextProps.location.pathname.replace("/", "")
      )
    ) {
      let id = nextProps.location.pathname.replace("/", "");
      this.setState({
        scan: false,
        resultStatus: false,
        error: false,
        id: nextProps.location.pathname.replace("/", ""),
      });
      await this.handleGetData(id);
    }
  }
  scrollToTop(eventKey) {
    // scroll.scrollToTop();
    // let element = document.getElementById("preview-modal");
    // element.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // });
    // const scrollToTop = useAccordionButton(eventKey, () =>
    //   window.scrollTo({ top: 0, behavior: "smooth" })
    // );
    // scrollToTop();
  }
  handleFocus() {
    // document.getElementById("searchBox").select();

    // let w = window.innerWidth;
    // if (w > 1024) {
    document.getElementById("searchBox").focus({
      preventScroll: true,
    });
    // } else {
    // $(document).on("touchstart", function (e) {
    //   if (e.target.nodeName !== "INPUT") {
    //     e.preventDefault();
    //   }
    // });

    // // prevent scrolling from within input field
    // $(document).on("touchmove", function (e) {
    //   if (e.target.nodeName == "INPUT") {
    //     e.preventDefault();
    //   }
    // });
    // }
    // document.getElementById("searchBox") &&

    // $(#searchBox).bind('focus', function(e){
    //   e.preventDefault();
    // });

    // element.focus({
    //   preventScroll: true
    // });
  }
  handleReports(type) {
    let { resultData } = this.state;
    if (type === "jpg") {
      if (resultData.ReportJpgUrls) {
        // console.log(
        //   "jpg",
        //   resultData.ReportJpgUrls.split("|").map((value) =>
        //     value.replace(" ", "")
        //   )
        // );
        return resultData.ReportJpgUrls.split("|").map((value) =>
          value.replace(" ", "")
        );
      }
      return [];
    }
    if (type === "pdf") {
      if (resultData.ReportPdfUrls) {
        // console.log(
        //   "pdf",
        //   resultData.ReportPdfUrls.split("|").map((value) =>
        //     value.replace(" ", "")
        //   )
        // );
        return resultData.ReportPdfUrls.split("|").map((value) =>
          value.replace(" ", "")
        );
      }
      return [];
    }

    // let fileIdNames = res.FileIdNames;
    // let fileData = fileIdNames.split("|");
    // // console.log("fileData: ", fileData);
    // if (fileData.length === 1) {
    //   let fileID = fileData[0].slice(fileData[0].indexOf(":") + 1);
    //   // console.log("fileID: ", fileID);
    //   window
    //     .open(BaseURL + "/Frames/GetFile.ashx?fileID=" + fileID, "_blank")
    //     .focus();
    // } else {
    //   this.setState({ fileData, showFileModal: true });
    // }
  }

  handleImageGallery() {
    let res = this.state.resultData;
    var imgArr = [];
    if (res) {
      function showShapeImage(shape) {
        let imageurl =
          "https://cdn.kwiat.com/apps/kwiat-elastic-search/dia-shapes/" +
          shape +
          ".jpg";
        return imageurl;
      }
      function showWebImage(img) {
        var src = "https://cdn4.kwiat.com/source-images/web/original/" + img;
        return src;
      }
      function showimage(image) {
        let img,
          str = "";
        if (image && image != null) {
          let searchimage;
          searchimage = image;
          str = searchimage.split("\\");
          searchimage = str[str.length - 1];
          img = "https://cdn.kwiat.com/source-images/large/" + searchimage;
        } else {
          img = "";
        }
        return img;
      }
      const webImgName = (img) => img.replace(/ /g, "");
      const largeImgName = (img) => {
        var str = img.split("\\");
        return str[str.length - 1];
      };

      if (res.LargeImageName) {
        imgArr.push({
          original: showimage(res.LargeImageName),
          thumbnail: showimage(res.LargeImageName),
          imgName: largeImgName(res.LargeImageName),
        });
      }
      if (res.Shape) {
        imgArr.push({
          original: showShapeImage(res.Shape),
          thumbnail: showShapeImage(res.Shape),
          imgName: res.shape,
        });
      }
      if (res.EditorialVideo) {
        imgArr.push({
          thumbnail:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          original:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          embedUrl: res.EditorialVideo,
          // description: "Render custom slides (such as videos)",
          renderItem: this.renderVideo.bind(this),
        });
      }
      if (res.SerialVideoLink) {
        imgArr.push({
          thumbnail:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          original:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          embedUrl: res.SerialVideoLink,
          // description: "Render custom slides (such as videos)",
          renderItem: this.renderVideo.bind(this),
        });
      }
      if (res.StyleVideoLink) {
        imgArr.push({
          thumbnail:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          original:
            "https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Video-Icon-Stock-Black.svg",
          embedUrl: res.StyleVideoLink,
          // description: "Render custom slides (such as videos)",
          renderItem: this.renderVideo.bind(this),
        });
      }

      for (let i = 1; i < 6; i++) {
        var field = "WebImage" + i;
        if (res[field]) {
          imgArr.push({
            original: showWebImage(res[field]),
            thumbnail: showWebImage(res[field]),
            imgName: webImgName(res[field]),
          });
        }
      }
    }
    // console.log("imgArr : ", imgArr);
    return imgArr;
    // this.setState({
    //   imgArr: imgArr,
    // });
  }

  renderVideo(item) {
    return (
      <div className="video-wrapper">
        {/* <a
          className="close-video"
          onClick={this._toggleShowVideo.bind(this, item.embedUrl)}
        ></a> */}
        <iframe
          // width="350"
          // height="300"
          src={`${item.embedUrl}?autoplay=1`}
          // src={`https://iframe.videodelivery.net/${item.embedUrl}`}
          style={{ border: "none" }}
          allowFullScreen="true"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        ></iframe>
        {/* <video autoPlay>
          <source src={item.embedUrl} type="video/mp4" />
        </video> */}
      </div>
    );
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

  async handleGetData(query) {
    // this.props.setShowLoader(true);
    let res;
    if (query.includes("/")) {
      // console.log("Query Includes /");
      res = await axios.get(`/api/${query}`);
    } else {
      // console.log("Query Doesn't Includes /");
      res = await axios.get(`api/${query}`);
      // res = await axios.get(`demoapi/${query}`);
    }
    // console.log("res :", res);
    if (res.status === 200 && res.data && res.data.status === 200) {
      if (res.data.destinationURL) {
        this.setState({
          showIframe: true,
          pdfURL: res.data.destinationURL,
          scan: false,
          search: false,
          resultStatus: false,
          error: false,
          searchValue: "",
        });
        // this.props.setShowLoader(false);
        // await axios
        //   .get(res.data.destinationURL, {
        //     responseType: "blob",
        //   })
        //   .then((response) => {
        //     const file = new Blob([response.data], { type: "application/pdf" });
        //     const fileURL = URL.createObjectURL(file);
        //     window.open(fileURL, "_blank");
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        // let pdfWindow = window.open("");
        // pdfWindow.document.write(
        //   "<iframe width='100%' height='99.5%' src=" +
        //     res.data.destinationURL +
        //     "></iframe>"
        // );
        window.open(res.data.destinationURL, "_blank");
        return;
      }
      if (res.data.type && res.data.type === "RFID") {
        this.setState({
          resultData: res.data.results,
          scan: false,
          search: false,
          resultStatus: true,
          error: false,
          showIframe: false,
          searchValue: "",
        });
        this.handleFocus();
        // this.props.setShowLoader(false);
        return;
      }

      this.setState({
        resultData: JSON.parse(res.data.results),
        scan: false,
        search: false,
        resultStatus: true,
        error: false,
        showIframe: false,
        searchValue: "",
      });
      this.handleFocus();
      // this.props.setShowLoader(false);
    } else {
      // console.log("Inside handlegetData else");
      toast.error(" Item not found ", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        pauseOnHover: false,
        theme: "colored",
      });
      // console.log(
      //   "resultData: ",
      //   this.state.resultData,
      //   "\n",
      //   typeof this.state.resultData
      // );
      this.setState((prevState) => ({
        error: false,
        resultStatus:
          Object.keys(prevState.resultData).length !== 0 &&
          (prevState.resultData.constructor === Object ||
            prevState.resultData.constructor === Array)
            ? true
            : false,
        scan: prevState.resultData ? true : false,
        search: true,
        showIframe: false,
        searchValue: "",
      }));
      this.handleFocus();
      // this.props.setShowLoader(false);
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
      // console.log("query: ", query);
      this.handleGetData(query);
      // let res;
      // if (query.includes("/")) {
      //   console.log("Query Includes /");
      //   res = await axios.get(`api/${query}`);
      // } else {
      //   console.log("Query Doesn't Includes /");
      //   res = await axios.get(`api/${query}`);
      // }
      // console.log("res :", res);
      // if (res.status === 200 && res.data && res.data.status === 200) {
      //   if (res.data.destinationURL) {
      //     this.setState({
      //       showIframe: true,
      //       pdfURL: res.data.destinationURL,
      //       scan: false,
      //       resultStatus: false,
      //       error: false,
      //     });
      //     window.open(res.data.destinationURL, "_self");
      //     return;
      //   }

      //   this.setState({
      //     resultData: JSON.parse(res.data.results),
      //     scan: false,
      //     resultStatus: true,
      //     error: false,
      //     showIframe: false,
      //   });
      // } else {
      //   this.setState({
      //     error: true,
      //     resultStatus: false,
      //     scan: false,
      //     showIframe: false,
      //   });
      // }
    } else {
      // console.log("Inside scan else");
      this.setState({
        error: false,
        resultStatus: false,
        scan: true,
        search: true,
        showIframe: false,
      });
    }
  }
  handleError(err) {
    console.error(err);
  }
  render() {
    // const previewStyle = {
    //   height: 200,
    //   width: 260,
    //   margin: "auto",
    // };

    let {
      resultStatus,
      resultData,
      error,
      errorMsg,
      scan,
      search,
      searchValue,
      formatter,
      delay,
      showIframe,
      pdfURL,
      sampleData,
      id,
    } = this.state;

    // console.log("state : ", this.state);
    // let { setShowLoader } = this.props;

    // console.log("params : ", id);
    // console.log(
    //   "props : ",
    //   typeof this.props.location.pathname.replace("/", "")
    // );

    // console.log(
    //   "color details:",
    //   Object.keys(FieldData.ColorDetail)
    //     .map((key, Index) => resultData[key])
    //     .filter((value) => ![undefined, null].includes(value))
    // );
    // console.log(
    //   "dimensions: ",
    //   Object.keys(FieldData.Dimensions).map((key, Index) => resultData[key])
    // );

    return (
      <div className="main_container">
        <div
          className={
            resultStatus ? "search_components_results" : "search_components"
          }
          // className="search_components"
        >
          {/* {scan ? (
            <QrReader
              delay={delay}
              // style={previewStyle}
              className="scanner"
              onError={this.handleError}
              onScan={this.handleScan}
              facingMode={"environment"}
              // showViewFinder={false}
            />
          ) : (
            <></>
          )} */}
          {/* {search ? ( */}
          <div className="main_logo">
            <img
              className={
                resultStatus
                  ? resultData.Brand === "Kwiat"
                    ? "kwiat"
                    : "fred"
                  : "kwiat"
              }
              src={
                resultStatus
                  ? resultData.Brand === "Kwiat"
                    ? Kwiat
                    : Fred
                  : Kwiat
              }
            ></img>
          </div>
          <div
            // className={resultStatus ? "search_box h_100" : "search_box"}
            className="search_box"
          >
            {!resultStatus ? <label>Enter Serial #</label> : <></>}
            <input
              id="searchBox"
              type="text"
              autoComplete="off"
              onChange={(e) => {
                this.setState({ searchValue: e.target.value });
                //                 if (e.target.value.length >= 20) {
                //                   // console.log("greater than 20");
                //                   this.handleGetData(e.target.value);
                //                 }
              }}
              onKeyPress={(e) => {
                // console.log("key pressed: ", e.key);
                // console.log("value: ", e.target.value);
                if (e.target.value && e.key === "Enter") {
                  // console.log("Okay");
                  this.handleGetData(e.target.value);
                }
              }}
              value={searchValue}
              placeholder={resultStatus && "Enter Serial...."}
            />
            <button
              onClick={() => this.handleGetData(searchValue)}
              // onClick={() => setShowLoader(true)}
              // onClick={Error}
            >
              SEARCH
            </button>
          </div>
          {/* ) : (
            <></>
          )} */}
        </div>
        {/* <p className={scan ? "result" : ""}>{result}</p> */}
        {resultStatus ? (
          <div
            className="item_container"
            // className={
            //   resultStatus
            //     ? "item_container op_1 pos_relative"
            //     : "item_container op_0"
            // }
          >
            <div className="item">
              {/* <div className="logo">
                <img
                  className={resultData.Brand === "Kwiat" ? "kwiat" : "fred"}
                  src={resultData.Brand === "Kwiat" ? Kwiat : Fred}
                ></img>
              </div> */}
              <div className="item_description">
                {resultData.Collection || resultData.ShortDescription ? (
                  <div className="collection_itemName">
                    <label className="collection">
                      {resultData.Collection}
                    </label>
                    <label className="itemName">
                      {resultData.ShortDescription}
                    </label>
                  </div>
                ) : (
                  <></>
                )}
                <div className="retail_price">
                  <label>
                    {(resultData.RetailPrice &&
                      currencyFormatter.format(`${resultData.RetailPrice}`, {
                        code: "USD",
                        precision: 0,
                      })) ||
                      ""}
                  </label>{" "}
                  USD
                </div>
                <div className="serial_no">
                  <label>SERIAL NUMBER: </label>
                  <label>{resultData.SerialNumber}</label>
                </div>
                <div className="style_no">
                  <label>STYLE NUMBER: </label>
                  <label>{resultData.StyleNumber}</label>
                </div>
              </div>
              {/* <div className="item_image">
              <ImageGallery
                items={this.handleImageGallery()}
                showFullscreenButton={false}
                showPlayButton={false}
                showNav={false}
                onErrorImageURL="https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Missing-Images-Final-100x75px-01.svg"
              
              {/* <img src={this.handleImage(resultData)} /> 
            </div>
            {/* <div> Serial Number: {resultData.SerialNumber} </div>
              <div> Inventory ID: {resultData.InventoryID} </div>
              <div>
                Retail Price: {formatter.format(resultData.RetailPrice)}
              </div> */}
              <div className="fields">
                <Accordion
                  flush
                  onClick={(e) => {
                    // console.log("target : ", e);
                    // console.log("e : ", e.target.id);
                    if (e.target.id && e.target.id !== "Center Diamond") {
                      // console.log(
                      //   "el : ",
                      //   document.getElementById(e.target.id).nextSibling
                      //     .className
                      // );
                      const id = e.target.id;
                      const el = document.getElementById(e.target.id);
                      const clsname = document.getElementById(e.target.id)
                        .nextSibling.className;
                      // window.scroll({
                      //   top: 2 * e.pageY,
                      //   left: 0,
                      //   behavior: "smooth",
                      // });
                      if (clsname === "accordion-collapse collapse") {
                        // el.scrollIntoView({behavior:smooth});
                        $([document.documentElement, document.body]).animate({
                          scrollTop: $(`#${id}`).offset().top,
                        });

                        // $("html,body").scrollTo(`#${id}`);
                      }
                    }
                  }}
                >
                  {this.handleImageGallery().length !== 0 ? (
                    <Accordion.Item eventKey="0">
                      <Accordion.Button id="Images">IMAGES</Accordion.Button>
                      <Accordion.Body>
                        <div className="item_image">
                          <ImageGallery
                            items={this.handleImageGallery()}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            showNav={false}
                            onErrorImageURL="https://cdn.kwiat.com/apps/kwiat-elastic-search/icons/Missing-Images-Final-100x75px-01.svg"
                          />
                          {/* <img src={this.handleImage(resultData)} /> */}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : (
                    <></>
                  )}
                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.GeneralData)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="1">
                        <Accordion.Button
                          id="General"
                          // onClick={() => this.scrollToTop("1")}
                        >
                          GENERAL INFORMATION
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.GeneralData).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.GeneralData[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.Description)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="2">
                        <Accordion.Button id="Description">
                          DESCRIPTION
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.Description).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.Description[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.RingDetail)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="3">
                        <Accordion.Button id="Ring">
                          RING DETAILS
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.RingDetail).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.RingDetail[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.DiamondDetail)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="4">
                        <Accordion.Button id="Diamond">
                          DIAMOND DETAIL
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.DiamondDetail).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.DiamondDetail[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : resultData.transformType === "DiamondSerial" ? (
                    Object.keys(DiamondFieldData.DiamondDetail)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="4">
                        <Accordion.Button id="Diamond">
                          DIAMOND DETAIL
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(DiamondFieldData.DiamondDetail).map(
                            (key, Index) => {
                              if (resultData[key] && key !== "StoneCulet") {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {
                                        DiamondFieldData.DiamondDetail[key]
                                          .label
                                      }
                                      :
                                    </label>
                                    <label>
                                      {key === "DiamondCaratWeight"
                                        ? `${Number(resultData[key]).toFixed(
                                            2
                                          )}cts`
                                        : key === "GIAReportDate"
                                        ? moment(
                                            new Date(`${resultData[key]}`)
                                          ).format("MM/DD/YYYY")
                                        : resultData[key]}
                                    </label>
                                  </div>
                                );
                              } else if (key === "StoneCulet") {
                                return (
                                  <>
                                    <div className="field_data" key={key}>
                                      <label>
                                        {
                                          DiamondFieldData.DiamondDetail[key]
                                            .label
                                        }
                                        :
                                      </label>
                                      <label>
                                        {key === "DiamondCaratWeight"
                                          ? `${Number(resultData[key]).toFixed(
                                              2
                                            )}cts`
                                          : key === "GIAReportDate"
                                          ? moment(
                                              new Date(`${resultData[key]}`)
                                            ).format("MM/DD/YYYY")
                                          : resultData[key]}
                                      </label>
                                    </div>
                                    <div className="field_data">
                                      <label>
                                        {/* {DiamondFieldData.DiamondDetail[key].label} */}
                                        Measurements:
                                      </label>
                                      <label>
                                        {resultData.Length && resultData.Length}{" "}
                                        {resultData.Length ? "x" : ""}{" "}
                                        {resultData.Width}{" "}
                                        {resultData.Width && resultData.Depth
                                          ? "x"
                                          : ""}{" "}
                                        {resultData.Depth}
                                      </label>
                                    </div>
                                  </>
                                );
                              } else return <></>;
                            }
                          )}
                          {/* {Object.keys(DiamondFieldData.Measurements)
                            .map((key, Index) => resultData[key])
                            .filter(
                              (value) => ![undefined, null, ""].includes(value)
                            ).length !== 0 ? (
                            <div className="field_data">
                              <label>
                                {/* {DiamondFieldData.DiamondDetail[key].label} 
                                Measurements:
                              </label>
                              <label>
                                {resultData.Length} x {resultData.Width} x{" "}
                                {resultData.Depth}
                              </label>
                            </div>
                          ) : (
                            <></>
                          )} */}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : resultData.transformType === "GemstoneSerial" ? (
                    Object.keys(GemStoneFieldData.DiamondDetail)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="4">
                        <Accordion.Button id="Diamond">
                          GEMSTONE DETAIL
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(GemStoneFieldData.DiamondDetail).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {
                                        GemStoneFieldData.DiamondDetail[key]
                                          .label
                                      }
                                      :
                                    </label>
                                    <label>
                                      {key === "DiamondCaratWeight" ||
                                      key === "CaratWeight"
                                        ? `${Number(resultData[key]).toFixed(
                                            2
                                          )}cts`
                                        : key === "GIAReportDate"
                                        ? moment(
                                            new Date(`${resultData[key]}`)
                                          ).format("MM/DD/YYYY")
                                        : resultData[key]}
                                    </label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                          {Object.keys(GemStoneFieldData.Measurements)
                            .map((key, Index) => resultData[key])
                            .filter(
                              (value) => ![undefined, null, ""].includes(value)
                            ).length !== 0 ? (
                            <div className="field_data">
                              <label>
                                {/* {DiamondFieldData.DiamondDetail[key].label} */}
                                Measurements:
                              </label>
                              <label>
                                {resultData.Length}{" "}
                                {resultData.Length ? "x" : ""}{" "}
                                {resultData.Width}{" "}
                                {resultData.Width && resultData.Depth
                                  ? "x"
                                  : ""}{" "}
                                {resultData.Depth}
                              </label>
                            </div>
                          ) : (
                            <></>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.ColorDetail)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="5">
                        <Accordion.Button id="Color">
                          COLOR DETAIL
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.ColorDetail).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.ColorDetail[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.CenterInfo)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="6">
                        <Accordion.Button id="Center Diamond">
                          CENTER DIAMOND INFO
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.CenterInfo).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.CenterInfo[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {resultData.transformType !== "DiamondSerial" &&
                  resultData.transformType !== "GemstoneSerial" ? (
                    Object.keys(FieldData.Dimensions)
                      .map((key, Index) => resultData[key])
                      .filter((value) => ![undefined, null, ""].includes(value))
                      .length !== 0 ? (
                      <Accordion.Item eventKey="7">
                        <Accordion.Button id="Dimensions">
                          DIMENSIONS
                        </Accordion.Button>
                        <Accordion.Body>
                          {Object.keys(FieldData.Dimensions).map(
                            (key, Index) => {
                              if (resultData[key]) {
                                return (
                                  <div className="field_data" key={key}>
                                    <label>
                                      {FieldData.Dimensions[key].label}:
                                    </label>
                                    <label>{resultData[key]}</label>
                                  </div>
                                );
                              } else return <></>;
                            }
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                  {Object.keys(FieldData.CertifiedDiamondReports)
                    .map((key, Index) => resultData[key])
                    .filter((value) => ![undefined, null, ""].includes(value))
                    .length !== 0 ? (
                    <Accordion.Item eventKey="8">
                      <Accordion.Button id="Certificate">
                        CERTIFIED DIAMOND REPORT
                      </Accordion.Button>
                      <Accordion.Body>
                        {/* {Object.keys(FieldData.CertifiedDiamondReports).map(
                        (key, Index) => {
                          if (resultData[key]) {
                            return (
                              <div className="field_data" key={key}>
                                <label>
                                  {FieldData.CertifiedDiamondReports[key].label}{" "}
                                  :
                                </label>
                                <label>{resultData[key]}</label>
                              </div>
                            );
                          } else return <></>;
                        }
                      )} */}
                        {this.handleReports("jpg").map((jpg, index) => (
                          <img
                            className="report_img"
                            src={jpg}
                            onClick={() =>
                              window.open(
                                this.handleReports("pdf")[index],
                                "_blank"
                              )
                            }
                          />
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : (
                    <></>
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* {error ? <p className={scan ? "result" : ""}> {errorMsg} </p> : <></>} */}
        {/* {!scan ? (
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
        )} */}
      </div>
    );
  }
}

export default withRouter(QRContainer);
