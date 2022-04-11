async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes("application/text")) {
    return response.text();
  } else if (contentType.includes("text/html")) {
    return response.text();
  } else {
    return response.text();
  }
}

const handleImage = (item) => {
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
};

export const onRequestGet = async (context) => {
  let { params } = context;
  let {
    CredentialsBase64,
    JewelrySerialApp,
    DiamondSerialApp,
    GemstoneSerialApp,
    AppUrl,
  } = context.env;
  let appNameData = [JewelrySerialApp, DiamondSerialApp, GemstoneSerialApp];
  let init = {
    headers: {
      Authorization: `Basic ${CredentialsBase64}`,
    },
  };
  let rfidQuery = {
    // query: {
    //   multi_match: {
    //     query: params.id,
    //     fields: ["RFIDOldValue1", "RFIDOldValue2", "RFIDValue"],
    //   },
    // },

    query: {
      bool: {
        should: [
          // {
          //   term: {
          //     RFIDOldValue1: params.id,
          //   },
          // },
          // {
          //   term: {
          //     RFIDOldValue2: params.id,
          //   },
          // },
          {
            term: {
              RFIDValue: params.id,
            },
          },
        ],
      },
    },
  };
  // const rfidInit = {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Basic ${CredentialsBase64}`,
  //     "Content-Type": "application/json",
  //   },
  //   data: rfidQuery,
  // };
  let response;
  for (let i = 0; i < appNameData.length; i++) {
    // appName = appNameData[i];
    let urlFetch = `https://${AppUrl}/${appNameData[i]}/_doc/${params.id}/_source`;

    if (params.id.toString().length > 15) {
      // urlFetch = `https://${AppUrl}/${appNameData[i]}/_search?q=RFIDValue : ${params.id}`;
      urlFetch = `https://${AppUrl}/${appNameData[i]}/_search`;
      init = {
        method: "POST",
        headers: {
          Authorization: `Basic ${CredentialsBase64}`,
          "Content-Type": "application/json",
        },
        data: rfidQuery,
      };
    }
    // response = await fetch(urlFetch, init);
    response = await fetch(urlFetch, init);
    if (response.status === 200) {
      //       console.log("response :", response);
      //       console.log(response.status, " - ", response.statusText);
      let results = await gatherResponse(response);
      let updatedResults = JSON.parse(results);
      if (
        updatedResults.hits.hits.length !== 0 ||
        (updatedResults && updatedResults.transformType)
      ) {
        if (
          appNameData[i] === DiamondSerialApp &&
          updatedResults.LabReportNbr
        ) {
          const destinationURL = `https://cdn.kwiat.com/kwiat/certs-pdfs/${updatedResults.LabReportNbr}.pdf`;
          const statusCode = 301;
          //                 return Response.redirect(destinationURL, 301)
          return new Response(JSON.stringify({ destinationURL, status: 200 }), {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          });
        }
        // if (urlFetch.includes("RFIDValue"))
        // if (params.id.toString().length > 15) {
        // let results = updatedResults.hits.hits[0];
        let results = updatedResults.hits.hits[0]._source;
        return new Response(
          JSON.stringify({
            results,
            status: 200,
            type: "RFID",
            type2: "RF",
            response,
          }),
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          }
        );
        // }

        // if (params.id.toString().length >= 15) {
        //   return new Response(JSON.stringify({ results, status: 200 }), {
        //     headers: {
        //       "content-type": "application/json;charset=UTF-8",
        //     },
        //   });
        // }
      }
    }
    urlFetch = `https://${AppUrl}/${appNameData[i]}/_search?q=SerialNumber : ${params.id}`;
    response = await fetch(urlFetch, init);
    if (response.status === 200) {
      //       console.log("response :", response);
      //       console.log(response.status, " - ", response.statusText);
      let results = await gatherResponse(response);
      let updatedResults = JSON.parse(results);
      if (updatedResults && updatedResults.hits.hits.length !== 0) {
        if (
          appNameData[i] === DiamondSerialApp &&
          updatedResults.hits.hits[0]._source.LabReportNbr
        ) {
          const destinationURL = `https://cdn.kwiat.com/kwiat/certs-pdfs/${updatedResults.hits.hits[0]._source.LabReportNbr}.pdf`;
          const statusCode = 301;
          //                 return Response.redirect(destinationURL, 301)
          return new Response(JSON.stringify({ destinationURL, status: 200 }), {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          });
        }

        results = updatedResults.hits.hits[0]._source;
        //       results = updatedResults.hits
        return new Response(
          JSON.stringify({
            results,
            status: 200,
            type: "RFID",
            response,
          }),
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          }
        );
        // return new Response(
        //   JSON.stringify({
        //     response,
        //     updatedResults,
        //     results,
        //     text: "seraiall reply",
        //   }),
        //   {
        //     headers: {
        //       "content-type": "application/json;charset=UTF-8",
        //     },
        //   }
        // );
      }
      // return new Response(
      //   JSON.stringify({
      //     response,
      //     updatedResults,
      //     results,
      //     text: "seraiall reply",
      //   }),
      //   {
      //     headers: {
      //       "content-type": "application/json;charset=UTF-8",
      //     },
      //   }
      // );
    }
  }
  // for (let i = 0; i < appNameData.length; i++) {
  //   let urlFetch = `https://${AppUrl}/${appNameData[i]}/_search?q=SerialNumber : ${params.id}`;
  //   response = await fetch(urlFetch, init);
  //   if (response.status === 200) {
  //     //       console.log("response :", response);
  //     //       console.log(response.status, " - ", response.statusText);
  //     let results = await gatherResponse(response);
  //     let updatedResults = JSON.parse(results);
  //     if (
  //       appNameData[i] === DiamondSerialApp &&
  //       updatedResults.hits.hits.length !== 0 &&
  //       updatedResults.hits.hits[0]._source.LabReportNbr
  //     ) {
  //       const destinationURL = `https://cdn.kwiat.com/kwiat/certs-pdfs/${updatedResults.hits.hits[0]._source.LabReportNbr}.pdf`;
  //       const statusCode = 301;
  //       //                 return Response.redirect(destinationURL, 301)
  //       return new Response(JSON.stringify({ destinationURL, status: 200 }), {
  //         headers: {
  //           "content-type": "application/json;charset=UTF-8",
  //         },
  //       });
  //     }

  //     if (updatedResults.hits.hits.length !== 0) {
  //       results = updatedResults.hits.hits[0]._source;
  //       //       results = updatedResults.hits
  //       return new Response(
  //         JSON.stringify({
  //           results,
  //           status: 200,
  //           type: "RFID",
  //           response,
  //         }),
  //         {
  //           headers: {
  //             "content-type": "application/json;charset=UTF-8",
  //           },
  //         }
  //       );
  //     }
  //     // return new Response(
  //     //   JSON.stringify({ response, updatedResults, results }),
  //     //   {
  //     //     headers: {
  //     //       "content-type": "application/json;charset=UTF-8",
  //     //     },
  //     //   }
  //     // );
  //   }
  // }
  // let results = await gatherResponse(response);
  return new Response(
    JSON.stringify({
      response,
      // updatedResults,
      // results,
      // text: "seraiall reply",
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
};
