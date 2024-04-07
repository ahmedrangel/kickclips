class JsResponse extends Response {
  constructor(body) {
    const jsonBody = JSON.stringify(body);
    const options = {
      headers: {
        "Content-Type": "text/javascript;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      }
    };
    super(jsonBody, options);
  }
}
export default JsResponse;