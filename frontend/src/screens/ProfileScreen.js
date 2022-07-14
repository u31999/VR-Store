import {useState, useEffect} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col, Table} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getUserDetails, updateUserProfile} from '../actions/usersAction'
import {listMyOrder} from '../actions/orderAction'

const ProfileScreen = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    const userLogin  = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [success, setSuccess] = useState(false)


    useEffect(()=> {
        if(!userInfo) {
            navigate('/login')
        } else {
            if(!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrder())
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch ,navigate, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()

        if(password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserProfile({id: user._id, name, email, password}))
            setSuccess(true)
        }
    }

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>
    {message && <Message variant='danger'>{message}</Message>}
    {error && <Message variant='danger'>{error}</Message>}
    {success && <Message variant='success'>Profile Updated</Message>}
    {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' 
                palceholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' 
                palceholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                <Form.Label>Password Address</Form.Label>
                <Form.Control type='password' 
                palceholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

             <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' 
                palceholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Update
            </Button>
        </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? <Loader /> 
            : errorOrders ? <Message variant='danger'>{errorOrders}</Message>
            : ( <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>{order.isPaid ? order.paidAt.substring(0, 10) : (
                                <i className='fas fa-times' 
                                style={{color: 'red'}}></i>
                            )}</td>
                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (
                                <i className='fas fa-times' 
                                style={{color: 'red'}}></i>
                            )}</td>
                            <td>
                                <LinkContainer to={`/orders/${order._id}`}>
                                    <Button variant='light' className='btn-sm'>Details</Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>)}
        </Col>
    </Row>
  )
}

export default ProfileScreen
