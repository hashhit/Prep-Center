const Order=require('../../models/order')

function homeController(){
    return{
        index (req,res){
            Order.find().then(function(Order){
                return res.render('home',{PrepCenter:Order})
            })

        }
    }

}


module.exports = homeController

