

class AnalyticsService{

    orderAnalytics = (fspId)=>{
        const fspId = mongoose.Types.ObjectId(fspId); 
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Aggregation pipeline to get the order count for each day
        Order.aggregate([
          {
            $match: {
              fspId: fspId,
              createdAt: { $gte: thirtyDaysAgo, $lte: new Date() }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              orderCount: { $sum: 1 }
            }
          },
          {
            $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
          }
        ])
        .exec((err, result) => {
          if (err) {
            console.error('Error aggregating order count:', err);
          } else {
            console.log('Order count grouped by day:', result);
          }
        });
    }

}

const AnalyticsS = new AnalyticsService()
module.exports = AnalyticsS;