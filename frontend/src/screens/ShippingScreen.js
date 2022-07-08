import {useState} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import {saveShippingAddress} from '../actions/cartAction'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }

  return (
    <FormContainer>
    <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
         <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control type='text' 
                palceholder='Enter address'
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control type='text' 
                palceholder='Enter city'
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='postalcode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control type='text' 
                palceholder='Enter postal code'
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control type='text' 
                palceholder='Enter country'
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
                Continue
            </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
