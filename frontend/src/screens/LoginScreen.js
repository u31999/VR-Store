import {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {login} from '../actions/usersAction'
import FormContainer from '../components/FormContainer'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)

    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[0] : '/'
    
    useEffect(()=> {
        if(userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

  return (
    <FormContainer>
    <h1>Sign In</h1>
    {error && <Message variant='danger'>{error}</Message>}
    {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' 
                palceholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}>
                </Form.Control>

                <Form.Group controlId='password'>
                <Form.Label>Password Address</Form.Label>
                <Form.Control type='password' 
                palceholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Sign In
            </Button>
        </Form>
        <Row className='py-3'>
            <Col>
                New Customer?{' '}
                <Link to={redirect && '/register'}>
                    Register
                </Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen
