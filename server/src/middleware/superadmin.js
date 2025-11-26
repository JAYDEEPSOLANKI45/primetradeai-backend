const superadmin = async (req,res,next) => {
    if (!req.user || !(req.user.role==="super-admin"))
        return res.status(403).json({message:"Unauthorized"});
    next();
}

module.exports = superadmin;