//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

//All GET requests
describe('GET REQUESTS', () => {
      it('/', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/features', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/login', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/logout', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/duework', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/duework/create', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/subjects', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/subjects/create', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/signup', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/auth/google', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/app/auth/google/callback', (done) => {
        chai.request(server)
            .get('/features')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/404 - 404 PAGE', (done) => {
        chai.request(server)
            .get('/404')
            .end((err, res) => {
                  res.should.have.status(404);
              done();
            });
      });
});

describe('POST Requests', () => {
    it('Login to App', () => {
        let loginInfo = {
            username: "TestUser",
            password: "Test"
        }
        chai.request(server)
        .post('/app/login')
        .send(loginInfo)
        .end((err, res) => {
            res.should.have.status(200);
        done();
        });
    });
});

describe('AJAX Requests', () => {
    it('/ajax/duework/change', (done) => {
        chai.request(server)
            .get('/ajax/duework/change')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
    });
    it('/ajax/duework/remove', (done) => {
        chai.request(server)
            .get('/ajax/duework/remove')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/ajax/duework/edit', (done) => {
        chai.request(server)
            .get('/ajax/duework/edit')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('/ajax/subjects/remove', (done) => {
        chai.request(server)
            .get('/ajax/subjects/remove')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
});