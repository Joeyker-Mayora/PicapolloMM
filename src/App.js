import RealizarPedido from "./pages/RealizarPedido";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PedidoForm from "./pages/PedidoForm"
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer";
import PedidoResumen from "./pages/PedidoResumen"



const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<RealizarPedido/>} />
        <Route path="/form" element={<PedidoForm/>} />
        <Route path="/resumen" element={<PedidoResumen/>} />


      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer/>
    </BrowserRouter>
  );
};

export default App;
