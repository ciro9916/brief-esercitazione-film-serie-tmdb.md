import { chiamataApi } from "./api.js"
import { reportTreFilm, reportEpisodi } from "./logic.js"

const main = async () => {
    const spettacoli = await chiamataApi()

    const report1 = reportTreFilm(spettacoli)
    const report2 = await reportEpisodi(report1.all_time.classifica)

    console.log(JSON.stringify(report1, null, 2))
    console.log(JSON.stringify(report2, null, 2))
}

main()