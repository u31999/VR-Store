import Header from "./components/Header";
import Footer from "./components/Footer";
import {Container} from 'react-bootstrap';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
         <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id" element={<CartScreen />} />
            <Route path="/cart/" element={<CartScreen />} />
            <Route path="/" element={<HomeScreen />} />
         </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
