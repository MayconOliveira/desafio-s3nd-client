import React, {useState} from 'react';
import '../App.css';
import axios from '../axiosinstance';
import { useForm } from "react-hook-form";
import { Redirect } from 'react-router'

export default function Login() {
    const {register, handleSubmit, errors,getValues,setValue } = useForm();
    const [bottonLoading,setBottonLoading] = useState(false);
    const [redirect,setRedirect] = useState(0);

    const login = data =>{
        setBottonLoading(true);
        axios.post("/login",data)
        .then(data =>{
            if(data.data.access_token){
                localStorage.setItem('token', data.data.access_token);
                localStorage.setItem('support', data.data.support);
                localStorage.setItem('id', data.data.id);
                init();
            }
            setBottonLoading(false);
        });
    }

    const init = () => {
        var config = {
            headers:{
                Authorization: "Bearer " +  localStorage.getItem('token')
            }
        }
        axios.get('/conversation/init',config)
        .then(data => {
            if(data.data.status == 1){
                setRedirect(1);
            }else{
                setRedirect(2);
            }
        });
    }

    switch (redirect) {
        case 1:
            return <Redirect to='/home'/>;
        case 2:
            return <Redirect to='/home'/>;
        default:
            return(
                <div className="app">
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col col-lg-4">
                                <div className="card" style={{marginTop:60,flex:1,padding:50}}>
                                    <div className="card-body">
                                        <div >
                                            <header className="login-logo">
                                                <img src="https://s3nd.com.br/institucional/images/s3nd/s3nd-logo.png"/>
                                                <h6>Precisa de ajuda?</h6>
                                            </header>
    
                                            <form onSubmit={handleSubmit(login)} >
                                                <div className="form-group">
                                                    <label>Nome:</label><br/>
                                                    <input {...register("name", { required: true })}  className="form-control" name="name"/>
                                                </div>
                                                <div className="form-group" style={{marginTop:10}}>
                                                    <label>E-mail:</label><br/>
                                                    <input {...register("email", { required: true })} className="form-control" name="email" type="email" />
                                                </div>
                                                <div className="form-group">
                                                    <button className="btn btn-primary btn-block" style={{width:'100%',marginTop:20,background:'#20dff0',borderColor:'#20dff0'}}>
                                                        {bottonLoading ? 'Entrando...' : 'Entrar'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>            
                </div>
            );
    }
};