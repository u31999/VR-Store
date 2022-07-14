import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderAction'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import axios from 'axios'
import {PayPalButton} from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVERED_RESET } from '../constants/orderConstant'

const OrderScreen = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()

    const [sdkReady, setSdkReady] = useState(false)

    const orderId = params.id

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    if(!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
            }

        order.itemsPrice = addDecimals(
        order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    } 

    useEffect(()=> {
        if(!userInfo) {
            navigate('/login')
        }

        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            
            document.body.appendChild(script)
        }


        if(!order || successPay || order._id !== orderId || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVERED_RESET})
            dispatch(getOrderDetails(orderId))
        } else if(!order.isPaid) {
            if(!window.paypal) {
                addPaypalScript()
            } else {
                setSdkReady(true)
            }
        }

    }, [dispatch, order, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)

        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

  return loading ? <Loader /> 
    : error 
    ? <Message variant='danger'>{error}</Message>
    : <>
        <h1>Order {order._id}</h1>

    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                    <strong>Name: </strong> {order.user.name}
                    </p>
                    <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}  
                    </a>
                    </p>
                    <p>
                        <strong>Address: </strong>
                        {order.shippingAddress.address}, 
                        {order.shippingAddress.city}, 
                        {order.shippingAddress.postalCode}, 
                        {order.shippingAddress.country}
                    </p>

                    {
                order.isDeleverd
                ? <Message variant='success'>Delivered on {order.deleverdAt}</Message>
                : <Message variant='danger'>Not Delivered</Message>
                }
                    
                </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                <strong>Method: </strong>
                {order.paymentMethod}
                </p>
                {
                order.isPaid 
                ? <Message variant='success'>Paid on {order.paidAt}</Message>
                : <Message variant='danger'>Not Paid</Message>
                }
            
            </ListGroup.Item>

            <ListGroup.Item>
                <h2>Order Item</h2>
                {order.orderItems.length === 0 
                ? <Message>Order is Empty</Message>
                : (
                    <ListGroup variant='flush'>
                        {order.orderItems.map((item, i) => (
                            <ListGroup.Item key={i}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image}
                                        alt={item.name}
                                        fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${Number(item.qty * item.price).toFixed(2)}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) }
            </ListGroup.Item>
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton 
                                    amount={order.totalPrice}
                                    onSuccess={successPaymentHandler} />
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type='button' 
                                className='btn btn-block'
                                onClick={deliverHandler}>
                                    Mark As {!order.isDeleverd ? 'Delivered' : 'Not Delivered'}
                                </Button>
                            </ListGroup.Item>
                        )}
                        </ListGroup>
            </Card>

        </Col>
    </Row> 
    
    </>
  
}

export default OrderScreen
