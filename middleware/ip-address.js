
exports.ipAddress = (req,res,next)=>{
    const ip = req.headers['x-real-ip']
    || req.headers['x-forwarded-for']
    ||req.headers['cf-connecting']
    || req.socket.remoteAddress
    ||'';
    req.ipAddress = ip;
    next()
}