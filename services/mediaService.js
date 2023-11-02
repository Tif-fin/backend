const Media = require("../model/mediaModel");

// fsp service 
class MediaService{
    async addMedia(data){
        return await Media(data).save();
    }
}


module.exports = new MediaService();