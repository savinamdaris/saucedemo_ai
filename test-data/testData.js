export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce'
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce'
  }
};

export const invalidUsers = [
  {
    username: 'invalid_user',
    password: 'invalid_password',
    expectedError: 'Username and password do not match any user in this service'
  },
  {
    username: '',
    password: 'secret_sauce',
    expectedError: 'Username is required'
  },
  {
    username: 'standard_user',
    password: '',
    expectedError: 'Password is required'
  }
];

export const checkoutInfo = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  invalid: [
    {
      firstName: '',
      lastName: 'Doe',
      postalCode: '12345',
      expectedError: 'Error: First Name is required'
    },
    {
      firstName: 'John',
      lastName: '',
      postalCode: '12345',
      expectedError: 'Error: Last Name is required'
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '',
      expectedError: 'Error: Postal Code is required'
    }
  ]
};

export const products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTShirt: 'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
  onesie: 'sauce-labs-onesie',
  redTShirt: 'test.allthethings()-t-shirt-(red)'
};

export const sortOptions = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo'
};
