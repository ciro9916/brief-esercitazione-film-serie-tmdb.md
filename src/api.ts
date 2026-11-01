import type {Show,Episodio} from "./type.js"


export const chiamataApi= async ():Promise<Show[]> => {
    const dati = await fetch("https://api.tvmaze.com/shows")

    if(!dati.ok)
        throw new Error("errore api");

    return await dati.json()
        
}

export const stampaEpisodi = async (id:number):Promise<Episodio[]> =>{
    const dati = await fetch("https://api.tvmaze.com/shows/"+id+"/episodes")

    if(!dati.ok)
        throw new Error("errore api");

    return await dati.json()
}