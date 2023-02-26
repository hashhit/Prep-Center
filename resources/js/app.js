import axios from "axios"
import moment from "moment"
import Noty from 'Noty'
import { initAdmin }  from './admin'


let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector("#cartCounter")

function updateCart(prep) {
    axios.post('/update-cart', prep).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'info',
            timeout:600,
            text: 'Item added to cart',
            progressBar:false
        }).show();

    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout:600,
            text: 'Something went wrong',
            progressBar:false
        }).show();

    })

}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let prep = JSON.parse(btn.dataset.prep)
        updateCart(prep)

    })
})
// Removing alert message after X second
const alertMsg = document.querySelector('#success-alert')
if (alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line')

let hiddenInput = document.querySelector('#hiddenInput')

let order = hiddenInput ? hiddenInput.value: null
console.log(order)

order = JSON.parse(order)
let time  = document.createElement('small')




function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp===order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                        status.nextElementSibling.classList.add('current')

            }
        }
        
    })

}


updateStatus(order);


// Socket
// let socket = io("http://localhost:3000/", {
//   transports: ["websocket"]
// });
let socket = io('http://localhost:3000/')



// Join
if(order){
socket.emit('join',`order_${order._id}`)
}


let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')

}


socket.on('orderUpdated',(data)=>{
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'info',
        timeout:600,
        text: 'Order updated',
        progressBar:false
    }).show();

})

