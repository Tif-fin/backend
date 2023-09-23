
exports.ipAddress = (req,res,next)=>{
    console.log(req);
    const ip = req.headers['x-real-ip']
    || req.headers['x-forwarded-for']
    ||req.headers['cf-connecting']
    || req.socket.remoteAddress
    ||'';
    req.ipAddress = ip;
    next()
}