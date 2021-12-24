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
  const init = {
    headers: {
      Authorization: `Basic ${CredentialsBase64}`,
    },
  };
  let response;
  for (let i = 0; i < appNameData.length; i++) {
    // appName = appNameData[i];
    let urlFetch = `https://${AppUrl}/${appNameData[i]}/_doc/${params.id}/_source`;

    if (params.id.toString().length > 15) {
      urlFetch = `https://${AppUrl}/${appNameData[i]}/_search?q=RFIDValue : ${params.id}`;
    }
    response = await fetch(urlFetch, init);
    if (response.status === 200) {
      //       console.log("response :", response);
      //       console.log(response.status, " - ", response.statusText);
      let results = await gatherResponse(response);
      let updatedResults = JSON.parse(results);
      if (appNameData[i] === DiamondSerialApp && updatedResults.LabReportNbr) {
        const destinationURL = `https://cdn.kwiat.com/kwiat/certs-pdfs/${updatedResults.LabReportNbr}.pdf`;
        const statusCode = 301;
        //                 return Response.redirect(destinationURL, 301)
        return new Response(JSON.stringify({ destinationURL, status: 200 }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        });
      }
      if (urlFetch.includes("RFIDValue")) {
        let results = updatedResults.hits.hits[0]._source;
        return new Response(
          JSON.stringify({ results, status: 200, type: "RFID" }),
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          }
        );
      }
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      // const html = `<!DOCTYPE html>
      //           <body>
      //             <div style="text-align: left; width:100%;" >
      //               <div style="text-align:center;max-width:100%;font-size:40px">
      //                 <div style="width:100%;">
      //                   <img
      //                      style="width:80%;"
      //                      src=${handleImage(updatedResults)}
      //                    />
      //                 </div>
      //                 <div> Serial Number : ${
      //                   updatedResults.SerialNumber
      //                 } </div>
      //                 <div>Inventory ID : ${updatedResults.InventoryID}</div>
      //                 <div>Retail Price : ${formatter.format(
      //                   updatedResults.RetailPrice
      //                 )}</div>
      //               </div>
      //             </div>
      //           </body>`;
      //     return new Response(`The id : ${ JSON.stringify(productType) }\n\nresult : ${results} \n\n ${typeof results}`, {
      //         headers: {
      //             "content-type": "application/json;charset=UTF-8"
      //         }
      //     })
      //             return new Response(html, {
      //                 headers: {
      //                     "content-type": "text/html;charset=UTF-8",
      //                 },
      //             });
      return new Response(JSON.stringify({ results, status: 200 }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
  }
  for (let i = 0; i < appNameData.length; i++) {
    let urlFetch = `https://${AppUrl}/${appNameData[i]}/_search?q=SerialNumber : ${params.id}`;
    response = await fetch(urlFetch, init);
    if (response.status === 200) {
      //       console.log("response :", response);
      //       console.log(response.status, " - ", response.statusText);
      let results = await gatherResponse(response);
      let updatedResults = JSON.parse(results);

      if (updatedResults.hits.hits.length !== 0) {
        results = updatedResults.hits.hits[0]._source;
        //       results = updatedResults.hits
        return new Response(
          JSON.stringify({ results, status: 200, type: "RFID", response }),
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          }
        );
      }
      return new Response(
        JSON.stringify({ response, updatedResults, results }),
        {
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    }
  }
  let results = await gatherResponse(response);
  return new Response(JSON.stringify(results), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
};
