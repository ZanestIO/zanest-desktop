const testHelpers = require('../../models/test/helpers/utils')

beforeEach(async () => {
   await testHelpers.cleanDatabase();
});