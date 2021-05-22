import React,{useState,useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Template from './Template';
import Login from './pages/Login';
import Home from './pages/Home';
import axios from './axiosinstance';
import Room from './pages/Room';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
      <Route
        {...rest}
        render={props =>
          authenticated === true ? (
            <Template {...props} {...rest} Component={Component} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
  );
}

export default function App() {
  const [authenticated,setAuthenticated] = useState(true);

  useEffect(() => {
    var config = {
      headers:{
        Authorization: "Bearer " +  localStorage.getItem('token')
      }
    }
    axios.get('/check',config)
    .then(data => {
      if(data.data == true){
        setAuthenticated(true);
      }else{
        setAuthenticated(true);
      }
    });
  },[])

  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <PrivateRoute exact path="/home" component={Home} authenticated={authenticated}  />
      <PrivateRoute exact path="/room" component={Room} authenticated={authenticated}  />
    </BrowserRouter>
  );
}