async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}



export const onRequestGet = async (context) => {
  let {url} = context.request
  let {param} = context 
//   let request =  JSON.strigyfy(context.request)
   const init = {
    headers: {
      "Authorization":
          "Basic c3Nra0hocnYyOjg1NWM2ZTA3LTc5NjctNGM1Yi1iZjliLTBmOWRmZDFhY2FhYg==",
    },
  }
  const urlFetch = "https://es-cluster-kwfl-acumatica-catalog-v7-536qcv.searchbase.io/kwfl-acumatica-catalog-v7-prod-jewelrystyle2testing/_search?q=InventoryDBID : 57126"
   const response = await fetch(urlFetch, init)
  const results = await gatherResponse(response)
  
  return new Response(`url :${url}\n context :${JSON.stringify(context)}`,{headers:{"Content-Type":"application/json"}})
//   return new Response(results)
}


// POST requests to /filename with a JSON-encoded body would return "Hello, <name>!"
// export const onRequestPost = async ({ request }) => {
//   const { name } = await request.json()
//   return new Response(`Hello, ${name}!`)
// }
