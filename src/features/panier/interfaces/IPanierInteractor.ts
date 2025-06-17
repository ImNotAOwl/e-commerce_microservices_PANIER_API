import { Panier } from "../entity/Panier";

export interface IPanierInteractor{
    getPanier(user: string | undefined): any;
    addPanier(body: Panier): any;
    deletePanier(user: string | undefined): any;
    removeArticleFromPanier(user: string | undefined, article: string | undefined, removeArticle: boolean) : any;
}