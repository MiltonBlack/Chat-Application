import { create } from 'zustand';

export const useStore = create(set => ({
  token: null,
  getContect: [],
  phoneNumber: null,
  inviteRequestCode: null,
  uniqueId: null,
  countryCode: null,

  setphoneNumber: phoneNumber =>
    set(() => ({
      phoneNumber: phoneNumber,
    })),
  setcountryCode: countryCode =>
    set(() => ({
      countryCode: countryCode,
    })),
  setinviteRequestCode: inviteRequestCode =>
    set(() => ({
      inviteRequestCode: inviteRequestCode,
    })),
  setToken: token =>
    set(() => ({
      token: token,
    })),
  setContact: getContect =>
    set(() => ({
      getContect: getContect,
    })),
  setUniqueId: uniqueId =>
    set(() => ({
      uniqueId: uniqueId,
    })),
}));

export default () => {
  return [
    {
      token: useStore(state => state.token),
      getContect: useStore(state => state.getContect),
      phoneNumber: useStore(state => state.phoneNumber),
      getPhoneNumber: useStore(state => state.phoneNumber),
      countryCode: useStore(state => state.countryCode),
      uniqueId: useStore(state => state.uniqueId),
      inviteRequestCode: useStore(state => state.inviteRequestCode),
    },
  ];
};
