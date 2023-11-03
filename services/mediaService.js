const Media = require("../model/mediaModel");

// fsp service 
class MediaService{
    async addMedia(data){
        return await Media(data).save();
    }
    async getAllMedia({userId,fspId}){
        if(fspId){
            return await Media.find({
                $or:[
                    {$and:[
                        {
                            fspId:fspId
                        },{
                            $or:[
                                {private:true},
                                {private:false}
                            ]
                        }
                    ]
                },
                {
                    $and : [
                        {fspId:{$ne:fspId}},
                            {private:false}
                    ]
                }
                ]

            },);
        }else{
            return await Media.find({private:false})
        }
    }
}


module.exports = new MediaService();