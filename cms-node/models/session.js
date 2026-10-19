module.exports = (sequelize, D) => sequelize.define('session', {token_hash: {type: D.STRING(64), primaryKey:true}, user_id: D.INTEGER, expires_at: D.DATE}, {freezeTableName:true,timestamps:false})
