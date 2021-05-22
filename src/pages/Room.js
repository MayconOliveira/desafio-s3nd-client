import React, {useState,useEffect} from 'react';
import '../App.css';
import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

export default function Room() {

    

    return(
        <div className="container">
            <div className="room">
                <h5>Aguardando para atendimento</h5>
            </div>
        </div>
    );   
}