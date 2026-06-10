const cron = require("cron");
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function(){
    https
    .get(process.env.API_URL, (res) => {
        if(res.statusCode === 200){
            console.log("OK");
        }else{
            console.log("Error");
        }
    })
    .on("error", (e) => {
        console.log("Error", e);
    });
});

export default job;