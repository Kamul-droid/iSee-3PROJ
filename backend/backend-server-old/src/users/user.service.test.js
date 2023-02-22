const assert = require('assert/strict');
const sinon = require('sinon');
const service = require('./user.service');
const { User } = require('./user.schema');
const {
  describe, it, afterEach, beforeEach
} = require('mocha')
const mongoose = require('mongoose');

afterEach(() => {
  sinon.restore();
})

describe('userService', () => {

  describe('create', () => {
    it('should execute successfully', async () => {
      sinon.stub(User, 'create')
        .resolves({ toObject : () => 'data' })

      const res = await service.create({});

      assert.deepEqual(res, 'data');

      sinon.assert.calledOnce(User.create);
    })

    it('should fail when the query throws', async () => {
      sinon.stub(User, 'create')
        .throws('error')

      assert.rejects(
        async () => {
          await service.create({})
        }, 'error'
      )

      sinon.assert.calledOnce(User.create);
    })
  })

  describe('findAll', () => {

    beforeEach(() => {
      sinon.spy(User, 'find');
      sinon.spy(mongoose.Query.prototype, 'lean');

    })

    it('should execute successfully', async () => {
      sinon.stub(mongoose.Query.prototype, 'exec')
        .callsFake(async () => []);

      const res = await service.findAll({}, null, null);

      assert.deepEqual(res, []);
      sinon.assert.calledOnce(User.find);
      sinon.assert.calledOnce(mongoose.Query.prototype.lean);
    })

    it('should fail when the schame function throws', async () => {
      sinon.stub(mongoose.Query.prototype, 'exec')
        .throws('error')

      assert.rejects(
        async () => {
          await service.findAll({})
        }, 'error'
      )

      sinon.assert.calledOnce(User.find);
      sinon.assert.calledOnce(mongoose.Query.prototype.lean);
      sinon.assert.calledOnce(mongoose.Query.prototype.exec);
    })
  })

  describe('findOne', () => {

    beforeEach(() => {
      sinon.spy(User, 'findById');
      sinon.spy(mongoose.Query.prototype, 'lean');
    })

    it('should execute successfully', async () => {
      sinon.stub(mongoose.Query.prototype, 'exec')
        .callsFake(async () => 'data');

      const res = await service.findOne({});

      assert.deepEqual(res, 'data');
      sinon.assert.calledOnce(User.findById);
      sinon.assert.calledOnce(mongoose.Query.prototype.lean);
      sinon.assert.calledOnce(mongoose.Query.prototype.exec);
    })

    it('should fail when the query throws', async () => {
      sinon.stub(mongoose.Query.prototype, 'exec')
        .throws('error')

      assert.rejects(
        async () => {
          await service.findOne({})
        }, 'error'
      )

      sinon.assert.calledOnce(User.findById);
      sinon.assert.calledOnce(mongoose.Query.prototype.lean);
      sinon.assert.calledOnce(mongoose.Query.prototype.exec);
    })
  })

  describe('update', () => {
    it('should execute successfully', async () => {
      sinon.stub(User, 'findByIdAndUpdate')
        .resolves({ toObject : () => 'data' });

      const res = await service.update({});

      assert.deepEqual(res, 'data');
      sinon.assert.calledOnce(User.findByIdAndUpdate);
    })

    it('should fail when the query throws', async () => {
      sinon.stub(User, 'findByIdAndUpdate')
        .throws('error')

      assert.rejects(
        async () => {
          await service.update({})
        }, 'error'
      )

      sinon.assert.calledOnce(User.findByIdAndUpdate);
    })
  })

  describe('delete', () => {

    it('should execute successfully', async () => {
      sinon.stub(User, 'findByIdAndDelete')
        .callsFake(async () => {
          return 'data'
        });

      const res = await service.delete({});

      assert.deepEqual(res, 'data');
      sinon.assert.calledOnce(User.findByIdAndDelete);
    })

    it('should fail when the query throws', async () => {
      sinon.stub(User, 'findByIdAndDelete')
        .throws('error')

      assert.rejects(
        async () => {
          await service.delete({})
        }, 'error'
      )

      sinon.assert.calledOnce(User.findByIdAndDelete);
    })
  })
})
