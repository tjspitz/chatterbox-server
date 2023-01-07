/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status. --> block of conditionals
  var statusCode = 200;

  // See the note below about CORS headers.
  // Headers is an object that contain keys to allow for cross-origin resource sharing
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // this must have something to do with AJAX request attribute content-type
  // probably need to change this to parsable stringified JSON
  headers['Content-Type'] = 'application/json';  // application/json

// for GET
var body = [];
request.on('error', () => {
  statusCode = 404;
  console.log('Error');
}).on('data', (bit) => {
  body.push(bit);
}).on('end', () => {
  body = Buffer.concat(body).toString();
})

// for POST


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // this gives a "preview" to the response of the server (includes statusCode and header information {content-type and CORS access})

  // most likely will need an if statement to change the arguments for write head dependent on the data
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // this signals to the server that all of the response headers and body have been sent => server should consider this message to be complete
  response.end(JSON.stringify(responseBody));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;

/*
we want access to the method/verb (i.e. GET) and url (i.e. /classes/messages) props (Node puts them on the request obj)
  request emits an 'error' if there is a problem, so... `request.on('error', (err) => {do something})`

REQUEST: method, url, headers

STATUS CODE: several conditions to set it properly?


it('Should send back parsable stringified JSON') --> ??? body = Buffer.concat(body).toString();

it('Should send back an array') --> let body = [];
                                      request.on('data', (chunk) => {
                                        body.push(chunk);
                                        // at this point, `body` has the entire request body stored in it as a string

*/