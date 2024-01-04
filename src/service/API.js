import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const serverUrl = 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: serverUrl,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;


// export const onRegister = (body, onResponse, onError) => {
//   axios({
//     method: 'POST',
//     url: `${BASE_URL}registertest`,
//     data: body,
//     headers: headers,
//   })
//     .then(function (response) {
//       onResponse(response.data);
//     })
//     .catch(error => {
//       console.warn(error);
//       onError(error.response);
//     });
// };

// export const onVerifyOtp = (body, onResponse, onError) => {
//   axios({
//     method: 'POST',
//     url: `${BASE_URL}verifyOtp`,
//     data: body,
//     headers: headers,
//   })
//     .then(function (response) {
//       onResponse(response.data);
//     })
//     .catch(error => {
//       onError(error.response);
//     });
// };

// export const inviteFriend = (body, onResponse, onError) => {
//   axios({
//     method: 'POST',
//     url: `${BASE_URL}invite-friends`,
//     data: body,
//     headers: headers,
//   })
//     .then(function (response) {
//       onResponse(response.data);
//     })
//     .catch(error => {
//       onError(error);
//     });
// };
