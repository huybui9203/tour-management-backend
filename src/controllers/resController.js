const db = require('../models')
class ResController {
    //[GET] /restaurants
    async getAll(req, res) {
        try {
            const data = await db.Restaurant.findAll()
            
            return res.status(200).json(data)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ResController();