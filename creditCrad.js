import { all, call, put, takeLatest } from "redux-saga/effects"
import AsyncStorage from "@react-native-async-storage/async-storage"

// config
import { API_URL } from "../config/app"
import { setAccessToken } from "./loginRedux"
import { navigate } from "../navigation/NavigationService"
import { showMessage } from "react-native-flash-message"

// utils
import XHR from "src/utils/XHR"

//Types
const GET_PLAN_REQUEST = "SUBSCRIPTION_SCREEN/GET_PLAN_REQUEST"
const GET_PLAN_SUCCESS = "SUBSCRIPTION_SCREEN/GET_PLAN_SUCCESS"
const GET_PLAN_FAILURE = "SUBSCRIPTION_SCREEN/GET_PLAN_FAILURE"
const NEW_SUBSCRIPTION = "SUBSCRIPTION_SCREEN/NEW_SUBSCRIPTION"
const RESET = "SUBSCRIPTION_SCREEN/RESET"

const GET_CUSTOMERID_REQUEST = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_REQUEST"
const GET_CUSTOMERID_SUCCESS = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_SUCCESS"
const GET_CUSTOMERID_FAILURE = "SUBSCRIPTION_SCREEN/GET_CUSTOMERID_FAILURE"

const POST_SUBSCRIPTION_REQUEST =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_REQUEST"
const POST_SUBSCRIPTION_SUCCESS =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_SUCCESS"
const POST_SUBSCRIPTION_FAILURE =
  "SUBSCRIPTION_SCREEN/POST_SUBSCRIPTION_FAILURE"
const PAYMENT_SUBSCRIPTION_REQUEST =
  "SUBSCRIPTION_SCREEN/PAYMENT_SUBSCRIPTION_REQUEST"

const initialState = {
  requesting: false,
  getPlanSuccess: false,
  getPlanFailure: false,

  cIRequesting: false,
  getCISuccess: false,
  getCIFailure: false,

  SRequesting: false,
  getSubscription: false,
  getSubscriptionError: false,
  subscriptionData: false,
  subRequesting: false
}

//Actions
export const getPlanRequest = data => ({
  type: GET_PLAN_REQUEST,
  data
})

export const getPlanSuccess = data => ({
  type: GET_PLAN_SUCCESS,
  data
})

export const getPlanFailure = error => ({
  type: GET_PLAN_FAILURE,
  error
})

export const getCustomerIdRequest = data => ({
  type: GET_CUSTOMERID_REQUEST,
  data
})

export const getCustomerIdSuccess = data => ({
  type: GET_CUSTOMERID_SUCCESS,
  data
})

export const getCustomerIdFailure = error => ({
  type: GET_CUSTOMERID_FAILURE,
  error
})

export const postSubscriptionRequest = data => ({
  type: POST_SUBSCRIPTION_REQUEST,
  data
})

export const postSubscriptionSuccess = data => ({
  type: POST_SUBSCRIPTION_SUCCESS,
  data
})

export const postSubscriptionFailure = error => ({
  type: POST_SUBSCRIPTION_FAILURE,
  error
})

export const newSubScription = data => ({
  type: NEW_SUBSCRIPTION,
  data
})

export const paymentSubscriptionRequest = data => ({
  type: PAYMENT_SUBSCRIPTION_REQUEST,
  data
})

export const reset = () => ({
  type: RESET
})

//Reducers
export const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAN_REQUEST:
      return {
        ...state,
        subRequesting: true
      }

    case GET_PLAN_SUCCESS:
      return {
        ...state,
        getPlanSuccess: action.data,
        subRequesting: false
      }
    case GET_PLAN_FAILURE:
      return {
        ...state,
        getPlanFailure: action.error,
        subRequesting: false
      }

    case GET_CUSTOMERID_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case GET_CUSTOMERID_SUCCESS:
      return {
        ...state,
        getCISuccess: action.data,
        requesting: false
      }
    case GET_CUSTOMERID_FAILURE:
      return {
        ...state,
        getCIFailure: action.error,
        requesting: false
      }

    case POST_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        requesting: true
      }

    case POST_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        getSubscription: action.data,
        requesting: false
      }
    case POST_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        getSubscriptionError: action.error,
        requesting: false
      }

    case NEW_SUBSCRIPTION:
      return {
        ...state,
        subscriptionData: action.data
      }

    case RESET:
      return {
        ...state,
        requesting: false
      }

    default:
      return state
  }
}

//Saga
async function getPlanAPI() {
  const URL = `${API_URL}/subscription/plans/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }
  return XHR(URL, options)
}

function* getFeeds() {
  try {
    const response = yield call(getPlanAPI)
    const activeFilteredData = response.data.filter(
      data => data.product_details.active
    )
    yield put(getPlanSuccess(activeFilteredData))
  } catch (e) {
    const { response } = e
    yield put(getPlanFailure(e))
  } finally {
    yield put(getPlanFailure())
  }
}

//Saga
async function getCustomerIdAPI() {
  const URL = `${API_URL}/payment/get_customer_id/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    }
  }
  return XHR(URL, options)
}

function* getCustomerId() {
  try {
    const response = yield call(getCustomerIdAPI)

    yield put(getCustomerIdSuccess(response.data.data))
  } catch (e) {
    const { response } = e

    yield put(getCustomerIdFailure(e))
  }
}

//Saga

async function addSubscriptionCardAPI(data) {
  const URL = `${API_URL}/subscription/create_card/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }
  return XHR(URL, options)
}
function* addSubscriptionCard({ data }) {
  try {
    const response = yield call(addSubscriptionCardAPI, data)
    yield put(paymentSubscriptionRequest(data))
  } catch (e) {
    showMessage({
      message: "something went wrong",
      type: "error"
    })
    const { response } = e
    // yield put(postSubscriptionFailure(e))
  } finally {
    yield put(reset())
  }
}
//api call function
async function paymentSubscriptionAPI(payload) {
  const data = { price_id: payload.plan_id, premium_user: payload.premium_user }
  const URL = `${API_URL}/subscription/create_subscription/`
  const token = await AsyncStorage.getItem("authToken")
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token  ${token}`
    },
    data
  }
  return XHR(URL, options)
}
//assign CSV programs
async function submitQuestionAPI() {
  const token = await AsyncStorage.getItem("authToken")
  const URL = `${API_URL}/form/set_program/`
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    },
    method: "POST"
  }
  return XHR(URL, options)
}
//generator function
function* paymentSubscription({ data }) {
  try {
    const response = yield call(paymentSubscriptionAPI, data)
    navigate("Feeds")
    showMessage({
      message: "Card added successfully",
      type: "success"
    })
    yield submitQuestionAPI()
    yield put(newSubScription(response.data))
  } catch (e) {
    const { response } = e
  } finally {
    yield put(reset())
  }
}

export default all([
  takeLatest(GET_PLAN_REQUEST, getFeeds),
  takeLatest(GET_CUSTOMERID_REQUEST, getCustomerId),
  takeLatest(POST_SUBSCRIPTION_REQUEST, addSubscriptionCard),
  takeLatest(PAYMENT_SUBSCRIPTION_REQUEST, paymentSubscription)
])
