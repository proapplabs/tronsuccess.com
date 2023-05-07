
import { vi } from '@utils/visitor';
export default async function handler(req, res) {
    /*
    var start = new Date("02/05/2013");
    var end = new Date("02/10/2013");

    let dates = {}

    var loop = new Date(start);
    while (loop <= end) {
        // alert(loop);

        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
        dates = { ...dates, loop }
    }
    */
    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(2023, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
        daysOfYear.push(new Date(d));
    }


    // const aa = vi(req);
    res.status(200).json({
        // aa
        daysOfYear
    });
} 