const AnalyticsS = require("../services/analytics/analytics.service");


class AnalyticsController{

    orderAnalytics = (req,res)=>{
        const {fspId} = req.parms;
        AnalyticsS.orderAnalytics(fspId)
     }


}
const AnalyticsC = new AnalyticsController();

module.exports = AnalyticsC;