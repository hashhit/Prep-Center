const Order =require('../../../models/placement')
function statusController(){
    return{
        update(req,res){
            Order.updateOne({_id:req.body.orderId},{status: req.body.status},(err,data)=>{
                if(err){
                    
                    return res.redirect('/admin/placements')
                }
                //Emit events
                const eventEmitter =req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated',{id:req.body.orderId,status: req.body.status})
                        
                return res.redirect('/admin/placements')

            })


        }
    }
}

module.exports=statusController
