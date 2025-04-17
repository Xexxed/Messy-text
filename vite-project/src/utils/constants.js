export const HOST = import.meta.env.VITE_HOST || "http://localhost:9001";
export const AUTH_ROUTES = "api/auth";
export const SIGNUP = `${AUTH_ROUTES}/signup`;
export const LOGIN = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO = `${AUTH_ROUTES}/update-user-info`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;
