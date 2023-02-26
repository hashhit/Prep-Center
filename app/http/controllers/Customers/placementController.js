const Placement = require('../../../models/placement')
const moment = require('moment')

function placementController() {
    return {
        store(req, res) {
            //validate request
            const { phone, address } = req.body
            if (!phone || !address) {
                req.flash('error', "All fields are required")
                return res.redirect('/cart')
            }
            const placement = new Placement({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            placement.save().then(result => {
                Placement.populate(result, { path: 'customerId' }, (err, placedOrder) => {

                    req.flash('info', 'Order placed Successfully')
                    delete req.session.cart
                    //Emit 
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)

                    return res.redirect('/Customer/placements')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong')
            })
            
        },
        async index(req, res) {
            const placements = await Placement.find({ customerId: req.user._id }, null,
                { sort: { 'createdAt': -1 } })

            res.render('Customer/placements', { placements: placements, moment: moment })


        },
        async show(req, res) {
            const order = await Placement.findById(req.params.id)
            // Authorize user 
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('Customer/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }

}


module.exports = placementController