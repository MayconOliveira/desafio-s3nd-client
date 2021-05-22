import React, {useState,useEffect} from 'react';
import '../App.css';
import axios from '../axiosinstance';
import { Redirect } from 'react-router'
import moment from "moment";
import 'moment/locale/pt-br';
import { useForm } from "react-hook-form";
import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

export default function Home() {
    
    const [state,setState] = useState({
        user_id:{
            name:'',
            email:''
        },
        support_id:{
            name:'',
            email:''
        },
        messages:[]
    });

    const {register, handleSubmit, errors,getValues,setValue } = useForm({
        defaultValues: {
            user:localStorage.getItem('id'),
        },
    });

    moment.locale('pt-br');

    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{
        /**
         * Conexao com PUSHER E LARAVEL ECHO
         */
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: '48d6d99ed220867e734f',
            cluster: 'us2',
            forceTLS: true
        });

        var channel = window.Echo.channel('message-1');
       
        channel.listen('.event-1', (data) => {
            load();
        });

        load()
    },[]);

    /**
     * Metodo responsavel por buscar as mensagem da conversa.
     */
    const load = () =>{
        var config = {
            headers:{
                Authorization: "Bearer " +  localStorage.getItem('token')
            }
        }
        axios.get('/conversation/index',config)
        .then(data => {
            setState(data.data)
        });
    }

    /**
     * Metodo responsável por encerrar o atendimento
     */
    const shutDown = () =>{
        var config = {
            headers:{
                Authorization: "Bearer " +  localStorage.getItem('token')
            }
        }
        axios.post('/conversation/shutDown/'+state.id,{},config)
        .then(data => {
            if(data.data.status == 1){
                setRedirect(true)
            }
        });
    }
    
    /**
     * Metodo responsável por enviar mensagem
     */
    const send = data =>{
        data['conversation'] = state.id;
        var config = {
            headers:{
                Authorization: "Bearer " +  localStorage.getItem('token')
            }
        }
        axios.post('/message',data,config)
        .then(data => {
            load()
        });
    }

    if(redirect == true){
        return <Redirect to='/'/>;
    }else{
        return(
            <div className="container">
                <div className="chat">
                    <div className="row" style={{paddingLeft:15,paddingRight:15}}>
                        <div className="col-md-12 chat-profile">
                            <div className="row">
                                <div className="col-md-9">


                                    <h6 style={{marginTop:8}}>Você está conversando com  {localStorage.getItem('support') == 1 ? state.user_id.name+" ("+state.user_id.email+")" : state.support_id.name+" ("+state.support_id.email+")"}</h6>
                                </div>
                                <div className="col-md-3">
                                    { localStorage.getItem('support') == 1 ? <button onClick={()=>shutDown()} className="btn btn-danger" style={{float:'right'}}>Encerrar atendimento</button> : <></>}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 chat-conversation">
                            <div className="chat-conversation-rl">
                            {
                                state.messages.map((value,index) => {
                                    return (
                                        <div className={"chat-c "+(localStorage.getItem('id') == value.user.id ? "chat-conversation-l" : "chat-conversation-r")}>
                                            <p><span style={{float:'left'}}>{moment(value.created_at).format('LT')}</span> <span style={{padding:6,backgroundColor:(localStorage.getItem('id') == value.user.id ? "#7a61d6" : "#20dff0"),color:'#fff',borderRadius:6,marginLeft:10,marginRight:10}}>{(localStorage.getItem('id') == value.user.id ? "Você" : value.user.name)}</span> {value.description}</p>
                                        </div> 
                                    )                                  
                                })
                            }
                            </div>
                        </div>
                    </div>
                    <div className="chat-filds">
                        <form onSubmit={handleSubmit(send)} >
                            <div className="row">
                                <div className="col-md-11">
                                    <textarea {...register("description", { required: true })} className="form-control" style={{marginTop:10,marginBottom:10}}></textarea>
                                </div>
                                <div className="col-md-1">
                                    <button className="btn btn-primary btn-send" ><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}