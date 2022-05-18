import React from "react";
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Products from "./components/homepage/products/Products"
import Cart from "./components/homepage/cart/Cart"
import Register from "./components/homepage/auth/Register"
import NotFound from "./components/homepage/utils/NotFound/NotFound"
import DetailProduct from "./components/homepage/detailProduct/DetailProduct";
import { DataProvider } from "./GlobalState";
import MenuPage from "./components/homepage/menu/MenuPage";
import Login from "./components/homepage/auth/Login";
import Orderhistory from "./components/homepage/history/OrderHistory";
import Orderdetail from "./components/homepage/history/OrderDetail";
import Ordermanage from "./components/homepage/admin/Order/OrderManage";
import ProductsManagement from "./components/homepage/admin/Products/ProductsManagement";
import Profile from "./components/homepage/Profile/Profile";
import StoryManagement from "./components/homepage/admin/Story/StoryManagement";
import Stories from './components/homepage/stories/Stories'
import DetailStory from "./components/homepage/detailStory/DetailStory";
import MegaMenu from './components/header/MegaMenu'
import Chat from "./components/homepage/chat/chat";
import UserManagement from "./components/homepage/admin/User/UserManagement";
import StoriesPage from "./components/homepage/stories/storiesPage";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from "./components/footer/footer";
import Tra from "./components/homepage/products/Tra";
import Coffee from "./components/homepage/products/Coffee";

const theme = createTheme({
  palette: {
    primary:{
      main: '#e46c04',
    },
  },
})
function App() {
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <Router>
          <Routes>
            <Route path='/login' element={
                <Login/>
            } />
            <Route path='/register' element={
                <Register/>
            } />
            <Route path='/' element={
              <div className="App">
                <MegaMenu />
                <Products/>
                <Stories />
                <Footer />
              </div>
            } />
            <Route path='/tra-tai-nha' element={
              <div className="App">
                <MegaMenu />
                <Tra />
                <Footer />
              </div>
            } />
            <Route path='/ca-phe-tai-nha' element={
              <div className="App">
                <MegaMenu />
                <Coffee />
                <Footer />
              </div>
            } />
            <Route path='/products' element={
              <div className="App">
                <MegaMenu />
                <MenuPage />
                <Footer />
              </div>
            } />
            <Route path='/stories' element={
              <div className="App">
                <MegaMenu />
                <StoriesPage />
                <Footer />
              </div>
            } />
            <Route path='/chat' element={
              <div className="App">
                <Chat />
                <Footer />
              </div>
            } />
            <Route path='/detail/:id' element={
              <div className="App">
                <MegaMenu />
                <DetailProduct/>
                <Footer />
              </div>
            } />
            <Route path='/detail/story/:id' element={
              <div className="App">
                <MegaMenu />
                <DetailStory />
                <Footer />
              </div>
            } />
            <Route path='/cart' element={
              <div className="App">
                <Cart/>
                <Footer />
              </div>
            } />
            <Route path='/history' element={
              <div className="App">
                <Orderhistory />
              </div>
            } />
            <Route path='/history/:id' element={
              <div className="App">
                <Orderdetail />
              </div>
            } />
            <Route path='/order_management' element={
              <div className="App">
                <Ordermanage/>
              </div>
            } />
            <Route path='/products_management' element={
              <div className="App">
                <ProductsManagement />
              </div>
            } />
            <Route path='/profile' element={
              <div className="App">
                <Profile />
              </div>
            } />
            <Route path='/story_management' element={
              <div className="App">
                <StoryManagement />
              </div>
            } />
            <Route path='/user_management' element={
              <div className="App">
                <UserManagement />
              </div>
            } />
            <Route path='*' element={
              <div className="App">
                <NotFound/>
              </div>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
