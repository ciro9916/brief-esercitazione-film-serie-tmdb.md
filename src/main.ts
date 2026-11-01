import {chiamataApi} from "./api.js"
import type {Show} from "./type.js"
import {ordina3FilmMax,reportTreFilm,reportEpisodi} from "./logic.js"

const main = async() =>{
      const spettacoli:Show[]=await chiamataApi()

      const lista1=ordina3FilmMax(spettacoli,true)
      const lista2=ordina3FilmMax(spettacoli,false)

      console.log(reportTreFilm(spettacoli))

      console.log(reportEpisodi(lista1))
      console.log(reportEpisodi(lista2))

}

