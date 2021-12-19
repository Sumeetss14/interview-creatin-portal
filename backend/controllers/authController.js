const connection = require("../database")
const {promisify} = require("util")

const query = promisify(connection.query).bind(connection);

exports.authenticate = async (req, res, next) => {
    try {
    console.log(req.query);
    const {username, pass} = req.query;
    if(!username || !pass)
        throw new Error("Username or Password is not found.");
    
        const q = `SELECT * FROM user WHERE username="${username}" AND pass="${pass}"`;

        const rows = await query(q);
        if(rows.length<1)    throw new Error("Username or password is incorrect.")
            req.user = rows[0];
        
            console.log(req.user)
            next();

    } catch(err) {
        res.status(401).json({
            status: "failed",
            data: err.message
        })
    }
};

exports.protect = (role) => {
    return (req, res, next) => {
        if(!req.user || req.user.role !== role)
            return res.status(401).json({
                status: "failed",
                data: `Only ${role} can access this route`
            })

        console.log('I;m protected');
        next();
    }
}