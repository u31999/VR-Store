import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link, useNavigate } from 'react-router-dom'
import {createOrder} from '../actions/orderAction'
import { useEffect } from 'react'

const PlaceOrderScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const {paymentMethod: {paymentMethod}} = cart

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
 
    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)

    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
    
    cart.totalPrice = (
        Number(cart.itemsPrice) + 
        Number(cart.shippingPrice) + 
        Number(cart.taxPrice)).toFixed(2)


    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    useEffect(()=> {
        if(success) {
            navigate(`/orders/${order._id}`)
        }

        // eslint-disable-next-line
    }, [navigate, success])

    const placeOrderHandler = () => {
        
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
        
    }


  return (
    <>
    <CheckoutSteps step1 step2 step3 step4 />
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Address: </strong>
                        {cart.shippingAddress.address}, {cart.shippingAddress
                        .city}, {cart.shippingAddress
                        .postalCode}, {cart.shippingAddress.country}
                    </p>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
                <h2>Order Item</h2>
                {cart.cartItems.length === 0 
                ? <Message>Your Cart is Empty</Message>
                : (
                    <ListGroup variant='flush'>
                        {cart.cartItems.map((item, i) => (
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button type='button' 
                            className='btn-block'
                            disabled={cart.cartItems === 0}
                            onClick={placeOrderHandler}>
                                Place Order
                            </Button>
                        </ListGroup.Item>
                        
                        </ListGroup>
            </Card>

        </Col>
    </Row> 
    </>
  )
}

export default PlaceOrderScreen
