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
      const html = `<!DOCTYPE html>
                <body>
                  <div style="text-align: left; width:505px;" >
                    <div style="text-align:center;max-width:600px;max-height: 600px;" >
                      <div style="width:100%;">
                        <img
                           style="width:50%;"
                           src=${handleImage(updatedResults)}
                         />
                      </div>
                      ${
                        updatedResults.Description
                          ? `<div style="margin-top:10px;">${updatedResults.Description}</div>`
                          : ``
                      }
                      ${
                        updatedResults.SerialNumber ||
                        updatedResults.StyleNumber
                          ? `<div>
                          ${
                            updatedResults.StyleNumber &&
                            updatedResults.SerialNumber
                              ? updatedResults.StyleNumber +
                                " | " +
                                updatedResults.SerialNumber
                              : updatedResults.StyleNumber
                              ? updatedResults.StyleNumber
                              : updatedResults.SerialNumber
                              ? updatedResults.SerialNumber
                              : ``
                          }
                        </div>`
                          : ``
                      }
                      ${
                        updatedResults.Metal
                          ? `<div>${updatedResults.Metal}</div>`
                          : ``
                      }
                      ${
                        updatedResults.DiamondCarats ||
                        updatedResults.Color ||
                        updatedResults.Clarity ||
                        updatedResults.ColorCarats
                          ? `<div>${
                              updatedResults.DiamondCarats
                                ? ` ${updatedResults.DiamondCarats} carats,`
                                : ""
                            }
                          ${
                            updatedResults.Color
                              ? ` ${updatedResults.Color} color,`
                              : ""
                          }
                          ${
                            updatedResults.Clarity
                              ? ` ${updatedResults.Clarity} clarity.`
                              : ""
                          } 
                          ${
                            updatedResults.ColorCarats
                              ? `${updatedResults.ColorCarats} carats.`
                              : ""
                          }</div>`
                          : ``
                      }
                    </div>
                  </div>
                </body>`;
      //     return new Response(`The id : ${ JSON.stringify(productType) }\n\nresult : ${results} \n\n ${typeof results}`, {
      //         headers: {
      //             "content-type": "application/json;charset=UTF-8"
      //         }
      //     })
      return new Response(`${html}\n\n ${JSON.stringify(updatedResults)}`, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  }
  return new Response(
    `The id : ${JSON.stringify(params)}\n\n${JSON.stringify(response)}`,
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );
};
