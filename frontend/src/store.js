import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer } from './reducer/productReducer'
import { cartReducer } from './reducer/cartReducer'
import {userLoginReducer, userRegisterReducer, 
    userDetailsReducer, userUpdateProfileReducer} from './reducer/usersReducer'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer
})

const cartItemsFromStorge = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const userInfoFromStorge = localStorage.getItem('userInfo') 
? JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorge = localStorage.getItem('shippingAddress') 
? JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorge,
    shippingAddress: shippingAddressFromStorge },
    userLogin: {userInfo: userInfoFromStorge}
}
const middleware = [thunk] 

const store = createStore(reducer, initialState, 
    composeWithDevTools(applyMiddleware(...middleware)))

export default store