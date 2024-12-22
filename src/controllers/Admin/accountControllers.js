const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../../utils/listValues');
const bcryptjs = require('bcryptjs')

class AccountController {
    async getAccount(req, res, next) {
        try {
            const data = await db.Account.findAll(
                {
                    include: [
                        {
                            model: db.ListValues,
                            as: 'role',
                            attributes: ['ele_name', 'ele_id'],
                            where: {
                                list_id: { [Op.col]: 'Account.list_role_id' },
                            },
                            required: true
                        },
                        
                    ],
                    where: {
                        role_id: {
                            [Op.ne]: ROLES.S_ADMIN
                        }
                    },
                    attributes: ['id', 'username', 'email', 'password']
                }
            )
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    async createNewAccount(req, res, next) {
        const {username, email, password, role} = req.body
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);
        try {
            const isAccountExist = await db.Account.findOne({
                where: {
                    [Op.or]: [ { username }, { email } ]
                }
            })

            if(isAccountExist) {
                return res.status(409).json({
                    msg: 'Account has already existed'
                })
            }
            const data = await db.Account.create({ username, email, password:hashedPassword, list_role_id: ROLES.ID, role_id: role });
            res.json(data)
        } catch (error) {
            next(error)
        }        
    }
    async updateAccount(req, res,next) {
        const {username, role, password} = req.body
        const {id} = req.params
        try {

            const isAccountExist = await db.Account.findOne({
                where: {
                    [Op.and]: [
                        {username},
                        {id: {
                            [Op.ne] : id
                        }}
                    ]
                }
            })

            if(isAccountExist) {
                return res.status(409).json({
                    msg: 'Account has already existed'
                })
            }

            let hashedPassword
            const formData = {username, role_id: role}
            if(password) {
                const salt = bcryptjs.genSaltSync(10);
                hashedPassword = bcryptjs.hashSync(password, salt);
                formData.password = hashedPassword
            }
            const data = await db.Account.update(
               formData,
                { where: {
                    id
                } }
            )

            res.json(data)
        } catch (error) {
            next(error)
        }
        
    }

    async deleteAccount(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.Account.destroy({
                where: {
                  id,
                },
              });
            res.json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccountController()