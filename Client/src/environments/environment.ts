// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  context_root: '/',
  baseUrl: 'http://localhost:3000/',
  servlet_endpoint: {
    getAllSection: 'route/section',
    mailOtpGenerator: 'route/mailOtp',
    registration: 'route/registration',
    login: 'route/login',
    getUserDetails: 'route/getUserDetails',
    saveTransaction: 'route/saveTransaction',
    getDateRange: 'route/getDateRange',
    getTransaction: 'route/getTransaction',
  },
};
