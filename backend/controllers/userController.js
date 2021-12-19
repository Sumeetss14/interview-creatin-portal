const connection = require("../database")
const {promisify} = require("util");

const query = promisify(connection.query).bind(connection);

exports.getAllUsers = async (req, res) => {
    try {
    const queryGetAllUser = `SELECT username, email, id, role FROM user`;
    const rowAllUser = await query(queryGetAllUser);

    res.status(200).json({
        status: "success",
        data: rowAllUser
    })
} catch(err) {
    res.status(400).json({
        status:"failed",
        message: err.message
    })
}
}