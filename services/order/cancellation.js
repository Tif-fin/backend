const Cancellation = require("../../model/cancellations");


class CancellationServie {

    async getCancellationByOrderId({orderId}){
        return await Cancellation.find({orderId})
    }


}
const CancellationS = new CancellationServie()

module.exports = CancellationS;