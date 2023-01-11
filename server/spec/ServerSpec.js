var handler = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');

describe('Node Server Request Listener Function', function() {
  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    expect(res._data).to.equal(undefined);
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data);
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('Should verify that multiple messages can be posted', function() {
    // Create stubMsg
    var stubMsg1 = {
      username: 'Tom',
      text: 'Tom says hi!'
    };

    var stubMsg2 = {
      username: 'Donna',
      text: 'Donna says hi!'
    };

    // POST stubMsg1
    var req = new stubs.request('/classes/messages', 'POST', stubMsg1);
    var res = new stubs.response();
    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(201);

    // POST stubMsg2
    var req = new stubs.request('/classes/messages', 'POST', stubMsg2);
    var res = new stubs.response();
    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(201);

    // GET all Messages
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();
    handler.requestHandler(req, res);
    expect(res._responseCode).to.equal(200);

    // Verify messages length
      // *** will include messages from previous two tests (aka the Jonahs)
    var messages = JSON.parse(res._data);
    expect(messages.length).to.equal(4);

    // Verify messages reflect stubMsg1 and stubMsg2
    expect(messages[2].username).to.equal('Tom');
    expect(messages[2].text).to.equal('Tom says hi!');

    expect(messages[3].username).to.equal('Donna');
    expect(messages[3].text).to.equal('Donna says hi!');

    expect(res._ended).to.equal(true);
  });

  // it('Should produce a status code of 501 if invalid method request', function() {
  //   req = new stubs.request('/classes/messages', 'DELETE');
  //   res = new stubs.response();
  //   handler.requestHandler(req, res);

  //   expect(res._responseCode).to.equal(501);
  //   expect(res._ended).to.equal(true);
  // })
});
