const Placement = require("../../../models/placement")
const placement = require("../../../models/placement")


function placementController() {
    return {
        index(req, res) {
            placement.find({ status: { $ne: 'delivered' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, placements) => {
                if (req.xhr) {
                    return res.json(placements)
                } else {
                    res.render('admin/placements')
                }

            })
        }
    }
}
module.exports = placementController
