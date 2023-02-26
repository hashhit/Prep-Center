
const homeController = require('../app/http/controllers/homeController')
const authControllers = require('../app/http/controllers/authControllers')
const cartController = require('../app/http/controllers/Customers/cartController')
const placementController = require('../app/http/controllers/Customers/placementController')

const AdminPlacementController = require('../app/http/controllers/admin/placementController')
const statusController = require('../app/http/controllers/admin/statusController')

// Middlewares
const auth = require('../app/http/middlewares/auth')
const guest = require('../app/http/middlewares/guest')
const admin = require('../app/http/middlewares/admin')


function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login', guest, authControllers().login)




    app.get('/contact',(req,res)=>{
        res.render('contact')
        
    })



    app.post('/login', authControllers().postLogin)
    app.get('/register', guest, authControllers().register)
    app.post('/register', authControllers().postRegister)
    // app.post('/logout',authControllers().logout)
    app.post('/logout', function (req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/login');
        });
    });
    

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

// Customer Routes
    app.post('/orders',auth,placementController().store)
app.get('/Customer/placements',auth,placementController().index)
app.get('/Customer/placements/:id',auth,placementController().show)

// Admin routes

app.get('/admin/placements',admin,AdminPlacementController().index)

app.post('/admin/order/status',admin,statusController().update)

}


module.exports = initRoutes

